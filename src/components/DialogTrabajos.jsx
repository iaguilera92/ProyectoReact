// DialogTrabajos.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Slide, Chip, LinearProgress,
  Box, Button, Typography, useTheme, useMediaQuery
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Trabajos from "./Trabajos";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function RelojAnimado() {
  return (
    <Box
      sx={{
        position: "relative",
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "2px solid #E65100",
        bgcolor: "#FFF8E1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,.25) inset",
      }}
    >
      {/* Aguja */}
      <Box
        sx={{
          position: "absolute",
          width: 2,
          height: "40%",
          bgcolor: "#E65100",
          borderRadius: 1,
          top: "10%",
          left: "47%",
          transformOrigin: "bottom center",
          animation: "spin 5s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />

      {/* Centro */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "#E65100",
          transform: "translate(-50%, -50%)",   // ✅ centrado perfecto
          zIndex: 2,
        }}
      />
    </Box>
  );
}
const ContadorAnimado = ({ value, delay = 0.5, duration = 2 }) => {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Suscripción a cambios
    const unsubscribe = count.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });

    // Animación
    const controls = animate(count, value, {
      duration,
      delay,
      ease: "easeOut",
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [value, delay, duration]);

  return <span>{display}</span>;
};


export default function DialogTrabajos({
  open,
  onClose,
  trabajos = [],
  primaryLabel = "Ver servicios",
  onPrimaryClick,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [armed, setArmed] = React.useState(false);

  const sitiosWeb = trabajos.filter(t => t.TipoApp === 1).length;
  const sistemas = trabajos.filter(t => t.TipoApp === 2).length;
  const [showContent, setShowContent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  //EXPANSIÓN
  useEffect(() => {
    let timer;
    if (open) {
      setShowContent(true);   // 👈 habilitamos el contenido
      setExpanded(false);     // reset de expand
      timer = setTimeout(() => setExpanded(true), 2000);
    } else {
      setShowContent(false);  // 👈 ocultamos todo cuando se cierra
    }
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    let t;
    if (open) {
      setArmed(false); // reset
      t = setTimeout(() => setArmed(true), 600); // espera cada vez que se abre
    }
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 0, sm: -3 },
          borderRadius: 2,
          border: "1px solid rgba(255,167,38,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
          "& .MuiDialogContent-root": { marginTop: 0 },
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
          borderBottom: "1px solid rgba(255,167,38,.35)",
          position: "relative",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/servicio1.webp')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,

            // Desktop
            backgroundSize: "130%",
            animation: "zoomInDesktop 2.5s ease-out forwards",

            // Mobile override
            "@media (max-width:600px)": {
              backgroundSize: "250%",              // 👈 inicia súper cerca
              animation: "zoomInMobile 2.5s ease-out forwards",
            },

            "@keyframes zoomInDesktop": {
              "0%": { backgroundSize: "150%" },
              "100%": { backgroundSize: "110%" },
            },
            "@keyframes zoomInMobile": {
              "0%": { backgroundSize: "270%" },   // 👈 más zoom inicial en mobile
              "100%": { backgroundSize: "140%" }, // 👈 termina aún con presencia
            },
          },

          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.45)", // overlay oscuro
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
            zIndex: 3, // 👈 más arriba que ::before y ::after
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },

            // animación al abrir
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


        {/* Fila: ícono reloj + título */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.8, sm: 1.2 }, // más compacto en mobile
            px: { xs: 1.2, sm: 2 },
            py: { xs: 0.5, sm: 0.8 },
            borderRadius: "999px",
            bgcolor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
          }}
        >
          <RelojAnimado />
          <Typography
            variant="h6" // 👈 más chico que h5
            component="span"
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: "0.3px", sm: "1px" },
              fontFamily: "'Poppins', sans-serif",
              color: "#fff",
              fontSize: { xs: "1.1rem", sm: "1.25rem" }, // ajuste fino
            }}
          >
            Desarrollos Activos
          </Typography>
        </Box>



        {trabajos.length > 0 ? (
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexDirection: "row",   // 👈 siempre fila
              flexWrap: "nowrap",     // 👈 evita salto a segunda línea
            }}
          >
            {/* Web en desarrollo */}
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 160 }, // más pequeño en mobile
                textAlign: "center",
                px: { xs: 1, sm: 2 },
                py: { xs: 1.2, sm: 2 },
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(230,81,0,0.9), rgba(255,152,0,0.7))",
                boxShadow: { xs: "0 4px 14px rgba(0,0,0,.35)", sm: "0 6px 20px rgba(0,0,0,.45)" },
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 55, sm: 70 },
                  height: { xs: 55, sm: 70 },
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.15)",
                  border: { xs: "2px solid #fff", sm: "3px solid #fff" },
                  mb: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  <ContadorAnimado value={sitiosWeb} delay={0.5} duration={2} />
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
              >
                Web en desarrollo
              </Typography>
            </Box>

            {/* Sistemas en desarrollo */}
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 160 },
                textAlign: "center",
                px: { xs: 1, sm: 2 },
                py: { xs: 1.2, sm: 2 },
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(251,140,0,0.9), rgba(255,202,40,0.7))",
                boxShadow: { xs: "0 4px 14px rgba(0,0,0,.35)", sm: "0 6px 20px rgba(0,0,0,.45)" },
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 55, sm: 70 },
                  height: { xs: 55, sm: 70 },
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.15)",
                  border: { xs: "2px solid #fff", sm: "3px solid #fff" },
                  mb: 1,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: "#fff",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  <ContadorAnimado value={sistemas} delay={0.5} duration={2} />
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                }}
              >
                Sistemas en desarrollo
              </Typography>
            </Box>

          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "#5D4037",
              mt: 2,
              display: "block",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            Sin trabajos activos por ahora
          </Typography>
        )}




      </DialogTitle>

      <AnimatePresence>
        {showContent && (
          <motion.div
            key="dialogContent"
            initial={false}
            animate={expanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ overflow: "hidden" }} // evita que se vea raro al colapsar
          >
            <DialogContent
              sx={{
                background: "linear-gradient(180deg, #FFF8E1 0%, #FFF3E0 100%)",
                py: isMobile ? 1 : 2.5,
                mb: 0
              }}
            >
              {trabajos.length === 0 && (
                <Box sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ color: "#5D4037", textAlign: "center" }}>
                    Pronto verás aquí tus próximos desarrollos.
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: { xs: 1.5, sm: 2.5 } }}>
                {trabajos.map((t) => (
                  <Trabajos key={`${t.SitioWeb}-${t.Id}`} trabajo={t} />
                ))}
              </Box>

            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Actions */}
      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          background: "linear-gradient(90deg,#FFF3E0,#FFE0B2)",
          borderTop: "1px solid rgba(255,167,38,.35)",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#E65100", fontWeight: 700 }}>
          Cerrar
        </Button>

        {onPrimaryClick && (
          <Button
            variant="contained"
            onClick={onPrimaryClick}
            sx={{
              position: "relative",
              overflow: "hidden",
              minWidth: 140,
              textTransform: "none",
              fontWeight: 700,
              color: "#fff",
              border: armed ? "none" : "2px solid #fff",
              background: "transparent", // siempre transparente
              boxShadow: armed ? "0 6px 18px rgba(255,152,0,.35)" : "none",
              transition: "all 0.3s ease",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "inherit",
                background: "linear-gradient(90deg,#FF9800,#F57C00)",
                // 👇 Solo se expande cuando expanded && armed (tras 1s de mount)
                transform: armed ? "scale(1)" : "scale(0)",
                transformOrigin: "center center",
                transition: "transform 0.6s ease",
                zIndex: 0,
              },
              "& span": {
                position: "relative",
                zIndex: 1,
              },
              "&:hover::before": {
                background: expanded
                  ? "linear-gradient(90deg,#FFA726,#FB8C00)"
                  : "rgba(255,255,255,0.15)",
              },
            }}
          >
            <span>{primaryLabel}</span>
          </Button>

        )}
      </DialogActions>
    </Dialog >
  );
}
