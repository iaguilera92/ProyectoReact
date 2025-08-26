import { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css"; // Asegúrate de importar el CSS
import CircularProgress from "@mui/material/CircularProgress";

function Hero({ informationsRef, setVideoReady }) {

  const [currentText, setCurrentText] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingVideo, setLoadingVideo] = useState(true);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  const texts = [
    { title: "Innovación Tecnológica", description: "Sistemas y sitios web con última tecnología." },
    { title: "Soporte Evolutivo", description: "Materializamos tu ideas." },
    { title: "Plataformas TI", description: "Impulsamos tu negocio con tecnología" }
  ];

  //PAUSAR VIDEO SI NO SE VE
  useEffect(() => {
    if (loadingVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? video.play() : video.pause(),
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [loadingVideo]);

  useEffect(() => {
    if (document.visibilityState !== "visible") return;
    const id = setInterval(() => {
      setCurrentText(prev => (prev + 1) % texts.length);
    }, 6000);
    return () => clearInterval(id);
  }, [texts.length]);


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
    }, 5000); // 5 segundos de espera

    return () => clearTimeout(fallbackTimer);
  }, [loadingVideo]);


  // Forzar inicio cuando loader termina
  useEffect(() => {
    if (!loadingVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        console.log("▶️ Video empezó.");
      }).catch(err => {
        console.warn("No se pudo reproducir automáticamente:", err);
      });
    }
  }, [loadingVideo]);

  useEffect(() => {
    const unlock = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // 👈 arranca desde el inicio
        videoRef.current.play().catch(err => {
          console.warn("⚠️ Autoplay bloqueado:", err);
        });
      }
    };
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("click", unlock, { once: true });
    return () => {
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
    };
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
              backgroundColor: "rgba(0,0,0,0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={60} sx={{ color: "#ffffff" }} />
          </Box>
        )}
        <video
          muted
          loop
          ref={videoRef}
          playsInline
          onLoadedData={() => {
            console.log("🎥 Video cargado");
            if (setVideoReady) setVideoReady(true);
            setLoadingVideo(false);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            pointerEvents: "none",
          }}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source
            src={isMobile ? "video-inicio-prd.mp4" : "video-inicio.mp4"}
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
          ¡Descubre cómo se verá tu sitio web! Solicita una vista previa.
        </Alert>
      </Snackbar>

    </Box>
  );
}

export default Hero;