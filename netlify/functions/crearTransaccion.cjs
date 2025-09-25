const { WebpayPlus, Options, Environment } = require("transbank-sdk");

const isProduction =
    (process.env.TBK_ENV || "").toLowerCase().startsWith("prd") ||
    (process.env.TBK_ENV || "").toLowerCase().startsWith("prod");

console.log("🔍 Ambiente detectado:", {
    TBK_ENV: process.env.TBK_ENV,
    isProduction
});

const tx = new WebpayPlus.Transaction(
    new Options(
        isProduction
            ? process.env.TBK_COMMERCE_CODE
            : "597055555532", // integración
        isProduction
            ? process.env.TBK_API_KEY_SECRET
            : "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // integración
        isProduction ? Environment.Production : Environment.Integration
    )
);

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
            },
            body: "OK",
        };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const { amount, buyOrder, sessionId, returnUrl } = body;

        console.log("🔹 Valores recibidos en crearTransaccion:", {
            amount,
            buyOrder,
            sessionId,
            returnUrl,
        });

        // Validaciones para evitar nulos
        if (!amount || !buyOrder || !sessionId || !returnUrl) {
            throw new Error("Faltan parámetros obligatorios para tx.create");
        }

        // Crear transacción en Webpay
        const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

        console.log("🔹 Respuesta tx.create:", response);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error("❌ Error en crearTransaccion:", err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
