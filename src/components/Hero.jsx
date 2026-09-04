import { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Snackbar, Alert, useMediaQuery, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Hero.css";
import CircularProgress from "@mui/material/CircularProgress";

const texts = [
  { title: "Tu negocio necesita más que una web.", palabraClave: "más que una web." },
  { title: "Más que un sitio: un ecosistema digital.", palabraClave: "ecosistema digital." },
  { title: "Tecnología a medida para crecer.", palabraClave: "a medida" }
];

function Hero({ informationsRef, setVideoReady }) {

  const [currentText, setCurrentText] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loadingVideo, setLoadingVideo] = useState(true);
  const videoRef = useRef(null);
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const isVideoInViewportRef = useRef(true);
  const isDocumentVisibleRef = useRef(true);
  const ambientPausedRef = useRef(false);







  //MOSTRAR CONTENIDO
  useEffect(() => {
    const timer = setTimeout(() => setMostrarContenido(true), 3400); //â±ï¸
    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (document.visibilityState !== "visible") return;
    const id = setInterval(() => {
      setCurrentText(prev => (prev + 1) % texts.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // 🎬 CONTROL ÚNICO DEL VIDEO
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasStarted = false; // evita reinicios

    const startTimer = setTimeout(() => {
      if (!hasStarted) {
        video.play().then(() => {
          hasStarted = true;
          setLoadingVideo(false);
          setVideoReady?.(true);
          console.log("▶️ Video iniciado tras 3.3s");
        }).catch(err => console.warn("⚠️ Autoplay bloqueado:", err));
      }
    }, 3300);

    const shouldKeepPlaying = () =>
      hasStarted &&
      !ambientPausedRef.current &&
      isDocumentVisibleRef.current &&
      isVideoInViewportRef.current &&
      !video.ended &&
      !video.seeking;

    const handlePause = () => {
      if (shouldKeepPlaying()) {
        video.play().catch(() => { });
      }
    };
    const handleVisibility = () => {
      isDocumentVisibleRef.current = document.visibilityState === "visible";
      if (shouldKeepPlaying()) {
        video.play().catch(() => { });
      } else if (hasStarted && !isDocumentVisibleRef.current) {
        video.pause();
      }
    };
    const handlePauseAmbientVideos = () => {
      ambientPausedRef.current = true;
      if (hasStarted) {
        video.pause();
      }
    };
    const handleResumeAmbientVideos = () => {
      ambientPausedRef.current = false;
      if (shouldKeepPlaying()) {
        video.play().catch(() => { });
      }
    };

    video.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pauseAmbientVideos", handlePauseAmbientVideos);
    window.addEventListener("resumeAmbientVideos", handleResumeAmbientVideos);

    // Pausar si no esta visible en pantalla
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!hasStarted) return;
        isVideoInViewportRef.current = entry.isIntersecting;
        if (entry.isIntersecting && isDocumentVisibleRef.current) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);

    return () => {
      clearTimeout(startTimer);
      video.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pauseAmbientVideos", handlePauseAmbientVideos);
      window.removeEventListener("resumeAmbientVideos", handleResumeAmbientVideos);
      observer.disconnect();
    };
  }, []);

  const notificarVisitaPrecios = () => {
    console.group("📩 EmailJS - Notificacion Precios");

    const ahora = new Date();

    const fechaHoraFormateada = ahora
      .toLocaleString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/^./, (c) => c.toUpperCase()) // Capitaliza el di­a
      .replace(",", " Â·") + " hrs";

    const templateParams = {
      evento: "Nuestros Precios",
      fechaHora: fechaHoraFormateada,
      dispositivo: window.innerWidth < 768 ? "MOBILE 📱" : "DESKTOP 🖥️",
    };

    console.log("Template params:", templateParams);

    import("@emailjs/browser")
      .then(({ default: emailjs }) => emailjs.send(
        "service_73azdl9",   // Service ID
        "template_txa3qoq",  // Template ID
        templateParams,
        "TfLG1wfibewzR9Xpf"  // Public Key
      ))
      .then((response) => {
        console.log("âœ… EmailJS enviado correctamente", response);
      })
      .catch((error) => {
        console.error("âŒ Error EmailJS", error);
      })
      .finally(() => {
        console.groupEnd();
      });
  };

  return (
    <>
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
            backgroundColor: "#000", // ðŸ'ˆ fondo sÃ³lido
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
                zIndex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={60} sx={{ color: "rgba(255,255,255,0.4)" }} />
            </Box>
          )}
          <video
            muted
            loop
            playsInline
            preload="metadata"
            ref={videoRef}
            onPlaying={() => {
              if (loadingVideo) {
                setLoadingVideo(false);
                setVideoReady?.(true);
              }
            }}
            style={{
              width: "102%",
              height: "102%",
              objectFit: "cover",
              objectPosition: "center",
              position: "absolute",
              top: "-1%",
              left: "-1%",
              pointerEvents: "none",
              display: "block",
            }}
          >

            <source
              src={isMobile ? "video-oficial.mp4" : "video-oficial.mp4"}
              type="video/mp4"
            />
          </video>

        </Box>

        {/* Contenido sobre el video */}
        {mostrarContenido && (
          <Container
            sx={{
              position: "relative",
              color: "white",
              zIndex: 2,
              perspective: "1000px",
              pt: { xs: 4, md: 6 },
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
                  mt: 8,
                  mb: -6,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentText}
                    initial={{ rotateY: -90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: 90, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transformStyle: "preserve-3d",
                      transformOrigin: "center center",
                      backfaceVisibility: "hidden",
                      willChange: "transform, opacity", // optimizacion para GPU
                    }}
                  >
                    <Typography
                      variant="h3"
                      gutterBottom
                      className="text"
                      sx={{
                        fontSize: isMobile ? "0.9rem !important" : "1.7rem !important",
                        fontWeight: 600,
                        textAlign: "center",
                        fontFamily: "'Poppins', sans-serif",
                        lineHeight: 1.2,
                        minHeight: isMobile ? "2.4rem" : "5rem",
                        display: "inline-block",
                        whiteSpace: isMobile ? "nowrap" : "normal",
                      }}
                    >
                      {(() => {
                        const { title, palabraClave } = texts[currentText];
                        const [before, after] = title.split(palabraClave);
                        return (
                          <>
                            {before}
                            <motion.span
                              key={palabraClave}
                              initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                delay: 0.6,
                              }}
                              style={{
                                display: "inline-block",
                                fontWeight: 700,
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "inherit",
                                padding: isMobile ? "1px 5px" : "2px 8px",
                                borderRadius: "10px",
                                background:
                                  "linear-gradient(135deg, rgba(93,188,255,0.95) 0%, rgba(120,75,209,0.95) 100%)", // ðŸ'Ž azul a violeta moderno
                                color: "#ffffff",
                                boxShadow: "0 0 10px rgba(93,188,255,0.4)", // brillo sutil azulado
                                textShadow: "0 1px 4px rgba(0,0,0,0.25)",   // mejora el contraste
                              }}
                            >
                              {palabraClave}
                            </motion.span>

                            {after}
                          </>
                        );
                      })()}
                    </Typography>
                  </motion.div>
                </AnimatePresence>


              </Box>

              {/* Pills */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
              >
                <Box sx={{
                  display: "flex", justifyContent: "center",
                  flexWrap: "wrap", gap: 0.8, mb: 2, mt: isMobile ? -0.5 : 0,
                }}>
                  {[
                    { dot: "#facc15", text: "+100 proyectos" },
                    { dot: "#38bdf8", text: "Sitios web" },
                    { dot: "#00e676", text: "Soluciones Tecnológicas" },
                    { dot: "#a78bfa", text: "Soporte 24/7" },
                  ].map((pill, i) => (
                    <Box key={i} sx={{
                      display: "inline-flex", alignItems: "center", gap: 0.7,
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "100px", px: 1.4, py: 0.45,
                      backdropFilter: "blur(10px)",
                    }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: pill.dot, boxShadow: `0 0 6px ${pill.dot}`, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.75)", fontWeight: 600, fontFamily: "'Poppins', sans-serif", letterSpacing: "0.2px" }}>
                        {pill.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>

              {/* Botón */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
              >
                <button
                  className="btn-3"
                  onClick={() => {
                    setOpenAlert(true);
                    const el = document.getElementById("nuestras-ofertas");
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY + 120;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                    notificarVisitaPrecios();
                  }}
                >
                  <span>Ver nuestras ofertas</span>
                </button>
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
              py: 1,
            }}
            iconMapping={{
              success: (
                <svg
                  width="36"
                  height="20"
                  viewBox="0 0 20 20"
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
            ¡Cotiza tu website gratis!
          </Alert>
        </Snackbar>

      </Box>
    </>
  );
}

export default Hero;
