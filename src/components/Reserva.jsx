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
  useMediaQuery
} from "@mui/material";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
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
    if (!token_ws) {
      setLoading(false);
      return;
    }

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
        console.log("➡️ Resultado recibido del commit:", data);
        setResultado(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error confirmando:", err);
        setLoading(false);
      });
  }, [searchParams]);

  const renderResultado = () => {
    if (loading) {
      return (
        <>
          <CircularProgress color="secondary" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Procesando tu pago...
          </Typography>
        </>
      );
    }

    if (!resultado) {
      return (
        <>
          {/* Título */}
          <Typography
            variant="h5"
            fontWeight={700}
            color="error.main"
            component={motion.div}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            sx={{
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" }, // más pequeño en mobile
              textAlign: "center",
            }}
          >
            ⚠️ Error en la transacción
          </Typography>

          {/* Mensaje explicativo */}
          <Typography
            sx={{
              mb: 3,
              px: { xs: 1, sm: 2 }, // menos padding en mobile
              fontSize: { xs: "0.85rem", sm: "1rem" },
              textAlign: "center",
            }}
          >
            No recibimos información de la transacción desde Transbank.
            Esto puede ocurrir si cerraste la ventana de pago antes de finalizar,
            perdiste la conexión, o el tiempo de sesión expiró.
          </Typography>

          {/* Caja de ayuda */}
          <Box
            sx={{
              mb: 4,
              p: { xs: 1.5, sm: 2 },
              borderRadius: "12px",
              bgcolor: "grey.100",
              textAlign: "left",
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 1,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              ¿Qué puedes hacer?
            </Typography>
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              <li>Verifica tu conexión a internet.</li>
              <li>Asegúrate de completar todo el flujo en la página de pago.</li>
              <li>Intenta realizar la compra nuevamente.</li>
            </ul>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                flex: 1,
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                },
              }}
              onClick={() => (window.location.href = "/")}
            >
              🔄 Reintentar Compra
            </Button>

            <Button
              variant="outlined"
              color="primary"
              sx={{
                flex: 1,
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
              href="/"
            >
              ⬅️ Volver al inicio
            </Button>
          </Box>
        </>

      );
    }

    if (resultado.status === "AUTHORIZED") {
      return (
        <>
          {/* Ícono de éxito animado */}
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }}
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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

          {/* Título */}
          <Typography
            variant="h5"
            fontWeight={700}
            color="success.main"
            textAlign="center"
            sx={{ mb: 2 }}
          >
            Pago Aprobado
          </Typography>

          {/* Mensaje principal */}
          <Typography
            sx={{
              mb: 3,
              fontSize: { xs: "0.95rem", sm: "1rem" },
              color: "text.primary",
              textAlign: "center",
            }}
          >
            ¡Gracias por tu reserva! Hemos recibido tu pago correctamente.
            Nos comunicaremos contigo para continuar con el proceso.
          </Typography>

          {/* Caja con detalles */}
          <Box
            sx={{
              mb: 4,
              p: 2.5,
              borderRadius: "12px",
              bgcolor: "success.light",
              color: "success.contrastText",
              textAlign: "left",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            component={motion.div}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Typography>
              <b>Orden:</b> {resultado.buy_order}
            </Typography>
            <Typography>
              <b>Monto:</b>{" "}
              ${resultado.amount?.toLocaleString("es-CL") || "30.000"} CLP
            </Typography>
            {resultado.installments_number > 1 && (
              <Typography>
                <b>Cuotas:</b> {resultado.installments_number}
              </Typography>
            )}
            {resultado.card_detail?.card_number && (
              <Typography>
                <b>Tarjeta:</b> **** **** ****{" "}
                {resultado.card_detail.card_number.slice(-4)}
              </Typography>
            )}
          </Box>

          {/* Mensaje final */}
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: "text.secondary",
              mb: 2,
            }}
          >
            📞 Nos comunicaremos contigo a la brevedad.
          </Typography>

          {/* Botón WhatsApp */}
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

    return (
      <>
        <>
          {/* Título principal */}
          <Typography
            variant="h5"
            fontWeight={700}
            color="error.main"
            component={motion.div}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            sx={{ mb: 2 }}
          >
            ❌ Pago Rechazado
          </Typography>

          {/* Subtítulo / mensaje */}
          <Typography sx={{ mb: 3, px: 2 }}>
            Tu transacción no pudo ser procesada.
            Verifica los datos de tu tarjeta o método de pago e inténtalo nuevamente.
          </Typography>

          {/* Datos adicionales */}
          {resultado && (
            <Box
              sx={{
                mb: 4,
                p: 2,
                borderRadius: "12px",
                bgcolor: "grey.100",
                textAlign: "left",
                fontSize: "0.9rem",
                boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Typography>
                <b>Orden:</b> {resultado.buy_order || "N/D"}
              </Typography>
              <Typography>
                <b>Monto:</b>{" "}
                ${resultado.amount?.toLocaleString("es-CL") || "0"} CLP
              </Typography>
              <Typography>
                <b>Estado:</b> {resultado.status || "RECHAZADO"}
              </Typography>
            </Box>
          )}

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                },
              }}
              onClick={() => window.location.href = "/"}
            >
              🔄 Reintentar Compra
            </Button>

            <Button
              variant="outlined"
              color="primary"
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.03)",
                  backgroundColor: "rgba(0,0,0,0.04)",
                },
              }}
              href="/"
            >
              ⬅️ Volver al inicio
            </Button>
          </Box>
        </>

      </>
    );
  };

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
            {renderResultado()}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Reserva;
