import { Box, Container, Typography, Link, keyframes, useMediaQuery, Snackbar, Alert, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useInView } from "react-intersection-observer";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Ícono de administración
import { useNavigate } from "react-router-dom";

// Animaciones de aparición y transformación
const growElement = keyframes`0% { transform: scale(0.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; }`;
const shrinkCircle = keyframes`0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0); opacity: 0; }`; // Círculo desapareciendo
const expandIcon = keyframes`0% { transform: scale(1); } 100% { transform: scale(1.5); }`; // Icono creciendo

// Botón social con animaciones
const SocialButton = ({ href, Icon, bgColor, hoverStyles, isMobile }) => (
  <Box component="a" href={href} target="_blank" rel="noopener" sx={{
    width: isMobile ? 60 : 40,
    height: isMobile ? 60 : 40,
    borderRadius: "50%", position: "relative", display: "flex",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
    "&:hover .circle": { animation: `${shrinkCircle} 900ms forwards` },
    "&:hover .icon": { animation: `${expandIcon} 150ms 150ms ease-in forwards`, ...hoverStyles }
  }}>
    {/* Círculo de fondo */}
    <Box className="circle" sx={{
      position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
      background: bgColor, transition: "transform 300ms ease-out"
    }} />
    {/* Icono con color inicial en blanco */}
    <Icon className="icon" sx={{
      color: "white", fontSize: isMobile ? 35 : 24, position: "absolute",
      transition: "color 300ms ease-in, transform 300ms ease-in"
    }} />
  </Box>
);


