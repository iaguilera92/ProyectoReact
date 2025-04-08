import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import './css/Cargando.css'; // recuerda importar tu CSS personalizado

const Cargando = () => {
    return (
        <Box
            sx={{
                backgroundImage: 'url(fondo-blizz.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
                overflow: 'hidden', // evita que se desborde
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(0,0,0,0.85)',
                position: 'relative',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: 'translateY(-40%)', // sube 10%
                }}
            >
                <motion.img
                    src="/logo-plataformas-web.png"
                    alt="Cargando..."
                    width={260}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    style={{ marginBottom: '28px' }}
                />

                <Box
                    sx={{
                        width: '260px',
                        height: '6px',
                        backgroundColor: '#222',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <motion.div
                        initial={{ x: -78 }}
                        animate={{ x: 260 }}
                        transition={{
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 0.9,
                            ease: 'linear',
                        }}
                        className="barra-flujo"
                    />
                </Box>
            </Box>
        </Box>


    );
};

export default Cargando;
