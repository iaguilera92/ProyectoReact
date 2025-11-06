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
    if (event.httpMethod === "GET") {
        console.log("🔄 Forzando lectura de query GET");
    }
    try {
        // ----------------------------------------------------------
        // 1️⃣ OBTENER TOKEN TBK
        // ----------------------------------------------------------
        let token = event.queryStringParameters?.TBK_TOKEN
            || event.queryStringParameters?.token
            || event.queryStringParameters?.TBK_TOKEN_WS;

        if (!token && event.body) {
            const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
            if (contentType.includes("application/x-www-form-urlencoded")) {
                const parsed = querystring.parse(event.body);
                token = parsed.TBK_TOKEN || parsed.token;
            } else {
                try {
                    const parsed = JSON.parse(event.body);
                    token = parsed.TBK_TOKEN || parsed.token;
                } catch { }
            }
        }

        console.log("🔹 Token recibido:", token);
        if (!token) throw new Error("No se recibió token desde Transbank");

        // ----------------------------------------------------------
        // 2️⃣ OBTENER DATOS DESDE S3 (para saber entorno)
        // ----------------------------------------------------------
        let entorno_tbk = null;
        let existingData = null;

        try {
            const bucketName = "plataformas-web-buckets";
            const key = `tokens/${token}.json`;

            existingData = await s3.getObject({ Bucket: bucketName, Key: key }).promise()
                .then(r => JSON.parse(r.Body.toString()))
                .catch(() => null);

            if (existingData) {
                entorno_tbk = existingData.entorno || existingData.entorno_tbk || "INTEGRACION";
                console.log("📦 Datos S3 encontrados. entorno_tbk:", entorno_tbk);
            } else {
                console.log("⚠️ Token no encontrado en S3. Asumimos LOCAL + INT");
                entorno_tbk = "INTEGRACION";
            }
        } catch {
            console.warn("⚠️ Error leyendo S3, fallback → INTEGRACION");
            entorno_tbk = "INTEGRACION";
        }

        const isProd = entorno_tbk === "PRODUCCION";

        // ----------------------------------------------------------
        // 3️⃣ CONFIRMAR INSCRIPCIÓN ANTE TRANSBANK (PUT)
        // ----------------------------------------------------------
        const apiUrl = isProd
            ? `https://webpay3g.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions/${token}`
            : `https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions/${token}`;

        const headersReq = isProd
            ? {
                "Tbk-Api-Key-Id": process.env.TBK_OCM_API_KEY_ID,
                "Tbk-Api-Key-Secret": process.env.TBK_OCM_API_KEY_SECRET,
                "Content-Type": "application/json"
            }
            : {
                "Tbk-Api-Key-Id": "597055555541",
                "Tbk-Api-Key-Secret": "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",
                "Content-Type": "application/json"
            };

        console.log("⚙️ Confirmando inscripción en:", apiUrl);
        const resp = await axios.put(apiUrl, {}, { headers: headersReq });



        console.log("✅ Respuesta Transbank:", resp.data);
        const { tbk_user, card_number, card_type, username } = resp.data;

        // ----------------------------------------------------------
        // 4️⃣ GUARDAR DATOS COMPLETOS EN S3 (actualizar)
        // ----------------------------------------------------------
        if (existingData) {
            existingData.tbk_user = tbk_user;
            existingData.username = username;
            existingData.tarjeta = card_number;
            existingData.tipo_tarjeta = card_type;
            existingData.confirmado = true;
            existingData.fechaConfirmacion = new Date().toISOString();
            existingData.entorno_tbk = entorno_tbk;

            try {
                await s3.putObject({
                    Bucket: "plataformas-web-buckets",
                    Key: `tokens/${token}.json`,
                    Body: JSON.stringify(existingData),
                    ContentType: "application/json",
                }).promise();

                console.log("💾 S3 actualizado con datos finales");
            } catch (err) {
                console.warn("⚠️ No se pudo actualizar S3:", err.message);
            }
        }

        // ----------------------------------------------------------
        // 5️⃣ DETERMINAR REDIRECCIÓN FINAL (FRONTEND)
        // ----------------------------------------------------------
        let redirectBase = "https://plataformas-web.cl"; // por defecto PRD

        if (existingData?.cameFromLocal === true || existingData?.origen === "LOCAL") {
            redirectBase = "http://localhost:5173";
        }

        console.log("🔀 Redirigiendo a:", redirectBase);

        const redirectUrl = `${redirectBase}/suscripcion?status=success&tbk_user=${encodeURIComponent(
            tbk_user
        )}&card=${encodeURIComponent(card_number)}&type=${encodeURIComponent(card_type)}`;

        return { statusCode: 302, headers: { Location: redirectUrl }, body: "" };

    } catch (err) {
        console.error("❌ Error confirmarSuscripcion:", err.response?.data || err);

        // Detecta si el token venía de local o PRD
        const cameFromLocal = existingData?.cameFromLocal === true;

        const redirectBase = cameFromLocal
            ? "http://localhost:5173"
            : "https://plataformas-web.cl";

        const redirectError = `${redirectBase}/suscripcion?status=error&msg=${encodeURIComponent(
            err.response?.data?.error_message || err.message
        )}`;

        return { statusCode: 302, headers: { Location: redirectError }, body: "" };
    }
};
