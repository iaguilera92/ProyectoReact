import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import DialogTransbankCorreo from "./DialogTransbankCorreo";
import 'swiper/css';
import emailjs from "@emailjs/browser";

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
  modoDesarrollo = true,
}) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [showOriginalPriceId1, setShowOriginalPriceId1] = useState(true);
  const [currency, setCurrency] = useState("CLP");
  const VISITA_PRECIOS_KEY = "visita_pago_unico_notificada";
  const visitaPreciosEnviadaRef = React.useRef(false);

  const toggleCurrency = () => {
    setCurrency(prev => (prev === "CLP" ? "USD" : "CLP"));
  };

  useEffect(() => {
    if (showPopularBadge) {
      const timer = setTimeout(() => {
        setShowOriginalPriceId1(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopularBadge]);

  const handleReservar = async (email) => {
    try {
      // Detectar entorno por hostname
      const isLocal = window.location.hostname === "localhost";

      const endpoint = isLocal
        ? "http://localhost:8888/.netlify/functions/crearTransaccion" // sandbox local
        : "/.netlify/functions/crearTransaccion"; // producción

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 30000,
          buyOrder: "RSW-" + Date.now().toString().slice(-10),
          sessionId: "SES-" + Date.now(),
          returnUrl: isLocal
            ? "http://localhost:5173/reserva"
            : "https://plataformas-web.cl/reserva",
          email, // 👈 correo capturado
        }),
      });

      const data = await resp.json();
      console.log("Respuesta crearTransaccion:", data);

      if (data.url && data.token) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "token_ws";
        input.value = data.token;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error("Error en handleReservar:", err);
    }
  };


  //Visa TEST
  //Número: 4051885600446623
  //Fecha de vencimiento: 12/12
  //CVV: 123
  //Rut: 11.111.111-1
  //Clave: 123

  const pricingBoxBase = {
    mt: isMobile ? 1.2 : 1,
    mb: 0,
    borderRadius: "12px",
    px: 2,
    py: isMobile ? 0.5 : 0.3,
    display: "flex",
    alignItems: "center",
    width: "310px",
    minHeight: isMobile ? "78px" : "70px", // 🔥 ALTO ÚNICO COMPARTIDO
    position: "relative",
    overflow: "hidden",
    zIndex: 3,
    mx: "auto",
    alignSelf: "center",
    boxSizing: "border-box",
    transition: "all 0.4s ease-in-out",
  };

  const notificarVisitaPrecios = () => {
    console.group("📩 EmailJS – Notificación Precios");

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
      .replace(/^./, (c) => c.toUpperCase()) // Capitaliza el día
      .replace(",", " ·") + " hrs";

    const templateParams = {
      evento: "Nuestros Precios",
      fechaHora: fechaHoraFormateada,
      dispositivo: window.innerWidth < 768 ? "MOBILE 📱" : "DESKTOP 🖥️",
    };

    console.log("📦 Template params:", templateParams);

    emailjs
      .send(
        "service_73azdl9",   // Service ID
        "template_txa3qoq",  // Template ID
        templateParams,
        "TfLG1wfibewzR9Xpf"  // Public Key
      )
      .then((response) => {
        console.log("✅ EmailJS enviado correctamente", response);
      })
      .catch((error) => {
        console.error("❌ Error EmailJS", error);
      })
      .finally(() => {
        console.groupEnd();
      });
  };

  const evaluarVisitaPrecios = (swiper) => {
    const promo = promotions[swiper.activeIndex];

    //console.log("📊 Slide:", swiper.activeIndex, "| Promo ID:", promo?.id, "| Ref:", visitaPreciosEnviadaRef.current, "| Session:", sessionStorage.getItem(VISITA_PRECIOS_KEY));

    if (promo?.id === 2 && !visitaPreciosEnviadaRef.current && !sessionStorage.getItem(VISITA_PRECIOS_KEY)) {
      visitaPreciosEnviadaRef.current = true;

      setTimeout(() => {
        notificarVisitaPrecios();
        sessionStorage.setItem(VISITA_PRECIOS_KEY, "1");
      }, 500);
    }

    setShowArrow(swiper.activeIndex !== 2);
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
        onSlideChange={evaluarVisitaPrecios}

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

              {(promo.id === 1 || promo.id === 2) && (
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
                  Más vendido
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
                        display: "flex",          // 👈 flex para alinear imagen + texto
                        alignItems: "center",     // 👈 centrado vertical
                        gap: 0.5,                 // 👈 separación pequeña
                      }}
                    >
                      {promo.id === 1 && (
                        <Box
                          component="img"
                          src="/logo-sitio-web.webp"
                          alt="Logo sitio web"
                          sx={{
                            height: "1.1em",       // 👈 tamaño relativo al texto (como emoji)
                            width: "auto",
                            objectFit: "contain",
                            mt: "-2px",
                          }}
                        />
                      )}
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
                      {(promo.id === 1 || promo.id === 2) ? (
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
                          {promo.id === 1
                            ? "Entrega en menos de 72 horas"
                            : "Entrega en menos de 3 a 7 días"}
                          {/* Reloj */}
                          <AccessTimeFilledRoundedIcon
                            sx={{
                              fontSize: { xs: 15, sm: 18 },
                              position: "relative",
                              top: { xs: "-1px", sm: "-1px" },
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

                  {/* INICIO PRECIOS */}
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  >
                    {/* 🔹 Contenedor relativo para el botón + Box principal */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "310px",
                        mx: "auto",
                      }}
                    >
                      <Box
                        onClick={toggleCurrency}
                        sx={{
                          position: "absolute",
                          right: isMobile ? "0px" : "0px",
                          top: isMobile ? "-25px" : "-25px",
                          background:
                            currency === "USD"
                              ? "linear-gradient(90deg, #0E35A3 0%, #1E88E5 100%)" // 💙 Azul elegante USD
                              : "linear-gradient(90deg, #008B56 0%, #00C97C 100%)", // 💚 Verde elegante CLP
                          color: "rgba(255,255,255,0.95)",
                          fontSize: isMobile ? "0.53rem" : "0.58rem", // 📏 más proporcionado
                          fontFamily: "'Mukta', sans-serif",
                          fontWeight: 600,
                          borderRadius: "8px",
                          px: 0.6,
                          py: 0.2,
                          cursor: "pointer",
                          width: isMobile ? "70px" : "65px", // 📐 ancho fijo más natural
                          textAlign: "center",
                          justifyContent: "center",
                          boxShadow:
                            currency === "USD"
                              ? "0 1px 3px rgba(0, 100, 255, 0.25)"
                              : "0 1px 3px rgba(0, 180, 100, 0.25)",
                          transition: "all 0.25s ease-in-out",
                          display: "flex",
                          alignItems: "center",
                          gap: "1px",
                          opacity: 0.85,
                          backdropFilter: "blur(3px)",
                          letterSpacing: "0.2px", // ✨ mejora legibilidad en texto pequeño
                          "&:hover": {
                            opacity: 1,
                            transform: "scale(1.03)",
                            boxShadow:
                              currency === "USD"
                                ? "0 2px 5px rgba(0, 150, 255, 0.35)"
                                : "0 2px 5px rgba(0, 255, 150, 0.35)",
                          },
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.65rem",
                            opacity: 0.9,
                            transform: "translateY(1.0px)",
                          }}
                        >
                          {currency === "USD" ? "🪙" : "💵"}
                        </span>
                        <span style={{ transform: "translateY(1.0px)" }}>
                          {currency === "USD" ? "Ver en peso" : "Ver en dólar"}
                        </span>
                      </Box>




                      {/* 🟦 Box principal */}
                      <Box
                        onClick={toggleCurrency}
                        sx={{
                          mt: isMobile ? 2.2 : 3,
                          mb: 0,
                          background:
                            currency === "USD"
                              ? "linear-gradient(180deg, #00B871 0%, #007A48 100%)"
                              : "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "310px",
                          height: isMobile ? "48px" : "48px",
                          mx: "auto",
                          color: "white",
                          boxShadow:
                            currency === "USD"
                              ? "0 3px 12px rgba(0, 200, 100, 0.4)"
                              : "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          overflow: "hidden", // 👈 importante para contener el brillo dentro
                          zIndex: 3,
                          boxSizing: "border-box",
                          textAlign: "center",
                          flexShrink: 0,
                          cursor: "pointer",
                          transition: "all 0.4s ease",

                          /* ✨ BRILLO INTERNO — Sheen diagonal */
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
                            transform: "translateX(-120%)",
                            animation: "shineDiagonal 5s ease-in-out infinite",
                            borderRadius: "inherit",
                            pointerEvents: "none",
                            zIndex: 2,
                            mixBlendMode: "overlay", // 💡 brillo más realista
                          },

                          "@keyframes shineDiagonal": {
                            "0%": { transform: "translateX(-120%) rotate(0deg)" },
                            "50%": { transform: "translateX(120%) rotate(0deg)" },
                            "100%": { transform: "translateX(120%) rotate(0deg)" },
                          },
                        }}
                      >
                        {/* 👇 Aquí todo tu contenido interno (precios, motion.span, etc.) */}
                        {promo.id === 2 ? (
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: isMobile ? "1rem" : "1rem",
                              textTransform: "none",
                              lineHeight: 1.3,
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                ml: 4,
                              }}
                            >
                              Precio desarrollo:
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block",
                                  position: "relative",
                                  marginLeft: "0.2rem",
                                  minWidth: "95px",
                                  height: "1.2rem",
                                }}
                              >
                                <AnimatePresence mode="wait">
                                  {showOriginalPriceId1 ? (
                                    <motion.span
                                      key="precio-original"
                                      initial={{ opacity: 1, x: 0 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 50 }}
                                      transition={{ duration: 0.5 }}
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        fontSize: isMobile ? "1rem" : "1rem",
                                        fontWeight: 700,
                                        color: "#ccc",
                                        textDecoration: "line-through",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      $120.000
                                    </motion.span>
                                  ) : (
                                    <motion.span
                                      key={`precio-${currency}`}
                                      initial={{ opacity: 0, x: 50 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.5 }}
                                      style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        fontSize: isMobile ? "1rem" : "1rem",
                                        fontWeight: 800,
                                        background:
                                          "linear-gradient(90deg, #FFD700, #FFA500)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        textShadow: "0 2px 6px rgba(0,0,0,0.4)",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {currency === "USD"
                                        ? promo.priceUSD
                                        : promo.price}
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </Box>
                            </Box>

                            <br />
                            <Box
                              component="span"
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                opacity: 0.9,
                              }}
                            >
                              {currency === "USD"
                                ? "2 cuotas (💳 $32 USD reserva • $73 USD final)"
                                : "2 cuotas (💳 $30.000 reserva • $69.990 final)"}
                            </Box>
                          </Typography>
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: promo.id === 1 ? 800 : 700,
                              fontSize: promo.id === 1
                                ? (isMobile ? "15px" : "17px")   // 👈 más grande
                                : (isMobile ? "13px" : "15px"),
                              textTransform: "none",
                              lineHeight: 1.3,
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            {promo.id === 1 ? (
                              <>
                                Precio Desarrollo:&nbsp;
                                <Box
                                  component="span"
                                  sx={{
                                    color: "rgb(243, 210, 98)",
                                    fontWeight: 900,
                                    fontSize: isMobile ? "20px" : "18px",
                                  }}
                                >
                                  {currency === "USD" ? promo.priceUSD : promo.price}
                                </Box>
                              </>
                            ) : (
                              <>
                                El valor será determinado por el negocio.
                                <br />
                                <Box
                                  component="span"
                                  sx={{
                                    color: "rgb(243, 210, 98)",
                                    fontWeight: "bold",
                                  }}
                                >
                                  (Valor Estimado: {currency === "USD" ? promo.priceUSD : promo.price})
                                </Box>
                              </>
                            )}

                          </Typography>

                        )}
                      </Box>
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
                      {promo.id === 2 ? (

                        <Box
                          sx={{
                            ...pricingBoxBase,
                            justifyContent: "center",
                            background:
                              "linear-gradient(180deg, #FFD700 0%, #FFB300 50%, #C99700 100%)",
                            color: "#2E1A00",
                            boxShadow: "0 3px 12px rgba(255, 193, 7, 0.55)",

                            "&::after": {
                              content: '""',
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%)",
                              transform: "translateX(-120%)",
                              animation: "shineDiagonal 5s ease-in-out infinite",
                              pointerEvents: "none",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 900,
                              fontSize: isMobile ? "0.75rem" : "0.8rem",
                              letterSpacing: "1px",
                              color: "white",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            💎 Pagas una vez. Es tuyo para siempre!
                          </Typography>
                        </Box>




                      ) : (
                        <Box
                          onClick={toggleCurrency}
                          sx={{
                            ...pricingBoxBase,
                            justifyContent: "space-between",
                            background:
                              currency === "USD"
                                ? "linear-gradient(180deg, #00B871 0%, #007A48 100%)"
                                : "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                            color: "white",
                            cursor: "pointer",
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
                                fontSize: isMobile ? "1.1rem" : "1.15rem",
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: 1,
                                mt: 0.5,
                              }}
                            >
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={`extraPrice0-${currency}`}
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -50 }}
                                  transition={{ duration: 0.5 }}
                                  style={{ display: "inline-block" }} // mantiene layout y color heredado
                                >
                                  {currency === "USD"
                                    ? promo.extraPrices?.[0]?.priceUSD || "$10"
                                    : promo.extraPrices?.[0]?.price || "$10.000"}
                                </motion.span>
                              </AnimatePresence>
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
                                fontSize: isMobile ? "1.1rem" : "1.15rem",
                                fontWeight: "bold",
                                color: "white",
                                lineHeight: 1,
                                mt: 0.5,
                              }}
                            >
                              <AnimatePresence mode="wait">
                                <motion.span
                                  key={`extraPrice1-${currency}`}
                                  initial={{ opacity: 0, x: 50 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -50 }}
                                  transition={{ duration: 0.5 }}
                                  style={{ display: "inline-block" }} // mantiene layout y color heredado
                                >
                                  {currency === "USD"
                                    ? promo.extraPrices?.[1]?.priceUSD || "$10"
                                    : promo.extraPrices?.[1]?.price || "$10.000"}
                                </motion.span>
                              </AnimatePresence>
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
                      )}
                    </motion.div>

                    {/*FIN PRECIOS*/}



                    {modoDesarrollo && promo.id === 1 ? (
                      // 🔹 Botón RESERVAR Transbank
                      <Box
                        component="button"
                        onClick={() => setOpenDialog(true)}
                        sx={{
                          all: "unset",
                          boxSizing: "border-box",
                          background: "linear-gradient(90deg, #6A1B9A, #8E24AA)",
                          color: "white",
                          border: "2px solid #4A148C",
                          borderRadius: "8px",
                          width: "310px",
                          py: 0.5,
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
                          sx={{ width: 60, height: "auto", userSelect: "none" }}
                        />
                        <span>Reservar</span>
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
                        Solicitar Cotización
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
              onClick={() => {
                swiperInstance.slideNext();
              }}
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
      <DialogTransbankCorreo
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={(email) => {
          handleReservar(email);
        }}
      />

    </Box >
  );
};

export default InformationsPromotions;
