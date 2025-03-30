import { useState, useEffect } from "react";
import { Container, Typography, Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css"; // Asegúrate de importar el CSS

function Hero({ scrollToContacto }) {
  const [currentText, setCurrentText] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [showButton, setShowButton] = useState(false); // Estado para mostrar el botón después del delay
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const texts = [
    { title: "SOLUCIONES TECNOLÓGICAS", description: "Soluciones digitales a la medida." },
    { title: "SOPORTE EVOLUTIVO", description: "Últimas tecnologías para generar sistemas y sitios web." },
    { title: "PLATAFORMAS TI", description: "Impulsamos tu negocio al siguiente nivel." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Activa el botón con un delay de 1s después de cargar la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);
    return () => clearTimeout(timer);
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
          playsInline  // 🔹 Asegura que el video se reproduzca en móviles sin abrir en pantalla completa
          id="background-video"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none", // Evita interacción del usuario
          }}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source
            src="video-inicio.mp4"
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
              <Typography
                variant="h3"
                gutterBottom
                className="text"
                sx={{ fontSize: isMobile ? "1.64rem" : "2.5rem" }} // Cambia tamaño en móvil
              >
                {texts[currentText].title}
              </Typography>
              <Typography variant="h6" paragraph>
                {texts[currentText].description}
              </Typography>

              {/* Botón con animación después de 1s */}
              {showButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Box sx={{ mt: isMobile ? 4 : 1 }}>
                    <button className="btn-3"
                      onClick={() => {
                        setOpenAlert(true);
                        const offset = -80; // Ajusta esto según la altura de tu navbar
                        const y = scrollToContacto.current.getBoundingClientRect().top + window.scrollY + offset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }}>
                      <span>Contactar</span>
                    </button>
                  </Box>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>

      {/* Snackbar con alerta animada */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: "100%" }}>
          Ahora podrás ingresar tu información para contactarnos. Te agradecemos!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Hero;
