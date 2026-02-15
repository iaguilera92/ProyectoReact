import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, LinearProgress, Snackbar, Alert, Button, useTheme, useMediaQuery } from "@mui/material";
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
          <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
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
                  <TableCell>Negocio</TableCell>
                  {!isMobile && <TableCell>Email</TableCell>}
                  {!isMobile && <TableCell>Teléfono</TableCell>}
                  <TableCell>Progreso</TableCell>
                  <TableCell>Estado</TableCell>
                  {!isMobile && <TableCell>Fecha</TableCell>}
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
                        onClick={() => abrirDialog(trabajo)}
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

      {/* Dialog */}
      <DialogAgregarTrabajo
        open={dialogOpen}
        onClose={cerrarDialog}
        onSave={handleGuardarTrabajo}
        trabajoInicial={trabajoSeleccionado}
      />

    </Container>
  );
};

export default ConfigurarEnRevision;
