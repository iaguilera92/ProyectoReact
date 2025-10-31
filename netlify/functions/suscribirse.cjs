const axios = require("axios");
const AWS = require("aws-sdk");

// Inicializar S3
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log("🛰️ [suscribirse] Nueva solicitud:", {
        method: event.httpMethod,
        origin: event.headers.origin,
        host: event.headers.host,
    });

    // 🌍 Dominios permitidos
    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:8888",
        "https://plataformas-web.cl",
    ];

    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin)
        ? origin
        : "https://plataformas-web.cl";

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    // ✅ Preflight CORS
    if (event.httpMethod === "OPTIONS") {
        console.log("🟡 [suscribirse] Preflight OPTIONS");
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        console.log("🟢 [suscribirse] Body recibido:", event.body);
        const { nombre, email, sitioWeb, idCliente } = JSON.parse(event.body || "{}");

        if (!nombre || !email || !idCliente)
            throw new Error("Faltan parámetros requeridos (nombre, email, idCliente)");

        // ⚙️ Siempre usar ambiente de integración, incluso en producción
        const TBK_API_KEY_ID = "597055555541";
        const TBK_API_KEY_SECRET =
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
        const inscriptionUrl =
            "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        const returnUrl = "https://plataformas-web.cl/.netlify/functions/confirmarSuscripcion";

        console.log("⚙️ [suscribirse] Registrando inscripción OneClick...");
        console.log("↪️ URL retorno:", returnUrl);

        // 🔐 Logs de diagnóstico
        console.log("🔐 Headers de envío:", {
            "Tbk-Api-Key-Id": TBK_API_KEY_ID,
            "Tbk-Api-Key-Secret-length": TBK_API_KEY_SECRET.length,
        });
        console.log("📦 Payload:", { username: nombre, email, response_url: returnUrl });

        // 🚀 Llamada al endpoint de integración
        const response = await axios.post(
            inscriptionUrl,
            {
                username: nombre,
                email,
                response_url: returnUrl,
            },
            {
                headers: {
                    // 🔹 Transbank a veces requiere los headers en minúsculas (Netlify los normaliza)
                    "tbk-api-key-id": TBK_API_KEY_ID,
                    "tbk-api-key-secret": TBK_API_KEY_SECRET,
                    "content-type": "application/json",
                    "user-agent": "Mozilla/5.0 (Netlify Function Integration)",
                    Accept: "application/json",
                },
                httpsAgent: new (require("https").Agent)({
                    rejectUnauthorized: false, // evita errores de SSL self-signed en INT
                }),
                timeout: 10000,
            }
        );

        console.log("✅ [suscribirse] Respuesta Transbank:", response.data);

        // 🔹 Transbank puede devolver "url_webpay" o "url"
        const token = response.data.token;
        const url_webpay = response.data.url_webpay || response.data.url;

        if (!token || !url_webpay) {
            console.error("⚠️ Estructura inesperada:", response.data);
            throw new Error("No se recibió token o URL válidos desde Transbank");
        }

        // 🧾 Guarda vínculo token → cliente en S3
        const bucketName = "plataformas-web-buckets";
        const key = `tokens/${token}.json`;
        const data = {
            idCliente,
            nombre,
            email,
            sitioWeb,
            creado: new Date().toISOString(),
        };

        await s3
            .putObject({
                Bucket: bucketName,
                Key: key,
                Body: JSON.stringify(data),
                ContentType: "application/json",
            })
            .promise();

        console.log(`💾 [suscribirse] Datos cliente guardados en S3: ${key}`);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ token, url_webpay }),
        };
    } catch (err) {
        console.error("❌ [suscribirse] Error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error_message: err.response?.data || err.message || "Error desconocido",
            }),
        };
    }
};
