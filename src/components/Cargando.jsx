import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const Cargando = () => {
    return (
        <Box
            sx={{
                backgroundImage: 'url(fondo-blizz.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.85)',
                position: 'relative',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: 'translateY(-40%)',
                }}
            >
                {/* Logo animado con glow */}
                <motion.img
                    src="/logo-plataformas-web.png"
                    alt="Cargando..."
                    width={260}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.3, ease: 'easeOut' }}
                    style={{
                        marginBottom: '28px',
                        filter: 'drop-shadow(0 0 6px #00ffff88)',
                    }}
                />

                {/* Contenedor de barra con borde brillante */}
                <Box
                    sx={{
                        width: '260px',
                        height: '8px',
                        backgroundColor: '#111',
                        borderRadius: '50px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 0 12px #0ff4',
                    }}
                >
                    <motion.div
                        style={{
                            width: '70px',
                            height: '100%',
                            background: 'linear-gradient(90deg, #00fff0, #007de0)',
                            borderRadius: '50px',
                            boxShadow: '0 0 12px #00f9, 0 0 30px #00e0ff',
                        }}
                        initial={{ x: -80 }}
                        animate={{ x: 260 }}
                        transition={{
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 1,
                            ease: 'linear',
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Cargando;
