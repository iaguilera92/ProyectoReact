const { google } = require("googleapis");

exports.handler = async function (event, context) {
  try {
    // Token de acceso almacenado como variable de entorno (Netlify lo maneja vía OAuth)
    const accessToken = process.env.GOOGLE_ACCESS_TOKEN;

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    const response = await analyticsDataClient.properties.runReport({
      property: "properties/485494483", // ✅ Tu GA4 property ID
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      },
    });

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
      body: JSON.stringify({ message: "Error al obtener estadísticas" }),
    };
  }
};
