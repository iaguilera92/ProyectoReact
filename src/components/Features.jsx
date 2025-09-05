import { Container, Grid, Badge, Card, Tooltip, CardActionArea, CardMedia, Typography, Box, Button, useTheme, useMediaQuery, } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
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

  // TRABAJOS ACTIVOS
  const trabajosActivos = trabajos.filter(t => Number(t.Estado) === 1);

  // Ahora cuentas sobre los activos
  const sitiosWebDesarrollo = trabajosActivos.filter(t => Number(t.TipoApp) === 1).length;
  const sistemasDesarrollo = trabajosActivos.filter(t => Number(t.TipoApp) === 2).length;
  const hasTrabajos = trabajosActivos.length > 0;


  const handleSolucionesClick = () => {
    navigate("/servicios");
  };
  const [openTrabajos, setOpenTrabajos] = useState(false);

  // handlers
  const handleTrabajosClick = () => setOpenTrabajos(true);
  const handleCloseTrabajos = () => setOpenTrabajos(false);

  return (
    <Box
      sx={{
        backgroundImage: 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',  // Asegura que la imagen cubra todo el contenedor
        backgroundPosition: 'center',  // Centra la imagen en el fondo
        backgroundAttachment: 'fixed',  // Asegura que la imagen de fondo no se mueva al hacer scroll
        py: 2,
        paddingBottom: "15px",
        color: "white",  // Ajusta el color del texto para que sea visible sobre el fondo
        overflowY: 'visible',
      }}
    >
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
            marginTop: "10px",
            marginBottom: "16px",
          }}
        >

          {hasTrabajos ? (
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
                background: "linear-gradient(135deg, #ffd54f, #ff9800 45%, #f57c00 85%)",
                backgroundSize: "200% 200%",
                animation: "gradientShift 8s ease infinite",
                boxShadow: "0 6px 16px rgba(255,152,0,.4)",
                position: "relative",
                overflow: "hidden",
                justifyContent: "center",
                gap: 0.6,
                maxWidth: { xs: "100%", md: "520px" },
                "&:hover": {
                  background: "linear-gradient(135deg,#ffb74d,#fb8c00)",
                  boxShadow:
                    "0 0 6px rgba(255,167,38,.6), inset 0 0 6px rgba(255,255,255,0.25)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 50%, transparent 100%)",
                  transform: "translateX(-100%)",
                  animation: "sheen 3.5s ease-in-out infinite",
                  pointerEvents: "none",
                },
                "@keyframes gradientShift": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
                "@keyframes sheen": {
                  "0%": { transform: "translateX(-120%)" },
                  "100%": { transform: "translateX(120%)" },
                },
                "@keyframes clock": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            >
              {/* ⏩ Pop al contenido */}
              <motion.div
                initial={{ scale: 0.9 }} // parte un poco más chico
                animate={hasAnimated ? { scale: 1 } : {}}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: isMobile ? 1.5 : 1, // 🔑 espera 1s después de hasAnimated
                }}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                {/* Reloj */}
                <AccessTimeFilledRoundedIcon
                  sx={{
                    fontSize: { xs: 18, sm: 22 },
                    animation: "clock 12s steps(12) infinite",
                    transformOrigin: "50% 50%",
                    filter: "drop-shadow(0 0 4px rgba(255,167,38,.35))",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                />

                {/* Texto + chips */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    gap: { xs: 0.4, sm: 1 },
                    overflow: "hidden",
                    fontSize: { xs: "0.71rem", sm: "0.9rem" },
                  }}
                >
                  <span>En desarrollo:</span>

                  <Box
                    sx={{
                      minWidth: { xs: 90, sm: 120 },
                      textAlign: "center",
                      px: { xs: 0.6, sm: 1.2 },
                      py: 0.4,
                      borderRadius: "8px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg,#ffa726,#fb8c00)",
                      border: "2px solid rgba(255,255,255,.8)",
                      boxShadow:
                        "0 0 6px rgba(255,167,38,.5), inset 0 0 6px rgba(255,255,255,0.25)",
                      whiteSpace: "nowrap",
                      position: "relative",
                      zIndex: 1,
                      transition: "all .25s ease",
                      "&:hover": {
                        borderColor: "#fff",
                        boxShadow:
                          "0 0 10px rgba(255,193,7,.8), inset 0 0 8px rgba(255,255,255,0.35)",
                      },
                    }}
                  >
                    {sitiosWebDesarrollo} {sitiosWebDesarrollo === 1 ? "Sitio web" : "Sitios web"}
                  </Box>

                  <Box
                    sx={{
                      minWidth: { xs: 90, sm: 120 },
                      textAlign: "center",
                      px: { xs: 0.6, sm: 1.2 },
                      py: 0.4,
                      borderRadius: "8px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg,#ffa726,#fb8c00)",
                      border: "2px solid rgba(255,255,255,.8)",
                      boxShadow:
                        "0 0 6px rgba(255,167,38,.5), inset 0 0 6px rgba(255,255,255,0.25)",
                      whiteSpace: "nowrap",
                      position: "relative",
                      zIndex: 1,
                      transition: "all .25s ease",
                      "&:hover": {
                        borderColor: "#fff",
                        boxShadow:
                          "0 0 10px rgba(255,193,7,.8), inset 0 0 8px rgba(255,255,255,0.35)",
                      },
                    }}
                  >
                    {sistemasDesarrollo} {sistemasDesarrollo === 1 ? "Sistema" : "Sistemas"}
                  </Box>
                </Box>

                {/* Flecha */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  whileTap={{ scale: 0.85 }}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <ChevronRightRoundedIcon
                    sx={{
                      fontSize: { xs: 18, sm: 22 },
                      transition: "transform .25s ease",
                      ".MuiButton-root:hover &": {
                        transform: "translateX(6px)",
                      },
                    }}
                  />
                </motion.div>
              </motion.div>
            </Button>


          ) : (
            <Button
              onClick={handleSolucionesClick}
              variant="contained"
              target="_self"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                letterSpacing: "3.1px",
                fontFamily: "albert sans, sans-serif",
                border: "1px solid #007de0",
                fontSize: { xs: "10px", sm: "1.1rem" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                width: { xs: "100%", sm: "460px" },
                maxWidth: "460px",
                height: "50px",
                backgroundColor: "#007de0",
                transition: "width 0.3s ease",
                "&:hover": {
                  width: { xs: "100%", sm: "470px" },
                  backgroundColor: "#007de0",
                },
                "&:hover .icon": {
                  opacity: 1,
                  transform: "translateX(-10px)",
                },
                "&:hover .letter": {
                  transform: "translateX(15px)",
                },
              }}
            >
              {/* deja tu icono FaHubspot si quieres */}
              <Box component="span" fontSize={isMobile ? "11px" : "15px"}>
                + SOLUCIONES PARA TU EMPRESA
              </Box>
            </Button>
          )}

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
                              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                              height: 200,
                              display: "flex",
                              alignItems: "flex-end",
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
                                src="/sitios-web.webp"
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
                              boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                              height: 200,
                              display: "flex",
                              alignItems: "flex-end",
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
