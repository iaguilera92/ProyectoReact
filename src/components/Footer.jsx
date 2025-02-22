import { Box, Container, Typography } from "@mui/material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "grey.800", color: "white", py: 3, textAlign: "center" }}>
      <Container>
        <Typography variant="body2">© 2025 Proyecto React. Todos los derechos reservados.</Typography>
      </Container>
    </Box>
  );
}

export default Footer;
