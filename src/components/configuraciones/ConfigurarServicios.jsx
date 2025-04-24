import React, { useEffect, useState, useRef } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, IconButton, Container, Collapse,
  Card, CardContent, useTheme, Tabs, Tab, Snackbar, Alert, useMediaQuery, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cargarServicios } from "../../helpers/HelperServicios";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import UpdateIcon from '@mui/icons-material/Update';
import RestoreIcon from '@mui/icons-material/Restore';
import { motion, AnimatePresence } from 'framer-motion';
import MenuInferior from './MenuInferior';
import { DialogEliminarServicio, DialogEliminarItem, DialogRestaurar } from './DialogosServicios';

const ConfigurarServicios = () => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(null);
  const [servicioAEliminar, setServicioAEliminar] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [eliminando, setEliminando] = useState(false);
  const [nuevoServicio, setNuevoServicio] = useState({ title: '', description: '', img: '', background: '', iconName: '', orden: '', sections: [] });
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const [ocultarServicios, setOcultarServicios] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  const [restaurando, setRestaurando] = useState(false);
  const [actualizando, setActualizando] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "340px";
  const containerRef = useRef();

  useEffect(() => {
    const credenciales = (() => {
      try {
        return JSON.parse(localStorage.getItem("credenciales"));
      } catch {
        return null;
      }
    })();
    if (!credenciales?.email || !credenciales?.password) navigate("/administracion", { replace: true });
    else recargarServicios();
  }, [navigate]);

  const recargarServicios = async () => {
    const timestamp = Date.now();
    const data = await cargarServicios(`https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Servicios.xlsx?t=${timestamp}`);
    setServices(data);
    setOcultarServicios(false);
  };

  const handleEditar = (index) => {
    setSelected(index);
    setNuevoServicio({ ...services[index] });
    setMostrarFormulario(index);
    setTabIndex(0);
  };

  const handleCancelar = async () => {
    if (selected !== null && services[selected]?.esNuevo) await recargarServicios();
    setSelected(null);
    setMostrarFormulario(null);
  };

  const handleEliminar = (index) => setServicioAEliminar(index);

  const confirmarEliminar = async () => {
    if (eliminando || servicioAEliminar === null) return;
    setEliminando(true);
    try {
      const id = services[servicioAEliminar]?.IdServicio;
      const url = `${window.location.hostname === "localhost" ? "http://localhost:9999" : ""}/.netlify/functions/eliminarServicio`;
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ IdServicio: id }) });
      if (!res.ok) throw new Error("Error al eliminar");
      setServices(prev => prev.filter(s => s.IdServicio !== id));
      setSnackbar({ open: true, message: "Servicio eliminado correctamente!" });
      setServicioAEliminar(null);
    } catch (err) {
      console.error("❌ Error al eliminar servicio:", err);
      setSnackbar({ open: true, message: "Error al eliminar servicio" });
    } finally {
      setEliminando(false);
    }
  };

  const handleGuardar = async () => {
    if (selected === null) return setSnackbar({ open: true, message: 'En construcción...' });
    const servicio = { ...nuevoServicio };

    // ✅ Validación solo si es nuevo
    if (services[selected]?.esNuevo) {
      if (!servicio.title || !servicio.description || !servicio.orden || isNaN(servicio.orden)) {
        setSnackbar({ open: true, message: 'Por favor completa todos los campos obligatorios.' });
        return;
      }
    }

    if (services[selected]?.esNuevo) servicio.IdServicio = crypto.randomUUID();
    delete servicio.esNuevo;
    const actualizados = [...services];
    actualizados[selected] = servicio;
    setServices(actualizados);

    const url = `${window.location.hostname === "localhost" ? "http://localhost:9999" : ""}/.netlify/functions/actualizarServicio`;
    setActualizando(true);
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ servicio }) });
      const result = await res.text();
      const parsed = result ? JSON.parse(result) : { message: "Servicio actualizado" };
      setSnackbar({ open: true, message: parsed.message });
    } catch (err) {
      console.error("❌ Error al actualizar Excel:", err);
      setSnackbar({ open: true, message: "Error al actualizar Excel" });
    } finally {
      await recargarServicios();
      setSelected(null);
      setMostrarFormulario(null);
      setActualizando(false);
    }
  };

  const handleConfirmarRestaurar = async () => {
    setRestaurando(true);
    try {
      const url = `${window.location.hostname === "localhost" ? "http://localhost:9999" : ""}/.netlify/functions/restaurarServicios`;
      const res = await fetch(url, { method: "POST" });
      const result = await res.text();
      const parsed = result ? JSON.parse(result) : { message: "Excel restaurado" };
      setSnackbar({ open: true, message: parsed.message });
      await recargarServicios();
      setTimeout(() => {
        setRestoreConfirmOpen(false);
        setRestaurando(false);
      }, 300);
    } catch (err) {
      console.error("❌ Error al restaurar Excel:", err);
      setSnackbar({ open: true, message: "Error al restaurar Excel" });
      setRestoreConfirmOpen(false);
      setRestaurando(false);
    }
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => { document.body.style.overflowX = "auto"; };
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: 0.3 + i * 0.05 } })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoServicio((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', width: '100vw', overflowX: 'hidden', py: 1, px: 0, pb: 3.5, backgroundImage: 'url(fondo-blizz.avif)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
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
                  onClick={() => setRestoreConfirmOpen(true)}
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




              <AnimatePresence>
                {services.map((s, idx) => {
                  const mostrarSoloNuevo = s.esNuevo || !ocultarServicios;
                  if (!mostrarSoloNuevo) return null; // 👈 control desde el render, no desde CSS

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -60 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    >
                      <Card sx={{ mb: 2, overflow: 'hidden', background: s.background || '#fff', transition: 'all 0.4s ease' }}>
                        <CardContent
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white',
                            fontFamily: 'Roboto, Arial, sans-serif'
                          }}
                        >
                          <Box>
                            {s.esNuevo ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <SettingsSuggestIcon sx={{ color: 'black' }} />
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  sx={{ color: 'black' }}
                                >
                                  Nuevo Servicio para Plataformas web
                                </Typography>
                              </Box>
                            ) : (
                              <>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                  sx={{ color: 'white' }}
                                >
                                  {s.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'white', opacity: 0.85 }}>
                                  {s.description}
                                </Typography>
                              </>
                            )}
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
                            {!s.esNuevo && (
                              <IconButton onClick={() => handleEliminar(idx)} sx={{ color: 'white' }}>
                                <DeleteIcon />
                              </IconButton>
                            )}
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
                                    sx={{ flex: isMobile ? 3 : 4 }}
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
                                <TextField
                                  fullWidth
                                  label="Imagen"
                                  name="img"
                                  value={nuevoServicio.img}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <RestoreIcon
                                          sx={{
                                            color: 'info.main',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              color: 'primary.dark',
                                              transform: 'scale(1.1)',
                                              transition: 'all 0.2s ease-in-out',
                                            },
                                          }}
                                          onClick={() => setNuevoServicio((prev) => ({ ...prev, img: '/default.webp' }))}
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                />

                                <TextField
                                  fullWidth
                                  label="Fondo (background)"
                                  name="background"
                                  value={nuevoServicio.background}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <RestoreIcon
                                          sx={{
                                            color: 'info.main',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              color: 'primary.dark',
                                              transform: 'scale(1.1)',
                                              transition: 'all 0.2s ease-in-out',
                                            },
                                          }}
                                          onClick={() => setNuevoServicio((prev) => ({ ...prev, background: 'linear-gradient(180deg, #4b2c72, #8e44ad)' }))}
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                <TextField
                                  fullWidth
                                  label="Nombre del icono"
                                  name="iconName"
                                  value={nuevoServicio.iconName}
                                  onChange={handleInputChange}
                                  margin="normal"
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <RestoreIcon
                                          sx={{
                                            color: 'info.main',
                                            cursor: 'pointer',
                                            '&:hover': {
                                              color: 'primary.dark',
                                              transform: 'scale(1.1)',
                                              transition: 'all 0.2s ease-in-out',
                                            },
                                          }}
                                          onClick={() => setNuevoServicio((prev) => ({
                                            ...prev,
                                            iconName: 'BuildCircleIcon'
                                          }))}
                                        />
                                      </InputAdornment>
                                    ),
                                  }}
                                />

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
                                          i === idx ? { ...section, title: e.target.value } : section
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
                                          <IconButton
                                            onClick={() => {
                                              const updatedSections = nuevoServicio.sections.map((s, secIndex) => {
                                                if (secIndex === idx) {
                                                  const updatedItems = [...s.items];
                                                  updatedItems.splice(i, 1); // 👈 elimina el item directamente
                                                  return { ...s, items: updatedItems };
                                                }
                                                return s;
                                              });
                                              setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
                                              setSnackbar({ open: true, message: "Item eliminado correctamente!" });
                                            }}
                                          >
                                            <DeleteIcon color="error" />
                                          </IconButton>
                                        </Grid>

                                        {/* Solo mostrar el botón si es el último ítem */}
                                        {i === section.items.length - 1 && (
                                          <Grid item xs={12} textAlign="right" mt={1} mr={5}>
                                            <Button
                                              size="small"
                                              variant="outlined"
                                              startIcon={<AddIcon />}
                                              onClick={() => {
                                                const updatedSections = nuevoServicio.sections.map((s, secIdx) => {
                                                  if (secIdx === idx) {
                                                    return { ...s, items: [...s.items, ""] };
                                                  }
                                                  return s;
                                                });
                                                setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
                                              }}
                                            >
                                              Agregar Item
                                            </Button>
                                          </Grid>
                                        )}
                                      </Grid>
                                    ))}
                                    {section.items.length === 0 && (
                                      <Box textAlign="right" mt={1}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<AddIcon />}
                                          onClick={() => {
                                            const updatedSections = nuevoServicio.sections.map((s, secIdx) => {
                                              if (secIdx === idx) {
                                                return { ...s, items: [""] }; // 👈 agrega el primer item
                                              }
                                              return s;
                                            });
                                            setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
                                          }}
                                        >
                                          Agregar Item
                                        </Button>
                                      </Box>
                                    )}

                                  </Paper>
                                ))}
                              </Box>
                            )}

                            <Box display="flex" justifyContent="center" gap={2} mt={3}>
                              <Button
                                variant="contained"
                                onClick={handleGuardar}
                                color="primary"
                                startIcon={services[selected]?.esNuevo ? <AddIcon /> : <UpdateIcon />}
                                disabled={actualizando}
                                sx={{ flex: 1, maxWidth: 400 }}
                              >
                                {actualizando
                                  ? services[selected]?.esNuevo
                                    ? 'Agregando...'
                                    : 'Actualizando...'
                                  : services[selected]?.esNuevo
                                    ? 'Agregar Servicio'
                                    : 'Actualizar'}
                              </Button>

                              <Button variant="contained" onClick={handleCancelar} sx={{ flex: 1, maxWidth: 400, backgroundColor: '#dc3545', '&:hover': { backgroundColor: '#c82333' } }}>
                                Cancelar
                              </Button>
                            </Box>
                          </Box>
                        </Collapse>
                      </Card>
                    </motion.div>
                  )
                }
                )}
              </AnimatePresence>
              {!ocultarServicios && (
                <Box textAlign="right" mt={4}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      if (services.length >= 6) {
                        setSnackbar({ open: true, message: 'Solo se permiten hasta 6 servicios principales.' });
                        return;
                      }

                      setOcultarServicios(true); // 🚫 Oculta las cards y el botón

                      setTimeout(() => {
                        const nuevo = {
                          title: '',
                          description: '',
                          img: '',
                          background: '',
                          iconName: '',
                          orden: (services.length + 1).toString(),
                          sections: [
                            {
                              title: '',
                              description: '',
                              image: '',
                              items: ['']
                            }
                          ],
                          esNuevo: true
                        };

                        setServices((prev) => [...prev, nuevo]);
                        setNuevoServicio(nuevo);
                        setSelected(services.length);
                        setMostrarFormulario(services.length);
                        setTabIndex(0);
                      }, 500);
                    }}
                  >
                    Agregar Servicio
                  </Button>
                </Box>
              )}

            </Grid>
          </Grid>
        </Box>

        <MenuInferior cardSize={cardSize} modo="servicios" />
      </Box>
      <DialogEliminarServicio open={servicioAEliminar !== null} servicio={services[servicioAEliminar]} eliminando={eliminando} onClose={() => !eliminando && setServicioAEliminar(null)} onConfirm={confirmarEliminar} />
      <DialogEliminarItem open={itemAEliminar !== null} onClose={() => setItemAEliminar(null)} onConfirm={(sectionIdx, itemIdx) => {
        const updatedSections = nuevoServicio.sections.map((s, idx) => {
          if (idx === sectionIdx) {
            const updatedItems = [...s.items];
            updatedItems.splice(itemIdx, 1);
            return { ...s, items: updatedItems };
          }
          return s;
        });
        setNuevoServicio(prev => ({ ...prev, sections: updatedSections }));
        setSnackbar({ open: true, message: "Item eliminado correctamente!" });
        setItemAEliminar(null);
      }} itemAEliminar={itemAEliminar} />
      <DialogRestaurar open={restoreConfirmOpen} onClose={() => !restaurando && setRestoreConfirmOpen(false)} onConfirm={handleConfirmarRestaurar} restaurando={restaurando} />
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ConfigurarServicios;
