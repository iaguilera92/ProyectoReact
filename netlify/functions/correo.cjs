// netlify/functions/correo.cjs

const fetch = require("node-fetch");

exports.handler = async (event) => {
    const { nombre, telefono, mensaje, emailCopia } = JSON.parse(event.body || "{}");

    const emailPayload = {
        service_id: "service_29hsjvu",
        template_id: "template_j4i5shl",
        user_id: "IHD-e11j3sPmmvBA-",
        template_params: {
            nombre,
            telefono,
            mensaje,
            reply_to: emailCopia || undefined,
        },
    };

    try {
        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
        });

        if (!res.ok) {
            const errorData = await res.text();
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Error al enviar correo", detail: errorData }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Excepción al enviar correo", detail: err.message }),
        };
    }
};
