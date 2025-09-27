import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, Button, Grid, Card, useMediaQuery, useTheme } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./css/DialogPaseMensual.css";
import { useMotionValue, animate } from "framer-motion";
import { cargarPaseMensual } from "../helpers/HelperPaseMensual";

export default function DialogPaseMensual({ open, onClose, analyticsDisponible }) {
  const montoBase = 10000;
  const [monto, setMonto] = useState(montoBase);

  const [misiones, setMisiones] = useState([
    { id: 1, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Compartir un anuncio de Plataformas web", estado: "pendiente", color: "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)", tipo: "pequeña", imagen: "/facebook-insta.png", width: 70, height: 40 },
    { id: 2, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Pagar suscripción antes de fin de mes", estado: "pendiente", color: "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)", tipo: "pequeña", imagen: "/logo-pagar.png", width: 50, height: 50 },
    { id: 3, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Conexión mensual a la administración", estado: "pendiente", color: "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)", tipo: "pequeña", imagen: "/conexion.png", width: 55, height: 45 },
    { id: 4, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Llegar a 100 visitas mensual", estado: "pendiente", color: "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)", tipo: "pequeña", imagen: "/visitas.png", width: 45, height: 45 },
    { id: 5, descuento: 1, recompensa: "100%", descripcion: "Conseguir un Cliente para Plataformas web", estado: "pendiente", color: "linear-gradient(135deg,#FFF176,#FFD54F,#FFA000,#FF6F00)", tipo: "grande", imagen: "/mision5.png", width: 90, height: 60 }
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery("(max-width:360px)");
  const isLargeMobile = useMediaQuery("(min-width:389px) and (max-width:600px)");

  // 📐 Ajuste global de escala
  const scaleFactor = isSmallMobile ? 0.85 : isLargeMobile ? 1 : isMobile ? 0.9 : 1;



  const motionValue = useMotionValue(monto);
  const [displayMonto, setDisplayMonto] = useState(monto);

  // S3 PASE MENSUAL
  useEffect(() => {
    const fetchPase = async () => {
      const { misiones: misionesExcel } = await cargarPaseMensual(
        `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/PaseMensual.xlsx?t=${Date.now()}`,
        misiones,
        true // debug
      );
      setMisiones(misionesExcel);
    };
    fetchPase();
  }, []);


  useEffect(() => {
    const controls = animate(motionValue, monto, {
      duration: 1.2, // duración de la animación
      ease: "easeOut",
      onUpdate: (latest) => setDisplayMonto(Math.round(latest)),
    });
    return () => controls.stop();
  }, [monto]);

  const handleAccion = async (id) => {
    setMisiones((prev) => {
      // Si ya está en revisión/aprobado/rechazado → no hago nada
      const mision = prev.find((m) => m.id === id);
      if (!mision || mision.estado !== "pendiente") return prev;

      // ⚡ Actualizo localmente a "revision" (optimistic UI)
      const updated = prev.map((m) =>
        m.id === id ? { ...m, estado: "revision" } : m
      );

      // 🔄 Llamo al backend para reflejar en el Excel de S3
      const misionMap = {
        1: "CompartirAnuncio",
        2: "PagarSuscripcionAntes",
        3: "ConexionMensual",
        4: "VisitasMensual",
        5: "ConseguirCliente",
      };
      const campo = misionMap[id];
      const SitioWeb = window.location.hostname;

      (async () => {
        try {
          const url = `${window.location.hostname === "localhost"
            ? "http://localhost:8888"
            : ""
            }/.netlify/functions/actualizarPaseMensual`;

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              SitioWeb,
              campo,
              valor: 1, // 1 = usuario marcó la misión (en revisión)
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Error al actualizar misión");
          console.log("✅ Excel actualizado:", data);
        } catch (err) {
          console.error("❌ Error al actualizar misión:", err);
        }
      })();

      return updated;
    });
  };



  // 💰 Recalcular monto automáticamente cuando llegan misiones (aprobadas/revisión)
  useEffect(() => {
    const totalDescuento = misiones
      .filter((m) => m.estado === "aprobado") // ✅ solo aprobados
      .reduce((acc, m) => acc + m.descuento, 0);

    const nuevoMonto = montoBase - Math.round(montoBase * totalDescuento);
    setMonto(Math.max(nuevoMonto, 0));
  }, [misiones]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={false} // 🚀 quitamos el límite de MUI
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "90%", md: "600px" }, // 📱 mobile ocupa casi todo
          maxWidth: "none", // 🔓 sin límite del sistema
          borderRadius: 4,
          m: 1.5,
          overflow: "hidden",
          background: "linear-gradient(180deg,#2c3e50,#34495e)",
          border: "4px solid #FFD700",
          boxShadow: "0 20px 50px rgba(0,0,0,.7)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          textAlign: "center",
          background: "linear-gradient(90deg,#00695C,#26A69A,#80CBC4)",
          color: "#fff",
          borderBottom: "3px solid #FFD700",
          fontFamily: "'Poppins', sans-serif",
          pb: 1.5, // 👈 un poquito más de padding abajo
        }}
      >
        {/* Título principal */}
        <Typography
          component="div"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: { xs: "1rem", sm: "1.3rem" },
            whiteSpace: "nowrap",
            textShadow: "2px 2px 6px rgba(0,0,0,.6)",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            style={{ display: "inline-block", marginRight: 2 }}
          >
            ⏳
          </motion.span>

          Pase Mensual{" "}
          {new Date()
            .toLocaleString("es-ES", { month: "long" })
            .charAt(0)
            .toUpperCase() +
            new Date()
              .toLocaleString("es-ES", { month: "long" })
              .slice(1)
              .toLowerCase()}
        </Typography>

        {/* Subtítulo informativo */}
        <Typography
          variant="subtitle2"
          sx={{
            mt: 0.4,
            fontSize: { xs: "0.6rem", sm: "0.8rem" },
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.5,
            textShadow: "1px 1px 3px rgba(0,0,0,.5)",
          }}
        >
          ℹ️ Completa tareas y gana descuentos
        </Typography>

        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFF",
            zIndex: 3,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            "@keyframes spinTwice": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(720deg)" },
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>



      {/* CONTENIDO */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="pase-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <DialogContent
              sx={{
                py: 1,
                px: 1.3,
                transform: `scale(${scaleFactor})`, // 👈 escala todo el contenido
                transformOrigin: "top center",       // se ajusta desde arriba
              }}
            >
              {/* Texto de suscripción actual con borde */}
              <Box
                sx={{
                  px: 2,
                  py: 0.6,
                  mb: 1,
                  border: "2px solid #fff",
                  borderRadius: 2,
                  background: "rgba(0,0,0,0.6)",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    color: "#fff",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    fontFamily: "'Luckiest Guy','Poppins', sans-serif",
                  }}
                >
                  SUSCRIPCIÓN ACTUAL:{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "#FFD700",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                      textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
                      fontFamily: "'Luckiest Guy','Poppins', sans-serif",
                    }}
                  >
                    ${displayMonto.toLocaleString("es-CL")} CLP
                  </Box>
                </Typography>

              </Box>
              {/* Grid para misiones pequeñas */}
              <Grid container spacing={1}>
                {misiones
                  .filter((m) => m.tipo === "pequeña")
                  .map((m) => (
                    <Grid item xs={6} sm={6} key={m.id}>
                      <Box sx={{ position: "relative" }}>
                        {/* Tarjeta misión */}
                        <Box
                          onClick={() => {
                            if (m.id === 4 && !analyticsDisponible) return; // 🚫 bloqueado
                            if (m.estado === "pendiente") handleAccion(m.id);
                          }}
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            background: m.color,
                            color: "#fff",
                            textAlign: "center",
                            minHeight: 120,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor:
                              m.id === 4 && !analyticsDisponible
                                ? "not-allowed"
                                : m.estado === "pendiente"
                                  ? "pointer"
                                  : "default",
                            position: "relative",
                            overflow: "hidden", // evita que el brillo se salga
                            boxShadow: `
      inset 0 2px 4px rgba(255,255,255,0.25),
      inset 0 -3px 5px rgba(0,0,0,0.5),
      0 4px 0 #222,
      0 8px 10px rgba(0,0,0,0.6)
    `,
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-50%",
                              width: "40%",
                              height: "100%",
                              background:
                                "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                              filter: "blur(4px)", // ✨ brillo más suave
                              transform: "skewX(-15deg)",
                              animation:
                                m.estado === "pendiente" && !(m.id === 4 && !analyticsDisponible)
                                  ? "shine 3.5s infinite"
                                  : "none",
                            },
                            "@keyframes shine": {
                              "0%": { left: "-50%" },
                              "100%": { left: "120%" },
                            },
                          }}
                        >
                          {/* Imagen */}
                          <Box
                            component="img"
                            src={m.imagen}
                            alt={m.descripcion}
                            sx={{
                              width: m.width,
                              height: m.height,
                              objectFit: "contain",
                              mb: 0.5,
                            }}
                          />

                          {/* Texto */}
                          <Typography
                            variant="caption"
                            sx={{
                              mt: 0.5,
                              fontWeight: 600,
                              fontSize: { xs: "0.75rem", sm: "0.85rem" },
                              textAlign: "center",
                            }}
                          >
                            {m.descripcion}
                          </Typography>

                          {/* 🔒 Bloqueada */}
                          {m.id === 4 && !analyticsDisponible && (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.7)",
                                borderRadius: 2,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                color: "red",
                                fontWeight: 900,
                                fontSize: "0.8rem",
                                textAlign: "center",
                                px: 1,
                              }}
                            >
                              🔒 Bloqueada <br /> Requiere Google Analytics
                            </Box>
                          )}

                          {/* ⏳ En revisión */}
                          {m.estado === "revision" && (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.65)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 2,
                                color: "#fff",
                              }}
                            >
                              <AccessTimeFilledRoundedIcon
                                sx={{
                                  fontSize: { xs: 28, sm: 34 },
                                  animation: "clockTick 12s steps(12) infinite",
                                  transformOrigin: "center center",
                                  "@keyframes clockTick": {
                                    from: { transform: "rotate(0deg)" },
                                    to: { transform: "rotate(360deg)" },
                                  },
                                }}
                              />
                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                En revisión
                              </Typography>
                            </Box>
                          )}

                          {/* ✅ Aprobado */}
                          {m.estado === "aprobado" && (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(180deg, rgba(0,200,0,0.8) 0%, rgba(0,200,0,0.5) 50%, rgba(0,200,0,0.2) 100%)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 2,
                                color: "#fff",
                                backdropFilter: "blur(2px)", // 🔥 un pelín de blur detrás
                              }}
                            >
                              <Typography
                                component="div"
                                sx={{
                                  fontSize: { xs: "2rem", sm: "2.5rem" },
                                  mb: 0.5,
                                  textShadow: "0 0 8px rgba(0,0,0,0.6)",
                                }}
                              >
                                ✅
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                                }}
                              >
                                Aprobado
                              </Typography>
                            </Box>
                          )}

                          {/* ❌ Rechazado */}
                          {m.estado === "rechazado" && (
                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(180deg, rgba(200,0,0,0.8) 0%, rgba(200,0,0,0.5) 50%, rgba(200,0,0,0.2) 100%)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 2,
                                color: "#fff",
                                backdropFilter: "blur(2px)", // 🔥 mismo blur
                              }}
                            >
                              <Typography
                                component="div"
                                sx={{
                                  fontSize: { xs: "2rem", sm: "2.5rem" },
                                  mb: 0.5,
                                  textShadow: "0 0 8px rgba(0,0,0,0.6)",
                                }}
                              >
                                ❌
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  fontSize: "0.95rem",
                                  textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
                                }}
                              >
                                Rechazado
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        {/* Footer negro para misiones pequeñas */}
                        <Box
                          sx={{
                            borderTop: "2px solid rgba(255,255,255,0.2)",
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            background: "rgba(0,0,0,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 1,
                            py: 0.4,
                            mt: 0, // 👈 sin margen arriba
                            boxShadow: "inset 0 2px 3px rgba(255,255,255,0.15)",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              fontSize: "0.7rem",
                              color: "#FFD700",
                              textAlign: "center",
                              letterSpacing: 0.3,
                              textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                            }}
                          >
                            🎁 {Math.round(m.descuento * 1000) / 10}% DESCUENTO
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
              </Grid>


              {/* Misión grande */}
              <Box sx={{ mt: 2 }}>
                {misiones
                  .filter((m) => m.tipo === "grande")
                  .map((m) => (
                    <Box key={m.id} sx={{ position: "relative" }}>
                      {/* Tarjeta principal */}
                      <Box
                        onClick={() => m.estado === "pendiente" && handleAccion(m.id)}
                        sx={{
                          p: 1.5,
                          borderTopLeftRadius: 6,
                          borderTopRightRadius: 6,
                          borderBottomLeftRadius: 0,
                          borderBottomRightRadius: 0,
                          background: m.color,
                          textAlign: "center",
                          cursor: m.estado === "pendiente" ? "pointer" : "not-allowed",
                          transition: "transform 0.25s ease, box-shadow 0.25s ease",
                          overflow: "hidden",
                          position: "relative",

                          // ✨ Brillo base elegante
                          boxShadow: `
      inset 0 2px 5px rgba(255,255,255,0.4),
      inset 0 -2px 6px rgba(0,0,0,0.5),
      0 6px 14px rgba(0,0,0,0.4)
    `,

                          "&:hover": {
                            transform: m.estado === "pendiente" ? "translateY(-5px)" : "none",
                            boxShadow: `
    inset 0 3px 6px rgba(255,255,255,0.5),
    inset 0 -4px 6px rgba(0,0,0,0.6),
    0 8px 0 #222,
    0 14px 16px rgba(0,0,0,0.7)
  `,
                            filter: m.estado === "revision" ? "brightness(1.05)" : "none", // 👈 revisión con un brillito sutil
                          },
                          // ✨ Overlay animado de shine
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-50%",
                            width: "40%",
                            height: "100%",
                            background:
                              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                            filter: "blur(6px)", // brillo difuminado
                            transform: "skewX(-15deg)",
                            animation: m.estado === "pendiente" ? "shineMove 4s infinite" : "none",
                          },

                          "@keyframes shineMove": {
                            "0%": { left: "-50%" },
                            "100%": { left: "130%" },
                          },
                        }}
                      >
                        {/* Texto de descripción */}
                        <Typography
                          variant="body2"
                          sx={{
                            mt: 0.8,
                            mb: 0.8,
                            fontWeight: 600,
                            fontSize: { xs: "0.8rem", sm: "0.95rem" },
                            color: "#FFF8DC",
                            textShadow: `
                -1px -1px 2px rgba(0,0,0,0.6),
                 1px -1px 2px rgba(0,0,0,0.6),
                -1px  1px 2px rgba(0,0,0,0.6),
                 1px  1px 2px rgba(0,0,0,0.6)
              `,
                          }}
                        >
                          {m.descripcion}
                        </Typography>

                        {/* ⏳ En revisión */}
                        {m.estado === "revision" && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(0,0,0,0.65)",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 2,
                              color: "#fff",
                            }}
                          >
                            <AccessTimeFilledRoundedIcon
                              sx={{
                                fontSize: { xs: 28, sm: 34 },
                                animation: "clockTick 12s steps(12) infinite",
                                transformOrigin: "center center",
                                "@keyframes clockTick": {
                                  from: { transform: "rotate(0deg)" },
                                  to: { transform: "rotate(360deg)" },
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              En revisión
                            </Typography>
                          </Box>
                        )}

                        {/* ✅ Aprobado */}
                        {m.estado === "aprobado" && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(0,128,0,0.75)", // verde translúcido
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 2,
                              color: "#fff",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              ✅ Aprobado
                            </Typography>
                          </Box>
                        )}

                        {/* ❌ Rechazado */}
                        {m.estado === "rechazado" && (
                          <Box
                            sx={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(139,0,0,0.75)", // rojo oscuro translúcido
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 2,
                              color: "#fff",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              ❌ Rechazado
                            </Typography>
                          </Box>
                        )}

                      </Box>

                      {/* Footer negro */}
                      <Box
                        sx={{
                          borderBottomLeftRadius: 6,
                          borderBottomRightRadius: 6,
                          background: "rgba(0,0,0,0.9)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          px: 1,
                          py: 0.4,
                          boxShadow: "inset 0 2px 3px rgba(255,255,255,0.15)",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, fontSize: "0.7rem", color: "#FFD700" }}
                        >
                          1/1
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            color: "#fff",
                            letterSpacing: 0.3,
                            textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                          }}
                        >
                          🎁 2 SUSCRIPCIONES GRATIS
                        </Typography>

                        <Button
                          size="small"
                          sx={{
                            minWidth: "auto",
                            p: 0.2,
                            color: "#FFD700",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                          }}
                        >
                          ℹ️
                        </Button>
                      </Box>
                    </Box>
                  ))}
              </Box>




              {/* Swiper anuncio */}
              <Grid item xs={12} sx={{ mt: 1 }}>
                <motion.div initial="hidden" animate={"visible"}>
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
                    className="custom-swiper"
                  >

                    {/* Slide 1: Modulos */}
                    <SwiperSlide>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "visible",
                          borderRadius: "30px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                          minHeight: isMobile ? 100 : 110,
                          display: "flex",
                          alignItems: "flex-end",
                          backgroundColor: "transparent",
                          boxShadow: "none",
                          border: "none",
                        }}
                        elevation={0}
                      >
                        {/* 📌 Precio extensión del Box verde */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: isMobile ? "calc(35% - 28px)" : "calc(35% - 35px)", // 👈 se pega justo arriba del verde (ajusta 22px al alto del cuadro)
                            right: 15,
                            alignItems: "right",
                            px: 1.5,
                            py: 0.4,
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            background: "rgba(0,0,0,0.75)",
                            color: "white",
                            fontWeight: 800,
                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                            zIndex: 1, // 👈 debajo de la imagen de mascotas
                          }}
                        >
                          COTIZAR
                        </Box>
                        {/* Box azul */}
                        <Box
                          sx={{
                            flex: 1,
                            background:
                              "linear-gradient(135deg, hsl(210,80%,55%), hsl(220,70%,35%))",
                            borderRadius: "30px",
                            p: isMobile ? 1.8 : 1.5,
                            height: isMobile ? "45px" : "55px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "100%",
                            alignItems: "flex-end",
                            cursor: "pointer",
                            zIndex: 2,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleContactClick("Sistemas");
                          }}
                        >
                          <Box sx={{ maxWidth: "65%", textAlign: "right" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                mb: 0.3,
                                color: "#fff",
                                fontSize: { xs: "0.95rem", sm: "1.2rem", md: "1.5rem" },
                              }}
                            >
                              ⚙️Nuevos Módulos
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#fff",
                                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                              }}
                            >
                              Solicítanos nuevos desarrollos.
                            </Typography>
                          </Box>
                        </Box>

                        {/* Imagen mockup izquierda */}
                        <Box
                          sx={{
                            position: "absolute",
                            left: -30,
                            bottom: -85,
                            height: "250%",
                            aspectRatio: "572 / 788",
                            zIndex: 2,
                            transform: "scaleX(-1)",
                          }}
                        >
                          <Box
                            component="img"
                            src="/modulos.png"
                            alt="Modulos"
                            sx={{
                              height: "100%",          // siempre ocupa todo el alto
                              width: "auto",           // mantiene proporción
                              objectFit: "contain",    // no recorta
                              zIndex: 1,
                              pointerEvents: "none",
                            }}
                          />
                        </Box>
                      </Card>
                    </SwiperSlide>

                    {/* Slide 2: Mascotas */}
                    <SwiperSlide>
                      <Card
                        sx={{
                          position: "relative",
                          overflow: "visible",
                          borderRadius: "30px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                          minHeight: isMobile ? 100 : 110,
                          display: "flex",
                          alignItems: "flex-end",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        elevation={0}
                      >
                        {/* 📌 Precio extensión del Box verde */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: isMobile ? "calc(35% - 28px)" : "calc(35% - 38px)", // 👈 se pega justo arriba del verde (ajusta 22px al alto del cuadro)
                            left: "10px",
                            px: 1.5,
                            py: 0.4,
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                            background: "rgba(0,0,0,0.75)",
                            color: "white",
                            fontWeight: 800,
                            fontSize: { xs: "0.75rem", sm: "0.85rem" },
                            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                            zIndex: 1, // 👈 debajo de la imagen de mascotas
                          }}
                        >
                          $10.000 CLP
                        </Box>



                        {/* Box verde */}
                        <Box
                          sx={{
                            flex: 1,
                            background:
                              "linear-gradient(135deg, hsl(142,70%,49%), hsl(142,80%,35%))",
                            borderRadius: "30px",
                            p: isMobile ? 1.8 : 2,
                            height: isMobile ? "45px" : "55px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "100%",
                            cursor: "pointer",
                            zIndex: 1,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleContactClick("Sitios Web");
                          }}
                        >
                          <Box sx={{ maxWidth: "65%" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                mb: 0.2,
                                textAlign: "left",
                                color: "#fff",
                                fontSize: isMobile ? "0.95rem" : "1.5rem",
                              }}
                            >
                              TUS MÁSCOTAS🐾
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                color: "#fff",
                                textAlign: "left",
                                fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                lineHeight: 1.2,
                              }}
                            >
                              🐶🐱Aparecerán en tu Web.
                            </Typography>
                          </Box>
                        </Box>

                        {/* Imagen mockup derecha */}
                        <Box
                          sx={{
                            position: "absolute",
                            right: 10,
                            bottom: isMobile ? -30 : -30,
                            height: "160%",
                            zIndex: 2,
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          <Box
                            component="img"
                            src="/mascotas.webp"
                            alt="Mascotas"
                            sx={{
                              height: "100%",
                              width: "auto",
                              objectFit: "contain",
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


            </DialogContent>


          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
