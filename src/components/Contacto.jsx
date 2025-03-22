import React, { useState, useEffect,useRef   } from "react";
import { Container, Typography, Box, TextField, Button, Snackbar, Alert, Grid, useMediaQuery } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./css/Contacto.css"; // Importamos el CSS
import "leaflet/dist/leaflet.css"; // Estilo básico de Leaflet
import { MapContainer, TileLayer, Marker,  useMap, useMapEvent   } from "react-leaflet";
import L from "leaflet";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
const finalPosition = [-33.435054, -70.688067];

const letterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 1.45 + i * 0.1 },
  }),
};

const customIcon = new L.Icon({
  iconUrl: "/gps-mobile.png", // Ruta a la imagen en la carpeta public
  iconSize: [70, 70], // Tamaño del icono
  iconAnchor: [35, 35], // Centrado del icono
  popupAnchor: [0, -35], // Popup ligeramente por encima del marcador
});


function Contacto() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [bgPosition, setBgPosition] = useState("center 0px");
  const [containerHeight, setContainerHeight] = useState("50vh"); // Inicia con 50vh
  const [rotate, setRotate] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Estado para detectar si el mouse está encima
  const [intervalActive, setIntervalActive] = useState(true); 
  const initialZoom = 3; // Zoom inicial lejano
  const finalZoom = 17; // Zoom final al que queremos llegar
  const isMobile = useMediaQuery("(max-width:600px)"); // Detectar si es móvil
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
        // Después de la animación, restauramos la altura
        setContainerHeight("auto");
      }, 1000); // Ajusta el tiempo de animación según lo necesites
      return () => clearTimeout(timer);
    }
  }, [inView]);



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Número de Teléfono:", phone);
    console.log("Solicitud:", message);
    setFormSubmitted(true);
    setOpenAlert(true);
    setPhone("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    minHeight: isMobile ? containerHeight : "auto", // 👈 Cambia esto
    backgroundImage: isMobile ? 'url(/fondo-mundo-mobile.png)' : 'url(/fondo-mundo.png)',
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
    width: isMobile ? "50vw" : "50vw", // ✅ Mantiene altura adaptable en móviles
    height: isMobile ? "50vh" : "76vh", // ✅ Mantiene altura adaptable en móviles
    backgroundImage: isMobile ? "url('/fono-left.jpg')" : "url('/mapa.jpg')",
    backgroundSize: "cover", // ✅ Evita cortes extraños en la imagen
    backgroundPosition: "center", // ✅ Centra la imagen correctamente
    backgroundRepeat: "no-repeat", // ✅ Evita que la imagen se repita
  }}
></div>

<div
  className={`image image-right ${startAnimation ? "animate-right" : ""}`}
  style={{
    width: isMobile ? "50vw" : "50vw", // ✅ Mantiene altura adaptable en móviles
    height: isMobile ? "50vh" : "76vh", // ✅ Mantiene altura adaptable en móviles
    backgroundImage: isMobile ? "url('/fono-right.jpg')" : "url('/contactar.jpg')",
    backgroundSize: "cover", // ✅ Se ajusta sin cortes ni estiramientos
    backgroundPosition: "center", // ✅ Centra la imagen correctamente en cualquier pantalla
    backgroundRepeat: "no-repeat",
  }}
></div>


