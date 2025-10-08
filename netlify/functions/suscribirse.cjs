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
        const { email, nombre } = JSON.parse(event.body);

        const body = {
            username: nombre,
            email,
            response_url:
                "http://localhost:8888/.netlify/functions/confirmarSuscripcion", // callback local
        };

        const COMMERCE_CODE = process.env.TBK_COMMERCE_CODE_ONECLICK || "597055555541";
        const API_SECRET = process.env.TBK_API_KEY_SECRET_ONECLICK || "579B532A7440BB0C9079DED94D31EA161EB9A77A";

        console.log("➡️ Enviando OneClick:", body);
        console.log("Usando COMMERCE_CODE:", COMMERCE_CODE);

        const response = await fetch(
            "https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions",
            {
                method: "POST",
                headers: {
                    "Tbk-Api-Key-Id": COMMERCE_CODE,
                    "Tbk-Api-Key-Secret": API_SECRET,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        const text = await response.text();
        console.log("⬅️ Respuesta cruda OneClick:", text);
        const data = JSON.parse(text || "{}");

        if (!data.token || !data.url_webpay) {
            throw new Error("Respuesta incompleta desde OneClick");
        }

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ token: data.token, url: data.url_webpay }),
        };
    } catch (error) {
        console.error("Error iniciando OneClick:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({
                error: "Error al iniciar inscripción OneClick",
                detalle: error.message,
            }),
        };
    }
};
