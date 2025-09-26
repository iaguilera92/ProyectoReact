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
import { useLocation, useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import DialogPaseMensual from "./DialogPaseMensual";
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
    const isSmallMobile = useMediaQuery("(max-width:360px)");     // iPhone SE / muy compacto
    const isLargeMobile = useMediaQuery("(min-width:400px) and (max-width:480px)"); // iPhone 14 Pro Max
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ≤600px en general
    const cardSize = isSmallMobile ? "200px" : isLargeMobile ? "320px" : isMobile ? "280px" : "340px";
    const smallCardSize = isSmallMobile ? "90px" : isLargeMobile ? "150px" : isMobile ? "130px" : "165px";


    const [mostrarContadorPrincipal, setMostrarContadorPrincipal] = useState(false);
    const [mostrarContadorChile, setMostrarContadorChile] = useState(false);
    const [mostrarContadorInt, setMostrarContadorInt] = useState(false);
    const [snackbarServicios, setSnackbarServicios] = useState(false);
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

                setVisitasChile(data.chile || 0);
                setVisitasInternacional(data.internacional || 0);
                setVisitasTotales(data.total || 0);
                setDispositivos(data.dispositivos || { mobile: 0, desktop: 0, tablet: 0 });

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

    //PASE MENSUAL
    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenPase(true);
        }, 1500); // ⏱️ 1 segundo después de cargar
        return () => clearTimeout(timer);
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
                            usuario.alias.split("").map((char, index) => (
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
                        {usuario?.usuario === "iaguilera" ? (
                            <Typography sx={{ fontSize: 26 }}>😎</Typography>
                        ) : (
                            <AdminPanelSettingsIcon sx={{ fontSize: 26, color: "white" }} />
                        )}
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
                    <Box sx={{ perspective: 1000, width: cardSize, height: cardSize }}
                        onClick={() => {
                            if (!analyticsDisponible) return; // 🚫 no girar si no hay GA

                            if (!flip) {
                                setFlip(true);
                                setMostrarGrafico(false);
                                setMostrarPorcentajes(false);
                                setDatosGrafico([]);

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
                                setFlip(false);
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
                                    elevation={6}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        background: analyticsDisponible
                                            ? "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(200,200,200,0.05))" // elegante translúcido con brillo sutil
                                            : "linear-gradient(145deg, #FFD700, #FFA500)", // no contratado = dorado
                                        color: analyticsDisponible ? "white" : "black",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 4,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        border: analyticsDisponible ? "2px solid white" : "3px solid #FFD700", // borde blanco sólido si está contratado
                                        boxShadow: analyticsDisponible
                                            ? "0 0 18px rgba(255,255,255,0.25)" // glow blanco elegante
                                            : "0 0 15px rgba(255, 215, 0, 0.7)", // glow dorado
                                        backdropFilter: "blur(6px)", // efecto glass
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                            boxShadow: analyticsDisponible
                                                ? "0 0 28px rgba(255,255,255,0.5)" // más brillo en hover
                                                : "0 0 25px rgba(255, 215, 0, 1)",
                                        },
                                        p: 2,
                                    }}
                                    onClick={() => {
                                        if (!analyticsDisponible) {
                                            handleContactClick("Google Analytics por $10.000 CLP");
                                        }
                                    }}
                                >
                                    {analyticsDisponible ? (
                                        <Contador
                                            valorFinal={visitasTotales || 0}
                                            texto="Visitas"
                                            subtexto="Visitas totales"
                                            variant="h4"
                                            iniciar={mostrarContadorPrincipal}
                                        />
                                    ) : (
                                        <>
                                            <Box
                                                component="img"
                                                src="/logo-google-analytics.png"
                                                alt="Google Analytics"
                                                sx={{
                                                    width: 200,
                                                    mb: 1,
                                                    filter: "drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))",
                                                }}
                                            />
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{
                                                    color: "white",
                                                    textShadow: "0px 0px 4px #FFD700, 0px 0px 8px #FFA500",
                                                    mb: 1,
                                                }}
                                            >
                                                Contrata Google Analytics
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                sx={{
                                                    color: "white",
                                                    border: "2px solid white",
                                                    borderRadius: "12px",
                                                    px: 2,
                                                    py: 0.5,
                                                    textAlign: "center",
                                                    boxShadow: "0 0 8px rgba(255, 255, 255, 0.7)",
                                                    background: "rgba(255, 255, 255, 0.15)",
                                                }}
                                            >
                                                $10.000 CLP
                                            </Typography>
                                        </>
                                    )}
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
                        {/* Paper pequeño 1 */}
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
                                    background: analyticsDisponible
                                        ? "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(200,200,200,0.05))"
                                        : "linear-gradient(145deg, #E6C200, #C49000)", // dorado más tenue
                                    color: analyticsDisponible ? "white" : "black",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    border: analyticsDisponible ? "2px solid white" : "2px solid #E6C200",
                                    boxShadow: analyticsDisponible
                                        ? "0 0 12px rgba(255,255,255,0.25)"
                                        : "0 0 10px rgba(230, 194, 0, 0.5)",
                                    backdropFilter: "blur(6px)",
                                    p: 0.5,
                                }}
                            >
                                {analyticsDisponible ? (
                                    <Contador
                                        valorFinal={visitasChile || 0}
                                        subtexto="Chile"
                                        delay={100}
                                        iniciar={mostrarContadorChile}
                                    />
                                ) : (
                                    <>
                                        <Typography variant="h4" component="div" sx={{ mb: 0.5 }}>
                                            🖥️
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontSize={isMobile ? "0.8rem" : "1rem"}
                                            fontWeight="bold"
                                            sx={{ textAlign: "center" }}
                                        >
                                            Monitorea visitas de tu sitio web
                                        </Typography>
                                    </>
                                )}
                            </Paper>
                        </motion.div>

                        {/* Paper pequeño 2 */}
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
                                    background: analyticsDisponible
                                        ? "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(200,200,200,0.05))"
                                        : "linear-gradient(145deg, #E6C200, #C49000)", // dorado más tenue
                                    color: analyticsDisponible ? "white" : "black",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    border: analyticsDisponible ? "2px solid white" : "2px solid #E6C200",
                                    boxShadow: analyticsDisponible
                                        ? "0 0 12px rgba(255,255,255,0.25)"
                                        : "0 0 10px rgba(230, 194, 0, 0.5)",
                                    backdropFilter: "blur(6px)",
                                    p: 0.5,
                                }}
                            >
                                {analyticsDisponible ? (
                                    <Contador
                                        valorFinal={visitasInternacional || 0}
                                        subtexto="Internacionales"
                                        delay={100}
                                        iniciar={mostrarContadorInt}
                                    />
                                ) : (
                                    <>
                                        <Typography variant="h4" component="div" sx={{ mb: 0.5 }}>
                                            📊
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            fontSize={isMobile ? "0.8rem" : "1rem"}
                                            fontWeight="bold"
                                            sx={{ textAlign: "center" }}
                                        >
                                            Analiza interacción de tus clientes
                                        </Typography>
                                    </>
                                )}
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
            <DialogPaseMensual
                open={openPase}
                onClose={() => setOpenPase(false)}
                analyticsDisponible={analyticsDisponible}
            />

        </Box >

    );
};

export default Dashboard;
