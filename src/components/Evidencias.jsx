import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';


const Evidencias = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const videoRef = useRef();


    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && videoRef.current) {
                    videoRef.current.play();
                } else {
                    videoRef.current?.pause();
                }
            },
            { threshold: 0.5 }
        );

        if (videoRef.current) observer.observe(videoRef.current);
        return () => {
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);
    return (
        <Box sx={{ width: '100%', position: 'relative', mt: '-80px' }}>

            {/* 🔹 Sección 1: Imagen de fondo fija con texto animado mejorado */}
            <Box
                sx={{
                    position: 'relative',
                    height: isMobile ? '35vh' : '50vh',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-start', // más arriba
                    justifyContent: 'center',
                    pt: { xs: 11, sm: 16 }, // padding top adaptativo
                    zIndex: 0,
                    backgroundImage: `url('https://entel.cdn.modyo.com/uploads/019e0744-4f00-4bab-bcca-b6e5c3ae083b/original/bg-secondary-desk-xxl_Eq.webp')`,
                    backgroundAttachment: isMobile ? 'scroll' : 'fixed',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                        height: 'auto',
                    }}
                >
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                        style={{
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
                                fontWeight: 600,
                                color: 'white',
                                fontFamily: `'Montserrat', 'Segoe UI', sans-serif`,
                                textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
                                px: 4, // espacio a izquierda y derecha
                            }}
                        >
                            Conoce cómo ayudamos a otras empresas a crecer.
                        </Typography>
                    </motion.div>
                </Box>

            </Box>


            {/* 🔹 Sección 2: Contenido con fondo blanco y borde superior (curva) */}
            <Box
                sx={{
                    position: 'relative',
                    background: 'linear-gradient(to bottom, #ffffff, #f3f3f3)',
                    pt: isMobile ? 3 : 5,
                    pb: 8,
                    px: { xs: 2, sm: 4 },
                    zIndex: 2,
                    mt: -10,
                    boxShadow: '0px -4px 20px rgba(0,0,0,0.05)',
                    borderTop: '1px solid #e0e0e0'
                }}
            >
                {/* Borde superior tipo “V” */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: isMobile ? -99 : -99,
                        left: 0,
                        width: '100%',
                        height: 100,
                        backgroundColor: '#fff',
                        zIndex: 1,
                        clipPath: 'polygon(0 0, 50% 100%, 100% 0, 100% 100%, 0 100%)',
                        pointerEvents: 'none',
                    }}
                />

                {/* Contenido */}
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 6,
                            fontWeight: 700,
                            fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
                            fontSize: { xs: '1.8rem', md: '2.6rem' },
                            color: '#111',
                            letterSpacing: 1,
                        }}
                    >
                        Evidencias
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
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
                                        {!isMobile && (
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
                                        )}
                                    </Card>

                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

        </Box >
    );
};

export default Evidencias;
