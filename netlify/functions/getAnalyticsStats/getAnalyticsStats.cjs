import { google } from "googleapis";

export async function handler(event, context) {
  try {
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("Access Token no definido. Revisa GOOGLE_ACCESS_TOKEN en Netlify.");
    }

    console.log("✅ Access Token detectado");

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsDataClient.properties.runReport({
      property: "properties/485494483", // Reemplaza con tu property ID real
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      },
    });

    console.log("📊 Respuesta recibida de GA:");
    console.log(JSON.stringify(response.data, null, 2));

    const totals = {
      chile: 0,
      internacional: 0,
    };

    response.data?.rows?.forEach((row) => {
      const country = row.dimensionValues[0]?.value;
      const value = parseInt(row.metricValues[0]?.value || "0", 10);

      if (country === "Chile") {
        totals.chile += value;
      } else {
        totals.internacional += value;
      }
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ permite solicitudes desde cualquier origen
      },
      body: JSON.stringify({
        chile: totals.chile,
        internacional: totals.internacional,
        total: totals.chile + totals.internacional,
      }),
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // ✅ también en el error
      },
      body: JSON.stringify({ message: "Error al obtener estadísticas" }),
    };
  }
}