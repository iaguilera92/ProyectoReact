import React, { useEffect, useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Slide, Button, Typography, TextField, InputAdornment,
  CircularProgress, useTheme, useMediaQuery, Box
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { cargarClientesDesdeExcel } from "../helpers/HelperClientes"; // ✅ importa tu helper

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DialogOneClickMall({
  open,
  onClose,
  onConfirm,
  primaryLabel = "Suscribirse con Webpay",
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const sitioRef = useRef();

  const [showContent, setShowContent] = useState(false);
  const [armed, setArmed] = useState(false);
  const [sitioWeb, setSitioWeb] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [sitioValido, setSitioValido] = useState(false);
  const [cliente, setCliente] = useState(null);

  // 🔹 Animaciones apertura
  useEffect(() => {
    if (open) {
      setLoading(false);
      setError("");
      setTouched(false);
      setShowContent(true);
      setSitioWeb("");
      setSitioValido(false);
      setCliente(null);
      setArmed(false);
      setTimeout(() => setArmed(true), 600);
    } else {
      setShowContent(false);
    }
  }, [open]);

  // 🔍 Validar sitio web y buscar en Excel
  const handleValidateWebsite = async () => {
    if (sitioWeb.trim()) setTouched(true);
    setError("");
    setSitioValido(false);
    setCliente(null);

    if (!sitioWeb) {
      setError("Debes ingresar la URL de tu sitio web");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    if (!urlPattern.test(sitioWeb)) {
      setError("Ingresa una URL válida (ej: tusitio.cl)");
      return;
    }

    setLoadingCheck(true);
    try {
      const url = sitioWeb.startsWith("http") ? sitioWeb : `https://${sitioWeb}`;
      await fetch(url, { method: "HEAD", mode: "no-cors" });
      setSitioValido(true);

      // 🔸 Normaliza dominio
      const dominio = sitioWeb
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .toLowerCase()
        .trim();

      // 🧾 Cargar clientes desde el Excel
      const listaClientes = await cargarClientesDesdeExcel();

      // 🔍 Buscar coincidencia por dominio o contiene
      const encontrado = listaClientes.find((c) => {
        const sitio = c.sitioWeb?.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
        return sitio === dominio || dominio.includes(sitio) || sitio.includes(dominio);
      });

      if (encontrado) {
        setCliente({
          nombre: encontrado.cliente,
          correo: encontrado.correo,
          idCliente: encontrado.idCliente,
        });
      } else {
        setError("No se encontró el Cliente en la base de datos.");
        setCliente(null);
      }
    } catch (err) {
      console.error("Error verificando sitio:", err);
      setError("No se pudo verificar el sitio web, Contactar Soporte.");
    } finally {
      setLoadingCheck(false);
    }
  };

  // 🔸 Confirmar suscripción
  const handleConfirm = async () => {
    if (!sitioValido || !cliente) {
      setError("Debes ingresar un sitio válido y con cliente asociado");
      return;
    }

    setLoading(true);
    setShowContent(false);

    setTimeout(async () => {
      try {
        sessionStorage.setItem("sitioWebReserva", sitioWeb);
        sessionStorage.setItem("clienteNombre", cliente.nombre);
        sessionStorage.setItem("clienteCorreo", cliente.correo);
        sessionStorage.setItem("clienteId", cliente.idCliente);
        await onConfirm?.(sitioWeb, cliente);
      } catch (error) {
        console.error("Error en onConfirm:", error);
        setError("Ocurrió un error al iniciar la suscripción.");
        setShowContent(true);
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 5, sm: 0 },
          borderRadius: 2,
          border: "1px solid rgba(106,27,154,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
          background: "linear-gradient(180deg,#F3E5F5 0%,#EDE7F6 100%) !important",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: 130, sm: 150 },
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: "url('/fondo-transbank.webp')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            transform: "scale(1.2)",
            animation: "bgZoom 1s ease-out forwards",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.55) 100%)",
          },
          "& > *": { position: "relative", zIndex: 2 },
          "@keyframes bgZoom": {
            "0%": { transform: "scale(1.2)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          disabled={loading}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: loading ? "rgba(255,255,255,0.4)" : "#FFF",
            zIndex: 4,
            cursor: loading ? "not-allowed" : "pointer",
            pointerEvents: loading ? "none" : "auto",
            "&:hover": {
              backgroundColor: loading ? "transparent" : "rgba(255,255,255,.15)",
            },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            "@keyframes spinTwice": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(720deg)" },
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Título */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            fontWeight: 800,
            fontFamily: "'Poppins', sans-serif",
            color: "#fff",
            fontSize: loading
              ? { xs: "0.85rem", sm: "1.15rem" }
              : { xs: "0.9rem", sm: "1.4rem" },
            px: 3,
            py: 0.5,
            mt: 1.5,
            borderRadius: "999px",
            border: "2px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          <motion.span
            key={loading ? "webpay" : "cart"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {loading ? "💳" : "🌐"}
          </motion.span>

          {loading ? "Redirigiendo a WebPay..." : "Suscripción Transbank"}
        </Typography>
      </DialogTitle>

      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key="dialogContent"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", transition: { duration: 1 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 1.2 } }}
            style={{ overflow: "hidden", transformOrigin: "top center" }}
          >
            <DialogContent
              sx={{
                background: "linear-gradient(180deg,#F3E5F5 0%,#EDE7F6 100%)",
                px: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  textAlign: "center",
                  fontWeight: 500,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                  lineHeight: 1.3,
                }}
              >
                ✨ Ingresa tu Sitio web de producción.
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: { xs: "0.75rem", sm: "0.9rem" },
                    color: "#6A1B9A",
                    mt: 0.1, // 👈 más junto al texto superior
                    fontWeight: 400,
                  }}
                >
                  (Ejemplo: plataformas-web.cl)
                </Box>
              </Typography>


              {/* Sitio Web */}
              <TextField
                inputRef={sitioRef}
                label="Sitio Web"
                placeholder="tusitio.cl"
                value={sitioWeb}
                onChange={(e) => setSitioWeb(e.target.value.trim())}
                onBlur={handleValidateWebsite}
                fullWidth
                required
                autoFocus
                size="medium"
                error={Boolean(error) && touched}
                helperText={touched && error ? error : " "}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {loadingCheck ? (
                        <CircularProgress size={22} />
                      ) : sitioValido ? (
                        <Box sx={{ color: "#2e7d32", mr: 1.5 }}>✔</Box>
                      ) : (
                        <Box sx={{ color: "#6A1B9A", mr: 1.5 }}>🌐</Box>
                      )}
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }}
              />

              {/* Cliente encontrado */}
              {cliente && (
                <>
                  {/* Título sobre el borde */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mt: -2,
                      mb: 0, // lo acerca al borde del box
                      ml: 0,
                      fontWeight: 700,
                      color: "#6A1B9A",
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    📋 Datos del Cliente
                  </Typography>

                  {/* Contenedor con borde */}
                  <Box
                    sx={{
                      p: 2.5,
                      width: "100%",
                      background: "linear-gradient(180deg, #FFFFFF 0%, #F8F3FC 100%)",
                      borderRadius: 3,
                      border: "2px solid #6A1B9A",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                      textAlign: "left",
                      position: "relative",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        fontSize: "0.95rem",
                        color: "#2e2e2e",
                      }}
                    >
                      👤 {cliente.nombre}
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "#4A148C",
                        fontSize: "0.9rem",
                        wordBreak: "break-all",
                      }}
                    >
                      ✉️ {cliente.correo}
                    </Typography>
                  </Box>

                  {/* Mensaje informativo de suscripción */}
                  <Box
                    sx={{
                      mt: 1,
                      px: 2,
                      py: 1.2,
                      borderRadius: 2,
                      background: "linear-gradient(90deg, #F3E5F5 0%, #EDE7F6 100%)",
                      border: "1px solid rgba(106,27,154,0.25)",
                      boxShadow: "0 3px 8px rgba(106,27,154,0.1)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "1.6rem",
                        color: "#6A1B9A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                      }}
                    >
                      🔒
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.77rem",
                        color: "#4A148C",
                        fontWeight: 500,
                        lineHeight: 1.55,
                        whiteSpace: "pre-line", // 👈 respeta saltos de línea
                      }}
                    >
                      {"Transacción protegida por "}
                      <strong>WebPay</strong>
                      {"\nMonto mensual: "}
                      <strong>$9.990 CLP</strong>
                      {"\n"}
                      <Box component="span" sx={{ fontWeight: 400, color: "#6A1B9A" }}>
                        <strong>Nos encargamos de tu web!</strong>
                      </Box>
                    </Typography>
                  </Box>
                </>
              )}
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>

      <DialogActions
        sx={{
          px: 2,
          py: 1.2,
          background: "linear-gradient(90deg,#E1BEE7,#CE93D8)",
          borderTop: "1px solid rgba(106,27,154,.35)",
          display: "flex",
          justifyContent: "center", // 👈 centra horizontalmente
          alignItems: "center",
          gap: 1.5, // 👈 separación equilibrada
        }}
      >
        {/* Botón Cancelar */}
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: loading ? "#9c9c9c" : "#4A148C",
            fontWeight: 700,
            textTransform: "none",
            minWidth: 95,
            mr: -2,
          }}
        >
          Cancelar
        </Button>

        {/* Botón dinámico: Validar / Suscribirse */}
        <Button
          variant="contained"
          onClick={sitioValido && cliente ? handleConfirm : handleValidateWebsite}
          disabled={loading || (!sitioWeb && !(sitioValido && cliente))}
          sx={{
            height: 42,
            minWidth: 170,
            textTransform: "none",
            fontWeight: 700,
            color: "#fff",
            background:
              sitioValido && cliente
                ? "linear-gradient(135deg, #FFD700 0%, #FFC107 40%, #FFB300 70%, #FFD54F 100%)" // ✨ Dorado brillante
                : "linear-gradient(90deg,#6A1B9A,#8E24AA)", // Morado para Validar
            boxShadow:
              sitioValido && cliente
                ? "0 0 16px rgba(255,215,0,0.6)" // brillo dorado
                : "0 6px 18px rgba(106,27,154,.35)",
            opacity: sitioWeb || (sitioValido && cliente) ? 1 : 0.5,
            transition: "all 0.3s ease",
            border:
              sitioValido && cliente
                ? "1px solid rgba(255,255,255,0.4)"
                : "1px solid transparent",
            "&:hover": {
              background:
                sitioValido && cliente
                  ? "linear-gradient(135deg, #FFEB3B 0%, #FFC107 40%, #FFA000 70%, #FFEE58 100%)"
                  : "linear-gradient(90deg,#7B1FA2,#9C27B0)",
              boxShadow:
                sitioValido && cliente
                  ? "0 0 24px rgba(255,235,59,0.85)" // más brillo al pasar el mouse
                  : "0 6px 18px rgba(106,27,154,.35)",
            },
            "&:active": {
              transform: "scale(0.98)",
              boxShadow:
                sitioValido && cliente
                  ? "0 0 10px rgba(255,215,0,0.4)"
                  : "0 4px 12px rgba(106,27,154,.35)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : sitioValido && cliente ? (
            "Suscribirse"
          ) : (
            "Validar Sitio Web"
          )}
        </Button>
      </DialogActions>



    </Dialog >
  );
}
