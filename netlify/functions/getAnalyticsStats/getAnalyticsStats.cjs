// netlify/functions/getAnalyticsStats.cjs
require("dotenv").config();
const path = require("path");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// ⚡ Variable de control
const modoDesarrollo = false; // cambia a false en producción

exports.handler = async function (event, context) {
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

  // 🚨 Si estamos en modo desarrollo, simulamos que GA no existe
  if (modoDesarrollo) {
    console.log("⚡ MODO DESARROLLO ACTIVADO → devolviendo 404 sin GA");
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Google Analytics no disponible en modo desarrollo",
      }),
    };
  }

  try {
    const client = process.env.GOOGLE_CREDENTIALS_JSON
      ? new BetaAnalyticsDataClient({
        credentials: (() => {
          const raw = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
          raw.private_key = raw.private_key.replace(/\\n/g, "\n");
          return raw;
        })(),
      })
      : new BetaAnalyticsDataClient({
        keyFilename: path.join(__dirname, "credentials.json"),
      });

    console.log("▶️ Ejecutando runReport por país (screenPageViews)...");

    const [resPais] = await client.runReport({
      property: "properties/485494483",
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      dimensions: [{ name: "country" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pageLocation",
          stringFilter: {
            matchType: "CONTAINS",
            value: "plataformas-web.cl",
          },
        },
      },
    });

    const visitas = {
      chile: 0,
      internacional: 0,
    };

    resPais.rows?.forEach((row) => {
      const country = row.dimensionValues[0].value;
      const value = parseInt(row.metricValues[0].value, 10);
      if (country === "Chile") visitas.chile += value;
      else visitas.internacional += value;
    });

    console.log("✅ Ejecutando runReport por dispositivo (screenPageViews)...");

    const [resDispositivos] = await client.runReport({
      property: "properties/485494483",
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "screenPageViews" }],
      dimensionFilter: {
        filter: {
          fieldName: "pageLocation",
          stringFilter: {
            matchType: "CONTAINS",
            value: "plataformas-web.cl",
          },
        },
      },
    });

    const dispositivos = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
    };

    resDispositivos.rows?.forEach((row) => {
      const device = row.dimensionValues[0].value;
      const value = parseInt(row.metricValues[0].value, 10);
      if (device === "mobile") dispositivos.mobile += value;
      else if (device === "desktop") dispositivos.desktop += value;
      else if (device === "tablet") dispositivos.tablet += value;
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        chile: visitas.chile,
        internacional: visitas.internacional,
        total: visitas.chile + visitas.internacional,
        dispositivos: {
          mobile: dispositivos.mobile,
          desktop: dispositivos.desktop,
          tablet: dispositivos.tablet,
          total:
            dispositivos.mobile + dispositivos.desktop + dispositivos.tablet,
        },
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
