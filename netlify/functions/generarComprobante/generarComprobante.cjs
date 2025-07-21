const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({ region: "us-east-2" });

exports.handler = async (event) => {
    const isDev = process.env.NETLIFY_DEV === "true" || process.env.NODE_ENV !== "production";

    // 🔹 Manejar preflight CORS
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            },
            body: "OK",
        };
    }

    try {
        console.log("🧪 Modo:", isDev ? "Desarrollo (puppeteer)" : "Producción (chrome-aws-lambda)");

        const puppeteer = isDev ? require("puppeteer") : require("puppeteer-core");
        const chromium = isDev ? null : require("chrome-aws-lambda");

        const { cliente, mes } = JSON.parse(event.body || "{}");

        const templatePath = path.join(process.cwd(), "public", "plantilla_boleta.html");
        const plantilla = fs.readFileSync(templatePath, "utf8");
        const codigoBarra = Math.floor(10000000 + Math.random() * 90000000).toString();

        const contenidoHTML = plantilla
            .replace(/{{nombre}}/g, cliente.cliente || "Cliente")
            .replace(/{{sitioWeb}}/g, cliente.sitioWeb || "sitioweb.cl")
            .replace(/{{fechaPago}}/g, new Date().toLocaleDateString("es-CL"))
            .replace(/{{mes}}/g, mes || "Julio")
            .replace(/{{montoPagado}}/g, cliente.valor || "$10.000")
            .replace(/{{numeroBoleta}}/g, Math.floor(100000 + Math.random() * 900000))
            .replace(/{{montoEnLetras}}/g, "Diez mil pesos")
            .replace(/{{qrUrl}}/g, "https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=www.plataformas-web.cl")
            .replace(/{{barcodeUrl}}/g, `https://barcode.tec-it.com/barcode.ashx?data=${codigoBarra}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&modulewidth=1.2&height=25&fontheight=0&text=false`)
            .replace(/{{codigoBarra}}/g, codigoBarra);

        const browser = await puppeteer.launch(
            isDev
                ? {
                    headless: "new",
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                }
                : {
                    args: chromium.args,
                    executablePath: await chromium.executablePath,
                    headless: chromium.headless,
                    defaultViewport: chromium.defaultViewport,
                }
        );


        const page = await browser.newPage();
        await page.setContent(contenidoHTML, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4" });
        await browser.close();

        await s3
            .putObject({
                Bucket: "plataformas-web-buckets",
                Key: "comprobantes/comprobante-pago.pdf",
                Body: pdfBuffer,
                ContentType: "application/pdf",
                ACL: "public-read",
            })
            .promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ ok: true }),
        };
    } catch (error) {
        console.error("❌ Error al generar comprobante:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error interno del servidor", detalle: error.message }),
        };
    }
};
