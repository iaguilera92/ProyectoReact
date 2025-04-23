import { Box, Typography, Grid, Container, useTheme, useMediaQuery, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const Nosotros = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [scrollY, setScrollY] = useState(0);

  const letterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.4 + i * 0.1 },
    }),
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);


  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        width: '100%',
        py: 14,
        px: 0,
        pb: 3.5,
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: isMobile ? 'url(fondo-blizz.avif)' : 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      {/* Título */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight={700}
          sx={{ color: "white", display: "inline-flex" }}
        >
          {"Nosotros".split("").map((char, index) => (
            <motion.span
              key={index}
              custom={index}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
            >
              {char}
            </motion.span>
          ))}
        </Typography>
      </Box>



      {/* Primera fila con animación */}
      <Box maxWidth="1200px" mx="auto">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box px={{ xs: 2, sm: 0 }}>
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: 3, p: 2 }}>
                  <CardContent>
                    <Typography variant="h4" color="white" gutterBottom>
                      ¿Quiénes Somos?
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#ccc', textAlign: 'justify', mb: 2 }}>
                      Somos una empresa de soluciones tecnológicas con más de 8 años de experiencia desarrollando proyectos a medida para empresas de distintas industrias.
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#ccc', textAlign: 'justify', mb: 2 }}>
                      Nos especializamos en la creación de páginas web, aplicaciones móviles y sistemas personalizados que se adaptan a las necesidades de cada cliente, sin importar el rubro.
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#ccc', textAlign: 'justify' }}>
                      Brindamos soporte evolutivo, mejoras continuas y acompañamiento estratégico para que cada negocio aproveche al máximo su potencial digital.
                    </Typography>
                  </CardContent>
                </Card>

              </motion.div>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Box textAlign="center">
                <img
                  src="/logo-plataformas-web.png"
                  alt="Logo"
                  style={{ maxWidth: isMobile ? '83%' : '100%', height: 'auto' }}
                />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          width: '100vw',
          position: 'relative',
          mt: 4,
          mb: 4,
          py: 4,
          backgroundImage: 'url(/developer-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: isMobile ? `center ${scrollY * 0.3}px` : 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            width: '100%',
            px: 2,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h4"}
            fontWeight={600}
            sx={{
              color: 'white',
              textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
              textAlign: 'right',
            }}
          >
            Ayudamos a hacer <span style={{ color: '#ffe037' }}>crecer</span> tu negocio
          </Typography>
        </Container>
      </Box>



      {/* Segunda fila con animación */}
      <Box maxWidth="1200px" mx="auto" mt={2}>
        <Grid container spacing={3} alignItems="flex-start">
          {/* Imagen a la izquierda con animación */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }} // 👈 mejora el comportamiento en scroll
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  p: 0,
                  mt: isMobile ? -3 : 0
                }}
              >
                <img
                  src="mision-empresa.png"
                  alt="Logo React"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
            </motion.div>
          </Grid>

          {/* Misión + Visión a la derecha con animación */}
          <Grid item xs={12} md={6}>
            <Box px={{ xs: 2, sm: 0 }}>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }} // 👈 mejora el comportamiento en scroll
              >
                <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: 3, p: 3 }}>
                  <CardContent>
                    <Typography variant="h4" color="white" gutterBottom>
                      Misión
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ccc', textAlign: 'left', mb: 3 }}>
                      Brindar soluciones tecnológicas innovadoras que impulsen el crecimiento y la eficiencia de nuestros clientes, mediante el desarrollo de software, sistemas personalizados y soporte evolutivo de alto nivel.
                    </Typography>

                    <Typography variant="h4" color="white" gutterBottom>
                      Visión
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#ccc', textAlign: 'left' }}>
                      Ser una empresa referente en el desarrollo e implementación de soluciones informáticas a nivel nacional, reconocida por su capacidad de adaptarse a distintos rubros y por entregar resultados concretos que transforman digitalmente a las organizaciones.
                    </Typography>
                  </CardContent>
                </Card>

              </motion.div>
            </Box>

          </Grid>
        </Grid>
      </Box>

    </Container>
  );
};

export default Nosotros;
