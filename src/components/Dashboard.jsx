import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    useMediaQuery,
    useTheme, Snackbar, Alert, Switch, FormControlLabel
} from "@mui/material";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import DialogPaseMensual from "./DialogPaseMensual";
import NavbarAdmin from './configuraciones/NavbarAdmin';
import SidebarAdmin from './configuraciones/SidebarAdmin';

const Contador = ({ valorFinal, texto, subtexto, delay = 0, variant = "h5", iniciar }) => {
    const [valor, setValor] = useState(0);

    useEffect(() => {
        if (!iniciar) return;

        let start = 0;
        const duration = 2000;
        const steps = 60;
        const increment = valorFinal / steps;
        const stepTime = duration / steps;

        if (valorFinal === 0) {
            setValor(0);
            return;
        }

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                start += increment;
                const nuevoValor = Math.ceil(start);
                if (nuevoValor >= valorFinal) {
                    setValor(valorFinal);
                    clearInterval(interval);
                } else {
                    setValor(nuevoValor);
                }
            }, stepTime);
        }, delay);

        return () => clearTimeout(timeout);
    }, [valorFinal, delay, iniciar]);

    return (
        <Box sx={{ textAlign: "center" }}>
            <Typography
                variant={variant}
                sx={{ fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px" }}
            >
                {valor.toLocaleString("es-CL")}
            </Typography>
            {texto && (
                <Typography sx={{
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    opacity: 0.8,
                    mt: 0.25,
                    lineHeight: 1.2,
                }}>
                    {texto}
                </Typography>
            )}
            <Box sx={{
                mt: texto ? 0.75 : 0.5,
                mx: "auto",
                width: "40%",
                height: "1px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: 1,
            }} />
            <Typography sx={{
                fontSize: "0.6rem",
                fontWeight: 700,
                opacity: 0.65,
                mt: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.9px",
                lineHeight: 1.2,
            }}>
                {subtexto}
            </Typography>
        </Box>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ≤600px en general


    const [mostrarContadorPrincipal, setMostrarContadorPrincipal] = useState(false);
    const [mostrarContadorChile, setMostrarContadorChile] = useState(false);
    const [mostrarContadorInt, setMostrarContadorInt] = useState(false);
    const [snackbarServicios, setSnackbarServicios] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const location = useLocation();
    const [usuario, setUsuario] = useState(null);
    const [visitasTotales, setVisitasTotales] = useState(0);
    const [visitasChile, setVisitasChile] = useState(0);
    const [visitasInternacional, setVisitasInternacional] = useState(0);

    const letterVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.4 + i * 0.05 }, // puedes ajustar el delay aquí
        }),
    };
    const [flip, setFlip] = useState(false);
    const [dispositivos, setDispositivos] = useState({ mobile: 0, desktop: 0, tablet: 0 });
    const [mostrarGrafico, setMostrarGrafico] = useState(false);
    const [mostrarPorcentajes, setMostrarPorcentajes] = useState(false);
    const [chartKey, setChartKey] = useState(0);
    const [datosGrafico, setDatosGrafico] = useState([]);
    const navigate = useNavigate();
    const [openPase, setOpenPase] = useState(false);
    const [analyticsDisponible, setAnalyticsDisponible] = useState(true);
    const [conCupos, setConCupos] = useState(() => localStorage.getItem("ConCupos") === "true");
    const [guardandoConCupos, setGuardandoConCupos] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("pw-sidebar") !== "false");
    const toggleSidebar = () => setSidebarOpen(p => { const next = !p; localStorage.setItem("pw-sidebar", String(next)); return next; });
    const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem("pw-tema") !== "claro");
    const handleTema = (oscuro) => { setTemaOscuro(oscuro); localStorage.setItem("pw-tema", oscuro ? "oscuro" : "claro"); };
    const [forzarPrd, setForzarPrd] = useState(false);

    //GOOGLE ANALYTICS
    useEffect(() => {
        const obtenerVisitas = async () => {
            try {
                const endpoint =
                    window.location.hostname === "localhost"
                        ? "http://localhost:8888/.netlify/functions/getAnalyticsStats"
                        : "/.netlify/functions/getAnalyticsStats";

                const res = await fetch(endpoint);

                if (!res.ok) {
                    // 🚨 Si el backend devolvió 404 o 500
                    setAnalyticsDisponible(false);
                    return;
                }

                const data = await res.json();

                setVisitasChile(data.chile?.total || 0);
                setVisitasInternacional(data.internacional?.total || 0);
                setVisitasTotales(data.total || 0);

                setDispositivos({
                    mobile: (data.chile?.mobile || 0) + (data.internacional?.mobile || 0),
                    desktop: (data.chile?.desktop || 0) + (data.internacional?.desktop || 0),
                    tablet: (data.chile?.tablet || 0) + (data.internacional?.tablet || 0),
                });


                setMostrarContadorPrincipal(true);
                setAnalyticsDisponible(true);
            } catch (err) {
                console.error("Error cargando visitas:", err);
                setAnalyticsDisponible(false);
            }
        };

        obtenerVisitas();
    }, []);

    //CONTRATAR GOOGLE ANALYTICS
    const handleContactClick = (title) => {
        const mensaje = `¡Hola! Me interesa contratar ${encodeURIComponent(title)} ¿Me comentas?`;
        window.open(`https://api.whatsapp.com/send?phone=56946873014&text=${mensaje}`, "_blank");
    };

    //GUARDAR USUARIO EN SESIÓN
    useEffect(() => {
        const usuarioGuardado = JSON.parse(sessionStorage.getItem("usuario"));
        if (usuarioGuardado) {
            setUsuario(usuarioGuardado);
        }
    }, []);

    useEffect(() => {
        const syncConCupos = () => {
            setConCupos(localStorage.getItem("ConCupos") === "true");
        };

        window.addEventListener("storage", syncConCupos);
        window.addEventListener("conCuposChanged", syncConCupos);

        return () => {
            window.removeEventListener("storage", syncConCupos);
            window.removeEventListener("conCuposChanged", syncConCupos);
        };
    }, []);

    //PASE MENSUAL
    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenPase(true);
        }, 1500); // ⏱️ 1 segundo después de cargar
        return () => clearTimeout(timer);
    }, []);

    //AJUSTAR COMPONENTE
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.body.style.zoom = "100%";
        return () => {
            document.body.style.zoom = "100%";
        };
    }, []);

    const handleChangeConCupos = async (event) => {
        const nextValue = event.target.checked;
        const previousValue = conCupos;

        setConCupos(nextValue);
        setGuardandoConCupos(true);

        try {
            const isLocal = window.location.hostname === "localhost";
            const endpoint = isLocal
                ? "http://localhost:8888/.netlify/functions/actualizarSeguridad"
                : "/.netlify/functions/actualizarSeguridad";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: 1,
                    valor: nextValue ? 1 : 0,
                }),
            });

            if (!response.ok) {
                throw new Error("No se pudo actualizar Seguridad.xlsx");
            }

            localStorage.setItem("ConCupos", String(nextValue));
            window.dispatchEvent(new Event("conCuposChanged"));
            setSnackbarServicios({
                open: true,
                message: nextValue
                    ? "✅ Se activaron los cupos de Plataformas Web."
                    : "🚫 Se desactivaron los cupos de Plataformas Web.",
                severity: "success",
            });
        } catch (error) {
            console.error("Error actualizando ConCupos:", error);
            setConCupos(previousValue);
            setSnackbarServicios({
                open: true,
                message: "⚠️ No se pudo actualizar el estado de los cupos.",
                severity: "error",
            });
        } finally {
            setGuardandoConCupos(false);
        }
    };


    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
            <NavbarAdmin
                titulo="Dashboard"
                temaOscuro={temaOscuro}
                onMenuClick={toggleSidebar}
                forzarPrd={forzarPrd}
                onForzarPrd={setForzarPrd}
            />
            <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
                <SidebarAdmin open={sidebarOpen} temaOscuro={temaOscuro} onTemaChange={handleTema} onClose={() => { setSidebarOpen(false); localStorage.setItem("pw-sidebar", "false"); }} esPrd={forzarPrd} />
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflowY: "auto",
                        overflowX: "hidden",
                        position: "relative",
                        bgcolor: temaOscuro ? "#0a0a0a" : "#f0f0f0",
                    }}
                >

            {/* ── Hero Banner ── */}
            {(() => {
              const nombreUsuario = usuario?.alias || usuario?.nombre || usuario?.usuario || "Administrador";
              const iconBoxSx = { width: 64, height: 64, border: "1px solid rgba(255,255,255,0.35)", bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" };
              const dashedLines = [
                { top: -40, bottom: -40, left: "-0.5px", borderLeft: "1px dashed rgba(255,255,255,0.55)", maskImage: "linear-gradient(to bottom, transparent, white 30%, white 70%, transparent)" },
                { top: -40, bottom: -40, right: "-0.5px", borderRight: "1px dashed rgba(255,255,255,0.55)", maskImage: "linear-gradient(to bottom, transparent, white 30%, white 70%, transparent)" },
                { left: -40, right: -40, top: "-0.5px", borderTop: "1px dashed rgba(255,255,255,0.7)", maskImage: "linear-gradient(to right, transparent, white 30%, white 70%, transparent)" },
                { left: -40, right: -40, bottom: "-0.5px", borderBottom: "1px dashed rgba(255,255,255,0.7)", maskImage: "linear-gradient(to right, transparent, white 30%, white 70%, transparent)" },
              ];
              const icons = [
                <path key="bolt" d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"/>,
                <g key="pkg"><path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"/><path d="M12 12l8 -4.5"/><path d="M12 12l0 9"/><path d="M12 12l-8 -4.5"/><path d="M16 5.25l-8 4.5"/></g>,
                <g key="grid"><path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M14 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M14 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/></g>,
                <g key="cpu"><path d="M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z"/><path d="M9 9h6v6H9z"/><path d="M3 10h2"/><path d="M3 14h2"/><path d="M10 3v2"/><path d="M14 3v2"/><path d="M21 10h-2"/><path d="M21 14h-2"/><path d="M14 21v-2"/><path d="M10 21v-2"/></g>,
              ];
              return (
                <Box sx={{ width: "100%", px: { xs: 1, md: 4 }, pt: 2, pb: 0, flexShrink: 0 }}>
                  <Box sx={{ position: "relative", borderRadius: 3, border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", px: { xs: 3, md: 5, lg: 6 }, py: { xs: 4, md: 5, lg: 6 } }}>
                    <Box sx={{ position: "absolute", inset: 0, zIndex: 0, background: import.meta.env.PROD ? "linear-gradient(135deg, #0a0a0a 0%, #160505 30%, rgba(120,10,10,0.55) 58%, rgba(150,10,10,0.85) 78%, #8B0000 100%)" : "linear-gradient(135deg, #0a0a0a 0%, #161616 28%, rgba(17,31,17,1) 52%, rgba(25,60,27,1) 75%, #2e7d32 100%)" }} />
                    <Box sx={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6, backgroundImage: ["repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 39px, rgba(255,255,255,0.05) 39px, rgba(255,255,255,0.05) 40px)", "repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 39px, rgba(255,255,255,0.05) 39px, rgba(255,255,255,0.05) 40px)", "radial-gradient(circle at 20px 20px, rgba(255,255,255,0.08) 2px, transparent 2px)", "radial-gradient(circle at 40px 40px, rgba(255,255,255,0.08) 2px, transparent 2px)"].join(", "), backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px" }} />
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: "50%", right: 104, transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
                      {[{ icon: icons[0], tx: 0 }, { icon: icons[1], tx: -64 }, { icon: icons[2], tx: 0 }].map(({ icon, tx }, i) => (
                        <Box key={i} sx={{ ...iconBoxSx, transform: tx ? `translateX(${tx}px)` : "none" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                          {dashedLines.map((style, j) => <Box key={j} sx={{ position: "absolute", ...style }} />)}
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: "50%", right: 104, transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
                      <Box sx={{ ...iconBoxSx, transform: "translateX(64px)", maskImage: "linear-gradient(to right, white 75%, transparent 100%)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{icons[3]}</svg>
                        {dashedLines.map((style, j) => <Box key={j} sx={{ position: "absolute", ...style }} />)}
                      </Box>
                    </Box>
                    <Box sx={{ position: "relative", zIndex: 2, maxWidth: 520 }}>
                      <Typography sx={{ fontSize: { xs: "1.5rem", md: "1.75rem", lg: "2.25rem" }, fontWeight: 500, color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
                        Hola, {nombreUsuario} {usuario?.usuario === "iaguilera" ? "😎" : ""}
                      </Typography>
                      <Typography sx={{ mt: 1.5, fontSize: { xs: "0.82rem", md: "0.875rem", lg: "1rem" }, color: "rgba(255,255,255,0.78)", lineHeight: 1.6, maxWidth: 430 }}>
                        Panel de administración de clientes, pagos, trabajos y transacciones.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })()}

            <Box sx={{ pt: isMobile ? 3 : 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 1,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 0.45,
                            minWidth: isMobile ? "170px" : "190px",
                            borderRadius: "999px",
                            background: "rgba(5, 15, 30, 0.58)",
                            border: "1px solid rgba(255,255,255,0.16)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={conCupos}
                                    onChange={handleChangeConCupos}
                                    disabled={guardandoConCupos}
                                    size="small"
                                    sx={{
                                        "& .MuiSwitch-switchBase": {
                                            color: "#ef5350",
                                        },
                                        "& .MuiSwitch-track": {
                                            backgroundColor: "#c62828",
                                            opacity: 1,
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                            color: "#4fc3f7",
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                            backgroundColor: "#29b6f6",
                                            opacity: 1,
                                        },
                                    }}
                                />
                            }
                            label={guardandoConCupos ? "Actualizando.." : "Con Cupos"}
                            sx={{
                                m: 0,
                                width: "100%",
                                color: "white",
                                justifyContent: "space-between",
                                "& .MuiFormControlLabel-label": {
                                    color: "#ffffff",
                                    fontSize: isMobile ? "0.82rem" : "0.9rem",
                                    fontWeight: 700,
                                    letterSpacing: "0.02em",
                                    whiteSpace: "nowrap",
                                },
                                "& .MuiFormControlLabel-label.Mui-disabled": {
                                    color: "#ffffff",
                                    opacity: 1,
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* ── KPI Cards ── */}
            <Box sx={{ width: "100%", px: { xs: 1, md: 4 }, pt: 2.5, pb: 4 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: { xs: 1.5, md: 2 } }}>

                {/* Card 1 — Visitas totales */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
                  onClick={() => {
                    if (!analyticsDisponible) { handleContactClick("Google Analytics por $10.000 CLP"); return; }
                    if (!flip) {
                      setFlip(true); setMostrarGrafico(false); setMostrarPorcentajes(false); setDatosGrafico([]);
                      setTimeout(() => { setMostrarGrafico(true); setDatosGrafico([{ name: "Móvil", value: dispositivos.mobile }, { name: "Escritorio", value: dispositivos.desktop }, { name: "Tablet", value: dispositivos.tablet }]); }, 100);
                      setTimeout(() => setMostrarPorcentajes(true), 1000);
                    } else { setFlip(false); setMostrarGrafico(false); setDatosGrafico([]); }
                  }}
                >
                  <Box sx={{ perspective: 1000, height: flip ? 280 : 130, transition: "height 0.4s ease", cursor: analyticsDisponible ? "pointer" : "default" }}>
                    <Box component={motion.div} animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.6 }} sx={{ width: "100%", height: "100%", transformStyle: "preserve-3d", position: "relative" }}>
                      {/* Frontal */}
                      <Box sx={{ backfaceVisibility: "hidden", position: "absolute", inset: 0 }}>
                        <Box sx={{ height: "100%", borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                          <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <Box>
                              <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Visitas totales</Typography>
                              <Typography sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1, mt: 0.5, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                                {analyticsDisponible ? (mostrarContadorPrincipal ? visitasTotales.toLocaleString("es-CL") : "—") : "—"}
                              </Typography>
                              <Typography sx={{ fontSize: "0.72rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.4 }}>
                                {analyticsDisponible ? "Toca para ver dispositivos" : "Sin datos · Contratar Analytics"}
                              </Typography>
                            </Box>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: temaOscuro ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>
                            </Box>
                          </Box>
                          <Box sx={{ mx: 2.5, mb: 2, height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                            <Box sx={{ height: "100%", width: analyticsDisponible ? "100%" : "0%", borderRadius: 99, background: "linear-gradient(90deg,#6366f1,#818cf8)", transition: "width 1.2s ease" }} />
                          </Box>
                        </Box>
                      </Box>
                      {/* Reverso (gráfico) */}
                      <Box sx={{ backfaceVisibility: "hidden", position: "absolute", inset: 0, transform: "rotateY(180deg)" }}>
                        <Box sx={{ height: "100%", borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", p: 1.5, display: "flex", flexDirection: "column" }}>
                          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mb: 0.5 }}>Por dispositivo</Typography>
                          {mostrarGrafico && datosGrafico.length > 0 && (
                            <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                <Pie data={datosGrafico} cx="50%" cy="45%" outerRadius={70} dataKey="value"
                                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                  labelLine={false}
                                >
                                  <Cell fill="#6366f1" /><Cell fill="#22d3ee" /><Cell fill="#f472b6" />
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={{ fontSize: "0.72rem", color: temaOscuro ? "#fff" : "#111" }} />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>

                {/* Card 2 — Chile */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} onAnimationComplete={() => setMostrarContadorChile(true)}>
                  <Box sx={{ height: 130, borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Chile 🇨🇱</Typography>
                        <Typography sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1, mt: 0.5, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                          {analyticsDisponible ? (mostrarContadorChile ? visitasChile.toLocaleString("es-CL") : "—") : "—"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.4 }}>Visitas nacionales</Typography>
                      </Box>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: temaOscuro ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      </Box>
                    </Box>
                    <Box sx={{ mx: 2.5, mb: 2, height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#22c55e,#4ade80)", width: analyticsDisponible && visitasTotales > 0 ? `${Math.round((visitasChile / visitasTotales) * 100)}%` : "0%", transition: "width 1.4s ease" }} />
                    </Box>
                  </Box>
                </motion.div>

                {/* Card 3 — Internacional */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} onAnimationComplete={() => setMostrarContadorInt(true)}>
                  <Box sx={{ height: 130, borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Internacional 🌍</Typography>
                        <Typography sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.1, mt: 0.5, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                          {analyticsDisponible ? (mostrarContadorInt ? visitasInternacional.toLocaleString("es-CL") : "—") : "—"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.4 }}>Visitas del exterior</Typography>
                      </Box>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: temaOscuro ? "rgba(251,146,60,0.15)" : "rgba(251,146,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      </Box>
                    </Box>
                    <Box sx={{ mx: 2.5, mb: 2, height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#f97316,#fb923c)", width: analyticsDisponible && visitasTotales > 0 ? `${Math.round((visitasInternacional / visitasTotales) * 100)}%` : "0%", transition: "width 1.6s ease" }} />
                    </Box>
                  </Box>
                </motion.div>

              </Box>
            </Box>

            <Snackbar
                open={snackbarServicios.open}
                autoHideDuration={2000}
                onClose={() => setSnackbarServicios((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={snackbarServicios.severity} icon={false}
                    onClose={() => setSnackbarServicios((prev) => ({ ...prev, open: false }))}
                    sx={{
                        width: "100%",
                        fontSize: isMobile ? "0.74rem" : "0.9rem",
                        boxShadow: 3,
                        whiteSpace: "nowrap",
                    }}
                >
                    {snackbarServicios.message}
                </Alert>
            </Snackbar>
            {/*<DialogPaseMensual
                open={openPase}
                onClose={() => setOpenPase(false)}
                analyticsDisponible={analyticsDisponible}
            />*/}

                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
