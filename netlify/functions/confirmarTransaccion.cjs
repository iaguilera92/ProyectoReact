const { WebpayPlus, IntegrationApiKeys, IntegrationCommerceCodes, Options } = require("transbank-sdk");

const tx = new WebpayPlus.Transaction(
    new Options(
        IntegrationCommerceCodes.WEBPAY_PLUS,
        IntegrationApiKeys.WEBPAY,
        WebpayPlus.DEFAULT_API_BASE
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
        const { token_ws } = JSON.parse(event.body);
        console.log("Token recibido para confirmación:", token_ws);

        const response = await tx.commit(token_ws); // 👈 Confirmar con Transbank
        console.log("Respuesta commit:", response);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(response),
        };
    } catch (err) {
        console.error("Error en confirmarTransaccion:", err);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: err.message }),
        };
    }
};
