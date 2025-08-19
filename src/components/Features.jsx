import { Container, Grid, Badge, Card, Tooltip, CardActionArea, CardMedia, Typography, Box, Button, useTheme, useMediaQuery, } from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DialogTrabajos from "./DialogTrabajos";

import { FaHubspot } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import "./css/Features.css"; // Importamos el CSSi

// DATOS
const features = [
  { id: 1, title: "Plataformas web", desc: "Diseñamos sitios web modernos, rápidos y adaptables para impulsar tus emprendimientos.", image: "servicio3.webp" },
  { id: 2, title: "Soporte Evolutivo de Sistemas", desc: "Soporte evolutivo y mantenimiento de sistemas, brindamos soporte TI para el mantenimiento de tus sistemas.", image: "servicio2.jpg" },
  { id: 3, title: "Desarrollo de Sistemas a Medida", desc: "Desarrollo de sistemas a medida, creamos software y sitios web personalizados para tu negocio.", image: "servicio1.jpg" }
];

// TRABAJOS
const trabajos = [
  { SitioWeb: "plataformas-web.cl", Porcentaje: 80, Estado: true },
  { SitioWeb: "investigadores-privados.cl", Porcentaje: 65, Estado: true },
  { SitioWeb: "mastracker.cl", Porcentaje: 100, Estado: false },
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const [hasAnimated, setHasAnimated] = useState(false);
  const navigate = useNavigate();
  const [buttonRef, buttonInView] = useInView({ triggerOnce: true, rootMargin: '0px 0px -20% 0px' });


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

  //TRABAJOS ACTIVOS
  // --- CTA dinámica según trabajos ---
  const enDesarrollo = trabajos.filter(t => t.Estado && t.Porcentaje < 100).length;
  const enCola = trabajos.filter(t => !t.Estado).length;

  const hasTrabajos = trabajos.length > 0;
  const textoTrabajos = `${enDesarrollo} Sitio${enDesarrollo === 1 ? "" : "s"} web en desarrollo, ${enCola} Sistema${enCola === 1 ? "" : "s"} en cola`;

  const progresoMedio = trabajos.length
    ? Math.round(trabajos.reduce((acc, t) => acc + t.Porcentaje, 0) / trabajos.length)
    : 0;

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
        overflowY: 'visible'
      }}
    >
      <Container sx={{ py: 0, maxWidth: "1500px !important", overflow: 'hidden' }}>
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <motion.div
            ref={buttonRef}
            initial={{ opacity: 0, y: 50 }}
            animate={
              isMobile
                ? (buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 })
                : (hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 })
            }
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              minHeight: "60px",
              display: "flex",
              justifyContent: "center",
            }}
          >

            {hasTrabajos ? (
              <Button
                onClick={handleTrabajosClick}
                variant="contained"
                target="_self"
                aria-label={textoTrabajos}
                startIcon={
                  <AccessTimeFilledRoundedIcon
                    sx={{
                      fontSize: { xs: 18, sm: 22 },
                      transformOrigin: "50% 50%",
                      animation: "clock 12s steps(12) infinite", // ⏱️ “tictac” en 12 pasos
                      filter: "drop-shadow(0 0 4px rgba(255,167,38,.35))",
                      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    }}
                  />
                }
                endIcon={
                  <Box className="arrow" sx={{ display: 'inline-flex', ml: .25, transition: 'transform .18s ease' }}>
                    <ChevronRightRoundedIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
                  </Box>
                }
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  letterSpacing: "2px",
                  fontFamily: "albert sans, sans-serif",
                  border: "1px solid #ffa726",
                  fontSize: { xs: "10px", sm: "1.1rem" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  width: { xs: "100%", sm: "500px" },
                  maxWidth: "500px",
                  height: "50px",
                  color: "#fff",
                  background: "linear-gradient(90deg,#ff9800,#f57c00)",
                  boxShadow: "0 6px 18px rgba(255,152,0,.35)",
                  backgroundSize: "200% 100%",
                  animation: "bgShift 6s linear infinite",
                  transition: "width .3s ease, box-shadow .2s ease, transform .12s ease",
                  "&:hover": {
                    width: { xs: "100%", sm: "500px" },
                    background: "linear-gradient(90deg,#ffa726,#fb8c00)",
                    boxShadow: "0 8px 22px rgba(255,152,0,.45)",
                    transform: "translateY(-1px)",
                  },
                  "&:hover .arrow": { transform: "translateX(4px)" },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 4px 14px rgba(255,152,0,.35)",
                  },
                  "&:focus-visible": {
                    outline: "3px solid rgba(255,167,38,.6)",
                    outlineOffset: "2px",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,.14) 50%, transparent 100%)",
                    transform: "translateX(-100%)",
                    animation: "sheen 2.8s ease-in-out infinite",
                  },
                  "@keyframes clock": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                  "@keyframes sheen": {
                    "0%": { transform: "translateX(-120%)" },
                    "100%": { transform: "translateX(120%)" },
                  },
                  "@keyframes bgShift": {
                    "0%": { backgroundPosition: "0% 0%" },
                    "100%": { backgroundPosition: "200% 0%" },
                  },
                }}
              >
                {/* Texto con números destacados y más compacto */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "baseline",
                    gap: 0.28,
                    whiteSpace: "nowrap",
                    letterSpacing: 0, // anula el tracking del botón
                    // normaliza tipografía para ambos
                    "--fz": { xs: "12.5px", sm: "14.5px" },
                    "& .piece": {
                      fontFamily: "albert sans, sans-serif",
                      fontSize: "var(--fz)",
                      fontWeight: 700,
                      lineHeight: 1,
                      // fuerza números “alineados” y proporcionales para que no desentonen
                      fontVariantNumeric: "lining-nums proportional-nums",
                      fontFeatureSettings: '"lnum" 1, "pnum" 1',
                    },
                    "& .num": {
                      fontWeight: 800,          // sutilmente más pesado (misma familia/tamaño)
                      marginRight: "0.15ch",    // pega número con texto sin abrir huecos raros
                      textShadow: "0 0 4px rgba(255,167,38,.25)", // énfasis sin cambiar formato
                    },
                    "& .sep": { mx: 0.2, opacity: 0.8 },

                  }}
                >
                  <span className="piece num">{enDesarrollo}</span>
                  <span className="piece">
                    {enDesarrollo === 1 ? "Sitio web en desarrollo, " : "Sitios web en desarrollo, "}
                  </span>

                  <span className="piece num">{enCola}</span>
                  <span className="piece">
                    {enCola === 1 ? "Sistema en cola" : "Sistemas en cola"}
                  </span>
                </Box>

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
        </Box>
        <Box ref={ref}>
          <Grid container spacing={2}>
            {features.map((feature, index) => (
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
                        className="card-media"
                        component="img"
                        image={feature.image}
                        alt={feature.title}
                        sx={{
                          height: isMobile ? 205 : 250,
                          transition: "transform 1s",
                        }}
                      />
                      <Overlay className="overlay">
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            marginTop: isMobile ? "20px" : "30px",
                            mb: 1,
                            textAlign: "left",
                            width: "100%",
                            marginLeft: "9px",
                            fontSize: isMobile ? "1.15rem" : "1.4rem",
                          }}
                        >
                          {feature.title}
                        </Typography>

                        <AdditionalContent className="additional">
                          <Typography
                            variant="body2"
                            sx={{ mb: 1, px: 1, fontSize: "1rem" }}
                          >
                            {feature.desc}
                          </Typography>

                          {/* ✅ Botón personalizado, fuera del <button> de CardActionArea */}
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
            ))}
          </Grid>
        </Box>
        <DialogTrabajos
          open={openTrabajos}
          onClose={handleCloseTrabajos}
          trabajos={trabajos}
          primaryLabel="Ver servicios"
          onPrimaryClick={() => { handleCloseTrabajos(); navigate("/servicios"); }}
        />
      </Container >
    </Box >
  );
}

export default Features;
