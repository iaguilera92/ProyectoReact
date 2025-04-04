import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    useTheme,
    useMediaQuery,
    Snackbar,
    Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useInView } from "react-intersection-observer";

const Evidencias = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const videoRef = useRef();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef();


    const handleSnackbarOpen = () => setSnackbarOpen(true);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && videoRef.current) {
                    videoRef.current.play();
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.2 }
        );
        if (videoRef.current) observer.observe(videoRef.current);
        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

    const logos = [
        'logo1.jpg', '/logo2.svg', '/logo3.jpg',
        '/logo4.jpg', '/logo5.jpg', '/logo6.jpg',
        '/logo7.png', '/logo8.png', '/logo9.avif',
        '/logo10.jpg', '/logo11.jpg', '/logo12.jpg'
    ];
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);
    return (
        <Box sx={{ width: '100%', position: 'relative', mt: '-80px' }}>
            {/* 🔹 Sección 1 */}
            <Box
                sx={{
                    position: 'relative',
                    height: isMobile ? '35vh' : '40vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    pt: { xs: 11, sm: 10 },
                    zIndex: 0,
                    backgroundImage: `url('https://entel.cdn.modyo.com/uploads/019e0744-4f00-4bab-bcca-b6e5c3ae083b/original/bg-secondary-desk-xxl_Eq.webp')`,
                    backgroundAttachment: isMobile ? 'scroll' : 'fixed',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', height: 'auto' }}>
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        style={{ whiteSpace: 'nowrap', display: 'inline-block' }}
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
                            Conoce cómo ayudamos a otras empresas a crecer.
                        </Typography>
                    </motion.div>
                </Box>
            </Box>

            {/* 🔹 Sección 2 */}
            <Box
                sx={{
                    position: 'relative',
                    backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,0) 50%, #0a0a0a 100%), url('/fondo-blanco2.jpg')`,
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
                    sx={{
                        position: 'absolute',
                        top: isMobile ? '-9vh' : '-99px',
                        left: 0,
                        width: '100%',
                        height: 100,
                        zIndex: 1,
                        clipPath: isMobile
                            ? "polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)"
                            : "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
                        backgroundImage: `url('/fondo-blanco2.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                    }}
                />

                {/* Logos (quedan por encima del degradado) */}
                <motion.div
                    ref={sectionRef}
                    initial={{ opacity: 0, y: 50 }}
                    animate={visible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1 }}
                    style={{ position: 'relative', zIndex: 6 }}
                >
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* 🔹 Logos de empresas */}
                        <Box
                            sx={{
                                background: "var(--darkreader-background-f7f4f4, #241a1a)",
                                borderRadius: 4,
                                p: { xs: 2, sm: 4 },
                                mt: 0,
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                                maxWidth: "1200px",
                                mx: "auto",
                            }}
                        >
                            <Typography
                                variant="h5"
                                align="center"
                                sx={{
                                    color: "lightgray",
                                    fontWeight: 600,
                                    fontSize: { xs: "1.5rem", sm: "2rem" },
                                    mb: 3,
                                    fontfamily: '"Poppins", sans-serif'
                                }}
                            >
                                Han confiado en nosotros
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
                                                <CardMedia
                                                    poster="/fondo-areas1.jpg" // 👈 preview estático
                                                    component="video"
                                                    ref={videoRef}
                                                    src={`/video-inicio.mp4`}
                                                    muted
                                                    loop
                                                    playsInline
                                                    autoPlay
                                                    preload="metadata" // ⚠️ importante para que no descargue de inmediato
                                                    sx={{
                                                        width: '100%',
                                                        height: 250,
                                                        objectFit: 'cover',
                                                        position: 'relative',
                                                        zIndex: 1,
                                                    }}
                                                />
                                            </Card>

                                        </motion.div>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>
                </motion.div>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    Para ver más trabajos contáctanos vía redes sociales.
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Evidencias;
