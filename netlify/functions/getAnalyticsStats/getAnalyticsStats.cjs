require("dotenv").config();
const path = require("path");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

exports.handler = async function (event) {

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

        const [res] = await client.runReport({
            property: "properties/485494483",
            dateRanges: [{ startDate: "2020-01-01", endDate: "today" }],
            dimensions: [
                { name: "country" },
                { name: "deviceCategory" },
            ],
            metrics: [{ name: "screenPageViews" }],
            dimensionFilter: {
                filter: {
                    fieldName: "eventName",
                    stringFilter: {
                        matchType: "EXACT",
                        value: "page_view",
                    },
                },
            },
        });

        const visitas = {
            chile: { mobile: 0, desktop: 0, tablet: 0 },
            internacional: { mobile: 0, desktop: 0, tablet: 0 },
        };

        res.rows?.forEach((row) => {

            const country = row.dimensionValues[0]?.value || "unknown";
            const device = (row.dimensionValues[1]?.value || "").toLowerCase();
            const value = parseInt(row.metricValues[0]?.value, 10) || 0;

            if (country.toLowerCase().includes("chile")) {
                if (visitas.chile[device] !== undefined) {
                    visitas.chile[device] += value;
                }
            } else {
                if (visitas.internacional[device] !== undefined) {
                    visitas.internacional[device] += value;
                }
            }
        });

        const totalChile =
            visitas.chile.mobile +
            visitas.chile.desktop +
            visitas.chile.tablet;

        const totalInternacional =
            visitas.internacional.mobile +
            visitas.internacional.desktop +
            visitas.internacional.tablet;

        const totalGeneral = totalChile + totalInternacional;

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store",
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
