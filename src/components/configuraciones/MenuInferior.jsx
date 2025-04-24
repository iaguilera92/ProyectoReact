import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import BarChartIcon from "@mui/icons-material/BarChart";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import { useNavigate } from 'react-router-dom';

const MenuInferior = ({ cardSize, modo = "servicios" }) => {
    const navigate = useNavigate();
    const isDashboard = modo === "dashboard";

    const IconoCentral = isDashboard ? BarChartIcon : HomeRepairServiceIcon;
    const colorCentral = isDashboard ? "success.main" : "success.main";
    const textoCentral = isDashboard ? "Visitas" : "Servicios";
    const goWithCleanCache = async (rutaDestino) => {
        try {
            // 🧹 Eliminar todas las caches
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log("✅ Caches eliminadas:", cacheNames);

            // 🧹 Eliminar Service Workers
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    await registration.unregister();
                    console.log("🧹 Service Worker eliminado");
                }
            }

            // 🔁 Redirigir limpiamente
            window.location.href = rutaDestino;
        } catch (err) {
            console.warn("⚠️ Error al limpiar cache:", err);
            window.location.href = rutaDestino;
        }
    };
    const ladoIzquierdo = (
        <Box
            sx={{
                flex: 1,
                height: 65,
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "-10%",
                zIndex: 1,
                cursor: "not-allowed",
                boxShadow: "inset -2px 0px 3px rgba(0,0,0,0.05)"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translateX(-20%)",
                    textAlign: "center",
                }}
            >
                <ViewCarouselIcon sx={{ fontSize: 26, color: "grey.500" }} />
                <Typography variant="caption" fontSize={11} color="grey.500" sx={{ mt: 0.2 }}>
                    Catálogo
                </Typography>
            </Box>
        </Box>
    );

    const botonCentral = (
        <Box
            sx={{
                flex: 1.3,
                height: 108,
                backgroundColor: "#ffffff",
                border: "2px solid black",
                borderRadius: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                marginBottom: "-10px",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#f7f7f7",
                    boxShadow: "0 6px 14px rgba(0,0,0,0.2)",
                },
            }}
        >
            <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: 1.4, duration: 1, ease: "easeInOut" }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <IconoCentral sx={{ fontSize: 45, color: colorCentral }} />
                <Typography variant="caption" fontWeight="bold" fontSize={15} color={colorCentral}>
                    {textoCentral}
                </Typography>
            </motion.div>
        </Box>
    );

    const botonDerecho = (
        <Box
            sx={{
                flex: 1,
                height: 65,
                backgroundColor: "white",
                border: "2px solid black",
                borderRadius: "12px 12px 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 2px 0px 3px rgba(0,0,0,0.05)",
                marginLeft: "-10%",
                zIndex: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                    transform: "scale(1.05)",
                    backgroundColor: "#f7f7f7",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                },
            }}
            onClick={() => goWithCleanCache(isDashboard ? "/configurar-servicios" : "/dashboard")}

        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "translateX(20%)",
                    textAlign: "center",
                }}
            >
                {isDashboard ? (
                    <HomeRepairServiceIcon sx={{ fontSize: 26, color: "primary.main" }} />
                ) : (
                    <BarChartIcon sx={{ fontSize: 26, color: "primary.main" }} />
                )}
                <Typography variant="caption" fontSize={11}>
                    {isDashboard ? "Servicios" : "Visitas"}
                </Typography>
            </Box>
        </Box>
    );

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
                {ladoIzquierdo}
                {botonCentral}
                {botonDerecho}
            </Box>
        </motion.div>
    );
};

export default MenuInferior;
