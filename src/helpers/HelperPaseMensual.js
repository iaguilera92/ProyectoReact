// 📂 helpers/HelperPaseMensual.js
import * as XLSX from "xlsx";

// 🔗 Mapeo entre IDs y columnas del Excel
const misionMap = {
  1: { campo: "CompartirAnuncio", campoEstado: "CompartirAnuncioEstado" },
  2: { campo: "PagarSuscripcionAntes", campoEstado: "PagarSuscripcionAntesEstado" },
  3: { campo: "ConexionMensual", campoEstado: "ConexionMensualEstado" },
  4: { campo: "VisitasMensual", campoEstado: "VisitasMensualEstado" },
  5: { campo: "ConseguirCliente", campoEstado: "ConseguirClienteEstado" },
};

// 🧹 Normaliza dominios: quita protocolo, www y paths/puertos
const normalizeHost = (v) =>
  String(v || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "") // corta path
    .replace(/:\d+$/, "") // corta puerto
    .trim();

// 🔢 Parseo robusto a entero
const toInt = (v, fallback = 0) => {
  if (v === null || v === undefined || v === "") return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Carga y transforma los datos del Pase Mensual desde Excel (S3).
 * @param {string} urlExcel  URL pública de S3
 * @param {Array} misionesBase  Estado base (const inicial)
 * @param {boolean} debug  Loguea a consola lo leído
 * @param {string} sitioOverride  (opcional) fuerza el SitioWeb en vez de window.location
 */
export const cargarPaseMensual = async (
  urlExcel,
  misionesBase,
  debug = false,
  sitioOverride = null
) => {
  try {
    const resp = await fetch(`${urlExcel}?t=${Date.now()}`);
    if (!resp.ok) throw new Error("❌ No se pudo obtener el archivo Excel");

    const buffer = await resp.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    if (data.length === 0) return { misiones: misionesBase, fechaEdicion: "" };

    const dominioActual = sitioOverride
      ? normalizeHost(sitioOverride)
      : normalizeHost(window.location.hostname);

    const fila = data.find(
      (row) => normalizeHost(row["SitioWeb"]) === dominioActual
    );

    if (!fila) {
      console.warn(`⚠️ No se encontró fila para ${dominioActual}`);
      return { misiones: misionesBase, fechaEdicion: "" };
    }

    const misionesActualizadas = misionesBase.map((m) => {
      const { campo, campoEstado } = misionMap[m.id];
      const estadoAdmin = toInt(fila[campoEstado], 0);
      const valorUsuario = toInt(fila[campo], 0);

      let estado = "pendiente";
      if (estadoAdmin === 1) {
        estado = "aprobado";
      } else if (estadoAdmin === 2) {
        estado = "rechazado";
      } else if (valorUsuario === 1) {
        estado = "revision";
      }

      if (debug) {
        console.log(
          `📝 ${m.titulo}: campo=${valorUsuario}, estadoCol=${estadoAdmin} → ${estado}`
        );
      }

      return { ...m, estado };
    });

    return {
      misiones: misionesActualizadas,
      fechaEdicion: fila["FechaEdicion"] || "",
    };
  } catch (error) {
    console.error("❌ Error cargando Pase Mensual desde Excel:", error);
    return { misiones: misionesBase, fechaEdicion: "" };
  }
};
