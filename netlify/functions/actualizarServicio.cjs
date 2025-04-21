const AWS = require("aws-sdk");
const XLSX = require("xlsx");
require('dotenv').config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.AWS_REGION || "us-east-1";
const FILE_KEY = "Servicios.xlsx";

AWS.config.update({ region: REGION });
const s3 = new AWS.S3();

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
    console.log("📥 Petición recibida en actualizarServicio.js");

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Método no permitido. Usa POST." }),
        };
    }

    if (!event.body) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Falta el body" }),
        };
    }

    try {
        const { servicio } = JSON.parse(event.body);
        const idServicio = servicio.IdServicio;

        if (!idServicio || !servicio.title) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta el IdServicio o título" }),
            };
        }

        console.log("✅ Servicio recibido:", servicio.title, "-", idServicio);

        const s3Data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja);

        // 🔁 Filtrar todas las filas que no correspondan al IdServicio
        const filtrados = datos.filter(row => row["IdServicio"] !== idServicio);

        const nuevosRows = servicio.sections.map(section => ({
            "IdServicio": idServicio,
            "Orden": servicio.orden || 0,
            "Service Title": servicio.title,
            "Service Image": servicio.img,
            "Service Link": servicio.link || "",
            "Service Description": servicio.description,
            "Service Background": servicio.background,
            "Service Icon": servicio.iconName,
            "Section Title": section.title,
            "Section Description": section.description,
            "Section Image": section.image || "",
            "Section Items": section.items?.join("; ") || "",
        }));


        const actualizados = [...filtrados, ...nuevosRows];
        const nuevaHoja = XLSX.utils.json_to_sheet(actualizados);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;

        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: FILE_KEY,
            Body: buffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }).promise();

        if (servicio.eliminarItem && servicio.IdServicio) {
            const itemAEliminar = servicio.eliminarItem.trim().toLowerCase();
            console.log(`🗑️ Eliminando item "${itemAEliminar}" del servicio ${servicio.IdServicio}`);

            // Buscar y modificar solo las filas del servicio específico
            const modificados = datos.map(row => {
                if (row["IdServicio"] === servicio.IdServicio && row["Section Items"]) {
                    const items = row["Section Items"]
                        .split(";")
                        .map(i => i.trim())
                        .filter(i => i.toLowerCase() !== itemAEliminar);
                    return {
                        ...row,
                        "Section Items": items.join("; ")
                    };
                }
                return row;
            });

            const nuevaHoja = XLSX.utils.json_to_sheet(modificados);
            workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

            await s3.putObject({
                Bucket: BUCKET_NAME,
                Key: FILE_KEY,
                Body: buffer,
                ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }).promise();

            console.log("✅ Ítem eliminado correctamente del Excel");

            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Ítem eliminado exitosamente." }),
            };
        }

        console.log("✅ Excel actualizado correctamente por IdServicio");

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Servicio actualizado exitosamente por IdServicio." }),
        };
    } catch (error) {
        console.error("❌ Error al actualizar:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error al actualizar el servicio en S3" }),
        };
    }
};
