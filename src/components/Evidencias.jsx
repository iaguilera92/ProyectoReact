import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, useTheme, useMediaQuery, Snackbar, Alert, } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";

const Evidencias = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef();
    const videosRef = useRef([]);
    const [scrollY, setScrollY] = useState(0);
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true, rootMargin: '0px 0px -30% 0px' });
    const [hasAnimated, setHasAnimated] = useState(false);

    const letterVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.4 + i * 0.04 }, // puedes ajustar el tiempo
        }),
    };
    const textoAnimado = "Nuestros trabajos";
    const handleSnackbarClose = (_, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    // Reproducción automática solo si es visible
    useEffect(() => {
        const observers = videosRef.current.map((video) => {
            if (!video) return null;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) video.play();
                    else video.pause();
                },
                { threshold: 0.3 }
            );
            observer.observe(video);
            return observer;
        });

        return () => {
            observers.forEach((observer, index) => {
                if (observer && videosRef.current[index]) {
                    observer.unobserve(videosRef.current[index]);
                }
            });
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const handleFullscreen = (video) => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    };

    useEffect(() => {
        if (isMobile) {
            const handleScroll = () => setScrollY(window.scrollY);
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [isMobile]);


    return (
        <Box sx={{ width: '100%', position: 'relative', mt: '-80px' }}>
            {/* Sección 1 */}
            <Box
                sx={{
                    position: 'relative',
                    height: isMobile ? '35vh' : '40vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    pt: { xs: 11, sm: 10 },
                    backgroundImage: `url('fondo-telefono.webp')`, // Imagen de fondo
                    backgroundSize: 'cover',
                    // Efecto Parallax con scroll
                    backgroundPosition: isMobile
                        ? 'center'
                        : `center ${scrollY * 0.3}px`, // Desplaza la imagen al hacer scroll
                    backgroundAttachment: 'scroll', // No fijar el fondo, simular el parallax con el scroll
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Box para el degradado */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '15%', // Aumenté el 10% a 15% para hacerlo más visible
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent)', // Aumenté la opacidad para hacerlo más notorio
                    }}
                />
                {/* Contenedor con el texto en movimiento */}
                <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', mt: '-12%' }}>
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                        style={{ whiteSpace: 'nowrap', display: 'inline-block', transform: 'translateY(50%)' }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                fontWeight: 600,
                                color: 'white',
                                fontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
                                textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
                                px: 4,
                            }}
                        >
                            Conoce cómo ayudamos a otras empresas a <span style={{ color: '#ffe037' }}>crecer.</span>
                        </Typography>
                    </motion.div>
                </Box>
            </Box>

            {/* Sección 2 */}
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url('/fondo-blanco2.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pt: isMobile ? 0 : 0,
                    pb: 4,
                    px: { xs: 2, sm: 4 },
                    zIndex: 2,
                    mt: -8,
                    boxShadow: '0px -4px 20px rgba(0,0,0,0.05)',
                    borderTop: '1px solid #e0e0e0',
                }}
            >
                {/* Clip decorativo */}
                <Box
                    ref={ref}
                    sx={{
                        position: 'absolute',
                        top: isMobile ? '-9vh' : '-99px',
                        left: 0,
                        width: '100%',
                        height: 100,
                        zIndex: 1,
                        clipPath: isMobile
                            ? "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)"
                            : "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
                        backgroundImage: `url('/fondo-blanco2.webp')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logos y videos */}
                <motion.div
                    ref={sectionRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                    style={{ position: 'relative', zIndex: 6 }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            sx={{
                                zIndex: 3,
                                background: "#241a1a",
                                borderRadius: 4,
                                p: { xs: 2, sm: 4 },
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                                maxWidth: "1200px",
                                mx: "auto",
                            }}
                        >
                            <Typography
                                variant="h4"
                                gutterBottom
                                component="div"
                                sx={{
                                    fontFamily: '"Poppins", sans-serif',
                                    fontSize: { xs: "1.5rem", md: "2rem" },
                                    paddingX: { xs: "10px", md: "30px" }, // 👈 mejor usar paddingX para izquierda y derecha
                                    paddingY: { xs: "10px", md: "20px" }, // 👈 también puedes darle arriba/abajo si quieres más aire
                                    letterSpacing: "3px",
                                    my: 0,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center", // 👈 ahora el contenido dentro queda al centro
                                    alignItems: "center",
                                    backgroundColor: "transparent",
                                    color: "lightgray",
                                    textAlign: "center", // 👈 adicional para asegurar texto centrado
                                }}
                            >
                                {/* Barra | café al inicio */}
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={inView || hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        color: "#8B4513",
                                        fontWeight: "bold",
                                        marginRight: "4px",
                                        marginTop: "-4px",
                                        fontSize: "0.9em",
                                        lineHeight: 1,
                                        display: "inline-block",
                                        transform: "translateY(2px)",
                                    }}
                                >
                                    |
                                </motion.span>

                                {/* Texto animado letra por letra */}
                                {textoAnimado.split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        custom={i}
                                        variants={letterVariants}
                                        initial="hidden"
                                        animate={inView || hasAnimated ? "visible" : "hidden"}
                                        style={{
                                            display: "inline-block",
                                            whiteSpace: "pre",
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </Typography>

                            <Grid container spacing={3} justifyContent="center">
                                {[1, 2, 3].map((n, i) => (
                                    <Grid item xs={12} sm={6} md={4} key={n}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: i * 0.2 }}
                                        >
                                            <Card
                                                sx={{
                                                    bgcolor: '#ffffff',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        bottom: -20,
                                                        left: '10%',
                                                        width: '80%',
                                                        height: '30px',
                                                        background: 'rgba(0, 0, 0, 0.45)',
                                                        filter: 'blur(12px)',
                                                        borderRadius: '50%',
                                                        zIndex: 0,
                                                    },
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: '100%',
                                                        height: 250,
                                                        backgroundColor: '#000',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="video"
                                                        ref={(el) => (videosRef.current[i] = el)}
                                                        src={`/evidencia${n}.mp4`}
                                                        playsInline
                                                        muted
                                                        loop
                                                        preload="auto"
                                                        controls={false}
                                                        disablePictureInPicture
                                                        controlsList="nodownload nofullscreen noremoteplayback"
                                                        onClick={(e) => {
                                                            const video = e.target;

                                                            // Intentar pantalla completa en todos los dispositivos
                                                            if (video.requestFullscreen) {
                                                                video.requestFullscreen();
                                                            } else if (video.webkitEnterFullscreen) {
                                                                video.webkitEnterFullscreen(); // Safari iOS
                                                            } else if (video.webkitRequestFullscreen) {
                                                                video.webkitRequestFullscreen(); // Chrome
                                                            } else if (video.msRequestFullscreen) {
                                                                video.msRequestFullscreen(); // IE / Edge
                                                            }

                                                            // Reproducir manualmente si está pausado
                                                            if (video.paused) video.play();
                                                        }}
                                                        sx={{
                                                            height: '100%',
                                                            width: i === 1 ? 'auto' : '100%',
                                                            objectFit: i === 1 ? 'contain' : 'contain',
                                                            cursor: 'pointer',
                                                            zIndex: 1,
                                                        }}
                                                    />

                                                </Box>
                                            </Card>

                                            {i === 0 && (
                                                <Typography
                                                    variant="body2"
                                                    align="center"
                                                    component="a"
                                                    href="https://www.autoges-web.cl"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{
                                                        display: 'block',
                                                        mt: 1,
                                                        color: '#00bcd4', // celeste tipo cyan claro
                                                        fontFamily: 'Poppins, sans-serif',
                                                        textDecoration: 'none',
                                                        textAlign: 'center',
                                                        '&:hover': {
                                                            textDecoration: 'underline',
                                                            color: '#26c6da', // un tono más claro al pasar el mouse
                                                        },
                                                    }}
                                                >
                                                    www.autoges-web.cl
                                                </Typography>

                                            )}
                                            {/* 👇 Texto "En desarrollo..." solo para evidencia3 */}
                                            {i === 1 && (
                                                <Typography
                                                    variant="body2"
                                                    align="center"
                                                    sx={{
                                                        mt: 1,
                                                        color: 'gray',
                                                        fontStyle: 'italic',
                                                        fontFamily: 'Poppins, sans-serif',
                                                    }}
                                                >
                                                    Resolución Teléfono
                                                </Typography>
                                            )}
                                            {i === 2 && (
                                                <Typography
                                                    variant="body2"
                                                    align="center"
                                                    sx={{
                                                        mt: 1,
                                                        color: 'gray',
                                                        fontStyle: 'italic',
                                                        fontFamily: 'Poppins, sans-serif',
                                                    }}
                                                >
                                                    En desarrollo...
                                                </Typography>
                                            )}
                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>

                        </Box>
                    </Box>
                </motion.div >
            </Box >

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    Para ver más trabajos contáctanos vía redes sociales.
                </Alert>
            </Snackbar>
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '10%',
                    background: 'linear-gradient(to bottom, transparent, rgb(0 30 43 / 1))',
                    zIndex: 2,  // Asegúrate de que este valor esté por encima de la sección decorativa pero debajo de otros elementos.
                    pointerEvents: 'none',  // Evita que interfiera con la interacción de otros elementos
                }}
            />

        </Box >
    );
};

export default Evidencias;
