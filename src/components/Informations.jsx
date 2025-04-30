import { Box, Typography, Container, Grid, Button, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInView } from 'react-intersection-observer';
import Public from '@mui/icons-material/Public';
import GroupAdd from '@mui/icons-material/GroupAdd';
import Verified from '@mui/icons-material/Verified'
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import { useOutletContext } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./css/Informations.css";
import "swiper/css";

const promotions = [
  {
    title: "Sitios web",
    description: "Diseño y desarrollo de sitios web modernos.",
    image: "/Informations-1.jpg",
    price: "$99.990",
    extraPrices: [
      { label: "Dominio anual", price: "$10.000" },
      { label: "Hosting mensual", price: "$10.000" }
    ],
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))",
    textColor: "white",
    descriptors: [
      "Diseño o renovación completa de tu sitio web.",
      "Incluye dominio .cl personalizado.",
      "Gestión y mantenimiento técnico permanente.",
      "Garantía de calidad, seguridad y soporte técnico."
    ]
  },
  {
    title: "Tienda online",
    description: "Vende tus productos online de forma segura.",
    image: "/Informations-2.jpg",
    price: null,
    extraPrices: [
      { label: "Dominio anual", price: "-" },
      { label: "Hosting mensual", price: "-" }
    ],
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))",
    textColor: "white",
    descriptors: [
      "eCommerce con diseño profesional.",
      "Carrito de compras y gestión de stock.",
      "Panel de administración para seguimiento de pedidos.",
      "Integración con WebPay u otros métodos de pago."
    ]
  },
  {
    title: "Sistemas a la medida",
    description: "Desarrollo de sistemas adaptados a tu negocio.",
    image: "/Informations-3.jpg",
    price: null,
    extraPrices: [
      { label: "Dominio anual", price: "-" },
      { label: "Hosting mensual", price: "-" }
    ],
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))",
    textColor: "white",
    descriptors: [
      "Desarrollo de sistemas web o apps personalizadas.",
      "Panel de administración y base de datos incluida.",
      "Adaptación total a tus procesos y necesidades.",
      "Soporte técnico y mantenimiento continuo."
    ]
  }
];

