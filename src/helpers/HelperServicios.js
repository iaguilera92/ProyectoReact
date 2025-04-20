import * as XLSX from "xlsx";

// Función para agrupar por IdServicio
function agruparPorServicio(data) {
  const serviciosMap = new Map();

  for (const row of data) {
    const id = row["IdServicio"];
    if (!serviciosMap.has(id)) {
      serviciosMap.set(id, {
        IdServicio: id,
        title: row["Service Title"],
        img: row["Service Image"],
        link: row["Service Link"],
        description: row["Service Description"],
        background: row["Service Background"],
        iconName: row["Service Icon"],
        orden: Number(row["Orden"]) || 0,
        sections: [],
      });
    }

    serviciosMap.get(id).sections.push({
      title: row["Section Title"],
      description: row["Section Description"],
      image: row["Section Image"],
      items: row["Section Items"] ? row["Section Items"].split(";").map(s => s.trim()) : [],
    });
  }

  // Convertimos a array y ordenamos por la propiedad Orden
  return Array.from(serviciosMap.values()).sort((a, b) => a.orden - b.orden);
}

export const cargarServicios = async (urlExcel) => {
  try {
    const response = await fetch(urlExcel);
    if (!response.ok) throw new Error("No se pudo obtener el archivo Excel");

    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });

    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(hoja);

    return agruparPorServicio(jsonData);
  } catch (error) {
    console.error("❌ Error al cargar servicios desde el Excel:", error);
    return [];
  }
};
