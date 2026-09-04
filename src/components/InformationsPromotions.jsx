import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import DialogTransbankCorreo from "./DialogTransbankCorreo";
import 'swiper/css';
import './css/Informations.css';

const VISITA_PRECIOS_KEY = "visita_pago_unico_notificada";
const RESERVA_TEST_AMOUNT = 50;

// Botón animado extraído — solo monta una vez, no re-renderiza por cambio de currency
const ClicButton = memo(function ClicButton({ onClick, label, gradient, border, shine }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        background: gradient,
        backgroundSize: shine ? "200% 200%" : undefined,
        animation: shine ? "gradientShift 8s ease infinite" : undefined,
        color: "white",
        border: `2px solid ${border}`,
        borderRadius: "8px",
        width: "310px",
        py: 0.7,
        fontWeight: "bold",
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        mt: 0.3,
        willChange: "transform",
        position: "relative",
        overflow: "hidden",
        boxShadow: shine ? "0 6px 16px rgba(255,152,0,.4)" : undefined,
        "&:hover": {
          transform: "translateY(-1px) scale(1.02)",
          boxShadow: shine ? "0 0 6px rgba(255,167,38,.6), inset 0 0 6px rgba(255,255,255,0.25)" : "0 4px 14px rgba(0,0,0,0.3)",
        },
        ...(shine && {
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
          "@keyframes shineDiagonal": { "0%": { transform: "translateX(-120%)" }, "100%": { transform: "translateX(120%)" } },
          "@keyframes gradientShift": { "0%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" }, "100%": { backgroundPosition: "0% 50%" } },
        }),
      }}
    >
      {label}
      <Box
        component="img"
        src="/clic.jpg"
        alt="clic"
        loading="lazy"
        sx={{
          filter: "invert(1) brightness(2)",
          width: { xs: 23, sm: 25 },
          height: "auto",
          display: "block",
          userSelect: "none",
          animation: "clicBounce 1.8s ease-in-out infinite",
        }}
      />
    </Box>
  );
});