{!startAnimation && (
  <Box
    sx={{
      position: "absolute", // ✅ Se posiciona respecto al Container (que tiene position: relative)
      top: isMobile ? "40%" : "40%",
      left: isMobile ? "35%" : "44%",
      transform: "translate(-50%, -50%)",
      zIndex: 1001,
      width: "auto",
      height: "auto",
    }}
  >
    <div id="loader" />
  </Box>
)}

      {/* Contenido de contacto */}
      <Box sx={{ position: "relative", zIndex: 2, paddingTop: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Título animado */}
        {!formSubmitted && (
          <Typography variant={isMobile ? "h4" : "h3"} align="left" gutterBottom sx={{ color: "white", display: "flex" }}>
            {"Contáctanos".split("").map((char, index) => (
              <motion.span key={index} custom={index} variants={letterVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
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
    onMouseEnter={() => {
      setIsHovered(true);
      setIntervalActive(false);
    }}
    onMouseLeave={() => {
      setIsHovered(false);
      setIntervalActive(true);
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
        boxShadow: 3,
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
            zoom={initialZoom}
            style={{
              width: "100%",
              height: isMobile ? "40vh" : "100%",
            }}
            dragging={false}
            scrollWheelZoom={false}
            touchZoom={false}
            doubleClickZoom={false}
            zoomSnap={isMobile ? 0.25 : 1}
            zoomDelta={isMobile ? 0.5 : 1}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={finalPosition}
              icon={new L.Icon({
                iconUrl: "/gps-mobile.png",
                iconSize: [70, 70],
                iconAnchor: [35, 70],
                popupAnchor: [0, -35],
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


    

{/* Formulario estilo GitHub Mejorado */}
<Grid item xs={12} md={6} sx={{ height: "auto" }}>
  
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 3,
      mt: 0,
      backgroundColor: "#0D1117", // Fondo oscuro de GitHub
      padding: "30px",
      borderRadius: 5, // Bordes redondeados
      boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)", // Sombra sutil
      border: "1px solid #30363D", // Borde sutil
      maxHeight: "100vh",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)", // Sombra más intensa al pasar el mouse
      },
    }}
  >
    {/* Detección de Scroll */}
    {(() => {
      const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
      const [startAnimation, setStartAnimation] = useState(false);

      useEffect(() => {
        if (inView) {
          setTimeout(() => {
            setStartAnimation(true);
          }, 1700); // Delay de 2 segundos
        }
      }, [inView]);

      return (
        <div ref={ref}>
<Grid container spacing={2}>
  {/* Fila 1: Nombre y Teléfono */}
  <Grid item xs={12} sm={6}>
    <TextField
      placeholder="Nombre/Apellido"
      variant="outlined"
      fullWidth
      value={name}
      onChange={(e) => setName(e.target.value)}
      sx={{
        backgroundColor: "#161B22",
        borderRadius: 2,
        input: { color: "#E6EDF3", fontSize: "0.9rem" },
        fieldset: { borderColor: "#30363D" },
        "&:hover fieldset": { borderColor: "#58A6FF" },
        "&.Mui-focused fieldset": { borderColor: "#58A6FF" },
      }}
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <TextField
      placeholder="Ejemplo: +56 9999 9999"
      variant="outlined"
      fullWidth
      value={phone}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\+?\d*$/.test(value) && value.length <= 12) {
          setPhone(value);
        }
      }}
      inputProps={{ maxLength: 12 }}
      sx={{
        backgroundColor: "#161B22",
        borderRadius: 2,
        input: { color: "#E6EDF3", fontSize: "0.9rem" },
        fieldset: { borderColor: "#30363D" },
        "&:hover fieldset": { borderColor: "#58A6FF" },
        "&.Mui-focused fieldset": { borderColor: "#58A6FF" },
      }}
    />
  </Grid>

  {/* Fila 2: Mensaje */}
  <Grid item xs={12}>
    <TextField
      placeholder="Escríbenos, esperamos tu mensaje..."
      variant="outlined"
      fullWidth
      multiline
      rows={3}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      sx={{
        backgroundColor: "#161B22",
        borderRadius: 2,
        textarea: { color: "#E6EDF3", fontSize: "0.9rem" },
        fieldset: { borderColor: "#30363D" },
        "&:hover fieldset": { borderColor: "#58A6FF" },
        "&.Mui-focused fieldset": { borderColor: "#58A6FF" },
      }}
    />
  </Grid>

  {/* Botón */}
  <Grid item xs={12}>
    <Button
      type="submit"
      variant="contained"
      fullWidth
      sx={{
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: 3,
        textTransform: "none",
        backgroundColor: "var(--darkreader-background-c4211a, #9d1a15)",
        color: "#fff",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        "&:hover": {
          backgroundColor: "var(--darkreader-background-b62821, #92201a)",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      Contactar
    </Button>
  </Grid>
</Grid>


        </div>
      );
    })()}
  </Box>



  <Box sx={{ mt: 2, px: 1 }}>
  <Grid container spacing={2}>
    {/* Columna 1: Servicio al cliente */}
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0048d5 0%, #0b82ff 100%)",
          borderRadius: "16px",
          p: 2.1, // ⬅️ Padding interior del contenido
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid rgba(255, 255, 255, 0.15)", // ⬅️ Borde elegante
          boxShadow: "0 0 20px rgba(0, 72, 213, 0.25)",
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/audifonos.png" alt="Servicio al cliente" width={44} height={34} />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
            Servicio al cliente
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1e4ff", fontSize: "0.8rem" }}>
            Ponte en contacto con uno de nuestros ejecutivos
          </Typography>
          <Button
            href="tel:6002000202"
            variant="text"
            size="small"
            sx={{
              mt: 1,
              px: 0,
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "none",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.8rem",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: "transparent",
              },
            }}
          >
            Contactar ahora
            <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Button>
        </Box>
      </Box>
    </Grid>

    {/* Columna 2: WhatsApp */}
    <Grid item xs={12} md={6}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
          borderRadius: "16px",
          p: 2.1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 0 20px rgba(37, 211, 102, 0.25)",
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WhatsAppIcon sx={{ fontSize: 34, color: "#fff" }} />
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "0.85rem" }}>
            Escríbenos por WhatsApp
          </Typography>
          <Typography variant="body2" sx={{ color: "#eafff4", fontSize: "0.8rem" }}>
            Resolvemos tus dudas al instante por WhatsApp.
          </Typography>
          <Button
            href="https://api.whatsapp.com/send?phone=56992914526"
            target="_blank"
            variant="text"
            size="small"
            sx={{
              mt: 1,
              px: 0,
              color: "#ffffff",
              fontWeight: "bold",
              textTransform: "none",
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.8rem",
              "&:hover": {
                textDecoration: "underline",
                backgroundColor: "transparent",
              },
            }}
          >
            Chatear ahora
            <ArrowForwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Button>
        </Box>
      </Box>
    </Grid>
  </Grid>
</Box>



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

        <Snackbar open={openAlert} autoHideDuration={4000} onClose={() => setOpenAlert(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: "100%" }}>
            ¡Gracias por contactarnos!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
const ZoomEffect = ({ zoom }) => {
  const map = useMapEvent("load", () => {}); // Obtener la instancia del mapa
  const zoomApplied = useRef(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 }); // Detectar si el mapa entra en pantalla
  const isMobile = useMediaQuery("(max-width:600px)"); // Detectar si es móvil

  useEffect(() => {
    if (map && inView && !zoomApplied.current) {
      zoomApplied.current = true; // Evita múltiples ejecuciones

      // ⏱️ Delay de 2 segundos antes de iniciar la animación
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
      }, 1500); // ⏱️ Delay de 2 segundos

      return () => clearTimeout(delayTimer);
    }
  }, [inView, map, zoom, isMobile]);

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
