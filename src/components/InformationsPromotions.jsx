import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';

import 'swiper/css';

const InformationsPromotions = ({
  isMobile,
  promotions,
  swiperRef,
  showArrow,
  swiperInstance,
  setSwiperInstance,
  setShowArrow,
  handleContactClick,
  showPopularBadge,
  modoDesarrollo = false,
}) => {

  const [showOriginalPriceId1, setShowOriginalPriceId1] = useState(true);


  useEffect(() => {
    if (showPopularBadge) {
      const timer = setTimeout(() => {
        setShowOriginalPriceId1(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopularBadge]);

  // TRANSBANK
  const handleReservar = async () => {
    try {
      const endpoint =
        window.location.hostname === "localhost"
          ? "http://localhost:8888/.netlify/functions/crearTransaccion"
          : "/.netlify/functions/crearTransaccion";

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 30000, // 💰 ahora 30.000 CLP
          buyOrder: "ReservaSitioWeb-001", // 👈 tu identificador único
          sessionId: "Reserva Sitio Web - Plataformas-web.cl", // 👈 descripción
          returnUrl:
            window.location.hostname === "localhost"
              ? "https://c4d2e41af764.ngrok-free.app/resultado"
              : "https://plataformas-web.cl/resultado",
        }),
      });

      const data = await resp.json();
      console.log("Respuesta crearTransaccion:", data);

      if (data.url && data.token) {
        window.location.href = `${data.url}?token_ws=${data.token}`;
      }
    } catch (err) {
      console.error("Error en handleReservar:", err);
    }
  };



  return (
    <Box
      ref={swiperRef}
      sx={{
        display: "block",
        position: "relative",
        px: 1,
        pt: 2,
        pb: 1,
        overflow: "hidden",
      }}
    >
      <Swiper
        style={{ overflow: "visible" }}
        spaceBetween={isMobile ? 12 : 20}
        slidesPerView="auto"
        onSwiper={setSwiperInstance}
        initialSlide={promotions.length - 1}
        centeredSlides={false}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setShowArrow(swiper.activeIndex !== 2)}
      >
        {promotions.map((promo, index) => (
          <SwiperSlide
            key={index}
            style={{ width: isMobile ? '345px' : '430px' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >

              {promo.id === 1 && (
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
                    minWidth: "110px",
                    textAlign: "center",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 0 12px 2px rgba(255, 105, 0, 0.6)", // Naranja brillante
                    border: "2px solid #ff6a00",
                  }}
                >
                  Popular
                </motion.div>
              )}


              <Box
                sx={{
                  width: isMobile ? "350px" : "430px", // Igual que el slide principal
                  height: "400px",
                  py: isMobile ? 0 : 0,
                  mt: 1.4,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  position: "relative",
                  bgcolor: "#111827", // Puedes personalizar si quieres otro fondo
                  zIndex: 2,
                }}
              >

                <Box sx={{
                  position: "absolute", inset: 0, backgroundImage: `url(${promo.image})`,
                  backgroundSize: "cover", backgroundPosition: "center%",
                  "&::after": { content: '""', position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.55)" }, zIndex: 0
                }} />

                <Box sx={{
                  position: "relative", zIndex: 2, p: 2, pt: 3, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "flex-start", flexGrow: 1
                }}>
                  <Box
                    sx={{
                      width: isMobile ? "100%" : "80%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    {/* Título */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: "1.2rem", md: "1.35rem" },
                        textAlign: "left",
                        color: promo.textColor || "#fff",
                        letterSpacing: "1.1px",
                        mb: 0,
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      {promo.title}
                    </Typography>

                    {/* Descripción */}
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "left",
                        fontSize: { xs: "0.85rem", md: "0.8rem" },
                        lineHeight: 1.6,
                        color: promo.id === 1 ? "rgb(243, 210, 98)" : "#eee", // 👈 amarillo dorado si es promo.id=1
                        fontFamily: "'Roboto', sans-serif",
                        opacity: 0.95,
                        fontWeight: promo.id === 1 ? 700 : 400, // 👈 más peso en la fuente
                        letterSpacing: promo.id === 1 ? "0.5px" : "normal",
                      }}
                    >
                      {promo.id === 1 ? (
                        <>
                          <Box
                            component="span"
                            sx={{
                              fontWeight: "bold",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "2px",
                              color: "rgb(243, 210, 98)",
                            }}
                          >
                            Entrega en menos de 72 horas
                            {/* Reloj */}
                            <AccessTimeFilledRoundedIcon
                              sx={{
                                fontSize: { xs: 15, sm: 18 },
                                position: "relative",
                                top: { xs: "1px", sm: "-1px" }, // 👈 lo sube en desktop
                                animation: "clock 12s steps(12) infinite",
                                transformOrigin: "50% 50%",
                                filter: "drop-shadow(0 0 4px rgba(255,167,38,.35))",
                                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                                "@keyframes clock": {
                                  "0%": { transform: "rotate(0deg)" },
                                  "100%": { transform: "rotate(360deg)" },
                                },
                              }}
                            />
                          </Box>


                        </>
                      ) : (
                        promo.description
                      )}
                    </Typography>

                  </Box>



                  <Box sx={{
                    width: isMobile ? "100%" : "80%", mt: 0,
                    display: "flex", flexDirection: "column", alignItems: "flex-start"
                  }}>
                    {promo.descriptors.map((desc, idx) => (
                      <Typography key={idx} variant="caption" sx={{
                        display: "flex", alignItems: "center", mb: 0.3,
                        fontSize: "0.8rem", color: "#eee"
                      }}>
                        {desc}
                      </Typography>
                    ))}
                  </Box>


                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  >
                    <Box
                      sx={{
                        mt: isMobile ? 2.2 : 3,
                        mb: 0,
                        background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                        borderRadius: "12px",
                        px: 2,
                        py: isMobile ? 0.8 : 0.8,
                        display: "flex",
                        justifyContent: "center", // 👈 centrado en ambos casos
                        alignItems: "center",
                        width: "310px",
                        mx: "auto",
                        color: "white",
                        boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                        position: "relative",
                        zIndex: 3,
                        boxSizing: "border-box",
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {promo.id === 1 ? (
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Mukta', sans-serif",
                            fontWeight: 300,
                            fontSize: isMobile ? "1rem" : "1rem", // 👈 más grande
                            textTransform: "none",
                            lineHeight: 1.3,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          Precio desarrollo:
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              fontSize: isMobile ? "1rem" : "1rem", // 👈 más grande
                              fontWeight: 800,
                              background: "linear-gradient(90deg, #FFD700, #FFA500)", // 👈 degradado dorado
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              textShadow: "0 2px 6px rgba(0,0,0,0.4)", // 👈 sombra para resaltar
                              ml: 0.2
                            }}
                          >
                            {promo.price}
                          </Box>
                          <br />
                          <Box component="span" sx={{ fontWeight: 600, fontSize: "0.8rem", opacity: 0.9 }}>
                            2 cuotas (💳 $30.000 inicio • $60.000 final)
                          </Box>
                        </Typography>

                      ) : (
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Mukta', sans-serif",
                            fontWeight: 700,
                            fontSize: isMobile ? "14px" : "15px",
                            textTransform: "none",
                            lineHeight: 1.3,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          El valor será determinado por el negocio.
                          <br />
                          <Box
                            component="span"
                            sx={{ color: "rgb(243, 210, 98)", fontWeight: "bold" }}
                          >
                            (Valor Estimado: {promo.price})
                          </Box>
                        </Typography>
                      )}


                    </Box>

                  </motion.div>

                  <Box
                    sx={{
                      maxWidth: "100%",
                      mx: "auto",       // 👈 centrado
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,           // 👈 espacio entre precios y botón
                    }}
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >

                      <Box
                        sx={{
                          mt: isMobile ? 1.2 : 1,
                          mb: 0,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 0.5 : 0.3,
                          display: "flex",
                          flex: 1,
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "310px",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          zIndex: 3,
                          mx: "auto",
                          alignSelf: "center",
                          boxSizing: "border-box"

                        }}
                      >
                        {/* DOMINIO .CL */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.74rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              ELIGE TU DOMINIO .CL
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[0]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            ANUAL
                          </Typography>
                        </Box>


                        {/* Separador */}
                        <Box
                          sx={{
                            width: "1px",
                            height: isMobile ? "45px" : "55px", // 👈 también más compacto
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            mx: 1.5,
                          }}
                        />

                        {/* HOSTING */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.74rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              SUSCRIPCIÓN + SOPORTE
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[1]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            MENSUAL
                          </Typography>
                        </Box>

                      </Box>
                    </motion.div>

                    {modoDesarrollo ? (
                      // 🔹 Botón RESERVAR con logo Transbank
                      <Box
                        component="button"
                        onClick={handleReservar}
                        sx={{
                          all: "unset",
                          boxSizing: "border-box",
                          background: "linear-gradient(90deg, #6A1B9A, #8E24AA)", // 💜 morado degradado
                          color: "white",
                          border: "2px solid #4A148C",
                          borderRadius: "8px",
                          width: "310px",
                          py: 0.5, // 👈 menos altura
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          mt: 0.3,
                          "&:hover": {
                            background: "linear-gradient(90deg, #7B1FA2, #9C27B0)",
                            transform: "translateY(-1px) scale(1.02)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                            borderColor: "#7B1FA2",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src="/logo-webpay.png"
                          alt="Transbank Logo"
                          sx={{
                            width: 60,
                            height: "auto",
                            userSelect: "none",
                          }}
                        />
                        <span>Reservar</span>
                      </Box>


                    ) : (
                      // 🔹 Botón SOLICITAR COTIZACIÓN
                      <Box
                        component="button"
                        onClick={() => handleContactClick(promo.title)}
                        sx={{
                          all: "unset",
                          boxSizing: "border-box",
                          background: "linear-gradient(90deg, #FF9800, #F57C00)",
                          color: "white",
                          border: "2px solid #E65100",
                          borderRadius: "8px",
                          width: "310px",
                          py: 0.7,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          textTransform: "uppercase",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          mt: 0.3,
                          "&:hover": {
                            background: "linear-gradient(90deg, #FFA726, #FB8C00)",
                            transform: "translateY(-1px) scale(1.02)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                            borderColor: "#FB8C00",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src="/clic.jpg"
                          alt="Ícono de clic"
                          sx={{
                            width: 20,
                            height: 20,
                            userSelect: "none",
                            filter: "invert(1) brightness(2)",
                          }}
                        />
                        Solicitar Cotización
                      </Box>
                    )}


                  </Box>
                </Box>
              </Box>
            </Box>

          </SwiperSlide >
        ))}
      </Swiper >

      {
        showArrow && swiperInstance && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: -4, right: 10, zIndex: 10 }}
          >
            <IconButton
              onClick={() => swiperInstance.slideNext()}
              sx={{
                color: "white",
                transition: "opacity 0.3s ease-in-out",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <ArrowForwardIcon fontSize="large" sx={{ fontSize: "23px" }} />
            </IconButton>
          </motion.div>
        )
      }
    </Box >
  );
};

export default InformationsPromotions;
