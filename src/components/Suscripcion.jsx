import { Box, Typography, Container, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
const Suscripcion = () => {
  const [status, setStatus] = useState("loading");
  const [info, setInfo] = useState({});
  const [subrayadoActivo, setSubrayadoActivo] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setSubrayadoActivo(true), 800);

    const tbk_user = searchParams.get("tbk_user");
    const card = searchParams.get("card");
    const type = searchParams.get("type");
    const s = searchParams.get("status");

    if (s === "success" && tbk_user) {
      setInfo({ tbk_user, card, type });
      setStatus("success");
    } else {
      setStatus("error");
    }

    return () => clearTimeout(t);
  }, [searchParams]);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        py: 14,
        backgroundImage: "url(/fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box textAlign="center" mb={0}>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "white",
            display: "inline-flex",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -2,
              left: 0,
              width: subrayadoActivo ? "100%" : "0%",
              height: "3px",
              borderRadius: "3px",
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              transition: "width 0.6s ease-out",
            },
          }}
        >
          {"Suscripción Plataformas Web".split("").map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" mt={2}>
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{
            position: "relative",
            maxWidth: 500,
            width: "90%",
            borderRadius: "20px",
            backgroundColor: "white", // fondo blanco limpio
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            overflow: "hidden",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            border: "1px solid rgba(0,0,0,0.05)",

            ...(status === "success" && {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-150%", // comienza bien fuera de la card
                width: "200%", // asegura cobertura completa
                height: "100%",
                background:
                  "linear-gradient(130deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
                animation: "shineDiagonal 3s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 1,
              },
              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(75%)" }, // movimiento más largo y natural
              },
            }),
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: 5,
              position: "relative",
              zIndex: 2, // mantiene el contenido sobre el brillo
            }}
          >
            {status === "loading" && (
              <>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2 }}>Procesando suscripción...</Typography>
              </>
            )}

            {status === "success" && (
              <>
                {/* 🎉 Ícono */}
                <Box
                  component={motion.div}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  sx={{ mb: 3 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #43A047, #2E7D32)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      boxShadow: "0 8px 25px rgba(46, 125, 50, 0.35)",
                      overflow: "hidden",

                      /* ✨ Brillo diagonal perfectamente fluido */
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-70%",
                        left: "-70%",
                        width: "240%",
                        height: "240%",
                        background:
                          "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.85) 50%, transparent 60%)",
                        mixBlendMode: "screen",
                        filter: "blur(5px)",
                        animation: "shineDiagonal 2.8s linear infinite",
                        borderRadius: "inherit",
                        pointerEvents: "none",
                      },

                      "@keyframes shineDiagonal": {
                        "0%": {
                          transform: "translateX(-140%) translateY(-50%)",
                          opacity: 0.8,
                        },
                        "100%": {
                          transform: "translateX(140%) translateY(50%)",
                          opacity: 0.8,
                        },
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        color: "white",
                        fontWeight: 700,
                        position: "relative",
                        zIndex: 1,
                        textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      ✓
                    </Typography>
                  </Box>

                </Box>

                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: "success.main",
                    mb: 0,
                    textAlign: "center",
                    textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                >
                  ¡Suscripción activada!
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    mb: 0,
                    textAlign: "center",
                    background: "linear-gradient(90deg, #4CAF50, #81C784)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Plan mensual: <strong>$9.990 CLP</strong>
                </Typography>

                {/* 💳 Logo de Transbank */}
                <Box
                  component="img"
                  src="/logo-oneclick.png"
                  alt="Webpay Transbank"
                  sx={{
                    display: "block",
                    mx: "auto",
                    mt: 0,
                    mb: 2,
                    width: 200,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                    userSelect: "none",
                  }}
                />

                {/* 💳 Detalle de la tarjeta */}
                <Typography sx={{ mt: 1, color: "text.secondary", textAlign: "center" }}>
                  Tarjeta <strong>{info.type}</strong> terminada en{" "}
                  <strong>{info.card}</strong>.
                </Typography>


                {/* 📦 Descripción del plan */}
                <Typography
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  🚀 Incluye <strong>hosting premium</strong> y{" "}
                  <strong>soporte técnico 24/7</strong> para mantener tu sitio siempre activo.
                </Typography>

                {/* 💬 Mensaje final */}
                <Typography
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  💡 Nuestro equipo está disponible para ayudarte cuando lo necesites.
                </Typography>


                <Button
                  component={motion.a}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  variant="contained"
                  sx={{
                    mt: 4,
                    borderRadius: "50px",
                    px: 4,
                    py: 1.3,
                    gap: 1,
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: "linear-gradient(90deg, #25D366, #128C7E)",
                    boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1ebe5b, #0d745f)",
                      boxShadow: "0 6px 25px rgba(37,211,102,0.55)",
                    },
                  }}
                  href="https://api.whatsapp.com/send?phone=56946873014"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon sx={{ fontSize: 22 }} />
                  Contactar Soporte
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <Typography variant="h5" color="error" fontWeight={700}>
                  ❌ Error en la suscripción
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  No fue posible completar el proceso. Por favor intenta nuevamente o contáctanos.
                </Typography>
              </>
            )}
          </CardContent>
        </Card>

      </Box>
    </Container>
  );
};

export default Suscripcion;
