import { Container, Grid, Card, CardActionArea, CardMedia, Typography, Box, Button, useTheme, useMediaQuery, } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
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

function Features({ videoReady }) {
  const timestamp = Date.now();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const [trabajos, setTrabajos] = useState([]);
  const [showMatrix, setShowMatrix] = useState(false);
  // TRABAJOS ACTIVOS
  const trabajosActivos = trabajos.filter(t => Number(t.Estado) === 1);

  //TRABAJOS
  const sitiosWebDesarrollo = trabajosActivos.filter(t => Number(t.TipoApp) === 1).length;
  const sistemasDesarrollo = trabajosActivos.filter(t => Number(t.TipoApp) === 2).length;
  const [openTrabajos, setOpenTrabajos] = useState(false);


  //TRABAJOS S3
  useEffect(() => {
    cargarTrabajos(`https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Trabajos.xlsx?t=${timestamp}`)
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
  const cardAnimation = {
    hidden: { opacity: 0, x: 150 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 1 + index * 0.3, ease: "easeOut" },
    }),
  };

  // handlers
  const handleTrabajosClick = () => setOpenTrabajos(true);
  const handleCloseTrabajos = () => setOpenTrabajos(false);

  //ATRASO MATRIX
  useEffect(() => {
    const timer = setTimeout(() => setShowMatrix(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',  // Asegura que la imagen cubra todo el contenedor
        backgroundPosition: 'center',  // Centra la imagen en el fondo
        backgroundAttachment: 'fixed',  // Asegura que la imagen de fondo no se mueva al hacer scroll
        py: 0,
        paddingBottom: "15px",
        color: "white",  // Ajusta el color del texto para que sea visible sobre el fondo
        overflowY: 'visible',
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
              {[...Array(isMobile ? 30 : 80)].map((_, i) => (
                <span
                  key={i}
                  className="matrix-stream"
                  style={{
                    "--delay": `${Math.random() * 3}s`,
                    "--duration": `${3 + Math.random() * 2}s`,
                    "--height": `${25 + Math.random() * 40}px`,
                  }}
                >
                  {Array.from({ length: 15 })
                    .map(() => (Math.random() > 0.5 ? "1" : "0"))
                    .join("\n")}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>


      <Container sx={{ py: 0, maxWidth: "1500px !important", overflow: 'hidden', }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: isMobile ? 0.8 : 0.3,
          }}
          style={{
            minHeight: "60px",
            display: "flex",
            justifyContent: "center",
            marginTop: "0px",
            marginBottom: "16px",
          }}
        >

          <Button
            onClick={handleTrabajosClick}
            variant="contained"
            fullWidth
            sx={{
              minWidth: { xs: "320px", sm: "360px" },
              height: "58px",
              borderRadius: "14px",
              textTransform: "none",
              fontFamily: "Albert Sans, sans-serif",
              fontWeight: 600,
              color: "#fff",
              background:
                "linear-gradient(135deg, #ffd54f, #ff9800 45%, #f57c00 85%)",
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
                boxShadow:
                  "0 0 6px rgba(255,167,38,.6), inset 0 0 6px rgba(255,255,255,0.25)",
              },

              /* ✨ BRILLO EXTERNO — Border Sweep + Pulse */
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-2px",
                borderRadius: "inherit",
                background:
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 10%, #fff59d 20%, rgba(255,255,255,0.9) 30%, transparent 40%)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "300% 300%",
                animation:
                  "shineBorderSweep 3s linear infinite, pulseGlow 4s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 2,
                mask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
              },

              /* ✨ BRILLO INTERNO — Sheen diagonal */
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                transform: "translateX(-100%)",
                animation: "shineDiagonal 4s ease-in-out infinite",
                borderRadius: "inherit",
                pointerEvents: "none",
                zIndex: 1,
              },

              /* ⚡ Destello rápido al pasar el mouse */
              "&:hover::after": {
                animation: "shineDiagonal 1.2s ease-in-out",
              },

              /* 🔥 ANIMACIONES */
              "@keyframes shineBorderSweep": {
                "0%": { backgroundPosition: "-300% 0" },
                "100%": { backgroundPosition: "300% 0" },
              },

              "@keyframes pulseGlow": {
                "0%, 100%": { filter: "drop-shadow(0 0 6px rgba(255,223,0,.35))" },
                "50%": { filter: "drop-shadow(0 0 14px rgba(255,223,0,.75))" },
              },

              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(-120%) rotate(0deg)" },
                "100%": { transform: "translateX(120%) rotate(0deg)" },
              },

              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            {/* 🌟 Animación principal del reloj + contenido */}
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                overflow: "visible",
                zIndex: 3,
              }}
            >
              {/* 🕓 Reloj centrado al inicio y luego se mueve a la izquierda */}
              <motion.div
                key="reloj"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={
                  hasAnimated
                    ? {
                      opacity: 1,
                      scale: 1.2,
                    }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  left: "48%",
                  top: "0%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  initial={{ x: 0, y: 0, scale: 1.5 }}
                  animate={
                    hasAnimated
                      ? {
                        x: [0, 0, isMobile ? "-112px" : "-140px"],
                        y: [0, 0, "0px"], // 🔼 mantiene alineado con el texto
                        scale: [1.4, 1.3, 0.7]
                      }
                      : { x: 0, y: 0, scale: 1.5 }
                  }
                  transition={{
                    duration: 3,
                    ease: "easeInOut",
                    times: [0, 0.66, 1],
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTimeFilledRoundedIcon
                    sx={{
                      fontSize: { xs: 26, sm: 28 },
                      color: "#fff",
                      filter: "drop-shadow(0 0 8px rgba(255,167,38,.8))",
                      animation: "clock 12s steps(12) infinite",
                      "@keyframes clock": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  delay: 2.8, // ⏱ aparece justo al terminar el movimiento del reloj
                  duration: 0.8,
                  ease: "easeOut",
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginLeft: "35px",
                  zIndex: 2,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "0.65rem", sm: "0.85rem" },
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  EN DESARROLLO:
                </Typography>

                {/* 🧱 Chip 1 */}
                <Box
                  sx={{
                    minWidth: { xs: 70, sm: 90 },
                    textAlign: "center",
                    px: { xs: 0.4, sm: 0.8 },
                    py: 0.2,
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "0.65rem", sm: "0.8rem" },
                    background: "linear-gradient(135deg,#ffa726,#fb8c00)",
                    border: "2px solid rgba(255,255,255,.8)",
                    boxShadow:
                      "0 0 4px rgba(255,167,38,.4), inset 0 0 4px rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sitiosWebDesarrollo}{" "}
                  {sitiosWebDesarrollo === 1 ? "Sitio web" : "Sitios web"}
                </Box>

                {/* 🧱 Chip 2 */}
                <Box
                  sx={{
                    minWidth: { xs: 70, sm: 90 },
                    textAlign: "center",
                    px: { xs: 0.4, sm: 0.8 },
                    py: 0.2,
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "0.65rem", sm: "0.8rem" },
                    background: "linear-gradient(135deg,#ffa726,#fb8c00)",
                    border: "2px solid rgba(255,255,255,.8)",
                    boxShadow:
                      "0 0 4px rgba(255,167,38,.4), inset 0 0 4px rgba(255,255,255,0.2)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sistemasDesarrollo}{" "}
                  {sistemasDesarrollo === 1 ? "Sistema" : "Sistemas"}
                </Box>

                {/* 🖱️ Clic animado */}
                <Box
                  component={motion.img}
                  src="/clic.jpg"
                  alt="clic"
                  loading="lazy"
                  initial={{ scale: 1, y: 0 }}
                  animate={{ scale: [1, 0.9, 1], y: [0, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  whileTap={{ scale: 0.85, rotate: -3 }}
                  whileHover={{ scale: 1.03, y: -1 }}
                  sx={{
                    filter: "invert(1) brightness(2)",
                    width: { xs: 23, sm: 25 },
                    height: "auto",
                    display: "block",
                    userSelect: "none",
                  }}
                />
              </motion.div>
            </Box>

          </Button>

        </motion.div>


        <Box ref={ref}>
          <Grid container spacing={isMobile ? 1.5 : 4}>

            {features.map((feature, index) => {
              // ✅ Caso especial: id=1 en mobile → slider con 2 secciones
              if (isMobile && feature.id === 1) {
                return (
                  <Grid item xs={12} key={feature.id}>
                    <motion.div
                      initial="hidden"
                      animate={hasAnimated ? "visible" : "hidden"}
                      variants={cardAnimation}
                      custom={index}
                    >
                      <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        modules={[Autoplay, Pagination]}
                        autoplay={{
                          delay: 5000,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }}
                        pagination={{
                          clickable: true,
                          type: "bullets",
                        }}
                        onInit={(swiper) => {
                          if (swiper.autoplay) {
                            swiper.autoplay.stop();
                            setTimeout(() => {
                              swiper.autoplay?.start();
                            }, 2000);
                          }
                        }}
                        className="custom-swiper">

                        {/* Slide 1: Sitios Web */}
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
                            {/* Box verde */}
                            <Box
                              sx={{
                                flex: 1,
                                background: "linear-gradient(135deg, hsl(142.63deg 70.28% 48.82%), hsl(142.63deg 80% 35%))",
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
                              <Box sx={{ maxWidth: "60%" }}>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: "bold",
                                    mb: 0.5,
                                    textAlign: "left",
                                    color: "#fff",
                                    fontSize: "1.9rem",
                                  }}
                                >
                                  Sitios Web
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#fff",
                                    textAlign: "left",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  Llega a más clientes online.
                                </Typography>
                              </Box>
                            </Box>

                            {/* Imagen mockup derecha */}
                            <Box
                              sx={{
                                position: "absolute",
                                right: 0,
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

                        {/* Slide 2: Sistemas */}
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
                            {/* Box degradado azul */}
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
                                alignItems: "flex-end",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleContactClick("Sistemas");
                              }}
                            >
                              <Box sx={{ maxWidth: "60%", textAlign: "right" }}>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    fontWeight: "bold",
                                    mb: 0.5,
                                    color: "#fff",
                                    fontSize: "1.9rem",
                                  }}
                                >
                                  Sistemas
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "#fff",
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  Control total sobre tu negocio.
                                </Typography>
                              </Box>
                            </Box>

                            {/* Imagen mockup izquierda */}
                            <Box
                              sx={{
                                position: "absolute",
                                left: 10,
                                bottom: 0,
                                height: "100%",
                                aspectRatio: "572 / 788",
                                zIndex: 2,
                                transform: "scaleX(-1)",
                              }}
                            >
                              <Box
                                component="img"
                                src="/sistemas.webp"
                                alt="Preview Sistemas"
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
                                  transform: "scaleX(-1)",
                                }}
                              />
                              <Box
                                component="img"
                                src="/mano-celular.webp"
                                alt="Mano con celular"
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
                );
              }


              // ✅ resto de las cards como estaban
              return (
                <Grid item xs={12} md={4} key={feature.id}>
                  <motion.div
                    initial="hidden"
                    animate={hasAnimated ? "visible" : "hidden"}
                    variants={cardAnimation}
                    custom={index}
                  >
                    <Card sx={{ position: "relative", overflow: "hidden" }}>
                      <StyledCardActionArea href={feature.link} target="_self">
                        <CardMedia
                          component="img"
                          image={feature.image}
                          alt={feature.title}
                          loading="lazy"
                          sx={{ height: isMobile ? 205 : 250, transition: "transform 1s ease" }}
                        />
                        <Overlay className="overlay">
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              mt: isMobile ? 2 : 3,
                              mb: 1,
                              textAlign: "left",
                              px: 1,
                              fontSize: isMobile ? "1.15rem" : "1.4rem",
                            }}
                          >
                            {feature.title}
                          </Typography>
                          <AdditionalContent className="additional">
                            <Typography variant="body2" sx={{ mb: 1, px: 1 }}>
                              {feature.desc}
                            </Typography>
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                              <Box
                                component="span"
                                role="button"
                                tabIndex={0}
                                className="btn-3-features"
                                sx={{
                                  zIndex: 5,
                                  cursor: "pointer",
                                  display: "inline-block",
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleContactClick(feature.title);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleContactClick(feature.title);
                                  }
                                }}
                              >
                                <span>Contratar</span>
                              </Box>
                            </Box>
                          </AdditionalContent>
                        </Overlay>
                      </StyledCardActionArea>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        <DialogTrabajos
          open={openTrabajos}
          onClose={handleCloseTrabajos}
          trabajos={trabajosActivos}
          primaryLabel="Ver Servicios"
          onPrimaryClick={() => { handleCloseTrabajos(); navigate("/servicios"); }}
        />
      </Container >
    </Box >
  );
}

export default Features;
