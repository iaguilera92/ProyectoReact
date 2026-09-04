import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, useTheme, useMediaQuery, Dialog, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

const evidencias = [
    { url: "https://www.ivelpink.cl",                   label: "ivelpink.cl",               video: "/evidencia1.mp4", logo: "/logos/logo-ivelpink.jpg" },
    { url: "https://www.ingsnt.cl",                     label: "ingsnt.cl",                 video: "/evidencia2.mp4", logo: "/logos/logo-ingsnt.png" },
    { url: "https://www.masatracker.cl",                label: "masatracker.cl",            video: "/evidencia3.mp4", logo: "/logos/logo-mastracker.png" },
    { url: "https://www.investigadores-privados.cl",    label: "investigadores-privados.cl",video: "/evidencia4.mp4", logo: "/logos/logo-investigadores-privados.png" },
    { url: "https://www.masautomatizacion.cl",          label: "masautomatizacion.cl",      video: "/evidencia5.mp4", logo: "/logos/logo-masautomatizacion.png" },
    { url: "https://www.sifg.cl",                       label: "sifg.cl",                   video: "/evidencia6.mp4", logo: "/logos/logo-sifg.png" },
    { url: null,                                        label: "autoges-web.cl",            video: "/evidencia7.mp4", logo: "/logos/logo-autoges.png" },
];

