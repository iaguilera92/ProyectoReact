import React, { useEffect, useState } from "react";
import { CircularProgress, Dialog, Box, Typography, Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, LinearProgress, Snackbar, Alert, Button, useTheme, useMediaQuery } from "@mui/material";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { motion } from "framer-motion";
import MenuInferior from "./MenuInferior";
import DialogAgregarTrabajo from "./DialogAgregarTrabajo";
import { cargarTrabajosEnRevision, obtenerTextoEstado, obtenerColorEstado } from "../../helpers/HelperTrabajosEnRevision";

const ConfigurarEnRevision = () => {
  const [trabajos, setTrabajos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  // Paginación: calcular los trabajos de la página actual
  const registrosPorPagina = 10;
  const indexUltimo = paginaActual * registrosPorPagina;
  const indexPrimero = indexUltimo - registrosPorPagina;
  const trabajosPaginados = trabajos.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );
  const totalPaginas = Math.ceil(trabajos.length / registrosPorPagina);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null);
  const [dialogOpcionesOpen, setDialogOpcionesOpen] = useState(false);
  const [trabajoParaOpciones, setTrabajoParaOpciones] = useState(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "340px";

  useEffect(() => {
    fetchTrabajos();
  }, []);

  //CARGAR TRABAJOS EN REVISIÓN
  const fetchTrabajos = async () => {
    try {
      const url =
        "https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/TrabajosEnRevision.xlsx?t=" +
        Date.now();

      const data = await cargarTrabajosEnRevision(url);
      const filtrados = data.filter(t => t.Estado === 1);
      setTrabajos(filtrados);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Error al cargar trabajos",
        type: "error"
      });
    }
  };

  const abrirDialog = (trabajo) => {
    console.log(trabajo);
    setTrabajoSeleccionado(trabajo);
    setDialogOpen(true);
  };

  const cerrarDialog = () => {
    setDialogOpen(false);
    setTrabajoSeleccionado(null);
  };

  const handleGuardarTrabajo = (nuevoTrabajo) => {
    console.log("Trabajo guardado:", nuevoTrabajo);

    if (trabajoSeleccionado) {
      // Eliminar del S3
      eliminarTrabajoRevision(trabajoSeleccionado.Id);

      // Quitar del estado local para actualizar la tabla
      setTrabajos(prev => prev.filter(t => t.Id !== trabajoSeleccionado.Id));
    }

    // Mostrar snackbar de éxito
    setSnackbar({
      open: true,
      message: "Trabajo registrado y removido de revisión",
      type: "success",
    });

    setTrabajoSeleccionado(null);
  };


  //ELIMINAR REVISIÓN DEL S3
  const eliminarTrabajoRevision = async (id) => {
    try {
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/eliminarTrabajoEnRevision`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id: id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error eliminando trabajo");

      // Quitar del estado local
      setTrabajos(prev => prev.filter(t => t.Id !== id));

      setSnackbar({
        open: true,
        message: "Trabajo eliminado de Revisión y S3",
        type: "success",
      });

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

  const abrirDialogOpciones = (trabajo) => {
    setTrabajoParaOpciones(trabajo);
    setDialogOpcionesOpen(true);
  };

  const cerrarDialogOpciones = () => {
    setDialogOpcionesOpen(false);
    setTrabajoParaOpciones(null);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100vw",
        py: 1,
        backgroundImage: "url(fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Box sx={{ pt: 12, pb: 4, px: { xs: 1, md: 4 } }}>

        {/* Título */}
        <Box display="flex" alignItems="center" gap={1} pb={2}>
          <SettingsSuggestIcon sx={{ color: "white" }} />
          <Typography variant="h7" sx={{ color: "white", fontWeight: 700 }}>
            Trabajos en Revisión
          </Typography>
        </Box>

        {/* Tabla */}
        <Box sx={{ position: "relative" }}>
          <Paper
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 6,
              bgcolor: "#ffffff",
            }}
          >
            <Table size="small" sx={{ "& .MuiTableCell-root": { border: "none" } }}>
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
                      "& td, & th": {
                        py: { xs: 0.5, sm: 0.75 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: "0.75rem", sm: "0.85rem" },
                        color: "#1b263b",
                        fontFamily: "Poppins, sans-serif",
                        borderTop: "1px solid rgba(0,0,0,0.1)",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                      },
                      "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" },
                      "&:hover": { bgcolor: "#f1f7ff" },
                    }}
                  >
                    <TableCell>{trabajo.Negocio}</TableCell>
                    {!isMobile && <TableCell>{trabajo.EmailCliente}</TableCell>}
                    {!isMobile && <TableCell>{trabajo.TelefonoCliente}</TableCell>}
                    <TableCell sx={{ minWidth: 120 }}>
                      <LinearProgress
                        variant="determinate"
                        value={trabajo.Porcentaje}
                        sx={{
                          height: 8,
                          borderRadius: 2,
                          "& .MuiLinearProgress-bar": {
                            backgroundImage: getGradient(trabajo.Porcentaje)
                          }
                        }}
                      />
                      <Typography variant="caption">{trabajo.Porcentaje}%</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={obtenerTextoEstado(trabajo.Estado)}
                        color={obtenerColorEstado(trabajo.Estado)}
                        size="small"
                        onClick={() => abrirDialogOpciones(trabajo)}
                        sx={{ cursor: "pointer" }}
                      />
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
              <Button
                variant="contained"
                disabled={paginaActual === 1}
                onClick={() => setPaginaActual(paginaActual - 1)}
                sx={{
                  backgroundColor: paginaActual === 1 ? "#555555" : "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: paginaActual === 1 ? "#555555" : "primary.dark",
                  }
                }}
              >
                Anterior
              </Button>

              <Typography sx={{ color: "white", fontWeight: 500 }}>
                Página {paginaActual} de {totalPaginas}
              </Typography>

              <Button
                variant="contained"
                disabled={paginaActual === totalPaginas}
                onClick={() => setPaginaActual(paginaActual + 1)}
                sx={{
                  backgroundColor: paginaActual === totalPaginas ? "#555555" : "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: paginaActual === totalPaginas ? "#555555" : "primary.dark",
                  }
                }}
              >
                Siguiente
              </Button>
            </Box>
          )}


        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.type}>{snackbar.message}</Alert>
        </Snackbar>

        <MenuInferior cardSize={cardSize} />
      </Box>

      {/* Dialog Crear Trabajo*/}
      <DialogAgregarTrabajo
        open={dialogOpen}
        onClose={cerrarDialog}
        onSave={handleGuardarTrabajo}
        trabajoInicial={trabajoSeleccionado}
      />

      <Dialog
        open={dialogOpcionesOpen}
        onClose={() => {
          if (!loadingEliminar) cerrarDialogOpciones();
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            margin: 0,
            boxShadow: "0 0 20px rgba(0, 150, 255, 0.5)", // glow azul eléctrico
            border: "2px solid rgba(0, 200, 255, 0.8)",   // borde hielo
            backgroundColor: "#121212",                   // fondo oscuro
            backgroundImage: "linear-gradient(135deg, #0d0d0d, #1a1a1a)", // degradado sutil
            color: "#e0f7ff",                             // texto azul hielo
            backdropFilter: "blur(6px)",                  // efecto glass
          },
        }}
      >

        <Box display="flex" flexDirection="column" gap={2} alignItems="center" minWidth={280}>

          {/* 🌟 Botón Crear Trabajo con colores dorado/anaranjado y brillo */}
          <Button
            variant="contained"
            fullWidth
            disabled={loadingEliminar} // bloquea mientras elimina
            sx={{
              minWidth: { xs: "280px", sm: "340px" },
              height: "58px",
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "Albert Sans, sans-serif",
              fontWeight: 600,
              color: "#fff",
              background:
                "linear-gradient(135deg, #66bb6a, #43a047 45%, #2e7d32 85%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 8s ease infinite",
              boxShadow: "0 6px 16px rgba(76,175,80,.4)",
              position: "relative",
              overflow: "hidden",
              border: "2px solid rgba(76,175,80,0.9)",
              zIndex: 1,

              "&:hover": {
                background: "linear-gradient(135deg,#43a047,#2e7d32)",
                boxShadow: "0 0 6px rgba(76,175,80,.6), inset 0 0 6px rgba(255,255,255,0.25)",
              },

              /* ✨ BRILLO EXTERNO — Border Sweep + Pulse */
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-2px",
                borderRadius: "inherit",
                background:
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 10%, #a5d6a7 20%, rgba(255,255,255,0.9) 30%, transparent 40%)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "300% 300%",
                animation: "shineBorderSweep 3s linear infinite, pulseGlow 4s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 2,
                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
              },

              /* ✨ BRILLO INTERNO — Sheen diagonal */
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                transform: "translateX(-100%)",
                animation: "shineDiagonal 4s ease-in-out infinite",
                borderRadius: "inherit",
                pointerEvents: "none",
                zIndex: 1,
              },

              "&:hover::after": {
                animation: "shineDiagonal 1.2s ease-in-out",
              },

              /* 🔥 ANIMACIONES */
              "@keyframes shineBorderSweep": {
                "0%": { backgroundPosition: "-300% 0" },
                "100%": { backgroundPosition: "300% 0" },
              },
              "@keyframes pulseGlow": {
                "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(76,175,80,.35))" },
                "50%": { filter: "drop-shadow(0 0 14px rgba(76,175,80,.75))" },
              },
              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(-120%) rotate(0deg)" },
                "100%": { transform: "translateX(120%) rotate(0deg)" },
              },
              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
            onClick={() => {
              setDialogOpen(true);
              setTrabajoSeleccionado(trabajoParaOpciones);
              if (!loadingEliminar) cerrarDialogOpciones();
            }}
          >
            Crear Trabajo
          </Button>

          {/* Eliminar */}
          <Button
            variant="contained"
            fullWidth
            disabled={loadingEliminar} // bloquea mientras elimina
            sx={{
              minWidth: { xs: "280px", sm: "340px" },
              height: "58px",
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "Albert Sans, sans-serif",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #e53935, #d32f2f 70%)",
              boxShadow: "0 4px 12px rgba(211,47,47,.3)",
              border: "2px solid rgba(211,47,47,0.9)",
              "&:hover": {
                background: "linear-gradient(135deg, #d32f2f, #b71c1c 70%)",
                boxShadow: "0 0 8px rgba(211,47,47,.5)",
              },
            }}
            onClick={async () => {
              if (!trabajoParaOpciones) return;

              try {
                setLoadingEliminar(true); // inicia carga

                await eliminarTrabajoRevision(trabajoParaOpciones.Id);

                setSnackbar({
                  open: true,
                  message: "Trabajo eliminado correctamente",
                  type: "success",
                });

                cerrarDialogOpciones();
              } catch (error) {
                setSnackbar({
                  open: true,
                  message: error.message || "Error eliminando trabajo",
                  type: "error",
                });
              } finally {
                setLoadingEliminar(false); // termina carga
              }
            }}
          >
            {loadingEliminar ? (
              <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                <CircularProgress size={24} color="inherit" />
              </Box>
            ) : (
              "Eliminar"
            )}
          </Button>

        </Box>
      </Dialog>


    </Container>
  );
};

export default ConfigurarEnRevision;
