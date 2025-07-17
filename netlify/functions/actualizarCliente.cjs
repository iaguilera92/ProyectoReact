const AWS = require("aws-sdk");
const XLSX = require("xlsx");
require("dotenv").config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.MY_AWS_REGION || "us-east-1";
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
        console.log("📦 event.body recibido:", event.body);

        const body = JSON.parse(event.body || "{}");
        const { idCliente, revertir = false } = body;

        if (!idCliente || (!Number.isInteger(idCliente) && typeof idCliente !== "string")) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta o es inválido el ID del cliente" }),
            };
        }

        // Leer Excel desde S3
        const s3Data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        console.log("📋 Lista de IDs:", datos.map(d => d.idCliente || d.idcliente));

        // Normalizar claves de columnas
        const normalizarClave = (obj) =>
            Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));

        // Buscar y modificar
        let modificado = false;
        const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const nuevosDatos = datos.map((rowOriginal) => {
            const row = normalizarClave(rowOriginal); // idcliente ahora está seguro en minúscula
            const rowId = String(row.idcliente ?? "").trim();
            const targetId = String(idCliente).trim();

            if (rowId === targetId) {
                modificado = true;
                console.log("🧪 Coincidencia encontrada:", rowId);
                return {
                    ...rowOriginal, // ← se aplica sobre el original
                    pagado: revertir ? 0 : 1,
                    fechaPago: revertir ? "" : hoy,
                };
            }

            return rowOriginal;
        });

        if (!modificado) {
            console.warn("⚠️ Cliente no encontrado:", idCliente);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Cliente no encontrado" }),
            };
        }

        // Subir a S3
        const nuevaHoja = XLSX.utils.json_to_sheet(nuevosDatos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        console.log("⏫ Subiendo archivo a S3...");
        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: FILE_KEY,
            Body: buffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }).promise();
        console.log("✅ Subida completada");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: revertir
                    ? "Pago revertido correctamente"
                    : "Cliente actualizado correctamente",
            }),
        };
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error interno del servidor" }),
        };
    }
};
