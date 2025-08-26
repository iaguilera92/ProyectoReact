import { Box, Typography, Container, Grid, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';
import Public from '@mui/icons-material/Public';
import GroupAdd from '@mui/icons-material/GroupAdd';
import Verified from '@mui/icons-material/Verified'
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import "./css/Informations.css";
import "swiper/css";
import InformationsPromotions from './InformationsPromotions';

const promotions = [
  {
    id: 1,
    title: "CREAMOS",
    title2: "TU SITIO WEB",
    description: "Lo que tu emprendimiento necesita.",
    image: "/promocion-1.webp",
    price: "$99.000",
    extraPrices: [
      { label: "ELIGE TU DOMINIO .CL", price: "$10.000" },
      { label: "HOSTING + SOPORTE", price: "$10.000" }
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
    id: 2,
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
      "Panel de administración para seguimiento.",
      "Integración con WebPay y más métodos de pago."
    ]
  },
  {
    id: 3,
    title: "Sistemas a la medida",
    description: "Desarrollo adaptados para tu negocio.",
    image: "/Informations-3.jpg",
    price: null,
    extraPrices: [
      { label: "Dominio anual", price: "-" },
      { label: "Hosting mensual", price: "-" }
    ],
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))",
    textColor: "white",
    descriptors: [
      "Desarrollo de sistemas web o apps.",
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
      }, 1000); // Delay
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
    let mensaje = '';
    if (title == "CREAMOS") {
      mensaje = `¡Hola! Me interesaría una DEMO para mi negocio. ¿Me comentas?`;
    }
    else {
      mensaje = `¡Hola! Me interesó la promoción de ${encodeURIComponent(title)} ¿Me comentas?`;
    }
    window.open(`https://api.whatsapp.com/send?phone=56946873014&text=${mensaje}`, "_blank");
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


          {/* Informations Promotions */}
          <Grid item xs={12} md={6}>
            <InformationsPromotions
              isMobile={isMobile}
              promotions={promotions}
              swiperRef={swiperRef}
              showArrow={showArrow}
              swiperInstance={swiperInstance}
              setSwiperInstance={setSwiperInstance}
              setShowArrow={setShowArrow}
              handleContactClick={handleContactClick}
              showPopularBadge={showPopularBadge}
            />
          </Grid>


        </Grid>



      </Container>
    </Box >
  );
};

export default Informations;
