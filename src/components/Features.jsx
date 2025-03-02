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
} from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "framer-motion";
import { FaHubspot } from "react-icons/fa";

// Datos de ejemplo
const features = [
  {
    id: 1015,
    title: "BI",
    desc: "Servicios Business Intelligence: desarrollamos plataformas BI para agilizar y recopilar información.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/bi_dsmsolutions.webp",
    link: "https://www.dsmsolutions.cl/bi/",
  },
  {
    id: 1002,
    title: "Soporte Evolutivo de Sistemas",
    desc: "Soporte evolutivo y mantenimiento de sistemas, brindamos soporte TI para el mantenimiento de tus sistemas.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/plataforma-mycrosoft-dynamics.webp",
    link: "https://www.dsmsolutions.cl/mantenimiento-de-sistemas/",
  },
  {
    id: 868,
    title: "Desarrollo de Sistemas a Medida",
    desc: "Desarrollo de sistemas a medida, creamos software y sitios web personalizados para tu negocio.",
    image: "https://www.dsmsolutions.cl/wp-content/uploads/2023/08/desarrollo-software_dsmsolutions.webp",
    link: "https://www.dsmsolutions.cl/desarrollo-de-sistemas-a-medida/",
  },
];

// Animación de aparición desde la derecha con efecto de cascada
const cardAnimation = {
  hidden: { opacity: 0, x: 150 }, // Inicia fuera de la pantalla, a la derecha
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay: index * 0.3, ease: "easeOut" }, // Cascada
  }),
};

// StyledCardActionArea: al hacer hover, el overlay se despliega y el icono de la imagen se hace zoom
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
  return (
    <Container sx={{ py: 4, maxWidth: "1500px !important" }}>
      <Grid container spacing={2}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={feature.id}>
            {/* Aplicamos animación a cada Card con delay en cascada */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={cardAnimation}
              custom={index} // Se usa para el delay progresivo
            >
              <Card sx={{ position: "relative", overflow: "hidden" }}>
                <StyledCardActionArea href={feature.link} target="_self">
                  <CardMedia
                    className="card-media"
                    component="img"
                    image={feature.image}
                    alt={feature.title}
                    sx={{
                      height: 250,
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
            fontSize: "1.1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            width: "460px",
            height: "50px",
            backgroundColor: "#007de0",
            transition: "width 0.3s ease",
            "&:hover": {
              width: "470px",
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
        >
          <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Box
              component="span"
              className="icon"
              sx={{
                position: "absolute",
                left: 0,
                display: "flex",
                alignItems: "center",
                opacity: 0,
                transform: "translateX(0)",
                transition: "all 0.3s ease",
                zIndex: 2,
              }}
            >
              <FaHubspot style={{ color: "#fff", fontSize: "1.5rem" }} />
            </Box>
          </Box>
          <Box component="span" className="letter" sx={{ ml: 1, transition: "all 0.3s ease" }}>
            + SOLUCIONES PARA TU EMPRESA
          </Box>
        </Button>
      </Box>
    </Container>
  );
}

export default Features;
