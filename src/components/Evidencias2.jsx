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


                    {/* Video 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={inView || hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 400 }}>
                            <CardMedia
                                component="video"
                                ref={(el) => (videosRef.current[0] = el)}
                                src={`/evidencia1.mp4`}
                                playsInline
                                muted
                                loop
                                preload="auto"
                                controls={false}
                                disablePictureInPicture
                                controlsList="nodownload nofullscreen noremoteplayback"
                                onClick={handleVideoClick}
                                sx={{
                                    height: 'auto',
                                    width: '100%',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                }}
                            />
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
                                    color: '#00bcd4',
                                    fontFamily: 'Poppins, sans-serif',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#26c6da',
                                    },
                                }}
                            >
                                www.autoges-web.cl
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Video 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={inView || hasAnimated ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 400 }}>
                            <CardMedia
                                component="video"
                                ref={(el) => (videosRef.current[1] = el)}
                                src={`/evidencia3.mp4`}
                                playsInline
                                muted
                                loop
                                preload="auto"
                                controls={false}
                                disablePictureInPicture
                                controlsList="nodownload nofullscreen noremoteplayback"
                                onClick={handleVideoClick}
                                sx={{
                                    height: 'auto',
                                    width: '100%',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                }}
                            />
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
                                    color: '#00bcd4',
                                    fontFamily: 'Poppins, sans-serif',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        color: '#26c6da',
                                    },
                                }}
                            >
                                En desarrollo...
                            </Typography>
                        </Box>
                    </motion.div>
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
        </Box>
    );
};

export default SeccionDestacada;
