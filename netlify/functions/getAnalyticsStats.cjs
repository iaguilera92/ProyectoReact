// netlify/functions/getAnalyticsStats.cjs
require("dotenv").config();
const path = require("path");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// ⚡ Variable de control
const modoDesarrollo = false; // true = simula error / false = GA activo

exports.handler = async function (event, context) {
  // CORS preflight
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

  // 🚧 Modo desarrollo (sin GA)
  if (modoDesarrollo) {
    console.log("⚡ MODO DESARROLLO → GA deshabilitado");
    return {
      statusCode: 404,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Google Analytics no disponible en modo desarrollo",
      }),
    };
  }

  try {
    // 🔐 Cliente GA
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

    console.log("▶️ Ejecutando GA4: usuarios únicos por país y dispositivo");

    // 📊 REPORTE PRINCIPAL
    const [res] = await client.runReport({
      property: "properties/485494483",
      dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
      dimensions: [
        { name: "country" },
        { name: "deviceCategory" },
      ],
      metrics: [{ name: "totalUsers" }], // 👈 CLAVE
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

    // 🧮 Estructura de salida
    const visitas = {
      chile: { mobile: 0, desktop: 0, tablet: 0 },
      internacional: { mobile: 0, desktop: 0, tablet: 0 },
    };

    res.rows?.forEach((row) => {
      const country = row.dimensionValues[0].value;
      const device = row.dimensionValues[1].value;
      const value = parseInt(row.metricValues[0].value, 10) || 0;

      if (country === "Chile") {
        if (visitas.chile[device] !== undefined) {
          visitas.chile[device] += value;
        }
      } else {
        if (visitas.internacional[device] !== undefined) {
          visitas.internacional[device] += value;
        }
      }
    });

    // 🧾 Totales
    const totalChile =
      visitas.chile.mobile +
      visitas.chile.desktop +
      visitas.chile.tablet;

    const totalInternacional =
      visitas.internacional.mobile +
      visitas.internacional.desktop +
      visitas.internacional.tablet;

    const totalGeneral = totalChile + totalInternacional;

    console.log("✅ GA4 OK → Usuarios únicos calculados");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        chile: {
          ...visitas.chile,
          total: totalChile,
        },
        internacional: {
          ...visitas.internacional,
          total: totalInternacional,
        },
        total: totalGeneral,
      }),
    };
  } catch (error) {
    console.error("❌ Error GA4");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: `Error GA4: ${error.message}`,
      }),
    };
  }
};
