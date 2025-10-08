exports.handler = async (event) => {
    try {
        const { token_ws } = event.queryStringParameters;

        const response = await fetch(
            `https://webpay3gint.transbank.cl/rswebpaytransaction/api/oneclick/v1.0/inscriptions/${token_ws}`,
            {
                method: "PUT",
                headers: {
                    "Tbk-Api-Key-Id": "597055555541",
                    "Tbk-Api-Key-Secret":
                        "579B532A7440BB0C9079DED94D31EA161EB9A77A",
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();
        console.log("✅ Confirmación inscripción:", data);

        return {
            statusCode: 200,
            headers: { "Content-Type": "text/html; charset=UTF-8" },
            body: `
        <html>
          <body style="font-family:sans-serif; text-align:center; padding:50px">
            <h2>Suscripción completada correctamente 🎉</h2>
            <p>Usuario: <b>${data.username}</b></p>
            <p>tbk_user: <b>${data.tbk_user}</b></p>
            <a href="https://tusitio.netlify.app" style="display:inline-block;margin-top:20px;padding:10px 20px;background:#1976d2;color:white;text-decoration:none;border-radius:6px">Volver al sitio</a>
          </body>
        </html>
      `,
        };
    } catch (error) {
        console.error("Error confirmando inscripción:", error);
        return {
            statusCode: 500,
            body: "Error al confirmar inscripción OneClick",
        };
    }
};
