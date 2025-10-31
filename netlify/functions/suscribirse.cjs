const { Options, Environment } = require("transbank-sdk");
const axios = require("axios");
const AWS = require("aws-sdk");

// ✅ Inicializa S3
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.log("🛰️ [suscribirse] Nueva solicitud:", {
        method: event.httpMethod,
        origin: event.headers.origin,
    });

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

        // ✅ Configuración de integración
        const options = new Options(
            "597055555541", // Código de comercio integración
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
            Environment.Integration
        );

        // 🌍 Detectar entorno
        const isLocal = origin.includes("localhost");
        const baseUrl = isLocal
            ? "http://localhost:8888"
            : "https://plataformas-web.cl";
        const returnUrl = `${baseUrl}/.netlify/functions/confirmarSuscripcion`;

        console.log("⚙️ [suscribirse] Registrando inscripción OneClick...");
        console.log("↪️ URL retorno:", returnUrl);

        // 🔹 Llamada al endpoint público de Transbank
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

        console.log("✅ [suscribirse] Respuesta Transbank:", response.data);

        const { token, url_webpay } = response.data;
        if (!token || !url_webpay)
            throw new Error("No se recibió token o URL válidos desde Transbank");

        // 🧾 Guarda el vínculo temporal token → cliente en S3
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

        // ✅ Retornar a frontend para redirección
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
            body: JSON.stringify({ error_message: err.message }),
        };
    }
};
