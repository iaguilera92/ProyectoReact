import React from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { FaHubspot } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import "./Features.css"; // Importamos el CSS

// Datos de ejemplo
const features = [
  {
    id: 1,
    title: "BI",
    desc: "Servicios Business Intelligence: desarrollamos plataformas BI para agilizar y recopilar información.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/bi_dsmsolutions.webp",
    link: "https://www.dsmsolutions.cl/bi/",
  },
  {
    id: 2,
    title: "Soporte Evolutivo de Sistemas",
    desc: "Soporte evolutivo y mantenimiento de sistemas, brindamos soporte TI para el mantenimiento de tus sistemas.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/plataforma-mycrosoft-dynamics.webp",
    link: "https://www.dsmsolutions.cl/mantenimiento-de-sistemas/",
  },
  {
    id: 3,
    title: "Desarrollo de Sistemas a Medida",
    desc: "Desarrollo de sistemas a medida, creamos software y sitios web personalizados para tu negocio.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/desarrollo-software_dsmsolutions.webp",
    link: "https://www.dsmsolutions.cl/desarrollo-de-sistemas-a-medida/",
  },
];

// Animación de aparición desde la derecha con efecto de cascada
const cardAnimation = {
  hidden: { opacity: 0, x: 150 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: index * 0.3, ease: "easeOut" },
  }),
};

// StyledCardActionArea: al hacer hover, el overlay se despliega y la imagen hace zoom
const StyledCardActionArea = styled(CardActionArea)({
  position: "relative",
  "&:hover .overlay": {
    top: 0,
    height: "100%",
    backgroundColor: "rgba(3, 103, 191, 0.8)",
  },
  "&:hover .additional": {
    opacity: 1,
  },
  "&:hover .card-media": {
    transform: "scale(1.3)",
  },
});

// Overlay: inicialmente ocupa la mitad inferior con fondo semitransparente
const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: 0,
  right: 0,
  height: "75%",
  backgroundColor: "rgba(3, 103, 191, 0.4)",
  color: theme.palette.common.white,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  transition: "all 0.3s ease",
}));

// AdditionalContent: descripción y botón, inicialmente ocultos
const AdditionalContent = styled(Box)({
  opacity: 0,
  transition: "opacity 0.3s ease",
});

function Features() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const { ref, inView } = useInView({
    triggerOnce: true,  // Esto asegura que se dispare solo una vez cuando el botón entre en vista
    threshold: 0.8,     // Ajusta este valor si quieres que se active antes o después
  });
  return (
    <Container
      sx={{
        py: 4,
        maxWidth: "1500px !important",
        // Fondo ajustado para desktop y mobile
        backgroundImage: {
          xs: "url(https://blz-contentstack-images.akamaized.net/v3/assets/blta8f9a8e092360c6c/blt5469c93bcb8be6fc/Mobile_Blizz_Footer.jpg)",
          md: "url(https://blz-contentstack-images.akamaized.net/v3/assets/blta8f9a8e092360c6c/blt367ca4b27c88c078/Desktop_Blizz_Footer.jpg)",
        },
        backgroundPosition: "bottom center",
        backgroundRepeat: "no-repeat",
        // filter: "blur(20px)", // Descomenta si deseas aplicar el desenfoque
      }}
    >
      <Grid container spacing={2}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={feature.id}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardAnimation}
              custom={index}
            >
              <Card sx={{ position: "relative", overflow: "hidden" }}>
                <StyledCardActionArea href={feature.link} target="_self">
                  <CardMedia
                    className="card-media"
                    component="img"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      height: isMobile ? 200 : 250,
                      transition: "transform 1s",
                    }}
                  />
                  <Overlay className="overlay">
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        textAlign: "left",
                        width: "100%",
                        marginLeft: "9px",
                        fontSize: "1.4rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <AdditionalContent className="additional">
                      <Typography variant="body2" sx={{ mb: 2, px: 1, fontSize: "1rem" }}>
                        {feature.desc}
                      </Typography>
                      <Box sx={{ textAlign: "center", width: "100%" }}>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "white",
                            color: "black",
                            textTransform: "none",
                          }}
                          href={feature.link}
                          target="_self"
                        >
                          Leer más
                        </Button>
                      </Box>
                    </AdditionalContent>
                  </Overlay>
                </StyledCardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <br />
      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
      <Button
      variant="contained"
      href="https://www.dsmsolutions.cl/soluciones-para-empresas/"
      target="_self"
      sx={{
        textTransform: "none",
        fontWeight: "bold",
        letterSpacing: "3.1px",
        fontFamily: "albert sans, sans-serif",
        border: "1px solid #007de0",
        fontSize: { xs: "10px", sm: "1.1rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        width: { xs: "93%", sm: "460px" },
        maxWidth: "460px",
        height: "50px",
        backgroundColor: "#007de0",
        transition: "width 0.3s ease",
        "&:hover": {
          width: { xs: "95%", sm: "470px" },
          backgroundColor: "#007de0",
        },
        "&:hover .icon": {
          opacity: 1,
          transform: "translateX(-10px)",
        },
        "&:hover .letter": {
          transform: "translateX(15px)",
        },
      }}
      ref={ref} // Se activa el observador para el botón
    >
      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Box
          component="span"
          className={`icon ${inView ? "animate" : ""}`} // Activar animación al estar en vista
          sx={{
            position: "absolute",
            left: 0,
            display: "flex",
            alignItems: "center",
            opacity: inView ? 0 : 1,  // Al hacer scroll, se oculta el icono
            transform: inView ? "translateX(10px)" : "translateX(0)", // Mover el icono a la derecha
            transition: "all 1s ease", // Transición suave
            zIndex: 2,
          }}
        >
          <FaHubspot style={{ color: "#fff", fontSize: "1.5rem" }} />
        </Box>
      </Box>
      <Box
        component="span"
        className={`letter ${inView ? "animate" : ""}`} // Activar animación al estar en vista
        sx={{
          ml: 1,
          transition: "all 1s ease", // Transición suave
          transform: inView ? "translateX(0)" : "translateX(15px)", // Inicialmente a la derecha (15px)
        }}
      >
        + SOLUCIONES PARA TU EMPRESA
      </Box>
    </Button>

      </Box>
    </Container>
  );
}

export default Features;
