import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const Cargando = () => {
    const [glow, setGlow] = useState(false);
    const [showElectricEffect, setShowElectricEffect] = useState(false);

    useEffect(() => {
        const timerGlow = setTimeout(() => {
            setGlow(true);
            setShowElectricEffect(true);

            // ⏳ Después de 1 segundo, quitar el rayo
            setTimeout(() => {
                setShowElectricEffect(false);
            }, 1000);
        }, 1200);

        return () => clearTimeout(timerGlow);
    }, []);

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
                {/* Imágenes + Efecto */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0px',
                        marginBottom: '20px',
                        position: 'relative',
                    }}
                >
                    {/* ⚡ Efecto de electricidad atrás */}
                    {showElectricEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0,255,255,0.7) 0%, rgba(0,125,224,0.4) 40%, transparent 70%)',
                                boxShadow: `
        0 0 12px #00fff0,
        0 0 24px #00ccff,
        0 0 36px #007de0
      `,
                                filter: 'blur(6px)',
                                pointerEvents: 'none',
                                zIndex: 0,
                            }}
                        />
                    )}


                    {/* Logo Izquierdo */}
                    <motion.img
                        src="/logo-plataformas-1.png"
                        alt="Logo izquierda"
                        initial={{ x: -80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{
                            width: 130,
                            height: 'auto',
                            display: 'block',
                            position: 'relative',
                            zIndex: 2,
                            filter: glow ? 'drop-shadow(0 0 6px #00e0ff88)' : 'none',
                        }}
                    />

                    {/* Logo Derecho */}
                    <motion.img
                        src="/logo-plataformas-2.png"
                        alt="Logo derecha"
                        initial={{ x: 80, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        style={{
                            width: 130,
                            height: 'auto',
                            display: 'block',
                            position: 'relative',
                            zIndex: 2,
                            filter: glow ? 'drop-shadow(0 0 6px #00e0ff88)' : 'none',
                        }}
                    />
                </Box>

                {/* Barra de carga con glow continuo */}
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
