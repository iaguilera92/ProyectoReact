import React, { useState } from "react";
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Divider, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LifebuoyIcon from "@mui/icons-material/HelpOutline";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import { cerrarSesion } from "../../helpers/HelperUsuarios";

const SIDEBAR_WIDTH = 240;
const IS_PROD = import.meta.env.PROD;
const ACCENT       = IS_PROD ? "#8B0000"                    : "#2e7d32";
const ACCENT_LIGHT = IS_PROD ? "rgba(139,0,0,0.25)"        : "rgba(46,125,50,0.25)";
const ACCENT_HOVER = IS_PROD ? "rgba(139,0,0,0.35)"        : "rgba(46,125,50,0.35)";
const ACCENT_ICON  = IS_PROD ? "#ef5350"                   : "#66bb6a";

const NAV_ITEMS = [
  { label: "Dashboard",   icon: <DashboardIcon />,       path: "/dashboard" },
  { label: "Trabajos",    icon: <SettingsSuggestIcon />, path: "/configurar-trabajos" },
  { label: "En Revisión", icon: <BuildIcon />,           path: "/configurar-en-revision" },
  { label: "Clientes",    icon: <PeopleIcon />,          path: "/clientes" },
  { label: "Reservas",    icon: <EventNoteIcon />,       path: "/reservas" },
];

const FOOTER_ITEMS = [
  { label: "Soporte",  icon: <LifebuoyIcon />, href: "mailto:soporteti@mitta.cl" },
  { label: "Feedback", icon: <SendIcon />,     href: "mailto:soportedesarrollo@mitta.cl" },
];

