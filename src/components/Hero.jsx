import { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css"; // Asegúrate de importar el CSS
import CircularProgress from "@mui/material/CircularProgress";

function Hero({ scrollToContacto, setVideoReady }) {

  const [currentText, setCurrentText] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [showButton, setShowButton] = useState(false); // Estado para mostrar el botón después del delay
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef(null);
  const intervalRef = useRef(null);

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

  //PAUSAR VIDEO SI NO SE VE
  useEffect(() => {
    const video = document.getElementById("background-video");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video?.play();
        } else {
          video?.pause();
        }
      },
      { threshold: 0.3 } // Se pausa si menos del 30% del video es visible
    );

    if (video) observer.observe(video);

    return () => video && observer.unobserve(video);
  }, []);



  // Detectar visibilidad con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  // Cambiar texto cada 6 segundos solo si la sección está visible y la pestaña activa
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isPageVisible = document.visibilityState === "visible";

      if (isPageVisible && isHeroVisible) {
        startTextRotation();
      } else {
        stopTextRotation();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start on mount if visible
    if (document.visibilityState === "visible" && isHeroVisible) {
      startTextRotation();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopTextRotation();
    };
  }, [isHeroVisible]);
  const startTextRotation = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 6000);
  };

  const stopTextRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  //MONITOREAR - COMENTAR PRD
  /*useEffect(() => {
    const video = document.getElementById("background-video");

    const onPlay = () => console.log("▶️ El video está reproduciéndose");
    const onPause = () => console.log("⏸ El video fue pausado");

    if (video) {
      video.addEventListener("play", onPlay);
      video.addEventListener("pause", onPause);
    }

    return () => {
      if (video) {
        video.removeEventListener("play", onPlay);
        video.removeEventListener("pause", onPause);
      }
    };
  }, []);*/


  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loadingVideo) {
        setLoadingVideo(false);
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [loadingVideo]);


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
        {/* Loader encima del video */}
        {loadingVideo && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#ffffff" }} />
          </Box>
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          id="background-video"
          onLoadedData={() => {
            console.log("🎥 Video listo");
            setLoadingVideo(false);
            if (setVideoReady) setVideoReady(true); // Opcional si lo estás usando en App
          }}
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
      {!loadingVideo && (
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
      )}
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
