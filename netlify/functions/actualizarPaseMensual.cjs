const AWS = require("aws-sdk");
const XLSX = require("xlsx");
require("dotenv").config();

//IMPORTANTE: ESTO DEBE APUNTAR AL BUCKET DE PLATAFORMAS WEB
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.MY_AWS_REGION || "us-east-1";
const FILE_KEY = "PaseMensual.xlsx";

AWS.config.update({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// 🧹 misma normalización que en el helper
const normalizeHost = (v) =>
    String(v || "")
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\/.*$/, "")
        .replace(/:\d+$/, "")
        .trim();

// 📌 Campos de misiones + estados a resetear
const camposMisiones = [
    "CompartirAnuncio",
    "PagarSuscripcionAntes",
    "ConexionMensual",
    "VisitasMensual",
    "ConseguirCliente",
    "CompartirAnuncioEstado",
    "PagarSuscripcionAntesEstado",
    "ConexionMensualEstado",
    "VisitasMensualEstado",
    "ConseguirClienteEstado",
];


exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Método no permitido" }),
        };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const { SitioWeb, campo, valor } = body;

        if (!SitioWeb || !campo) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Faltan SitioWeb o campo" }),
            };
        }

        // Leer Excel desde S3
        const s3Data = await s3
            .getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY })
            .promise();
        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        const sitioNormalizado = normalizeHost(SitioWeb);
        console.log("🔍 Sitio buscado (normalizado):", sitioNormalizado);

        let modificado = false;
        let rowModificada = null;

        const nuevosDatos = datos.map((row, i) => {
            const rowHost = normalizeHost(row.SitioWeb);
            if (rowHost === sitioNormalizado) {
                console.log(`✅ Match encontrado en fila ${i + 2}:`, row.SitioWeb);
                modificado = true;

                let nuevaFila = { ...row };

                if (valor === 0 && camposMisiones.includes(campo)) {
                    // 🔄 Resetear TODOS los campos y estados a 0
                    camposMisiones.forEach((c) => {
                        nuevaFila[c] = 0;
                    });
                } else {
                    // 🔄 Caso normal: solo actualiza el campo recibido
                    nuevaFila[campo] = valor;
                }

                nuevaFila["FechaEdicion"] = new Date().toLocaleString("es-CL", {
                    timeZone: "America/Santiago",
                });

                rowModificada = nuevaFila;
                return nuevaFila;
            } else {
                if (i < 5) {
                    console.log(`⏭️ No match fila ${i + 2}:`, row.SitioWeb, "→", rowHost);
                }
            }
            return row;
        });

        if (!modificado) {
            console.warn("⚠️ No se encontró coincidencia para:", sitioNormalizado);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Sitio no encontrado" }),
            };
        }

        // Guardar en S3
        const nuevaHoja = XLSX.utils.json_to_sheet(nuevosDatos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: FILE_KEY,
            Body: buffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            CacheControl: "no-store, no-cache, must-revalidate, proxy-revalidate"
        }).promise();

        console.log(
            `💾 Actualización exitosa → ${campo}=${valor} para ${sitioNormalizado}`
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Celda ${campo} actualizada correctamente para ${SitioWeb}`,
                row: rowModificada, // 👈 devolvemos la fila afectada para debug
            }),
        };
    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error interno del servidor" }),
        };
    }
};
