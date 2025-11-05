const axios = require("axios");

exports.handler = async (event) => {
    console.log("🚀 [autorizarTransaccion] Nueva solicitud de cobro");

    // 🌍 CORS: dominios permitidos
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
        "Access-Control-Allow-Credentials": "true",
    };

    // ✅ Preflight OPTIONS
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

        // 🧩 Validar parámetros
        if (!tbk_user || !username || !buy_order || !amount) {
            console.error("⚠️ Faltan parámetros requeridos:", body);
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message:
                        "Faltan parámetros requeridos (tbk_user, username, buy_order, amount)",
                }),
            };
        }

        // ⚙️ Detectar entorno
        const isLocal =
            process.env.CONTEXT === "dev" ||
            origin.includes("localhost") ||
            event.headers.host?.includes("localhost");

        console.log("🌐 Context:", process.env.CONTEXT, "Host:", event.headers.host, "isLocal:", isLocal);
        console.log(`🧭 Ejecutando en entorno ${isLocal ? "INTEGRACIÓN" : "PRODUCCIÓN"}`);

        const baseUrl = isLocal
            ? "https://webpay3gint.transbank.cl"
            : "https://webpay3g.transbank.cl";
        const apiUrl = `${baseUrl}/rswebpaytransaction/api/oneclick/v1.0/transactions`;

        // 🔑 Credenciales Transbank
        const headers = isLocal
            ? {
                "Tbk-Api-Key-Id": "597055555541", // Comercio integración OneClick Mall
                "Tbk-Api-Key-Secret":
                    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID,
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json",
            };

        // 🧾 Payload
        const payload = {
            username,
            tbk_user,
            buy_order,
            details: [
                {
                    commerce_code: child_commerce_code || process.env.TBK_OCM_CHILD_CODE || "597053022840",
                    buy_order: `CHILD-${buy_order}`,
                    amount,
                },
            ],
        };

        console.log("📨 Enviando solicitud a Transbank:", {
            entorno: isLocal ? "INTEGRACION" : "PRODUCCION",
            apiUrl,
            username,
            tbk_user,
            amount,
            child_commerce_code,
        });

        // 🔹 Llamada HTTP a Transbank
        const resp = await axios.post(apiUrl, payload, { headers });

        console.log("✅ [autorizarTransaccion] Respuesta Transbank:", resp.data);

        // 🟢 Retornar respuesta estándar
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: "Transacción procesada correctamente",
                entorno: isLocal ? "INTEGRACION" : "PRODUCCION",
                data: resp.data,
            }),
        };
    } catch (err) {
        console.error("❌ [autorizarTransaccion] Error general:");
        console.error({
            status: err.response?.status,
            statusText: err.response?.statusText,
            headers: err.response?.headers,
            data: err.response?.data,
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
                    err.response?.data ||
                    err.message ||
                    "Error desconocido al procesar la transacción",
            }),
        };
    }
};
