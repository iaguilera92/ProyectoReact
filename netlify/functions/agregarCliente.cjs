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
        const {
            nombreCliente,
            sitioWeb,
            URL,
            telefono,
            correo,
            pagado,
            valor,
            estado,
            logoCliente,
        } = body;

        // 🧱 Validaciones mínimas
        if (!nombreCliente || !sitioWeb || !URL || !telefono || !correo) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Faltan campos requeridos para crear el cliente",
                }),
            };
        }

        // 📥 Leer Excel desde S3
        console.log("📖 Leyendo archivo desde S3...");
        const s3Data = await s3
            .getObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
            })
            .promise();

        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

        // 🧮 Obtener el último ID
        let nuevoId = 1;
        if (datos.length > 0) {
            const idsValidos = datos
                .map((d) => parseInt(d.idCliente))
                .filter((id) => !isNaN(id));
            nuevoId = idsValidos.length > 0 ? Math.max(...idsValidos) + 1 : 1;
        }

        console.log(`🆔 Próximo idCliente: ${nuevoId}`);

        // 🧾 Nueva fila (cliente)
        const nuevoCliente = {
            idCliente: nuevoId,
            cliente: nombreCliente,
            sitioWeb: sitioWeb,
            URL: URL,
            telefono: telefono,
            correo: correo,
            pagado: pagado ?? 0,
            valor: valor || "$10.000",
            fechaPago: new Date().toISOString().split("T")[0], // interno, auto generado
            estado: estado ?? 1,
            logoCliente: logoCliente || "",
        };

        datos.push(nuevoCliente);
        console.log("🆕 Cliente agregado:", nuevoCliente);

        // 📤 Convertir nuevamente a Excel
        const nuevaHoja = XLSX.utils.json_to_sheet(datos);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });

        // ⏫ Subir a S3
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

        console.log("✅ Cliente agregado correctamente en Clientes.xlsx");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Cliente agregado correctamente",
                cliente: nuevoCliente,
            }),
        };
    } catch (error) {
        console.error("❌ Error al agregar cliente:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Error interno al guardar cliente",
                error: error.message,
            }),
        };
    }
};
