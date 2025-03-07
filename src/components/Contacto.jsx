import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Snackbar, 
  Alert, 
  Grid 
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useInView } from "react-intersection-observer";
import "./Contacto.css"; // Importamos el CSS

function Contacto() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);

  // Hook para detectar visibilidad del componente
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3, // Se activa cuando el 30% de la imagen es visible
  });

  // Retraso de 2 segundos antes de activar la animación
  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
      }, 1300); // TIEMPO CORTINA

      return () => clearTimeout(timer); // Limpiar el timeout si el componente desaparece
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

  return (
    <Container 
      sx={{
        py: 11,
        maxWidth: "1500px !important",        
        position: "relative",
        overflow: "hidden",
        paddingTop: "0px"
      }}
      ref={ref} // Referencia para el scroll
    >
      {/* Divs con imágenes, cubriendo toda la altura del contenedor */}
      <div 
        className={`image image-left ${startAnimation ? "animate-left" : ""}`}
      ></div>
      <div 
        className={`image image-right ${startAnimation ? "animate-right" : ""}`}
      ></div>

      {/* Contenido de contacto */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          paddingTop: "20px"
        }}
      >
        {!formSubmitted && (
          <Typography variant="h4" align="left" gutterBottom>
            Contáctanos
          </Typography>
        )}

        {!formSubmitted ? (
          <Grid container spacing={4}>
            {/* Mapa */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "#fff", boxShadow: 3, borderRadius: 2, padding: "20px", overflow: "hidden" }}>
                <Box sx={{ flexGrow: 1, my: 4, marginTop: "0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography variant="h6" sx={{ color: "#1976d2" }}>
                      Ubicación
                    </Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: "100%", borderRadius: 2, overflow: "hidden" }}>
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
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 0, backgroundColor: "#fff", padding: "20px", borderRadius: 2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", height: "100%" }}>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography variant="h6" sx={{ color: "#1976d2" }}>
                      Número de Teléfono
                    </Typography>
                  </Box>
                  <TextField
                    label="Ingresa tu número de teléfono"
                    variant="outlined"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ChatBubbleOutlineIcon sx={{ mr: 1, color: "#1976d2" }} />
                    <Typography variant="h6" sx={{ color: "#1976d2" }}>
                      Solicitud
                    </Typography>
                  </Box>
                  <TextField
                    label="Escribe tu solicitud"
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
              Se ha enviado la solicitud al contacto correctamente!
            </Typography>
          </Box>
        )}

        {/* Snackbar opcional para alerta */}
        <Snackbar
          open={openAlert}
          autoHideDuration={4000}
          onClose={() => setOpenAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: "100%" }}>
            ¡Gracias por contactarnos!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Contacto;
