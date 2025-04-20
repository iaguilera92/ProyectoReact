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
import RestoreIcon from '@mui/icons-material/Restore';

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
    orden: '',
    sections: [],
  });

  const navigate = useNavigate();
  const containerRef = React.useRef();
  const [itemAEliminar, setItemAEliminar] = useState(null);

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
      const data = await cargarServicios(`https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Servicios.xlsx?t=${timestamp}`);
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

  const handleGuardar = async () => {
    if (selected === null) {
      setSnackbar({ open: true, message: 'En construcción...' });
      return;
    }

    const actualizados = [...services];
    actualizados[selected] = nuevoServicio;
    setServices(actualizados);

    const isLocal = window.location.hostname === "localhost";
    const url = isLocal
      ? "http://localhost:9999/.netlify/functions/actualizarServicio"
      : "/.netlify/functions/actualizarServicio";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio: nuevoServicio }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : { message: 'Servicio actualizado' };

      setSnackbar({ open: true, message: result.message || 'Servicio actualizado' });
    } catch (error) {
      console.error("❌ Error al actualizar Excel:", error);
      setSnackbar({ open: true, message: 'Error al actualizar Excel' });
    }

    setNuevoServicio({ title: '', description: '', img: '', background: '', iconName: '', orden: '', sections: [] });
    setSelected(null);
    setMostrarFormulario(null);
  };

  //RESTAURAR SERVICIOS
  const handleRestaurarServicios = async () => {
    const isLocal = window.location.hostname === "localhost";
    const url = isLocal
      ? "http://localhost:9999/.netlify/functions/restaurarServicios"
      : "/.netlify/functions/restaurarServicios";

    try {
      const response = await fetch(url, { method: "POST" });

      if (!response.ok) throw new Error("Error al restaurar Excel desde local");

      const resultText = await response.text();
      const result = resultText ? JSON.parse(resultText) : { message: 'Excel restaurado' };

      setSnackbar({ open: true, message: result.message || 'Excel restaurado' });
    } catch (error) {
      console.error("❌ Error al restaurar Excel:", error);
      setSnackbar({ open: true, message: 'Error al restaurar el Excel' });
    }
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

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden', // 👈 Agregado aquí
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
        <Box mb={4} px={2} sx={{ width: '100%', overflowX: 'hidden' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>


              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap={1}
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <SettingsSuggestIcon sx={{ color: 'white', fontSize: 22 }} />
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontFamily: 'Roboto, Arial, sans-serif',
                      fontSize: { xs: '1rem', sm: '1.25rem' }, // Tamaño de fuente responsivo
                    }}
                  >
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

                <Button
                  onClick={handleRestaurarServicios}
                  variant="outlined"
                  color="inherit"
                  startIcon={<UpdateIcon />}
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }, // Tamaño de fuente responsivo
                    padding: { xs: '4px 8px', sm: '6px 12px' }, // Padding responsivo
                    minWidth: 'auto', // Evita ancho mínimo fijo
                    '&:hover': {
                      backgroundColor: '#ffffff22',
                      borderColor: '#ffffffcc',
                    },
                  }}
                >
                  Restaurar
                </Button>
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
                      <Box
                        sx={{
                          p: 3,
                          background: '#fff',
                          borderTop: '1px solid rgba(0,0,0,0.1)',
                          width: '100%',
                          overflowX: 'hidden'
                        }}
                      >
                        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} sx={{ mb: 2 }}>
                          <Tab label="General" />
                          <Tab label="Secciones" />
                        </Tabs>

                        {tabIndex === 0 && (
                          <Box>
                            <Typography variant="h6" gutterBottom sx={{ color: '#000', fontFamily: 'Roboto, Arial, sans-serif' }}>Editar Servicio</Typography>
                            <Box display="flex" gap={2}>
                              <TextField
                                label="Título"
                                name="title"
                                value={nuevoServicio.title}
                                onChange={handleInputChange}
                                margin="normal"
                                fullWidth
                                sx={{ flex: 4 }}
                              />
                              <TextField
                                label="Orden"
                                name="orden"
                                value={nuevoServicio.orden}
                                onChange={(e) => {
                                  const value = e.target.value.slice(0, 2); // Máximo 2 caracteres
                                  const num = parseInt(value);
                                  const max = services.length;

                                  // Solo permitir números válidos dentro del rango
                                  if (!isNaN(num) && num >= 1 && num <= max) {
                                    setNuevoServicio((prev) => ({ ...prev, orden: value }));
                                  } else if (value === "") {
                                    // Permitir borrado
                                    setNuevoServicio((prev) => ({ ...prev, orden: "" }));
                                  }
                                }}
                                margin="normal"
                                type="number"
                                sx={{ flex: 1 }}
                                inputProps={{
                                  maxLength: 2,
                                  min: 1,
                                  max: services.length,
                                }}
                                error={
                                  !nuevoServicio.orden ||
                                  isNaN(parseInt(nuevoServicio.orden)) ||
                                  parseInt(nuevoServicio.orden) < 1 ||
                                  parseInt(nuevoServicio.orden) > services.length
                                }
                                helperText={
                                  !nuevoServicio.orden
                                    ? "Requerido"
                                    : parseInt(nuevoServicio.orden) > services.length
                                      ? `Máx permitido: ${services.length}`
                                      : ""
                                }
                              />
                            </Box>

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
                              <Paper
                                key={idx}
                                sx={{
                                  p: 2,
                                  mb: 2,
                                  backgroundColor: 'white',
                                  width: '100%',
                                  maxWidth: '100%', // 👈 Fuerza que no se pase del ancho
                                  overflowX: 'hidden', // 👈 Importante también aquí
                                  boxSizing: 'border-box', // 👈 Previene desbordes por padding
                                }}
                              >

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

                                {section.items.map((item, i) => (
                                  <Grid container spacing={0} alignItems="center" key={i} mb={1}>
                                    <Grid item xs>
                                      <TextField
                                        fullWidth
                                        label={`Item ${i + 1}`}
                                        value={item}
                                        onChange={(e) => {
                                          const updatedSections = nuevoServicio.sections.map((s, secIndex) => {
                                            if (secIndex === idx) {
                                              const updatedItems = [...s.items];
                                              updatedItems[i] = e.target.value;
                                              return { ...s, items: updatedItems };
                                            }
                                            return s;
                                          });
                                          setNuevoServicio((prev) => ({ ...prev, sections: updatedSections }));
                                        }}
                                      />
                                    </Grid>
                                    <Grid item>
                                      <IconButton onClick={() => setItemAEliminar({ sectionIdx: idx, itemIdx: i })}>
                                        <DeleteIcon color="error" />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                ))}


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
                    if (services.length >= 6) {
                      setSnackbar({ open: true, message: 'Solo se permiten hasta 6 servicios principales.' });
                      return;
                    }
                    setSelected(null);
                    setNuevoServicio({ title: '', description: '', img: '', background: '', iconName: '', sections: [] });
                    setMostrarFormulario(services.length);
                    setTabIndex(0);
                    setSnackbar({ open: true, message: 'En construcción...' }); // Si lo deseas mantener
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

      <Dialog
        open={itemAEliminar !== null}
        onClose={() => setItemAEliminar(null)}
      >
        <DialogTitle>Eliminar item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro que deseas eliminar este item de la sección?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemAEliminar(null)}>Cancelar</Button>
          <Button
            color="error"
            onClick={() => {
              const { sectionIdx, itemIdx } = itemAEliminar;
              const updatedSections = nuevoServicio.sections.map((s, idx) => {
                if (idx === sectionIdx) {
                  const updatedItems = [...s.items];
                  updatedItems.splice(itemIdx, 1);
                  return { ...s, items: updatedItems };
                }
                return s;
              });

              setNuevoServicio(prev => ({
                ...prev,
                sections: updatedSections,
              }));
              setSnackbar({ open: true, message: "Item eliminado correctamente!" });
              setItemAEliminar(null);
            }}
          >
            Eliminar
          </Button>
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