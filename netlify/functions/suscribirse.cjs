const axios = require("axios");
const AWS = require("aws-sdk");

// 🧩 Inicializa S3 (usa MY_* o AWS_*)
const s3 = new AWS.S3({
    region: process.env.AWS_REGION || process.env.MY_AWS_REGION || "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY,
});

exports.handler = async (event) => {
    console.log("🛰️ [suscribirse] Nueva solicitud:", {
        method: event.httpMethod,
        origin: event.headers.origin,
        host: event.headers.host,
    });

    // 🌍 CORS
    const allowedOrigins = ["http://localhost:5173", "http://localhost:8888", "https://plataformas-web.cl"];
    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") {
        console.log("🟡 [suscribirse] Preflight OPTIONS");
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        console.log("🟢 [suscribirse] Body recibido:", event.body);
        const { nombre, email, sitioWeb, idCliente } = JSON.parse(event.body || "{}");

        if (!nombre || !email || !idCliente) {
            throw new Error("Faltan parámetros requeridos (nombre, email, idCliente)");
        }

        // 🔑 ¿Tenemos llaves de producción?
        const hasProdKeys =
            process.env.TBK_OCM_API_KEY_ID?.startsWith("5970") &&
            process.env.TBK_OCM_API_KEY_SECRET?.length > 10;

        const environment = hasProdKeys ? "PRODUCCION" : "INTEGRACION";

        // 🧠 Detectar si usuario inició desde localhost
        const cameFromLocal =
            (event.headers.referer || "").includes("localhost") ||
            (event.headers.origin || "").includes("localhost") ||
            (event.headers.host || "").includes("localhost");

        console.log("📍 Origen del usuario:", cameFromLocal ? "LOCALHOST" : "PRODUCCIÓN");

        // 🌐 Endpoint inscripción
        const inscriptionUrl = hasProdKeys
            ? "https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions"
            : "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        const headers = hasProdKeys
            ? {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID,
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": "597055555541",
                "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            };

        // 🔁 URL donde TBK devolverá tras la inscripción
        const returnBase = cameFromLocal ? "http://localhost:8888" : "https://plataformas-web.cl";
        const returnUrl = `${returnBase}/.netlify/functions/confirmarSuscripcion`;

        console.log("⚙️ [suscribirse] Registrando inscripción OneClick...", {
            inscriptionUrl,
            returnUrl,
            environment,
            hasProdKeys,
            cameFromLocal,
        });

        // 🧾 Solicitud a Transbank
        const response = await axios.post(
            inscriptionUrl,
            { username: email, email, response_url: returnUrl },
            { headers }
        );

        console.log("✅ [suscribirse] Respuesta Transbank:", response.data);

        const token = response.data.token;
        const url_webpay = response.data.url_webpay || response.data.url;

        if (!token || !url_webpay) throw new Error("Respuesta incompleta desde Transbank");

        // 💾 Guardar token en S3
        const hasCredentials =
            (process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID) &&
            (process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY);

        if (hasCredentials) {
            try {
                const bucketName = "plataformas-web-buckets";
                const key = `tokens/${token}.json`;

                const data = {
                    idCliente,
                    nombre,
                    email,
                    sitioWeb,
                    entorno: environment,
                    cameFromLocal, // 👈 agregado
                    creado: new Date().toISOString(),
                };

                await s3.putObject({
                    Bucket: bucketName,
                    Key: key,
                    Body: JSON.stringify(data),
                    ContentType: "application/json",
                }).promise();

                console.log(`💾 [suscribirse] Token guardado en S3: ${key}`);
            } catch (s3Err) {
                console.warn("⚠️ [suscribirse] No se pudo guardar en S3:", s3Err.message);
            }
        }

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ token, url_webpay }),
        };

    } catch (err) {
        console.error("❌ [suscribirse] Error:", err.response?.data || err.message || err);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                error_message: err.response?.data?.error_message || err.message,
            }),
        };
    }
};
