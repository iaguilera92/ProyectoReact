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
import { useLocation, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MenuInferior from './configuraciones/MenuInferior';

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
                    setValor(valorFinal); // ⬅️ Asegura el valor exacto
                    clearInterval(interval);
                } else {
                    setValor(nuevoValor);
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
    const [flip, setFlip] = useState(false);
    const [dispositivos, setDispositivos] = useState({ mobile: 0, desktop: 0, tablet: 0 });
    const [mostrarGrafico, setMostrarGrafico] = useState(false);
    const [mostrarPorcentajes, setMostrarPorcentajes] = useState(false);
    const [chartKey, setChartKey] = useState(0);
    const [datosGrafico, setDatosGrafico] = useState([]);
    const navigate = useNavigate();

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
                setDispositivos(data.dispositivos || { mobile: 0, desktop: 0, tablet: 0 });

                setMostrarContadorPrincipal(true); // ✅ activa animación del contador total
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
                backgroundImage: 'url(fondo-blizz.avif)',
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
                    <Box
                        sx={{
                            perspective: 1000,
                            width: cardSize,
                            height: cardSize,
                        }}
                        onClick={() => {
                            // Solo si estamos viendo la cara frontal
                            if (!flip) {
                                setFlip(true);
                                setMostrarGrafico(false);
                                setMostrarPorcentajes(false);
                                setDatosGrafico([]); // reinicia

                                setTimeout(() => {
                                    setMostrarGrafico(true);
                                    setDatosGrafico([
                                        { name: "Móvil", value: dispositivos.mobile },
                                        { name: "Escritorio", value: dispositivos.desktop },
                                        { name: "Tablet", value: dispositivos.tablet },
                                    ]);
                                }, 100);

                                setTimeout(() => {
                                    setMostrarPorcentajes(true);
                                }, 1000);
                            } else {
                                setFlip(false); // Volver a la cara frontal sin animar nada
                            }
                        }}

                    >
                        <Box
                            component={motion.div}
                            animate={{ rotateY: flip ? 180 : 0 }}
                            transition={{ duration: 0.6 }}
                            sx={{
                                width: "100%",
                                height: "100%",
                                transformStyle: "preserve-3d",
                                position: "relative",
                            }}
                        >
                            {/* Cara frontal */}
                            <Box
                                sx={{
                                    backfaceVisibility: "hidden",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        backdropFilter: "blur(4px)",
                                        color: "white",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
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
                            </Box>

                            {/* Cara trasera */}
                            <Box
                                sx={{
                                    backfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                }}
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                                        backdropFilter: "blur(4px)",
                                        color: "white",
                                        borderRadius: 3,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        p: 2,
                                    }}
                                >
                                    {mostrarGrafico && (
                                        <ResponsiveContainer width="100%" height="100%" key={chartKey}>
                                            <PieChart>
                                                <Pie
                                                    data={datosGrafico}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={isMobile ? 105 : 110}
                                                    dataKey="value"
                                                    isAnimationActive={true}
                                                    animationBegin={0}
                                                    animationDuration={800} // ⏱️ Más suave
                                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                        if (percent === 0 || !mostrarPorcentajes) return null;
                                                        const RADIAN = Math.PI / 180;
                                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                                        return (
                                                            <motion.text
                                                                x={x}
                                                                y={y}
                                                                initial={{ opacity: 0, scale: 0.5 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ duration: 0.5 }}
                                                                fill="white"
                                                                textAnchor="middle"
                                                                dominantBaseline="central"
                                                                fontSize={isMobile ? 15 : 18}
                                                                fontWeight="bold"
                                                            >
                                                                {(percent * 100).toFixed(0)}%
                                                            </motion.text>
                                                        );
                                                    }}
                                                    labelLine={false}
                                                >

                                                    <Cell fill="#6EB5FF" />   {/* Móvil - Azul pastel */}
                                                    <Cell fill="#B0F0A5" />   {/* Escritorio - Verde más oscuro */}
                                                    <Cell fill="#FFB3B3" />   {/* Tablet - Rojo pastel */}
                                                </Pie>
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={isMobile ? 36 : 50}
                                                    wrapperStyle={{ paddingTop: isMobile ? 0 : 10 }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}

                                </Paper>
                            </Box>
                        </Box>
                    </Box>
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


                <MenuInferior cardSize={cardSize} modo="dashboard" />



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
