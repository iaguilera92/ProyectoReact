import { google } from "googleapis";

export async function handler(event, context) {
  // ✅ Manejar preflight OPTIONS (opcional, útil para POST en el futuro)
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
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;
    console.log("Access Token recibido:", accessToken);

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    console.log("Ejecutando runReport...");

    const response = await analyticsDataClient.properties.runReport({
      property: "properties/485494483", // Reemplaza si es necesario
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      },
    });

    console.log("Respuesta recibida:", JSON.stringify(response.data, null, 2));

    const totals = {
      chile: 0,
      internacional: 0,
    };

    response.data.rows.forEach((row) => {
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
}
