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
import "./css/Features.css"; // Importamos el CSSi

// DATOS
const features = [
  { id: 1, title: "Plataformas web", desc: "Diseñamos sitios web modernos, rápidos y adaptables para impulsar tus emprendimientos.", image: "servicio3.webp" },
  { id: 2, title: "Soporte Evolutivo de Sistemas", desc: "Soporte evolutivo y mantenimiento de sistemas, brindamos soporte TI para el mantenimiento de tus sistemas.", image: "servicio2.jpg" },
  { id: 3, title: "Desarrollo de Sistemas a Medida", desc: "Desarrollo de sistemas a medida, creamos software y sitios web personalizados para tu negocio.", image: "servicio1.jpg" }
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
        overflowY: 'visible'
      }}
    >
      <Container sx={{ py: 0, maxWidth: "1500px !important", overflow: 'hidden' }}>
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
                    gap: { xs: 0.5, sm: 1 },
                    overflow: "hidden",
                    fontSize: { xs: "0.7rem", sm: "0.9rem" },
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
          trabajos={trabajosActivos}
          primaryLabel="Ver servicios"
          onPrimaryClick={() => { handleCloseTrabajos(); navigate("/servicios"); }}
        />
      </Container >
    </Box >
  );
}

export default Features;
