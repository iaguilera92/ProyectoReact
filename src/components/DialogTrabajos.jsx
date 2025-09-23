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
import { cargarTrabajos } from "../helpers/HelperTrabajos";

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
  const [localTrabajos, setLocalTrabajos] = useState(trabajos);

  const sitiosWeb = localTrabajos.filter(t => t.TipoApp === 1).length;
  const sistemas = localTrabajos.filter(t => t.TipoApp === 2).length;
  const [showContent, setShowContent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const ultimaFecha = React.useMemo(() => {
    if (!localTrabajos.length) return null;

    const ultimaFechaReal = new Date(
      Math.max(...localTrabajos.map(t => new Date(t.FechaCreacion).getTime()))
    );

    const hoy = new Date();
    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() - 3);

    const fechaFinal = ultimaFechaReal < limite ? limite : ultimaFechaReal;
    return fechaFinal.toLocaleDateString("es-CL");
  }, [localTrabajos]);



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

  // ACTUALIZAR TRABAJOS S3
  useEffect(() => {
    if (open) {
      const timestamp = Date.now();
      cargarTrabajos(
        `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Trabajos.xlsx?t=${timestamp}`
      ).then((data) => {
        // 🔹 Filtrar solo los trabajos activos (Estado = 1)
        const activos = data.filter(t => Number(t.Estado) === 1);
        setLocalTrabajos(activos);
      });
    }
  }, [open]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
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
          py: 1.5,
          borderBottom: "1px solid rgba(255,167,38,.35)",
          position: "relative", // 👈 mantiene ancla para el botón
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
            backgroundSize: { xs: "250%", sm: "130%" },
            animation: {
              xs: "zoomInMobile 2.5s ease-out forwards",
              sm: "zoomInDesktop 2.5s ease-out forwards",
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

          "@keyframes zoomInDesktop": {
            "0%": { backgroundSize: "150%" },
            "100%": { backgroundSize: "110%" },
          },
          "@keyframes zoomInMobile": {
            "0%": { backgroundSize: "270%" },
            "100%": { backgroundSize: "140%" },
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
            zIndex: 3, // 👈 encima del overlay
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },

            // animación solo al montar
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
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



        {localTrabajos.length > 0 ? (
          <Box
            sx={{
              mt: isMobile ? 1 : 1.5,
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
          <></>
        )}
      </DialogTitle>

      <AnimatePresence>
        {showContent && (
          <motion.div key="dialogContent" initial={false}
            animate={expanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <DialogContent sx={{ background: "linear-gradient(180deg,#FFF8E1 0%,#FFF3E0 100%)", py: 0, px: 1.5, mb: 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 1.3 }}>
                {localTrabajos.map((t) => {
                  const porcentaje = Math.min(100, Math.max(0, t.Porcentaje || 0));
                  const completado = porcentaje === 100;

                  return (
                    <Box
                      key={`${t.SitioWeb}-${t.Id}`}
                      sx={{
                        border: "1px solid rgba(230,81,0,0.25)",
                        borderRadius: 1,
                        py: 0.3,
                        px: 1.5,
                        background: completado
                          ? "linear-gradient(180deg, #FFEFD5 0%, #FFF5EB 100%)" // tono durazno pastel
                          : "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      <Trabajos trabajo={t} />
                    </Box>
                  );
                })}
              </Box>

              {/* Fecha última actualización */}
              {ultimaFecha && (
                <Box sx={{ textAlign: "center", mb: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{ fontSize: "0.65rem", fontWeight: 500, color: "#E65100", lineHeight: 1.1 }}
                  >
                    📅 Última actualización: {ultimaFecha}
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Actions */}
      <DialogActions
        sx={{
          px: 2,
          py: 0.8,
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
              height: 36,
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
