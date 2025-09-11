// src/components/Reserva.jsx
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Reserva = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [subrayadoActivo, setSubrayadoActivo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();

  // Animación de letras
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

  // Confirmar transacción en el backend
  useEffect(() => {
    const token_ws = searchParams.get("token_ws");
    if (!token_ws) return;

    fetch(
      window.location.hostname === "localhost"
        ? "http://localhost:8888/.netlify/functions/confirmarTransaccion"
        : "/.netlify/functions/confirmarTransaccion",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_ws }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setResultado(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error confirmando:", err);
        setLoading(false);
      });
  }, [searchParams]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100%",
        py: 14,
        px: 0,
        pb: 3.5,
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url(/fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      {/* Título */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
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
          {"Transbank".split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
            >
              {char}
            </motion.span>
          ))}
        </Typography>
      </Box>

      {/* Card resultado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
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
            {loading ? (
              <Typography variant="h6" color="text.secondary">
                Procesando pago...
              </Typography>
            ) : resultado?.status === "AUTHORIZED" ? (
              <>
                <Typography variant="h5" fontWeight={700} color="success.main">
                  ✅ Pago Aprobado
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Gracias por tu reserva. Hemos recibido tu pago.
                </Typography>
                <Typography sx={{ mt: 2, fontSize: "0.9rem" }}>
                  Orden: <b>{resultado.buy_order}</b>
                  <br />
                  Monto:{" "}
                  <b>
                    ${resultado.amount?.toLocaleString("es-CL") || "30.000"} CLP
                  </b>
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight={700} color="error.main">
                  ❌ Pago Rechazado
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Tu transacción no pudo ser procesada.
                </Typography>
              </>
            )}

            <Button
              variant="contained"
              color="primary"
              href="/"
              sx={{ mt: 3, borderRadius: "8px", px: 3 }}
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Reserva;
