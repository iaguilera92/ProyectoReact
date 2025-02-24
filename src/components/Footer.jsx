import { Box, Container, Typography, Link } from "@mui/material";

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
          <Box className="MuiBox-root css-0" sx={{ marginTop: "8vh" }}>
          <h2 class="MuiTypography-root MuiTypography-h6 css-xf79m7-MuiTypography-root">Proyecto React</h2>
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