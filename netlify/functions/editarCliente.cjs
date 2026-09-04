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
        const body = JSON.parse(event.body || "{}");
        const {
            idCliente,
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

        if (!idCliente) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta idCliente" }),
            };
        }

        const campos = {};
        if (nombreCliente !== undefined) campos.nombre = nombreCliente;
        if (sitioWeb !== undefined) campos.sitio_web = sitioWeb;
        if (URL !== undefined) campos.url = URL;
        if (telefono !== undefined) campos.telefono = telefono;
        if (correo !== undefined) campos.correo = correo;
        if (pagado !== undefined) campos.pagado = pagado;
        if (valor !== undefined) campos.valor = valor;
        if (estado !== undefined) campos.estado = estado;
        if (logoCliente !== undefined) campos.logo_url = logoCliente;

        const { data: actualizado, error } = await supabase
            .from("clientes")
            .update(campos)
            .eq("id", idCliente)
            .select()
            .single();

        if (error) {
            console.error("❌ Error Supabase:", error);
            return {
                statusCode: 404,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Cliente no encontrado", error: error.message }),
            };
        }

        console.log("✅ Cliente editado:", actualizado);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Cliente actualizado correctamente", cliente: actualizado }),
        };
    } catch (error) {
        console.error("❌ Error al editar cliente:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Error interno", error: error.message }),
        };
    }
};
