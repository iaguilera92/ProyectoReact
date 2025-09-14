import React, { useEffect, useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Slide, Button, Typography, TextField, InputAdornment,
  CircularProgress, useTheme, useMediaQuery, Box
} from "@mui/material";
import { keyframes } from "@emotion/react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { motion, AnimatePresence } from "framer-motion";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function DialogTransbankCorreo({
  open,
  onClose,
  onConfirm,
  primaryLabel = "Pagar con Webpay",
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [showContent, setShowContent] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [armed, setArmed] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Animaciones apertura
  useEffect(() => {
    let timer;
    if (open) {
      setShowContent(true);
      setExpanded(false);
      timer = setTimeout(() => setExpanded(true), 800);
    } else {
      setShowContent(false);
    }
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    let t;
    if (open) {
      setArmed(false);
      t = setTimeout(() => setArmed(true), 600);
    }
    return () => clearTimeout(t);
  }, [open]);

  const handleConfirm = () => {
    setTouched(true);

    if (!email) {
      setError("Debes ingresar un correo electrónico");
      emailRef.current?.focus();
      return;
    }
    if (!isValidEmail) {
      setError("Ingresa un correo válido (ej: cliente@gmail.com)");
      emailRef.current?.focus();
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(async () => {
      try {
        // 👇 guardar primero el email en sessionStorage
        sessionStorage.setItem("emailReserva", email);

        await onConfirm?.(email);
        onClose();
      } finally {
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
      sx={{
        "& .MuiDialog-container": {
          alignItems: { xs: "flex-start", sm: "center" }, // 📱 arriba, 🖥️ centrado
        },
      }}
      PaperProps={{
        sx: {
          mt: { xs: 2, sm: 0 }, // 📱 un poco de margen arriba, 🖥️ sin margen extra
          borderRadius: 2,
          border: "1px solid rgba(106,27,154,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
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
            transform: "scale(1.2)",              // estado inicial
            transformOrigin: "center",
            willChange: "transform",
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

          // Keyframes dentro del sx de MUI
          "@keyframes bgZoom": {
            "0%": { transform: "scale(1.2)" },
            "100%": { transform: "scale(1)" },
          },

          // Respeta usuarios con reduce motion
          "@media (prefers-reduced-motion: reduce)": {
            "&::before": { animation: "none", transform: "scale(1)" },
          },
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar diálogo"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFF",
            zIndex: 3,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 26 }} />
        </IconButton>

        {/* Título con bounce en el ícono */}
        <Typography
          variant="h6"
          component="div"   // 👈 ya no necesitas motion.div
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.2,
            fontWeight: 800,
            fontFamily: "'Poppins', sans-serif",
            color: "#fff",
            fontSize: { xs: "1.0rem", sm: "1.4rem" },
            px: 3,
            py: 0.5,
            borderRadius: "999px",
            border: "2px solid rgba(255,255,255,0.3)",
            backgroundColor: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            🛒
          </motion.span>
          Reserva tu Sitio Web
        </Typography>

      </DialogTitle>

      {/* Contenido */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="dialogContent"
            initial={false}
            animate={
              expanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <DialogContent
              sx={{
                background: "linear-gradient(180deg,#F3E5F5 0%,#EDE7F6 100%)",
                py: 2,
                pb: 0,
                px: { xs: 2, sm: 4 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ mb: 2, textAlign: "center", fontWeight: 500, fontSize: { xs: "0.7rem", sm: "1rem" }, }}
              >
                ✨Tu correo será usado para confirmar tu compra.
              </Typography>

              <TextField
                inputRef={emailRef}
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                fullWidth
                required
                autoFocus
                size="medium"
                error={touched && !!error && !isValidEmail}
                helperText={
                  touched && error && !isValidEmail
                    ? error
                    : " " // espacio en blanco para mantener altura estable
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#fff",
                    borderRadius: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.8rem", sm: "1rem" }, // 👈 input text responsivo
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.8rem", sm: "1rem" }, // 👈 label responsivo
                  },
                  "& .MuiFormHelperText-root": {
                    background: "linear-gradient(180deg,#F3E5F5 0%,#EDE7F6 100%)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    margin: "6px 0 0 0",
                    lineHeight: 1.3,
                    fontWeight: 500,
                    color: touched && !!error ? "#b71c1c" : "#4a148c",
                    fontSize: { xs: "0.7rem", sm: "0.85rem" }, // 👈 helper text más chico en mobile
                  },
                }}
                inputProps={{ maxLength: 50 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        m: 0,
                        "& .MuiTypography-root": { lineHeight: 1 },
                      }}
                    >
                      {touched && isValidEmail ? (
                        <Box
                          key="check"
                          sx={{
                            backgroundColor: "#d0f0d4",
                            border: "1px solid #2e7d32",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "rotateCheck 0.8s ease-out",
                            boxShadow: "0 0 6px rgba(46,125,50,0.4)",
                            mr: 1.5, // 👈 más espacio contra el texto
                            "@keyframes rotateCheck": {
                              "0%": { transform: "rotate(0deg)" },
                              "100%": { transform: "rotate(1440deg)" },
                            },
                          }}
                        >
                          ✔
                        </Box>
                      ) : touched && !isValidEmail && email ? (
                        <Box
                          key="cross"
                          sx={{
                            backgroundColor: "#ffcdd2",
                            border: "1px solid #d32f2f",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "rotateIn 0.6s ease-out",
                            boxShadow: "0 0 6px rgba(211,47,47,0.3)",
                            mr: 1.5, // 👈 más espacio
                            "@keyframes rotateIn": {
                              "0%": { transform: "rotate(-360deg)" },
                              "100%": { transform: "rotate(0deg)" },
                            },
                          }}
                        >
                          ✖
                        </Box>
                      ) : (
                        <Box
                          key="email"
                          sx={{
                            background: "linear-gradient(180deg,#F3E5F5 0%,#EDE7F6 100%)", // 👈 degradado morado pastel
                            border: "1px solid #ba68c8",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            animation: "rotateIn 0.6s ease-out",
                            boxShadow: "0 0 6px rgba(186,104,200,0.3)", // glow morado
                            mr: 1.5,
                            "@keyframes rotateIn": {
                              "0%": { transform: "rotate(-180deg)" },
                              "100%": { transform: "rotate(0deg)" },
                            },
                          }}
                        >
                          📧
                        </Box>

                      )}
                    </InputAdornment>

                  ),
                }}
              />



            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 2,
          py: 1,
          background: "linear-gradient(90deg,#E1BEE7,#CE93D8)",
          borderTop: "1px solid rgba(106,27,154,.35)",
        }}
      >
        <Button
          onClick={onClose}
          aria-label="Cancelar reserva"
          sx={{ color: "#4A148C", fontWeight: 700 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
          aria-label="Continuar al pago con Webpay"
          sx={{
            height: 40,
            minWidth: 150,
            textTransform: "none",
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(90deg,#6A1B9A,#8E24AA)",
            boxShadow: armed ? "0 6px 18px rgba(106,27,154,.35)" : "none",
            transition: "all 0.3s ease",
            fontSize: { xs: "0.75rem", sm: "0.9rem" }, // 👈 más chico en mobile
            "&:hover": {
              background: "linear-gradient(90deg,#7B1FA2,#9C27B0)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>💳 {primaryLabel}</>
          )}
        </Button>

      </DialogActions>
    </Dialog >
  );
}
