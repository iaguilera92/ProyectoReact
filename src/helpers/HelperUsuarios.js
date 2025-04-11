import * as XLSX from "xlsx";
import bcrypt from "bcryptjs";

export const cargarUsuariosDesdeExcel = async () => {
  try {
    const response = await fetch(`/database/Usuarios.xlsx?v=${Date.now()}`); // 👈 evita cache
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

// 🔐 Validar con comparación de hash
export const validarCredenciales = async (usuarioIngresado, claveIngresada) => {
  const usuarios = await cargarUsuariosDesdeExcel();

  for (const u of usuarios) {
    if (
      u.usuario?.toString().trim().toLowerCase() === usuarioIngresado.trim().toLowerCase()
    ) {
      const esValido = await bcrypt.compare(claveIngresada, u.password?.toString().trim());
      if (esValido) return u; // autenticación exitosa
    }
  }

  return null; // usuario no encontrado o contraseña incorrecta
};
