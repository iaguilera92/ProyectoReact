const axios = require("axios");

exports.handler = async (event) => {
    console.log("🚀 [autorizarTransaccion] Nueva solicitud de cobro");

    // 🌍 CORS (soporte para tu frontend local y en Netlify)
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8888",
        "https://plataformas-web.cl",
    ];
    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];
    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // ✅ Preflight CORS
    if (event.httpMethod === "OPTIONS") {
        console.log("🟡 [autorizarTransaccion] Preflight OPTIONS");
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        // 📦 Parse body
        const body = JSON.parse(event.body || "{}");
        const {
            tbk_user,
            username,
            buy_order,
            amount = 9990,
            child_commerce_code,
        } = body;

        if (!tbk_user || !username || !buy_order) {
            console.error("⚠️ Faltan parámetros requeridos");
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    error: "Faltan parámetros requeridos (tbk_user, username, buy_order)",
                }),
            };
        }

        // ⚙️ Detectar entorno
        const isLocal =
            origin.includes("localhost") || event.headers.host?.includes("localhost");

        const baseUrl = isLocal
            ? "https://webpay3gint.transbank.cl"
            : "https://webpay3g.transbank.cl";

        const apiUrl = `${baseUrl}/rswebpaytransaction/api/oneclick/v1.0/transactions`;

        const headers = isLocal
            ? {
                "Tbk-Api-Key-Id": "597055555541", // Comercio de integración OneClick Mall
                "Tbk-Api-Key-Secret":
                    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID,
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json",
            };

        const payload = {
            username,
            tbk_user,
            buy_order,
            details: [
                {
                    commerce_code:
                        child_commerce_code || process.env.TBK_OCM_CHILD_CODE,
                    buy_order: `CHILD-${buy_order}`,
                    amount,
                },
            ],
        };

        console.log("📨 Enviando solicitud a Transbank:", {
            url: apiUrl,
            headers: {
                "Tbk-Api-Key-Id": headers["Tbk-Api-Key-Id"],
                entorno: isLocal ? "INTEGRACION" : "PRODUCCION",
            },
            payload,
        });

        // 🔹 Llamada HTTP a Transbank
        const resp = await axios.post(apiUrl, payload, { headers });
        console.log("✅ [autorizarTransaccion] Respuesta Transbank:", resp.data);

        // 🟢 Resultado exitoso
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(resp.data),
        };
    } catch (err) {
        console.error("❌ [autorizarTransaccion] Error general:");
        console.error(err.response?.data || err.message || err);

        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error: err.response?.data || err.message || "Error desconocido",
            }),
        };
    }
};
