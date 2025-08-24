import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Slide,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckIcon from "@mui/icons-material/Check";
import { motion, AnimatePresence } from "framer-motion";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogTrabajoTerminado({
  open,
  onClose,
  onConfirmar,
  onConfirmarConCorreo,
  trabajo,
  onSave,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [accionEnCurso, setAccionEnCurso] = useState(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSave?.(trabajo);
        setSuccess(false);

        if (accionEnCurso === "confirmar" || accionEnCurso === "confirmarConCorreo") {
          if (trabajo?.TelefonoCliente) {
            const phone = String(trabajo.TelefonoCliente).replace(/\D/g, "");
            const message = `¡Buenas noticias! 🚀 Su sitio web *www.${trabajo.SitioWeb}* ha finalizado y ya está disponible en *producción*. 🎉`;
            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            // 👇 Abrimos WhatsApp ANTES de cerrar el diálogo
            window.open(whatsappUrl, "_blank");
          }
        }

        onClose(); // 👈 cerramos al final
        setAccionEnCurso(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, accionEnCurso, onClose, onSave, trabajo]);



  const handleAccion = async (accion, tipo) => {
    try {
      setLoading(true);
      setAccionEnCurso(tipo);   // 👈 guardamos qué botón se usó
      await accion?.();
      setLoading(false);
      setSuccess(true);         // dispara animación y useEffect
    } catch (err) {
      console.error("❌ Error:", err);
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (loading || success) return;
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      scroll="body"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 0, sm: -3 },
          borderRadius: 2,
          border: "1px solid rgba(76,175,80,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 2,
          borderBottom: "1px solid rgba(76,175,80,.35)",
          position: "relative",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/trabajo-terminado.webp')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            backgroundSize: "130%",
            animation: "zoomInDesktop 2.5s ease-out forwards",

            "@media (max-width:600px)": {
              backgroundSize: "250%",
              animation: "zoomInMobile 2.5s ease-out forwards",
            },

            "@keyframes zoomInDesktop": {
              "0%": { backgroundSize: "150%" },
              "100%": { backgroundSize: "110%" },
            },
            "@keyframes zoomInMobile": {
              "0%": { backgroundSize: "270%" },
              "100%": { backgroundSize: "140%" },
            },
          },

          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.45)",
            zIndex: 1,
          },

          "& > *": {
            position: "relative",
            zIndex: 2,
          },
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFF",
            zIndex: 6,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            animationFillMode: "forwards",
            "@keyframes spinTwice": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(720deg)" },
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>
        {/* Título */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.8, sm: 1.2 },
            px: { xs: 1.2, sm: 2 },
            py: { xs: 0.5, sm: 0.8 },
            borderRadius: "999px",
            bgcolor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
          }}
        >
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: "0.3px", sm: "1px" },
              fontFamily: "'Poppins', sans-serif",
              color: "#fff",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {success ? "Trabajo Finalizado!" : "Trabajo Completado"}
          </Typography>

          {success ? (
            <motion.span
              style={{ fontSize: "1.8rem", display: "inline-block" }}
              animate={{ scale: [1, 0.8, 1] }}   // 👈 achica y vuelve
              transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
            >
              👏
            </motion.span>
          ) : (
            <WorkOutlineIcon sx={{ color: "#fff", fontSize: { xs: 20, sm: 24 } }} />
          )}
        </Box>
      </DialogTitle>

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="content"
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <DialogContent
              dividers
              sx={{
                py: 3,
                pb: 6,
                bgcolor: success ? "#e6f4ea" : "#FFFDF8",
                position: "relative",
                overflow: "visible",
              }}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <Box textAlign="center" sx={{ pt: 2 }}>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#4caf50",
                            borderRadius: "50%",
                            width: 96,
                            height: 96,
                            mb: 2,
                            mt: 1,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          }}
                        >
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <CheckIcon
                              sx={{ fontSize: 60, color: "#fff", transform: "translateY(2px)" }}
                            />
                          </motion.div>
                        </Box>
                      </motion.div>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="success.dark"
                        sx={{
                          whiteSpace: "nowrap", // evita salto de línea
                          fontSize: { xs: "1rem", sm: "1.25rem" }, // 👈 más chico en mobile
                        }}
                      >
                        🎉 ¡Felicitaciones, excelente trabajo!
                      </Typography>

                    </Box>
                  </motion.div>
                ) : (
                  <>
                    <Typography>
                      🎉 ¡El trabajo <b>{trabajo?.SitioWeb}</b> alcanzó el <b>100%</b>!
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                      ¿Quieres marcarlo como finalizado?
                    </Typography>

                  </>
                )}
              </AnimatePresence>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(3px)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={48}
            sx={{
              color: "success.main",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 1 },
                "50%": { transform: "scale(1.2)", opacity: 0.6 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          />
        </Box>
      )}

      {/* Footer */}
      <DialogActions
        sx={{
          justifyContent: success ? "center" : "flex-end",
          py: 2,
          gap: 0.3,
          background: "#FDF3E7",
          borderTop: "1px solid rgba(230,126,34,.45)"
        }}
      >

        {success ? (
          Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              style={{ fontSize: "2rem", display: "inline-block" }}
              animate={{ scale: [1, 0.8, 1] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            >
              👏
            </motion.span>
          ))
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{
                color: "success.dark",
                fontWeight: 700,
                fontSize: isMobile ? "0.7rem" : "0.8rem", // 👈 mismo tamaño
                px: isMobile ? 1 : 1.5,
                height: 36,
              }}
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="success"
              disabled={loading}
              onClick={() => handleAccion(onConfirmar, "confirmar")}
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? "0.7rem" : "0.8rem", // 👈 mismo tamaño
                px: isMobile ? 1 : 1.5,
                height: 36,
              }}
            >
              Confirmar
            </Button>

            <Button
              onClick={() => handleAccion(onConfirmarConCorreo, "confirmarConCorreo")}
              variant="contained"
              disabled={loading}
              sx={{
                fontWeight: 700,
                fontSize: isMobile ? "0.7rem" : "0.8rem", // 👈 mismo tamaño
                px: isMobile ? 1 : 1.5,
                height: 36,
                minWidth: isMobile ? "auto" : undefined,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              Confirmar + <MailOutlineIcon sx={{ fontSize: "1rem" }} />
            </Button>


          </>
        )}
      </DialogActions>

    </Dialog>
  );
}
