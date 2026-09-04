const { createClient } = require("@supabase/supabase-js");

if (!global.WebSocket) {
    global.WebSocket = class { constructor() {} close() {} send() {} };
}

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
);

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

        if (!nombreCliente || !sitioWeb || !URL || !telefono || !correo) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Faltan campos requeridos para crear el cliente",
                }),
            };
        }

        const nuevoCliente = {
            nombre: nombreCliente,
            sitio_web: sitioWeb,
            url: URL,
            telefono: telefono,
            correo: correo,
            pagado: pagado ?? false,
            valor: valor || "$10.000",
            fecha_pago: new Date().toISOString().split("T")[0],
            estado: estado ?? 1,
            logo_url: logoCliente || "",
        };

        console.log("🆕 Insertando cliente en Supabase:", nuevoCliente);

        const { data: insertado, error } = await supabase
            .from("clientes")
            .insert(nuevoCliente)
            .select()
            .single();

        if (error) {
            console.error("❌ Error Supabase:", error);
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Error al insertar cliente en base de datos",
                    error: error.message,
                }),
            };
        }

        console.log("✅ Cliente agregado correctamente:", insertado);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Cliente agregado correctamente",
                cliente: insertado,
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
