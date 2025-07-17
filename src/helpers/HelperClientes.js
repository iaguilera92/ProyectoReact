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
    const jsonData = XLSX.utils.sheet_to_json(hoja);

    return jsonData.map((c) => ({
      idCliente: c.idCliente || "",                         // ✅ ID del cliente
      cliente: c.cliente?.trim() || "",
      sitioWeb: c.sitioWeb?.trim() || "",                        // ✅ Nombre del cliente
      url: c.url?.trim() || "",                        // URL del sitio
      telefono: c.telefono?.toString() || "",               // Teléfono
      correo: c.correo?.trim() || "",                       // Email
      pagado: c.pagado === 1 || c.pagado === "1",           // Boolean pagado
      valor: c.valor?.toString().replace(/\r?\n|\r/g, "").trim() || "$0", // Monto
      fechaPago: c.fechaPago || "",                         // Fecha (si aplica)
      estado: c.estado === 1 || c.estado === "1",           // Boolean activo
    }));
  } catch (error) {
    console.error("❌ Error al cargar clientes desde el Excel:", error);
    return [];
  }
};