export default function SidebarAdmin({ open, temaOscuro = true, onTemaChange, onClose, esPrd = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const nombre = usuario.nombre || usuario.email || "Usuario";
  const email  = usuario.email || "";
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [appsAnchor, setAppsAnchor] = useState(null);
  const t = temaOscuro;
  const mobileWidth = Math.min(window.innerWidth * 0.82, 300);
  const isPrd = IS_PROD || esPrd;
  const AL = t ? (isPrd ? "rgba(139,0,0,0.25)"   : ACCENT_LIGHT) : (isPrd ? "rgba(139,0,0,0.85)"   : "rgba(46,125,50,0.85)");
  const AH = t ? (isPrd ? "rgba(139,0,0,0.35)"   : ACCENT_HOVER) : (isPrd ? "rgba(139,0,0,0.95)"   : "rgba(46,125,50,0.95)");
  const AI = t ? (isPrd ? "#ef5350"              : ACCENT_ICON)  : "#fff";
  const ACENT = isPrd ? "#8B0000" : ACCENT;
  const ACTIVE_TEXT = "#fff";
  const C = {
    text:        t ? "#fff"                    : "#111",
    textMuted:   t ? "rgba(255,255,255,0.65)"  : "rgba(0,0,0,0.6)",
    textDim:     t ? "rgba(255,255,255,0.35)"  : "rgba(0,0,0,0.38)",
    textLabel:   t ? "rgba(255,255,255,0.3)"   : "rgba(0,0,0,0.35)",
    border:      t ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.09)",
    hover:       t ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.05)",
    popoverBg:   t ? "#1a1a1a"                 : "#fff",
    popoverText: t ? "rgba(255,255,255,0.75)"  : "rgba(0,0,0,0.75)",
    sepColor:    t ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)",
  };

  const handleLogout = async () => {
    setMenuAnchor(null);
    await cerrarSesion();
    sessionStorage.clear();
    navigate("/administracion");
  };

  const W = isMobile ? mobileWidth : SIDEBAR_WIDTH;

  return (
    <>
      {/* Backdrop mobile */}
      {isMobile && open && (
        <Box
          onClick={onClose}
          sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.5)", zIndex: 199, backdropFilter: "blur(2px)" }}
        />
      )}
    <Box
      sx={isMobile ? {
        position: "fixed",
        top: 0, left: 0,
        height: "100%",
        width: open ? W : 0,
        minWidth: 0,
        overflow: "hidden",
        transition: "width 0.25s ease",
        zIndex: 200,
      } : {
        width: open ? SIDEBAR_WIDTH : 0,
        minWidth: 0,
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease",
        height: "100%",
        zIndex: 100,
        borderRight: `1px solid ${C.border}`,
      }}
    >
      {/* Panel interior */}
      <Box sx={{ width: W, height: "100%", bgcolor: temaOscuro ? "rgba(15,15,15,0.97)" : "#fff", borderRight: temaOscuro ? "none" : "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", transition: "background 0.2s" }}>

        {/* System switcher */}
        <Box sx={{ px: 1, py: 1, borderBottom: `1px solid ${C.border}` }}>
          <Box
            onClick={(e) => setAppsAnchor(e.currentTarget)}
            sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, height: 56, borderRadius: 1.5, cursor: "pointer", transition: "background 0.15s", "&:hover": { bgcolor: C.hover } }}
          >
            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: ACENT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ color: "#fff" }}>
                <path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336zm-5 2.66a1 1 0 0 0 -1 1a3 3 0 1 0 0 6v2a1.024 1.024 0 0 1 -.866 -.398l-.068 -.101a1 1 0 0 0 -1.732 .998a3 3 0 0 0 2.505 1.5h.161a1 1 0 0 0 .883 .994l.117 .007a1 1 0 0 0 1 -1l.176 -.005a3 3 0 0 0 -.176 -5.995v-2c.358 -.012 .671 .14 .866 .398l.068 .101a1 1 0 0 0 1.732 -.998a3 3 0 0 0 -2.505 -1.501h-.161a1 1 0 0 0 -1 -1zm1 7a1 1 0 0 1 0 2v-2zm-2 -4v2a1 1 0 0 1 0 -2z"/>
              </svg>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: isMobile ? "1rem" : "0.83rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                Plataformas Web
              </Typography>
              <Typography sx={{ fontSize: isMobile ? "0.82rem" : "0.7rem", color: C.textDim, whiteSpace: "nowrap", lineHeight: 1.3 }}>
                Acceso rápido favoritos
              </Typography>
            </Box>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M6 9l6 6l6 -6"/>
            </svg>
          </Box>

          {/* Popover Aplicaciones */}
          <Menu
            anchorEl={appsAnchor}
            open={Boolean(appsAnchor)}
            onClose={() => setAppsAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              paper: {
                sx: {
                  bgcolor: C.popoverBg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                  minWidth: 220,
                  p: 0.5,
                },
              },
            }}
          >
            <Typography sx={{ px: 1.5, pt: 1, pb: 0.5, fontSize: "0.68rem", fontWeight: 700, color: C.textLabel, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Aplicaciones
            </Typography>
            <MenuItem
              onClick={() => { setAppsAnchor(null); window.open("https://pwbot-zfzs.onrender.com/docs", "_blank"); }}
              sx={{ borderRadius: 1.5, gap: 1.5, py: 1, px: 1.5, color: C.textMuted, fontSize: "0.85rem", "&:hover": { bgcolor: C.hover, color: C.text } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </Box>
              API REST - Plataformas web
            </MenuItem>
            <MenuItem
              onClick={() => { setAppsAnchor(null); window.open("https://dev.azure.com/plataformasweb/API-REST/_build?definitionId=2", "_blank"); }}
              sx={{ borderRadius: 1.5, gap: 1.5, py: 1, px: 1.5, color: C.textMuted, fontSize: "0.85rem", "&:hover": { bgcolor: C.hover, color: C.text } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, overflow: "hidden", flexShrink: 0 }}>
                <Box component="img" src="/azure-devops.webp" alt="Azure DevOps" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </Box>
              Pruebas Automatizadas - Pipelines
            </MenuItem>
            <MenuItem
              onClick={() => { setAppsAnchor(null); window.open("https://plataformas-web.app.n8n.cloud/workflow/cuzoZiBRZ7vg72pO", "_blank"); }}
              sx={{ borderRadius: 1.5, gap: 1.5, py: 1, px: 1.5, color: C.textMuted, fontSize: "0.85rem", "&:hover": { bgcolor: C.hover, color: C.text } }}
            >
              <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" fill="none" viewBox="0 0 32 26">
                  <path fill="#EA4B71" fillRule="evenodd" d="M27.2 11.396a3.2 3.2 0 0 1-3.1-2.4h-3.667a1.6 1.6 0 0 0-1.578 1.336l-.132.79a3.2 3.2 0 0 1-1.04 1.874 3.2 3.2 0 0 1 1.04 1.874l.132.789a1.6 1.6 0 0 0 1.578 1.336h.468a3.201 3.201 0 1 1-.001 1.6h-.467a3.2 3.2 0 0 1-3.156-2.673l-.132-.79a1.6 1.6 0 0 0-1.578-1.336h-1.268a3.2 3.2 0 0 1-6.198 0H6.299a3.2 3.2 0 1 1 .001-1.6h1.8a3.2 3.2 0 0 1 6.2 0h1.267a1.6 1.6 0 0 0 1.578-1.338l.132-.79a3.2 3.2 0 0 1 3.156-2.672h3.668a3.201 3.201 0 0 1 6.299.8 3.2 3.2 0 0 1-3.2 3.2m0-1.6a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m-24 4.8a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2m9.6-1.6a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0m12.8 4.8a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0" clipRule="evenodd"/>
                </svg>
              </Box>
              n8n - Workflow
            </MenuItem>
          </Menu>
        </Box>

        {/* Nav */}
        <Box sx={{ flex: 1, py: 1, overflowY: "auto" }}>
          <Typography sx={{ px: 2.5, pt: 1, pb: 0.5, fontSize: isMobile ? "0.75rem" : "0.65rem", fontWeight: 700, color: C.textLabel, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Menú
          </Typography>
          <List dense disablePadding>
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path || location.pathname.endsWith(item.path.replace("/", ""));
              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: `Redirigiendo a ${item.label}...` } }));
                    setTimeout(() => window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "" } })), 200);
                    navigate(item.path);
                    if (isMobile) onClose?.();
                  }}
                  sx={{
                    mx: 1, borderRadius: 1.5, mb: isMobile ? 0.5 : 0.25,
                    py: isMobile ? 1.2 : undefined,
                    bgcolor: active ? AL : "transparent",
                    "&:hover": { bgcolor: active ? AH : C.hover },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: isMobile ? 40 : 34, color: active ? AI : C.textDim }}>
                    {React.cloneElement(item.icon, { sx: { fontSize: isMobile ? 22 : 17 } })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { sx: { fontSize: isMobile ? "1rem" : "0.83rem", fontWeight: active ? 600 : 400, color: active ? ACTIVE_TEXT : C.textMuted, whiteSpace: "nowrap" } } }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ borderTop: `1px solid ${C.border}` }}>
          <List dense disablePadding sx={{ py: 1 }}>
            {FOOTER_ITEMS.map((item) => (
              <ListItemButton
                key={item.label}
                component="a"
                href={item.href}
                sx={{ mx: 1, borderRadius: 1.5, mb: 0.25, "&:hover": { bgcolor: C.hover } }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: C.textDim }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 17 } })}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontSize: "0.8rem", color: C.textMuted, whiteSpace: "nowrap" } } }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* Usuario */}
          <Box onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ mx: 1, mb: 1, px: 1.5, height: 56, borderRadius: 1.5, display: "flex", alignItems: "center", gap: 1.25, cursor: "pointer", transition: "background 0.15s", "&:hover": { bgcolor: C.hover } }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: ACENT, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {nombre.substring(0, 2).toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                {nombre}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>
                {email}
              </Typography>
            </Box>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M8 9l4 -4l4 4" />
              <path d="M16 15l-4 4l-4 -4" />
            </svg>
          </Box>
        </Box>

        {/* Popover usuario */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
          slotProps={{
            paper: {
              sx: {
                bgcolor: C.popoverBg,
                border: `1px solid ${C.border}`,
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                minWidth: 220,
                p: 0.5,
              },
            },
          }}
        >
          {/* Header usuario */}
          <Box sx={{ px: 1.5, py: 1.25, display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: ACENT, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>{nombre.substring(0, 2).toUpperCase()}</Typography>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nombre}</Typography>
              <Typography sx={{ fontSize: "0.7rem", color: C.textDim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{email}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: C.sepColor, my: 0.5 }} />

          {/* Tema */}
          <Box sx={{ px: 1.5, py: 0.75, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Typography sx={{ fontSize: "0.82rem", color: C.textMuted }}>Tema</Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[{ label: "Oscuro", val: true }, { label: "Claro", val: false }].map(({ label, val }) => {
                const isActive = temaOscuro === val;
                return (
                  <Box key={label} onClick={() => onTemaChange?.(val)}
                    sx={{ px: 1.4, py: 0.35, borderRadius: "999px", cursor: "pointer", fontSize: "0.73rem", fontWeight: isActive ? 700 : 400, color: isActive ? "#fff" : C.textMuted, bgcolor: isActive ? AL : "transparent", border: isActive ? `1px solid ${ACENT}` : `1px solid ${C.border}`, transition: "all 0.15s", "&:hover": { bgcolor: isActive ? AH : C.hover } }}>
                    {label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Divider sx={{ borderColor: C.sepColor, my: 0.5 }} />

          <MenuItem onClick={() => { setMenuAnchor(null); window.location.reload(); }}
            sx={{ borderRadius: 1.5, gap: 1.5, py: 1, px: 1.5, color: C.popoverText, fontSize: "0.85rem", "&:hover": { bgcolor: C.hover, color: C.text } }}>
            <RefreshIcon sx={{ fontSize: 17 }} /> Refrescar sesión
          </MenuItem>

          <Divider sx={{ borderColor: C.sepColor, my: 0.5 }} />

          <MenuItem onClick={handleLogout}
            sx={{ borderRadius: 1.5, gap: 1.5, py: 1, px: 1.5, color: "#ef5350", fontSize: "0.85rem", "&:hover": { bgcolor: "rgba(239,83,80,0.08)" } }}>
            <LogoutIcon sx={{ fontSize: 17 }} /> Cerrar sesión
          </MenuItem>
        </Menu>
      </Box>
    </Box>
    </>
  );
}
