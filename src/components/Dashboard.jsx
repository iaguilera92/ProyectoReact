import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    useMediaQuery,
    useTheme, Snackbar, Alert
} from "@mui/material";
import { motion } from "framer-motion";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { useLocation } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Contador = ({ valorFinal, texto, subtexto, delay = 0, variant = "h5", iniciar }) => {
    const [valor, setValor] = useState(0);

    useEffect(() => {
        if (!iniciar) return;
        let start = 0;
        const duration = 2000;
        const steps = 60;
        const increment = valorFinal / steps;
        const stepTime = duration / steps;

        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                start += increment;
                if (start >= valorFinal) {
                    setValor(valorFinal);
                    clearInterval(interval);
                } else {
                    setValor(Math.ceil(start));
                }
            }, stepTime);
        }, delay);

        return () => clearTimeout(timeout);
    }, [valorFinal, delay, iniciar]);

    return (
        <>
            <Typography variant={variant} fontWeight="bold">
                {valor} {texto}
            </Typography>
            <Typography variant="body2">{subtexto}</Typography>
        </>
    );
};

const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const cardSize = isMobile ? "300px" : "340px";
    const smallCardSize = isMobile ? "140px" : "165px";

    const [mostrarContadorPrincipal, setMostrarContadorPrincipal] = useState(false);
    const [mostrarContadorChile, setMostrarContadorChile] = useState(false);
    const [mostrarContadorInt, setMostrarContadorInt] = useState(false);
    const [snackbarServicios, setSnackbarServicios] = useState(false);
    const location = useLocation();
    const usuario = location.state?.usuario;
    //GOOGLE ANALYTICS
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

    //GOOGLE ANALYTICS
    useEffect(() => {
        const obtenerVisitas = async () => {
            try {
                const endpoint =
                    window.location.hostname === "localhost"
                        ? "http://localhost:9999/.netlify/functions/getAnalyticsStats"
                        : "/.netlify/functions/getAnalyticsStats";

                const res = await fetch(endpoint);
                const data = await res.json();

                setVisitasChile(data.chile || 0);
                setVisitasInternacional(data.internacional || 0);
                setVisitasTotales(data.total || 0);
            } catch (err) {
                console.error("Error cargando visitas:", err);
            }
        };

        obtenerVisitas();
    }, []);



    return (
        <Box
            sx={{
                height: isMobile ? "100dvh" : "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundImage: "url(/fondo-administracion.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                overflow: "hidden",
            }}
        >
            <Grid item sx={{ pt: isMobile ? 12 : 12 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        gap: 1,
                        mb: 1,
                        flexWrap: "wrap",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{
                            display: "inline-flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}
                    >
                        {"Bienvenido ".split("").map((char, index) => (
                            <motion.span
                                key={`char-${index}`}
                                custom={index}
                                variants={letterVariants}
                                initial="hidden"
                                animate="visible"
                                style={{ display: "inline-block" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}

                        {/* Si hay usuario, mostramos su nombre animado */}
                        {usuario &&
                            usuario.nombre.split("").map((char, index) => (
                                <motion.span
                                    key={`nombre-${index}`}
                                    custom={index + 10}
                                    variants={letterVariants}
                                    initial="hidden"
                                    animate="visible"
                                    style={{ display: "inline-block" }}
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                    </Typography>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                    >
                        <AdminPanelSettingsIcon sx={{ fontSize: 26, color: "white" }} />
                    </motion.div>
                </Box>
            </Grid>

            <Grid
                container
                spacing={1.5}
                justifyContent="top"
                alignItems="center"
                direction="column"
                sx={{ width: "100%", flexGrow: 1 }}
            >
                {/* Cuadro principal con animación */}
                <Grid item>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        onAnimationComplete={() => setMostrarContadorPrincipal(true)}
                    >
                        <Paper
                            elevation={4}
                            sx={{
                                width: cardSize,
                                height: cardSize,
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                backdropFilter: "blur(4px)",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 3,
                                textAlign: "center",
                            }}
                        >
                            <Contador
                                valorFinal={visitasTotales || 0}
                                texto="Visitas"
                                subtexto="Visitas totales"
                                variant="h4"
                                iniciar={mostrarContadorPrincipal}
                            />
                        </Paper>
                    </motion.div>
                </Grid>

                {/* Dos cuadros pequeños */}
                <Grid item>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            onAnimationComplete={() => setMostrarContadorChile(true)}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    width: smallCardSize,
                                    height: smallCardSize,
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    backdropFilter: "blur(4px)",
                                    color: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    textAlign: "center",
                                }}
                            >
                                <Contador
                                    valorFinal={visitasChile || 0}
                                    subtexto="Chile"
                                    delay={100}
                                    iniciar={mostrarContadorChile}
                                />
                            </Paper>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 80 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            onAnimationComplete={() => setMostrarContadorInt(true)}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    width: smallCardSize,
                                    height: smallCardSize,
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    backdropFilter: "blur(4px)",
                                    color: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    textAlign: "center",
                                }}
                            >
                                <Contador
                                    valorFinal={visitasInternacional || 0}
                                    subtexto="Internacionales"
                                    delay={100}
                                    iniciar={mostrarContadorInt}
                                />
                            </Paper>
                        </motion.div>
                    </Box>
                    <Box sx={{ height: isMobile ? 100 : 110 }} />
                </Grid>


                {/* Menú elegante con hover */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
                    style={{
                        position: "fixed", // ✅ para que quede fijo incluso con scroll
                        bottom: 0,         // ✅ pegado al borde inferior
                        left: 0,
                        width: "100%",     // ✅ ocupa todo el ancho disponible
                        display: "flex",
                        justifyContent: "center", // ✅ centrado horizontal
                        zIndex: 10,
                        pointerEvents: "auto", // 👈 asegura interacción
                    }}
                >
                    <Box
                        sx={{
                            width: cardSize,              // 📐 tu ancho ya definido
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            pt: 1,
                            gap: 0,
                            position: "relative",
                        }}
                    >
                        {/* Catálogo (sin hover) */}
                        <Box
                            sx={{
                                flex: 1,
                                height: 65,
                                backgroundColor: "white",
                                border: "2px solid black",
                                borderRadius: "12px 12px 0 0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: "-10%",
                                zIndex: 1,
                                cursor: "not-allowed",
                                boxShadow: "inset -2px 0px 3px rgba(0,0,0,0.05)"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: "translateX(-20%)",
                                    textAlign: "center",
                                }}
                            >
                                <ViewCarouselIcon sx={{ fontSize: 26, color: "grey.500" }} />
                                <Typography
                                    variant="caption"
                                    fontSize={11}
                                    color="grey.500"
                                    sx={{ mt: 0.2 }}
                                >
                                    Catálogo
                                </Typography>
                            </Box>
                        </Box>

                        {/* Visitas (activo con hover suave aunque no clickable) */}
                        <Box
                            sx={{
                                flex: 1.3,
                                height: 108,
                                backgroundColor: "#ffffff",
                                border: "2px solid black",
                                borderRadius: "16px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 2,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                marginBottom: "-10px",
                                cursor: "pointer",
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    backgroundColor: "#f7f7f7",
                                    boxShadow: "0 6px 14px rgba(0,0,0,0.2)", // más suave y visible
                                }

                            }}
                        >
                            {/* 👇 animación conjunta */}
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                    delay: 1.4,
                                    duration: 1,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <BarChartIcon sx={{ fontSize: 45, color: "success.main" }} />
                                <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    fontSize={15}
                                    color="success.main"
                                >
                                    Visitas
                                </Typography>
                            </motion.div>
                        </Box>


                        {/* Servicios (hover activo) */}
                        <Box
                            sx={{
                                flex: 1,
                                height: 65,
                                backgroundColor: "white",
                                border: "2px solid black",
                                borderRadius: "12px 12px 0 0",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                boxShadow: "inset 2px 0px 3px rgba(0,0,0,0.05)",
                                marginLeft: "-10%",
                                zIndex: 1,
                                transition: "all 0.2s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    backgroundColor: "#f7f7f7",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },

                            }}
                            onClick={() => setSnackbarServicios(true)}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transform: "translateX(20%)",
                                    textAlign: "center",
                                }}
                            >
                                <HomeRepairServiceIcon sx={{ fontSize: 26, color: "primary.main", transition: "transform 0.3s ease, color 0.3s ease" }} />
                                <Typography variant="caption" fontSize={11}>
                                    Servicios
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </motion.div>



            </Grid >
            <Snackbar
                open={snackbarServicios}
                autoHideDuration={2000}
                onClose={() => setSnackbarServicios(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity="info" icon={false}
                    onClose={() => setSnackbarServicios(false)}
                    sx={{ width: "100%", fontSize: "0.9rem", boxShadow: 3 }}
                >
                    🚧 En Construcción...
                </Alert>
            </Snackbar>

        </Box >

    );
};

export default Dashboard;
