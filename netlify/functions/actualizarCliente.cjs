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

        const hoy = new Date().toISOString().split("T")[0];
        const entornoActual = process.env.NODE_ENV === "production" ? "PRODUCCION" : "DESARROLLO";

        const campos = {};

        if (cobroExitoso === true || cobroExitoso === 1 || cobroExitoso === "1") {
            campos.pagado = true;
            campos.fecha_pago = hoy;
        } else if (revertir === true || revertir === 1 || revertir === "1") {
            campos.pagado = false;
            campos.fecha_pago = null;
        }

        if (typeof suscripcion !== "undefined") {
            campos.suscripcion = !!suscripcion;
        }

        if (tbk_user && typeof tbk_user === "string" && tbk_user.trim() !== "") {
            campos.tbk_user = tbk_user;
            campos.entorno_tbk = entornoActual;
        }

        if (tarjeta && typeof tarjeta === "string" && tarjeta.trim() !== "") {
            campos.tarjeta = tarjeta;
        }

        if (tipo_tarjeta && typeof tipo_tarjeta === "string" && tipo_tarjeta.trim() !== "") {
            campos.tipo_tarjeta = tipo_tarjeta;
        }

        if (Object.keys(campos).length === 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "No hay campos para actualizar" }),
            };
        }

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

        console.log("✅ Cliente actualizado correctamente:", actualizado);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: "OK", cliente: actualizado }),
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
