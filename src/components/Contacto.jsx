import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Snackbar, Alert, Grid, useMediaQuery } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./css/Contacto.css"; // Importamos el CSS
import "leaflet/dist/leaflet.css"; // Estilo básico de Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap  } from "react-leaflet";
import L from "leaflet";

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
  const position = [-33.435054, -70.688067];
  const [zoom, setZoom] = useState(15); // Estado inicial del zoom

  useEffect(() => {
    const timer = setTimeout(() => {
      setZoom(17); // Aumenta el zoom después de 3 segundos
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const rotateValue = isHovered ? 0 : 180;
  // Detectar si estamos en una pantalla pequeña
  const isMobile = useMediaQuery("(max-width:600px)");

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

  useEffect(() => {
    const handleScroll = () => {
      // Modificar la posición del fondo para que se mueva suavemente
      setBgPosition(`center ${window.scrollY * 0}px`);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setRotate((prevRotate) => (prevRotate + 180) % 360); // Cambia la rotación cada 5 segundos solo si no hay hover
      }
    }, 555000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [isHovered]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoom(17); // Nuevo nivel de zoom
    }, 3000); // 3 segundos de delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      sx={{
        maxWidth: "none !important",
        marginLeft: "0",
        py: 11,
        position: "relative",
        overflow: "hidden",
        paddingTop: "0px",
        paddingBottom: "20px",
        height: isMobile ? containerHeight : "70vh", // Asegúrate de que el contenedor ocupe toda la pantalla
        backgroundImage: 'url(/fondo-mundo.png)',
        backgroundSize: 'cover', // Asegura que la imagen de fondo cubra toda el área
        backgroundPosition: bgPosition,
        backgroundRepeat: "no-repeat", // Evita que la imagen se repita
        backgroundAttachment: "fixed", // Mantiene el fondo fijo mientras el contenido se desplaza
      }}
      ref={ref}
    >

      {/* Divs con imágenes */}
      <div
        className={`image image-left ${startAnimation ? "animate-left" : ""}`}
        style={{
          height: isMobile ? "50vh" : "70vh",
          backgroundImage: isMobile ? "url('/fono-left.jpg')" : "url('/mapa.jpg')",
        }}
      ></div>

      <div
        className={`image image-right ${startAnimation ? "animate-right" : ""}`}
        style={{
          height: isMobile ? "50vh" : "70vh",
          backgroundImage: isMobile ? "url('/fono-right.jpg')" : "url('/contactar.jpg')",
        }}
      ></div>

      {/* Loader */}
      {!startAnimation && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
          }}
        >
          <div id="loader"></div>
        </Box>
      )}

      {/* Contenido de contacto */}
      <Box sx={{ position: "relative", zIndex: 2, paddingTop: "20px", display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Título animado */}
        {!formSubmitted && (
          <Typography variant="h3" align="left" gutterBottom sx={{ color: "white", display: "flex" }}>
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
      initial={{ rotateY: 0 }}
      animate={{ rotateY: rotate }}
      transition={{
        rotateY: { duration: 1.5, ease: "easeInOut" },
      }}
      style={{
        position: "relative",
        width: "100%", // Asegura que el mapa ocupe el 100% del contenedor
        height: "100%", // El mapa debe ocupar todo el alto disponible
        perspective: 1200, // Mantiene el efecto 3D
        transformStyle: "preserve-3d", // Necesario para que las imágenes se giren correctamente
      }}
      onMouseEnter={() => {
        setIsHovered(true); // Cuando el ratón entra
        setIntervalActive(false); // Desactiva el intervalo cuando el ratón está encima
      }}
      onMouseLeave={() => {
        setIsHovered(false); // Cuando el ratón sale
        setIntervalActive(true); // Reactiva el intervalo cuando el ratón sale
      }}
    >
          {/* Cara frontal: Mapa */}
          <Box
            sx={{
              position: isMobile ? "relative" : "absolute", // Detecta si estamos en móvil
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              boxShadow: 3,
              borderRadius: 2,
              padding: "0px",
              overflow: "hidden",
              backfaceVisibility: "hidden", // Oculta el lado opuesto cuando gira
            }}
          >
            {/* Mapa ajustado para ocupar más espacio */}
            <Box sx={{ flexGrow: 1, my: 4, marginTop: "0", marginBottom: "0", height: "100%" }}>
              <Box sx={{ width: "100%", height: isMobile ? "40vh":"100%", borderRadius: 2, overflow: "hidden" }}>



             <MapContainer
      center={position}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      dragging={false}
      scrollWheelZoom={false}
      touchZoom={false}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      <Marker position={position} icon={customIcon} />

      <ZoomEffect zoom={zoom} />

      {/* Mensaje "Encuéntranos!" */}
      <div
        style={{
          position: "absolute",
          top: "26%",
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
    </MapContainer>


              </Box>
            </Box>
          </Box>
    
          {/* Cara trasera: Imagen */}
          <motion.img
            src="/contacto.webp" // Asegúrate de que la imagen esté disponible en esta ruta
            alt="Next Rotating Image"
            width="80%" // Imagen ocupará todo el contenedor
            height="100%" // Imagen ocupará todo el contenedor
            initial={{ rotateY: 180, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: isMobile ? "50px" : "90px",
              transform: "rotateY(180deg)", // Imagen trasera en la posición de 180 grados
              backfaceVisibility: "hidden", // Esconde la cara trasera cuando no está visible
              width: "80%", // Imagen ocupa el 100% del contenedor
              height: "100%", // Imagen ocupa el 100% del contenedor
              backgroundColor: "transparent", // Fondo transparente
            }}
          />
        </motion.div>
      </Grid>
    
      {/* Formulario */}
      <Grid item xs={12} md={6} sx={{ height: "auto" }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            mt: 0,
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            height: "auto",
            maxHeight: "100vh", // Aseguramos que el formulario no se desborde
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: "#1976d2" }}>
                Infórmanos tu N° de teléfono para contactarte:
              </Typography>
            </Box>
            <TextField
              label="Ejemplo: +56 9999 9999"
              variant="outlined"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <ChatBubbleOutlineIcon sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: "#1976d2" }}>
                Explícanos que necesitas:
              </Typography>
            </Box>
            <TextField
              label="Escríbenos, esperamos tu mensaje..."
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary">
            Contactar
          </Button>
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
// Componente para manejar el zoom con animación
const ZoomEffect = ({ zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setView(map.getCenter(), zoom, { animate: true, duration: 1 });
    }
  }, [zoom, map]);

  return null;
};

export default Contacto;
