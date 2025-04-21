const AWS = require("aws-sdk");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");
const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const FILE_KEY = "Servicios.xlsx";

AWS.config.update({ region: REGION });
const s3 = new AWS.S3();

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async function (event) {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: "Método no permitido. Usa POST." }),
        };
    }

    const { IdServicio } = JSON.parse(event.body || "{}");

    if (!IdServicio) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Falta el campo IdServicio" }),
        };
    }

    try {
        // Descargar archivo desde S3
        const file = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const workbook = xlsx.read(file.Body);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Filtrar eliminando por IdServicio
        const actualizados = data.filter(row => row.IdServicio !== IdServicio);

        // Crear nuevo Excel
        const newSheet = xlsx.utils.json_to_sheet(actualizados);
        const newWorkbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(newWorkbook, newSheet, sheetName);
        const buffer = xlsx.write(newWorkbook, { bookType: "xlsx", type: "buffer" });

        // Subir archivo actualizado
        await s3
            .putObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: buffer,
                ContentType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            .promise();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: "Servicio eliminado correctamente" }),
        };
    } catch (error) {
        console.error("❌ Error al eliminar servicio:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Error al eliminar servicio" }),
        };
    }
};
