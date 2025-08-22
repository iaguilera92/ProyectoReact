import { Box, Typography, Chip, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

const BarraAnimada = ({ porcentaje }) => {
  const progress = useMotionValue(0);
  const [valor, setValor] = useState(0);

  // Función para decidir gradiente según avance
  const getGradient = (val) => {
    if (val < 20) return "linear-gradient(90deg,#ff8a80,#e57373)"; // rojo suave
    if (val < 30) return "linear-gradient(90deg,#ef5350,#e53935)"; // rojo fuerte
    if (val < 70) return "linear-gradient(90deg,#ffb74d,#fb8c00)"; // naranjo
    return "linear-gradient(90deg,#81c784,#388e3c)"; // verde
  };

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      setValor(latest);
    });

    const controls = animate(progress, porcentaje, {
      delay: 0.5,       // espera antes de iniciar
      duration: 2,      // animación más lenta
      ease: "easeInOut" // curva suave
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [porcentaje]);

  return (
    <Box>
      <LinearProgress
        variant="determinate"
        value={valor}
        sx={{
          height: 15,
          borderRadius: 6,
          bgcolor: "rgba(0,0,0,.08)",
          overflow: "hidden",
          "& .MuiLinearProgress-bar": {
            borderRadius: 6,
            background: `${getGradient(valor)} !important`,
            transition: "transform 0.6s ease-in-out",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-40%",
              width: "40%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.6) 50%, rgba(255,255,255,0) 100%)",
              animation: "shine 2.5s infinite",
            },
          },
          "@keyframes shine": {
            "0%": { left: "-40%" },
            "100%": { left: "120%" },
          },
        }}
      />

    </Box>
  );
};


const Trabajos = ({ trabajo }) => {

  const porcentaje = Math.min(100, Math.max(0, trabajo.Porcentaje || 0));
  // función para colores según porcentaje
  const getColor = (val) => {
    if (val < 20) return "#e57373"; // rojo suave intermedio
    if (val < 30) return "#ef5350"; // rojo estándar (un poco más fuerte)
    if (val < 70) return "#ef6c00"; // naranjo
    return "#2e7d32";              // verde
  };

  return (
    <Box sx={{ mb: 2.5 }}>
      {/* Cabecera */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.75,
          gap: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: "#4E342E",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "65%", sm: "75%" },
          }}
          title={trabajo.SitioWeb}
        >
          {trabajo.SitioWeb}
        </Typography>

        <Chip
          size="small"
          icon={
            porcentaje === 100 ? (
              <CheckCircleIcon sx={{ fontSize: 16 }} />
            ) : porcentaje < 30 ? (
              <ErrorOutlineIcon sx={{ fontSize: 16 }} />
            ) : (
              <HourglassBottomIcon sx={{ fontSize: 16 }} />
            )
          }
          label={
            porcentaje === 100
              ? "Completado"
              : porcentaje < 20
                ? "Iniciando"
                : "En curso"
          }
          sx={{
            fontWeight: 600,
            bgcolor:
              porcentaje === 100
                ? "rgba(46,125,50,0.15)"
                : porcentaje < 20
                  ? "rgba(229,115,115,0.2)" // fondo rojizo suave
                  : "rgba(251,140,0,0.15)",
            color: getColor(porcentaje),
            "& .MuiChip-icon": { color: "inherit" },
          }}
        />

      </Box>

      {/* Barra */}
      <BarraAnimada porcentaje={porcentaje} />


      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.5,
          px: 0.2,
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: getColor(porcentaje) }}
        >
          {porcentaje === 100
            ? "🎉 ¡Listo!"
            : porcentaje > 70
              ? "🚀 Últimos detalles"
              : porcentaje > 30
                ? "⚡ En progreso"
                : porcentaje >= 20
                  ? "🛠️ Preparando..."
                  : "🌱 Iniciando"}
        </Typography>

        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: getColor(porcentaje) }}
        >
          {porcentaje}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Trabajos;
