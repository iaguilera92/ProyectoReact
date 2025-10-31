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

    // 🔹 Datos del cliente desde sessionStorage
    const clienteNombre = sessionStorage.getItem("clienteNombre");
    const clienteCorreo = sessionStorage.getItem("clienteCorreo");
    const sitioWebReserva = sessionStorage.getItem("sitioWebReserva");
    const idCliente = sessionStorage.getItem("clienteId");

    if (s === "success" && tbk_user) {
      setInfo({
        tbk_user,
        card,
        type,
        nombre: clienteNombre,
        correo: clienteCorreo,
        sitioWeb: sitioWebReserva,
      });
      setStatus("success");

      // 🟢 Actualizar en Excel que el cliente está suscrito
      if (idCliente) {
        actualizarASuscrito(idCliente, true);
      } else {
        console.warn("⚠️ idCliente no encontrado en sessionStorage");
      }
    } else {
      setStatus("error");
    }

    return () => clearTimeout(t);
  }, [searchParams]);

  // ✅ Registrar suscripción en Excel S3
  useEffect(() => {
    const s = searchParams.get("status");
    const tbk_user = searchParams.get("tbk_user");
    const idCliente = searchParams.get("idCliente");

    if (s === "success" && idCliente) {
      (async () => {
        try {
          const url = `${window.location.hostname === "localhost"
            ? "http://localhost:8888"
            : ""
            }/.netlify/functions/actualizarCliente`;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idCliente,
              suscripcion: true,
              tbk_user,
            }),
          });

          const data = await res.json();
          console.log("📊 Resultado de registro:", data);
        } catch (err) {
          console.error("❌ Error al registrar suscripción:", err);
        }
      })();
    }
  }, [searchParams]);

  // ✅ Actualizar columna "Suscripcion" en Excel (S3)
  const actualizarASuscrito = async (idCliente, nuevoEstado) => {
    try {
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/actualizarCliente`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCliente,
          suscripcion: nuevoEstado, // 👈 true = activar, false = anular
        }),
      });

      const data = await res.json();
      console.log("🔄 Suscripción actualizada:", data);

      if (!res.ok) {
        throw new Error("Error al actualizar la suscripción en Excel");
      }
    } catch (err) {
      console.error("❌ Error al actualizar suscripción:", err);
    }
  };

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
            backgroundColor: "white",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
            ...(status === "success" && {
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-150%",
                width: "200%",
                height: "100%",
                background:
                  "linear-gradient(130deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
                animation: "shineDiagonal 3s ease-in-out infinite",
                pointerEvents: "none",
                zIndex: 1,
              },
              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(75%)" },
              },
            }),
          }}
        >
          <CardContent
            sx={{
              textAlign: "center",
              py: { xs: 3, sm: 3 },
              px: { xs: 2, sm: 4 },
              position: "relative",
              zIndex: 2,
            }}
          >
            {status === "loading" && (
              <>
                <CircularProgress color="primary" />
                <Typography sx={{ mt: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                  Procesando suscripción...
                </Typography>
              </>
            )}

            {status === "success" && (
              <>
                {/* ✅ Ícono check */}
                <Box
                  component={motion.div}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  sx={{ mb: { xs: 1, sm: 1 } }}
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
                    mb: 1,
                    fontSize: { xs: "1.2rem", sm: "1.8rem" },
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
                    background: "linear-gradient(90deg, #4CAF50, #81C784)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "0.9rem", sm: "1.2rem" },
                  }}
                >
                  Plan mensual: <strong>$9.990 CLP</strong>
                </Typography>

                {/* 🧾 Sitio web suscrito */}
                <Box
                  sx={{
                    mt: 2,
                    mb: 1,
                    px: 2,
                    py: 1.3,
                    borderRadius: 2,
                    background: "linear-gradient(180deg,#E8F5E9 0%,#F1F8E9 100%)",
                    border: "1px solid rgba(76,175,80,0.3)",
                    boxShadow: "0 3px 8px rgba(76,175,80,0.1)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2E7D32",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      lineHeight: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.5,
                    }}
                  >
                    🌐 <strong>{info.sitioWeb || "Sitio no disponible"}</strong>
                  </Typography>
                </Box>

                {/* 💳 Logo Oneclick */}
                <Box
                  component="img"
                  src="/logo-oneclick.png"
                  alt="Webpay Transbank"
                  sx={{
                    display: "block",
                    mx: "auto",
                    mt: 1,
                    mb: 2,
                    width: { xs: 150, sm: 200 },
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                    userSelect: "none",
                  }}
                />

                {/* 💳 Tarjeta */}
                <Typography
                  sx={{
                    mt: 1,
                    color: "text.secondary",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  👤 <strong>{info.nombre || "Cliente"}</strong>
                  <br />
                  📧 {info.correo || "—"}
                  <br />
                  💳 Tarjeta <strong>{info.type || "—"}</strong>{" "}
                  <strong>{info.card || "—"}</strong>.

                </Typography>

                <Typography sx={{ mt: 2, color: "text.secondary", lineHeight: 1.5 }}>
                  🚀 Incluye <strong>hosting</strong> y{" "}
                  <strong>soporte técnico 24/7</strong> para mantener tu sitio siempre activo.
                </Typography>

                <Button
                  component={motion.a}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: "50px",
                    px: 4,
                    py: 1.3,
                    background: "linear-gradient(90deg, #25D366, #128C7E)",
                    boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
                    "&:hover": {
                      background: "linear-gradient(90deg, #1ebe5b, #0d745f)",
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
