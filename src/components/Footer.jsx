import { Box, Container, Typography, Link, keyframes } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useInView } from "react-intersection-observer";

// Animación del círculo desapareciendo (se achica y desaparece)
const shrinkCircle = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;

// Animación del icono creciendo y cambiando color
const expandIcon = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 1; }
`;

// Animación para el logo y los elementos al entrar en vista
const growElement = keyframes`
  0% { transform: scale(0.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

// Botón social con animaciones
const SocialButton = ({ href, Icon, bgColor }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener"
    sx={{
      width: 70,
      height: 70,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: bgColor,
      overflow: "hidden",
      position: "relative",
      transition: "transform 300ms ease-out",
      "&:hover .circle": {
        animation: `${shrinkCircle} 300ms forwards`,
      },
      "&:hover .icon": {
        animation: `${expandIcon} 300ms forwards`,
      },
    }}
  >
    {/* Círculo de fondo */}
    <Box
      className="circle"
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: bgColor,
      }}
    />
    {/* Icono de la red social */}
    <Icon
      className="icon"
      sx={{
        color: "white",
        fontSize: 40,
        position: "relative",
      }}
    />
  </Box>
);

const Footer = () => {
  // Animaciones al hacer scroll
  const { ref: logoRef, inView: logoInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: socialRef, inView: socialInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: contactRef, inView: contactInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: providersRef, inView: providersInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      sx={{
        backgroundColor: "rgba(23, 24, 25, 0.97)",
        padding: "20px 0",
        color: "white",
        backgroundImage:
          "url(https://www.connectic.cl/wp-content/uploads/2024/07/lucas-giordano-de-sousa-UWupz6Lxz3A-unsplash-1-1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center -150px",
        "@media (max-width: 600px)": {
          backgroundPosition: "center center",
          padding: "10px 0",
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{
            "@media (max-width: 600px)": {
              flexDirection: "column", // En móvil, solo el logo y redes sociales centradas
              alignItems: "center",
            },
            "@media (min-width: 601px)": {
              flexDirection: "row", // En escritorio, en fila con 3 columnas
              justifyContent: "space-between",
            },
          }}
        >
          {/* Sección: Logo + Redes Sociales */}
          <Box
            ref={logoRef}
            sx={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", sm: "flex-start" }, // Centrado en móvil, a la izquierda en escritorio
              textAlign: { xs: "center", sm: "left" },
              animation: logoInView ? `${growElement} 1s forwards` : "none",
            }}
          >
            <img
              src="/logo-react.png"
              alt="Logo"
              style={{ height: "85px", marginBottom: "0" }}
            />
            <Box
              ref={socialRef}
              sx={{
                display: "flex",
                gap: 6,
                mt: 1,
                animation: socialInView ? `${growElement} 1s forwards` : "none",
              }}
            >
              <SocialButton
                href="https://www.instagram.com/plataformas.web/?hl=es-la"
                Icon={InstagramIcon}
                bgColor="linear-gradient(45deg, #cf198c, #f41242)"
              />
              <SocialButton
                href="https://www.facebook.com/Mittarentacar"
                Icon={FacebookIcon}
                bgColor="linear-gradient(45deg, #00B5F5, #002A8F)"
              />
              <SocialButton
                href="https://www.linkedin.com/company/mittarentacar/?viewAsMember=true"
                Icon={LinkedInIcon}
                bgColor="linear-gradient(45deg, #00B5F5, #0077b7)"
              />
            </Box>
          </Box>

          {/* Sección: Contacto (Oculta en móvil) */}
          <Box
            ref={contactRef}
            sx={{
              flex: "1",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              animation: contactInView ? `${growElement} 1s forwards` : "none",
            }}
          >
            <Typography variant="h6" sx={{ color: "#1abcff", fontSize: "16px" }}>
              Contacto
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="https://www.connectic.cl/wp-content/uploads/2021/04/telephone.png" alt="Teléfono" width={16} />
              <Link href="tel:+56999999999" color="inherit">
                +56 987654321
              </Link>
            </Typography>
          </Box>

          {/* Sección: Proveedores (Oculta en móvil) */}
          <Box
            ref={providersRef}
            sx={{
              flex: "1",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              animation: providersInView ? `${growElement} 1s forwards` : "none",
            }}
          >
            <Typography variant="h6" sx={{ color: "#1abcff", fontSize: "16px" }}>
              Proveedores
            </Typography>
            <img src="https://www.connectic.cl/wp-content/uploads/2021/04/mercadoublico-300x66.png" alt="Mercado Público" width={180} />
          </Box>
        </Box>

        <Typography variant="body2" align="center" mt={2} sx={{ marginTop: "3vh" }}>
          @Plataformas web React v1.0.2 - 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
