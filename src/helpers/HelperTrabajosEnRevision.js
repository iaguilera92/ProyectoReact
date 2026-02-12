import * as XLSX from "xlsx";

export const cargarTrabajosEnRevision = async (urlExcel) => {
  try {
    const response = await fetch(urlExcel);

    if (!response.ok) throw new Error("No se pudo obtener el archivo Excel");

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(hoja);

    const trabajos = jsonData.map((row) => ({
      Id: Number(row["Id"]) || 0,
      Negocio: row["Negocio"] || "",
      EmailCliente: row["EmailCliente"] || "",
      TelefonoCliente: row["TelefonoCliente"] || "",
      Porcentaje: Number(row["Porcentaje"]) || 0,
      Estado: Number(row["Estado"]) || 1,
      Revision: Number(row["Revision"]) || 0,
      FechaCreacion: row["FechaCreacion"] || ""
    }));



    return trabajos;
  } catch (error) {
    console.error("❌ Error al cargar trabajos en revisión:", error);
    return [];
  }
};


export const obtenerTextoEstado = (estado) => {
  if (estado === 1) return "En revisión";
  if (estado === 2) return "Completado";
  return "Desconocido";
};

export const obtenerColorEstado = (estado) => {
  if (estado === 1) return "warning";
  if (estado === 2) return "success";
  return "default";
};