// Card individual memoizada — solo re-renderiza si sus props cambian
const PromoSlide = memo(function PromoSlide({
  promo,
  isMobile,
  currency,
  toggleCurrency,
  showPopularBadge,
  showOriginalPriceId1,
  conCupos,
  modoDesarrollo,
  onReservar,
  handleContactClick,
}) {
  const isId1 = promo.id === 1;
  const isId2 = promo.id === 2;

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>

      {(isId1 || isId2) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={showPopularBadge ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute", top: "-16px", left: 8,
            background: "linear-gradient(#f14c2e, #d8452e)", color: "white",
            borderTopLeftRadius: "8px", borderTopRightRadius: "8px",
            borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            padding: "6px 16px", fontSize: "0.75rem", fontWeight: 600,
            height: "35px", minWidth: "110px", textAlign: "center", zIndex: 1,
            display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6,
            boxShadow: "0 0 12px 2px rgba(255, 105, 0, 0.6)",
            border: "2px solid #ff6a00",
          }}
        >
          Más vendido
        </motion.div>
      )}

      <Box sx={{
        width: isMobile ? "350px" : "430px",
        height: "420px",
        mt: 1.4,
        display: "flex", flexDirection: "column",
        borderRadius: "16px", overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
        position: "relative",
        bgcolor: "#111827",
        zIndex: 2,
        willChange: "transform",
      }}>

        {/* Fondo imagen */}
        <Box sx={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${promo.image})`,
          backgroundSize: "cover", backgroundPosition: "center",
          "&::after": { content: '""', position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)" },
          zIndex: 0,
        }} />

        <Box sx={{
          position: "relative", zIndex: 2, p: 2, pt: 3,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "flex-start",
          flexGrow: 1, gap: 1.2,
        }}>

          {/* Título + descripción */}
          <Box sx={{ width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 2 }}>
            <Typography variant="h6" sx={{
              fontFamily: "'Poppins', sans-serif", fontWeight: 800,
              fontSize: { xs: "1.2rem", md: "1.35rem" }, textAlign: "left",
              color: promo.textColor || "#fff", letterSpacing: "1.1px", mb: 0,
              display: "flex", alignItems: "center", gap: 0.5,
            }}>
              {isId1 && (
                <Box component="img" src="/logo-sitio-web.webp" alt="Logo sitio web"
                  sx={{ height: "1.1em", width: "auto", objectFit: "contain", mt: "-2px" }} />
              )}
              {promo.title}
            </Typography>

            <Typography variant="body2" sx={{
              textAlign: "left", fontSize: { xs: "0.85rem", md: "0.8rem" }, lineHeight: 1.6,
              color: isId1 ? "rgb(243, 210, 98)" : "#eee",
              fontFamily: "'Roboto', sans-serif", opacity: 0.95,
              fontWeight: isId1 ? 700 : 400,
              letterSpacing: isId1 ? "0.5px" : "normal",
            }}>
              {(isId1 || isId2) ? (
                <Box component="span" sx={{ fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "2px", color: "rgb(243, 210, 98)" }}>
                  {isId1 ? "Entrega en menos de 72 horas" : "Entrega en menos de 3 a 7 días"}
                  <AccessTimeFilledRoundedIcon sx={{
                    fontSize: { xs: 15, sm: 18 },
                    position: "relative", top: { xs: "-1px", sm: "-1px" },
                    animation: "clockSpin 8s steps(12) 2",
                    transformOrigin: "50% 50%",
                    filter: "drop-shadow(0 0 4px rgba(255,167,38,.35))",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }} />
                </Box>
              ) : promo.description}
            </Typography>
          </Box>

          {/* Descriptors */}
          <Box sx={{ width: isMobile ? "100%" : "80%", mt: 0.4, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {promo.descriptors.map((desc, idx) => {
              const parts = desc.split(/\*\*(.*?)\*\*/g);
              return (
                <Typography key={idx} variant="caption" sx={{ display: "flex", alignItems: "center", mb: 0.35, fontSize: "0.8rem", lineHeight: 1.4, color: "#eee" }}>
                  {parts.map((part, i) =>
                    i % 2 === 1
                      ? <Box key={i} component="span" sx={{
                          fontWeight: 800,
                          background: "linear-gradient(90deg, #38bdf8 0%, #a855f7 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>{part}</Box>
                      : part
                  )}
                </Typography>
              );
            })}
          </Box>

          {/* Precio principal */}
          <Box sx={{ position: "relative", width: "310px", mx: "auto" }}>
            {/* Toggle moneda */}
            <Box onClick={toggleCurrency} sx={{
              position: "absolute", right: "0px", top: "-25px",
              background: currency === "USD"
                ? "linear-gradient(90deg, #0E35A3 0%, #1E88E5 100%)"
                : "linear-gradient(90deg, #008B56 0%, #00C97C 100%)",
              color: "rgba(255,255,255,0.95)",
              fontSize: isMobile ? "0.53rem" : "0.58rem",
              fontFamily: "'Mukta', sans-serif", fontWeight: 600,
              borderRadius: "8px", px: 0.6, py: 0.2, cursor: "pointer",
              width: isMobile ? "70px" : "65px", textAlign: "center",
              justifyContent: "center",
              boxShadow: currency === "USD" ? "0 1px 3px rgba(0,100,255,0.25)" : "0 1px 3px rgba(0,180,100,0.25)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
              display: "flex", alignItems: "center", gap: "1px",
              opacity: 0.85, backdropFilter: "blur(3px)", letterSpacing: "0.2px",
              "&:hover": { opacity: 1, transform: "scale(1.03)" },
            }}>
              <span style={{ fontSize: "0.65rem", opacity: 0.9, transform: "translateY(1px)" }}>
                {currency === "USD" ? "🪙" : "💵"}
              </span>
              <span style={{ transform: "translateY(1px)" }}>
                {currency === "USD" ? "Ver en peso" : "Ver en dólar"}
              </span>
            </Box>

            {/* Box precio */}
            <Box onClick={toggleCurrency} sx={{
              mt: isMobile ? 2.2 : 3, mb: 0,
              background: currency === "USD"
                ? "linear-gradient(180deg, #00B871 0%, #007A48 100%)"
                : "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
              borderRadius: "12px", px: 2, py: 0,
              display: "flex", justifyContent: "center", alignItems: "center",
              width: "310px", height: "48px", mx: "auto",
              color: "white",
              boxShadow: currency === "USD" ? "0 3px 12px rgba(0,200,100,0.4)" : "0 3px 12px rgba(0,0,0,0.3)",
              position: "relative", overflow: "hidden", zIndex: 3,
              boxSizing: "border-box", textAlign: "center", flexShrink: 0,
              cursor: "pointer", transition: "all 0.4s ease",
              willChange: "transform",
              "&::after": {
                content: '""', position: "absolute", inset: 0,
                background: "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
                transform: "translateX(-120%)",
                animation: "shineDiagonal 2.8s ease-in-out 2",
                borderRadius: "inherit", pointerEvents: "none", zIndex: 2,
                mixBlendMode: "overlay",
              },
            }}>
              {isId2 ? (
                <Typography variant="body1" sx={{
                  fontFamily: "'Mukta', sans-serif", fontWeight: 300,
                  fontSize: "1rem", textTransform: "none", lineHeight: 1.3,
                  width: "100%", textAlign: "center",
                }}>
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center", ml: 4 }}>
                    Precio desarrollo:
                    <Box component="span" sx={{ display: "inline-block", position: "relative", marginLeft: "0.2rem", minWidth: "95px", height: "1.2rem" }}>
                      <AnimatePresence mode="wait">
                        {showOriginalPriceId1 ? (
                          <motion.span key="precio-original"
                            initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: "absolute", left: 0, top: 0, fontSize: "1rem", fontWeight: 700, color: "#ccc", textDecoration: "line-through", whiteSpace: "nowrap" }}>
                            $120.000
                          </motion.span>
                        ) : (
                          <motion.span key={`precio-${currency}`}
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{ position: "absolute", left: 0, top: 0, fontSize: "1rem", fontWeight: 800, background: "linear-gradient(90deg, #FFD700, #FFA500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textShadow: "0 2px 6px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
                            {currency === "USD" ? promo.priceUSD : promo.price}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Box>
                  </Box>
                  <br />
                  <Box component="span" sx={{ fontWeight: 600, fontSize: { xs: "0.68rem", sm: "0.8rem" }, opacity: 0.9 }}>
                    {currency === "USD"
                      ? "2 cuotas (💳 $32 USD reserva • $73 USD final)"
                      : `2 cuotas (💳 $30.000 reserva • ${conCupos ? "$69.990" : "$169.990"} final)`}
                  </Box>
                </Typography>
              ) : (
                <Typography variant="body1" sx={{
                  fontFamily: "'Mukta', sans-serif",
                  fontWeight: isId1 ? 800 : 700,
                  fontSize: isId1 ? (isMobile ? "15px" : "17px") : (isMobile ? "13px" : "15px"),
                  textTransform: "none", lineHeight: 1.3, width: "100%", textAlign: "center",
                }}>
                  {isId1 ? (
                    <>
                      Precio Desarrollo:&nbsp;
                      <Box component="span" sx={{ color: "rgb(243,210,98)", fontWeight: 900, fontSize: isMobile ? "20px" : "18px" }}>
                        {currency === "USD" ? promo.priceUSD : promo.price}
                      </Box>
                    </>
                  ) : (
                    <>
                      El valor será determinado por el negocio.
                      <br />
                      <Box component="span" sx={{ color: "rgb(243,210,98)", fontWeight: "bold" }}>
                        (Valor Estimado: {currency === "USD" ? promo.priceUSD : promo.price})
                      </Box>
                    </>
                  )}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Precio secundario + botón */}
          <Box sx={{ maxWidth: "100%", mx: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
            {isId2 ? (
              <Box sx={{
                mt: isMobile ? 1.2 : 1, mb: 0, borderRadius: "12px", px: 2,
                py: isMobile ? 0.5 : 0.3, display: "flex", alignItems: "center",
                justifyContent: "center", width: "310px",
                minHeight: isMobile ? "78px" : "70px", position: "relative", overflow: "hidden",
                zIndex: 3, mx: "auto", alignSelf: "center", boxSizing: "border-box",
                transition: "all 0.4s ease-in-out",
                background: "linear-gradient(180deg, #FFD700 0%, #FFB300 50%, #C99700 100%)",
                color: "#2E1A00", boxShadow: "0 3px 12px rgba(255,193,7,0.55)",
                "&::after": {
                  content: '""', position: "absolute", inset: 0,
                  background: "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%)",
                  transform: "translateX(-120%)",
                  animation: "shineDiagonal 2.8s ease-in-out 2",
                  pointerEvents: "none",
                },
              }}>
                <Typography sx={{
                  fontFamily: "'Mukta', sans-serif", fontWeight: 900,
                  fontSize: isMobile ? "0.75rem" : "0.8rem", letterSpacing: "1px",
                  color: "white", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  💎 Pagas una vez. Es tuyo para siempre!
                </Typography>
              </Box>
            ) : (
              <Box onClick={toggleCurrency} sx={{
                mt: isMobile ? 1.2 : 1, mb: 0, borderRadius: "12px", px: 2,
                py: isMobile ? 0.5 : 0.3, display: "flex", alignItems: "center",
                justifyContent: "space-between", width: "310px",
                minHeight: isMobile ? "78px" : "70px", position: "relative", overflow: "hidden",
                zIndex: 3, mx: "auto", alignSelf: "center", boxSizing: "border-box",
                transition: "all 0.4s ease-in-out",
                background: currency === "USD"
                  ? "linear-gradient(180deg, #00B871 0%, #007A48 100%)"
                  : "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                color: "white", cursor: "pointer",
              }}>
                {/* Dominio */}
                <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 0.4 : 0.2 }}>
                  <Typography variant="caption" sx={{ fontFamily: "'Mukta', sans-serif", fontWeight: 300, fontSize: "0.74rem", letterSpacing: "0.5px", textTransform: "uppercase", color: "white", lineHeight: 1.1, whiteSpace: "nowrap" }}>
                    <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>ELIGE TU DOMINIO .CL</Box>
                  </Typography>
                  <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontSize: isMobile ? "1.1rem" : "1.15rem", fontWeight: "bold", color: "white", lineHeight: 1, mt: 0.5 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={`extraPrice0-${currency}`}
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }} style={{ display: "inline-block" }}>
                        {currency === "USD" ? promo.extraPrices?.[0]?.priceUSD || "$10" : promo.extraPrices?.[0]?.price || "$10.000"}
                      </motion.span>
                    </AnimatePresence>
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", opacity: 0.85, color: "white", mt: 0.3, fontFamily: "'Mukta', sans-serif" }}>ANUAL</Typography>
                </Box>

                <Box sx={{ width: "1px", height: isMobile ? "45px" : "55px", backgroundColor: "rgba(255,255,255,0.35)", mx: 1.5 }} />

                {/* Hosting */}
                <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 0.4 : 0.2 }}>
                  <Typography variant="caption" sx={{ fontFamily: "'Mukta', sans-serif", fontWeight: 300, fontSize: "0.74rem", letterSpacing: "0.5px", textTransform: "uppercase", color: "white", lineHeight: 1.1, whiteSpace: "nowrap" }}>
                    <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>SUSCRIPCIÓN + SOPORTE</Box>
                  </Typography>
                  <Typography sx={{ fontFamily: "'Montserrat', sans-serif", fontSize: isMobile ? "1.1rem" : "1.15rem", fontWeight: "bold", color: "white", lineHeight: 1, mt: 0.5 }}>
                    <AnimatePresence mode="wait">
                      <motion.span key={`extraPrice1-${currency}`}
                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.4 }} style={{ display: "inline-block" }}>
                        {currency === "USD" ? promo.extraPrices?.[1]?.priceUSD || "$10" : promo.extraPrices?.[1]?.price || "$10.000"}
                      </motion.span>
                    </AnimatePresence>
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", opacity: 0.85, color: "white", mt: 0.3, fontFamily: "'Mukta', sans-serif" }}>MENSUAL</Typography>
                </Box>
              </Box>
            )}

            {/* Botón acción */}
            {modoDesarrollo && isId1 ? (
              <Box component="button" onClick={onReservar} sx={{
                all: "unset", boxSizing: "border-box",
                background: "linear-gradient(90deg, #6A1B9A, #8E24AA)",
                color: "white", border: "2px solid #4A148C",
                borderRadius: "8px", width: "310px", py: 0.5,
                fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer",
                transition: "background 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
                textTransform: "uppercase",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                mt: 0.3, willChange: "transform",
                "&:hover": { background: "linear-gradient(90deg, #7B1FA2, #9C27B0)", transform: "translateY(-1px) scale(1.02)", boxShadow: "0 4px 14px rgba(0,0,0,0.3)", borderColor: "#7B1FA2" },
              }}>
                <Box component="img" src="/logo-webpay.png" alt="Transbank Logo" sx={{ width: 60, height: "auto", userSelect: "none" }} />
                <span>Reservar</span>
                <Box component="img" src="/clic.jpg" alt="clic" loading="lazy"
                  sx={{ filter: "invert(1) brightness(2)", width: { xs: 23, sm: 25 }, height: "auto", display: "block", userSelect: "none", animation: "clicBounce 1.8s ease-in-out infinite" }} />
              </Box>
            ) : (
              <ClicButton
                onClick={() => handleContactClick(promo.title)}
                label="Solicitar Cotización"
                gradient="linear-gradient(135deg, #ffd54f, #ff9800 45%, #f57c00 85%)"
                border="rgba(255, 213, 79, 0.9)"
                shine={isId1 || isId2}
              />
            )}
          </Box>

        </Box>
      </Box>
    </Box>
  );
});

const InformationsPromotions = ({
  isMobile,
  promotions,
  conCupos = true,
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
  const visitaPreciosEnviadaRef = useRef(false);

  const toggleCurrency = useCallback(() => {
    setCurrency((prev) => (prev === "CLP" ? "USD" : "CLP"));
  }, []);

  useEffect(() => {
    if (showPopularBadge) {
      const timer = setTimeout(() => setShowOriginalPriceId1(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopularBadge]);

  const handleReservar = useCallback(async (email) => {
    try {
      const isLocal = window.location.hostname === "localhost";
      const endpoint = isLocal
        ? "http://localhost:8888/.netlify/functions/crearTransaccion"
        : "/.netlify/functions/crearTransaccion";

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: RESERVA_TEST_AMOUNT,
          buyOrder: "RSW-" + Date.now().toString().slice(-10),
          sessionId: "SES-" + Date.now(),
          returnUrl: isLocal ? "http://localhost:5173/reserva" : "https://plataformas-web.cl/reserva",
          email,
        }),
      });

      const data = await resp.json();
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
  }, []);

  const notificarVisitaPrecios = useCallback(() => {
    const ahora = new Date();
    const fechaHoraFormateada = ahora
      .toLocaleString("es-CL", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", hour12: false })
      .replace(/^./, (c) => c.toUpperCase())
      .replace(",", " ·") + " hrs";

    const templateParams = {
      evento: "Nuestros Precios",
      fechaHora: fechaHoraFormateada,
      dispositivo: window.innerWidth < 768 ? "MOBILE 📱" : "DESKTOP 🖥️",
    };

    import("@emailjs/browser")
      .then(({ default: emailjs }) => emailjs.send("service_73azdl9", "template_txa3qoq", templateParams, "TfLG1wfibewzR9Xpf"))
      .catch((error) => console.error("❌ Error EmailJS", error));
  }, []);

  const evaluarVisitaPrecios = useCallback((swiper) => {
    const promo = promotions[swiper.activeIndex];
    if (promo?.id === 2 && !visitaPreciosEnviadaRef.current && !sessionStorage.getItem(VISITA_PRECIOS_KEY)) {
      visitaPreciosEnviadaRef.current = true;
      setTimeout(() => {
        notificarVisitaPrecios();
        sessionStorage.setItem(VISITA_PRECIOS_KEY, "1");
      }, 500);
    }
    setShowArrow(swiper.activeIndex !== 2);
  }, [promotions, setShowArrow, notificarVisitaPrecios]);

  return (
    <Box ref={swiperRef} sx={{ display: "block", position: "relative", px: 1, pt: 2, pb: 1, overflow: "hidden" }}>
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
          <SwiperSlide key={promo.id} style={{ width: isMobile ? '345px' : '430px' }}>
            <PromoSlide
              promo={promo}
              isMobile={isMobile}
              currency={currency}
              toggleCurrency={toggleCurrency}
              showPopularBadge={showPopularBadge}
              showOriginalPriceId1={showOriginalPriceId1}
              conCupos={conCupos}
              modoDesarrollo={modoDesarrollo}
              onReservar={() => setOpenDialog(true)}
              handleContactClick={handleContactClick}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {showArrow && swiperInstance && (
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", top: -4, right: 10, zIndex: 10 }}
        >
          <IconButton
            onClick={() => swiperInstance.slideNext()}
            sx={{ color: "white", transition: "opacity 0.3s ease-in-out", backgroundColor: "transparent", boxShadow: "none", padding: 0, "&:hover": { backgroundColor: "transparent" } }}
          >
            <ArrowForwardIcon fontSize="large" sx={{ fontSize: "23px" }} />
          </IconButton>
        </motion.div>
      )}

      <DialogTransbankCorreo
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={(email) => handleReservar(email)}
      />
    </Box>
  );
};

export default InformationsPromotions;
