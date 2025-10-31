const axios = require("axios");
const querystring = require("querystring");

exports.handler = async (event) => {
    console.log("🛰️ [confirmarSuscripcion] Nueva solicitud:", event.httpMethod);

    // 🌍 Orígenes válidos
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8888",
        "https://plataformas-web.cl",
    ];

    const referer = event.headers.referer || "";
    const origin = event.headers.origin || "";
    const host = event.headers.host || "";

    const isLocal =
        referer.includes("localhost") ||
        origin.includes("localhost") ||
        host.includes("localhost");

    const corsOrigin = isLocal
        ? "http://localhost:5173"
        : "https://plataformas-web.cl";

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // ✅ Preflight CORS
    if (event.httpMethod === "OPTIONS") {
        console.log("🟡 [confirmarSuscripcion] Respondiendo preflight OPTIONS");
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        let token = null;
        const contentType =
            event.headers["content-type"] || event.headers["Content-Type"] || "";

        // 🔍 Obtener token desde query o body
        if (event.queryStringParameters?.TBK_TOKEN) {
            token = event.queryStringParameters.TBK_TOKEN;
        } else if (event.body) {
            if (contentType.includes("application/x-www-form-urlencoded")) {
                const parsed = querystring.parse(event.body);
                token = parsed.TBK_TOKEN;
            } else {
                try {
                    const parsed = JSON.parse(event.body);
                    token = parsed.TBK_TOKEN;
                } catch {
                    console.warn("⚠️ No se pudo parsear body como JSON");
                }
            }
        }

        console.log("🔹 Token recibido de Transbank:", token);
        if (!token) throw new Error("No se recibió TBK_TOKEN desde Transbank");

        // ✅ Endpoint Transbank según entorno
        const apiUrl = isLocal
            ? "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions"
            : "https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        // ✅ Credenciales según entorno
        const headers = isLocal
            ? {
                "Tbk-Api-Key-Id": "597055555541", // integración
                "Tbk-Api-Key-Secret":
                    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": process.env.TBK_API_KEY_ID, // producción
                "Tbk-Api-Key-Secret": process.env.TBK_API_KEY_SECRET,
                "Content-Type": "application/json",
            };

        const url = `${apiUrl}/${token}`;
        console.log("⚙️ [confirmarSuscripcion] Confirmando inscripción en:", url);

        // 🔹 Llamada PUT para confirmar inscripción
        const resp = await axios.put(url, {}, { headers });
        console.log("✅ [confirmarSuscripcion] Respuesta Transbank:", resp.data);

        // 🌐 Redirigir según entorno
        const redirectBase = isLocal
            ? "http://localhost:5173"
            : "https://plataformas-web.cl";

        const redirectUrl = `${redirectBase}/suscripcion?tbk_user=${encodeURIComponent(
            resp.data.tbk_user
        )}&card=${encodeURIComponent(
            resp.data.card_number
        )}&type=${encodeURIComponent(
            resp.data.card_type
        )}&status=success`;

        console.log("🔁 Redirigiendo a:", redirectUrl);

        return {
            statusCode: 302,
            headers: { Location: redirectUrl, ...corsHeaders },
            body: "",
        };
    } catch (err) {
        console.error("❌ [confirmarSuscripcion] Error:", err);

        const redirectError = `${isLocal ? "http://localhost:5173" : "https://plataformas-web.cl"
            }/suscripcion?status=error&msg=${encodeURIComponent(err.message)}`;

        return {
            statusCode: 302,
            headers: { Location: redirectError, ...corsHeaders },
            body: "",
        };
    }
};
