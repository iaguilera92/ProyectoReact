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
            suscripcion,
            tbk_user,
            tarjeta,
            tipo_tarjeta,
            cobroExitoso,
        } = body;

        if (!idCliente) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta el ID del cliente" }),
            };
        }

        // Leer Excel desde S3
        const s3Data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        const hoy = new Date().toISOString().split("T")[0];
        const entornoActual = process.env.CONTEXT = "PRODUCCION";

        let modificado = false;

        const nuevosDatos = datos.map((rowOriginal) => {
            const row = Object.fromEntries(Object.entries(rowOriginal).map(([k, v]) => [k.toLowerCase(), v]));
            const rowId = String(row.idcliente || "").trim();
            const targetId = String(idCliente).trim();

            if (rowId === targetId) {
                modificado = true;
                console.log("🧩 Cliente encontrado:", rowId);

                const actualizado = { ...rowOriginal };

                // ✅ PAGO (seguro)
                if (cobroExitoso === true || cobroExitoso === 1 || cobroExitoso === "1") {
                    actualizado.pagado = 1;
                    actualizado.fechaPago = hoy;
                } else if (revertir === true || revertir === 1 || revertir === "1") {
                    actualizado.pagado = 0;
                    actualizado.fechaPago = "";
                } else {
                    actualizado.pagado = row.pagado;
                    actualizado.fechaPago = row.fechapago || row.fechaPago || "";
                }

                // ✅ Suscripción
                if (typeof suscripcion !== "undefined") {
                    actualizado.Suscripcion = suscripcion ? 1 : 0;
                }

                // ✅ tbk_user
                if (typeof tbk_user !== "undefined" && tbk_user.trim() !== "") {
                    actualizado.tbk_user = tbk_user;
                    actualizado.entorno_tbk = entornoActual;
                }

                // ✅ Tarjeta
                if (typeof tarjeta !== "undefined" && tarjeta.trim() !== "") {
                    actualizado.tarjeta = tarjeta;
                }

                // ✅ Tipo tarjeta
                if (typeof tipo_tarjeta !== "undefined" && tipo_tarjeta.trim() !== "") {
                    actualizado.tipo_tarjeta = tipo_tarjeta;
                }

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

        // Guardar Excel
        const nuevaHoja = XLSX.utils.json_to_sheet(nuevosDatos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: FILE_KEY,
            Body: buffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }).promise();

        console.log("✅ Cliente actualizado correctamente.");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "OK" }),
        };
    } catch (error) {
        console.error("❌ Error al actualizar cliente:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error interno" }),
        };
    }
};
