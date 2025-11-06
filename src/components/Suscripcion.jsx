import { Box, Typography, Container, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Suscripcion = () => {
  const [status, setStatus] = useState("loading");
  const [info, setInfo] = useState({});
  const [subrayadoActivo, setSubrayadoActivo] = useState(false);
  const [searchParams] = useSearchParams();
  const ejecutadoRef = useRef(false);
  const [animar, setAnimar] = useState(false);

  //INICIO
  useEffect(() => {
    if (ejecutadoRef.current) return;
    ejecutadoRef.current = true;

    window.scrollTo({ top: 0, behavior: "auto" });
    const t = setTimeout(() => setSubrayadoActivo(true), 800);

    const tbk_user = searchParams.get("tbk_user");
    const card = searchParams.get("card");
    const type = searchParams.get("type");
    const s = searchParams.get("status");

    const clienteNombre = sessionStorage.getItem("clienteNombre");
    const clienteCorreo = sessionStorage.getItem("clienteCorreo");
    const sitioWebReserva = sessionStorage.getItem("sitioWebReserva");
    const idCliente = sessionStorage.getItem("clienteId");
    const logoCliente = sessionStorage.getItem("logoCliente");

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
      setTimeout(() => setAnimar(true), 2000);

      if (idCliente) {
        actualizarASuscrito(idCliente, {
          suscripcion: true,
          tbk_user,
          card,
          type,
        }).then(() => {
          enviarCorreoSuscripcion({
            nombre: clienteNombre,
            sitioWeb: sitioWebReserva,
            logoCliente,
            email: clienteCorreo,
            fechaInicio: new Date().toLocaleDateString("es-CL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }),
          });
        });
      } else {
        console.warn("⚠️ idCliente no encontrado en sessionStorage");
      }
    } else {
      setStatus("error");
    }

    return () => clearTimeout(t);
  }, [searchParams]);


  const enviarCorreoSuscripcion = async (datos) => {
    try {
      emailjs.init("TfLG1wfibewzR9Xpf");

      const response = await emailjs.send(
        "service_73azdl9",  // ID del servicio
        "template_88weuur", // ID de plantilla
        {
          nombre: datos.nombre,
          fechaInicio: datos.fechaInicio,
          sitioWeb: datos.sitioWeb,
          logoCliente: datos.logoCliente,
          email: datos.email,
        }
      );
      console.log("📧 Correo enviado:", response.status, response.text);
    } catch (error) {
      console.error("❌ Error al enviar correo:", error);
    }
  };

  // ACTUALIZAR CLIENTE
  const actualizarASuscrito = async (idCliente, datos) => {
    try {
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/actualizarCliente`;

      // 🧠 datos = { suscripcion: true, tbk_user, card, type }
      const body = {
        idCliente,
        suscripcion: datos.suscripcion ? 1 : 0,
        tbk_user: datos.tbk_user || "",
        tarjeta: datos.card || "",
        tipo_tarjeta: datos.type || "",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

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
          variant="h7"
          fontWeight={700}
          sx={{
            color: "white",
            display: "inline-flex",
            position: "relative",
          }}
        >
          <Box
            component="span"
            sx={{
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: subrayadoActivo ? "100%" : "0%",
                height: "3px",
                borderRadius: "3px",
                background: "linear-gradient(90deg, #007bff, #00c6ff)",
                transition: "width 0.6s ease-in-out",
              },
            }}
          >
            {"Suscripción Plataformas Web".split("").map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={animar ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: animar ? i * 0.05 : 0 }}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {c === " " ? "\u00A0" : c}
              </motion.span>
            ))}
          </Box>
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <CircularProgress size={55} thickness={4} color="primary" />
                <Typography sx={{ mt: 2, fontWeight: 500 }}>
                  Validando tu suscripción segura con Transbank...
                </Typography>
              </motion.div>
            )}


            {status === "success" && (
              <>
                {/* ✅ Ícono check */}
                {animar && (
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
                        width: 80,
                        height: 80,
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
                )}
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


                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.6,
                    mt: 0.5,
                  }}
                >
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: { xs: 18, sm: 20 },
                      color: "#2E7D32", // tono verde del plan
                      opacity: 0.85,
                      mb: "1px",
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      background: "linear-gradient(90deg, #43A047, #66BB6A, #81C784)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "0.95rem", sm: "1.15rem" },
                      letterSpacing: "-0.3px",
                      lineHeight: 1.15,
                      textShadow: "0 0.5px 1px rgba(0,0,0,0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.4,
                    }}
                  >
                    Plan mensual:&nbsp;
                    <strong style={{ color: "#2E7D32" }}>$9.990&nbsp;CLP</strong>
                  </Typography>
                </Box>



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
                      fontSize: "1.1rem",
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
                    mt: 0,
                    mb: 0,
                    width: { xs: 190, sm: 200 },
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

                {/* 🔹 Contenedor centrador */}
                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <Button
                    component={motion.a}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    variant="contained"
                    href="https://api.whatsapp.com/send?phone=56946873014"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      mt: 2,
                      borderRadius: "30px",
                      px: 2.6, // 👈 padding lateral mínimo
                      py: 1, // 👈 más bajo y angosto
                      fontWeight: 600,
                      fontSize: "0.74rem",
                      textTransform: "none",
                      letterSpacing: 0.1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.25,
                      minWidth: "auto",
                      maxWidth: 220,
                      background: "linear-gradient(90deg, #25D366 0%, #128C7E 100%)",
                      boxShadow: "0 3px 10px rgba(18,140,126,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        background: "linear-gradient(90deg, #20bd5a 0%, #0d745f 100%)",
                        boxShadow: "0 5px 14px rgba(18,140,126,0.4)",
                      },
                      "&:active": {
                        transform: "scale(0.97)",
                      },
                    }}
                  >
                    {/* ✨ Brillo diagonal */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "-75%",
                        width: "50%",
                        height: "100%",
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                        transform: "skewX(-25deg)",
                        animation: "shine 3s infinite",
                        "@keyframes shine": {
                          "0%": { left: "-75%" },
                          "60%": { left: "130%" },
                          "100%": { left: "130%" },
                        },
                        pointerEvents: "none",
                      }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <WhatsAppIcon sx={{ fontSize: 17, mb: "1px" }} />
                      <Box component="span" sx={{ fontWeight: 600, fontSize: "0.78rem" }}>
                        Siempre en Contacto!
                      </Box>
                    </Box>
                  </Button>
                </Box>



              </>
            )}

            {status === "error" && (
              <>
                <Typography variant="h5" color="error" fontWeight={700}>
                  ❌ Error al Suscribir
                </Typography>
                <Typography sx={{ mt: 2 }}>
                  Ocurrió un problema y no pudimos completar tu suscripción. Intenta de nuevo o ponte en contacto con soporte si el error persiste.
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <Button
                    component={motion.a}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    variant="contained"
                    href="https://api.whatsapp.com/send?phone=56946873014"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      mt: 2,
                      borderRadius: "30px",
                      px: 2.6,
                      py: 1,
                      fontWeight: 600,
                      fontSize: "0.74rem",
                      textTransform: "none",
                      letterSpacing: 0.1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.25,
                      minWidth: "auto",
                      maxWidth: 220,
                      background: "linear-gradient(90deg, #25D366 0%, #128C7E 100%)",
                      boxShadow: "0 3px 10px rgba(18,140,126,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        background: "linear-gradient(90deg, #20bd5a 0%, #0d745f 100%)",
                        boxShadow: "0 5px 14px rgba(18,140,126,0.4)",
                      },
                      "&:active": {
                        transform: "scale(0.97)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: "-75%",
                        width: "50%",
                        height: "100%",
                        background:
                          "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                        transform: "skewX(-25deg)",
                        animation: "shine 3s infinite",
                        "@keyframes shine": {
                          "0%": { left: "-75%" },
                          "60%": { left: "130%" },
                          "100%": { left: "130%" },
                        },
                        pointerEvents: "none",
                      }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <WhatsAppIcon sx={{ fontSize: 17, mb: "1px" }} />
                      <Box component="span" sx={{ fontWeight: 600, fontSize: "0.78rem" }}>
                        Avisanos para ayudarte!
                      </Box>
                    </Box>
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Suscripcion;