const Evidencias = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const videosRef = useRef([]);
    const videoRef = useRef(null);
    const sectionRef = useRef();
    const [visible, setVisible] = useState(false);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [selectedEvidenceIndex, setSelectedEvidenceIndex] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
    const { ref: imagenRef, inView: imagenInView } = useInView({ threshold: 0.3, triggerOnce: true });
    const { ref: muchosMasRef, inView: muchosMasInView } = useInView({ threshold: 0.2, triggerOnce: true });

    // Desktop: dos filas 4+3
    const desktopRows = [[0, 1, 2, 3], [4, 5, 6]];

    // Cycling — desktop
    useEffect(() => {
        if (isMobile || !inView || selectedEvidenceIndex !== null) return;
        const interval = setInterval(() => {
            setActiveVideoIndex(prev => (prev + 1) % evidencias.length);
        }, 2200);
        return () => clearInterval(interval);
    }, [isMobile, inView, selectedEvidenceIndex]);

    // Intersection observer for section
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Phone video autoplay
    useEffect(() => {
        if (imagenInView && videoRef.current) videoRef.current.play().catch(() => {});
    }, [imagenInView]);

    // Play/pause videos
    useEffect(() => {
        videosRef.current.forEach((video, index) => {
            if (!video) return;
            const shouldPlay = isMobile
                ? inView && selectedEvidenceIndex === null
                : inView && selectedEvidenceIndex === null && index === activeVideoIndex;
            shouldPlay ? video.play().catch(() => {}) : video.pause();
        });
    }, [activeVideoIndex, inView, selectedEvidenceIndex, isMobile]);

    const isActive = (n) => !isMobile && n === activeVideoIndex;

    return (
        <Box sx={{ width: '100%', position: 'relative', mt: '-80px' }}>

            {/* ── Sección 1: Marquee ── */}
            <Box sx={{
                position: 'relative',
                height: { xs: '80px', sm: '90px', md: '100px' },
                backgroundImage: `url('fondo-telefono.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
            }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }} />

                {/* Marquee */}
                <Box sx={{ width: '100%', overflow: 'hidden', zIndex: 5 }}>
                    <motion.div initial={{ x: '100vw' }} animate={{ x: '-100%' }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' }, fontWeight: 600, color: 'white', fontFamily: `'Montserrat', sans-serif`, px: 4 }}>
                            Control total sobre tu{' '}<span style={{ color: '#ffe037' }}>negocio.</span>
                        </Typography>
                    </motion.div>
                </Box>
            </Box>

            {/* ── Sección 2: Grid de trabajos ── */}
            <Box sx={{
                position: 'relative',
                backgroundImage: `url('/fondo-blizz-2.webp')`,
                backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                pb: 6, px: { xs: 2, sm: 4 }, zIndex: 2,
                borderTop: '1px solid #e0e0e0',
            }}>
                {/* Clip decorativo */}
                <Box sx={{
                    position: 'absolute', top: isMobile ? '-9vh' : '-99px', left: 0, width: '100%', height: 100, zIndex: 1,
                    clipPath: isMobile ? "polygon(0 0, 50% 40%, 100% 0, 100% 100%, 0 100%)" : "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)",
                    backgroundImage: `url('/fondo-blizz-2.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', pointerEvents: 'none',
                }} />

                <motion.div ref={sectionRef} initial={{ opacity: 0, y: 50 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }} style={{ position: 'relative', zIndex: 6 }}>
                    <Box sx={{
                        background: "linear-gradient(160deg, rgba(6,12,28,0.97) 0%, rgba(10,20,45,0.97) 100%)",
                        borderRadius: { xs: 3, md: 4 },
                        p: { xs: 2.5, sm: 4, md: 5 },
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                        maxWidth: "1280px",
                        mx: "auto",
                        border: "1px solid rgba(255,255,255,0.06)",
                    }}>

                        {/* Título */}
                        <Box ref={ref} sx={{ mb: { xs: 3, md: 4 } }}>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                                <Box sx={{
                                    display: "inline-flex", alignItems: "center", gap: 1,
                                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: "100px", px: 2.5, py: 0.6, backdropFilter: "blur(10px)",
                                }}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676", flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                                        Proyectos entregados
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography sx={{
                                fontFamily: "'Poppins', sans-serif", fontWeight: 800, textAlign: "center",
                                fontSize: { xs: "1.6rem", md: "2rem" }, color: "white", letterSpacing: "0px",
                            }}>
                                Trabajos Recientes
                            </Typography>
                            <Typography sx={{ textAlign: "center", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", mt: 0.5 }}>
                                Cada sitio, una historia de confianza
                            </Typography>
                        </Box>

                        {/* Grid desktop */}
                        {!isMobile && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                                {desktopRows.map((row, rowIdx) => (
                                    <Grid container spacing={2.5} justifyContent="center" key={rowIdx}>
                                        {row.map((n) => (
                                            <Grid item xs={12} sm={6} md={row.length === 4 ? 3 : 4} key={n}>
                                                <VideoCard
                                                    ev={evidencias[n]}
                                                    n={n}
                                                    active={isActive(n)}
                                                    hovered={hoveredIndex === n}
                                                    onHover={() => setHoveredIndex(n)}
                                                    onLeave={() => setHoveredIndex(null)}
                                                    onClick={() => { setActiveVideoIndex(n); setSelectedEvidenceIndex(n); }}
                                                    videosRef={videosRef}
                                                    inView={inView}
                                                    rowIdx={rowIdx}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ))}
                            </Box>
                        )}

                        {/* Grid mobile */}
                        {isMobile && (
                            <Grid container spacing={2} justifyContent="center">
                                {evidencias.map((_, n) => (
                                    <Grid item xs={6} key={n}>
                                        <VideoCard
                                            ev={evidencias[n]}
                                            n={n}
                                            active={false}
                                            hovered={false}
                                            onHover={() => {}}
                                            onLeave={() => {}}
                                            onClick={() => setSelectedEvidenceIndex(n)}
                                            videosRef={videosRef}
                                            inView={inView}
                                            rowIdx={n}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        )}

                        {/* y muchos más */}
                        <Box ref={muchosMasRef} sx={{ mt: 3, textAlign: "center" }}>
                            {"y muchos más...".split("").map((char, i) => (
                                <motion.span key={i} initial={{ opacity: 0, y: 20 }}
                                    animate={muchosMasInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    style={{ display: "inline-block", whiteSpace: "pre", fontStyle: "italic", color: "rgba(255,255,255,0.7)", fontWeight: 700, fontFamily: "Poppins, sans-serif", fontSize: "1.1rem", letterSpacing: 1 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </Box>
                    </Box>
                </motion.div>
            </Box>

            {/* Dialog fullscreen */}
            <Dialog
                open={selectedEvidenceIndex !== null}
                onClose={() => setSelectedEvidenceIndex(null)}
                maxWidth={false}
                BackdropProps={{ sx: { backgroundColor: "rgba(0,0,0,0.92)", backdropFilter: "blur(6px)" } }}
                PaperProps={{ sx: { width: { xs: "88vw", sm: "360px", md: "390px" }, maxWidth: "88vw", background: "transparent", borderRadius: "24px", boxShadow: "none", overflow: "visible", transform: "translateY(-16px)" } }}
            >
                {selectedEvidenceIndex !== null && (
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 1, p: { xs: 0.5, sm: 0.7 }, boxSizing: "border-box" }}>
                        <Box sx={{ width: "100%", borderRadius: "20px", overflow: "hidden", backgroundColor: "rgba(7,16,27,0.96)", border: "2px solid rgba(255,255,255,0.9)", position: "relative", boxShadow: "0 24px 60px rgba(0,0,0,0.45)" }}>
                            <IconButton aria-label="Cerrar" onClick={() => setSelectedEvidenceIndex(null)}
                                sx={{ position: "absolute", top: 12, right: 12, zIndex: 2, color: "#fff", backgroundColor: "rgba(0,0,0,0.5)", "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" } }}>
                                <CloseRoundedIcon />
                            </IconButton>
                            <Box component="video" src={evidencias[selectedEvidenceIndex].video} autoPlay muted loop playsInline preload="auto" controls={false}
                                sx={{ width: "100%", maxHeight: { xs: "68vh", sm: "74vh" }, display: "block", backgroundColor: "#000", objectFit: "contain" }} />
                        </Box>
                        <motion.div key={evidencias[selectedEvidenceIndex].label} initial={{ y: 24 }} animate={{ y: 0 }} transition={{ duration: 0.28, ease: "easeOut", delay: 0.06 }} style={{ width: "100%" }}>
                            <Box sx={{ width: "100%", borderRadius: "18px", border: "2px solid rgba(129,212,250,0.9)", background: "linear-gradient(180deg, rgba(24,168,255,0.99), rgba(0,108,204,1))", boxShadow: "0 18px 38px rgba(0,123,255,0.24)", px: 1.2, py: 1.25, boxSizing: "border-box" }}>
                                <Typography sx={{ textAlign: "center", color: "#fff", fontSize: { xs: "0.92rem", sm: "1rem" }, fontWeight: 900 }}>
                                    {evidencias[selectedEvidenceIndex].label}
                                </Typography>
                            </Box>
                        </motion.div>
                    </Box>
                )}
            </Dialog>
        </Box>
    );
};

const VideoCard = ({ ev, n, active, hovered, onHover, onLeave, onClick, videosRef, inView, rowIdx }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: n * 0.07 }}
        style={{ height: "100%" }}
    >
        <Box
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            sx={{
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                border: active
                    ? "2px solid rgba(0,220,255,0.7)"
                    : "2px solid rgba(255,255,255,0.07)",
                boxShadow: active
                    ? "0 0 24px rgba(0,200,255,0.3), 0 8px 30px rgba(0,0,0,0.5)"
                    : "0 6px 24px rgba(0,0,0,0.4)",
                transition: "all 0.35s ease",
                transform: active ? "scale(1.02)" : "scale(1)",
                cursor: "pointer",
                background: "#000",
                "&:hover": {
                    border: "2px solid rgba(0,220,255,0.5)",
                    boxShadow: "0 0 20px rgba(0,200,255,0.2), 0 10px 30px rgba(0,0,0,0.5)",
                },
            }}
        >
            {/* Video */}
            <Box sx={{ position: "relative", width: "100%", height: 220 }} onClick={onClick}>
                <CardMedia
                    component="video"
                    ref={(el) => (videosRef.current[n] = el)}
                    src={ev.video}
                    playsInline muted loop preload="metadata" controls={false}
                    disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />

                {/* Overlay hover */}
                <Box sx={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                    opacity: hovered || active ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)",
                        border: "1.5px solid rgba(255,255,255,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: hovered ? 1 : 0, transform: hovered ? "scale(1)" : "scale(0.7)",
                        transition: "all 0.25s ease",
                    }}>
                        <PlayArrowRoundedIcon sx={{ color: "white", fontSize: "1.8rem" }} />
                    </Box>
                </Box>

                {/* Logo */}
                {ev.logo && (
                    <Box sx={{ position: "absolute", bottom: 8, left: 10, zIndex: 2 }}>
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}} transition={{ duration: 0.5, ease: "easeOut", delay: 0.8 + n * 0.06 }}>
                            <Box sx={{
                                width: 44, height: 44, borderRadius: "50%",
                                background: "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 3px 10px rgba(0,0,0,0.5)", p: "3px",
                            }}>
                                <Box component="img" src={ev.logo} alt={ev.label}
                                    sx={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#fff", objectFit: "contain" }} />
                            </Box>
                        </motion.div>
                    </Box>
                )}

                {/* Badge activo */}
                {active && (
                    <Box sx={{
                        position: "absolute", top: 8, right: 8,
                        background: "rgba(0,200,255,0.15)", backdropFilter: "blur(6px)",
                        border: "1px solid rgba(0,220,255,0.5)",
                        borderRadius: "100px", px: 1.2, py: 0.3,
                        display: "flex", alignItems: "center", gap: 0.5,
                    }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
                        <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.5px" }}>
                            EN VIVO
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Footer con URL */}
            <Box sx={{
                px: 1.5, py: 1,
                background: "rgba(6,15,30,0.95)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
                {ev.url ? (
                    <Typography component="a" href={ev.url} target="_blank" rel="noopener noreferrer"
                        sx={{
                            fontSize: "0.72rem", color: "#38bdf8", fontFamily: "Poppins, sans-serif",
                            fontWeight: 600, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                            "&:hover": { color: "#7dd3fc" },
                        }}>
                        {ev.label}
                    </Typography>
                ) : (
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                        {ev.label}
                    </Typography>
                )}
                {ev.url && (
                    <OpenInNewRoundedIcon sx={{ fontSize: "0.85rem", color: "rgba(56,189,248,0.6)", flexShrink: 0 }} />
                )}
            </Box>
        </Box>
    </motion.div>
);

export default Evidencias;
