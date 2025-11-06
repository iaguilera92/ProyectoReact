const axios = require("axios");
const querystring = require("querystring");
const AWS = require("aws-sdk");

// 🧩 Inicializa S3
const s3 = new AWS.S3({
    region: process.env.AWS_REGION || process.env.MY_AWS_REGION || "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY,
});

exports.handler = async (event) => {
    console.log("🛰️ [confirmarSuscripcion] Nueva solicitud:", event.httpMethod);

    // 🌍 CORS
    const allowedOrigins = ["http://localhost:5173", "http://localhost:8888", "https://plataformas-web.cl"];
    const origin = event.headers.origin || "";
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const corsHeaders = {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "" };
    }

    try {
        // 🔍 Obtener token desde query o body
        let token = event.queryStringParameters?.token || event.queryStringParameters?.TBK_TOKEN;

        if (!token && event.body) {
            const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
            if (contentType.includes("application/x-www-form-urlencoded")) {
                const parsed = querystring.parse(event.body);
                token = parsed.TBK_TOKEN || parsed.token;
            } else {
                try {
                    const parsed = JSON.parse(event.body);
                    token = parsed.TBK_TOKEN || parsed.token;
                } catch {
                    console.warn("⚠️ No se pudo parsear body como JSON");
                }
            }
        }

        console.log("🔹 Token recibido:", token);
        if (!token) throw new Error("No se recibió token desde Transbank");

        // ✅ Detección de PRD vs INT por llaves (no por localhost)
        const hasProdKeys =
            process.env.TBK_OCM_API_KEY_ID?.startsWith("5970") &&
            process.env.TBK_OCM_API_KEY_SECRET?.length > 10;

        const apiUrl = hasProdKeys
            ? `https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions/${token}`
            : `https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions/${token}`;

        const headersReq = hasProdKeys
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

        console.log("⚙️ Confirmando inscripción en:", apiUrl);

        // 📌 CORRECTO: finish es POST, no PUT
        const resp = await axios.post(apiUrl, null, { headers: headersReq });

        console.log("✅ Respuesta Transbank:", resp.data);

        const { tbk_user, card_number, card_type, username } = resp.data;

        // 💾 Guardar en S3 si hay credenciales
        const hasCredentials =
            (process.env.AWS_ACCESS_KEY_ID || process.env.MY_AWS_ACCESS_KEY_ID) &&
            (process.env.AWS_SECRET_ACCESS_KEY || process.env.MY_AWS_SECRET_ACCESS_KEY);

        if (hasCredentials) {
            try {
                const bucketName = "plataformas-web-buckets";
                const key = `tokens/${token}.json`;

                const original = await s3
                    .getObject({ Bucket: bucketName, Key: key })
                    .promise()
                    .then((r) => JSON.parse(r.Body.toString()))
                    .catch(() => ({}));

                const updated = {
                    ...original,
                    tbk_user,
                    username,
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

                console.log(`💾 Actualizado en S3: ${key}`);
            } catch (errS3) {
                console.warn("⚠️ No se pudo actualizar S3:", errS3.message);
            }
        }

        // 🔁 Redirigir al frontend
        const redirectBase = hasProdKeys ? "https://plataformas-web.cl" : "http://localhost:5173";

        const redirectUrl = `${redirectBase}/suscripcion?status=success&tbk_user=${encodeURIComponent(
            tbk_user
        )}&card=${encodeURIComponent(card_number)}&type=${encodeURIComponent(card_type)}`;

        return { statusCode: 302, headers: { Location: redirectUrl }, body: "" };
    } catch (err) {
        console.error("❌ Error confirmarSuscripcion:", err.response?.data || err);

        const redirectBase =
            process.env.TBK_OCM_API_KEY_ID?.startsWith("5970")
                ? "https://plataformas-web.cl"
                : "http://localhost:5173";

        const redirectError = `${redirectBase}/suscripcion?status=error&msg=${encodeURIComponent(
            err.response?.data?.error_message || err.message
        )}`;

        return { statusCode: 302, headers: { Location: redirectError }, body: "" };
    }
};
