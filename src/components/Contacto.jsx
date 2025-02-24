import React, { useState } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function Contacto() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías enviar los datos a un servidor o realizar otra acción
    console.log("Número de Teléfono:", phone);
    console.log("Solicitud:", message);
    alert("¡Formulario enviado!");
    setPhone("");
    setMessage("");
  };

  return (
    <Container sx={{ py: 12 }}>
      <Typography variant="h4" align="left" gutterBottom>
        Contáctanos
      </Typography>
      
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
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1, color: "#1976d2" }} />
            <Typography variant="h6" sx={{ color: "#1976d2" }}>
              Ubicación
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: 300,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <iframe
              title="Mapa de Santiago de Chile"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.2605017675593!2d-70.66926508480007!3d-33.44888908078786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c86e553d0e99%3A0x5a24ed7c8c5d6eb1!2sSantiago%2C%20Chile!5e0!3m2!1ses-419!2sus!4v1615462790195!5m2!1ses-419!2sus"
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
          />
        </Box>

        {/* Botón para enviar el formulario */}
        <Button type="submit" variant="contained" color="primary">
          Contactar
        </Button>
      </Box>
    </Container>
  );
}

export default Contacto;
