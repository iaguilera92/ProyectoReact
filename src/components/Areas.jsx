import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  Box,
} from "@mui/material";

const areas = [
  {
    titulo: "Agrícola",
    descripcion:
      "Gestión agrícola, monitoreo de plagas, meteorología, integración satelital para mapas, sensores en terreno y tracking de contenedores.",
    imagen: "https://www.connectic.cl/wp-content/uploads/2024/08/tractor-90x90.png",
    enlace: "https://www.connectic.cl/contactanos/",
  },
  {
    titulo: "Gobierno",
    descripcion:
      "Implementación de plataformas para el control de presupuestos y procesos internos en entidades del Estado.",
    imagen: "https://www.connectic.cl/wp-content/uploads/2024/07/5925622_college_government_institute_icon-90x90.png",
    enlace: "https://www.connectic.cl/contactanos/",
  },
  {
    titulo: "Bancario",
    descripcion:
      "Implementación de reportes normativos e integración con areas bancarios para transacciones.",
    imagen: "https://www.connectic.cl/wp-content/uploads/2024/08/banco-en-linea-2-90x90.png",
    enlace: "https://www.connectic.cl/contactanos/",
  },
  {
    titulo: "Educación",
    descripcion:
      "Implementación de plataforma móvil para la entrega de información relacionada con la educación.",
    imagen: "https://www.connectic.cl/wp-content/uploads/2024/07/309036_student_education_study_icon-90x90.png",
    enlace: "https://www.connectic.cl/contactanos/",
  },
  {
    titulo: "Logística",
    descripcion:
      "Automatización logística con plataforma centralizada y tablets para el control y administración de ingresos.",
    imagen: "https://www.connectic.cl/wp-content/uploads/2024/08/repartidor-90x90.png",
    enlace: "https://www.connectic.cl/contactanos/",
  },
];

const Areas = () => {
  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Áreas de Proyectos
      </Typography>
      <Box sx={{ width: 150, height: 2, backgroundColor: "#00b4ff", mx: "auto", mb: 4 }} />
      <Grid container spacing={3} justifyContent="center">
        {areas.map((servicio, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ maxWidth: 345, mx: "auto", textAlign: "center" }}>
              <CardActionArea href={servicio.enlace} target="_blank">
                <CardMedia
                  component="img"
                  image={servicio.imagen}
                  alt={servicio.titulo}
                  sx={{ width: 90, height: 90, mx: "auto", mt: 2 }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {servicio.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {servicio.descripcion}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <br/>
    </Container>
  );
};

export default Areas;
