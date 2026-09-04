import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import "@fontsource/poppins";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";

const promotions = [
  {
    id: 1,
    title: "📅 Suscripción Mensual",
    subtitle: "Entrega en menos de 72 horas ⏰",
    accent: "#0075FF",
    badge: "Más cotizado",
    descriptors: [
      "🌐 **Sitio web profesional** desarrollado en 72 hrs",
      "📦 Hosting + dominio .cl incluido en la mensualidad",
      "🔧 Cambios y mejoras incluidos sin costo adicional",
      "📞 Soporte directo con tu equipo 24/7",
    ],
    price:          { CLP: "$29.990",  USD: "$32" },
    priceSinCupos:  { CLP: "$119.990", USD: "$120" },
    mensualSinCupos:{ CLP: "$9.990",   USD: "$11"  },
    periodicidad:   "/mes",
    cuotas:         { CLP: "2 cuotas: Al inicio y al entregar", USD: "2 payments: start & delivery" },
    extras: [
      { icon: "💵", label: "$9.990 CLP/mes mensualidad", labelUSD: "$10 USD/mes mensualidad" },
      { icon: "💳", label: "Formas de pago: Webpay · débito · transferencia" },
    ],
  },
  {
    id: 2,
    title: "💎 Pago Único",
    subtitle: "Entrega en menos de 3 a 7 días ⏰",
    accent: "#FFB300",
    badge: "Más cotizado",
    descriptors: [
      "🌐 **Sitio web profesional** entregado en 3 a 7 días",
      "💎 Pago único en 2 cuotas, sin mensualidades",
      "📦 Hosting + dominio .cl incluido el primer año",
      "🔧 Ajustes posteriores se cotizan por separado",
    ],
    price:         { CLP: "$99.990",  USD: "$105" },
    priceSinCupos: { CLP: "$199.990", USD: "$210" },
    periodicidad:  " pago único",
    cuotas:        { CLP: "2 cuotas: al inicio y al entregar", USD: "2 payments: start & delivery" },
    cuotasSinCupos:{ CLP: "2 cuotas: al inicio y al entregar", USD: "2 payments: start & delivery" },
    extras: [
      { icon: "🚫", label: "Sin mensualidad posterior" },
      { icon: "💳", label: "Formas de pago: Webpay · débito · transferencia" },
    ],
  },
  {
    id: 3,
    title: "🛒 Tienda Online",
    subtitle: "eCommerce profesional",
    accent: "#00C853",
    badge: null,
    descriptors: [
      "🛍️ eCommerce profesional completo",
      "📦 Stock y carrito de compras",
      "💳 WebPay y pagos integrados",
      "📊 Panel de gestión incluido",
    ],
    price:         { CLP: "$250.000 - $400.000", USD: "$265 - $425" },
    priceSinCupos: null,
    periodicidad:  " pago único",
    cuotas:        { CLP: "Hasta 6 cuotas disponibles", USD: "Up to 6 installments" },
    extras: [
      { icon: "🌐", label: "Dominio + Hosting incluido" },
      { icon: "📦", label: "Mensualidad hosting $80.000" },
    ],
  },
];

const pilares = [
  {
    icon: "⚡",
    title: "Entrega Rápida",
    desc: "Tu sitio web listo en menos de 72 horas. Sin esperas ni excusas.",
    color: "#0075FF",
  },
  {
    icon: "🛡️",
    title: "Soporte 24/7",
    desc: "Disponibles cuando más nos necesites. Tu negocio nunca se detiene.",
    color: "#7B1FA2",
  },
  {
    icon: "💰",
    title: "Transparencia Total",
    desc: "Sin costos ocultos ni sorpresas. Claridad total desde el primer día.",
    color: "#00C853",
  },
  {
    icon: "🏆",
    title: "Experiencia Comprobada",
    desc: "Más de 100 proyectos entregados en distintas industrias del país.",
    color: "#FFB300",
  },
];

