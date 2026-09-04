import { Box, Typography, Grid, Container, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut", delay: i * 0.12 } }),
};

const stats = [
  { value: "+100", label: "Proyectos entregados" },
  { value: "9+", label: "Años de experiencia" },
  { value: "24/7", label: "Soporte disponible" },
  { value: "100%", label: "Clientes satisfechos" },
];

const valores = [
  { icon: "🚀", title: "Innovación", desc: "Adoptamos las últimas tecnologías para entregar soluciones modernas y escalables." },
  { icon: "🤝", title: "Compromiso", desc: "Nos involucramos en cada proyecto como si fuera nuestro propio negocio." },
  { icon: "🎯", title: "Precisión", desc: "Cada detalle importa. Entregamos lo que prometemos, en el plazo acordado." },
  { icon: "🔒", title: "Confianza", desc: "Transparencia total desde el primer día. Sin costos ocultos ni sorpresas." },
];

function StatCard({ value, label, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  return (
    <motion.div ref={ref} custom={index} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <Box sx={{
        textAlign: "center", p: 3,
        background: "linear-gradient(135deg, rgba(0,100,200,0.12) 0%, rgba(0,40,100,0.08) 100%)",
        border: "1px solid rgba(0,180,255,0.2)", borderRadius: "16px",
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        "&:hover": { border: "1px solid rgba(0,220,255,0.4)", transform: "translateY(-4px)", boxShadow: "0 12px 32px rgba(0,0,0,0.3)" },
      }}>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: { xs: "2rem", md: "2.4rem" }, background: "linear-gradient(135deg, #fff 30%, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {value}
        </Typography>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 600, letterSpacing: "0.5px", mt: 0.5 }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
}

function ValorCard({ item, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div ref={ref} custom={index} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
      <Box sx={{
        p: 2.5, height: "100%",
        background: "linear-gradient(135deg, rgba(0,80,160,0.1) 0%, rgba(0,30,80,0.08) 100%)",
        border: "1px solid rgba(0,180,255,0.15)", borderRadius: "14px",
        backdropFilter: "blur(6px)",
        transition: "all 0.3s ease",
        "&:hover": { border: "1px solid rgba(0,220,255,0.35)", transform: "translateY(-3px)" },
      }}>
        <Typography sx={{ fontSize: "2rem", mb: 1 }}>{item.icon}</Typography>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#38bdf8", mb: 0.8 }}>
          {item.title}
        </Typography>
        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>
          {item.desc}
        </Typography>
      </Box>
    </motion.div>
  );
}

const Nosotros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: misionRef, inView: misionInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  return (
    <Box sx={{
      minHeight: "100vh", width: "100%",
      background: "linear-gradient(160deg, #020b18 0%, #040f22 40%, #061428 100%)",
      backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(160deg, #020b18 0%, #040f22 40%, #061428 100%)",
      backgroundSize: "50px 50px, 50px 50px, 100% 100%",
      pt: { xs: 12, md: 14 }, pb: 8,
    }}>
      <Container maxWidth="lg">

        {/* ── Hero ── */}
        <Box ref={heroRef} sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
          <motion.div variants={fadeUp} initial="hidden" animate={heroInView ? "visible" : "hidden"}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1.5 }}>
              <Box sx={{ flex: 1, maxWidth: 80, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5))" }} />
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Poppins, sans-serif", background: "linear-gradient(90deg, #38bdf8, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Conócenos
              </Typography>
              <Box sx={{ flex: 1, maxWidth: 80, height: "1px", background: "linear-gradient(90deg, rgba(0,212,255,0.5), transparent)" }} />
            </Box>
            <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, color: "#fff", lineHeight: 1.15, mb: 1.5 }}>
              Somos <span style={{ background: "linear-gradient(135deg,#38bdf8,#00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plataformas Web</span>
            </Typography>
            <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: { xs: "0.9rem", md: "1.05rem" }, color: "rgba(255,255,255,0.55)", maxWidth: 560, mx: "auto", lineHeight: 1.7 }}>
              Más de 9 años creando soluciones digitales a medida para empresas de distintas industrias.
            </Typography>
          </motion.div>
        </Box>

        {/* ── Stats ── */}
        <Grid container spacing={2.5} sx={{ mb: { xs: 7, md: 9 } }}>
          {stats.map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <StatCard value={s.value} label={s.label} index={i} />
            </Grid>
          ))}
        </Grid>

        {/* ── Quiénes somos ── */}
        <Grid container spacing={6} alignItems="center" sx={{ mb: { xs: 7, md: 9 } }}>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Box sx={{ width: 3, height: 36, borderRadius: 2, background: "linear-gradient(180deg, #38bdf8, #00e5ff)" }} />
                <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, color: "#fff" }}>
                  ¿Quiénes Somos?
                </Typography>
              </Box>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.92rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, mb: 2 }}>
                Somos una empresa de soluciones tecnológicas con más de 9 años de experiencia desarrollando proyectos a medida para empresas de distintas industrias.
              </Typography>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.92rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, mb: 2 }}>
                Nos especializamos en la creación de páginas web, aplicaciones móviles y sistemas personalizados que se adaptan a las necesidades de cada cliente, sin importar el rubro.
              </Typography>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.92rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
                Brindamos soporte evolutivo, mejoras continuas y acompañamiento estratégico para que cada negocio aproveche al máximo su potencial digital.
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }} viewport={{ once: true }}>
              <Box sx={{ p: 4, background: "linear-gradient(135deg, rgba(0,100,200,0.15), rgba(0,40,100,0.1))", border: "1px solid rgba(0,180,255,0.2)", borderRadius: "24px", backdropFilter: "blur(12px)", textAlign: "center" }}>
                <img src="/logo-plataformas-web.png" alt="Logo Plataformas Web" style={{ maxWidth: isMobile ? "70%" : "80%", height: "auto" }} />
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* ── Quote banner ── */}
        <Box sx={{ mb: { xs: 7, md: 9 }, p: { xs: 4, md: 6 }, borderRadius: "24px", background: "linear-gradient(135deg, rgba(0,100,255,0.18) 0%, rgba(0,60,160,0.12) 100%)", border: "1px solid rgba(0,180,255,0.25)", backdropFilter: "blur(10px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,180,255,0.12), transparent 70%)", pointerEvents: "none" }} />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: { xs: "1.4rem", md: "2rem" }, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
              Ayudamos a hacer{" "}
              <span style={{ background: "linear-gradient(135deg, #facc15, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                crecer
              </span>{" "}
              tu negocio
            </Typography>
            <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.5)", mt: 1.5 }}>
              Con tecnología moderna, entrega rápida y soporte real.
            </Typography>
          </motion.div>
        </Box>

        {/* ── Misión & Visión ── */}
        <Box ref={misionRef} sx={{ mb: { xs: 7, md: 9 } }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div variants={fadeUp} initial="hidden" animate={misionInView ? "visible" : "hidden"}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
                <Box sx={{ flex: 1, maxWidth: 60, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5))" }} />
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Poppins, sans-serif", background: "linear-gradient(90deg, #38bdf8, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Propósito
                </Typography>
                <Box sx={{ flex: 1, maxWidth: 60, height: "1px", background: "linear-gradient(90deg, rgba(0,212,255,0.5), transparent)" }} />
              </Box>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, color: "#fff" }}>
                Misión & Visión
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                icon: "🎯", label: "Misión", color: "#38bdf8",
                text: "Brindar soluciones tecnológicas innovadoras que impulsen el crecimiento y la eficiencia de nuestros clientes, mediante el desarrollo de software, sistemas personalizados y soporte evolutivo de alto nivel.",
              },
              {
                icon: "🌟", label: "Visión", color: "#a78bfa",
                text: "Ser una empresa referente en el desarrollo e implementación de soluciones informáticas a nivel nacional, reconocida por su capacidad de adaptarse a distintos rubros y por entregar resultados concretos.",
              },
            ].map((item, i) => (
              <Grid item xs={12} md={6} key={i}>
                <motion.div custom={i} variants={fadeUp} initial="hidden" animate={misionInView ? "visible" : "hidden"}>
                  <Box sx={{ p: 3.5, height: "100%", background: "linear-gradient(135deg, rgba(0,80,160,0.12), rgba(0,30,80,0.08))", border: `1px solid ${item.color}30`, borderRadius: "18px", backdropFilter: "blur(8px)" }}>
                    <Typography sx={{ fontSize: "2.2rem", mb: 1.5 }}>{item.icon}</Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.1rem", color: item.color, mb: 1.2 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.62)", lineHeight: 1.8 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ── Valores ── */}
        <Box>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
                <Box sx={{ flex: 1, maxWidth: 60, height: "1px", background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.5))" }} />
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", fontFamily: "Poppins, sans-serif", background: "linear-gradient(90deg, #38bdf8, #00e5ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Lo que nos define
                </Typography>
                <Box sx={{ flex: 1, maxWidth: 60, height: "1px", background: "linear-gradient(90deg, rgba(0,212,255,0.5), transparent)" }} />
              </Box>
              <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, color: "#fff" }}>
                Nuestros Valores
              </Typography>
            </motion.div>
          </Box>
          <Grid container spacing={2.5}>
            {valores.map((v, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <ValorCard item={v} index={i} />
              </Grid>
            ))}
          </Grid>
        </Box>

      </Container>
    </Box>
  );
};

export default Nosotros;
