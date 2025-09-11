const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Options, Environment } = require("transbank-sdk");

const tx = new WebpayPlus.Transaction(
    new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        Environment.Integration
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
        console.log("Evento recibido:", event);

        const { amount, buyOrder, sessionId, returnUrl } = JSON.parse(event.body);
        console.log("Parámetros recibidos:", { amount, buyOrder, sessionId, returnUrl });

        // Crear transacción en Webpay
        const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error("Error en crearTransaccion:", err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
