import React, { useEffect, useState } from "react";
import {
    Box, Card, CardContent, Grid, Typography, useMediaQuery, useTheme,
    Snackbar, Alert, Switch, FormControlLabel, LinearProgress, Avatar, Chip, Skeleton,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FlagIcon from "@mui/icons-material/Flag";
import PublicIcon from "@mui/icons-material/Public";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import RateReviewIcon from "@mui/icons-material/RateReview";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import NavbarAdmin from "./configuraciones/NavbarAdmin";
import SidebarAdmin from "./configuraciones/SidebarAdmin";
import { supabase } from "../supabase/client";

// ─── Animated number counter ────────────────────────────────────────────────
const Contador = ({ valorFinal, iniciar }) => {
    const [valor, setValor] = useState(0);
    useEffect(() => {
        if (!iniciar || valorFinal === 0) { setValor(0); return; }
        let start = 0;
        const steps = 60;
        const increment = valorFinal / steps;
        const interval = setInterval(() => {
            start += increment;
            const v = Math.ceil(start);
            if (v >= valorFinal) { setValor(valorFinal); clearInterval(interval); }
            else setValor(v);
        }, 2000 / steps);
        return () => clearInterval(interval);
    }, [valorFinal, iniciar]);
    return <>{valor.toLocaleString("es-CL")}</>;
};

// ─── KPI Card ────────────────────────────────────────────────────────────────
const KpiCard = ({ icon, label, value, footer, highlighted, loading, t }) => {
    const cardBg = highlighted
        ? "linear-gradient(135deg, #1a7f4b, #25D366)"
        : t ? "#1e2130" : "#ffffff";
    const border = highlighted
        ? "none"
        : t ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e3e7ef";
    const textColor = highlighted ? "#fff" : t ? "#e8eaf0" : "#1a1d27";
    const subColor = highlighted ? "rgba(255,255,255,0.75)" : t ? "rgba(255,255,255,0.45)" : "#6b7280";
    const iconBg = highlighted ? "rgba(255,255,255,0.18)" : t ? "rgba(255,255,255,0.06)" : "#f3f4f6";
    const iconColor = highlighted ? "#fff" : t ? "#90caf9" : "#1976d2";

    return (
        <Card elevation={0} sx={{
            background: cardBg, border, borderRadius: 3, height: "100%", minHeight: 130,
            boxShadow: highlighted ? "0 8px 32px rgba(37,211,102,0.28)" : "none",
        }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: subColor }}>
                        {label}
                    </Typography>
                    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {React.cloneElement(icon, { sx: { fontSize: 18, color: iconColor } })}
                    </Box>
                </Box>
                <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: textColor, lineHeight: 1, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
                    {loading ? <Skeleton width={80} sx={{ bgcolor: t ? "rgba(255,255,255,0.1)" : undefined }} /> : value}
                </Typography>
                {footer && (
                    <Typography sx={{ fontSize: "0.75rem", color: subColor, mt: 1 }}>
                        {footer}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

// ─── Device row ──────────────────────────────────────────────────────────────
const DeviceRow = ({ icon, label, value, total, color, t }) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    const subColor = t ? "rgba(255,255,255,0.5)" : "#6b7280";
    const textColor = t ? "#e8eaf0" : "#1a1d27";
    return (
        <Box sx={{ mb: 1.8 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {React.cloneElement(icon, { sx: { fontSize: 16, color } })}
                    <Typography sx={{ fontSize: "0.82rem", color: textColor, fontWeight: 500 }}>{label}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: textColor, fontVariantNumeric: "tabular-nums" }}>
                        {value.toLocaleString("es-CL")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: subColor }}>{pct}%</Typography>
                </Box>
            </Box>
            <LinearProgress variant="determinate" value={pct} sx={{
                height: 6, borderRadius: 3,
                bgcolor: t ? "rgba(255,255,255,0.06)" : "#f0f1f3",
                "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
            }} />
        </Box>
    );
};

// ─── Quick action card ────────────────────────────────────────────────────────
const ActionCard = ({ icon, label, sub, onClick, t }) => {
    const bg = t ? "#1e2130" : "#ffffff";
    const border = t ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e3e7ef";
    const textColor = t ? "#e8eaf0" : "#1a1d27";
    const subColor = t ? "rgba(255,255,255,0.4)" : "#6b7280";
    const hoverBg = t ? "rgba(255,255,255,0.04)" : "#f9fafb";
    return (
        <Card elevation={0} onClick={onClick} sx={{
            background: bg, border, borderRadius: 2.5, cursor: "pointer",
            transition: "all 0.18s",
            "&:hover": { background: hoverBg, transform: "translateY(-2px)", boxShadow: t ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(0,0,0,0.08)" },
        }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 }, display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: t ? "rgba(255,255,255,0.06)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {React.cloneElement(icon, { sx: { fontSize: 20, color: t ? "#90caf9" : "#1976d2" } })}
                </Box>
                <Box>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: textColor, lineHeight: 1.2 }}>{label}</Typography>
                    {sub && <Typography sx={{ fontSize: "0.72rem", color: subColor, mt: 0.2 }}>{sub}</Typography>}
                </Box>
            </CardContent>
        </Card>
    );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [visitasTotales, setVisitasTotales] = useState(0);
    const [visitasChile, setVisitasChile] = useState(0);
    const [visitasInternacional, setVisitasInternacional] = useState(0);
    const [dispositivos, setDispositivos] = useState({ mobile: 0, desktop: 0, tablet: 0 });
    const [analyticsDisponible, setAnalyticsDisponible] = useState(true);
    const [loadingAnalytics, setLoadingAnalytics] = useState(true);
    const [totalTrabajos, setTotalTrabajos] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
    const [conCupos, setConCupos] = useState(() => localStorage.getItem("ConCupos") === "true");
    const [guardandoConCupos, setGuardandoConCupos] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem("pw-tema") !== "claro");
    const handleTema = (oscuro) => { setTemaOscuro(oscuro); localStorage.setItem("pw-tema", oscuro ? "oscuro" : "claro"); };
    const [forzarPrd, setForzarPrd] = useState(false);
    const t = temaOscuro;

    // Google Analytics
    useEffect(() => {
        const fetch = async () => {
            try {
                const endpoint = window.location.hostname === "localhost"
                    ? "http://localhost:8888/.netlify/functions/getAnalyticsStats"
                    : "/.netlify/functions/getAnalyticsStats";
                const res = await window.fetch(endpoint);
                if (!res.ok) { setAnalyticsDisponible(false); return; }
                const data = await res.json();
                setVisitasChile(data.chile?.total || 0);
                setVisitasInternacional(data.internacional?.total || 0);
                setVisitasTotales(data.total || 0);
                setDispositivos({
                    mobile: (data.chile?.mobile || 0) + (data.internacional?.mobile || 0),
                    desktop: (data.chile?.desktop || 0) + (data.internacional?.desktop || 0),
                    tablet: (data.chile?.tablet || 0) + (data.internacional?.tablet || 0),
                });
                setAnalyticsDisponible(true);
            } catch {
                setAnalyticsDisponible(false);
            } finally {
                setLoadingAnalytics(false);
            }
        };
        fetch();
    }, []);

    // Supabase: total proyectos
    useEffect(() => {
        supabase.from("trabajos").select("*", { count: "exact", head: true })
            .then(({ count }) => setTotalTrabajos(count ?? 0));
    }, []);

    // Usuario sesión
    useEffect(() => {
        const u = JSON.parse(sessionStorage.getItem("usuario"));
        if (u) setUsuario(u);
    }, []);

    // Sync conCupos
    useEffect(() => {
        const sync = () => setConCupos(localStorage.getItem("ConCupos") === "true");
        window.addEventListener("storage", sync);
        window.addEventListener("conCuposChanged", sync);
        return () => { window.removeEventListener("storage", sync); window.removeEventListener("conCuposChanged", sync); };
    }, []);

    useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

    const handleChangeConCupos = async (e) => {
        const next = e.target.checked;
        const prev = conCupos;
        setConCupos(next);
        setGuardandoConCupos(true);
        try {
            const isLocal = window.location.hostname === "localhost";
            const endpoint = isLocal
                ? "http://localhost:8888/.netlify/functions/actualizarSeguridad"
                : "/.netlify/functions/actualizarSeguridad";
            const res = await window.fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: 1, valor: next ? 1 : 0 }),
            });
            if (!res.ok) throw new Error();
            localStorage.setItem("ConCupos", String(next));
            window.dispatchEvent(new Event("conCuposChanged"));
            setSnackbar({ open: true, message: next ? "✅ Cupos activados." : "🚫 Cupos desactivados.", severity: "success" });
        } catch {
            setConCupos(prev);
            setSnackbar({ open: true, message: "⚠️ No se pudo actualizar los cupos.", severity: "error" });
        } finally {
            setGuardandoConCupos(false);
        }
    };

    const totalDispositivos = dispositivos.mobile + dispositivos.desktop + dispositivos.tablet;
    const pieData = [
        { name: "Móvil", value: dispositivos.mobile, color: "#6EB5FF" },
        { name: "Escritorio", value: dispositivos.desktop, color: "#B0F0A5" },
        { name: "Tablet", value: dispositivos.tablet, color: "#FFB3B3" },
    ].filter(d => d.value > 0);

    const mainBg = t ? "#0f1117" : "#f4f6f8";
    const cardBg = t ? "#1e2130" : "#ffffff";
    const border = t ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e3e7ef";
    const textColor = t ? "#e8eaf0" : "#1a1d27";
    const subColor = t ? "rgba(255,255,255,0.45)" : "#6b7280";

    const nombreUsuario = usuario?.alias || usuario?.nombre || usuario?.usuario || "";

    const acciones = [
        { icon: <WorkIcon />, label: "Proyectos", sub: totalTrabajos != null ? `${totalTrabajos} registrados` : "Cargando...", path: "/configurar-trabajos" },
        { icon: <PeopleIcon />, label: "Clientes", sub: "Gestionar clientes", path: "/clientes" },
        { icon: <BookOnlineIcon />, label: "Reservas", sub: "Ver reservas", path: "/reservas" },
        { icon: <MiscellaneousServicesIcon />, label: "Servicios", sub: "Configurar servicios", path: "/configurar-servicios" },
        { icon: <RateReviewIcon />, label: "En Revisión", sub: "Proyectos pendientes", path: "/configurar-en-revision" },
        { icon: <TrendingUpIcon />, label: "Analytics", sub: analyticsDisponible ? `${visitasTotales.toLocaleString("es-CL")} visitas` : "No contratado", path: null },
    ];

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <NavbarAdmin
                titulo="Dashboard"
                temaOscuro={t}
                onMenuClick={() => setSidebarOpen(p => !p)}
                forzarPrd={forzarPrd}
                onForzarPrd={setForzarPrd}
            />
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <SidebarAdmin open={sidebarOpen} temaOscuro={t} onTemaChange={handleTema} onClose={() => setSidebarOpen(false)} esPrd={forzarPrd} />

                {/* ── Main scrollable area ── */}
                <Box sx={{ flex: 1, overflowY: "auto", bgcolor: mainBg }}>

                    {/* Banner with video */}
                    <Box sx={{ position: "relative", height: isMobile ? 140 : 180, overflow: "hidden", flexShrink: 0 }}>
                        <Box component="video" src="/video-inicio-oficial.mp4" autoPlay loop muted playsInline
                            sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.35))" }} />
                        <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "space-between", px: isMobile ? 2.5 : 4, zIndex: 1 }}>
                            <Box>
                                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem", fontWeight: 500, mb: 0.3 }}>
                                    Panel de administración
                                </Typography>
                                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Typography sx={{ color: "#fff", fontSize: isMobile ? "1.2rem" : "1.5rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
                                            {nombreUsuario ? `Hola, ${nombreUsuario}` : "Bienvenido"}
                                        </Typography>
                                        {usuario?.usuario === "iaguilera"
                                            ? <Typography sx={{ fontSize: isMobile ? 20 : 24 }}>😎</Typography>
                                            : <AdminPanelSettingsIcon sx={{ color: "white", fontSize: isMobile ? 20 : 24 }} />
                                        }
                                    </Box>
                                </motion.div>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                                    <Chip label={new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
                                        size="small" sx={{ mt: 0.8, bgcolor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.85)", fontSize: "0.68rem", height: 22, backdropFilter: "blur(4px)" }} />
                                </motion.div>
                            </Box>

                            {/* Con Cupos toggle */}
                            <Box sx={{ bgcolor: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 3, px: 2, py: 1, backdropFilter: "blur(8px)" }}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={conCupos} onChange={handleChangeConCupos} disabled={guardandoConCupos} size="small"
                                            sx={{
                                                "& .MuiSwitch-switchBase": { color: "#ef5350" },
                                                "& .MuiSwitch-track": { backgroundColor: "#c62828", opacity: 1 },
                                                "& .MuiSwitch-switchBase.Mui-checked": { color: "#4fc3f7" },
                                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#29b6f6", opacity: 1 },
                                            }} />
                                    }
                                    label={
                                        <Typography sx={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700 }}>
                                            {guardandoConCupos ? "Actualizando..." : "Con Cupos"}
                                        </Typography>
                                    }
                                    sx={{ m: 0, gap: 0.5 }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ px: isMobile ? 2 : 3, pt: 3, pb: 4, mt: -2.5 }}>

                        {/* KPI row */}
                        <Grid container spacing={2} sx={{ mb: 2.5 }} alignItems="stretch">
                            {[
                                {
                                    icon: <VisibilityIcon />, label: "Visitas totales",
                                    value: analyticsDisponible
                                        ? <Contador valorFinal={visitasTotales} iniciar={!loadingAnalytics} />
                                        : "—",
                                    footer: analyticsDisponible ? "Últimos 30 días" : "Google Analytics no contratado",
                                    highlighted: false, loading: loadingAnalytics && analyticsDisponible,
                                },
                                {
                                    icon: <FlagIcon />, label: "Chile 🇨🇱",
                                    value: analyticsDisponible
                                        ? <Contador valorFinal={visitasChile} iniciar={!loadingAnalytics} />
                                        : "—",
                                    footer: analyticsDisponible && visitasTotales > 0
                                        ? `${Math.round((visitasChile / visitasTotales) * 100)}% del total`
                                        : "",
                                    loading: loadingAnalytics && analyticsDisponible,
                                },
                                {
                                    icon: <PublicIcon />, label: "Internacional 🌍",
                                    value: analyticsDisponible
                                        ? <Contador valorFinal={visitasInternacional} iniciar={!loadingAnalytics} />
                                        : "—",
                                    footer: analyticsDisponible && visitasTotales > 0
                                        ? `${Math.round((visitasInternacional / visitasTotales) * 100)}% del total`
                                        : "",
                                    loading: loadingAnalytics && analyticsDisponible,
                                },
                                {
                                    icon: conCupos ? <CheckCircleIcon /> : <DoNotDisturbIcon />,
                                    label: "Estado Cupos",
                                    value: conCupos ? "Activos" : "Inactivos",
                                    footer: conCupos ? "Clientes pueden reservar" : "Reservas deshabilitadas",
                                    highlighted: true, loading: false,
                                },
                            ].map((kpi, i) => (
                                <Grid item xs={12} sm={6} md={3} key={i}>
                                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ height: "100%" }}>
                                        <KpiCard {...kpi} t={t} />
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Middle row */}
                        <Grid container spacing={2} sx={{ mb: 2.5 }}>

                            {/* Dispositivos */}
                            <Grid item xs={12} md={5}>
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} style={{ height: "100%" }}>
                                    <Card elevation={0} sx={{ background: cardBg, border, borderRadius: 3, height: "100%" }}>
                                        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                                            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: subColor, mb: 0.5 }}>
                                                Dispositivos
                                            </Typography>
                                            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: textColor, mb: 2 }}>
                                                Distribución de visitas
                                            </Typography>

                                            {!analyticsDisponible ? (
                                                <Box sx={{ textAlign: "center", py: 3 }}>
                                                    <Typography sx={{ fontSize: "0.85rem", color: subColor }}>
                                                        Google Analytics no contratado
                                                    </Typography>
                                                </Box>
                                            ) : loadingAnalytics ? (
                                                [1, 2, 3].map(i => <Skeleton key={i} height={32} sx={{ mb: 1, bgcolor: t ? "rgba(255,255,255,0.06)" : undefined }} />)
                                            ) : (
                                                <Box sx={{ display: "flex", gap: 2 }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <DeviceRow icon={<PhoneIphoneIcon />} label="Móvil" value={dispositivos.mobile} total={totalDispositivos} color="#6EB5FF" t={t} />
                                                        <DeviceRow icon={<DesktopWindowsIcon />} label="Escritorio" value={dispositivos.desktop} total={totalDispositivos} color="#B0F0A5" t={t} />
                                                        <DeviceRow icon={<TabletMacIcon />} label="Tablet" value={dispositivos.tablet} total={totalDispositivos} color="#FFB3B3" t={t} />
                                                    </Box>
                                                    {pieData.length > 0 && (
                                                        <Box sx={{ width: 110, flexShrink: 0 }}>
                                                            <ResponsiveContainer width="100%" height={110}>
                                                                <PieChart>
                                                                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={50} dataKey="value" isAnimationActive>
                                                                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                                                    </Pie>
                                                                    <RechartsTooltip
                                                                        formatter={(v, n) => [v.toLocaleString("es-CL"), n]}
                                                                        contentStyle={{ background: t ? "#1e2130" : "#fff", border: t ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e3e7ef", borderRadius: 8, fontSize: 12 }}
                                                                        itemStyle={{ color: textColor }}
                                                                    />
                                                                </PieChart>
                                                            </ResponsiveContainer>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>

                            {/* Acciones rápidas */}
                            <Grid item xs={12} md={7}>
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ height: "100%" }}>
                                    <Card elevation={0} sx={{ background: cardBg, border, borderRadius: 3, height: "100%" }}>
                                        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                                            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: subColor, mb: 0.5 }}>
                                                Navegación rápida
                                            </Typography>
                                            <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color: textColor, mb: 2 }}>
                                                Ir a sección
                                            </Typography>
                                            <Grid container spacing={1.5}>
                                                {acciones.map((a, i) => (
                                                    <Grid item xs={12} sm={6} key={i}>
                                                        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.05 }}>
                                                            <ActionCard
                                                                icon={a.icon} label={a.label} sub={a.sub} t={t}
                                                                onClick={a.path ? () => navigate(a.path) : undefined}
                                                            />
                                                        </motion.div>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={2500} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity={snackbar.severity} icon={false} onClose={() => setSnackbar(p => ({ ...p, open: false }))} sx={{ width: "100%", fontSize: "0.85rem", boxShadow: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Dashboard;
