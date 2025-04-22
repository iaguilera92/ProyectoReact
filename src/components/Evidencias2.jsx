import React, { useRef } from 'react';
import { Box, Typography, CardMedia, useTheme, useMediaQuery, keyframes } from '@mui/material';

const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const SeccionDestacada = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const videosRef = useRef([]);

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
                animation: `${scrollLeft} 60s linear infinite`,
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
                    {renderScrollRow('-18s')}
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
                    sx={{
                        width: '45%',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        px: 2,
                        py: 3,
                        gap: 2,
                        overflowY: 'auto',
                    }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            color: 'rgb(0 30 43)',
                            textAlign: 'center',
                            fontSize: isMobile ? '1.5rem' : '2.5rem',
                            mb: 2,
                        }}
                    >
                        Han confiado en nosotros
                    </Typography>

                    {/* Video 1 */}
                    <Box sx={{ width: '100%', maxWidth: 360 }}>
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

                    {/* Video 2 */}
                    <Box sx={{ width: '100%', maxWidth: 360 }}>
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
                            www.autoges-web.cl
                        </Typography>
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
        </Box>
    );
};

export default SeccionDestacada;
