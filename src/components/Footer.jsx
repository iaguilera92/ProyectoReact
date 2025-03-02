import { Box, Container, Typography, Link, keyframes   } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

// Animación del círculo desapareciendo
const shrinkCircle = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;

// Animación del icono creciendo
const expandIcon = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(1.5); }
`;

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
        animation: `${shrinkCircle} 900ms forwards`,
      },
      "&:hover .icon": {
        animation: `${expandIcon} 150ms 150ms ease-in forwards`,
        ...hoverStyles, // Se aplican los estilos únicos de cada red
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

    {/* Icono con color inicial en blanco */}
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
  return (
    <Box
      sx={{
        backgroundColor: "rgba(23, 24, 25, 0.97)",
        backgroundImage:
          "url(https://www.connectic.cl/wp-content/uploads/2024/07/lucas-giordano-de-sousa-UWupz6Lxz3A-unsplash-1-1.jpg)",
        backgroundSize: "cover",
        padding: "20px 0",
        color: "white",
        backgroundPosition: "center -150px"
      }}
    >
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box className="MuiBox-root css-0" sx={{ marginTop: "2%" }}>
          <h2 class="MuiTypography-root MuiTypography-h6 css-xf79m7-MuiTypography-root">Proyecto React</h2>
           {/* Redes Sociales */}
           <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
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

              {/* Facebook con su hover personalizado */}
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

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
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
        </Box>

        <Typography variant="body2" align="center" mt={2} sx={{marginTop: "3vh"}}>
          @Proyecto React 2025
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;