import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Snackbar, Alert, Grid, useMediaQuery } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./Contacto.css"; // Importamos el CSS
import LocationOnIcon from "@mui/icons-material/LocationOn";

const letterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 1.45 + i * 0.1 },
  }),
};

function Contacto() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [bgPosition, setBgPosition] = useState("center 0px");

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
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  useEffect(() => {
    const handleScroll = () => {
      setBgPosition(`center ${window.scrollY * 0.5}px`);
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

  return (
    <Container
      sx={{
        py: 11,
        maxWidth: "1500px !important",
        position: "relative",
        overflow: "hidden",
        paddingTop: "0px",
        paddingBottom: "20px",
        height: "auto",
        backgroundImage: 'url(/fondo-blanco.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: bgPosition,
      }}
      ref={ref}
    >
      {/* Divs con imágenes */}
      <div
        className={`image image-left ${startAnimation ? "animate-left" : ""}`}
        style={{ height: "100vh" }}
      ></div>
      <div
        className={`image image-right ${startAnimation ? "animate-right" : ""}`}
        style={{ height: "100vh" }}
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
            <Grid item xs={12} md={6}>
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#fff", boxShadow: 3, borderRadius: 2, padding: "20px", overflow: "hidden" }}>
    {/* Título con ícono de GPS */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 2,marginBottom:"0" }}>
      <LocationOnIcon sx={{ mr: 1, color: "#1976d2" }} />
      <Typography variant={isMobile ? "body2" : "h6"} sx={{ color: "#1976d2" }}>
        Ubicación
      </Typography>
    </Box>
    {/* Mapa ajustado para ocupar más espacio */}
    <Box sx={{ flexGrow: 1, my: 4, marginTop: "0",marginBottom:"0", height: "100%" }}>
      <Box sx={{ width: "100%", height: "100%", borderRadius: 2, overflow: "hidden"}}>
        <iframe
          title="Mapa de Santiago de Chile"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps?q=-33.435054,-70.688067&hl=es&z=15&output=embed"
          allowFullScreen=""
          aria-hidden="false"
        ></iframe>
      </Box>
    </Box>
  </Box>
</Grid>

            {/* Formulario */}
            <Grid item xs={12} md={6} sx={{ height: { xs: "auto", md: "100%" } }}>
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

export default Contacto;
