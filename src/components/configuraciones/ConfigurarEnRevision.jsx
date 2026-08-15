import React, { useEffect, useState } from "react";
import { CircularProgress, Dialog, Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, LinearProgress, Snackbar, Alert, Button, useTheme, useMediaQuery } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { motion } from "framer-motion";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";
import DialogAgregarTrabajo from "./DialogAgregarTrabajo";
import { cargarTrabajosEnRevision, obtenerTextoEstado, obtenerColorEstado } from "../../helpers/HelperTrabajosEnRevision";

const ConfigurarEnRevision = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const registrosPorPagina = 10;
  const trabajosPaginados = trabajos.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);
  const totalPaginas = Math.ceil(trabajos.length / registrosPorPagina);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [dialogOpcionesOpen, setDialogOpcionesOpen] = useState(false);
  const [trabajoParaOpciones, setTrabajoParaOpciones] = useState(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("pw-sidebar") !== "false");
  const toggleSidebar = () => setSidebarOpen(p => { const next = !p; localStorage.setItem("pw-sidebar", String(next)); return next; });
  const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem("pw-tema") !== "claro");
  const handleTema = (oscuro) => { setTemaOscuro(oscuro); localStorage.setItem("pw-tema", oscuro ? "oscuro" : "claro"); };
  const [forzarPrd, setForzarPrd] = useState(false);

  useEffect(() => { fetchTrabajos(); }, []);

  const fetchTrabajos = async () => {
    try {
      const url = "https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/TrabajosEnRevision.xlsx?t=" + Date.now();
      const data = await cargarTrabajosEnRevision(url);
      setTrabajos(data.filter(t => t.Estado === 1));
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Error al cargar trabajos", type: "error" });
    }
  };

  const cerrarDialog = () => { setDialogOpen(false); setTrabajoSeleccionado(null); };

  const handleGuardarTrabajo = (nuevoTrabajo) => {
    if (trabajoSeleccionado) {
      eliminarTrabajoRevision(trabajoSeleccionado.Id);
      setTrabajos(prev => prev.filter(t => t.Id !== trabajoSeleccionado.Id));
    }
    setSnackbar({ open: true, message: "Trabajo registrado y removido de revisión", type: "success" });
    setTrabajoSeleccionado(null);
  };

  const eliminarTrabajoRevision = async (id) => {
    try {
      const url = `${window.location.hostname === "localhost" ? "http://localhost:8888" : ""}/.netlify/functions/eliminarTrabajoEnRevision`;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ Id: id }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error eliminando trabajo");
      setTrabajos(prev => prev.filter(t => t.Id !== id));
      setSnackbar({ open: true, message: "Trabajo eliminado de Revisión y S3", type: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message, type: "error" });
    }
  };

  const getGradient = (val) => {
    if (val < 30) return "linear-gradient(90deg,#ef5350,#e53935)";
    if (val < 70) return "linear-gradient(90deg,#ffb74d,#fb8c00)";
    return "linear-gradient(90deg,#81c784,#388e3c)";
  };

  const cerrarDialogOpciones = () => { setDialogOpcionesOpen(false); setTrabajoParaOpciones(null); };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", bgcolor: temaOscuro ? "#0a0a0a" : "#f0f0f0" }}>
      <NavbarAdmin
        titulo="En Revisión"
        temaOscuro={temaOscuro}
        onMenuClick={toggleSidebar}
        forzarPrd={forzarPrd}
        onForzarPrd={setForzarPrd}
      />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SidebarAdmin
          open={sidebarOpen}
          temaOscuro={temaOscuro}
          onTemaChange={handleTema}
          onClose={() => { setSidebarOpen(false); localStorage.setItem("pw-sidebar", "false"); }}
          esPrd={forzarPrd}
        />
        <Box sx={{ flex: 1, minWidth: 0, width: 0, overflowY: "auto", overflowX: "hidden", pb: 4, px: { xs: 1, md: 4 }, pt: 2 }}>

          {/* Título */}
          <Box display="flex" alignItems="center" gap={1} pb={2}>
            <SettingsSuggestIcon sx={{ color: temaOscuro ? "rgba(255,255,255,0.7)" : "#1b263b" }} />
            <Typography variant="h6" sx={{ color: temaOscuro ? "#fff" : "#1b263b", fontWeight: 700, fontSize: "1.1rem" }}>
              Trabajos en Revisión
            </Typography>
          </Box>

          {/* Tabla */}
          <Box sx={{ position: "relative" }}>
            <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 6, bgcolor: temaOscuro ? "#141414" : "#ffffff" }}>
              <Table size="small" sx={{ "& .MuiTableCell-root": { border: "none" }, "& .MuiTableCell-head": { bgcolor: temaOscuro ? "#1a1a1a" : undefined, color: temaOscuro ? "#fff" : "#1b263b" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Negocio</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>}
                    {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Teléfono</TableCell>}
                    <TableCell sx={{ fontWeight: "bold" }}>Progreso</TableCell>
                    <TableCell sx={{ pl: 3, fontWeight: "bold" }}>Estado</TableCell>
                    {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trabajosPaginados.map((trabajo, index) => (
                    <TableRow
                      key={trabajo.Id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      sx={{
                        "& td, & th": { py: { xs: 0.5, sm: 0.75 }, px: { xs: 1, sm: 2 }, fontSize: { xs: "0.75rem", sm: "0.85rem" }, color: temaOscuro ? "rgba(255,255,255,0.85)" : "#1b263b", fontFamily: "Poppins, sans-serif", borderTop: `1px solid ${temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}`, borderBottom: `1px solid ${temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.1)"}` },
                        "&:nth-of-type(odd)": { bgcolor: temaOscuro ? "#1a1a1a" : "#f9f9f9" },
                        "&:hover": { bgcolor: temaOscuro ? "#222" : "#f1f7ff" },
                      }}
                    >
                      <TableCell>{trabajo.Negocio}</TableCell>
                      {!isMobile && <TableCell>{trabajo.EmailCliente}</TableCell>}
                      {!isMobile && <TableCell>{trabajo.TelefonoCliente}</TableCell>}
                      <TableCell sx={{ minWidth: 120 }}>
                        <LinearProgress variant="determinate" value={trabajo.Porcentaje} sx={{ height: 8, borderRadius: 2, "& .MuiLinearProgress-bar": { backgroundImage: getGradient(trabajo.Porcentaje) } }} />
                        <Typography variant="caption" sx={{ color: temaOscuro ? "rgba(255,255,255,0.5)" : undefined }}>{trabajo.Porcentaje}%</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={obtenerTextoEstado(trabajo.Estado)} color={obtenerColorEstado(trabajo.Estado)} size="small" onClick={() => { setTrabajoParaOpciones(trabajo); setDialogOpcionesOpen(true); }} sx={{ cursor: "pointer" }} />
                      </TableCell>
                      {!isMobile && <TableCell>{trabajo.FechaCreacion}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>

            {/* Paginación */}
            {trabajos.length > registrosPorPagina && (
              <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
                <Button variant="contained" disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</Button>
                <Typography sx={{ color: temaOscuro ? "#fff" : "#1b263b", fontWeight: 500 }}>Página {paginaActual} de {totalPaginas}</Typography>
                <Button variant="contained" disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</Button>
              </Box>
            )}
          </Box>

          {/* Snackbar */}
          <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert severity={snackbar.type}>{snackbar.message}</Alert>
          </Snackbar>

        </Box>
      </Box>

      {/* Dialog Crear Trabajo */}
      <DialogAgregarTrabajo open={dialogOpen} onClose={cerrarDialog} onSave={handleGuardarTrabajo} trabajoInicial={trabajoSeleccionado} />

      <Dialog
        open={dialogOpcionesOpen}
        onClose={() => { if (!loadingEliminar) cerrarDialogOpciones(); }}
        PaperProps={{ sx: { borderRadius: 3, p: 3, margin: 0, boxShadow: "0 0 20px rgba(0,150,255,0.5)", border: "2px solid rgba(0,200,255,0.8)", backgroundColor: "#121212", backgroundImage: "linear-gradient(135deg,#0d0d0d,#1a1a1a)", color: "#e0f7ff", backdropFilter: "blur(6px)" } }}
      >
        <Box display="flex" flexDirection="column" gap={2} alignItems="center" minWidth={280}>
          <Button
            variant="contained" fullWidth disabled={loadingEliminar}
            sx={{ minWidth: { xs: "280px", sm: "340px" }, height: "58px", borderRadius: "14px", textTransform: "none", fontFamily: "Albert Sans, sans-serif", fontWeight: 600, color: "#fff", background: "linear-gradient(135deg,#66bb6a,#43a047 45%,#2e7d32 85%)", boxShadow: "0 6px 16px rgba(76,175,80,.4)", border: "2px solid rgba(76,175,80,0.9)", "&:hover": { background: "linear-gradient(135deg,#43a047,#2e7d32)" } }}
            onClick={() => { setDialogOpen(true); setTrabajoSeleccionado(trabajoParaOpciones); if (!loadingEliminar) cerrarDialogOpciones(); }}
          >
            Crear Trabajo
          </Button>
          <Button
            variant="contained" fullWidth disabled={loadingEliminar}
            sx={{ minWidth: { xs: "280px", sm: "340px" }, height: "58px", borderRadius: "14px", textTransform: "none", fontFamily: "Albert Sans, sans-serif", fontWeight: 600, color: "#fff", background: "linear-gradient(135deg,#e53935,#d32f2f 70%)", boxShadow: "0 4px 12px rgba(211,47,47,.3)", border: "2px solid rgba(211,47,47,0.9)", "&:hover": { background: "linear-gradient(135deg,#d32f2f,#b71c1c 70%)" } }}
            onClick={async () => {
              if (!trabajoParaOpciones) return;
              try {
                setLoadingEliminar(true);
                await eliminarTrabajoRevision(trabajoParaOpciones.Id);
                setSnackbar({ open: true, message: "Trabajo eliminado correctamente", type: "success" });
                cerrarDialogOpciones();
              } catch (error) {
                setSnackbar({ open: true, message: error.message || "Error eliminando trabajo", type: "error" });
              } finally {
                setLoadingEliminar(false);
              }
            }}
          >
            {loadingEliminar ? <Box display="flex" alignItems="center" justifyContent="center" width="100%"><CircularProgress size={24} color="inherit" /></Box> : "Eliminar"}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ConfigurarEnRevision;
