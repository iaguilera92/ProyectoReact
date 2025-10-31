const { Options, Environment, Oneclick } = require("transbank-sdk");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
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

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        const { nombre, email, sitioWeb, idCliente } = JSON.parse(event.body || "{}");
        if (!nombre || !email || !idCliente)
            throw new Error("Faltan parámetros requeridos (nombre, email, idCliente)");

        // 🌎 Detectar entorno
        const isLocal =
            origin.includes("localhost") ||
            origin.includes("127.0.0.1") ||
            origin.includes("8888");

        // ✅ Configurar ambiente: Integration (INT) aunque estemos en producción
        const options = new Options(
            "597055555541", // código comercio OneClick Mall integración
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // API Key integración
            Environment.Integration // 👈 antes era IntegrationType.TEST
        );

        const baseUrl = isLocal
            ? "http://localhost:8888"
            : "https://plataformas-web.cl";
        const returnUrl = `${baseUrl}/.netlify/functions/confirmarSuscripcion`;

        console.log("⚙️ [suscribirse] Iniciando inscripción con SDK...");
        const inscription = new Oneclick.MallInscription(options);
        const response = await inscription.start(nombre, email, returnUrl);

        console.log("✅ [suscribirse] Respuesta Transbank:", response);

        if (!response.token || !response.url_webpay)
            throw new Error("No se recibió token o URL válidos desde Transbank");

        // 📦 Guarda vínculo token → cliente
        await s3
            .putObject({
                Bucket: "plataformas-web-buckets",
                Key: `tokens/${response.token}.json`,
                Body: JSON.stringify({ idCliente, nombre, email, sitioWeb }),
                ContentType: "application/json",
            })
            .promise();

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                token: response.token,
                url_webpay: response.url_webpay,
            }),
        };
    } catch (err) {
        console.error("❌ [suscribirse] Error:", err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error_message: err.message,
            }),
        };
    }
};
