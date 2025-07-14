import { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css"; // Asegúrate de importar el CSS
import CircularProgress from "@mui/material/CircularProgress";

function Hero({ informationsRef, setVideoReady }) {

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
    { title: "Innovación Tecnológica", description: "Sistemas y sitios web con última tecnología." },
    { title: "Soporte Evolutivo", description: "Soluciones digitales que crecen contigo." },
    { title: "Plataformas TI", description: "Tecnología para impulsar tu negocio." }
  ];


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
            console.log("🎥 Componentes cargados");
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
            }}
          >
            {/* Contenedor de texto fijo */}
            <Box
              sx={{
                height: "150px",
                position: "relative",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
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
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h3"
                    gutterBottom
                    className="text"
                    sx={{
                      fontSize: isMobile ? "1.62rem !important" : "2.5rem !important",
                    }}
                  >
                    {texts[currentText].title}
                  </Typography>
                  <Typography variant="h6" paragraph>
                    {texts[currentText].description}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Botón debajo */}
            {showButton && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
              >
                <Box sx={{ mt: isMobile ? -1.5 : 0 }}>

                  <button
                    className="btn-3"
                    onClick={() => {
                      setOpenAlert(true);

                      const isMobile = window.innerWidth < 768;
                      const offset = isMobile ? 490 : -50;

                      const y =
                        informationsRef.current.getBoundingClientRect().top +
                        window.scrollY +
                        offset;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }}
                  >
                    <span>Nuestros Precios</span>
                  </button>
                </Box>
              </motion.div>
            )}
          </Box>

        </Container>
      )}
      {/* Snackbar con alerta animada */}
      <Snackbar
        open={openAlert}
        autoHideDuration={4100}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          '& .MuiSnackbarContent-root': {
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
            borderRadius: 3,
            p: 0,
            animation: 'fadeInUp 0.4s ease-in-out',
          },
          '@keyframes fadeInUp': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity="success"
          sx={{
            width: "100%",
            background: "linear-gradient(90deg, #ff6a00 0%, #ee0979 100%)", // Coral + rosado vibrante
            color: "white",
            fontWeight: 700,
            fontSize: isMobile ? "0.8rem" : "1.1rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
            border: "2px solid #ff6a00",
            display: "flex",
            alignItems: "center",
            py: 2,
          }}
          iconMapping={{
            success: (
              <svg
                width="36"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  marginRight: 1,
                  verticalAlign: 'middle',
                  animation: 'bounceRotate 1.8s infinite ease-in-out',
                }}
              >
                <defs>
                  <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6a00" />
                    <stop offset="100%" stopColor="#ee0979" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2C10.34 2 9 3.34 9 5v1.1C6.72 6.56 5 8.52 5 11v3l-1 1v1h16v-1l-1-1v-3c0-2.48-1.72-4.44-4-4.9V5c0-1.66-1.34-3-3-3z"
                  stroke="url(#bellGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))"
                />
                <circle
                  cx="12"
                  cy="19"
                  r="2"
                  stroke="url(#bellGradient)"
                  strokeWidth="2"
                  fill="none"
                  filter="drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))"
                />
                <style>
                  {`
                  @keyframes bounceRotate {
                    0% { transform: scale(1) rotate(0deg); }
                    50% { transform: scale(1.1) rotate(-4deg); }
                    100% { transform: scale(1) rotate(0deg); }
                  }
                `}
                </style>
              </svg>

            )
          }}
        >
          ¡Descubre cómo se verá tu sitio web! Solicita una vista previa personalizada.
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default Hero;
