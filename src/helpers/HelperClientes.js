import * as XLSX from "xlsx";

// 📦 Cargar clientes desde Excel
export const cargarClientesDesdeExcel = async () => {
  try {
    const response = await fetch(`/database/Clientes.xlsx?v=${Date.now()}`);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data;
  } catch (error) {
    console.error("Error al cargar Clientes.xlsx:", error);
    return [];
  }
};

// 🔍 Buscar cliente por RUT o ID
export const buscarCliente = async ({ rut, id }) => {
  const clientes = await cargarClientesDesdeExcel();

  return clientes.find(c => {
    const rutMatch = rut ? c.rut?.toString().trim() === rut.toString().trim() : true;
    const idMatch = id ? c.id?.toString().trim() === id.toString().trim() : true;
    return rutMatch && idMatch;
  }) || null;
};
