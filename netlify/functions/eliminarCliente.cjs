const AWS = require("aws-sdk");
const XLSX = require("xlsx");
require("dotenv").config();

// 🪣 Configuración base
const BUCKET_NAME = process.env.BUCKET_NAME || "plataformas-web-buckets";
const REGION = process.env.MY_AWS_REGION || "us-east-2";
const FILE_KEY = "Clientes.xlsx";

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
        console.log("📩 event.body recibido:", event.body);
        const body = JSON.parse(event.body || "{}");
        const { sitioWeb } = body;

        if (!sitioWeb) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta el campo sitioWeb" }),
            };
        }

        // 📥 Leer archivo desde S3
        console.log("📖 Leyendo archivo Clientes.xlsx desde S3...");
        const s3Data = await s3
            .getObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
            })
            .promise();

        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        console.log(`📊 Registros actuales: ${datos.length}`);

        // 🔍 Buscar cliente por sitioWeb (ignorando mayúsculas/minúsculas)
        const index = datos.findIndex(
            (c) => c.sitioWeb?.toLowerCase() === sitioWeb.toLowerCase()
        );

        if (index === -1) {
            console.warn(`⚠️ Cliente con sitioWeb "${sitioWeb}" no encontrado.`);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: `No se encontró cliente con sitioWeb "${sitioWeb}"`,
                }),
            };
        }

        const eliminado = datos.splice(index, 1)[0];
        console.log("🗑️ Cliente eliminado:", eliminado);

        // 📤 Convertir nuevamente a Excel
        const nuevaHoja = XLSX.utils.json_to_sheet(datos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        // ⏫ Subir archivo actualizado
        console.log("⏫ Subiendo archivo actualizado a S3...");
        await s3
            .putObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: buffer,
                ContentType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            .promise();

        console.log("✅ Eliminación completada exitosamente");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: `Cliente eliminado correctamente (${sitioWeb})`,
                eliminado,
            }),
        };
    } catch (error) {
        console.error("❌ Error al eliminar cliente:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Error interno al eliminar cliente",
                error: error.message,
            }),
        };
    }
};
