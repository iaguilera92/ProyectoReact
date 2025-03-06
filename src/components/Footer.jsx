import { Box, Container, Typography, Link, keyframes } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { useInView } from 'react-intersection-observer';

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

// Botón social
const SocialButton = ({ href, Icon, bgColor, hoverStyles }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener"
    sx={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      "&:hover .circle": {
        animation: `${shrinkCircle} 300ms forwards`,
      },
      "&:hover .icon": {
        animation: `${expandIcon} 300ms forwards`,
        ...hoverStyles,
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
        transition: "transform 300ms ease-out",
      }}
    />
    
    {/* Icono de la red social */}
    <Icon
      className="icon"
      sx={{
        color: "white",
        fontSize: 24,
        position: "absolute",
        transition: "color 300ms ease-in, transform 300ms ease-in",
      }}
    />
  </Box>
);

const Footer = () => {
  // Usamos useInView para que el logo, los iconos y los elementos de contacto/proveedores se animen al hacer scroll
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
        backgroundImage:
          "url(https://www.connectic.cl/wp-content/uploads/2024/07/lucas-giordano-de-sousa-UWupz6Lxz3A-unsplash-1-1.jpg)",
        backgroundSize: "cover",
        padding: "20px 0",
        color: "white",
        backgroundPosition: "center -150px",
      }}
    >
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box
            ref={logoRef}
            className="MuiBox-root css-0"
            sx={{
              marginTop: "2%",
              animation: logoInView ? `${growElement} 1s forwards` : 'none', 
            }}
          >
            <img
              src="/logo-nxo.png"
              alt="Logo"
              style={{
                height: "75px",
                marginLeft: "25px",
                animation: logoInView ? `${growElement} 1s forwards` : 'none',
              }}
            />
            {/* Redes Sociales */}
            <Box
              ref={socialRef}
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 1,
                animation: socialInView ? `${growElement} 1s forwards` : 'none',
              }}
            >
              {/* Instagram */}
              <SocialButton
                href="https://www.instagram.com/mittarentacar/?hl=es-la"
                Icon={InstagramIcon}
                bgColor="linear-gradient(45deg, #cf198c, #f41242)"
                hoverStyles={{
                  color: "#cf198c",
                  background: "-webkit-linear-gradient(45deg, #cf198c, #f41242)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />

              {/* Facebook */}
              <SocialButton
                href="https://www.facebook.com/Mittarentacar"
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
{/* Contacto */}
<Box
            ref={contactRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              marginTop: "20px",
              animation: contactInView ? `${growElement} 1s forwards` : 'none',
            }}
          >
            <Typography variant="h6" sx={{ color: "var(--darkreader-text-00b4ff, #1abcff)" }}>
              Contacto
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="https://www.connectic.cl/wp-content/uploads/2021/04/telephone.png" alt="Teléfono" width={16} />
              <Link href="tel:+56999999999" color="inherit">+56 987654321</Link>
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="https://www.connectic.cl/wp-content/uploads/2021/04/correo-1.png" alt="Correo" width={16} />
              <Link href="mailto:aguileraignacio1992@gmail.com" color="inherit">aguileraignacio1992@gmail.com</Link>
            </Typography>
            <Typography sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src="https://www.connectic.cl/wp-content/uploads/2021/04/location.png" alt="Ubicación" width={16} />
              Dirección #321, Santiago.
            </Typography>
          </Box>
          {/* Proveedores Para */}
          <Box
            ref={providersRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              marginTop: "20px",
              animation: providersInView ? `${growElement} 1s forwards` : 'none',
            }}
          >
            <Typography variant="h6" sx={{ color: "var(--darkreader-text-00b4ff, #1abcff)" }}>
              Proveedores Para
            </Typography>
            <img
              src="https://www.connectic.cl/wp-content/uploads/2021/04/mercadoublico-300x66.png"
              alt="Mercado Público"
              width={180}
            />
            <img
              src="https://www.connectic.cl/wp-content/uploads/2021/04/logo-convenio-300x66.png"
              alt="Convenio Marco"
              width={180}
            />
          </Box>

          
        </Box>

        <Typography variant="body2" align="center" mt={2} sx={{ marginTop: "3vh" }}>
          @Proyecto React 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
