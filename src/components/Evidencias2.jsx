import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const SeccionDestacada = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '100vh' : '600px', overflow: 'hidden' }}>
            {/* Fondo con video */}
            <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <video
                    src="/video-inicio.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Degradado inferior sobre el video */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '40%',
                        background: 'linear-gradient(to bottom, transparent, rgb(0 30 43 / 1))',
                    }}
                />
            </Box>

            {/* Capa blanca con forma personalizada */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '90%',
                    height: '100%',
                    backgroundColor: 'white',
                    WebkitMaskImage: 'url(/mongodb.svg)',
                    maskImage: 'url(/mongodb.svg)',
                    WebkitMaskRepeat: 'no-repeat',
                    maskRepeat: 'no-repeat',
                    WebkitMaskSize: 'contain',
                    maskSize: 'contain',
                    WebkitMaskPosition: 'left center',
                    maskPosition: 'left center',
                }}
            />
        </Box>
    );
};

export default SeccionDestacada;
