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


export default function DialogPaseMensual({ open, onClose }) {
  const montoBase = 10000;
  const [monto, setMonto] = useState(montoBase);
  const [misiones, setMisiones] = useState([
    { id: 1, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Compartir un anuncio de Plataformas web", estado: "pendiente", color: "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)", tipo: "pequeña", imagen: "/facebook-insta.png", width: 70, height: 40 },
    { id: 2, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Pagar suscripción antes de fin de mes", estado: "pendiente", color: "linear-gradient(135deg,#81C784,#43A047,#1B5E20)", tipo: "pequeña", imagen: "/logo-pagar.png", width: 50, height: 50 },
    { id: 3, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Conexión mensual a la administración", estado: "pendiente", color: "linear-gradient(135deg,#80DEEA,#26C6DA,#00838F)", tipo: "pequeña", imagen: "/conexion.png", width: 55, height: 45 },
    { id: 4, descuento: 0.025, recompensa: "2,5% descuento", descripcion: "Llegar a 100 visitas mensual", estado: "pendiente", color: "linear-gradient(135deg,#BA68C8,#8E24AA,#4A148C)", tipo: "pequeña", imagen: "/visitas.png", width: 45, height: 45 },
    { id: 5, descuento: 1, recompensa: "100%", descripcion: "Conseguir un Cliente para Plataformas web", estado: "pendiente", color: "linear-gradient(135deg,#FFF176,#FFD54F,#FFA000,#FF6F00)", tipo: "grande", imagen: "/mision5.png", width: 90, height: 60 }
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const motionValue = useMotionValue(monto);
  const [displayMonto, setDisplayMonto] = useState(monto);

  useEffect(() => {
    const controls = animate(motionValue, monto, {
      duration: 1.2, // duración de la animación
      ease: "easeOut",
      onUpdate: (latest) => setDisplayMonto(Math.round(latest)),
    });
    return () => controls.stop();
  }, [monto]);

  const handleAccion = (id) => {
    setMisiones((prev) =>
      prev.map((m) => {
        if (m.id === id && m.estado === "pendiente") {
          const updated = prev.map((x) =>
            x.id === id ? { ...x, estado: "revision" } : x
          );

          // calcular descuento total de todas las misiones en revisión
          const totalDescuento = updated
            .filter((x) => x.estado === "revision")
            .reduce((acc, x) => acc + x.descuento, 0);

          // monto = montoBase - (montoBase * totalDescuento)
          const nuevoMonto =
            montoBase - Math.round(montoBase * totalDescuento);

          // nunca menos de 0
          setMonto(Math.max(nuevoMonto, 0));

          return { ...m, estado: "revision" };
        }
        return m;
      })
    );
  };


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
          background: "linear-gradient(90deg,#1565C0,#1E88E5,#42A5F5)",
          color: "#fff",
          borderBottom: "3px solid #FFD700",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Typography
          component="div"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: { xs: "1rem", sm: "1.3rem" }, // compacto
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
            new Date().toLocaleString("es-ES", { month: "long" }).slice(1).toLowerCase()}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseRoundedIcon />
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
            <DialogContent sx={{ py: 1, px: 1.3 }}>
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
                          onClick={() => m.estado === "pendiente" && handleAccion(m.id)}
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
                            cursor: m.estado === "pendiente" ? "pointer" : "not-allowed",
                            transition: "transform 0.12s ease, box-shadow 0.12s ease",

                            // 🎨 Estilo 3D más fuerte
                            boxShadow: `
                inset 0 3px 6px rgba(255,255,255,0.4),   /* brillo superior */
                inset 0 -4px 6px rgba(0,0,0,0.5),        /* sombra interna abajo */
                0 6px 0 #222,                            /* base sólida */
                0 10px 12px rgba(0,0,0,0.6)              /* sombra externa */
              `,

                            "&:hover": {
                              transform: m.estado === "pendiente" ? "translateY(-5px)" : "none",
                              boxShadow: `
                  inset 0 3px 6px rgba(255,255,255,0.5),
                  inset 0 -4px 6px rgba(0,0,0,0.6),
                  0 8px 0 #222,
                  0 14px 16px rgba(0,0,0,0.7)
                `,
                            },
                            "&:active": {
                              transform: m.estado === "pendiente" ? "translateY(4px)" : "none",
                              boxShadow: `
                  inset 0 2px 3px rgba(255,255,255,0.3),
                  inset 0 -2px 3px rgba(0,0,0,0.7),
                  0 2px 0 #222,
                  0 4px 6px rgba(0,0,0,0.6)
                `,
                            },
                          }}
                        >
                          {/* Imagen de misión */}
                          <Box
                            component="img"
                            src={m.imagen}
                            alt={m.descripcion}
                            sx={{
                              width: m.width,
                              height: m.height,
                              objectFit: "contain", // evita que se deforme
                              mb: 0.5
                            }}
                          />

                          {/* Texto misión */}
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

                          {/* Overlay revisión */}
                          {m.estado === "revision" && (

                            <Box
                              sx={{
                                position: "absolute",
                                inset: 0,
                                background: "rgba(0,0,0,0.6)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#fff",
                                borderRadius: 2,
                              }}
                            >
                              <AccessTimeFilledRoundedIcon
                                sx={{
                                  fontSize: { xs: 28, sm: 34 },
                                  animation: "clockTick 12s steps(12) infinite",
                                  transformOrigin: "center center", // fijo al centro
                                  mt: "-1px",
                                  "@keyframes clockTick": {
                                    from: { transform: "rotate(0deg)" },
                                    to: { transform: "rotate(360deg)" },
                                  },
                                  "@media (prefers-reduced-motion: reduce)": {
                                    animation: "none",
                                  },
                                }}
                              />


                              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                En revisión
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Footer negro pegado */}
                        <Box
                          sx={{
                            mt: 0,
                            borderBottomLeftRadius: 6,
                            borderBottomRightRadius: 6,
                            background: "rgba(0,0,0,0.85)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 1,
                            py: 0.3,
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
                            sx={{ fontWeight: 700, fontSize: "0.75rem", color: "#fff" }}
                          >
                            {m.recompensa}
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
                    </Grid>
                  ))}
              </Grid>


              {/* Misión grande */}
              <Box sx={{ mt: 1 }}>
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
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          overflow: "hidden",

                          // ✨ Brillo interior blanco
                          boxShadow: `
              inset 0 2px 6px rgba(255,255,255,0.6),
              inset 0 -2px 6px rgba(0,0,0,0.4),
              inset 0 0 12px rgba(255,255,255,0.4)
            `,
                          animation: "innerShine 3s ease-in-out infinite",

                          "@keyframes innerShine": {
                            "0%, 100%": {
                              boxShadow: `
                  inset 0 2px 6px rgba(255,255,255,0.5),
                  inset 0 -2px 6px rgba(0,0,0,0.2),
                  inset 0 0 8px rgba(255,255,255,0.3)
                `,
                            },
                            "50%": {
                              boxShadow: `
                  inset 0 4px 10px rgba(255,255,255,0.9),
                  inset 0 -3px 8px rgba(0,0,0,0.5),
                  inset 0 0 16px rgba(255,255,255,0.6)
                `,
                            },
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

                        {/* Overlay En revisión */}
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
                              borderTopLeftRadius: 6,
                              borderTopRightRadius: 6,
                              color: "#fff",
                            }}
                          >
                            <AccessTimeFilledRoundedIcon
                              sx={{
                                fontSize: { xs: 28, sm: 34 },
                                animation: "clockTick 12s steps(12) infinite",
                                transformOrigin: "center center", // fijo al centro
                                mt: "-1px",
                                "@keyframes clockTick": {
                                  from: { transform: "rotate(0deg)" },
                                  to: { transform: "rotate(360deg)" },
                                },
                                "@media (prefers-reduced-motion: reduce)": {
                                  animation: "none",
                                },
                              }}
                            />

                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              En revisión
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
                    {/* Slide 1: Mascotas */}
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

                    {/* Slide 2: Sistemas */}
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
                          $10.000 CLP
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
