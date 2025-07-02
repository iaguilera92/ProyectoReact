import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, CardMedia, useTheme, useMediaQuery, keyframes } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;
const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.4 + i * 0.04 }, // puedes ajustar el tiempo
    }),
};
const textoAnimado = "Nuestros trabajos";
const videos = [
    { src: '/evidencia1.mp4', url: 'https://www.ivelpink.cl', label: 'www.ivelpink.cl' },
    { src: '/evidencia2.mp4', url: 'https://www.ingsnt.cl', label: 'www.ingsnt.cl' },
    { src: '/evidencia3.mp4', url: 'https://www.masautomatizacion.cl', label: 'www.masautomatizacion.cl' },
    { src: '/evidencia4.mp4', url: 'https://www.sifg.cl', label: 'www.sifg.cl' },
];

const SeccionDestacada = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const videosRef = useRef([]);
    const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true, rootMargin: '0px 0px -30% 0px' });
    const [hasAnimated, setHasAnimated] = useState(false);


    //EVITAR ANIMACIÓN DUPLICADA
    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [inView, hasAnimated]);

    const handleVideoClick = (e) => {
        const video = e.target;
        if (video.requestFullscreen) video.requestFullscreen();
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
        else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        else if (video.msRequestFullscreen) video.msRequestFullscreen();

        if (video.paused) video.play();
    };

    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);

            // Reproduce todos los videos una vez visibles
            videosRef.current.forEach((video) => {
                if (video && typeof video.play === 'function') {
                    video.play().catch(() => { }); // evita error si autoplay bloqueado
                }
            });
        }
    }, [inView, hasAnimated]);

    const renderScrollRow = (delay = '0s') => (
        <Box
            sx={{
                width: '200%',
                display: 'flex',
                animation: `${scrollLeft} 80s linear infinite`,
                animationDelay: delay,
                pl: '60px',
                gap: '20px',
            }}
        >
            {[1, 2].map((i) => (
                <Box
                    key={i}
                    component="img"
                    src="/fondo-mongodb.svg"
                    alt={`fondo-${i}`}
                    sx={{ width: '100%', objectFit: 'contain' }}
                />
            ))}
        </Box>
    );
    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [inView, hasAnimated]);
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: isMobile ? '100vh' : '600px',
                overflow: 'hidden',
            }}
        >
            {/* Fondo animado */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgb(0 30 43)',
                    zIndex: 0,
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 13,
                        left: 0,
                        height: '60%',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    {renderScrollRow('0s')}
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '36%',
                        width: '100%',
                        overflow: 'visible',
                    }}
                >
                    {renderScrollRow('-25s')}
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '35%',
                        background: 'linear-gradient(to bottom, transparent, rgb(0 30 43 / 1))',
                        zIndex: 1,
                    }}
                />
            </Box>

            {/* Contenido */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                }}
            >
                {/* Panel blanco con título y videos */}
                <Box
                    ref={ref}
                    sx={{
                        width: '45%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 2,
                        py: 3,
                        gap: 2,
                        overflowY: 'auto',
                    }}
                    style={{ backgroundColor: 'white', color: 'black' }}
                >

                    <Box>
                        <Typography
                            variant="h4"
                            gutterBottom
                            component="div"
                            sx={{
                                fontFamily: "'Montserrat', Helvetica, Arial, sans-serif",
                                fontSize: { xs: "1.5rem", md: "2rem" },
                                paddingLeft: { xs: "100px", md: "30px" },
                                paddingRight: { xs: "100px", md: "30px" },
                                letterSpacing: "3px",
                                my: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                position: "relative",
                                zIndex: 1,
                                backgroundColor: "transparent",
                            }}
                            style={{ color: 'black' }}
                        >

                            {/* Barra | café al inicio */}
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={inView || hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    color: "#8B4513",           // Café
                                    fontWeight: "bold",
                                    marginRight: "1px",         // 🔸 Más pegado a la 'N'
                                    marginTop: "-4px",
                                    fontSize: "0.9em",          // 🔸 Un poco más bajo que el texto
                                    lineHeight: 1,              // 🔸 Alineación vertical más precisa
                                    display: "inline-block",
                                    transform: "translateY(2px)" // 🔸 Ligero ajuste vertical si lo ves muy arriba/abajo
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
                    </Box>


                    {/* Video 1 - primera fila */}
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            mt: 6,
                            mr: '10px'
                        }}
                    >
                        {videos.map((video, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 100 }}
                                animate={inView || hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                                transition={{ duration: 0.6, delay: i * 0.2 }}
                            >
                                <Box sx={{ width: { xs: 140, sm: 160 }, height: 320 }}>
                                    <CardMedia
                                        component="video"
                                        ref={(el) => (videosRef.current[i] = el)}
                                        src={video.src}
                                        playsInline
                                        muted
                                        loop
                                        preload="auto"
                                        controls={false}
                                        disablePictureInPicture
                                        controlsList="nodownload nofullscreen noremoteplayback"
                                        onClick={handleVideoClick}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            borderRadius: 2,
                                            display: 'block',
                                        }}
                                    />
                                    <Typography
                                        variant="body2"
                                        align="center"
                                        component="a"
                                        href={video.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            display: 'block',
                                            mt: 1,
                                            color: '#00bcd4',
                                            fontFamily: 'Poppins, sans-serif',
                                            textDecoration: 'none',
                                            fontSize: '0.75rem',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                                color: '#26c6da',
                                            },
                                        }}
                                    >
                                        {video.label}
                                    </Typography>
                                </Box>
                            </motion.div>
                        ))}
                    </Box>



                </Box>

                {/* Imagen mongodb.svg al lado derecho */}
                <Box
                    sx={{
                        width: 'auto',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                        marginLeft: 0,
                    }}
                >
                    <Box
                        component="img"
                        src="/mongodb.svg"
                        alt="mongodb"
                        sx={{
                            height: '100%',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                </Box>
            </Box>
        </Box >
    );
};

export default SeccionDestacada;
