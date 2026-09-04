import { Container, Grid, Card, CardActionArea, CardMedia, Typography, Box, Button, useTheme, useMediaQuery, Dialog, IconButton } from "@mui/material";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { styled } from "@mui/system";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DialogTrabajos from "./DialogTrabajos";
import { cargarTrabajos } from "../helpers/HelperTrabajos";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "./css/Features.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


// DATOS
const features = [
  {
    id: 1,
    title: "Plataformas Web",
    desc: "Creamos sitios web con la última tecnología, responsivos que potencian tu presencia digital y hacen crecer tu negocio.",
    image: "servicio1.webp"
  },
  {
    id: 2,
    title: "Soporte Evolutivo de Sistemas",
    desc: "Garantizamos la continuidad y mejora de tus sistemas con mantenimiento proactivo y soporte TI especializado.",
    image: "servicio2.jpg"
  },
  {
    id: 3,
    title: "Desarrollo de Sistemas a Medida",
    desc: "Diseñamos y desarrollamos software personalizado que se adapta a las necesidades únicas de tu empresa.",
    image: "servicio3.webp"
  }
];

const featureHighlights = [
  {
    id: "mini-1",
    label: "Sitios Web",
    title: "Administración",
    video: "/feature-1.mp4",
    objectPosition: "center 32%",
    toneA: "#2c95e3",
    toneB: "#0f6fb8",
  },
  {
    id: "mini-2",
    label: "Sistemas",
    title: "Pagos Online",
    video: "/feature-2.mp4",
    objectPosition: "center 35%",
    toneA: "#1aa97a",
    toneB: "#0b7f59",
  },
  {
    id: "mini-3",
    label: "Calidad",
    title: "Pruebas Automatizadas",
    video: null,
    image: "/pruebas_automatizadas.png",
    icon: "🧪",
    objectPosition: "center top",
    toneA: "#ef4444",
    toneB: "#dc2626",
    wa: "Hola! Me interesa implementar Pruebas Automatizadas con CI/CD ¿Me comentas?",
  },
  {
    id: "mini-4",
    label: "Tiendas",
    title: "Suscripciones",
    video: "/feature-4.mp4",
    objectPosition: "center 25%",
    toneA: "#ffcf4d",
    toneB: "#e69a00",
  },
  {
    id: "mini-5",
    label: "Integración",
    title: "APIs a Medida",
    video: null,
    image: "/api.png",
    icon: "⚡",
    objectPosition: "center 25%",
    toneA: "#a855f7",
    toneB: "#7c3aed",
    wa: "Hola! Me interesa desarrollar una API a medida ¿Me comentas más?",
  },
  {
    id: "mini-6",
    label: "A Medida",
    title: "Chat Bot IA",
    video: "/feature-3.mp4",
    objectPosition: "center 30%",
    toneA: "#f08b32",
    toneB: "#cf6710",
  },
];


const featureDialogMessages = {
  "mini-1": "Gestiona tu negocio, clientes y trabajos en tiempo real.",
  "mini-2": "Vende tus productos online y recibe pagos de forma simple y segura.",
  "mini-3": "Atención automática 24/7 para tus clientes.",
  "mini-4": "Genera ingresos mensuales automáticos para tu negocio.",
};

const featureDialogSectionStyles = {
  "mini-1": {
    border: "2px solid rgba(129, 212, 250, 0.9)",
    background: "linear-gradient(180deg, rgba(24, 168, 255, 0.99), rgba(0, 108, 204, 1))",
    boxShadow: "0 18px 38px rgba(0, 123, 255, 0.24)",
  },
  "mini-2": {
    border: "2px solid rgba(129, 199, 132, 0.88)",
    background: "linear-gradient(180deg, rgba(29, 174, 108, 0.99), rgba(12, 123, 74, 1))",
    boxShadow: "0 18px 38px rgba(15, 122, 74, 0.24)",
  },
  "mini-3": {
    border: "2px solid rgba(255, 183, 77, 0.9)",
    background: "linear-gradient(180deg, rgba(255, 166, 26, 0.99), rgba(224, 116, 0, 1))",
    boxShadow: "0 18px 38px rgba(255, 140, 0, 0.24)",
  },
  "mini-4": {
    border: "2px solid rgba(255, 241, 118, 0.9)",
    background: "linear-gradient(180deg, rgba(255, 205, 39, 0.99), rgba(214, 154, 9, 1))",
    boxShadow: "0 18px 38px rgba(255, 193, 7, 0.24)",
  },
};

