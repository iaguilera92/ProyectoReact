import { Container, Grid, Card, CardContent, Typography, Box } from "@mui/material";
import { Star, TrendingUp, Support } from "@mui/icons-material";

const features = [
  { icon: <Star fontSize="large" />, title: "Calidad Premium", desc: "Nuestros productos cumplen con los más altos estándares." },
  { icon: <TrendingUp fontSize="large" />, title: "Crecimiento Asegurado", desc: "Ayudamos a tu empresa a crecer con tecnología avanzada." },
  { icon: <Support fontSize="large" />, title: "Soporte 24/7", desc: "Siempre estamos disponibles para ayudarte en cualquier momento." },
];

function Features() {
  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        ¿Por qué elegirnos?
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ textAlign: "center", p: 3 }}>
              <Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
              <CardContent>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Features;
