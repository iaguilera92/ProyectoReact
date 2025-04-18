// src/helpers/HelperServicios.js
import * as XLSX from "xlsx";

export const cargarServicios = async (rutaExcel = "/database/Servicios.xlsx") => {
  const response = await fetch(rutaExcel);
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });

  const hoja = workbook.Sheets[workbook.SheetNames[0]];
  const datos = XLSX.utils.sheet_to_json(hoja);

  const serviciosAgrupados = {};

  datos.forEach((row) => {
    const key = row["Service Title"];

    if (!serviciosAgrupados[key]) {
      serviciosAgrupados[key] = {
        title: row["Service Title"],
        img: row["Service Image"],
        link: row["Service Link"] || "",
        description: row["Service Description"],
        background: row["Service Background"],
        iconName: row["Service Icon"],
        sections: [],
      };
    }

    serviciosAgrupados[key].sections.push({
      title: row["Section Title"],
      description: row["Section Description"],
      image: row["Section Image"],
      items: row["Section Items"]
        ? row["Section Items"].split(/\r?\n/).map((i) => i.trim()).filter(Boolean)
        : [],
    });
  });

  return Object.values(serviciosAgrupados);
};