const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAlert, setOpenAlert] = useState(false);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setOpenAlert(true);
    navigate("/administracion"); // Redirige a /administracion
  };
  // Animaciones al hacer scroll
  const { ref: logoRef, inView: logoInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: socialRef, inView: socialInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [version, setVersion] = useState("");

  useEffect(() => {
    fetch("/version.json")
      .then((res) => res.json())
      .then((data) => {
        setVersion(data.version);
      })
      .catch((err) => {
        console.error("No se pudo cargar la versión:", err);
      });
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "rgba(23, 24, 25, 0.9)", // capa oscura encima del fondo
        color: "white",
        overflow: "hidden",
        padding: "20px 0",
        "@media (max-width: 600px)": {
          padding: "10px 0",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/fondo-footer.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center -150px",
          filter: "blur(8px)",
          transform: "scale(1.05)",
          zIndex: 0,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* 🔹 Diseño para Escritorio con 3 Columnas */}
        {!isMobile && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // 🔹 3 columnas iguales
              gap: 4, // 🔹 Espacio entre columnas
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* 🔹 Columna 1: Contacto */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ color: "var(--darkreader-text-00b4ff, #1abcff)" }}>
                Contacto
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img src="telefono-icon.png" alt="Teléfono" width={16} />
                <Link href="tel:+56946873014" color="inherit">+56 9 4687 3014</Link>
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img src="mail-icon.png" alt="Correo" width={16} />
                <Link href="mailto:plataformas.web.cl@gmail.com" color="inherit">plataformas.web.cl@gmail.com</Link>
              </Typography>

              <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <img src="location-icon.png" alt="Ubicación" width={16} />
                Juan Martinez de Rozas #3800, Santiago.
              </Typography>
            </Box>

            {/* 🔹 Columna 2: Logo + Redes Sociales */}
            <Box
              ref={logoRef}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                animation: logoInView ? `${growElement} 1s forwards` : "none",
              }}
            >
              <img src="/logo-plataformas-web.png" alt="Logo" style={{ height: "95px", marginBottom: "10px" }} />
              <Box
                ref={socialRef}
                sx={{
                  display: "flex",
                  gap: 4,
                  mt: 0,
                  animation: socialInView ? `${growElement} 1s forwards` : "none",
                }}
              >
                <SocialButton
                  href="https://www.instagram.com/plataformas.web/?hl=es-la"
                  Icon={InstagramIcon}
                  bgColor="linear-gradient(45deg, #cf198c, #f41242)"
                  hoverStyles={{
                    color: "#cf198c",
                    background: "-webkit-linear-gradient(45deg, #cf198c, #f41242)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />

                {/* Facebook con su hover personalizado */}
                <SocialButton
                  href="https://www.facebook.com/profile.php?id=100063452866880"
                  Icon={FacebookIcon}
                  bgColor="linear-gradient(45deg, #00B5F5, #002A8F)"
                  hoverStyles={{
                    color: "white",
                    background: "-webkit-linear-gradient(45deg, #00B5F5, #002A8F)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />

                {/* LinkedIn */}
                <SocialButton
                  href="https://www.linkedin.com/company/mittarentacar/?viewAsMember=true"
                  Icon={LinkedInIcon}
                  bgColor="linear-gradient(45deg, #00B5F5, #0077b7)"
                  hoverStyles={{
                    color: "#0077b7",
                    background: "-webkit-linear-gradient(45deg, #00B5F5, #0077b7)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />
              </Box>
            </Box>

            {/* 🔹 Columna 3: Proveedores */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>

              <img src="area-clientes.png" onClick={handleClick} width={120} alt="Área Clientes" style={{ marginTop: -35, marginBottom: "10px", cursor: "pointer", }} />

              <Typography sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AdminPanelSettingsIcon fontSize="small" />
                <Link href="administracion" color="inherit" onClick={handleClick}>
                  Administración
                </Link>
              </Typography>
            </Box>

          </Box>
        )}

        {/* 🔹 Diseño para Móviles */}
        {isMobile && (
          <Box display="flex" flexDirection="column" alignItems="center" mb={7}>
            <Box ref={logoRef} sx={{ animation: logoInView ? `${growElement} 1s forwards` : "none" }}>
              <img src="/logo-plataformas-web.png" alt="Logo" style={{ height: "85px", marginBottom: "15px", marginTop: "30px" }} />
            </Box>

            {/* Redes Sociales */}
            <Box ref={socialRef} sx={{ display: "flex", gap: 6, mb: 1, animation: socialInView ? `${growElement} 1s forwards` : "none", }}>
              <SocialButton href="https://www.instagram.com/plataformas.web/?hl=es-la" Icon={InstagramIcon} bgColor="linear-gradient(45deg, #cf198c, #f41242)" isMobile={isMobile} />
              <SocialButton href="https://www.facebook.com/profile.php?id=100063452866880" Icon={FacebookIcon} bgColor="linear-gradient(45deg, #00B5F5, #002A8F)" isMobile={isMobile} />
              <SocialButton href="https://www.linkedin.com/company/mittarentacar/?viewAsMember=true" Icon={LinkedInIcon} bgColor="linear-gradient(45deg, #00B5F5, #0077b7)" isMobile={isMobile} />
            </Box>
            <Box ref={socialRef} sx={{ display: "flex", flexDirection: "column", alignItems: "left", gap: 0.5, animation: socialInView ? `${growElement} 1s forwards` : "none", }}>

              <img
                src="area-clientes.png"
                width={120}
                onClick={handleClick}
                alt="Área Clientes"
                style={{
                  marginTop: 20,
                  marginRight: 30,
                  marginBottom: "20px",
                  cursor: "pointer", // 👈 para que se vea como botón
                }}
              />
              <Typography ml={"10px"} sx={{ display: "flex", alignItems: "center", gap: 0 }}              >
                <AdminPanelSettingsIcon fontSize="small" />
                <Link href="administracion" color="inherit" onClick={handleClick}>
                  Administración
                </Link>
              </Typography>
            </Box>
          </Box>
        )}

        <Typography variant="body2" align="center" mt={2} sx={{ marginTop: "5vh" }}>
          © 2026 Plataformas Webs – Operado por Ignacio Alejandro Aguilera Garrido {version && `- v${version}`}
        </Typography>

      </Container>
    </Box>
  );
};

export default Footer;
