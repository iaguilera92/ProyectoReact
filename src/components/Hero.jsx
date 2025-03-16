import { useState, useEffect } from "react";
import { Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css"; // Asegúrate de importar el CSS

function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);

  const texts = [
    { title: "SOLUCIONES TECNOLÓGICAS", description: "Soluciones digitales a medida." },
    { title: "PLATAFORMAS TI", description: "Impulsamos tu negocio al siguiente nivel." },
    { title: "DESARROLLO DE SOFTWARE", description: "Últimas tecnologías para generar sistemas y sitios web." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Video de fondo */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          id="background-video"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source
            src="https://www.connectic.cl/wp-content/uploads/2024/07/136268-764387688_small.mp4"
            type="video/mp4"
          />
        </video>
      </Box>

      {/* Contenido sobre el video */}
      <Container
        sx={{
          position: "relative",
          color: "white",
          zIndex: 2,
          perspective: "1000px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "150px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ rotateY: -180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 180, opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                position: "absolute",
                transformStyle: "preserve-3d",
                textAlign: "center",
              }}
            >
              <Typography variant="h3" gutterBottom className="text">
                {texts[currentText].title}
              </Typography>
              <Typography variant="h6" paragraph>
                {texts[currentText].description}
              </Typography>
              {/* Botón con alerta animada */}
              <button className="btn-3" onClick={() => setOpenAlert(true)}>
                <span>Contactar</span>
              </button>
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>

      {/* Snackbar con alerta animada */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: "100%" }}>
          ¡Gracias por contactarnos! Te responderemos pronto.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Hero;
