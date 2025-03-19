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
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      padding: "20px 0",
      color: "white",
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
            flexDirection: "row", // Disposición en fila en móvil
            alignItems: "flex-start",
          },
          "@media (min-width: 601px)": {
            flexDirection: "row", // Disposición en fila en escritorio
            justifyContent: "space-between",
          },
        }}
      >
        {/* Columna izquierda: Logo y Redes Sociales */}
        <Box
          ref={logoRef}
          sx={{
            flex: "1 1 33%", // Toma el 33% en pantallas grandes
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            animation: logoInView ? `${growElement} 1s forwards` : 'none',
            "@media (max-width: 600px)": {
              alignSelf: "flex-start", // Alinea el logo a la izquierda en móvil
              marginBottom: "20px",
            },
          }}
        >
          <img
            src="/logo-react.png"
            alt="Logo"
            style={{
              height: "75px",
              marginLeft: "10px",
              animation: logoInView ? `${growElement} 1s forwards` : 'none',
            }}
          />
          {/* Redes Sociales */}
          <Box
            ref={socialRef}
            sx={{
              display: "flex",
              justifyContent: "flex-start", // Alinea los iconos a la izquierda en móvil
              gap: 2,
              mt: 1,
              animation: socialInView ? `${growElement} 1s forwards` : 'none',
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
  
        {/* Columna central: Contacto */}
        <Box
          sx={{
            flex: "1 1 33%", // Toma el 33% en pantallas grandes
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: contactInView ? `${growElement} 1s forwards` : 'none',
            "@media (max-width: 600px)": {
              alignItems: "flex-start", // Alinea el contenido de contacto a la izquierda en móvil
              marginLeft: "20px",
            },
          }}
        >
          <Typography variant="h6" sx={{ color: "var(--darkreader-text-00b4ff, #1abcff)", fontSize: "16px" }}>
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
  
        {/* Columna derecha: Proveedores */}
        <Box
          sx={{
            flex: "1 1 33%", // Toma el 33% en pantallas grandes
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: providersInView ? `${growElement} 1s forwards` : 'none',
            "@media (max-width: 600px)": {
              alignItems: "flex-start", // Alinea el contenido de proveedores a la izquierda en móvil
              marginLeft: "20px",
            },
          }}
        >
          <Typography variant="h6" sx={{ color: "var(--darkreader-text-00b4ff, #1abcff)", fontSize: "16px" }}>
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
        @Plataformas web React v1.0.0 - 2025
      </Typography>
    </Container>
  </Box>
  

  );
};

export default Footer;
