import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, useMediaQuery } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AnimatePresence, motion } from "framer-motion";
import theme from "../theme";
import { cargarTrabajosEnRevision } from "../helpers/HelperTrabajosEnRevision";
import TrabajosEnRevision from "./TrabajosEnRevision";

const timestamp = Date.now();
const URL_EXCEL = `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/TrabajosEnRevision.xlsx?t=${timestamp}`;
const DialogTrabajoEnRevision = ({ open, onClose }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [localTrabajos, setLocalTrabajos] = useState([]);
  const [ultimaFecha, setUltimaFecha] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [showContent, setShowContent] = useState(true);

  // 🔎 Detectar ?workInProgress=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("workInProgress");

    if (id) {
      cargarDatos(id);
    }
  }, []);

  const cargarDatos = async (id) => {

    const trabajos = await cargarTrabajosEnRevision(URL_EXCEL);

    if (!trabajos || trabajos.length === 0) {
      console.warn("⚠️ El Excel está vacío o no se pudo leer.");
      return;
    }
    const filtrado = trabajos.filter(t => t.Id === Number(id));

    setLocalTrabajos(filtrado);

    if (filtrado.length > 0) {
      setUltimaFecha(filtrado[0].FechaActualizacion || "");
    } else {
      console.warn("❌ No se encontró el ID en el Excel:", id);
    }
  };


  const handleClose = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
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
      {/* HEADER ORIGINAL SIN CAMBIOS VISUALES */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 1.5,
          borderBottom: "1px solid rgba(255,167,38,.35)",
          position: "relative", // 👈 ancla para el botón
          height: isMobile ? "75px" : "75px",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: isMobile ? "75px" : "75px",
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
            height: isMobile ? "75px" : "75px",
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
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            color: "#FFF",
            zIndex: 6,
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Título fijo */}
        <Typography
          sx={{
            fontWeight: 800,
            color: "#fff",
            mt: 2
          }}
        >
          Sitio web en Revisión
        </Typography>
      </DialogTitle>

      {/* CONTENIDO (misma animación) */}
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
                      key={`${t.Negocio}-${t.Id}`}
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
                      <TrabajosEnRevision trabajo={t} />
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


      <DialogActions
        sx={{
          px: 1,
          py: 0.8,
          background: "linear-gradient(90deg,#FFF3E0,#FFE0B2)",
          borderTop: "1px solid rgba(255,167,38,.35)",
          display: "flex",
          justifyContent: "flex-end", // todo al lado derecho
          gap: 0, // espacio pequeño entre botones
        }}
      >
        {/* Botón Cerrar */}
        <Button
          onClick={handleClose}
          sx={{ color: "#E65100", fontWeight: 700 }}
        >
          Cerrar
        </Button>

        {/* Botón Hablar con Ejecutivo */}
        <Button
          variant="contained"
          onClick={() => {
            if (localTrabajos.length > 0) {
              const negocio = localTrabajos[0].Negocio || "mi sitio web";
              const porcentaje = localTrabajos[0].Porcentaje || 0;

              const mensaje = `Hola, quiero información sobre el estado de mi sitio web (${negocio}). Actualmente figura con un ${porcentaje}% de avance.`;

              const numero = "56946873014";
              const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

              window.open(url, "_blank");
            }
          }}
          sx={{
            height: 36,
            position: "relative",
            overflow: "hidden",
            minWidth: 140,
            textTransform: "none",
            fontWeight: 700,
            color: "#fff",
            border: "none",
            background: "transparent",
            boxShadow: "0 6px 18px rgba(255,152,0,.35)",
            transition: "all 0.3s ease",
            borderRadius: 2,
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              borderRadius: "inherit",
              background: "linear-gradient(90deg,#FF9800,#F57C00)",
              transform: "scale(1)",
              transformOrigin: "center center",
              transition: "transform 0.6s ease",
              zIndex: 0,
            },
            "& span": {
              position: "relative",
              zIndex: 1,
            },
            "&:hover::before": {
              background: "linear-gradient(90deg,#FFA726,#FB8C00)",
            },
          }}
        >
          <span>HABLAR CON EJECUTIVO</span>
        </Button>
      </DialogActions>


    </Dialog>
  );
};

export default DialogTrabajoEnRevision;
