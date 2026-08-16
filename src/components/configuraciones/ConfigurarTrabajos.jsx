import React, { useEffect, useState, useRef } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, IconButton, Snackbar, Alert, Container, Paper, Slider, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DialogAgregarTrabajo from "./DialogAgregarTrabajo";
import DialogTrabajoTerminado from "./DialogTrabajoTerminado";
import { CircularProgress } from "@mui/material";
import emailjs from "emailjs-com";
import { supabase } from "../../supabase/client";

const devStatus = (msg) => window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: msg } }));

const ActionButton = ({ title, color, onClick, icon, compact = false }) => (
  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
    <Tooltip title={title}>
      <IconButton
        size="small"
        color={color}
        onClick={onClick}
        sx={{
          "& svg": { fontSize: compact ? 20 : 28 },
          p: compact ? 0.25 : 0.6,
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  </motion.div>
);
const ConfigurarTrabajos = () => {
  const nombreUsuario = React.useMemo(() => {
    try {
      const u = JSON.parse(sessionStorage.getItem("usuario") || "{}");
      const n = u.nombre;
      if (!n || n.includes("@")) return "Administrador";
      return n;
    } catch { return "Administrador"; }
  }, []);
  const [trabajos, setTrabajos] = useState([]);
  const [dbStatus, setDbStatus] = useState("loading");
  const [dbDetail, setDbDetail] = useState("conectando...");
  const [pendingChanges, setPendingChanges] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "340px";
  const [openDialogAgregar, setOpenDialogAgregar] = useState(false);
  const [trabajoAEditar, setTrabajoAEditar] = useState(null);
  const [loadingSave, setLoadingSave] = useState(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [loadingSaveAll, setLoadingSaveAll] = useState(false);
  const [loadingDialogAction, setLoadingDialogAction] = useState(null);
  const { temaOscuro, forzarPrd } = useOutletContext();
  const [mostrarTextoAgregarTrabajo, setMostrarTextoAgregarTrabajo] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [dialogFinalizar, setDialogFinalizar] = useState({
    open: false,
    trabajo: null,
  });

  // Función para decidir gradiente según avance
  const getGradient = (val) => {
    if (val < 20) return "linear-gradient(90deg,#ff8a80,#e57373)"; // rojo suave
    if (val < 30) return "linear-gradient(90deg,#ef5350,#e53935)"; // rojo fuerte
    if (val < 70) return "linear-gradient(90deg,#ffb74d,#fb8c00)"; // naranjo
    return "linear-gradient(90deg,#81c784,#388e3c)"; // verde
  };

  const [dialog, setDialog] = useState({
    open: false,
    sitioWeb: "",
    trabajo: null,
  });

  const abrirDialog = (trabajo) => {
    setDialog({
      open: true,
      sitioWeb: trabajo.SitioWeb,
      trabajo,
    });
  };

  const cerrarDialog = () => {
    setDialog({ open: false, sitioWeb: "", trabajo: null });
  };

  const handleEliminar = async () => {
    try {
      setLoadingDialogAction("eliminar"); // 🔒 marca acción

      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/eliminarTrabajo`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ SitioWeb: dialog.sitioWeb }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar");

      await fetchTrabajos();
      setSnackbar({ open: true, type: "success", message: "Trabajo eliminado" });
      cerrarDialog();
    } catch (err) {
      console.error("❌ Error al eliminar:", err);
      setSnackbar({ open: true, type: "error", message: "Error al eliminar" });
    } finally {
      setLoadingDialogAction(null); // 🔓 libera
    }
  };

  const handleDeshabilitar = async () => {
    try {
      setLoadingDialogAction("deshabilitar"); // 🔒 marca acción

      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/actualizarTrabajo`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ SitioWeb: dialog.sitioWeb, nuevoEstado: 0 }), // 👈 corregido
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al deshabilitar");

      await fetchTrabajos();
      setSnackbar({ open: true, type: "success", message: "Trabajo deshabilitado" });
      cerrarDialog();
    } catch (err) {
      console.error("❌ Error al deshabilitar:", err);
      setSnackbar({ open: true, type: "error", message: "Error al deshabilitar" });
    } finally {
      setLoadingDialogAction(null); // 🔓 libera
    }
  };

  const agregarTrabajo = () => {
    setTrabajoAEditar(null);
    setOpenDialogAgregar(true);
  };

  const editarTrabajo = (trabajo) => {
    setTrabajoAEditar(trabajo);
    setOpenDialogAgregar(true);
  };

  useEffect(() => {
    fetchTrabajos();
  }, []);

  useEffect(() => {
    if (trabajos.length > 0)
      console.log("✅ Conectado a Supabase — trabajos:", JSON.stringify(trabajos, null, 2));
  }, [trabajos]);

  const trabajosOrdenados = [...trabajos].sort((a, b) => {
    const aListo = Number(a.Porcentaje) === 100 ? 1 : 0;
    const bListo = Number(b.Porcentaje) === 100 ? 1 : 0;
    return aListo - bListo; // los listos al final
  });

  const trabajosPorPagina = 9;
  const indiceInicio = (paginaActual - 1) * trabajosPorPagina;
  const indiceFin = indiceInicio + trabajosPorPagina;
  const trabajosPaginados = trabajosOrdenados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(trabajosOrdenados.length / trabajosPorPagina);
  const mostrarPaginacion = totalPaginas > 1;

  const renderPaginacion = () => (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        gap: 1,
      }}
    >
      <Button
        variant="outlined"
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual((p) => p - 1)}
        sx={{
          color: temaOscuro ? "white" : "#111",
          borderColor: temaOscuro ? "white" : "#111",
          "&:hover": { borderColor: "#E95420", backgroundColor: "#E95420", color: "#fff" },
        }}
      >
        Anterior
      </Button>
      <Typography variant="body2" sx={{ color: temaOscuro ? "white" : "#111" }}>
        Página {paginaActual} de {totalPaginas}
      </Typography>
      <Button
        variant="outlined"
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual((p) => p + 1)}
        sx={{
          color: temaOscuro ? "white" : "#111",
          borderColor: temaOscuro ? "white" : "#111",
          "&:hover": { borderColor: "#E95420", backgroundColor: "#E95420", color: "#fff" },
        }}
      >
        Siguiente
      </Button>
    </Box>
  );

  useEffect(() => {
    if (totalPaginas > 0 && paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [totalPaginas, paginaActual]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarTextoAgregarTrabajo(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);



  const handleSaveTrabajo = async (nuevoTrabajo) => {

    await fetchTrabajos();  // 🔄 ahora sí carga versión fresca del Excel

    setSnackbar({ open: true, message: "Trabajo agregado con éxito", type: "success" });
    setOpenDialogAgregar(false);
  };

  const fetchTrabajos = async () => {
    try {
      // 👇 siempre un timestamp nuevo para evitar caché
      const resp = await fetch(
        `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Trabajos.xlsx?t=${Date.now()}`
      );
      const buffer = await resp.arrayBuffer();
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(hoja, { defval: "" });
      setTrabajos(data);
      setDbStatus("ok");
      setDbDetail(`${data.length} registros · ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error("❌ Error cargando trabajos:", error);
      setDbStatus("error");
      setDbDetail(error.message || "Error desconocido");
    }
  };

  const handleChange = (sitioWeb, field, value) => {
    setPendingChanges((prev) => ({
      ...prev,
      [sitioWeb]: { ...(prev[sitioWeb] || {}), [field]: value },
    }));
  };

  //BOTÓN GUARDAR
  const handleGuardarClick = (trabajo) => {
    if (trabajo.Porcentaje === 100) {
      setDialogFinalizar({ open: true, trabajo });
    } else {
      guardarCambios(trabajo);
    }
  };

  const guardarCambios = async (trabajo) => {
    try {
      setLoadingSaveAll(true);
      devStatus("Guardando trabajo...");

      const { error } = await supabase
        .from("trabajos")
        .update({
          porcentaje: Number(trabajo.Porcentaje),
          estado: Number(trabajo.Estado),
        })
        .eq("sitio_web", trabajo.SitioWeb);

      if (error) throw new Error(error.message);

      setTrabajos((prev) =>
        prev.map((t) =>
          t.SitioWeb === trabajo.SitioWeb
            ? { ...t, Porcentaje: Number(trabajo.Porcentaje), Estado: Number(trabajo.Estado) }
            : t
        )
      );
      setPendingChanges((prev) => {
        const next = { ...prev };
        delete next[trabajo.SitioWeb];
        return next;
      });
      setSnackbar({ open: true, type: "success", message: "Trabajo actualizado correctamente." });
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setSnackbar({ open: true, type: "error", message: "Error al guardar cambios" });
    } finally {
      setLoadingSaveAll(false);
      devStatus("");
    }
  };

  //BOTÓN RESTAURAR
  const restaurarTrabajo = async (trabajo) => {
    try {
      setLoadingSaveAll(true); // 🔒 bloquea toda la tabla

      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/actualizarTrabajo`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SitioWeb: trabajo.SitioWeb, // identificador en Excel
          nuevoEstado: 1,             // 👈 corregido
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al restaurar");
      }

      console.log("✅ Trabajo restaurado:", data);
      await fetchTrabajos(); // refresca tabla
      setSnackbar({ open: true, type: "success", message: "Trabajo restaurado correctamente" });
    } catch (error) {
      console.error("❌ Error al restaurar:", error);
      setSnackbar({ open: true, type: "error", message: "Error al restaurar" });
    } finally {
      setLoadingSaveAll(false); // 🔓 libera la tabla
    }
  };

  // CONFIRMACIÓN + CORREO
  const handleEnviarCorreo = async () => {
    const hoy = new Date();
    const fecha = `${String(hoy.getDate()).padStart(2, "0")}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${hoy.getFullYear()}`;

    const params = {
      sitioWeb: dialogFinalizar.trabajo?.SitioWeb || "plataformas-web.cl",
      nombre: dialogFinalizar.trabajo?.NombreCliente || "Ignacio",
      logoCliente:
        dialogFinalizar.trabajo?.LogoCliente ||
        "https://plataformas-web.cl/logo-plataformas-web-correo.png",
      email:
        dialogFinalizar.trabajo?.EmailCliente ||
        "plataformas.web.cl@gmail.com",
      fechaEntrega: fecha,
      cc: "plataformas.web.cl@gmail.com",
    };

    try {
      await emailjs.send(
        "service_tbh6hwi",
        "template_yowj1al",
        params,
        "lwCAuhptLOofypnhx"
      );
      console.log("✅ Correo enviado correctamente a:", params.email, "(CC:", params.cc, ")");
    } catch (error) {
      console.error("❌ Error al enviar correo (template_yowj1al):", error);
      console.error("   status:", error?.status);
      console.error("   text:", error?.text);
      console.error("   params enviados:", params);
    }
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", pb: 4, px: { xs: 1, md: 4 }, pt: 2 }}>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SettingsSuggestIcon sx={{ color: temaOscuro ? "rgba(255,255,255,0.7)" : "#1b263b", fontSize: 22 }} />
          <Typography variant="h6" sx={{ color: temaOscuro ? "#fff" : "#1b263b", fontWeight: 700, fontSize: "1.1rem" }}>
            Configurar trabajos
          </Typography>
        </Box>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="contained"
            startIcon={mostrarTextoAgregarTrabajo ? <AddIcon /> : <AddIcon />}
            onClick={agregarTrabajo}
            sx={{
              bgcolor: "#8B0000",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRadius: 2,
              px: 2,
              boxShadow: "0 2px 10px rgba(139,0,0,0.35)",
              "&:hover": { bgcolor: "#a00000" },
            }}
          >
            Nuevo trabajo
          </Button>
        </motion.div>
      </Box>

        {/* Cards de trabajos */}
        <Box sx={{ position: "relative" }}>
          {mostrarPaginacion && renderPaginacion()}

          <Box
            sx={{
              display: { xs: "flex", md: "grid" },
              flexDirection: "column",
              gridTemplateColumns: { md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" },
              gap: { xs: 0.5, sm: 0.75, md: 1.5 },
              mt: mostrarPaginacion ? 1 : 0,
              opacity: loadingSaveAll ? 0.5 : 1,
              pointerEvents: loadingSaveAll ? "none" : "auto",
            }}
          >
            {trabajosPaginados.map((trabajo, index) => {
              const pending = pendingChanges[trabajo.SitioWeb] || {};
              const pct = Number(pending.Porcentaje ?? trabajo.Porcentaje);
              const listo = pct === 100;
              const activo = trabajo.Estado === 1;

              return (
                <motion.div
                  key={trabajo.SitioWeb}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      border: listo
                        ? "1px solid rgba(76,175,80,0.3)"
                        : activo
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(239,83,80,0.2)",
                      bgcolor: temaOscuro ? "#1a1a1a" : "#fff",
                      position: "relative",
                      p: { xs: 1.75, md: 2 },
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: { xs: "stretch", md: "center" },
                      gap: { xs: 1.25, md: 2 },
                      transition: "all 0.2s",
                      "&:hover": {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        "& .accent-bar": { transform: "scaleY(1)" },
                        "& .arrow-icon": { color: "#c62828" },
                      },
                    }}
                  >
                    {/* Accent bar izquierda */}
                    <Box className="accent-bar" sx={{ position: "absolute", inset: "0 auto 0 0", width: 3.5, bgcolor: listo ? "#4caf50" : "#8B0000", transform: "scaleY(0)", transformOrigin: "center", transition: "transform 0.2s", zIndex: 1 }} />

                    {/* Fila superior en mobile: ícono + título + badges */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, zIndex: 2 }}>
                      {/* Caja ícono */}
                      <Box sx={{ width: { xs: 44, md: 48 }, height: { xs: 44, md: 48 }, borderRadius: 2, bgcolor: listo ? "rgba(56,142,60,0.15)" : activo ? "rgba(139,0,0,0.18)" : "rgba(80,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.4rem" }, lineHeight: 1 }}>
                          {Number(trabajo.TipoApp || trabajo.tipoApp) === 1 ? "🌐" : "⚙️"}
                        </Typography>
                      </Box>

                      {/* Título + badges */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: { xs: 0.4, md: 0.75 } }}>
                          <Typography sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "0.9rem" }, color: temaOscuro ? "#fff" : "#111", fontFamily: "Poppins, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                            {trabajo.SitioWeb}
                          </Typography>
                          <Box sx={{ px: 0.9, py: 0.1, borderRadius: "999px", backgroundImage: getGradient(pct), flexShrink: 0 }}>
                            <Typography sx={{ fontSize: { xs: "0.7rem", md: "0.6rem" }, fontWeight: 800, color: "#fff", lineHeight: 1.7 }}>{pct}%</Typography>
                          </Box>
                          {!activo && <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.6rem" }, color: "#ef5350", fontWeight: 700, flexShrink: 0 }}>INACTIVO</Typography>}
                          {listo && activo && <Typography sx={{ fontSize: { xs: "0.68rem", md: "0.6rem" }, color: "#66bb6a", fontWeight: 700, flexShrink: 0 }}>✓ LISTO</Typography>}
                        </Box>
                        {/* Slider — solo en desktop dentro de este bloque */}
                        <Box sx={{ display: { xs: "none", md: "block" } }}>
                          <Slider
                            value={pct}
                            onChange={(_, v) => handleChange(trabajo.SitioWeb, "Porcentaje", v)}
                            step={5} min={0} max={100} size="small"
                            sx={{
                              py: "2px",
                              "& .MuiSlider-track": { backgroundImage: getGradient(pct), border: "none", height: 4 },
                              "& .MuiSlider-rail": { height: 4, opacity: temaOscuro ? 0.12 : 0.2, backgroundColor: temaOscuro ? "#fff" : "#000" },
                              "& .MuiSlider-thumb": { width: 12, height: 12, "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 6px rgba(255,255,255,0.1)" } },
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Botones + flecha en desktop */}
                      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0, flexShrink: 0, zIndex: 2 }}>
                        <ActionButton compact title="Editar" color="info" onClick={() => editarTrabajo(trabajo)} icon={<EditRoundedIcon />} />
                        <ActionButton compact title={activo ? "Guardar" : "Eliminar"} color={activo ? "primary" : "error"}
                          onClick={() => activo ? handleGuardarClick({ ...trabajo, ...pending }) : abrirDialog(trabajo)}
                          icon={activo ? (loadingSave === trabajo.SitioWeb ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />) : <DeleteIcon />}
                        />
                        <ActionButton compact title={activo ? "Eliminar" : "Restaurar"} color={activo ? "error" : "success"}
                          onClick={() => activo ? abrirDialog(trabajo) : restaurarTrabajo(trabajo)}
                          icon={activo ? <DeleteIcon /> : <RestoreIcon />}
                        />
                      </Box>
                      {Number(trabajo.TipoApp || trabajo.tipoApp) === 1 && (
                        <Box sx={{ display: { xs: "none", md: "flex" } }}
                          className="arrow-icon" component="a" href={`https://${trabajo.SitioWeb}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: temaOscuro ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)", transition: "color 0.2s", textDecoration: "none", alignItems: "center", flexShrink: 0 }}
                        >
                          <ArrowForwardIcon sx={{ fontSize: "1.1rem" }} />
                        </Box>
                      )}
                    </Box>

                    {/* Slider mobile */}
                    <Box sx={{ display: { xs: "block", md: "none" }, px: 0.5, zIndex: 2 }}>
                      <Slider
                        value={pct}
                        onChange={(_, v) => handleChange(trabajo.SitioWeb, "Porcentaje", v)}
                        step={5} min={0} max={100}
                        sx={{
                          py: "4px",
                          "& .MuiSlider-track": { backgroundImage: getGradient(pct), border: "none", height: 6 },
                          "& .MuiSlider-rail": { height: 6, opacity: temaOscuro ? 0.15 : 0.22, backgroundColor: temaOscuro ? "#fff" : "#000" },
                          "& .MuiSlider-thumb": { width: 22, height: 22, "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px rgba(255,255,255,0.1)" } },
                        }}
                      />
                    </Box>

                    {/* Botones + flecha en mobile */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <ActionButton title="Editar" color="info" onClick={() => editarTrabajo(trabajo)} icon={<EditRoundedIcon />} />
                        <ActionButton title={activo ? "Guardar" : "Eliminar"} color={activo ? "primary" : "error"}
                          onClick={() => activo ? handleGuardarClick({ ...trabajo, ...pending }) : abrirDialog(trabajo)}
                          icon={activo ? (loadingSave === trabajo.SitioWeb ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />) : <DeleteIcon />}
                        />
                        <ActionButton title={activo ? "Eliminar" : "Restaurar"} color={activo ? "error" : "success"}
                          onClick={() => activo ? abrirDialog(trabajo) : restaurarTrabajo(trabajo)}
                          icon={activo ? <DeleteIcon /> : <RestoreIcon />}
                        />
                      </Box>
                      {Number(trabajo.TipoApp || trabajo.tipoApp) === 1 && (
                        <Box component="a" href={`https://${trabajo.SitioWeb}`} target="_blank" rel="noopener noreferrer"
                          sx={{ color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", textDecoration: "none", p: 0.5 }}
                        >
                          <ArrowForwardIcon sx={{ fontSize: "1.4rem" }} />
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              );
            })}
          </Box>

          {loadingSaveAll && (
            <Box
              sx={{
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                bgcolor: "rgba(255,255,255,0.55)",
                backdropFilter: "blur(2px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
                borderRadius: 2,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>

        {mostrarPaginacion && renderPaginacion()}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.type}>{snackbar.message}</Alert>
        </Snackbar>

        {/*DIALOG: AGREGAR TRABAJO*/}
        <DialogAgregarTrabajo
          open={openDialogAgregar}
          onClose={() => { setOpenDialogAgregar(false); setTrabajoAEditar(null); }}
          onSave={handleSaveTrabajo}
          trabajoEditar={trabajoAEditar}
        />
        {/*DIALOG: ELIMINAR*/}
        <Dialog open={dialog.open} onClose={cerrarDialog} >
          <DialogTitle sx={{ fontWeight: "bold", color: "#e65100", background: "linear-gradient(180deg, #FFF8EC, #FFEFD5)", }}>
            Confirmar acción
          </DialogTitle>
          <DialogContent sx={{ background: "linear-gradient(180deg, #FFF8EC, #FFEFD5)", }}>
            <Typography>
              ¿Desea eliminar el trabajo <b>{dialog.sitioWeb}</b>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ background: "linear-gradient(180deg, #FFF8EC, #FFEFD5)", }}>
            <Button
              onClick={cerrarDialog}
              color="inherit"
              disabled={loadingDialogAction !== null}
            >
              CERRAR
            </Button>
            <Button
              onClick={handleDeshabilitar}
              color="warning"
              variant="outlined"
              disabled={loadingDialogAction !== null}
              startIcon={
                loadingDialogAction === "deshabilitar" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              DESHABILITAR
            </Button>
            <Button
              onClick={handleEliminar}
              color="error"
              variant="contained"
              disabled={loadingDialogAction !== null}
              startIcon={
                loadingDialogAction === "eliminar" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : null
              }
            >
              ELIMINAR
            </Button>
          </DialogActions>
        </Dialog>

        <DialogTrabajoTerminado
          open={dialogFinalizar.open}
          trabajo={dialogFinalizar.trabajo}
          onClose={() => setDialogFinalizar({ open: false, trabajo: null })}
          onConfirmar={async () => {
            await guardarCambios(dialogFinalizar.trabajo);
          }}
          onConfirmarConCorreo={async () => {
            await guardarCambios(dialogFinalizar.trabajo);
            await handleEnviarCorreo();
          }}
        />


    </Box>
  );
};

export default ConfigurarTrabajos;


