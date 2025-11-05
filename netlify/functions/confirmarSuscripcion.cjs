const axios = require("axios");
const querystring = require("querystring");
const AWS = require("aws-sdk");

// 🧩 Inicializa S3 (usa MY_* o AWS_*)
const s3 = new AWS.S3({
    region: process.env.AWS_REGION || process.env.MY_AWS_REGION || "us-east-1",
    accessKeyId:
        process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY,
});

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
        console.log("🟡 [confirmarSuscripcion] Preflight OPTIONS");
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

        // 🌐 Endpoint según entorno
        const apiUrl = isLocal
            ? "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions"
            : "https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions";

        // 🔐 Credenciales según entorno
        const headers = isLocal
            ? {
                "Tbk-Api-Key-Id": "597055555541", // Integración
                "Tbk-Api-Key-Secret":
                    "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json",
            }
            : {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID,
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json",
            };

        const url = `${apiUrl}/${token}`;
        console.log("⚙️ [confirmarSuscripcion] Confirmando inscripción en:", url);

        // 🔹 Confirmar inscripción
        const resp = await axios.put(url, {}, { headers });
        console.log("✅ [confirmarSuscripcion] Respuesta Transbank:", resp.data);

        const { tbk_user, card_number, card_type } = resp.data;

        // 💾 Actualizar registro en S3 si existen credenciales
        const hasCredentials =
            (process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID) &&
            (process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY);

        if (hasCredentials) {
            try {
                const bucketName = "plataformas-web-buckets";
                const key = `tokens/${token}.json`;

                // 🔍 Descarga el token original para actualizarlo
                const original = await s3
                    .getObject({ Bucket: bucketName, Key: key })
                    .promise()
                    .then((r) => JSON.parse(r.Body.toString()))
                    .catch(() => ({}));

                const updated = {
                    ...original,
                    tbk_user,
                    card_number,
                    card_type,
                    confirmado: true,
                    fechaConfirmacion: new Date().toISOString(),
                };

                await s3
                    .putObject({
                        Bucket: bucketName,
                        Key: key,
                        Body: JSON.stringify(updated),
                        ContentType: "application/json",
                    })
                    .promise();

                console.log(`💾 [confirmarSuscripcion] Actualizado en S3: ${key}`);
            } catch (errS3) {
                console.warn("⚠️ [confirmarSuscripcion] No se pudo actualizar S3:", errS3.message);
            }
        } else {
            console.log("🧩 [confirmarSuscripcion] Sin credenciales AWS: se omite actualización S3");
        }

        // 🌐 Redirección final al frontend
        const redirectBase = isLocal
            ? "http://localhost:5173"
            : "https://plataformas-web.cl";

        const redirectUrl = `${redirectBase}/suscripcion?tbk_user=${encodeURIComponent(
            tbk_user
        )}&card=${encodeURIComponent(card_number)}&type=${encodeURIComponent(
            card_type
        )}&status=success`;

        console.log("🔁 Redirigiendo a:", redirectUrl);

        return {
            statusCode: 302,
            headers: { Location: redirectUrl, ...corsHeaders },
            body: "",
        };
    } catch (err) {
        console.error("❌ [confirmarSuscripcion] Error:", err.response?.data || err);

        const isLocal =
            event.headers.host?.includes("localhost") ||
            (event.headers.origin || "").includes("localhost");

        const redirectError = `${isLocal ? "http://localhost:5173" : "https://plataformas-web.cl"
            }/suscripcion?status=error&msg=${encodeURIComponent(
                err.response?.data?.error_message || err.message
            )}`;

        return {
            statusCode: 302,
            headers: { Location: redirectError, ...corsHeaders },
            body: "",
        };
    }
};
