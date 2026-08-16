const { createClient } = require("@supabase/supabase-js");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ message: "Método no permitido" }) };
  }

  const apiKey = event.headers["x-api-key"];
  if (process.env.QAS_API_KEY && apiKey !== process.env.QAS_API_KEY) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ message: "No autorizado" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { pipeline_id, estado, total_tests, tests_passed, tests_failed, duracion_ms, detalle, origen } = body;

    if (!pipeline_id || !estado) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "Faltan campos: pipeline_id, estado" }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data, error } = await supabase
      .from("pruebas_qas")
      .insert([{ pipeline_id, estado, total_tests, tests_passed, tests_failed, duracion_ms, detalle, origen: origen || "azure" }])
      .select()
      .single();

    if (error) throw error;

    return { statusCode: 201, headers: corsHeaders, body: JSON.stringify({ message: "Resultado guardado", data }) };
  } catch (err) {
    console.error("Error guardarPruebasQAS:", err);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: "Error interno" }) };
  }
};