// EFECTOS
const StyledCardActionArea = styled(CardActionArea)({
  position: "relative",
  "&:hover .overlay": { top: 0, height: "100%", backgroundColor: "rgba(3, 103, 191, 0.8)" },
  "&:hover .additional": { opacity: 1 },
  "&:hover .card-media": { transform: "scale(1.3)" },
});

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute", top: "50%", left: 0, right: 0, height: "75%",
  backgroundColor: "rgba(3, 103, 191, 0.4)", color: theme.palette.common.white,
  display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start",
  padding: theme.spacing(2), transition: "all 0.3s ease"
}));

const AdditionalContent = styled(Box)({ opacity: 0, transition: "opacity 0.3s ease" });

function FeaturePreviewVideo({
  src,
  height,
  objectPosition,
  shouldPlay,
  background,
  playbackRate = 1,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise?.catch) playPromise.catch(() => { });
      return;
    }

    video.pause();
    if (video.readyState >= 2) {
      try {
        video.currentTime = 0.05;
      } catch (_) {
        // no-op
      }
    }
  }, [shouldPlay, playbackRate]);

  return (
    <Box
      ref={videoRef}
      component="video"
      src={src}
      muted
      loop
      playsInline
      preload="none"
      onLoadedData={(e) => {
        if (!shouldPlay) {
          try {
            e.currentTarget.currentTime = 0.05;
          } catch (_) {
            // no-op
          }
        }
      }}
      sx={{
        width: "100%",
        height,
        objectFit: "cover",
        objectPosition: objectPosition || "center center",
        display: "block",
        background,
      }}
    />
  );
}

