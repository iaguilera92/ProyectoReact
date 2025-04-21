const AWS = require("aws-sdk");
const XLSX = require("xlsx");
require("dotenv").config(); // para local

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.MY_AWS_REGION || "us-east-1";
const FILE_KEY = "Servicios.xlsx";

if (process.env.MY_AWS_ACCESS_KEY_ID && process.env.MY_AWS_SECRET_ACCESS_KEY) {
    AWS.config.update({
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
        region: REGION,
    });
} else {
    AWS.config.update({ region: REGION }); // producción
}

const s3 = new AWS.S3();

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
    console.log("📥 Petición recibida en actualizarServicio.cjs");

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

        // Leer Excel desde S3
        const s3Data = await s3.getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY }).promise();
        const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const datos = XLSX.utils.sheet_to_json(hoja);

        // 🔁 Filtrar todas las filas que no correspondan al IdServicio
        let actualizados = datos.filter(row => row["IdServicio"] !== idServicio);

        // ✅ Si es una actualización normal (no solo eliminar item)
        if (!servicio.eliminarItem) {
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

            actualizados = [...actualizados, ...nuevosRows];
        }

        // ✅ Si solo se está eliminando un ítem
        if (servicio.eliminarItem) {
            const itemAEliminar = servicio.eliminarItem.trim().toLowerCase();
            console.log(`🗑️ Eliminando item "${itemAEliminar}" del servicio ${idServicio}`);

            actualizados = actualizados.map(row => {
                if (row["IdServicio"] === idServicio && row["Section Items"]) {
                    const items = row["Section Items"]
                        .split(";")
                        .map(i => i.trim())
                        .filter(i => i.toLowerCase() !== itemAEliminar);
                    return {
                        ...row,
                        "Section Items": items.join("; "),
                    };
                }
                return row;
            });
        }

        // Escribir nuevamente el Excel
        const nuevaHoja = XLSX.utils.json_to_sheet(actualizados);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

        await s3.putObject({
            Bucket: BUCKET_NAME,
            Key: FILE_KEY,
            Body: buffer,
            ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }).promise();

        const msg = servicio.eliminarItem
            ? "Ítem eliminado exitosamente."
            : "Servicio actualizado exitosamente por IdServicio.";

        console.log("✅", msg);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: msg }),
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
