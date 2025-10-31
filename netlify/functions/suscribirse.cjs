const { Options, Environment } = require("transbank-sdk");
const axios = require("axios");

exports.handler = async (event) => {
    console.log("🛰️ [suscribirse] Nueva solicitud:", {
        method: event.httpMethod,
        origin: event.headers.origin,
    });

    // 🌐 Permitir tanto localhost como dominio productivo
    const allowedOrigins = [
        "http://localhost:5173",
        "https://plataformas-web.cl",
    ];

    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // ✅ Manejo de preflight CORS
    if (event.httpMethod === "OPTIONS") {
        console.log("🟡 [suscribirse] Respondiendo preflight OPTIONS");
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        console.log("🟢 [suscribirse] Body recibido:", event.body);
        const { nombre, email } = JSON.parse(event.body || "{}");

        if (!nombre || !email)
            throw new Error("Faltan parámetros: nombre y email son requeridos");

        // ✅ Configuración de integración
        const options = new Options(
            "597055555541", // Código de comercio OneClick integración
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
            Environment.Integration
        );

        // 🌍 Determinar automáticamente la URL de retorno según entorno
        const isLocal = origin.includes("localhost");
        const baseUrl = isLocal
            ? "http://localhost:8888"
            : "https://plataformas-web.cl";
        const returnUrl = `${baseUrl}/.netlify/functions/confirmarSuscripcion`;

        console.log("⚙️ [suscribirse] Enviando inscripción manual a OneClick...");
        console.log("↪️ URL de retorno:", returnUrl);

        // 🔹 Petición a la API pública de OneClick
        const response = await axios.post(
            "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions",
            {
                username: nombre,
                email,
                response_url: returnUrl,
            },
            {
                headers: {
                    "Tbk-Api-Key-Id": options.commerceCode,
                    "Tbk-Api-Key-Secret": options.apiKey,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ [suscribirse] Respuesta recibida:", response.data);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(response.data),
        };
    } catch (err) {
        console.error("❌ [suscribirse] Error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
