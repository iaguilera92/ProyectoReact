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

        const {
            idCliente,
            revertir = false,
            suscripcion = false,
            tbk_user = "",
            tarjeta = "",
            tipo_tarjeta = "",
        } = body;

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

        // Normalizar claves
        const normalizarClave = (obj) =>
            Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));

        let modificado = false;
        const hoy = new Date().toISOString().split("T")[0];

        const nuevosDatos = datos.map((rowOriginal) => {
            const row = normalizarClave(rowOriginal);
            const rowId = String(row.idcliente ?? "").trim();
            const targetId = String(idCliente).trim();

            if (rowId === targetId) {
                modificado = true;
                console.log("🧩 Cliente encontrado:", rowId);

                const actualizado = { ...rowOriginal };

                // ✅ Actualizar pagos normales
                actualizado.pagado = revertir ? 0 : 1;
                actualizado.fechaPago = revertir ? "" : hoy;

                // ✅ Actualizar suscripción (solo si se indica)
                if (typeof suscripcion !== "undefined") {
                    actualizado.Suscripcion = suscripcion ? 1 : 0;
                }

                // ⚙️ Validar campos sensibles: solo escribir si están vacíos
                if (tbk_user && !row.tbk_user) actualizado.tbk_user = tbk_user;
                if (tarjeta && !row.tarjeta) actualizado.tarjeta = tarjeta;
                if (tipo_tarjeta && !row.tipo_tarjeta) actualizado.tipo_tarjeta = tipo_tarjeta;

                return actualizado;
            }

            return rowOriginal;
        });

        if (!modificado) {
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Cliente no encontrado" }),
            };
        }

        // Asegurar que existan las columnas nuevas
        const columnasNecesarias = ["Suscripcion", "tbk_user", "tarjeta", "tipo_tarjeta"];
        nuevosDatos.forEach((row) => {
            columnasNecesarias.forEach((col) => {
                if (typeof row[col] === "undefined") row[col] = "";
            });
        });

        // Guardar Excel actualizado
        const nuevaHoja = XLSX.utils.json_to_sheet(nuevosDatos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        await s3
            .putObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: buffer,
                ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            .promise();

        console.log("✅ Archivo actualizado correctamente con validación de campos sensibles");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Cliente actualizado correctamente (Suscripción y enrolamiento seguros)",
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