function Informations({ informationsRef, triggerInformations, setHasSeenInformations }) {

  // Controla la vista del componente
  const [isGrabbing, setIsGrabbing] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: false, });

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showArrow, setShowArrow] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [showPopularBadge, setShowPopularBadge] = useState(false);

  const { ref: swiperRef, inView: swiperInView } = useInView({ threshold: 0.2, triggerOnce: true, });

  //CANCELAR PRIMERA ANIMACIÓN
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasAnimated2, setHasAnimated2] = useState(false);

  useEffect(() => {
    if (inView) {
      setShouldAnimate(true); // 🔹 Activa la animación cuando el componente es visible
    }
  }, [inView]);

  //ANIMACIÓN DESCRIPTORES
  useEffect(() => {
    if (swiperInView && swiperInstance && !hasAnimated) {
      swiperInstance.slideTo(0, 1500); // mueve del último al primero
      setHasAnimated(true);
    }
  }, [swiperInView, swiperInstance, hasAnimated]);

  useEffect(() => {
    if (hasAnimated) {
      const timeout = setTimeout(() => {
        setShowPopularBadge(true);
      }, 2000); // Delay de 3 segundos después que el swiper terminó su animación
      return () => clearTimeout(timeout);
    }
  }, [hasAnimated]);


  //EVITAR ANIMACIÓN DUPLICADA
  useEffect(() => {
    if (inView && !hasAnimated2) {
      const timer = setTimeout(() => {
        setHasAnimated2(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [inView, hasAnimated2]);

  const handleContactClick = (title) => {
    const mensaje = `¡Hola! Me interesó la promoción de ${encodeURIComponent(title)} ¿Me comentas?`;
    window.open(`https://api.whatsapp.com/send?phone=56992914526&text=${mensaje}`, "_blank");
  };
  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 10,
        backgroundImage: 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        py: isMobile ? 8 : 3,
        pt: 5,
        marginTop: "0",
        marginBottom: "-10px",
        color: "white",
        overflow: 'hidden',
        borderBottomLeftRadius: isMobile ? '90px' : '120px',
        borderBottomRightRadius: isMobile ? '90px' : '120px',
      }}
    >

      <Container sx={{ textAlign: "center", color: "white", maxWidth: "1400px !important", paddingLeft: isMobile ? "0" : "24px", paddingRight: isMobile ? "0" : "24px" }}>

        <Box sx={{ position: "relative", textAlign: "center", mb: 2 }} ref={ref}>

          <Box
            sx={{
              width: 25,
              height: 25,
              borderRadius: "50%",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
              mx: "auto",
              mb: 0.5,
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={inView || hasAnimated2 ? { rotate: 360 } : {}} // 🔹 Solo se activa cuando `shouldAnimate` es `true`
              transition={{
                duration: 0.3,
                delay: 0.3,
                repeat: 1, // Se repite una vez más (total: dos veces)
                ease: "linear", // Movimiento fluido
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <FaCode size={17} color="black" />
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 80 }} // ⬇️ Aparece más abajo
            animate={inView || hasAnimated2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
                fontSize: { xs: "1.5rem", md: "2rem" },
                paddingLeft: { xs: "100px", md: "30px" },
                paddingRight: { xs: "100px", md: "30px" },
                letterSpacing: "3px",
                my: 0,
                display: "inline-block",
                position: "relative",
                zIndex: 1,
                backgroundColor: "transparent",
                color: "white",
                "::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "-5px",
                  height: "10px",
                  backgroundColor: "transparent",
                  zIndex: 2,
                },
              }}
            >
              Impulsa tu negocio con tecnología
            </Typography>
          </motion.div>


          {/* Línea debajo del título con animación (con retraso de 2 segundos) */}
          <motion.hr
            initial={{ opacity: 0 }} // Comienza invisible
            animate={inView || hasAnimated2 ? { opacity: 1 } : {}} // Aparece completamente
            transition={{ duration: 0.8, delay: 1 }} // Aparece después de 1s y dura 1s
            style={{
              position: "absolute",
              top: isMobile ? "calc(80% - 30px)" : "calc(100% - 30px)", // Ajusta la posición
              left: "5%",
              width: "90%", // Mantiene su tamaño desde el inicio
              border: "1px solid white",
              zIndex: 0,
              background: "white",
              clipPath: "polygon(0% 0%, 0% 0%, 19% 100%, 0% 100%, 0% 0%, 100% 0%, 80% 100%, 100% 100%, 100% 0%)",
            }}
          />

        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>

          {/* Columna de los íconos */}
          <Grid item xs={12} md={6}>
            {[
              {
                icon: <Public sx={{ color: "white", fontSize: "2.2rem" }} />,
                text: "Muestra tu negocio al mundo.",
                desc: "Haz visible tu marca con presencia digital moderna y profesional.",
                hideLine: false,
              },
              {
                icon: <GroupAdd sx={{ color: "white", fontSize: "2.2rem" }} />,
                text: "Atrae más clientes potenciales.",
                desc: "Conecta con clientes ideales mediante estrategias digitales inteligentes.",
                hideLine: false,
              },
              {
                icon: <Verified sx={{ color: "white", fontSize: "2.2rem" }} />,
                text: "Gana la confianza de tus clientes.",
                desc: "Refleja confianza mostrando tu negocio de forma clara y profesional.",
                hideLine: false,
              },
              {
                icon: <DashboardCustomize sx={{ color: "white", fontSize: "2.2rem" }} />,
                text: "Administra y potencia tu negocio.",
                desc: "Toma decisiones con herramientas de monitoreo y gestión digital.",
                hideLine: true,
              },
            ].map((item, index) => {
              const { ref: itemRef, inView: itemInView } = useInView({
                threshold: 0.43,
                triggerOnce: true,
              });

              return (
                <motion.div
                  key={`animated-${index}-${animationKey}`} // 👈 clave dinámica
                  ref={itemRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={itemInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    delay: 0.2 * index,
                    duration: 0.5,
                  }}
                >
                  <ListItem
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      zIndex: 2,
                      paddingLeft: isMobile ? "0" : "16px",
                      paddingRight: isMobile ? "0" : "16px",
                    }}
                  >
                    <ListItemIcon sx={{ zIndex: 2 }}>
                      <Box
                        sx={{
                          position: "relative",
                          width: 100,
                          height: 85,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {!item.hideLine && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={itemInView ? { height: 40 } : { height: 0 }}
                            transition={{
                              delay: 0.2 * index,
                              duration: 1,
                              ease: "easeInOut",
                            }}
                            style={{
                              position: "absolute",
                              top: "80%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "2px",
                              backgroundImage:
                                "linear-gradient(white 40%, rgba(255,255,255,0) 0%)",
                              backgroundPosition: "left",
                              backgroundSize: "2px 6px",
                              backgroundRepeat: "repeat-y",
                              zIndex: 1,
                            }}
                          />
                        )}

                        <Box
                          sx={{
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            border: "2px solid white",
                            backgroundColor: "#072138",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 2,
                          }}
                        >
                          {item.icon}
                          <motion.div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              zIndex: 1,
                              animation: "pulsacion 1s ease-in-out 0.1s infinite",
                            }}
                          />
                        </Box>
                      </Box>
                    </ListItemIcon>

                    <ListItemText
                      sx={{
                        fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
                        "& .MuiListItemText-primary": {
                          fontSize: isMobile ? "0.99rem" : "1.2rem",
                        },
                        "& .MuiListItemText-secondary": {
                          color: "white",
                        },
                      }}
                      primary={item.text}
                      secondary={item.desc}
                    />
                  </ListItem>
                </motion.div>
              );
            })}
          </Grid>


          <Grid item xs={12} md={6}>
            <Box ref={swiperRef} sx={{ display: isMobile ? "block" : "block", position: "relative", px: 1, pt: 2, pb: 1, overflow: "hidden" }}>
              <Swiper
                style={{ overflow: "visible" }}
                spaceBetween={isMobile ? 15 : 18}
                slidesPerView={isMobile ? 1.07 : 1.2}
                onSwiper={setSwiperInstance}
                initialSlide={promotions.length - 1}
                centeredSlides={false}
                pagination={{ clickable: true }}
                onSlideChange={(swiper) => setShowArrow(swiper.activeIndex !== 2)}
              >
                {promotions.map((promo, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        cursor: 'grab',
                        '&:active': {
                          cursor: 'grabbing'
                        },
                        height: "400px",
                        position: "relative",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start"
                      }}
                    >

                      {promo.title === "Sitios web" && (
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={showPopularBadge ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          style={{
                            position: "absolute",
                            top: "-16px",
                            left: 8,
                            background: "linear-gradient(#f14c2e, #d8452e)",
                            color: "white",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            padding: "6px 16px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            height: "35px",
                            minWidth: "120px",
                            textAlign: "center",
                            zIndex: 1
                          }}
                        >
                          Popular
                        </motion.div>
                      )}


                      <Box sx={{
                        width: "100%", height: "435px", mt: 1.4, display: "flex",
                        flexDirection: "column", borderRadius: "16px", overflow: "hidden",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.2)", position: "relative",
                        bgcolor: "white", zIndex: 2
                      }}>
                        <Box sx={{
                          position: "absolute", inset: 0, backgroundImage: `url(${promo.image})`,
                          backgroundSize: "cover", backgroundPosition: "center",
                          "&::after": { content: '""', position: "absolute", inset: 0, background: promo.bgColor || "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.3))" }, zIndex: 0
                        }} />

                        <Box sx={{
                          position: "relative", zIndex: 2, p: 2, pt: 3, display: "flex",
                          flexDirection: "column", alignItems: "center", justifyContent: "flex-start", flexGrow: 1
                        }}>
                          <Box sx={{ width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "left", color: promo.textColor || "white", mb: 1 }}>{promo.title}</Typography>
                            <Typography variant="body2" sx={{ textAlign: "left", fontSize: "0.9rem", color: "#ddd" }}>{promo.description}</Typography>
                          </Box>

                          <Box sx={{ backgroundColor: "#edf4ff", borderRadius: "12px", py: promo.price ? 1.3 : 1.5, px: 3, mb: 0.5, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "90px" }}>
                            {promo.price ? (
                              <>
                                <Typography variant="caption" sx={{ color: "gray", fontSize: "0.7rem", mb: 0.2 }}>
                                  Precio desarrollo
                                </Typography>

                                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", minHeight: "2.5rem" }}>
                                  <AnimatePresence mode="wait">
                                    {!showPopularBadge ? (
                                      <motion.div key="old" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.6 }} style={{ display: "flex", alignItems: "baseline" }}>
                                        <Typography variant="h4" sx={{ fontWeight: "bold", color: "gray", fontSize: "2rem", textDecoration: "line-through", mr: 0.2 }}>
                                          $140.000
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: "0.9rem", color: "gray" }}>/CLP</Typography>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="new"
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.6 }}
                                        style={{ display: "flex", alignItems: "baseline" }}
                                      >
                                        <Typography
                                          variant="h4"
                                          sx={{
                                            fontWeight: "bold",
                                            color: "black",
                                            fontSize: "2rem",
                                            mr: 0.2
                                          }}
                                        >
                                          {promo.price}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          sx={{ fontSize: "0.9rem", color: "black" }}
                                        >/CLP</Typography>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </Box>

                                <Box
                                  component="button"
                                  onClick={() => handleContactClick(promo.title)}
                                  sx={{
                                    backgroundColor: "#007de0",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    width: "80%",
                                    py: 1,
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s",
                                    mt: 0.5,
                                    "&:hover": { backgroundColor: "#005bb5" }
                                  }}
                                >
                                  Cotizar
                                </Box>
                              </>
                            ) : (
                              <>
                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "black", fontSize: "1.5rem", mt: 2 }}>
                                  Por definir
                                </Typography>
                                <Box component="button" sx={{
                                  backgroundColor: "#007de0",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "8px",
                                  width: "80%",
                                  py: 1,
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                  cursor: "pointer",
                                  transition: "background-color 0.3s",
                                  mt: 1.7,
                                  "&:hover": { backgroundColor: "#005bb5" }
                                }}>
                                  Cotizar
                                </Box>
                              </>
                            )}
                          </Box>


                          <Box sx={{
                            width: isMobile ? "100%" : "80%", mt: 0.5,
                            display: "flex", flexDirection: "column", alignItems: "flex-start"
                          }}>
                            {promo.descriptors.map((desc, idx) => (
                              <Typography key={idx} variant="caption" sx={{
                                display: "flex", alignItems: "center", mb: 0.3,
                                fontSize: "0.8rem", color: "#eee"
                              }}>
                                <Box sx={{
                                  width: 15, height: 15, bgcolor: "white", borderRadius: "50%",
                                  display: "flex", alignItems: "center", justifyContent: "center", mr: 0, flexShrink: 0
                                }}>
                                  <CheckIcon sx={{ fontSize: 13, color: "black" }} />
                                </Box>&nbsp;{desc}
                              </Typography>
                            ))}
                          </Box>

                          <Box sx={{
                            width: "80%", mt: 0.4, display: "flex",
                            justifyContent: "space-between", gap: 2
                          }}>
                            {promo.extraPrices?.map(({ label, price }, idx) => (
                              <Box key={idx} sx={{
                                flex: 1,
                                border: "1px solid white",
                                borderRadius: "8px",
                                p: 1,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                position: "relative"
                              }}>
                                <Box sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 5,
                                  fontSize: "0.49rem",
                                  color: "#aaa",
                                  fontWeight: 300,
                                  lineHeight: 1,
                                }}>
                                  Requerido
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
                                  <Typography
                                    variant="h5"
                                    sx={{
                                      fontWeight: "bold",
                                      color: "white",
                                      fontSize: "1.4rem",
                                      lineHeight: 1.2,
                                      mt: 1 // 🔽 Mueve el número más abajo
                                    }}
                                  >
                                    {price || "-"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#ddd",
                                      fontSize: "0.68rem",
                                      lineHeight: 1.2
                                    }}
                                  >
                                    {label}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>

                        </Box>
                      </Box>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>

              {showArrow && (
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ position: "absolute", top: -4, right: 10, zIndex: 10 }}
                >
                  <IconButton sx={{
                    color: "white", transition: "opacity 0.3s ease-in-out",
                    backgroundColor: "transparent", boxShadow: "none", padding: 0,
                    "&:hover": { backgroundColor: "transparent" }
                  }}>
                    <ArrowForwardIcon fontSize="large" sx={{ fontSize: "23px" }} />
                  </IconButton>
                </motion.div>
              )}
            </Box>
          </Grid>



        </Grid>



      </Container>
    </Box>
  );
};

export default Informations;