function FeatureCard({ option, isMobile, height, selectedFeatureVideo, activePreviewId, setActivePreviewId, handleOpenFeatureVideo, featureHighlights }) {
  const hasVideo = !!option.video;
  const pillLabel = hasVideo ? "Revisar" : "Consultar";
  const handleClick = () => {
    if (hasVideo) {
      handleOpenFeatureVideo(option);
    } else {
      const msg = encodeURIComponent(option.wa || "");
      window.open(`https://api.whatsapp.com/send?phone=56946873014&text=${msg}`, "_blank");
    }
  };
  const borderRadius = isMobile ? "24px" : "28px";
  const fontSize = isMobile ? "0.82rem" : "0.88rem";
  const iconSize = isMobile ? 20 : 22;
  const titleSize = isMobile ? "0.86rem" : "1rem";
  const titlePt = isMobile ? 0.85 : 0.95;

  return (
    <Box>
      <motion.div whileTap={{ scale: 0.985 }} whileHover={{ scale: 1.01 }}>
        <Box
          role="button"
          tabIndex={0}
          aria-label={`Seleccionar ${option.label}`}
          onClick={handleClick}
          onMouseEnter={() => hasVideo && setActivePreviewId(option.id)}
          onMouseLeave={() => hasVideo && setActivePreviewId(featureHighlights[0]?.id ?? null)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); } }}
          sx={{
            borderRadius,
            backgroundColor: "#ffffff",
            border: "1px solid rgba(255,255,255,0.22)",
            boxShadow: "0 8px 18px rgba(0,0,0,0.12)",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": { boxShadow: "0 12px 22px rgba(0,0,0,0.18)" },
          }}
        >
          {hasVideo ? (
            <FeaturePreviewVideo
              src={option.video}
              height={height}
              objectPosition={option.objectPosition}
              shouldPlay={!selectedFeatureVideo && activePreviewId === option.id}
              playbackRate={2}
              background={`linear-gradient(180deg, ${option.toneA}22 0%, #ffffff 100%)`}
            />
          ) : option.image ? (
            <Box
              component="img"
              src={option.image}
              alt={option.title}
              sx={{
                width: "100%",
                height,
                objectFit: "cover",
                objectPosition: option.objectPosition || "center center",
                display: "block",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height,
                background: `linear-gradient(145deg, ${option.toneA}33 0%, ${option.toneB}55 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "2.4rem" : "2.8rem",
              }}
            >
              {option.icon}
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(4,12,22,0.42), rgba(4,12,22,0.62))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
                px: isMobile ? 1.6 : 1.9,
                py: isMobile ? 0.8 : 0.95,
                borderRadius: "999px",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.38)",
                boxShadow: "0 14px 26px rgba(0,0,0,0.24)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Typography sx={{ color: "#fff", fontSize, fontWeight: 800, letterSpacing: "0.04em", lineHeight: 1 }}>
                {pillLabel}
              </Typography>
              <Box
                component="img"
                src="/clic.jpg"
                alt={pillLabel}
                sx={{ width: iconSize, height: iconSize, objectFit: "contain", display: "block", filter: "brightness(0) invert(1)" }}
              />
            </Box>
          </Box>
        </Box>
      </motion.div>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: 800,
          fontSize: titleSize,
          color: "#ffffff",
          pt: titlePt,
          px: 0.6,
          letterSpacing: "0.01em",
          lineHeight: 1.15,
        }}
      >
        {option.title}
      </Typography>
    </Box>
  );
}

function Features({ videoReady }) {
  const timestampRef = useRef(Date.now());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobileHeight = useMediaQuery("(max-height: 700px)");
  const prefersReducedMotion = useReducedMotion();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [mobileSwiper, setMobileSwiper] = useState(null);
  const [didAutoSlide, setDidAutoSlide] = useState(false);
  const [selectedFeatureVideo, setSelectedFeatureVideo] = useState(null);
  const [selectedFeatureAspectRatio, setSelectedFeatureAspectRatio] = useState(9 / 16);
  const [isFeatureVideoLoading, setIsFeatureVideoLoading] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState(null);
  // TRABAJOS ACTIVOS
  const trabajosActivos = useMemo(
    () => trabajos.filter((t) => Number(t.Estado) === 1),
    [trabajos]
  );

  //TRABAJOS
  const sitiosWebDesarrollo = useMemo(
    () => trabajosActivos.filter((t) => Number(t.TipoApp) === 1).length,
    [trabajosActivos]
  );
  const sistemasDesarrollo = useMemo(
    () => trabajosActivos.filter((t) => Number(t.TipoApp) === 2).length,
    [trabajosActivos]
  );
  const [openTrabajos, setOpenTrabajos] = useState(false);


  //TRABAJOS S3
  useEffect(() => {
    cargarTrabajos(`https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Trabajos.xlsx?t=${timestampRef.current}`)
      .then(setTrabajos);
  }, []);


  //EVITAR ANIMACIÓN DUPLICADA
  useEffect(() => {
    let timer;
    if (inView && !hasAnimated) {
      if (videoReady) {
        timer = setTimeout(() => {
          setHasAnimated(true);
        }, 0);
      }
    }
    return () => clearTimeout(timer);
  }, [videoReady, inView, hasAnimated]);

  const handleContactClick = (title) => {
    const mensaje = `¡Hola! Me interesó ${encodeURIComponent(title)} ¿Me comentas?`;
    window.open(`https://api.whatsapp.com/send?phone=56946873014&text=${mensaje}`, "_blank");
  };

  //APARICIÓN
  const cardAnimation = useMemo(
    () => ({
      hidden: { opacity: 0, x: 150 },
      visible: (index) => ({
        opacity: 1,
        x: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.8,
          delay: prefersReducedMotion ? 0 : 1 + index * 0.3,
          ease: "easeOut",
        },
      }),
    }),
    [prefersReducedMotion]
  );

  // handlers
  const handleTrabajosClick = () => setOpenTrabajos(true);
  const handleCloseTrabajos = () => setOpenTrabajos(false);
  const handleOpenFeatureVideo = (feature) => {
    window.dispatchEvent(new Event("pauseAmbientVideos"));
    setIsFeatureVideoLoading(true);
    setSelectedFeatureVideo(feature);
    setSelectedFeatureAspectRatio(9 / 16);
  };
  const handleCloseFeatureVideo = () => {
    window.dispatchEvent(new Event("resumeAmbientVideos"));
    setSelectedFeatureVideo(null);
    setSelectedFeatureAspectRatio(9 / 16);
    setIsFeatureVideoLoading(false);
  };

  //ATRASO MATRIX
  useEffect(() => {
    if (!inView || prefersReducedMotion) {
      setShowMatrix(false);
      return;
    }
    const timer = setTimeout(() => setShowMatrix(true), 2500);
    return () => clearTimeout(timer);
  }, [inView, prefersReducedMotion]);

  useEffect(() => {
    if (!isMobile || !mobileSwiper || didAutoSlide) return;
    const timer = setTimeout(() => {
      if (!mobileSwiper.destroyed) {
        mobileSwiper.slideTo(1);
        setDidAutoSlide(true);
      }
    }, 6500);
    return () => clearTimeout(timer);
  }, [isMobile, mobileSwiper, didAutoSlide]);

  useEffect(() => {
    if (!inView || prefersReducedMotion) {
      setActivePreviewId(null);
      return;
    }
    setActivePreviewId(featureHighlights[0]?.id ?? null);
  }, [inView, prefersReducedMotion, isMobile]);

  useEffect(() => {
    if (!inView || prefersReducedMotion || selectedFeatureVideo) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % featureHighlights.length;
      setActivePreviewId(featureHighlights[currentIndex].id);
    }, 1000);

    return () => clearInterval(interval);
  }, [inView, prefersReducedMotion, isMobile, selectedFeatureVideo]);

  const matrixColumns = useMemo(() => {
    const count = isMobile ? 18 : 50;
    const rows = isMobile ? 10 : 15;
    return Array.from({ length: count }, (_, i) => ({
      key: i,
      delay: `${Math.random() * 3}s`,
      duration: `${3 + Math.random() * 2}s`,
      height: `${25 + Math.random() * 40}px`,
      text: Array.from({ length: rows })
        .map(() => (Math.random() > 0.5 ? "1" : "0"))
        .join("\n"),
    }));
  }, [isMobile]);

  const enableSwiperAutoplay = !isMobile && !prefersReducedMotion;
  const desktopFeature = features[0];

  return (
    <Box
      sx={{
        position: "relative",
        py: 0,
        pb: "15px",
        color: "white",
        overflowY: "visible",
        backgroundColor: "transparent !important", // 👈 fuerza transparencia
        backdropFilter: "none !important",         // 👈 evita filtros accidentales
        zIndex: 2,                                 // 👈 encima del glow
      }}
    >
      {/* 🌧️ CASCADA MATRIX */}
      <Box
        className="matrix-rain"
        sx={{
          position: "relative",
          width: "100%",
          height: isMobile ? "15px" : "15px", // 👈 espacio siempre reservado
          overflow: "hidden",
          mt: "-1px",
        }}
      >
        <AnimatePresence>
          {showMatrix && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0, // ocupa toda la caja
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {matrixColumns.map((col) => (
                <span
                  key={col.key}
                  className="matrix-stream"
                  style={{
                    "--delay": col.delay,
                    "--duration": col.duration,
                    "--height": col.height,
                  }}
                >
                  {col.text}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>


      <Container
        sx={{
          py: 0,
          maxWidth: "1500px !important",
          px: { xs: 2, md: 8, lg: 14 },
          overflow: "visible",
          backgroundColor: "transparent !important", // ✅ fondo transparente
          backdropFilter: "none !important",         // ✅ sin blur
          zIndex: 3,
        }}
      >
        <Box ref={ref}>
          {/* Título sección */}
          <Box sx={{ mb: { xs: 1.8, md: 2.2 } }}>
            {/* Título con gradiente */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.12 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.18rem", md: "1.45rem" },
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.1,
                  mb: 1.1,
                  letterSpacing: "-0.02em",
                  textWrap: "balance",
                }}
              >
                Contrata nuestros{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(90deg, #2c95e3 0%, #a855f7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  servicios:
                </Box>
              </Typography>
            </motion.div>
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.3 }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "0.72rem", md: "0.8rem" },
                  color: "rgba(255,255,255,0.42)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  fontStyle: "italic",
                }}
              >
                Cuéntanos qué necesitas y lo construimos para ti.
              </Typography>
            </motion.div>
          </Box>

          {isMobile ? (
            <Grid container spacing={1.5}>
              <Grid item xs={12} sx={{ mt: "-10px" }}>
                <motion.div
                  initial="hidden"
                  animate={hasAnimated ? "visible" : "hidden"}
                  variants={cardAnimation}
                  custom={0}
                >
                  <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    modules={[Autoplay, Pagination]}
                    autoplay={
                      enableSwiperAutoplay
                        ? {
                          delay: 5000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }
                        : false
                    }
                    pagination={{
                      clickable: true,
                      type: "bullets",
                    }}
                    onSwiper={setMobileSwiper}
                    onInit={(swiper) => {
                      if (enableSwiperAutoplay && swiper.autoplay) {
                        swiper.autoplay.stop();
                        setTimeout(() => {
                          swiper.autoplay?.start();
                        }, 2000);
                      }
                    }}
                    className="custom-swiper"
                  >
                    <SwiperSlide>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: 200,
                          borderRadius: "40px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          component="img"
                          src="/trabajos-features.webp"
                          alt="Trabajos recientes"
                          loading="lazy"
                          decoding="async"
                          sx={{
                            width: "100%",
                            height: "120%",
                            objectFit: "cover",
                            objectPosition: "center top",
                            transform: "translateY(0%)",
                          }}
                        />
                      </Box>
                    </SwiperSlide>

                    <SwiperSlide>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "visible",
                          borderRadius: "50px",
                          height: 200,
                          display: "flex",
                          alignItems: "flex-end",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Box
                          sx={{
                            flex: 1,
                            background: "linear-gradient(135deg, hsl(210, 80%, 55%), hsl(220, 70%, 35%))",
                            borderRadius: "30px",
                            p: 3,
                            height: "65%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "100%",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleContactClick("Sitios Web");
                          }}
                        >
                          <Box sx={{ maxWidth: "68%" }}>
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: "bold",
                                mb: 0.5,
                                textAlign: "left",
                                color: "#fff",
                                fontSize: "0.9rem",
                                whiteSpace: "nowrap",
                                lineHeight: 1.05,
                              }}
                            >
                              Convierte visitas en clientes
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#fff",
                                textAlign: "left",
                                fontSize: "0.62rem",
                                maxWidth: "82%",
                                lineHeight: 1.2,
                              }}
                            >
                              Atrae clientes, muestra tus servicios y vende más online.
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            position: "absolute",
                            right: "-8px",
                            bottom: 0,
                            height: "100%",
                            aspectRatio: "572 / 788",
                            zIndex: 2,
                          }}
                        >
                          <Box
                            component="img"
                            src="/sitio-web.webp"
                            alt="Preview Sitios Web"
                            loading="lazy"
                            decoding="async"
                            sx={{
                              position: "absolute",
                              top: "5%",
                              left: "12%",
                              width: "54.4%",
                              height: "81.7%",
                              objectFit: "cover",
                              borderRadius: "10px",
                              zIndex: 0,
                              backgroundColor: "black",
                            }}
                          />
                          <Box
                            component="img"
                            src="/mano-celular.webp"
                            alt="Mano con celular"
                            loading="lazy"
                            decoding="async"
                            sx={{
                              width: "100%",
                              height: "auto",
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 1,
                              pointerEvents: "none",
                            }}
                          />
                        </Box>
                      </Card>
                    </SwiperSlide>
                  </Swiper>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={1.4}>
                  {featureHighlights.map((option, index) => (
                    <Grid item xs={6} key={option.id}>
                      <motion.div
                        initial="hidden"
                        animate={hasAnimated ? "visible" : "hidden"}
                        variants={cardAnimation}
                        custom={index + 1}
                      >
                        <FeatureCard option={option} isMobile height={118} selectedFeatureVideo={selectedFeatureVideo} activePreviewId={activePreviewId} setActivePreviewId={setActivePreviewId} handleOpenFeatureVideo={handleOpenFeatureVideo} featureHighlights={featureHighlights} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={1.6} alignItems="stretch">
              {featureHighlights.map((option, index) => (
                <Grid item xs={6} md={4} key={option.id}>
                  <motion.div
                    initial="hidden"
                    animate={hasAnimated ? "visible" : "hidden"}
                    variants={cardAnimation}
                    custom={index + 1}
                  >
                    <FeatureCard option={option} isMobile={false} height={148} selectedFeatureVideo={selectedFeatureVideo} activePreviewId={activePreviewId} setActivePreviewId={setActivePreviewId} handleOpenFeatureVideo={handleOpenFeatureVideo} featureHighlights={featureHighlights} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>


        {/* Botón EN DESARROLLO — oculto temporalmente */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            ease: "easeOut",
            delay: prefersReducedMotion ? 0 : (isMobile ? 0.8 : 0.3),
          }}
          style={{
            display: "none",
            minHeight: "60px",
            justifyContent: "center",
            marginTop: isMobile ? "40px" : "28px",
            marginBottom: "12px",
          }}
        >
          <Button
            onClick={handleTrabajosClick}
            variant="contained"
            fullWidth
            sx={{
              minWidth: { xs: "320px", sm: "360px" },
              height: "54px",
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "Albert Sans, sans-serif",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(135deg, #ffd54f, #ff9800 45%, #f57c00 85%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 8s ease infinite",
              boxShadow: "0 6px 16px rgba(255,152,0,.4)",
              position: "relative",
              overflow: "hidden",
              justifyContent: "center",
              gap: 0,
              maxWidth: { xs: "100%", md: "520px" },
              border: "2px solid rgba(255, 213, 79, 0.9)",
              zIndex: 1,
              "&:hover": {
                background: "linear-gradient(135deg,#ffb74d,#fb8c00)",
                boxShadow: "0 0 6px rgba(255,167,38,.6), inset 0 0 6px rgba(255,255,255,0.25)",
              },
              "&::before": {
                content: '""', position: "absolute", inset: "-2px", borderRadius: "inherit",
                background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 10%, #fff59d 20%, rgba(255,255,255,0.9) 30%, transparent 40%)",
                backgroundRepeat: "no-repeat", backgroundSize: "300% 300%",
                animation: "shineBorderSweep 3s linear infinite, pulseGlow 4s ease-in-out infinite",
                pointerEvents: "none", zIndex: 2,
                mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
              },
              "&::after": {
                content: '""', position: "absolute", inset: 0,
                background: "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                transform: "translateX(-100%)", animation: "shineDiagonal 4s ease-in-out infinite",
                borderRadius: "inherit", pointerEvents: "none", zIndex: 1,
              },
              "&:hover::after": { animation: "shineDiagonal 1.2s ease-in-out" },
              "@keyframes shineBorderSweep": { "0%": { backgroundPosition: "-300% 0" }, "100%": { backgroundPosition: "300% 0" } },
              "@keyframes pulseGlow": { "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(255,223,0,.35))" }, "50%": { filter: "drop-shadow(0 0 14px rgba(255,223,0,.75))" } },
              "@keyframes shineDiagonal": { "0%": { transform: "translateX(-120%) rotate(0deg)" }, "100%": { transform: "translateX(120%) rotate(0deg)" } },
              "@keyframes gradientShift": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
            }}
          >
            <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", overflow: "visible", zIndex: 3 }}>
              <motion.div
                key="reloj"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={hasAnimated ? { opacity: 1, scale: 1.2 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ position: "absolute", left: "48%", top: "0%", transform: "translate(-50%, -50%)" }}
              >
                <motion.div
                  initial={{ x: 0, y: 0, scale: 1.5 }}
                  animate={hasAnimated ? { x: [0, 0, isMobile ? "-112px" : "-140px"], y: [0, 0, "0px"], scale: [1.4, 1.3, 0.7] } : { x: 0, y: 0, scale: 1.5 }}
                  transition={{ duration: 3, ease: "easeInOut", times: [0, 0.66, 1] }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <AccessTimeFilledRoundedIcon sx={{ fontSize: { xs: 26, sm: 28 }, color: "#fff", filter: "drop-shadow(0 0 8px rgba(255,167,38,.8))", animation: prefersReducedMotion ? "none" : "clock 12s steps(12) infinite", "@keyframes clock": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } } }} />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
                style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "35px", zIndex: 2 }}
              >
                <Typography sx={{ fontSize: { xs: "0.65rem", sm: "0.85rem" }, fontWeight: 600, whiteSpace: "nowrap", fontFamily: "Poppins, sans-serif" }}>
                  EN DESARROLLO:
                </Typography>
                <Box sx={{ minWidth: { xs: 70, sm: 90 }, textAlign: "center", px: { xs: 0.4, sm: 0.8 }, py: 0.2, borderRadius: "6px", fontWeight: 700, fontFamily: "Poppins, sans-serif", fontSize: { xs: "0.65rem", sm: "0.8rem" }, background: "linear-gradient(135deg,#ffa726,#fb8c00)", border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 0 4px rgba(255,167,38,.4), inset 0 0 4px rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
                  {sitiosWebDesarrollo}{" "}{sitiosWebDesarrollo === 1 ? "Sitio web" : "Sitios web"}
                </Box>
                <Box sx={{ minWidth: { xs: 70, sm: 90 }, textAlign: "center", px: { xs: 0.4, sm: 0.8 }, py: 0.2, borderRadius: "6px", fontWeight: 700, fontFamily: "Poppins, sans-serif", fontSize: { xs: "0.65rem", sm: "0.8rem" }, background: "linear-gradient(135deg,#ffa726,#fb8c00)", border: "2px solid rgba(255,255,255,.8)", boxShadow: "0 0 4px rgba(255,167,38,.4), inset 0 0 4px rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
                  {sistemasDesarrollo}{" "}{sistemasDesarrollo === 1 ? "Sistema" : "Sistemas"}
                </Box>
                <Box component={motion.img} src="/clic.jpg" alt="clic" loading="lazy" initial={{ scale: 1, y: 0 }} animate={{ scale: [1, 0.9, 1], y: [0, 1, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} whileTap={{ scale: 0.85, rotate: -3 }} whileHover={{ scale: 1.03, y: -1 }} sx={{ filter: "invert(1) brightness(2)", width: { xs: 23, sm: 25 }, height: "auto", display: "block", userSelect: "none" }} />
              </motion.div>
            </Box>
          </Button>
        </motion.div>

        <DialogTrabajos
          open={openTrabajos}
          onClose={handleCloseTrabajos}
          trabajos={trabajosActivos}
          primaryLabel="Ver Servicios"
          onPrimaryClick={() => { handleCloseTrabajos(); navigate("/servicios"); }}
        />
        <Dialog
          open={Boolean(selectedFeatureVideo)}
          onClose={handleCloseFeatureVideo}
          maxWidth={false}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(6px)",
            },
          }}
          PaperProps={{
            sx: {
              width: {
                xs: isSmallMobileHeight ? "85vw" : "86vw",
                sm: "340px",
                md: "370px",
              },
              height: "auto",
              maxHeight: isSmallMobileHeight ? "90vh" : "94vh",
              maxWidth: "84vw",
              background: "transparent",
              borderRadius: "24px",
              border: "none",
              overflow: "visible",
              position: "relative",
              transform: "translateY(-34px)",
              boxShadow: "none",
              animation: prefersReducedMotion ? "none" : "featureDialogEnter 0.24s ease-out",
              "@keyframes featureDialogEnter": {
                "0%": { opacity: 1, transform: "translateY(-20px) scale(0.97)" },
                "100%": { opacity: 1, transform: "translateY(-34px) scale(1)" },
              },
            },
          }}
        >
          {selectedFeatureVideo && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: isSmallMobileHeight ? 0.8 : 0.9,
                p: {
                  xs: isSmallMobileHeight ? 0.45 : 0.55,
                  sm: 0.75,
                },
                boxSizing: "border-box",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: `${selectedFeatureAspectRatio}`,
                  maxHeight: {
                    xs: isSmallMobileHeight ? "68vh" : "72vh",
                    sm: "74vh",
                  },
                  borderRadius: isSmallMobileHeight ? "18px" : "20px",
                  overflow: "hidden",
                  backgroundColor: "rgba(7, 16, 27, 0.96)",
                  border: "2px solid rgba(255,255,255,0.9)",
                  position: "relative",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: "-2px",
                    borderRadius: "inherit",
                    background:
                      "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.88) 12%, rgba(255,255,255,0.18) 24%, transparent 36%)",
                    backgroundSize: "260% 260%",
                    animation: prefersReducedMotion ? "none" : "featureBorderGlow 3.2s linear infinite",
                    pointerEvents: "none",
                    zIndex: 0,
                    mask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                  },
                  "@keyframes featureBorderGlow": {
                    "0%": { backgroundPosition: "-220% 0" },
                    "100%": { backgroundPosition: "220% 0" },
                  },
                }}
              >
                {isFeatureVideoLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.1,
                      background:
                        "radial-gradient(circle at center, rgba(22,34,49,0.88), rgba(5,10,18,0.97))",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.18)",
                        borderTopColor: "rgba(255,255,255,0.92)",
                        animation: "featureLoaderSpin 0.9s linear infinite",
                        "@keyframes featureLoaderSpin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                    <Typography
                      sx={{
                        color: "rgba(255,255,255,0.92)",
                        fontSize: { xs: "0.78rem", sm: "0.84rem" },
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        textTransform: "uppercase",
                      }}
                    >
                      Cargando demo
                    </Typography>
                  </Box>
                )}
                <IconButton
                  aria-label="Cerrar video"
                  onClick={handleCloseFeatureVideo}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 2,
                    color: "#fff",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.68)",
                    },
                  }}
                >
                  <CloseRoundedIcon
                    sx={{
                      animation: selectedFeatureVideo ? "featureCloseSpin 0.55s ease-out" : "none",
                      "@keyframes featureCloseSpin": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(1080deg)" },
                      },
                    }}
                  />
                </IconButton>
                <Box
                  component="video"
                  src={selectedFeatureVideo.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget;
                    if (video.videoWidth && video.videoHeight) {
                      setSelectedFeatureAspectRatio(video.videoWidth / video.videoHeight);
                    }
                  }}
                  onCanPlay={() => setIsFeatureVideoLoading(false)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center 46%",
                    display: "block",
                    backgroundColor: "#000",
                    transform: prefersReducedMotion ? "none" : "scale(1.018)",
                    filter: prefersReducedMotion ? "none" : "brightness(1)",
                    animation: prefersReducedMotion ? "none" : "featureVideoZoom 0.5s ease-out",
                    "@keyframes featureVideoZoom": {
                      "0%": { opacity: 0.9, transform: "scale(1.055)", filter: "brightness(0.45)" },
                      "100%": { opacity: 1, transform: "scale(1.018)", filter: "brightness(1)" },
                    },
                  }}
                />
              </Box>
              <motion.div
                key={selectedFeatureVideo.id}
                initial={prefersReducedMotion ? false : { y: 34 }}
                animate={{ y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.34, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.08 }}
                style={{ width: "100%" }}
              >
                <Box
                sx={{
                  width: "100%",
                  borderRadius: isSmallMobileHeight ? "16px" : "18px",
                  border:
                    (featureDialogSectionStyles[selectedFeatureVideo?.id] || {}).border ||
                    "2px solid rgba(255,255,255,0.55)",
                  background:
                    (featureDialogSectionStyles[selectedFeatureVideo?.id] || {}).background ||
                    "linear-gradient(180deg, rgba(28, 42, 63, 0.98), rgba(12, 20, 33, 1))",
                  boxShadow:
                    (featureDialogSectionStyles[selectedFeatureVideo?.id] || {}).boxShadow ||
                    "0 18px 34px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.08)",
                  px: isSmallMobileHeight ? 1.05 : 1.3,
                  py: isSmallMobileHeight ? 1.05 : 1.4,
                  boxSizing: "border-box",
                }}
              >
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#ffffff",
                    fontSize: {
                      xs: isSmallMobileHeight ? "0.9rem" : "0.96rem",
                      sm: "1.02rem",
                    },
                    lineHeight: isSmallMobileHeight ? 1.36 : 1.44,
                    fontWeight: 900,
                    letterSpacing: "0.012em",
                  }}
                >
                  {featureDialogMessages[selectedFeatureVideo.id] || "Gestiona tu negocio, clientes y trabajos en tiempo real."}
                </Typography>
              </Box>
              </motion.div>
            </Box>
          )}
        </Dialog>
      </Container >
    </Box >
  );
}

export default Features;