const PricingCard = ({ promo, isMobile, currency, toggleCurrency, conCupos, inView, index, onContact }) => {
  const isSuscripcionSinCupos = promo.id === 1 && !conCupos;

  const price = promo.id === 3
    ? promo.price[currency]
    : conCupos
      ? promo.price[currency]
      : promo.priceSinCupos?.[currency] ?? promo.price[currency];

  const mensualSinCupos = isSuscripcionSinCupos ? promo.mensualSinCupos?.[currency] : null;

  const cuotas = promo.id === 2 && !conCupos
    ? promo.cuotasSinCupos?.[currency]
    : promo.cuotas?.[currency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 * index }}
      style={{ height: "100%", position: "relative" }}
    >
      {/* Badge — sube con la card al hacer hover porque está dentro del motion.div */}
      {promo.badge && (
        <Box sx={{
          position: "absolute", top: -34, right: 14,
          display: "inline-flex", alignItems: "center", gap: 0.6,
          background: "linear-gradient(135deg, #ff6b35, #f7431e)",
          color: "white", borderRadius: "10px 10px 0 0",
          px: 2.5, py: 1.1,
          fontFamily: "'Poppins', sans-serif",
          fontSize: "0.78rem", fontWeight: 800,
          boxShadow: "0 -4px 14px rgba(255,80,30,0.4)",
          border: "1.5px solid #ff6a00",
          borderBottom: "none",
          whiteSpace: "nowrap", letterSpacing: "0.3px",
          zIndex: 0,
        }}>
          🔥 {promo.badge}
        </Box>
      )}

      <Box sx={{
        position: "relative", height: "100%",
        minHeight: isMobile ? 400 : 440,
        borderRadius: "20px",
        background: "rgba(6, 20, 40, 0.8)",
        backdropFilter: "blur(14px)",
        border: `1.5px solid ${promo.accent}44`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", zIndex: 1,
        transition: "box-shadow 0.25s",
        "&:hover": { boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 2px ${promo.accent}55` },
      }}>

        {/* Header */}
        <Box sx={{
          background: `linear-gradient(135deg, ${promo.accent}22 0%, ${promo.accent}08 100%)`,
          borderBottom: `1px solid ${promo.accent}33`,
          px: isMobile ? 2.5 : 3, pt: 2.5, pb: 2,
          display: "flex", alignItems: "center", overflow: "hidden",
        }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "white", letterSpacing: "0.2px", lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {promo.title}
            </Typography>
            <Typography sx={{ fontSize: "0.72rem", color: promo.accent, fontWeight: 600, mt: 0.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {promo.subtitle}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: isMobile ? 2.5 : 3, display: "flex", flexDirection: "column", flexGrow: 1, gap: 1.5 }}>

          {/* Descriptors */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.6, flexGrow: 1 }}>
            {promo.descriptors.map((d, i) => {
              const parts = d.split(/\*\*(.*?)\*\*/g);
              return (
                <Typography key={i} sx={{ fontSize: isMobile ? "0.8rem" : "0.84rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>
                  {parts.map((part, j) =>
                    j % 2 === 1
                      ? <Box key={j} component="span" sx={{
                          fontWeight: 700,
                          fontFamily: "inherit",
                          fontSize: "inherit",
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

          {/* Bloque precio */}
          <Box sx={{ mt: 0.5 }}>

            {/* Precio principal + toggle */}
            <Box onClick={toggleCurrency} sx={{
              background: currency === "USD"
                ? "linear-gradient(180deg, #00B871, #007A48)"
                : `linear-gradient(180deg, ${promo.accent}, ${promo.accent}cc)`,
              borderRadius: "12px 12px 0 0", px: 2, pt: 1.2, pb: 0.8,
              display: "flex", alignItems: "baseline", justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: `0 4px 14px ${promo.accent}44`,
              transition: "all 0.3s ease",
            }}>
              <AnimatePresence mode="wait">
                <motion.div key={`price-${currency}-${conCupos}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }}>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: isMobile ? "1rem" : (price.length > 10 ? "0.95rem" : "1.25rem"), color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>
                        {price}
                      </Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
                        {currency}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", mt: 0.2 }}>
                      {isSuscripcionSinCupos ? "desarrollo" : promo.periodicidad}
                    </Typography>
                  </Box>
                </motion.div>
              </AnimatePresence>
              <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.8)", fontWeight: 600, border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", px: 0.8, py: 0.2, flexShrink: 0, ml: 1 }}>
                {currency === "USD" ? "🪙 CLP" : "💵 USD"}
              </Typography>
            </Box>

            {/* Cuotas / extras */}
            <Box sx={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "0 0 10px 10px",
              border: `1px solid ${promo.accent}33`,
              borderTop: "none",
              px: 2, py: 1,
              display: "flex", flexDirection: "column", gap: 0.5,
              mb: 1.5,
            }}>
              {cuotas && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Typography sx={{ fontSize: "0.68rem" }}>💳</Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                    {cuotas}
                  </Typography>
                </Box>
              )}
              {promo.extras.map((ex, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Typography sx={{ fontSize: "0.68rem" }}>{ex.icon}</Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                    {currency === "USD" && ex.labelUSD ? ex.labelUSD : ex.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA */}
            <Box component="button" onClick={() => onContact(promo.title)} sx={{
              all: "unset", boxSizing: "border-box", width: "100%",
              background: promo.id !== 3
                ? "linear-gradient(135deg, #ffd54f, #ff9800 45%, #f57c00 85%)"
                : "linear-gradient(90deg, #FF9800, #F57C00)",
              backgroundSize: promo.id !== 3 ? "200% 200%" : undefined,
              animation: promo.id !== 3 ? "gradientShift 8s ease infinite" : undefined,
              color: "white",
              border: promo.id !== 3 ? "2px solid rgba(255,213,79,0.9)" : "2px solid #E65100",
              borderRadius: "10px", py: 0.9,
              fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
              position: "relative", overflow: "hidden",
              boxShadow: promo.id !== 3 ? "0 6px 16px rgba(255,152,0,.4)" : undefined,
              transition: "box-shadow 0.2s, transform 0.2s",
              "&:hover": {
                boxShadow: promo.id !== 3
                  ? "0 0 6px rgba(255,167,38,.6), inset 0 0 6px rgba(255,255,255,0.25)"
                  : "0 4px 14px rgba(255,152,0,0.4)",
                transform: "translateY(-1px) scale(1.02)",
              },
              ...(promo.id !== 3 && {
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
            }}>
              Solicitar Cotización
              {promo.id !== 3 && (
                <Box component="img" src="/clic.jpg" alt="clic" sx={{ filter: "invert(1) brightness(2)", width: 22, height: "auto", position: "relative", zIndex: 3 }} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

const PilarCard = ({ pilar, index, inView }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
    transition={{ duration: 0.55, ease: "easeOut", delay: 0.12 * index }}
    style={{ display: "flex", flex: 1, width: "100%" }}
  >
    <Box sx={{
      width: "100%",
      borderRadius: "22px",
      background: `linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(240,245,255,0.92) 100%)`,
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.9)",
      boxShadow: `0 8px 32px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,1) inset, 0 0 0 1px ${pilar.color}22`,
      p: 3,
      height: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.25s, box-shadow 0.25s",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: `0 24px 48px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,1) inset, 0 0 0 1.5px ${pilar.color}66`,
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "4px",
        background: `linear-gradient(90deg, ${pilar.color}, ${pilar.color}99)`,
        borderRadius: "22px 22px 0 0",
      },
    }}>
      {/* Número */}
      <Typography sx={{
        position: "absolute", top: 14, right: 16,
        fontSize: "0.68rem", fontWeight: 800, fontFamily: "'Poppins', sans-serif",
        color: `${pilar.color}55`, letterSpacing: "0.5px",
      }}>
        {String(index + 1).padStart(2, "0")}
      </Typography>

      {/* Ícono */}
      <Box sx={{
        width: 50, height: 50, borderRadius: "15px",
        background: `linear-gradient(135deg, ${pilar.color}22, ${pilar.color}0a)`,
        border: `1.5px solid ${pilar.color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        mb: 2, fontSize: "1.7rem",
        boxShadow: `0 4px 12px ${pilar.color}22`,
      }}>
        {pilar.icon}
      </Box>

      {/* Título */}
      <Typography sx={{
        fontFamily: "'Poppins', sans-serif", fontWeight: 800,
        fontSize: "0.95rem", color: "#0f172a", mb: 0.7, lineHeight: 1.2,
        wordBreak: "break-word",
      }}>
        {pilar.title}
      </Typography>

      {/* Desc */}
      <Typography sx={{
        fontSize: "0.82rem", color: "#475569", lineHeight: 1.65,
      }}>
        {pilar.desc}
      </Typography>

      {/* Glow de fondo */}
      <Box sx={{
        position: "absolute", bottom: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: `${pilar.color}15`,
        filter: "blur(18px)", pointerEvents: "none",
      }} />
    </Box>
  </motion.div>
);

const Areas = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [currency, setCurrency] = useState("CLP");
  const [conCupos, setConCupos] = useState(() => localStorage.getItem("ConCupos") === "true");

  const { ref: pricingRef, inView: pricingInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: pilaresRef, inView: pilaresInView } = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    const sync = () => setConCupos(localStorage.getItem("ConCupos") === "true");
    window.addEventListener("storage", sync);
    window.addEventListener("conCuposChanged", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("conCuposChanged", sync);
    };
  }, []);

  const toggleCurrency = () => setCurrency(prev => prev === "CLP" ? "USD" : "CLP");

  const handleContactClick = (title) => {
    const mensaje = `¡Hola! Me interesó la promoción de ${encodeURIComponent(title)} ¿Me comentas?`;
    window.open(`https://api.whatsapp.com/send?phone=56946873014&text=${mensaje}`, "_blank");
  };

  return (
    <Box sx={{
      position: "relative",
      backgroundImage: isMobile
        ? "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/fondo-ofertas.avif)"
        : "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/fondo-areas1.webp)",
      backgroundRepeat: "no-repeat",
      backgroundSize: isMobile ? "cover" : "100% 100%",
      backgroundPosition: isMobile ? "center center" : "center top",
      backgroundAttachment: "scroll",
      paddingTop: "10px !important",
      padding: { xs: 3, md: 10 },
      paddingBottom: { xs: 10, md: 4 },
      mt: "-160px",
      overflow: "visible",
    }}>

      {/* ── Sección 1: Nuestros Precios ── */}
      <Box id="nuestras-ofertas" ref={pricingRef} sx={{ pt: { xs: 22, md: 26 }, pb: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={pricingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Chip superior */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "100px", px: 2.5, py: 0.7,
              backdropFilter: "blur(10px)",
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                Planes disponibles
              </Typography>
            </Box>
          </Box>

          {/* Título principal */}
          <Typography sx={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 800, textAlign: "center",
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "white",
            letterSpacing: "0px", lineHeight: 1.2, mb: 1,
          }}>
            Nuestras Ofertas
          </Typography>

          {/* Subtítulo */}
          <Typography sx={{
            textAlign: "center", fontSize: { xs: "0.85rem", md: "0.95rem" },
            color: "rgba(255,255,255,0.75)", mb: 9,
            maxWidth: 480, mx: "auto", lineHeight: 1.6,
          }}>
            Elige el plan que mejor se adapta a tu negocio
          </Typography>
        </motion.div>

        <Grid container spacing={3} rowSpacing={{ xs: 6, md: 3 }} justifyContent="center" alignItems="stretch">
          {promotions.map((promo, index) => (
            <Grid item xs={12} sm={6} md={4} key={promo.id} sx={{ display: "flex" }}>
              <Box sx={{ width: "100%" }}>
                <PricingCard
                  promo={promo}
                  isMobile={isMobile}
                  currency={currency}
                  toggleCurrency={toggleCurrency}
                  conCupos={conCupos}
                  inView={pricingInView}
                  index={index}
                  onContact={handleContactClick}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Sección 2: ¿Por qué elegirnos? ── */}
      <Box ref={pilaresRef} sx={{ pb: { xs: 4, md: 3 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={pilaresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Chip superior */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "100px", px: 2.5, py: 0.7,
              backdropFilter: "blur(10px)",
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676", flexShrink: 0 }} />
              <Typography sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                Nuestra propuesta de valor
              </Typography>
            </Box>
          </Box>

          {/* Título */}
          <Typography sx={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 800, textAlign: "center",
            fontSize: { xs: "1.6rem", md: "2rem" },
            color: "white",
            letterSpacing: "0px", lineHeight: 1.2, mb: 1,
          }}>
            ¿Por qué elegirnos?
          </Typography>

          {/* Subtítulo */}
          <Typography sx={{
            textAlign: "center", fontSize: { xs: "0.85rem", md: "0.95rem" },
            color: "rgba(255,255,255,0.75)", mb: 5,
            maxWidth: 480, mx: "auto", lineHeight: 1.6,
          }}>
            Más de 10 años de experiencia respaldan cada proyecto
          </Typography>
        </motion.div>

        <Grid container spacing={3} justifyContent="center" alignItems="stretch">
          {pilares.map((pilar, index) => (
            <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
              <PilarCard pilar={pilar} index={index} inView={pilaresInView} />
            </Grid>
          ))}
        </Grid>
      </Box>

    </Box>
  );
};

export default Areas;
