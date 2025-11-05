import * as XLSX from "xlsx";

export const cargarClientesDesdeExcel = async () => {
  const urlExcel = `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Clientes.xlsx?t=${Date.now()}`;

  try {
    const response = await fetch(urlExcel, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

    if (!response.ok) throw new Error("No se pudo obtener el archivo Excel");

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    // Normaliza claves del objeto a minúsculas
    const normalizarClave = (obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));

    return jsonData.map((c) => {
      const row = normalizarClave(c);

      return {
        idCliente: row.idcliente || "",
        cliente: row.cliente?.trim() || "",
        sitioWeb: row.sitioweb?.trim() || "",
        url: row.url?.trim() || "",
        telefono: row.telefono?.toString() || "",
        correo: row.correo?.trim() || "",
        pagado: row.pagado === 1 || row.pagado === "1",
        valor: row.valor?.toString().replace(/\r?\n|\r/g, "").trim() || "$0",
        fechaPago: row.fechapago || "",
        estado: row.estado === 1 || row.estado === "1",
        logoCliente: row.logocliente?.trim() || "",

        // 🧾 Datos de suscripción
        suscripcion:
          row.suscripcion === 1 ||
          row.suscripcion === "1" ||
          String(row.suscripcion).trim().toLowerCase() === "true",

        // 💳 Campos adicionales para OneClick
        tbk_user: row.tbk_user?.trim() || "",
        tarjeta: row.tarjeta?.trim() || "",
        tipo_tarjeta: row.tipo_tarjeta?.trim() || "",
      };
    });
  } catch (error) {
    console.error("❌ Error al cargar clientes desde el Excel:", error);
    return [];
  }
};
