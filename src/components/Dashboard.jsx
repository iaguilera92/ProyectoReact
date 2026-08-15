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
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DialogPaseMensual from "./DialogPaseMensual";
import NavbarAdmin from './configuraciones/NavbarAdmin';
import SidebarAdmin from './configuraciones/SidebarAdmin';
import { cargarClientesDesdeExcel } from "../helpers/HelperClientes";

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

const D_DEFAULT = { total: 1840, chile: 1480, internacional: 360, mobile: 1050, desktop: 720, tablet: 70 };

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
    const [dispositivos, setDispositivos] = useState({ mobile: D_DEFAULT.mobile, desktop: D_DEFAULT.desktop, tablet: D_DEFAULT.tablet  });
    const [mostrarGrafico, setMostrarGrafico] = useState(false);
    const [mostrarPorcentajes, setMostrarPorcentajes] = useState(false);
    const [chartKey, setChartKey] = useState(0);
    const [datosGrafico, setDatosGrafico] = useState([]);
    const navigate = useNavigate();
    const [openPase, setOpenPase] = useState(false);
    const [analyticsDisponible, setAnalyticsDisponible] = useState(true);
    const [clientesActivos, setClientesActivos] = useState(null);
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

    //CLIENTES ACTIVOS
    useEffect(() => {
        cargarClientesDesdeExcel().then(data => {
            setClientesActivos(data.length);
        }).catch(() => setClientesActivos(null));
    }, []);

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

    const devStatus = (msg) => window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: msg } }));

    const handleChangeConCupos = async (event) => {
        const nextValue = event.target.checked;
        const previousValue = conCupos;

        setConCupos(nextValue);
        setGuardandoConCupos(true);
        devStatus("Actualizando ofertas...");

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
            await new Promise(res => setTimeout(res, 900));
            setGuardandoConCupos(false);
            devStatus("");
        }
    };


    const hayDatos = analyticsDisponible && visitasTotales > 0;
    const vTotal = hayDatos ? visitasTotales : D_DEFAULT.total;
    const vChile = hayDatos ? visitasChile : D_DEFAULT.chile;
    const vInter = hayDatos ? visitasInternacional : D_DEFAULT.internacional;
    const dMobile = hayDatos ? dispositivos.mobile : D_DEFAULT.mobile;
    const dDesktop = hayDatos ? dispositivos.desktop : D_DEFAULT.desktop;
    const dTablet = hayDatos ? dispositivos.tablet : D_DEFAULT.tablet;

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
                        minWidth: 0,
                        overflowY: "auto",
                        overflowX: "hidden",
                        pb: 4,
                        px: { xs: 1, md: 4 },
                        pt: 2,
                        bgcolor: temaOscuro ? "#0a0a0a" : "#f0f0f0",
                    }}
                >

            {/* ── Hero Banner — solo desktop ── */}
            {(() => {
              const nombreUsuario = usuario?.alias || usuario?.nombre || usuario?.usuario || "Administrador";
              const iconBoxSx = { width: { xs: 26, md: 40 }, height: { xs: 26, md: 40 }, border: "1px solid rgba(255,255,255,0.35)", bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" };
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
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ position: "relative", borderRadius: 3, border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden", px: { xs: 2.5, md: 4, lg: 5 }, py: { xs: 2, md: 5, lg: 6 } }}>
                    <Box sx={{ position: "absolute", inset: 0, zIndex: 0, background: import.meta.env.PROD ? "linear-gradient(135deg, #0a0a0a 0%, #160505 30%, rgba(120,10,10,0.55) 58%, rgba(150,10,10,0.85) 78%, #8B0000 100%)" : "linear-gradient(135deg, #0a0a0a 0%, #161616 28%, rgba(17,31,17,1) 52%, rgba(25,60,27,1) 75%, #2e7d32 100%)" }} />
                    <Box sx={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.6, backgroundImage: ["repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 39px, rgba(255,255,255,0.05) 39px, rgba(255,255,255,0.05) 40px)", "repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(255,255,255,0.05) 19px, rgba(255,255,255,0.05) 20px, transparent 20px, transparent 39px, rgba(255,255,255,0.05) 39px, rgba(255,255,255,0.05) 40px)", "radial-gradient(circle at 20px 20px, rgba(255,255,255,0.08) 2px, transparent 2px)", "radial-gradient(circle at 40px 40px, rgba(255,255,255,0.08) 2px, transparent 2px)"].join(", "), backgroundSize: "40px 40px, 40px 40px, 40px 40px, 40px 40px" }} />
                    {/* Íconos — grupo principal (bolt, package con -translateX, grid) */}
                    <Box sx={{ position: "absolute", top: "50%", right: { xs: 10, md: 100 }, transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none", maskImage: { xs: "linear-gradient(to right, white 40%, transparent 100%)", md: "none" } }}>
                      {[{ icon: icons[0], tx: 0, txXs: 0 }, { icon: icons[1], tx: -40, txXs: -20 }, { icon: icons[2], tx: 0, txXs: 0 }].map(({ icon, tx, txXs }, i) => (
                        <Box key={i} sx={{ ...iconBoxSx, transform: { xs: txXs ? `translateX(${txXs}px)` : "none", md: tx ? `translateX(${tx}px)` : "none" } }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? 12 : 18} height={isMobile ? 12 : 18} viewBox="0 0 24 24" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                          {dashedLines.map((style, j) => <Box key={j} sx={{ position: "absolute", ...style, display: { xs: "none", md: "block" } }} />)}
                        </Box>
                      ))}
                    </Box>
                    {/* Ícono CPU — translate-x-full, se desvanece a la derecha */}
                    <Box sx={{ display: { xs: "none", md: "block" }, position: "absolute", top: "50%", right: { xs: 10, md: 100 }, transform: "translateY(-50%)", zIndex: 1, pointerEvents: "none" }}>
                      <Box sx={{ ...iconBoxSx, transform: "translateX(40px)", maskImage: "linear-gradient(to right, white 75%, transparent 100%)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">{icons[3]}</svg>
                        {dashedLines.map((style, j) => <Box key={j} sx={{ position: "absolute", ...style }} />)}
                      </Box>
                    </Box>
                    <Box sx={{ position: "relative", zIndex: 2, maxWidth: 520 }}>
                      <Typography sx={{ fontSize: { xs: "1rem", md: "1.25rem", lg: "1.55rem" }, fontWeight: 500, color: "#fff", letterSpacing: "-0.035em", lineHeight: 1.2, fontFamily: "'Poppins', sans-serif" }}>
                        Hola, {nombreUsuario} {usuario?.usuario === "iaguilera" ? "😎" : ""}
                      </Typography>
                      <Typography sx={{ mt: 0.4, fontSize: { xs: "0.7rem", md: "0.78rem", lg: "0.84rem" }, color: "rgba(255,255,255,0.65)", lineHeight: 1.4, maxWidth: 430, display: { xs: "none", md: "block" } }}>
                        Panel de administración de clientes, pagos, trabajos y transacciones.
                      </Typography>
                      <Typography sx={{ mt: 0.3, fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.3, display: { xs: "block", md: "none" } }}>
                        Panel de administración · Plataformas Web
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })()}

            {/* ── KPI Cards ── */}
            <Box sx={{ pt: 0, pb: 1 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4, 1fr)" }, gap: { xs: 1, md: 1.5 } }}>

                {/* Card 1 — Visitas totales */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }} onAnimationComplete={() => setMostrarContadorPrincipal(true)}>
                  <Box sx={{ height: 105, borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.18)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(99,102,241,0.12)" : "0 4px 24px rgba(99,102,241,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2, pt: 1.2, pb: 0.8, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Visitas totales</Typography>
                        <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, lineHeight: 1.1, mt: 0.2, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                          {mostrarContadorPrincipal ? vTotal.toLocaleString("es-CL") : "—"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.2 }}>
                          {analyticsDisponible ? "Últimos 30 días" : "Datos de muestra"}
                        </Typography>
                      </Box>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(99,102,241,0.4)" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M3.6 9h16.8"/><path d="M3.6 15h16.8"/><path d="M11.5 3a17 17 0 0 0 0 18"/><path d="M12.5 3a17 17 0 0 1 0 18"/></svg>
                      </Box>
                    </Box>
                    <Box sx={{ mx: 1.5, mb: 1, height: 3, borderRadius: 99, overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: "100%", borderRadius: 99, background: "linear-gradient(90deg,#6366f1,#a78bfa,#818cf8)", transition: "width 1.2s ease" }} />
                    </Box>
                  </Box>
                </motion.div>

                {/* Card 2 — Chile */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} onAnimationComplete={() => setMostrarContadorChile(true)}>
                  <Box sx={{ height: 105, borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2, pt: 1.2, pb: 0.8, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Chile 🇨🇱</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.1, mt: 0.2, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                          {mostrarContadorChile ? vChile.toLocaleString("es-CL") : "—"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.2 }}>Visitas nacionales</Typography>
                      </Box>
                      <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: temaOscuro ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      </Box>
                    </Box>
                    <Box sx={{ mx: 1.5, mb: 1, height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#22c55e,#4ade80)", width: `${Math.round((vChile / vTotal) * 100)}%`, transition: "width 1.4s ease" }} />
                    </Box>
                  </Box>
                </motion.div>

                {/* Card 3 — Internacional */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} onAnimationComplete={() => setMostrarContadorInt(true)}>
                  <Box sx={{ height: 105, borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <Box sx={{ px: 2, pt: 1.2, pb: 0.8, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Internacional 🌍</Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.1, mt: 0.2, color: temaOscuro ? "#fff" : "#111", letterSpacing: "-0.03em" }}>
                          {mostrarContadorInt ? vInter.toLocaleString("es-CL") : "—"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mt: 0.2 }}>Visitas del exterior</Typography>
                      </Box>
                      <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: temaOscuro ? "rgba(251,146,60,0.15)" : "rgba(251,146,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      </Box>
                    </Box>
                    <Box sx={{ mx: 1.5, mb: 1, height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#f97316,#fb923c)", width: `${Math.round((vInter / vTotal) * 100)}%`, transition: "width 1.6s ease" }} />
                    </Box>
                  </Box>
                </motion.div>

                {/* Card 4 — Con Cupos */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }} style={{ height: 105 }}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      background: conCupos
                        ? "linear-gradient(135deg, #064e1a 0%, #166534 50%, #15803d 100%)"
                        : "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)",
                      boxShadow: conCupos
                        ? "0 6px 24px rgba(22,101,52,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"
                        : "0 6px 24px rgba(153,27,27,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
                      border: `1px solid ${conCupos ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                      transition: "background 0.5s ease, box-shadow 0.5s ease, border 0.5s ease",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      px: 2,
                      pt: 1.5,
                      pb: 1.2,
                      cursor: guardandoConCupos ? "wait" : "default",
                    }}
                    onClick={() => { if (!guardandoConCupos) handleChangeConCupos({ target: { checked: !conCupos } }); }}
                  >
                    {/* Shine overlay */}
                    <Box sx={{ position: "absolute", top: 0, left: "-75%", width: "50%", height: "100%", background: "linear-gradient(120deg,transparent,rgba(255,255,255,0.1),transparent)", transform: "skewX(-20deg)", animation: "shineCupos 4s ease-in-out infinite", pointerEvents: "none", "@keyframes shineCupos": { "0%": { left: "-75%" }, "60%": { left: "130%" }, "100%": { left: "130%" } } }} />

                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <Box>
                        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.55)" }}>
                          Ofertas
                        </Typography>
                        <Typography sx={{ fontSize: "1.3rem", fontWeight: 800, lineHeight: 1.1, mt: 0.3, color: "#fff" }}>
                          {guardandoConCupos ? "…" : conCupos ? "Activas" : "Pausadas"}
                        </Typography>
                        <Typography sx={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", mt: 0.3 }}>
                          Plataformas Web
                        </Typography>
                      </Box>
                      <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {conCupos ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>
                        {conCupos ? "Habilita ofertas en la plataforma" : "Toca para activar ofertas"}
                      </Typography>
                      <Switch
                        checked={conCupos}
                        onChange={handleChangeConCupos}
                        disabled={guardandoConCupos}
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          "& .MuiSwitch-switchBase": { color: "#f87171" },
                          "& .MuiSwitch-track": { backgroundColor: "rgba(248,113,113,0.5)", opacity: "1 !important" },
                          "& .MuiSwitch-switchBase.Mui-checked": { color: "#4ade80" },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "rgba(74,222,128,0.5)", opacity: "1 !important" },
                        }}
                      />
                    </Box>
                  </Box>
                </motion.div>

              </Box>

              {/* ── Sección inferior: grid + chart ── */}
              <Box sx={{ mt: 1.5, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.6fr" }, gap: 1.5 }}>

                {/* Panel izquierdo — Stats list */}
                <Box sx={{ borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mb: 1.5 }}>Resumen operacional</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
                    {/* Clientes activos — fila destacada */}
                    <Box sx={{ py: 1, mb: 0.5, borderBottom: `1px solid ${temaOscuro ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#fbbf24", flexShrink: 0, boxShadow: "0 0 6px #fbbf2466" }} />
                          <Typography sx={{ fontSize: "0.78rem", color: temaOscuro ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.75)", fontWeight: 700 }}>Clientes activos</Typography>
                        </Box>
                        <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: temaOscuro ? "#fbbf24" : "#b45309" }}>
                          {clientesActivos !== null ? clientesActivos.toLocaleString("es-CL") : "—"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Resto de filas */}
                    {[
                      { label: "Chile", value: vChile.toLocaleString("es-CL"), color: "#4ade80", pct: Math.round((vChile / vTotal) * 100) },
                      { label: "Internacional", value: vInter.toLocaleString("es-CL"), color: "#fb923c", pct: Math.round((vInter / vTotal) * 100) },
                      { label: "Móvil", value: dMobile.toLocaleString("es-CL"), color: "#818cf8", pct: Math.round((dMobile / vTotal) * 100) },
                      { label: "Desktop", value: dDesktop.toLocaleString("es-CL"), color: "#38bdf8", pct: Math.round((dDesktop / vTotal) * 100) },
                      { label: "Tablet", value: dTablet.toLocaleString("es-CL"), color: "#f472b6", pct: Math.round((dTablet / vTotal) * 100) },
                    ].map((item, i, arr) => (
                      <Box key={item.label} sx={{ py: 1, borderBottom: i < arr.length - 1 ? `1px solid ${temaOscuro ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color, flexShrink: 0, boxShadow: `0 0 6px ${item.color}66` }} />
                            <Typography sx={{ fontSize: "0.78rem", color: temaOscuro ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)", fontWeight: 500 }}>{item.label}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: temaOscuro ? "#fff" : "#111" }}>{item.value}</Typography>
                        </Box>
                        <Box sx={{ height: 3, borderRadius: 99, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", overflow: "hidden", ml: 2.25 }}>
                          <Box sx={{ height: "100%", borderRadius: 99, bgcolor: item.color, width: `${item.pct}%`, transition: "width 1s ease", opacity: 0.7 }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Panel derecho — Gráfico */}
                <Box sx={{ borderRadius: 3, border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, bgcolor: temaOscuro ? "#141414" : "#fff", boxShadow: temaOscuro ? "0 4px 24px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.08)", p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", mb: 1.5 }}>Visitas por origen</Typography>
                  {true ? (
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "Chile", visitas: vChile },
                        { name: "Internacional", visitas: vInter },
                        { name: "Total", visitas: vTotal },
                      ]} barSize={isMobile ? 32 : 60} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: temaOscuro ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: temaOscuro ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: temaOscuro ? "#2a2a2a" : "#fff", border: `1px solid ${temaOscuro ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}`, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }} labelStyle={{ color: temaOscuro ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)", fontWeight: 500 }} itemStyle={{ color: temaOscuro ? "#fff" : "#111", fontWeight: 700 }} cursor={{ fill: temaOscuro ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }} />
                        <Bar dataKey="visitas" radius={[6, 6, 0, 0]}>
                          {[{ fill: "#4ade80" }, { fill: "#fb923c" }, { fill: "#818cf8" }].map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ height: 170, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                      <Typography sx={{ fontSize: "2rem" }}>📊</Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: temaOscuro ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", textAlign: "center" }}>Analytics no disponible</Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: temaOscuro ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", textAlign: "center" }}>Disponible en producción</Typography>
                    </Box>
                  )}
                </Box>

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
