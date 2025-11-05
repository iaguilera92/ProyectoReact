const axios = require("axios");
const AWS = require("aws-sdk");
const { Options } = require("transbank-sdk");

const s3 = new AWS.S3({
    region:
        process.env.AWS_REGION ||
        process.env.MY_AWS_REGION ||
        "us-east-1",
    accessKeyId:
        process.env.AWS_ACCESS_KEY_ID ||
        process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY ||
        process.env.MY_AWS_SECRET_ACCESS_KEY,
});


exports.handler = async (event) => {
    console.log("🛰️ [suscribirse] Nueva solicitud:", {
        method: event.httpMethod,
        origin: event.headers.origin,
        host: event.headers.host,
    });

    // 🌍 CORS permitido
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

        // ⚙️ Detectar entorno
        const isLocal =
            event.headers.host?.includes("localhost") ||
            origin.includes("localhost");
        const environment = isLocal ? "INTEGRACION" : "PRODUCCION";

        // 🌐 URL de inscripción según entorno
        const inscriptionUrl = isLocal
            ? "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions"
            : "https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        // 🔐 Credenciales según entorno
        const headers = isLocal
            ? {
                "Tbk-Api-Key-Id": "597055555541", // Mall integración
                "Tbk-Api-Key-Secret":
                    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID, // Mall producción
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json",
            };

        // 🌍 URL retorno (función confirmarSuscripcion)
        const baseUrl = isLocal
            ? "http://localhost:8888"
            : "https://plataformas-web.cl";
        const returnUrl = `${baseUrl}/.netlify/functions/confirmarSuscripcion`;

        console.log("⚙️ [suscribirse] Registrando inscripción OneClick...");
        console.log("🌍 Endpoint:", inscriptionUrl);
        console.log("📬 URL retorno:", returnUrl);
        console.log("🔧 Modo:", environment);

        // 🔹 Solicitud HTTP a Transbank
        const response = await axios.post(
            inscriptionUrl,
            {
                username: nombre,
                email,
                response_url: returnUrl,
            },
            { headers }
        );

        console.log("✅ [suscribirse] Respuesta Transbank:", response.data);

        const token = response.data.token;
        const url_webpay = response.data.url_webpay || response.data.url;

        if (!token || !url_webpay) {
            console.error("⚠️ Respuesta incompleta desde Transbank:", response.data);
            throw new Error(
                response.data.error_message || "Respuesta incompleta desde OneClick"
            );
        }

        // 💾 Guarda relación token → cliente en S3
        const bucketName = "plataformas-web-buckets";
        const key = `tokens/${token}.json`;
        const data = {
            idCliente,
            nombre,
            email,
            sitioWeb,
            entorno: environment,
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

        console.log(`💾 [suscribirse] Datos guardados en S3: ${key}`);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ token, url_webpay }),
        };
    } catch (err) {
        console.error("❌ [suscribirse] Error:", err.response?.data || err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error_message: err.response?.data?.error_message || err.message,
            }),
        };
    }
};
