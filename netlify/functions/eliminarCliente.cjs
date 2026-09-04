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
        const { sitioWeb } = body;

        if (!sitioWeb) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta el campo sitioWeb" }),
            };
        }

        console.log(`🔍 Buscando cliente con sitio_web: "${sitioWeb}"`);

        const { data: eliminado, error } = await supabase
            .from("clientes")
            .delete()
            .eq("sitio_web", sitioWeb)
            .select()
            .single();

        if (error) {
            console.error("❌ Error Supabase:", error);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: `No se encontró cliente con sitio_web "${sitioWeb}"` }),
            };
        }

        console.log("🗑️ Cliente eliminado:", eliminado);

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
