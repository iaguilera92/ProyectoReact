const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const FILE_KEY = "Servicios.xlsx";
const LOCAL_PATH = path.resolve(__dirname, "../../public/database/Servicios.xlsx");

AWS.config.update({ region: REGION });
const s3 = new AWS.S3();

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

exports.handler = async function (event, context) {
    console.log("📥 Petición recibida en restaurarServicios.cjs");

    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: "OK",
        };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: "Método no permitido. Usa POST." }),
        };
    }

    try {
        if (!fs.existsSync(LOCAL_PATH)) {
            console.error("❌ Archivo local no encontrado en:", LOCAL_PATH);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: "Archivo local no encontrado" }),
            };
        }

        const buffer = fs.readFileSync(LOCAL_PATH);

        await s3
            .putObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: buffer,
                ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            .promise();

        console.log("✅ Excel restaurado exitosamente desde local a S3");

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Restauración exitosa" }),
        };
    } catch (error) {
        console.error("Error al restaurar servicios:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Error interno del servidor" }),
        };
    }
};
