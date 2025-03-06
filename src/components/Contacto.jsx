import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  InputAdornment, 
  Snackbar, 
  Alert 
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function Contacto() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Número de Teléfono:", phone);
    console.log("Solicitud:", message);
    setFormSubmitted(true);
    setOpenAlert(true);
    setPhone("");
    setMessage("");
    // Desplaza la página al inicio (opcional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container sx={{ py: 11 }}>
      {!formSubmitted && (
        <Typography variant="h4" align="left" gutterBottom>
          Contáctanos
        </Typography>
      )}

      {!formSubmitted ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            mt: 4,
            backgroundColor: "#f7f7f7",
            p: 4,
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Sección del Mapa */}
          <Box sx={{ my: 4,  marginTop: "0",}}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOnIcon sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant="h6" sx={{ color: "#1976d2" }}>
                Ubicación
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "250px",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
            >
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

          {/* Campo para el Número de Teléfono */}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"/>
                ),
              }}
            />
          </Box>

          {/* Campo para la Solicitud */}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"/>
                ),
              }}
            />
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Contactar
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            p: 8,
            mt: 4,
            minHeight: "300px",
            backgroundColor: "#e0f7e9",
            borderRadius: 2,
            textAlign: "center",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
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
        <Alert
          onClose={() => setOpenAlert(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Gracias por contactarnos!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Contacto;
