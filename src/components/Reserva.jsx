// src/components/Reserva.jsx
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Reserva = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "success" | "canceled"
  const [resultado, setResultado] = useState(null);
  const [subrayadoActivo, setSubrayadoActivo] = useState(false);

  const [searchParams] = useSearchParams();

  const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.4 + i * 0.1 },
    }),
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setSubrayadoActivo(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const tbkToken = searchParams.get("TBK_TOKEN");
    const token_ws = searchParams.get("token_ws");

    if (tbkToken) {
      setResultado({
        status: "CANCELED",
        buy_order: searchParams.get("TBK_ORDEN_COMPRA") || null,
        session_id: searchParams.get("TBK_ID_SESION") || null,
      });
      setStatus("canceled");
      return;
    }

    if (!token_ws) return;

    const email = sessionStorage.getItem("emailReserva");
    const endpoint =
      window.location.hostname === "localhost"
        ? "http://localhost:8888/.netlify/functions/agregarReserva"
        : "/.netlify/functions/agregarReserva";

    setStatus("loading");

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_ws, email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Respuesta backend:", data);
        setResultado(data);
        setStatus("success");
      })
      .catch((err) => {
        console.error("⚠️ Error confirmando/agregando:", err);

        // ⚠️ fallback → seguimos mostrando success pero con status UNKNOWN
        setResultado({
          status: "UNKNOWN",
          error: "Pago procesado en Transbank, pero no pudimos guardar la reserva.",
        });
        setStatus("success");
      });
  }, [searchParams]);

  const renderResultado = () => {
    if (status === "idle" || status === "loading") {
      return (
        <>
          <CircularProgress color="secondary" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Procesando tu pago...
          </Typography>
        </>
      );
    }
    if (status === "success" && resultado?.status === "ABORTED") {
      return (
        <>
          <Typography
            variant="h5"
            fontWeight={700}
            color="warning.main"
            sx={{ mb: 2, textAlign: "center" }}
          >
            🚫 Transacción abortada
          </Typography>
          <Typography sx={{ mb: 3, textAlign: "center" }}>
            La transacción fue cancelada o no llegó a completarse en Webpay.
            No se realizó ningún cargo en tu tarjeta.
          </Typography>
        </>
      );
    }
    if (status === "canceled") {
      return (
        <>
          <Typography
            variant="h5"
            fontWeight={700}
            color="warning.main"
            sx={{ mb: 2, textAlign: "center" }}
          >
            🚫 Transacción cancelada
          </Typography>
          <Typography sx={{ mb: 3, textAlign: "center" }}>
            Has cancelado el pago en Webpay. No se ha realizado ningún cargo.
          </Typography>
        </>
      );
    }

    if (status === "success") {
      if (resultado?.status === "AUTHORIZED") {
        return (
          <>
            <Box
              component={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 10 }}
              sx={{ mb: 2, display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                }}
              >
                <Typography variant="h3" sx={{ color: "white" }}>
                  ✓
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              fontWeight={700}
              color="success.main"
              textAlign="center"
              sx={{ mb: 2 }}
            >
              Pago Aprobado
            </Typography>

            <Typography sx={{ mb: 3, textAlign: "center" }}>
              ¡Gracias por tu reserva! Hemos recibido tu pago correctamente.
            </Typography>

            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "0.8rem", sm: "1rem" },
                textAlign: "center",
                color: "text.secondary",
                mb: 2,
              }}
            >
              📞 Nos comunicaremos contigo a la brevedad.
            </Typography>

            <Box textAlign="center">
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#25D366",
                  "&:hover": { bgcolor: "#1ebe5b" },
                  borderRadius: "30px",
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  textTransform: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                }}
                href="https://api.whatsapp.com/send?phone=56946873014"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon sx={{ fontSize: 22 }} />
                Contactar por WhatsApp
              </Button>
            </Box>
          </>
        );
      }

      if (resultado?.status === "REJECTED") {
        return (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="error.main"
              sx={{ mb: 2, textAlign: "center" }}
            >
              ❌ Pago Rechazado
            </Typography>
            <Typography sx={{ mb: 3, textAlign: "center" }}>
              Tu transacción no pudo ser procesada.
            </Typography>
          </>
        );
      }

      if (resultado?.status === "UNKNOWN") {
        return (
          <>
            <Typography
              variant="h5"
              fontWeight={700}
              color="warning.main"
              sx={{ mb: 2, textAlign: "center" }}
            >
              ⚠️ Pago recibido, pero no guardado
            </Typography>
            <Typography sx={{ mb: 3, textAlign: "center" }}>
              {resultado.error}
            </Typography>
          </>
        );
      }
    }

    return null;
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        py: 14,
        backgroundImage: "url(/fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography
          variant={isMobile ? "h6" : "h6"}
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
              background: "linear-gradient(90deg, #6A1B9A, #8E24AA)",
              transition: "width 0.6s ease-out",
            },
          }}
        >
          {"Transbank Reserva Plataformas Web".split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            maxWidth: 500,
            width: "90%",
            borderRadius: "16px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
            background: "rgba(255,255,255,0.95)",
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            {renderResultado()}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Reserva;
