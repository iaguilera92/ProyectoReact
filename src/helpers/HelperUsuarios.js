import * as XLSX from "xlsx";

// Función para leer el archivo Excel desde /public/database
export const cargarUsuariosDesdeExcel = async () => {
  try {
    const response = await fetch("/database/Usuarios.xlsx"); // ✅ nueva ruta
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    return data;
  } catch (error) {
    console.error("Error al cargar el archivo Excel:", error);
    return [];
  }
};

// Validación de credenciales
export const validarCredenciales = async (usuarioIngresado, claveIngresada) => {
  const usuarios = await cargarUsuariosDesdeExcel();

  return usuarios.find(
    (u) =>
      u.usuario?.toString().trim().toLowerCase() === usuarioIngresado.trim().toLowerCase() &&
      u.password?.toString().trim() === claveIngresada.trim()
  );
};
