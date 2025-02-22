import { Container, Typography, Button, Box } from "@mui/material";

function Hero() {
  return (
    <Box sx={{ position: "relative", height: "400px", overflow: "hidden" }}>
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        id="background-video"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://www.connectic.cl/wp-content/uploads/2024/07/136268-764387688_small.mp4"
          type="video/mp4"
        />
      </video>

      {/* Contenido sobre el video */}
      <Container
        sx={{
          position: "relative",
          zIndex: 1,
          color: "white",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Bienvenido a Proyecto React
        </Typography>
        <Typography variant="h6" paragraph>
          Ofrecemos soluciones innovadoras para hacer crecer tu negocio.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
  <Button variant="contained" color="secondary" size="large">
    Saber Más
  </Button>
</Box>

      </Container>
    </Box>
  );
}

export default Hero;
