import React from "react";
import { Box, Typography, IconButton, Breadcrumbs, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

const IS_PROD = import.meta.env.PROD;

export default function NavbarAdmin({ titulo, onMenuClick, accion, temaOscuro = true, forzarPrd = false, onForzarPrd, cargando = false, mensajeCarga = "Guardando..." }) {
  const navigate = useNavigate();
  const tc = temaOscuro;
  const esPrd = IS_PROD || forzarPrd;
  const ENV_LABEL  = esPrd ? "PRD" : "QAS";
  const ENV_BORDER = esPrd ? "#8b0000" : "#2e7d32";
  const ENV_BG     = esPrd ? "rgba(139,0,0,0.85)" : "rgba(46,125,50,0.85)";

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: tc ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.1)",
        bgcolor: tc ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <Box sx={{ height: 52, display: "flex", alignItems: "center", gap: 1.5, px: 2 }}>
        {/* Toggle menú */}
        {onMenuClick && (
          <IconButton
            onClick={onMenuClick}
            size="small"
            sx={{ width: 32, height: 32, color: tc ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", "&:hover": { bgcolor: tc ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: tc ? "#fff" : "#000" } }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
                <path d="M9 4l0 16" />
              </svg>
          </IconButton>
        )}

        {/* Badge entorno */}
        <Box
          onDoubleClick={() => {
            if (!IS_PROD && onForzarPrd) {
              onForzarPrd(p => !p);
              window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "Cambiando de ambiente..." } }));
              setTimeout(() => window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "" } })), 200);
            }
          }}
          sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", px: "8px", height: 20, borderRadius: "999px", bgcolor: ENV_BG, border: `1px solid ${ENV_BORDER}`, flexShrink: 0, cursor: IS_PROD ? "default" : "pointer", transition: "all 0.2s" }}
        >
          <Typography sx={{ fontSize: "0.625rem", fontWeight: 700, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap" }}>
            {ENV_LABEL}
          </Typography>
        </Box>

        {/* Separador vertical */}
        <Box sx={{ width: "1px", height: 16, bgcolor: tc ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)", flexShrink: 0 }} />

        {/* Breadcrumb */}
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: 13, color: tc ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", display: { xs: "none", md: "block" } }} />}
          sx={{ flex: 1, minWidth: 0, "& .MuiBreadcrumbs-ol": { flexWrap: "nowrap", alignItems: "center" } }}
        >
          <Box
            onClick={() => navigate("/dashboard")}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.4, cursor: "pointer", color: tc ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontSize: "0.78rem", transition: "color 0.15s", "&:hover": { color: tc ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.85)" } }}
          >
            <HomeIcon sx={{ fontSize: 13 }} />
            <Typography sx={{ fontSize: "0.78rem", lineHeight: 1 }}>Inicio</Typography>
          </Box>
          <Typography sx={{ color: tc ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)", fontSize: "0.78rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {titulo}
          </Typography>
        </Breadcrumbs>

        {/* Indicador de carga (ej: guardando oferta) */}
        {cargando && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexShrink: 0, px: 1.5, py: 0.4, borderRadius: "999px", bgcolor: tc ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: tc ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)" }}>
            <CircularProgress size={12} thickness={5} sx={{ color: tc ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }} />
            <Typography sx={{ fontSize: "0.7rem", color: tc ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)", whiteSpace: "nowrap", fontWeight: 500 }}>
              {mensajeCarga}
            </Typography>
          </Box>
        )}

        {/* Slot acción (botón agregar, etc.) */}
        {accion}

        {/* Logo */}
        <Box
          onClick={() => navigate("/dashboard")}
          sx={{ display: "flex", alignItems: "center", ml: 1, cursor: "pointer", flexShrink: 0 }}
        >
          <Box
            component="img"
            src="/logo-plataformas-web.png"
            alt="Logo"
            sx={{ height: 26, objectFit: "contain", filter: tc ? "brightness(0) invert(1)" : "none", opacity: tc ? 0.75 : 0.85, transition: "opacity 0.15s", "&:hover": { opacity: 1 } }}
          />
        </Box>
      </Box>
    </Box>
  );
}
