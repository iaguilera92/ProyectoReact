import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, CardMedia, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";

const evidencias = [
  { url: "https://www.auracristal.cl",            label: "auracristal.cl",           video: "/video-aura-cristal.mp4", logo: null, playbackRate: 3 },
  { url: "https://www.targonex.cl",                label: "targonex.cl",               video: "/video-targonex.mp4",     logo: null, playbackRate: 3 },
  { url: "https://www.ivelpink.cl",                label: "ivelpink.cl",               video: "/video-ivelpink.mp4", logo: "/logos/logo-ivelpink.jpg" },
  { url: "https://www.ingsnt.cl",                  label: "ingsnt.cl",                 video: "/evidencia2.mp4", logo: "/logos/logo-ingsnt.png", objectFit: "contain" },
  { url: "https://www.mastracker.cl",              label: "mastracker.cl",             video: "/evidencia3.mp4", logo: "/logos/logo-mastracker.png", objectFit: "contain" },
  { url: "https://www.investigadores-privados.cl", label: "investigadores-privados.cl",video: "/evidencia4.mp4", logo: "/logos/logo-investigadores-privados.png", objectFit: "contain" },
  { url: "https://www.masautomatizacion.cl",       label: "masautomatizacion.cl",      video: "/evidencia5.mp4", logo: "/logos/logo-masautomatizacion.png", objectFit: "contain" },
  { url: "https://www.sifg.cl",                    label: "sifg.cl",                   video: "/evidencia6.mp4", logo: "/logos/logo-sifg.png", objectFit: "contain" },
  { url: null,                                     label: "autoges-web.cl",            video: "/evidencia7.mp4", logo: "/logos/logo-autoges.png" },
];

