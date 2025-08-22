import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton, TextField, Snackbar, Alert, Container, Paper, LinearProgress, Tooltip, useTheme, useMediaQuery } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { motion } from "framer-motion";
import MenuInferior from './MenuInferior';
import AddIcon from "@mui/icons-material/Add";
import DialogAgregarTrabajo from "../DialogAgregarTrabajo";
import { CircularProgress } from "@mui/material";

const ActionButton = ({ title, color, onClick, icon }) => (
  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
    <Tooltip title={title}>
      <IconButton
        size="small"
        color={color}
        onClick={onClick}
        sx={{
          "& svg": { fontSize: 28 },    // más grandes
          p: 0.6,                       // menos padding interno
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  </motion.div>
);
const ConfigurarTrabajos = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "340px";
  const [openDialogAgregar, setOpenDialogAgregar] = useState(false);
  const [loadingSave, setLoadingSave] = useState(null);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [loadingSaveAll, setLoadingSaveAll] = useState(false);
  const [loadingDialogAction, setLoadingDialogAction] = useState(null);

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
        ? "http://localhost:9999"
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
        ? "http://localhost:9999"
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
    setOpenDialogAgregar(true);
  };

  useEffect(() => {
    fetchTrabajos();
  }, []);

  const handleSaveTrabajo = async (nuevoTrabajo) => {
    console.log("Nuevo trabajo agregado:", nuevoTrabajo);

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
    } catch (error) {
      console.error("❌ Error cargando trabajos:", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...trabajos];
    updated[index][field] = value;
    setTrabajos(updated);
  };

  const guardarCambios = async (trabajo) => {
    try {
      setLoadingSaveAll(true); // 🔒 bloquea toda la tabla


      const url = `${window.location.hostname === "localhost" ? "http://localhost:9999" : ""}/.netlify/functions/actualizarTrabajo`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trabajo),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al guardar");

      setSnackbar({ open: true, type: "success", message: "Cambios guardados correctamente" });
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setSnackbar({ open: true, type: "error", message: "Error al guardar cambios" });
    } finally {
      setLoadingSaveAll(false); // 👈 liberar bloqueo
    }
  };

  const restaurarTrabajo = async (trabajo) => {
    try {
      setLoadingSaveAll(true); // 🔒 bloquea toda la tabla

      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:9999"
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




  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
        py: 1,
        backgroundImage: "url(fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ pt: 12, pb: 4, px: { xs: 1, md: 4 } }}>
        {/* Título */}
        <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
          {/* Título */}
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsSuggestIcon sx={{ color: "white", fontSize: 28, mt: "-2px" }} />
            {/* 👆 un pequeño mt negativo ayuda a centrar mejor con el texto */}
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Configuración de Trabajos
            </Typography>
          </Box>

          {/* Botón agregar trabajo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => agregarTrabajo()}
              variant="outlined"
              color="inherit"
              startIcon={<AddIcon />}   // 👈 icono cambiado
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "4px 8px", sm: "6px 12px" },
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "#ffffff22",
                  borderColor: "#ffffffcc",
                },
              }}
            >
              Agregar Trabajo
            </Button>
          </motion.div>
        </Box>


        {/* Tabla */}
        <Box sx={{ position: "relative" }}>
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: 3,
              boxShadow: 6,
              opacity: loadingSaveAll ? 0.5 : 1,
              pointerEvents: loadingSaveAll ? "none" : "auto", // bloquea clicks
            }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "grey.200" }}>
                <TableRow>
                  <TableCell sx={{ width: "70%", fontWeight: "bold" }}>
                    Sitios Web
                  </TableCell>

                  <TableCell
                    sx={{
                      width: "20%",
                      fontWeight: "bold",
                      pr: 0,
                    }}
                  >
                    Progreso
                  </TableCell>

                  {/* Acciones */}
                  <TableCell
                    align="center"
                    sx={{
                      width: "10%",
                      pl: 0,
                    }}
                  >
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {trabajos.map((trabajo, index) => (
                  <TableRow
                    key={trabajo.SitioWeb}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                      "&:hover": { bgcolor: "primary.light", opacity: 0.95 },
                    }}
                  >
                    {/* Sitio Web */}
                    <TableCell sx={{ fontWeight: 500 }}>{trabajo.SitioWeb}</TableCell>

                    {/* Progreso editable */}
                    <TableCell sx={{ pr: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row", // 📱 columna / 🖥️ fila
                          alignItems: "center",
                          gap: 1,
                          width: "100%",
                        }}
                      >
                        {/* Barra de progreso */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flex: 1,
                            width: isMobile ? 90 : "100%", // 📱 compacto / 🖥️ full
                          }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={trabajo.Porcentaje}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 2,
                              "& .MuiLinearProgress-bar": {
                                bgcolor:
                                  trabajo.Porcentaje === 100
                                    ? "success.main"
                                    : "warning.main",
                              },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              minWidth: 32,
                              textAlign: "right",
                              fontWeight: 600,
                            }}
                          >
                            {trabajo.Porcentaje}%
                          </Typography>
                        </Box>

                        {/* Input de porcentaje */}
                        <TextField
                          type="number"
                          value={trabajo.Porcentaje}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "Porcentaje",
                              Math.min(100, Math.max(0, Number(e.target.value)))
                            )
                          }
                          inputProps={{
                            min: 0,
                            max: 100,
                            style: { textAlign: "right" },
                          }}
                          size="small"
                          sx={{
                            width: 90,
                            alignSelf: isMobile ? "flex-start" : "center", // 📱 alineado arriba / 🖥️ centrado
                          }}
                        />
                      </Box>
                    </TableCell>


                    {/* Botones de acción */}
                    <TableCell align="center">
                      <Box sx={{ display: "inline-flex", gap: 0.3 }}>
                        <ActionButton
                          title="Guardar cambios"
                          color="primary"
                          disabled={loadingSave === trabajo.SitioWeb} // 👈 deshabilitado si está guardando
                          onClick={() => guardarCambios(trabajo)}
                          icon={
                            loadingSave === trabajo.SitioWeb ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <SaveIcon />
                            )
                          }
                        />
                        <ActionButton
                          title={trabajo.Estado === 1 ? "Eliminar" : "Restaurar"}
                          color={trabajo.Estado === 1 ? "error" : "success"}
                          onClick={() => {
                            if (trabajo.Estado === 1) {
                              abrirDialog(trabajo); // eliminar con confirmación
                            } else {
                              restaurarTrabajo(trabajo); // restaurar directo
                            }
                          }}
                          icon={trabajo.Estado === 1 ? <DeleteIcon /> : <RestoreIcon />}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {loadingSaveAll && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(255,255,255,0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.type}>{snackbar.message}</Alert>
        </Snackbar>

        <DialogAgregarTrabajo
          open={openDialogAgregar}
          onClose={() => setOpenDialogAgregar(false)}
          onSave={handleSaveTrabajo}
        />

        <Dialog open={dialog.open} onClose={cerrarDialog}>
          <DialogTitle sx={{ fontWeight: "bold", color: "#e65100" }}>
            Confirmar acción
          </DialogTitle>
          <DialogContent>
            <Typography>
              ¿Desea eliminar el trabajo <b>{dialog.sitioWeb}</b>?
            </Typography>
          </DialogContent>
          <DialogActions>
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


        <MenuInferior cardSize={cardSize} modo="trabajos" />
      </Box>
    </Container>
  );
};

export default ConfigurarTrabajos;
