import { useState, useEffect } from "react";
import { Button, Typography, Box, LinearProgress } from "@mui/material";
import dayjs from "dayjs";

export default function ButtonHablarConEjecutivo({ trabajo }) {
    const [tiempoRestante, setTiempoRestante] = useState(0);

    useEffect(() => {
        if (!trabajo?.FechaCreacion) return;

        const fechaCreacion = dayjs(trabajo.FechaCreacion);
        const fechaHabilitado = fechaCreacion.add(24, "hour");

        const actualizarTiempo = () => {
            const now = dayjs();
            const diff = fechaHabilitado.diff(now, "second");
            setTiempoRestante(diff > 0 ? diff : 0);
        };

        actualizarTiempo();
        const interval = setInterval(actualizarTiempo, 1000);
        return () => clearInterval(interval);
    }, [trabajo]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const habilitado = tiempoRestante === 0;

    return (
        <Button
            variant="contained"
            disabled={!habilitado}
            onClick={() => {
                if (!trabajo) return;
                const negocio = trabajo.Negocio || "mi sitio web";
                const porcentaje = trabajo.Porcentaje || 0;
                const mensaje = `Hola, quiero información sobre el estado de mi sitio web (${negocio}). Actualmente figura con un ${porcentaje}% de avance.`;
                const numero = "56946873014";
                const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
                window.open(url, "_blank");
            }}
            sx={{
                minWidth: 180,
                height: 38,
                textTransform: "none",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
                color: "#fff",
                background: habilitado
                    ? "linear-gradient(90deg,#FF9800,#F57C00)"
                    : "linear-gradient(90deg,#BDBDBD,#9E9E9E)",
                boxShadow: habilitado ? "0 4px 12px rgba(255,152,0,.3)" : "none",
                "&:hover": {
                    background: habilitado ? "linear-gradient(90deg,#FFA726,#FB8C00)" : undefined,
                },
            }}
        >
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, mb: 0.3 }}>
                Contactar Analista
            </Typography>

            {!habilitado && (
                <Box sx={{ display: "flex", alignItems: "center", width: "90%", gap: 0.5 }}>
                    {/* Barra más visible */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            height: 8, // más alta
                            borderRadius: 4,
                            backgroundColor: "#BDBDBD", // fondo gris
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                width: `${((24 * 60 * 60 - tiempoRestante) / (24 * 60 * 60)) * 100}%`,
                                height: "100%",
                                background: "linear-gradient(90deg,#757575,#616161)", // relleno gris más oscuro
                                transition: "width 0.5s ease",
                            }}
                        />
                    </Box>

                    {/* Timer al lado */}
                    <Typography sx={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>
                        {formatTime(tiempoRestante)}
                    </Typography>
                </Box>
            )}
        </Button>





    );
}
