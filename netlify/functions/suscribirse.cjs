const axios = require("axios");
const AWS = require("aws-sdk");
const dns = require("dns");
const https = require("https");

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

        // 🌐 Siempre usar INT aunque esté en producción
        const TBK_API_KEY_ID = "597055555541";
        const TBK_API_KEY_SECRET =
            "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C";
        const inscriptionUrl =
            "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";
        const returnUrl =
            "https://plataformas-web.cl/.netlify/functions/confirmarSuscripcion";

        const httpsAgent = new https.Agent({
            lookup: (hostname, opts, cb) => dns.lookup(hostname, { family: 4 }, cb),
            rejectUnauthorized: false,
        });

        const response = await axios.post(
            inscriptionUrl,
            {
                username: nombre,
                email,
                response_url: returnUrl,
            },
            {
                headers: {
                    "tbk-api-key-id": TBK_API_KEY_ID,
                    "tbk-api-key-secret": TBK_API_KEY_SECRET,
                    "content-type": "application/json",
                    Accept: "application/json",
                    "user-agent": "Mozilla/5.0 (Netlify Function Integration)",
                },
                httpsAgent,
                timeout: 10000,
            }
        );

        console.log("✅ [suscribirse] Respuesta Transbank:", response.data);

        const { token, url_webpay } = response.data;
        if (!token || !url_webpay)
            throw new Error("No se recibió token o URL válidos desde Transbank");

        await s3
            .putObject({
                Bucket: "plataformas-web-buckets",
                Key: `tokens/${token}.json`,
                Body: JSON.stringify({ idCliente, nombre, email, sitioWeb }),
                ContentType: "application/json",
            })
            .promise();

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
                error_message: err.response?.data || err.message,
            }),
        };
    }
};
