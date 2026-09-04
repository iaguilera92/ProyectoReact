import { Box, Container, Typography, Link, useMediaQuery, useTheme, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const SOCIAL = [
  {
    href: "https://www.instagram.com/plataformas.web/?hl=es-la",
    Icon: InstagramIcon,
    bg: "linear-gradient(45deg, #cf198c, #f41242)",
    label: "Instagram",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100063452866880",
    Icon: FacebookIcon,
    bg: "linear-gradient(45deg, #00B5F5, #002A8F)",
    label: "Facebook",
  },
  {
    href: "https://www.linkedin.com/company/mittarentacar/?viewAsMember=true",
    Icon: LinkedInIcon,
    bg: "linear-gradient(45deg, #00B5F5, #0077b7)",
    label: "LinkedIn",
  },
];

const SERVICIOS = [
  "📅 Suscripción Mensual",
  "💎 Pago Único",
  "🛒 Tienda Online",
  "⚙️ Sistemas a Medida",
];

const CONTACTO = [
  { Icon: PhoneIcon,    label: "+56 9 4687 3014",               href: "tel:+56946873014" },
  { Icon: WhatsAppIcon, label: "WhatsApp directo",              href: "https://api.whatsapp.com/send?phone=56946873014&text=Hola!%20Me%20interesa%20su%20servicio" },
  { Icon: EmailIcon,    label: "plataformas.web.cl@gmail.com",  href: "mailto:plataformas.web.cl@gmail.com" },
  { Icon: LocationOnIcon, label: "Santiago, Chile",             href: null },
];

const SocialBtn = ({ href, Icon, bg, label }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener"
    aria-label={label}
    sx={{
      width: 40, height: 40, borderRadius: "50%",
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": { transform: "translateY(-3px) scale(1.1)", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" },
    }}
  >
    <Icon sx={{ color: "white", fontSize: "1.2rem" }} />
  </Box>
);

const ContactRow = ({ Icon, label, href }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
    <Box sx={{
      width: 32, height: 32, borderRadius: "8px",
      background: "rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon sx={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem" }} />
    </Box>
    {href ? (
      <Link href={href} target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener" underline="hover"
        sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", "&:hover": { color: "white" }, lineBreak: "anywhere" }}>
        {label}
      </Link>
    ) : (
      <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)" }}>{label}</Typography>
    )}
  </Box>
);

const ColTitle = ({ children }) => (
  <Typography sx={{
    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
    fontSize: "0.82rem", color: "rgba(255,255,255,0.45)",
    letterSpacing: "1.2px", textTransform: "uppercase", mb: 2,
  }}>
    {children}
  </Typography>
);

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch("/version.json")
      .then(r => r.json())
      .then(d => setVersion(d.version))
      .catch(() => {});
  }, []);

  const handleAdmin = () => navigate("/administracion");

  return (
    <Box sx={{
      position: "relative",
      backgroundColor: "rgba(6, 10, 22, 0.97)",
      color: "white",
      overflow: "hidden",
      pt: { xs: 5, md: 6 },
      pb: 0,
      "&::before": {
        content: '""', position: "absolute", inset: 0,
        backgroundImage: "url(/fondo-footer.jpg)",
        backgroundSize: "cover", backgroundPosition: "center",
        filter: "blur(10px)", transform: "scale(1.05)",
        opacity: 0.15, zIndex: 0, pointerEvents: "none",
      },
      "&::after": {
        content: '""', position: "absolute",
        top: 0, left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent 0%, #0075FF 30%, #00C853 70%, transparent 100%)",
        zIndex: 1,
      },
    }}>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }} ref={ref}>

        {/* ── Desktop layout ── */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.3fr 1fr", gap: 5, mb: 5 }}>

              {/* Col 1 — Marca */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <img src="/logo-plataformas-web.png" alt="Logo" style={{ height: 55, width: "auto", maxWidth: 180 }} />
                <Typography sx={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 220 }}>
                  Desarrollo web profesional para empresas y emprendedores. Sitios rápidos, modernos y con soporte real.
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, mt: 0.5 }}>
                  {SOCIAL.map(s => <SocialBtn key={s.label} {...s} />)}
                </Box>
              </Box>

              {/* Col 2 — Servicios */}
              <Box>
                <ColTitle>Servicios</ColTitle>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  {SERVICIOS.map(s => (
                    <Typography key={s} sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>
                      {s}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Col 3 — Contacto */}
              <Box>
                <ColTitle>Contacto</ColTitle>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
                  {CONTACTO.map(c => <ContactRow key={c.label} {...c} />)}
                </Box>
              </Box>

              {/* Col 4 — Acceso */}
              <Box>
                <ColTitle>Acceso</ColTitle>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <img
                    src="area-clientes.png" alt="Área Clientes" width={110}
                    onClick={handleAdmin} style={{ cursor: "pointer", borderRadius: 8, opacity: 0.9 }}
                  />
                  <Box
                    onClick={handleAdmin}
                    sx={{
                      display: "inline-flex", alignItems: "center", gap: 1,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "10px", px: 1.8, py: 0.8,
                      cursor: "pointer", width: "fit-content",
                      transition: "background 0.2s",
                      "&:hover": { background: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    <AdminPanelSettingsIcon sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)" }} />
                    <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                      Administración
                    </Typography>
                  </Box>
                </Box>
              </Box>

            </Box>
          </motion.div>
        )}

        {/* ── Mobile layout ── */}
        {isMobile && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, mb: 4 }}>
            <img src="/logo-plataformas-web.png" alt="Logo" style={{ height: 75 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              {SOCIAL.map(s => <SocialBtn key={s.label} {...s} />)}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2, alignSelf: "stretch", px: 1 }}>
              {CONTACTO.map(c => <ContactRow key={c.label} {...c} />)}
            </Box>
            <Box
              onClick={handleAdmin}
              sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "10px", px: 2, py: 1, cursor: "pointer",
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)" }} />
              <Typography sx={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                Administración
              </Typography>
            </Box>
          </Box>
        )}

        {/* ── Bottom bar ── */}
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
        <Box sx={{
          display: "flex", flexDirection: { xs: "column", sm: "row" },
          alignItems: "center", justifyContent: "space-between",
          py: 2, gap: 1,
        }}>
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            © 2026 Plataformas Web
            {version && <span style={{ marginLeft: 8, opacity: 0.5 }}>v{version}</span>}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.25)" }}>
            Santiago, Chile 🇨🇱
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;
