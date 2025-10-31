const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
    // ✅ CORS
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: "OK",
        };
    }

    try {
        const { email, nombre, sitioWeb, idCliente } = JSON.parse(event.body || "{}");

        if (!email || !nombre || !idCliente)
            throw new Error("Faltan parámetros requeridos (nombre, email, idCliente)");

        const origin = event.headers.origin || "";
        const host = event.headers.host || "";
        const isLocal = origin.includes("localhost") || host.includes("localhost");
        const isOfficial = origin.includes("plataformas-web.cl");

        // ✅ Forzar integración en cualquier deploy temporal (netlify.app)
        const forceIntegration =
            !isLocal && !isOfficial && host.includes("netlify.app");

        // 🌍 Callback URL (aceptado por Transbank INT)
        const responseUrl = isOfficial
            ? "https://plataformas-web.cl/.netlify/functions/confirmarSuscripcion"
            : "http://localhost:8888/.netlify/functions/confirmarSuscripcion";

        const body = {
            username: nombre,
            email,
            response_url: responseUrl,
        };

        // 🔐 Credenciales INT (válidas en cualquier caso)
        const COMMERCE_CODE = "597055555541";
        const API_SECRET =
            "579B532A7440BB0C9079DED94D31EA161EB9A77A"; // versión conocida funcional

        console.log("➡️ Enviando OneClick:", body);
        console.log("🌐 Host:", host);
        console.log("🧭 isLocal:", isLocal, "| isOfficial:", isOfficial, "| forceIntegration:", forceIntegration);

        const endpoint = "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Tbk-Api-Key-Id": COMMERCE_CODE,
                "Tbk-Api-Key-Secret": API_SECRET,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const text = await response.text();
        console.log("⬅️ Respuesta cruda OneClick:", text);

        const data = JSON.parse(text || "{}");

        if (!data.token || !data.url_webpay)
            throw new Error("Respuesta incompleta desde OneClick");

        // 💾 Guardar token → cliente en S3
        const bucketName = "plataformas-web-buckets";
        const key = `tokens/${data.token}.json`;
        const info = {
            idCliente,
            nombre,
            email,
            sitioWeb,
            creado: new Date().toISOString(),
            entorno: isOfficial ? "PROD" : "INT",
        };

        await s3
            .putObject({
                Bucket: bucketName,
                Key: key,
                Body: JSON.stringify(info),
                ContentType: "application/json",
            })
            .promise();

        console.log(`💾 Cliente guardado en S3: ${key}`);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                token: data.token,
                url_webpay: data.url_webpay,
            }),
        };
    } catch (error) {
        console.error("❌ Error iniciando OneClick:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                error_message: error.message,
            }),
        };
    }
};