const SeccionDestacada = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const thumbRefs = useRef([]);
  const mainVideoRef = useRef(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);

  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.05 });

  // Auto-cycle
  useEffect(() => {
    if (!sectionInView || paused) return;
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % evidencias.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sectionInView, paused]);

  // Pause thumbs, play active, apply playbackRate
  useEffect(() => {
    thumbRefs.current.forEach((v, i) => {
      if (!v) return;
      v.playbackRate = evidencias[i].playbackRate || 1;
      i === active ? v.play().catch(() => {}) : v.pause();
    });
  }, [active, sectionInView]);

  // Apply playbackRate to main video on mount/change
  useEffect(() => {
    const v = mainVideoRef.current;
    if (!v) return;
    v.playbackRate = evidencias[active].playbackRate || 1;
  }, [active]);

  const handleSelect = (i) => {
    setActive(i);
    setPaused(true);
    setTimeout(() => setPaused(false), 8000);
  };

  return (
    <Box ref={sectionRef} sx={{
      width: "100%",
      background: "linear-gradient(160deg, rgba(6,12,28,0.98) 0%, rgba(10,20,45,0.98) 100%)",
      py: { xs: 6, md: 8 },
      px: { xs: 2, md: 6 },
      boxSizing: "border-box",
    }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>

        {/* Título */}
        <Box ref={ref} sx={{ mb: 5, textAlign: "center" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
              <Box sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "100px", px: 2.5, py: 0.6, backdropFilter: "blur(10px)",
              }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676" }} />
                <Typography sx={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase" }}>
                  Proyectos entregados
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, color: "white" }}>
              Trabajos Recientes
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", mt: 0.5 }}>
              Cada sitio, una historia de confianza
            </Typography>
          </motion.div>
        </Box>

        {/* Layout principal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>

            {/* Video destacado (izquierda) */}
            <Box sx={{ flex: "0 0 62%", position: "relative" }}>
              <Box sx={{
                borderRadius: "20px", overflow: "hidden",
                border: "2px solid rgba(0,220,255,0.5)",
                boxShadow: "0 0 40px rgba(0,200,255,0.2), 0 20px 60px rgba(0,0,0,0.6)",
                background: "#000",
                position: "relative",
              }}>
                {/* Badge EN VIVO */}
                <Box sx={{
                  position: "absolute", top: 14, left: 14, zIndex: 3,
                  display: "flex", alignItems: "center", gap: 0.6,
                  background: "rgba(0,200,255,0.12)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(0,220,255,0.4)",
                  borderRadius: "100px", px: 1.4, py: 0.4,
                }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 6px #00e676" }} />
                  <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.5px" }}>
                    EN VIVO
                  </Typography>
                </Box>

                <motion.video
                  key={active}
                  ref={mainVideoRef}
                  src={evidencias[active].video}
                  autoPlay playsInline muted loop
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  onLoadedMetadata={() => { if (mainVideoRef.current) mainVideoRef.current.playbackRate = evidencias[active].playbackRate || 1; }}
                  style={{ width: "100%", height: "420px", objectFit: evidencias[active].objectFit || "cover", display: "block", backgroundColor: "#000" }}
                />

                {/* Info overlay bottom */}
                <Box sx={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
                  px: 2.5, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {evidencias[active].logo && (
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                        p: "3px", flexShrink: 0,
                      }}>
                        <Box component="img" src={evidencias[active].logo} alt={evidencias[active].label}
                          sx={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#fff", objectFit: "contain" }} />
                      </Box>
                    )}
                    {evidencias[active].url ? (
                      <Typography component="a" href={evidencias[active].url} target="_blank" rel="noopener noreferrer"
                        sx={{ color: "#38bdf8", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", "&:hover": { color: "#7dd3fc" } }}>
                        {evidencias[active].label}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "rgba(255,255,255,0.6)", fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}>
                        {evidencias[active].label}
                      </Typography>
                    )}
                  </Box>
                  {evidencias[active].url && (
                    <Box component="a" href={evidencias[active].url} target="_blank" rel="noopener noreferrer"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5, background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "8px", px: 1.2, py: 0.5, textDecoration: "none", transition: "background 0.2s", "&:hover": { background: "rgba(56,189,248,0.25)" } }}>
                      <Typography sx={{ fontSize: "0.72rem", color: "#38bdf8", fontWeight: 600 }}>Ver sitio</Typography>
                      <OpenInNewRoundedIcon sx={{ fontSize: "0.8rem", color: "#38bdf8" }} />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Indicadores de progreso */}
              <Box sx={{ display: "flex", gap: 0.8, mt: 1.5, justifyContent: "center" }}>
                {evidencias.map((_, i) => (
                  <Box key={i} onClick={() => handleSelect(i)} sx={{
                    height: 3, borderRadius: "2px", cursor: "pointer",
                    width: i === active ? 24 : 8,
                    background: i === active ? "#38bdf8" : "rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </Box>
            </Box>

            {/* Lista de thumbnails (derecha) */}
            <Box sx={{
              flex: 1, position: "relative",
              maxHeight: 450,
              "&::after": {
                content: '""', position: "absolute", bottom: 0, left: 0, right: 8,
                height: 60, pointerEvents: "none", zIndex: 1,
                background: "linear-gradient(to bottom, transparent, rgba(6,12,28,0.95))",
                borderRadius: "0 0 12px 12px",
              },
            }}>
            <Box sx={{
              display: "flex", flexDirection: "column", gap: 1.5,
              maxHeight: 450, overflowY: "auto", pr: 1,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(56,189,248,0.3) rgba(255,255,255,0.04)",
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { background: "rgba(255,255,255,0.04)", borderRadius: 4 },
              "&::-webkit-scrollbar-thumb": { background: "rgba(56,189,248,0.35)", borderRadius: 4, "&:hover": { background: "rgba(56,189,248,0.6)" } },
            }}>
              {evidencias.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                >
                  <Box
                    onClick={() => handleSelect(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5,
                      borderRadius: "12px", p: 1, cursor: "pointer",
                      border: i === active ? "1.5px solid rgba(0,220,255,0.6)" : "1.5px solid rgba(255,255,255,0.06)",
                      background: i === active ? "rgba(0,200,255,0.08)" : "rgba(255,255,255,0.02)",
                      boxShadow: i === active ? "0 0 16px rgba(0,200,255,0.15)" : "none",
                      transition: "all 0.25s ease",
                      "&:hover": { background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.15)" },
                    }}
                  >
                    {/* Thumbnail video */}
                    <Box sx={{ position: "relative", width: 80, height: 56, borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: "#000" }}>
                      <CardMedia
                        component="video"
                        ref={(el) => (thumbRefs.current[i] = el)}
                        src={ev.video}
                        playsInline muted loop preload="metadata"
                        controls={false}
                        sx={{ width: "100%", height: "100%", objectFit: ev.objectFit || "cover", display: "block" }}
                      />
                      {i !== active && (
                        <Box sx={{
                          position: "absolute", inset: 0,
                          background: "rgba(0,0,0,0.45)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: hovered === i ? 1 : 0.7, transition: "opacity 0.2s",
                        }}>
                          <PlayArrowRoundedIcon sx={{ color: "white", fontSize: "1.4rem" }} />
                        </Box>
                      )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.3 }}>
                        {ev.logo && (
                          <Box component="img" src={ev.logo} alt={ev.label}
                            sx={{ width: 20, height: 20, borderRadius: "50%", objectFit: "contain", background: "white", flexShrink: 0 }} />
                        )}
                        <Typography sx={{
                          fontSize: "0.78rem", fontFamily: "Poppins, sans-serif", fontWeight: 700,
                          color: i === active ? "#38bdf8" : "rgba(255,255,255,0.85)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {ev.label}
                        </Typography>
                      </Box>
                      {i === active && (
                        <Typography sx={{ fontSize: "0.65rem", color: "rgba(0,220,255,0.7)", fontWeight: 600 }}>
                          ▶ Reproduciendo
                        </Typography>
                      )}
                    </Box>

                    {/* Número */}
                    <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", fontWeight: 700, flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </Typography>
                  </Box>
                </motion.div>
              ))}

              {/* y muchos más */}
              <Box sx={{ textAlign: "center", mt: 1, mb: 1 }}>
                <Typography sx={{ fontStyle: "italic", color: "white", fontWeight: 700, fontFamily: "Poppins, sans-serif", fontSize: "0.85rem", letterSpacing: 1 }}>
                  y muchos más...
                </Typography>
              </Box>
            </Box>
            </Box>

          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

export default SeccionDestacada;
