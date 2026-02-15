import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // 👈 nuevo ícono
import { useLocation } from 'react-router-dom';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const MenuInferior = ({ cardSize }) => {
    const location = useLocation();
    const pathname = location.pathname;

    const goWithCleanCache = async (rutaDestino) => {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                }
            }
            window.location.href = rutaDestino;
        } catch (err) {
            console.warn("⚠️ Error al limpiar cache:", err);
            window.location.href = rutaDestino;
        }
    };

    const opciones = {
        "/clientes": {
            icono: <AttachMoneyIcon sx={{ fontSize: 45, color: "success.main" }} />,
            texto: "Clientes",
            rutaDestino: "/clientes"
        },
        "/dashboard": {
            icono: <BarChartIcon sx={{ fontSize: 45, color: "success.main" }} />,
            texto: "Visitas",
            rutaDestino: "/dashboard"
        },
        "/configurar-trabajos": {
            icono: <HomeRepairServiceIcon sx={{ fontSize: 45, color: "success.main" }} />,
            texto: "Trabajos",
            rutaDestino: "/configurar-trabajos"
        },
        "/configurar-en-revision": { // 👈 nueva ruta
            icono: <FactCheckIcon sx={{ fontSize: 45, color: "success.main" }} />,
            texto: "Revisión",
            rutaDestino: "/configurar-en-revision"
        },
        "/reservas": {
            icono: <EventAvailableIcon sx={{ fontSize: 45, color: "success.main" }} />,
            texto: "Reservas",
            rutaDestino: "/reservas"
        },
    };

    const rutaCentral = Object.keys(opciones).find(r => pathname.startsWith(r)) || "/dashboard";


    const orden = [
        "/clientes",
        "/dashboard",
        "/configurar-trabajos",
        "/configurar-en-revision",
        "/reservas"
    ];

    const renderBoton = (ruta) => {
        const { icono, texto } = opciones[ruta];
        const esCentral = ruta === rutaCentral;

        const baseStyles = {
            flex: esCentral ? 1.6 : 1.2, // 👈 aumentamos el ancho relativo
            minWidth: esCentral ? 80 : 70, // 👈 ancho mínimo en px
            height: esCentral ? 110 : 70,   // 👈 un poco más alto
            backgroundColor: "#ffffff",
            border: "2px solid black",
            borderRadius: esCentral ? "16px" : "12px 12px 0 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: esCentral ? 2 : 1,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            boxShadow: esCentral
                ? "0 4px 10px rgba(0,0,0,0.15)"
                : "inset 0px 0px 4px rgba(0,0,0,0.08)",
            marginBottom: esCentral ? "-10px" : 0,
            "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#f7f7f7",
                boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
            },
        };

        return (
            <Box
                key={ruta}
                onClick={() => goWithCleanCache(opciones[ruta].rutaDestino)}
                sx={baseStyles}
            >
                {esCentral ? (
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ delay: 1.4, duration: 1, ease: "easeInOut" }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                        {icono}
                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            fontSize={15}
                            color="success.main"
                        >
                            {texto}
                        </Typography>
                    </motion.div>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                        }}
                    >
                        {React.cloneElement(icono, { sx: { fontSize: 28, color: "primary.main" } })}
                        <Typography variant="caption" fontSize={12}>
                            {texto}
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    };


    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
            }}
        >
            <Box
                sx={{
                    width: cardSize,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    pt: 1,
                    gap: 0,
                    position: "relative",
                    pointerEvents: "auto",
                }}
            >
                {orden.map((ruta) => renderBoton(ruta))}
            </Box>
        </motion.div>
    );
};

export default MenuInferior;
