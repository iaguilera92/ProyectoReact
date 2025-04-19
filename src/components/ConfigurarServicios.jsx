import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, IconButton, Container, Collapse, Card, CardContent, useTheme,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tabs, Tab, Snackbar, Alert, useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cargarServicios } from "../helpers/HelperServicios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { motion } from 'framer-motion';
import UpdateIcon from '@mui/icons-material/Update';
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";

const ConfigurarServicios = () => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "340px";
  const smallCardSize = isMobile ? "140px" : "165px";

  const [nuevoServicio, setNuevoServicio] = useState({
    title: '',
    description: '',
    img: '',
    background: '',
    iconName: '',
    sections: [],
  });

  const navigate = useNavigate();
  const containerRef = React.useRef();

  useEffect(() => {
    const credenciales = (() => {
      try {
        return JSON.parse(localStorage.getItem("credenciales"));
      } catch {
        return null;
      }
    })();

    if (!credenciales || !credenciales.email || !credenciales.password) {
      navigate("/administracion", { replace: true });
      return;
    }

    const cargar = async () => {
      const timestamp = new Date().getTime();
      const data = await cargarServicios(`/database/Servicios.xlsx?t=${timestamp}`);
      setServices(data);
    };

    cargar();
  }, [navigate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = (index) => {
    setSelected(index);
    setNuevoServicio({ ...services[index] });
    setMostrarFormulario(index);
    setTabIndex(0);
  };

  const handleEliminar = (index) => {
    setServicioAEliminar(index);
  };

  const confirmarEliminar = () => {
    const actualizados = [...services];
    actualizados.splice(servicioAEliminar, 1);
    setServices(actualizados);
    setServicioAEliminar(null);
    setSnackbar({ open: true, message: 'Eliminado correctamente!' });
    if (selected === servicioAEliminar) {
      setSelected(null);
      setMostrarFormulario(null);
    }
  };

  const handleGuardar = () => {
    if (selected === null) {
      setSnackbar({ open: true, message: 'En construcción...' });
      return;
    }

    const actualizados = [...services];
    actualizados[selected] = nuevoServicio;
    setServices(actualizados);
    setNuevoServicio({ title: '', description: '', img: '', background: '', iconName: '', sections: [] });
    setSelected(null);
    setMostrarFormulario(null);
  };

  const handleCancelar = () => {
    setMostrarFormulario(null);
    setSelected(null);
  };

  const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.3 + i * 0.05 },
    }),
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        width: '100vw',
        py: 1,
        px: 0,
        pb: 3.5,
        backgroundImage: 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Box ref={containerRef} sx={{ pt: 12, pb: 4, px: { xs: 1, md: 4 } }}>
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <SettingsSuggestIcon sx={{ color: 'white', fontSize: 22 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, fontFamily: 'Roboto, Arial, sans-serif' }}>
                  {"Servicios actuales".split("").map((char, i) => (
                    <motion.span
                      key={i}
                      custom={i}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      style={{ display: 'inline-block' }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </Typography>
              </Box>
              {services.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <Card sx={{ mb: 2, overflow: 'hidden', background: s.background || '#fff', transition: 'all 0.4s ease' }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontFamily: 'Roboto, Arial, sans-serif' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600} sx={{ color: 'white' }}>{s.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.85 }}>{s.description}</Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => mostrarFormulario === idx ? handleCancelar() : handleEditar(idx)}
                          sx={{
                            transition: 'transform 0.3s ease',
                            transform: mostrarFormulario === idx ? 'rotate(180deg)' : 'none',
                            color: mostrarFormulario === idx ? '#dc3545' : 'inherit'
                          }}
                        >
                          {mostrarFormulario === idx ? <CloseIcon /> : <EditIcon />}
                        </IconButton>
                        <IconButton onClick={() => handleEliminar(idx)} sx={{ color: 'white' }}><DeleteIcon /></IconButton>
                      </Box>
                    </CardContent>

                    <Collapse in={mostrarFormulario === idx} timeout={500} unmountOnExit>
                      <Box sx={{ p: 3, background: '#fff', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ mb: 2 }}>
                          <Tab label="General" />
                          <Tab label="Secciones" />
                        </Tabs>

                        {tabIndex === 0 && (
                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000', fontFamily: 'Roboto, Arial, sans-serif' }}>Editar Servicio</Typography>
                            <TextField fullWidth label="Título" name="title" value={nuevoServicio.title} onChange={handleInputChange} margin="normal" />
                            <TextField fullWidth label="Descripción" name="description" value={nuevoServicio.description} onChange={handleInputChange} margin="normal" />
                            <TextField fullWidth label="Imagen" name="img" value={nuevoServicio.img} onChange={handleInputChange} margin="normal" />
                            <TextField fullWidth label="Fondo (background)" name="background" value={nuevoServicio.background} onChange={handleInputChange} margin="normal" />
                            <TextField fullWidth label="Nombre del icono" name="iconName" value={nuevoServicio.iconName} onChange={handleInputChange} margin="normal" />
                          </Box>
                        )}

                        {tabIndex === 1 && (
                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
                              Secciones del servicio
                            </Typography>
                            {nuevoServicio.sections.map((section, idx) => (
                              <Paper key={idx} sx={{ p: 2, mb: 2, backgroundColor: 'white' }}>
                                <TextField
                                  fullWidth
                                  label="Título de la sección"
                                  value={section.title}
                                  onChange={(e) => {
                                    const updatedSections = nuevoServicio.sections.map((section, i) =>
                                      i === idx ? { ...section, description: e.target.value } : section
                                    );
                                    setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
                                  }}
                                  sx={{ mb: 1 }}
                                />

                                <TextField
                                  fullWidth
                                  label="Descripción de la sección"
                                  value={section.description}
                                  onChange={(e) => {
                                    const updatedSections = nuevoServicio.sections.map((s, i) =>
                                      i === idx ? { ...s, description: e.target.value } : s
                                    );
                                    setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
                                  }}
                                  multiline
                                  rows={2}
                                  sx={{ mb: 2 }}
                                />

                                {section.items && section.items.length > 0 && (
                                  <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                                    {section.items.map((item, i) => (
                                      <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                                    ))}
                                  </ul>
                                )}
                              </Paper>
                            ))}


                          </Box>
                        )}

                        <Box display="flex" justifyContent="center" gap={2} mt={3}>
                          <Button variant="contained" onClick={handleGuardar} color="primary" startIcon={selected !== null ? <UpdateIcon /> : <AddIcon />} sx={{ flex: 1, maxWidth: 400 }}>
                            {selected !== null ? 'Actualizar' : 'Agregar'}
                          </Button>
                          <Button variant="contained" onClick={handleCancelar} sx={{ flex: 1, maxWidth: 400, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}>
                            Cancelar
                          </Button>
                        </Box>
                      </Box>
                    </Collapse>
                  </Card>
                </motion.div>
              ))}

              <Box textAlign="right" mt={4}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelected(null);
                    setNuevoServicio({ title: '', description: '', img: '', background: '', iconName: '', sections: [] });
                    setMostrarFormulario(services.length);
                    setTabIndex(0);
                    setSnackbar({ open: true, message: 'En construcción...' }); // 👈 agregado aquí
                  }}
                >
                  Agregar Servicio
                </Button>
              </Box>

            </Grid>
          </Grid>
        </Box>
        {/* Menú elegante con hover */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
          style={{
            position: "fixed", // ✅ para que quede fijo incluso con scroll
            bottom: 0,         // ✅ pegado al borde inferior
            left: 0,
            width: "100%",     // ✅ ocupa todo el ancho disponible
            display: "flex",
            justifyContent: "center", // ✅ centrado horizontal
            zIndex: 10,
            pointerEvents: "auto", // 👈 asegura interacción
          }}
        >
          <Box
            sx={{
              width: cardSize,              // 📐 tu ancho ya definido
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              pt: 1,
              gap: 0,
              position: "relative",
            }}
          >
            {/* Catálogo (sin hover) */}
            <Box
              sx={{
                flex: 1,
                height: 65,
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "-10%",
                zIndex: 1,
                cursor: "not-allowed",
                boxShadow: "inset -2px 0px 3px rgba(0,0,0,0.05)"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "translateX(-20%)",
                  textAlign: "center",
                }}
              >
                <ViewCarouselIcon sx={{ fontSize: 26, color: "grey.500" }} />
                <Typography
                  variant="caption"
                  fontSize={11}
                  color="grey.500"
                  sx={{ mt: 0.2 }}
                >
                  Catálogo
                </Typography>
              </Box>
            </Box>

            {/* Visitas (activo con hover suave aunque no clickable) */}
            <Box
              sx={{
                flex: 1.3,
                height: 108,
                backgroundColor: "#ffffff",
                border: "2px solid black",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                marginBottom: "-10px",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "#f7f7f7",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.2)", // más suave y visible
                }

              }}
            >
              {/* 👇 animación conjunta */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  delay: 1.4,
                  duration: 1,
                  ease: "easeInOut",
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <HomeRepairServiceIcon sx={{ fontSize: 45, color: "success.main" }} />
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  fontSize={15}
                  color="success.main"
                >
                  Servicios
                </Typography>
              </motion.div>
            </Box>


            {/* Servicios (hover activo) */}
            <Box
              sx={{
                flex: 1,
                height: 65,
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 2px 0px 3px rgba(0,0,0,0.05)",
                marginLeft: "-10%",
                zIndex: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: "#f7f7f7",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },

              }}
              onClick={() => navigate("/dashboard")}

            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "translateX(20%)",
                  textAlign: "center",
                }}
              >
                <BarChartIcon sx={{ fontSize: 26, color: "primary.main", transition: "transform 0.3s ease, color 0.3s ease" }} />
                <Typography variant="caption" fontSize={11}>
                  Visitas
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Dialog open={servicioAEliminar !== null} onClose={() => setServicioAEliminar(null)}>
        <DialogTitle>Eliminar servicio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar el servicio "{servicioAEliminar !== null && services[servicioAEliminar]?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setServicioAEliminar(null)}>Cancelar</Button>
          <Button onClick={confirmarEliminar} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ConfigurarServicios;