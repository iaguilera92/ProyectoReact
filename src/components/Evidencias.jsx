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
    const { ref: imagenRef, inView: imagenInView } = useInView({
        threshold: 0.3,
        triggerOnce: true, // para que solo se dispare una vez
    });

    const evidencias = [
        {
            url: "https://www.ivelpink.cl",
            label: "www.ivelpink.cl",
            video: "/evidencia1.mp4",
            logo: "/logos/logo-ivelpink.jpg"
        },
        {
            url: "https://www.ingsnt.cl",
            label: "www.ingsnt.cl",
            video: "/evidencia2.mp4",
            logo: "/logos/logo-ingsnt.png"
        },
        {
            url: "https://www.masatracker.cl",
            label: "www.masatracker.cl",
            video: "/evidencia3.mp4",
            logo: "/logos/logo-mastracker.png"
        },
        {
            url: "https://www.investigadores-privados.cl",
            label: "investigadores-privados.cl",
            video: "/evidencia4.mp4",
            logo: "/logos/logo-investigadores-privados.png"
        },
        {
            url: "https://www.masautomatizacion.cl",
            label: "masautomatizacion.cl",
            video: "/evidencia5.mp4",
            logo: "/logos/logo-masautomatizacion.png"
        },
        {
            url: "https://www.sifg.cl",
            label: "www.sifg.cl",
            video: "/evidencia6.mp4",
            logo: "/logos/logo-sifg.png"
        },
        {
            url: null,
            label: "www.autoges-web.cl",
            video: "/evidencia7.mp4",
            logo: "/logos/logo-autoges.png"
        }, // tachada
    ];

    const evidenciaIndices = isMobile
        ? [[0, 1], [2, 3], [4, 5], [6]]   // Mobile → 3 filas de 2 + 1 fila de 1
        : [[0], [1], [2], [3], [4], [5], [6]]; // Desktop → todas en filas individuales


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
        if (!videosRef.current.length) return;

        const observers = videosRef.current.map((video) => {
            if (!video) return null;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                },
                {
                    root: null,
                    threshold: 0.5,           // al menos 50% visible
                    rootMargin: "0px 0px -10% 0px", // puedes ajustar sensibilidad
                }
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
    }, [evidencias.length]);

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

    const videoRef = useRef(null);

    useEffect(() => {
        if (imagenInView && videoRef.current) {
            videoRef.current.play().catch(err => {
                console.warn('Error al reproducir video:', err);
            });
        }
    }, [imagenInView]);

    return (
        <Box sx={{ width: '100%', position: 'relative', mt: '-80px' }}>
            {/* Sección 1 */}
            <Box
                sx={{
                    position: 'relative',
                    height: isMobile ? '60vh' : '40vh',
                    pt: { xs: 8, sm: 10 },
                    backgroundImage: `url('fondo-telefono.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'scroll',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1, // importante para layering
                }}
            >
                {/* Box para el degradado */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2%',
                        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent)',
                    }}
                />

                {/* Contenedor con el texto en movimiento */}
                <Box
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        position: 'absolute',
                        top: '30px',
                        left: 0,
                        right: 0,
                        zIndex: 2,
                    }}
                >
                    <motion.div
                        initial={{ x: '100vw' }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                        style={{
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                fontWeight: 600,
                                color: 'white',
                                fontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
                                textShadow: '1px 1px 4px rgba(0,0,0,0.2)',
                                px: 4,
                            }}
                        >
                            Control total sobre tu{' '}
                            <span style={{ color: '#ffe037' }}>negocio.</span>
                        </Typography>
                    </motion.div>
                </Box>

                {/* Imagen + video */}
                <Box
                    ref={imagenRef}
                    sx={{
                        position: 'absolute', // 🚀 clave!
                        bottom: '5%', // 🚀 hace que sobresalga un 10% en Sección 2
                        left: '27%',
                        transform: 'translateX(0%)',
                        width: '100%',
                        maxWidth: '250px',
                        aspectRatio: '572 / 788',
                        zIndex: 3,
                        pointerEvents: 'none', // para que no bloquee clics
                    }}
                >
                    {/* Video detrás */}
                    <motion.video
                        ref={videoRef}
                        src="/video-administracion.mp4"
                        loop
                        muted
                        playsInline
                        preload="auto"
                        initial={{ x: 300, opacity: 0 }}
                        animate={imagenInView ? { x: '0%', opacity: 1 } : { x: 300, opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            position: 'absolute',
                            top: '5%',
                            left: '12%',
                            width: '54.4%',
                            height: '81.7%',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            zIndex: 0,
                            backgroundColor: 'black',
                        }}
                    />

                    {/* Imagen PNG encima */}
                    <motion.img
                        src="/mano-celular.webp"
                        alt="Decorativo"
                        initial={{ x: 300, opacity: 0 }}
                        animate={imagenInView ? { x: '0%', opacity: 1 } : { x: 300, opacity: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            width: '100%',
                            height: 'auto',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,
                            pointerEvents: 'none',
                        }}
                    />
                </Box>
            </Box>





            {/* Sección 2 */}
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `url('/fondo-blizz-2.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    pt: isMobile ? 0 : 0,
                    pb: 4,
                    px: { xs: 2, sm: 4 },
                    zIndex: 2,
                    mt: 0,
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
                        backgroundImage: `url('/fondo-blizz-2.webp')`,
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

                            <Grid container spacing={3} justifyContent="center" mt={0.3}>
                                {evidenciaIndices.map((group, groupIdx) => (
                                    <Grid container item spacing={3} xs={12} key={`group-${groupIdx}`} justifyContent="center">
                                        {group.map((n, i) => (
                                            <Grid
                                                item
                                                xs={group.length === 2 ? 6 : 12}
                                                sm={6}
                                                md={4}
                                                key={n}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: (groupIdx * 2 + i) * 0.2 }}
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
                                                            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                                                                <CardMedia
                                                                    component="video"
                                                                    ref={(el) => (videosRef.current[n] = el)}
                                                                    src={evidencias[n].video}
                                                                    playsInline
                                                                    muted
                                                                    loop
                                                                    preload="none"
                                                                    controls={false}
                                                                    disablePictureInPicture
                                                                    controlsList="nodownload nofullscreen noremoteplayback"
                                                                    onCanPlay={(e) => e.target.play()}
                                                                    onLoadedData={(e) => e.target.play()}
                                                                    onClick={(e) => {
                                                                        const video = e.target;

                                                                        const requestFullscreen =
                                                                            video.requestFullscreen ||
                                                                            video.webkitEnterFullscreen ||
                                                                            video.webkitRequestFullscreen ||
                                                                            video.msRequestFullscreen;

                                                                        if (requestFullscreen) {
                                                                            requestFullscreen.call(video);

                                                                            // Opcional: cambiar estilo cuando entra en fullscreen
                                                                            const handleFullscreenChange = () => {
                                                                                const isFullscreen =
                                                                                    document.fullscreenElement === video ||
                                                                                    document.webkitFullscreenElement === video ||
                                                                                    document.msFullscreenElement === video;

                                                                                video.style.objectFit = isFullscreen ? 'contain' : 'cover';
                                                                            };

                                                                            document.addEventListener('fullscreenchange', handleFullscreenChange);
                                                                            document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
                                                                            document.addEventListener('msfullscreenchange', handleFullscreenChange);
                                                                        }

                                                                        if (video.paused) video.play();
                                                                    }}
                                                                    sx={{
                                                                        height: "100%",
                                                                        width: "100%",
                                                                        objectFit: "cover",
                                                                        cursor: "pointer",
                                                                        zIndex: 1,
                                                                    }}
                                                                />

                                                                {evidencias[n].logo && (
                                                                    <Box
                                                                        sx={{
                                                                            position: "absolute",
                                                                            bottom: 4,
                                                                            left: "50%",
                                                                            transform: "translateX(-50%)", // ✅ solo centra
                                                                            zIndex: 2,
                                                                        }}
                                                                    >
                                                                        {/* Este es el que anima scale/opacity */}
                                                                        <Box
                                                                            component={motion.div}
                                                                            initial={{ scale: 0, opacity: 0 }}
                                                                            animate={inView ? { scale: 1, opacity: 1 } : {}}
                                                                            transition={{
                                                                                duration: 0.6,
                                                                                ease: "easeOut",
                                                                                delay: 1   // ⏳ delay de 1 segundo
                                                                            }}
                                                                            sx={{
                                                                                width: 70,
                                                                                height: 70,
                                                                                borderRadius: "50%",
                                                                                background:
                                                                                    "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                                                                                p: "4px",
                                                                            }}
                                                                        >
                                                                            <Box
                                                                                component="img"
                                                                                src={evidencias[n].logo}
                                                                                alt={`${evidencias[n].label} logo`}
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    height: "100%",
                                                                                    borderRadius: "50%",
                                                                                    backgroundColor: "#fff",
                                                                                    objectFit: "contain",
                                                                                }}
                                                                            />
                                                                        </Box>
                                                                    </Box>
                                                                )}



                                                            </Box>

                                                        </Box>

                                                        {evidencias[n].url ? (
                                                            <Typography
                                                                variant="body2"
                                                                align="center"
                                                                component="a"
                                                                href={evidencias[n].url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"

                                                                sx={{
                                                                    fontSize: evidencias[n].label === "investigadores-privados.cl" ? "0.63rem" : "0.75rem", // 👈 solo cambia aquí

                                                                    display: 'block',
                                                                    mt: 1.5,
                                                                    mb: 1.5,
                                                                    color: '#00bcd4',
                                                                    fontFamily: 'Poppins, sans-serif',
                                                                    textDecoration: 'none',
                                                                    textAlign: 'center',
                                                                    '&:hover': {
                                                                        textDecoration: 'underline',
                                                                        color: '#26c6da',
                                                                    },
                                                                }}
                                                            >
                                                                {evidencias[n].label}
                                                            </Typography>
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                align="center"
                                                                sx={{
                                                                    display: 'block',
                                                                    mt: 1.5,
                                                                    mb: 1.5,
                                                                    color: 'gray',
                                                                    fontFamily: 'Poppins, sans-serif',
                                                                    textAlign: 'center',
                                                                    textDecoration: 'line-through',
                                                                    cursor: 'not-allowed',
                                                                    pointerEvents: 'none',
                                                                }}
                                                            >
                                                                {evidencias[n].label}
                                                            </Typography>
                                                        )}

                                                    </Card>
                                                </motion.div>
                                            </Grid>
                                        ))}
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

        </Box >
    );
};

export default Evidencias;
