import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Snackbar, Alert, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./css/Contacto.css"; // Importamos el CSS
import "leaflet/dist/leaflet.css"; // Estilo básico de Leaflet
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import ContactoForm from './ContactoForm';

const finalPosition = [-33.435054, -70.688067];

const letterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.4 + i * 0.1 },
  }),
};


function Contacto() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [containerHeight, setContainerHeight] = useState("50vh"); // Inicia con 50vh
  const [rotate, setRotate] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Estado para detectar si el mouse está encima
  const initialZoom = 3; // Zoom inicial lejano
  const finalZoom = 17; // Zoom final al que queremos llegar
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "error", // "error", "success", etc.
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
        // Después de la animación, restauramos la altura
        setContainerHeight("auto");
      }, 1300); // Ajusta el tiempo de animación según lo necesites
      return () => clearTimeout(timer);
    }
  }, [inView]);


  // Componente que maneja los clics en el mapa
  const MapClickHandler = () => {
    useMapEvent("click", () => {
      const googleMapsUrl = `https://www.google.com/maps?q=${finalPosition[0]},${finalPosition[1]}`;
      window.open(googleMapsUrl, "_blank"); // Abre Google Maps en una nueva pestaña
    });

    return null; // No renderiza nada, solo maneja el evento
  };

  useEffect(() => {
    let interval;

    if (inView) { // Solo inicia la rotación si el componente es visible en pantalla
      interval = setInterval(() => {
        if (!isHovered) {
          setRotate((prevRotate) => (prevRotate + 180) % 360); // Cambia la rotación cada 7 segundos si no hay hover
        }
      }, 6000);
    } else {
      clearInterval(interval); // Detiene la rotación si el usuario scrollea fuera del componente
    }

    return () => clearInterval(interval); // Limpia el intervalo al desmontar o cambiar la visibilidad
  }, [isHovered, inView]);


  return (
    <Container
      sx={{
        maxWidth: "none !important",
        marginLeft: 0,
        py: 11,
        position: "relative",
        overflow: "hidden",
        paddingTop: 0,
        paddingBottom: "20px",
        minHeight: isMobile ? containerHeight : containerHeight, // 👈 Cambia esto
        backgroundImage: isMobile ? 'url(/fondo-mundo-mobile.png)' : 'url(/fondo-mundo.png)',
        backgroundColor: "rgb(0 30 43/var(--tw-bg-opacity,1))",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
      ref={ref}
    >
      {/* Divs con imágenes */}
      <div
        className={`image image-left ${startAnimation ? "animate-left" : ""}`}
        style={{
          width: "50%",
          height: isMobile ? "50vh" : "76vh",
          backgroundImage: isMobile ? "url('/mapa-left.jpg')" : "url('/mapa.webp')",
          backgroundSize: isMobile ? "cover" : "contain",   // 👈 Mostrar completa en escritorio
          backgroundPosition: isMobile ? "center" : "top",  // 👈 Alinear arriba para escritorio
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000" // para evitar espacios blancos si sobra
        }}
      ></div>

      <div
        className={`image image-right ${startAnimation ? "animate-right" : ""}`}
        style={{
          width: "50%",
          height: isMobile ? "50vh" : "76vh",
          backgroundImage: isMobile ? "url('/mapa-right.jpg')" : "url('/contactar.webp')",
          backgroundSize: isMobile ? "cover" : "contain",   // 👈 Mostrar completa en escritorio
          backgroundPosition: isMobile ? "center" : "top",  // 👈 Alinear arriba para escritorio
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000"
        }}
      ></div>



      {!startAnimation && (
        <Box
          sx={{
            position: "absolute", // clave para que se ancle al Container
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
            pointerEvents: "none", // opcional para que no bloquee clics
          }}
        >
          <div id="loader" />
        </Box>
      )}




      {startAnimation && (
        <Box
          sx={{
            opacity: startAnimation ? 1 : 0,
            transition: "opacity 0.8s ease-in-out, transform 0.8s ease-in-out",
            transform: startAnimation ? "translateY(0)" : "translateY(40px)",
          }}
        >
          < Box sx={{ position: "relative", zIndex: 2, paddingTop: "20px", display: "flex", flexDirection: "column", height: "100%" }}>

            {!formSubmitted && (
              <Typography
                variant={isMobile ? "h4" : "h4"}
                align="left"
                gutterBottom
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center", // 🔹 asegura que todos los elementos hijos estén alineados verticalmente
                  fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
                  lineHeight: 1.2,
                }}
              >
                {/* Barra | verde al inicio */}
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: isMobile ? "1.3rem" : "1.3rem",
                    display: "inline-block",
                    verticalAlign: "middle", // ✅ mantiene alineado con el texto
                    marginRight: "2px",
                    marginBottom: isMobile ? "3px" : "5px"
                  }}
                >
                  |
                </motion.span>

                {"Contáctanos".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    custom={index}
                    variants={letterVariants}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre",
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </Typography>
            )}

            {!formSubmitted ? (
              <Grid container spacing={4} sx={{ height: "auto" }}>
                {/* Mapa */}
                <Grid item xs={12} md={6} sx={{ height: "auto" }}>
                  <motion.div
                    ref={ref}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: rotate }}
                    transition={{
                      rotateY: { duration: 1.5, ease: "easeInOut" },
                    }}
                    style={{
                      position: "relative",
                      width: "100%",
                      minHeight: "40vh", // 🔹 Asegura que en móviles no desaparezca
                      height: isMobile ? "40vh" : "100%",
                      perspective: 1200, // 🔹 Mantiene el efecto 3D
                      transformStyle: "preserve-3d", // Necesario para la rotación 3D
                    }}
                  >
                    {/* ✅ Cara frontal: Mapa */}
                    <motion.div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#fff",
                        borderRadius: 5,
                        border: "1px solid #30363D",
                        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Sombra sutil
                        overflow: "hidden",
                        transform: "rotateY(0deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <Box sx={{ flexGrow: 1, height: "100%" }}>
                        <Box sx={{ width: "100%", height: isMobile ? "40vh" : "100%", overflow: "hidden" }}>
                          <MapContainer
                            center={finalPosition}
                            zoom={16}
                            style={{
                              width: "100%",
                              height: isMobile ? "40vh" : "100%",
                            }}
                            dragging={false}
                            scrollWheelZoom={false}
                            touchZoom={false}
                            doubleClickZoom={false}
                            zoomControl={false}
                            whenCreated={() => setMapLoaded(true)}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              subdomains={['a', 'b']} // solo dos subdominios
                              maxZoom={17}
                              noWrap={true}
                              updateWhenIdle={true}
                            />
                            <Marker
                              position={finalPosition}
                              icon={new L.Icon({
                                iconUrl: "/logo-mapa.png",
                                iconSize: [160, 160],
                                iconAnchor: [80, 80],
                                popupAnchor: [0, -80],
                              })}
                            />
                            <ZoomEffect zoom={finalZoom} />
                            {/* ✅ Mensaje "Encuéntranos!" */}
                            <div
                              style={{
                                position: "absolute",
                                top: isMobile ? "14%" : "16%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "black",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "5px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                                fontSize: "16px",
                                fontWeight: "bold",
                                zIndex: 1000,
                                pointerEvents: "none",
                              }}
                            >
                              ¡Encuéntranos!
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "-8px",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  width: 0,
                                  height: 0,
                                  borderLeft: "10px solid transparent",
                                  borderRight: "10px solid transparent",
                                  borderTop: "10px solid black",
                                }}
                              />
                            </div>
                            <MapClickHandler />
                          </MapContainer>


                        </Box>
                      </Box>
                    </motion.div>

                    {/* ✅ Cara trasera: Imagen */}
                    <motion.div
                      style={{
                        position: "absolute",
                        top: isMobile ? 25 : 0,
                        left: isMobile ? 0 : 0,
                        right: isMobile ? 0 : 30,
                        width: "100%",
                        height: "100%",
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <img
                        src="/contacto.webp"
                        alt="Imagen de contacto"
                        style={{
                          width: isMobile ? "100%" : "80%",
                          height: isMobile ? "85%" : "100%",
                          borderRadius: 2,
                        }}
                      />
                    </motion.div>
                  </motion.div>
                </Grid>


                <Grid item xs={12} md={6}>
                  <ContactoForm setSnackbar={setSnackbar} />

                </Grid>

              </Grid>
            ) : (
              <Box sx={{ p: 8, mt: 4, minHeight: "300px", backgroundColor: "#e0f7e9", borderRadius: 2, textAlign: "center", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
                <CheckCircleIcon sx={{ fontSize: 180, color: "green", mb: 2 }} />
                <Typography variant="h4" sx={{ color: "black" }}>
                  Se ha enviado su mensaje correctamente! Le hablaremos por WhatsApp y correo a la brevedad.
                </Typography>
              </Box>
            )}

            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              sx={{ zIndex: 1400 }} // 🛡️ Material UI usa 1300 para modales por defecto
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.type}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  fontSize: "0.9rem",
                  boxShadow: 3,
                }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      )}
    </Container >
  );
}
const ZoomEffect = ({ zoom, startAnimation }) => {
  const map = useMapEvent("load", () => { });
  const zoomApplied = useRef(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (!map || !inView || zoomApplied.current || startAnimation) return;

    zoomApplied.current = true;

    const delayTimer = setTimeout(() => {
      let zoomLevel = isMobile ? 7 : 5;
      const zoomSpeed = isMobile ? 0.06 : 0.05;
      const offsetY = isMobile ? 0.0001 : 0;
      const correctedPosition = [finalPosition[0] + offsetY, finalPosition[1]];

      map.setView(correctedPosition, zoomLevel, {
        animate: true,
        duration: isMobile ? 0.4 : 0.3,
        easeLinearity: 1,
      });

      const animateZoom = () => {
        if (zoomLevel < zoom) {
          zoomLevel += zoomSpeed;
          if (zoomLevel >= zoom) zoomLevel = zoom;

          map.flyTo(correctedPosition, zoomLevel, {
            animate: true,
            duration: isMobile ? 0.4 : 0.3,
            easeLinearity: 1,
          });

          requestAnimationFrame(animateZoom);
        }
      };

      requestAnimationFrame(animateZoom);
    }, 300); // delay antes de empezar animación

    return () => clearTimeout(delayTimer);
  }, [inView, map, zoom, isMobile, startAnimation]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
};



// Componente que redirige a Google Maps al hacer clic en el mapa
const MapClickHandler = () => {
  useMapEvent("click", () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${finalPosition[0]},${finalPosition[1]}`;
    window.open(googleMapsUrl, "_blank");
  });

  return null;
};

export default Contacto;
