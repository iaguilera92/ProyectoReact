require("dotenv").config();
const path = require("path");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

exports.handler = async function (event, context) {
  // ✅ Manejar preflight OPTIONS para CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "OK",
    };
  }

  try {
    // ✅ Crear el cliente dependiendo de si hay variable de entorno o no
    const client = process.env.GOOGLE_CREDENTIALS_JSON
      ? new BetaAnalyticsDataClient({
        credentials: (() => {
          const raw = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
          raw.private_key = raw.private_key.replace(/\\n/g, '\n');
          return raw;
        })(),
      })
      : new BetaAnalyticsDataClient({
        keyFilename: path.join(__dirname, "credentials.json"),
      });

    console.log("Ejecutando runReport con cuenta de servicio...");

    const [response] = await client.runReport({
      property: "properties/485494483",
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }],
    });

    console.log("Respuesta recibida:", JSON.stringify(response, null, 2));

    const totals = {
      chile: 0,
      internacional: 0,
    };

    response.rows.forEach((row) => {
      const country = row.dimensionValues[0].value;
      const value = parseInt(row.metricValues[0].value, 10);
      if (country === "Chile") {
        totals.chile += value;
      } else {
        totals.internacional += value;
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        chile: totals.chile,
        internacional: totals.internacional,
        total: totals.chile + totals.internacional,
      }),
    };
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: `Error: ${error.message}` }),
    };
  }
};
