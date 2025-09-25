const AWS = require("aws-sdk");
const XLSX = require("xlsx");
const { WebpayPlus, Options, Environment } = require("transbank-sdk");
require("dotenv").config();

const BUCKET_NAME = process.env.BUCKET_NAME;
const REGION = process.env.MY_AWS_REGION || "us-east-1";
const FILE_KEY = "Reservas.xlsx";

AWS.config.update({
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    region: REGION,
});

const s3 = new AWS.S3();

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isProduction =
    (process.env.TBK_ENV || "").toLowerCase().startsWith("prd") ||
    (process.env.TBK_ENV || "").toLowerCase().startsWith("prod");

const tx = new WebpayPlus.Transaction(
    new Options(
        isProduction ? process.env.TBK_COMMERCE_CODE : "597055555532", // integración
        isProduction
            ? process.env.TBK_API_KEY_SECRET
            : "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C", // integración
        isProduction ? Environment.Production : Environment.Integration
    )
);

exports.handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({ message: "Método no permitido" }),
        };
    }

    try {
        console.log("📦 event.body recibido:", event.body);
        const body = JSON.parse(event.body || "{}");
        const { token_ws, email } = body;

        if (!token_ws) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ message: "Falta token_ws" }),
            };
        }

        // 🔹 Confirmar transacción con Transbank
        let response;
        try {
            response = await tx.commit(token_ws);
            console.log("✅ Respuesta commit:", response);
        } catch (commitErr) {
            console.error("❌ Error en tx.commit:", commitErr);

            const detail =
                commitErr?.response?.data?.detail ||
                commitErr?.message ||
                "Error desconocido";

            // Caso abortada → devolvemos controlado
            if (detail.includes("aborted")) {
                return {
                    statusCode: 200,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        status: "ABORTED",
                        message:
                            "La transacción fue abortada por el usuario o no se finalizó en Webpay",
                        detail,
                    }),
                };
            }

            // Otros errores → error real
            return {
                statusCode: 502,
                headers: corsHeaders,
                body: JSON.stringify({
                    message: "Error en commit con Transbank",
                    detail,
                }),
            };
        }

        // 🔹 Guardar en S3 solo si está autorizada
        if (response.status === "AUTHORIZED") {
            try {
                const s3Data = await s3
                    .getObject({ Bucket: BUCKET_NAME, Key: FILE_KEY })
                    .promise();

                const workbook = XLSX.read(s3Data.Body, { type: "buffer" });
                const hoja = workbook.Sheets[workbook.SheetNames[0]];
                const datos = XLSX.utils.sheet_to_json(hoja, { defval: "" });

                // Validar duplicados
                const existe = datos.some(
                    (r) => r.BuyOrder === response.buy_order || r.TokenWS === token_ws
                );

                if (existe) {
                    console.log(
                        "⚠️ Reserva duplicada detectada, no se agrega de nuevo:",
                        response.buy_order
                    );
                } else {
                    const nuevaReserva = {
                        IdReserva: datos.length + 1,
                        Email: email || "N/D",
                        BuyOrder: response.buy_order,
                        SessionId: response.session_id,
                        TokenWS: token_ws,
                        Amount: response.amount,
                        Status: response.status,
                        AuthorizationCode: response.authorization_code,
                        PaymentType: response.payment_type_code,
                        InstallmentsNumber: response.installments_number || 0,
                        CardNumber: response.card_detail?.card_number || "",
                        TransactionDate: response.transaction_date,
                        AccountingDate: response.accounting_date,
                        ResponseCode: response.response_code,
                        CommerceCode: response.commerce_code,
                        Environment: isProduction ? "Production" : "Integration",
                        CreatedAt: new Date().toISOString(),
                    };

                    datos.push(nuevaReserva);
                    console.log("🆕 Reserva agregada:", nuevaReserva);

                    const nuevaHoja = XLSX.utils.json_to_sheet(datos);
                    workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
                    const buffer = XLSX.write(workbook, {
                        type: "buffer",
                        bookType: "xlsx",
                    });

                    console.log("⏫ Subiendo Reservas.xlsx a S3...");
                    await s3
                        .putObject({
                            Bucket: BUCKET_NAME,
                            Key: FILE_KEY,
                            Body: buffer,
                            ContentType:
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        })
                        .promise();
                    console.log("✅ Subida completada");
                }
            } catch (s3Err) {
                console.error("❌ Error guardando en S3:", s3Err);
                return {
                    statusCode: 500,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        message: "Error guardando la reserva en S3",
                        detail: s3Err.message || s3Err,
                    }),
                };
            }
        }

        // 🔹 Siempre responder con el resultado de Transbank
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ ...response, email }),
        };
    } catch (error) {
        console.error("❌ Error inesperado:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: "Error inesperado en agregarReserva",
                detail: error.message || error,
            }),
        };
    }
};
