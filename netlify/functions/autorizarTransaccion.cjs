const axios = require("axios");

exports.handler = async (event) => {
    console.log("🚀 [autorizarTransaccion] Nueva solicitud de cobro");

    // 🌍 CORS
    const allowedOrigins = ["http://localhost:5173", "http://localhost:8888", "https://plataformas-web.cl"];
    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Credentials": "true",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const { tbk_user, username, buy_order, amount, child_commerce_code, entorno_tbk } = body;

        console.log("📥 Body recibido:", body);

        if (!tbk_user || !username || !buy_order || !amount) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ success: false, message: "Faltan parámetros requeridos" }),
            };
        }

        // 🧭 Detección PRD / INT
        const apiKeyId = process.env.TBK_OCM_API_KEY_ID;
        const apiKeySecret = process.env.TBK_OCM_API_KEY_SECRET;

        const hasProdKeys = apiKeyId?.startsWith("5970") && apiKeySecret?.length > 20;

        let entornoFinal = hasProdKeys ? "PRODUCCION" : "INTEGRACION";

        // Permitir override desde frontend
        if (entorno_tbk?.toUpperCase() === "INT") entornoFinal = "INTEGRACION";
        if (entorno_tbk?.toUpperCase() === "PRD") entornoFinal = "PRODUCCION";

        console.log("🧭 Entorno detectado:", entornoFinal);
        console.log("🔑 Variables cargadas:", {
            TBK_OCM_API_KEY_ID: apiKeyId ? apiKeyId.slice(0, 8) + "..." : "❌ NO DEFINIDA",
            TBK_OCM_API_KEY_SECRET: apiKeySecret ? "(definida)" : "❌ NO DEFINIDA",
            CHILD_CODE_ENV: process.env.TBK_OCM_CHILD_CODE || "⚠️ NO DEFINIDA",
            hasProdKeys,
        });

        const baseUrl =
            entornoFinal === "PRODUCCION"
                ? "https://webpay3g.transbank.cl"
                : "https://webpay3gint.transbank.cl";

        const apiUrl = `${baseUrl}/rswebpaytransaction/api/oneclick/v1.0/transactions`;

        const headers =
            entornoFinal === "PRODUCCION"
                ? {
                    "Tbk-Api-Key-Id": apiKeyId,
                    "Tbk-Api-Key-Secret": apiKeySecret,
                    "Content-Type": "application/json",
                }
                : {
                    "Tbk-Api-Key-Id": "597055555541",
                    "Tbk-Api-Key-Secret":
                        "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                    "Content-Type": "application/json",
                };

        const payload = {
            username,
            tbk_user,
            buy_order: `CHILD-${buy_order}`,  // Asegúrate de que este buy_order sea único y bien formateado
            details: [
                {
                    commerce_code: child_commerce_code || process.env.TBK_OCM_CHILD_CODE, // Verifica que este sea el comercio correcto
                    buy_order: `CHILD-${buy_order}`, // Asegúrate de que el buy_order sea único
                    amount,
                },
            ],
        };

        console.log("📨 Payload enviado a Transbank:", JSON.stringify(payload, null, 2));

        const resp = await axios.post(apiUrl, payload, { headers });

        console.log("✅ Respuesta Transbank:", resp.data);

        // Verificar el tipo de respuesta para obtener más detalles
        if (resp.data.details) {
            resp.data.details.forEach(detail => {
                if (detail.status === 'CONSTRAINTS_VIOLATED') {
                    console.warn("⚠️ Transacción fallida por restricciones:", detail);
                }
            });
        }


        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                entorno: entornoFinal,
                data: resp.data,
            }),
        };

    } catch (err) {
        console.error("❌ ERROR TRANSBANK DETALLADO:", {
            url: err.config?.url,
            sentData: err.config?.data,
            status: err?.response?.status,
            statusText: err?.response?.statusText,
            headers: err?.response?.headers,
            data: err?.response?.data,
            message: err.message,
        });

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message:
                    err.response?.data?.error_message ||
                    err.response?.data?.detail ||
                    err.message ||
                    "Error desconocido",
            }),
        };
    }
};
