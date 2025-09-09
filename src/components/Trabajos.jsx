import { Box, Typography, Chip, LinearProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

const BarraAnimada = ({ porcentaje }) => {
  const progress = useMotionValue(0);
  const [valor, setValor] = useState(0);

  const getGradient = (val) => {
    if (val < 20) return "linear-gradient(90deg,#ff8a80,#e57373)";
    if (val < 30) return "linear-gradient(90deg,#ef5350,#e53935)";
    if (val < 70) return "linear-gradient(90deg,#ffb74d,#fb8c00)";
    return "linear-gradient(90deg,#81c784,#388e3c)";
  };

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => setValor(latest));
    const controls = animate(progress, porcentaje, {
      delay: 0.3,
      duration: 1.5,
      ease: "easeInOut",
    });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [porcentaje]);

  return (
    <LinearProgress
      variant="determinate"
      value={valor}
      sx={{
        height: 8,
        borderRadius: 4,
        bgcolor: "rgba(0,0,0,.06)",
        position: "relative",
        overflow: "hidden",
        "& .MuiLinearProgress-bar": {
          borderRadius: 4,
          backgroundImage: getGradient(valor),
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          transition: "transform 1s ease-in-out 0.5s",
        },
        ...(valor >= 70 && {
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-40%",
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.5) 50%, rgba(255,255,255,0) 100%)",
            animation: "shine 2.5s infinite",
          },
        }),
        "@keyframes shine": {
          "0%": { left: "-40%" },
          "100%": { left: "120%" },
        },
      }}
    />
  );
};


const Trabajos = ({ trabajo }) => {
  const porcentaje = Math.min(100, Math.max(0, trabajo.Porcentaje || 0));

  const getColor = (val) => {
    if (val < 20) return "#e57373";
    if (val < 30) return "#ef5350";
    if (val < 70) return "#ef6c00";
    return "#2e7d32";
  };

  return (
    <Box sx={{ mb: 0.5 }}>
      {/* Cabecera */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
          gap: 0.5,
        }}
      >
        <Typography
          component="a"
          href={`https://${trabajo.SitioWeb}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: porcentaje === 100 ? "#1976d2" : "#4E342E", // 👈 azul solo si está 100%
            textDecoration: "none",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "65%", sm: "75%" },
            "&:hover": {
              textDecoration: porcentaje === 100 ? "underline" : "none" // 👈 subrayado solo si está 100%
            }
          }}
          title={trabajo.SitioWeb}
        >
          {trabajo.SitioWeb}
        </Typography>



        <Chip
          size="small"
          icon={
            porcentaje === 100 ? (
              <CheckCircleIcon sx={{ fontSize: 11, mt: "0px" }} />
            ) : porcentaje < 30 ? (
              <ErrorOutlineIcon sx={{ fontSize: 11, mt: "0px" }} />
            ) : (
              <HourglassBottomIcon sx={{ fontSize: 11, mt: "0px" }} />
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
            fontSize: "0.65rem",
            fontWeight: 500,
            height: 18,
            bgcolor:
              porcentaje === 100
                ? "rgba(46,125,50,0.15)"
                : porcentaje < 20
                  ? "rgba(229,115,115,0.2)"
                  : "rgba(251,140,0,0.15)",
            color: getColor(porcentaje),
            "& .MuiChip-icon": {
              color: "inherit",
              fontSize: 11,
              marginLeft: "5px",
              marginRight: "-8px",
              mt: "0px"
            }
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
          mt: 0.4,
          px: 0.2,
        }}
      >
        <Typography
          sx={{ fontSize: "0.7rem", fontWeight: 500, color: getColor(porcentaje) }}
        >
          {porcentaje === 100
            ? "🏭En producción"
            : porcentaje > 70
              ? "🚀Últimos detalles"
              : porcentaje > 30
                ? "🖥️En desarrollo"
                : porcentaje >= 20
                  ? "🛠️Preparando..."
                  : "🌱Iniciando"}

        </Typography>

        <Typography
          sx={{ fontSize: "0.7rem", fontWeight: 600, color: getColor(porcentaje) }}
        >
          {porcentaje}%
        </Typography>
      </Box>
    </Box>
  );
};

export default Trabajos;
