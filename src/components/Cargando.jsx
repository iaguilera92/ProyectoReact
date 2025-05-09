import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import "./css/Cargando.css";

const Cargando = () => {
    const [glow, setGlow] = useState(false);
    const [showElectricEffect, setShowElectricEffect] = useState(false);

    useEffect(() => {
        const timerGlow = setTimeout(() => {
            setGlow(true);
            setShowElectricEffect(true);

            setTimeout(() => {
                setShowElectricEffect(false);
            }, 1000);
        }, 1200);

        return () => clearTimeout(timerGlow);
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.85)',
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgb(0 7 41)',
                    zIndex: 0,
                }}
            />
            {/* Fondo separado */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(fondo-blizz.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: { xs: '25% 20%', md: 'center 20%' },
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.7) contrast(1.2)',
                    zIndex: 1,
                    opacity: 0, // Puedes animar esto si quieres aparición progresiva
                    animation: 'fadeInBg 2s ease-in forwards', // ejemplo animación
                }}
            />

            {/* Contenido */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transform: 'translateY(-40%)',
                    zIndex: 1, // 👈 Este es el contenido sobre el fondo
                }}
            >
                {/* Imágenes + Efecto eléctrico */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0,
                        marginLeft: '-1px', // o prueba con -2 si es necesario
                        marginBottom: '20px',
                        position: 'relative',
                        lineHeight: 0,
                    }}
                >
                    {/* ⚡ Rayo eléctrico */}
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
                                boxShadow: `0 0 12px #00fff0, 0 0 24px #00ccff, 0 0 36px #007de0`,
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
                            verticalAlign: 'top',
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
                            verticalAlign: 'top',
                        }}
                    />
                </Box>

                {/* Barra de carga */}
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
