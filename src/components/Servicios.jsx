import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Collapse,
  Button,
  useTheme,
  Link,
  Container,
  useMediaQuery
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LanguageIcon from '@mui/icons-material/Language';
import UpdateIcon from '@mui/icons-material/Update';
import ExtensionIcon from '@mui/icons-material/Extension';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const services = [
  {
    title: 'Plataformas web.',
    img: '/servicio1.jpg',
    link: '',
    description: 'Desarrollamos plataformas robustas, seguras y escalables para tu empresa.',
    background: 'linear-gradient(180deg, #2c3e50, #4ca1af)',
    icon: <LanguageIcon fontSize="small" />, // 🌐
  },
  {
    title: 'Soporte Evolutivo.',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/5-Evaluacion-y-Gestion-de-Proyectos-1.jpg',
    link: '',
    description: 'Mejoras continuas para mantener tus soluciones siempre actualizadas.',
    background: 'linear-gradient(180deg, #1f2b4a, #3a506b)',
    icon: <UpdateIcon fontSize="small" />, // 🔄
  },
  {
    title: 'Sistemas a la medida.',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/1-Modificaciones-Industriales-1.jpg',
    link: '',
    description: 'Creamos software que se adapta exactamente a tus necesidades y objetivos.',
    background: 'linear-gradient(180deg, #1f4a36, #38ef7d)',
    icon: <ExtensionIcon fontSize="small" />, // 🧩
  },
  {
    title: 'Tienda Online',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/3-Especialidad-Electrica-1.jpg',
    link: '',
    description: 'Impulsa tus ventas con plataformas de e-commerce seguras y personalizadas.',
    background: 'linear-gradient(180deg, #4a441f, #f1c40f)',
    icon: <ShoppingCartIcon fontSize="small" />, // 🛒
  },
];

const Servicios = () => {
  const theme = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [startSpin, setStartSpin] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [scrollY, setScrollY] = useState(0);
  const containerRef = React.useRef();

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

  const handleExpandClick = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));

    setTimeout(() => {
      const navbarHeight = 80;
      const tituloYDescripcionHeight = 220; // aprox, ajustable
      const paddingExtra = 16;

      if (containerRef.current) {
        const baseTop = containerRef.current.getBoundingClientRect().top + window.scrollY;

        // El offset dinámico en función del índice y los elementos superiores
        const dynamicOffset = tituloYDescripcionHeight + index * 150;
        const finalScrollY = baseTop + dynamicOffset - navbarHeight - paddingExtra;

        window.scrollTo({ top: finalScrollY, behavior: 'smooth' });
      }
    }, 400); // Dale tiempo al collapse a abrirse
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        width: '100vw',
        py: 1,
        px: 0,
        pb: 3.5,
        backgroundImage: 'url(fondo-blizz.avif)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }}
    >
      <Box ref={containerRef} sx={{ pt: 12, pb: 4, px: { xs: 1, md: 4 } }}>
        <Box textAlign="center" mb={4} px={2}>
          <Typography
            variant={isMobile ? "h4" : "h2"}
            fontWeight={700}
            sx={{ color: 'white', display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            {"Nuestros Servicios".split("").map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                style={{ display: 'inline-block' }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </Typography>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
          >
            <Typography
              variant="body1"
              color="white"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                fontSize: '1.2rem',
                fontFamily: '"Segoe UI", sans-serif',
                lineHeight: 1.6,
                opacity: 0.9,
                mt: 1.5,
              }}
            >
              Equipo de Especialistas para Evaluación, Implementación y Gestión de Proyectos Industriales con un Enfoque Tecnológico.
            </Typography>
          </motion.div>

        </Box>


        {/* Título con ícono estilo reels */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mx: 'auto', mb: 2, maxWidth: 1200, px: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1, // Espacio entre imagen y texto
              }}
            >
              <Box
                component="img"
                src="/public-service.png" // O usa import si está en assets
                alt="Servicios icon"
                sx={{
                  width: 18,
                  height: 18,
                  filter: 'invert(1)',
                }}
              />
              <Box
                sx={{
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  color: 'white',
                  letterSpacing: 0.5,
                  fontFamily: '"Segoe UI", sans-serif',
                }}
              >
                Te presentamos nuestros servicios:
              </Box>
            </Box>
          </motion.div>

        </Box>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8, ease: 'easeOut' }}
        >
          <Grid container spacing={2} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2 + index * 0.4, duration: 0.6, ease: 'easeOut' }}
                  onAnimationComplete={() => {
                    if (index === services.length - 1) {
                      setStartSpin(true);
                    }
                  }}
                  style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
                >
                  <Card
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      borderRadius: 4,
                      maxWidth: 1200,
                      width: '100%',
                      backgroundImage: service.background,
                      border: '1px solid rgba(0,0,0,0.1)',
                      boxShadow: 3,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease, max-height 0.5s ease',
                      overflow: 'hidden',
                      maxHeight: expandedIndex === index ? 1000 : 140, // Ajusta esto según lo que necesites
                      '&:hover': {
                        transform: 'scale(1.015)',
                        boxShadow: 6,
                      },
                    }}
                  >

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                      <CardContent
                        sx={{
                          p: 2,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '60px',
                            height: '100%',
                            opacity: 0.6,
                            pointerEvents: 'none',
                          },
                        }}
                      >
                        <motion.div
                          animate={expandedIndex === index ? { rotate: 720 } : {}}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#ffffff40',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 24,
                            zIndex: 5,
                            cursor: expandedIndex === index ? 'pointer' : 'default', // solo clickeable si es "X"
                          }}
                          onClick={() => {
                            if (expandedIndex === index) {
                              handleExpandClick(index); // solo cierra si está abierto
                            }
                          }}
                        >
                          {expandedIndex === index
                            ? <Box component="span" sx={{ fontSize: 22 }}>✕</Box>
                            : service.icon}
                        </motion.div>

                        <Typography variant="subtitle1" fontWeight={600}>
                          <Link underline="hover" color="white">
                            {service.title}
                          </Link>
                        </Typography>
                      </CardContent>

                      <Collapse in={expandedIndex === index} timeout={{ enter: 500, exit: 300 }} sx={{ transition: 'height 0.5s ease' }}>
                        {index === 0 || index === 1 || index === 2 || index === 3 ? (
                          <Box
                            sx={{
                              px: 2,
                              py: 2,
                              display: 'grid',
                              gap: 4,
                              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
                            }}
                          >
                            {(index === 0
                              ? [
                                {
                                  title: 'Sistemas personalizados',
                                  description: 'Diseño y desarrollo a medida de plataformas adaptadas a tus procesos.',
                                  image: '/servicio1.jpg',
                                  items: [
                                    'Interfaces visuales modernas y fáciles de usar.',
                                    'Sistemas internos seguros y eficientes para manejar datos.',
                                    'Conexión con otras plataformas o sistemas que ya usas.',
                                    'Control total de usuarios, permisos y accesos.',
                                    'Paneles de administración intuitivos.',
                                  ]
                                },
                                {
                                  title: 'Backend y API',
                                  description: 'Desarrollo de backend sólido y APIs seguras.',
                                  image: '/servicio2.jpg',
                                  items: [
                                    'Desarrollo de APIs REST con C#, Python y Node.js.',
                                    'Integración con bases de datos SQL Server, MySQL, MongoDB y Oracle.',
                                    'Autenticación segura con JWT y OAuth 2.0.',
                                    'Documentación de endpoints con Swagger / OpenAPI.',
                                    'Uso de Blazor y React como frontends conectados a APIs robustas.',
                                    'Diseño de arquitecturas escalables y mantenibles.'
                                  ]
                                }
                              ]
                              : index === 1
                                ? [
                                  {
                                    title: 'Actualizaciones constantes',
                                    description: 'Refactorización de código y mejoras incrementales.',
                                    image: '/servicio3.webp',
                                    items: [
                                      'Actualización de librerías.',
                                      'Optimización de rendimiento.',
                                      'Revisión técnica periódica.',
                                      'Mejoras visuales y funcionales basadas en feedback de usuarios.',
                                      'Adaptación a nuevas tendencias tecnológicas y estándares de desarrollo.'

                                    ]
                                  },
                                  {
                                    title: 'Atención a incidentes',
                                    description: 'Soporte técnico con SLA y monitoreo activo.',
                                    image: '/servicio4.jpg',
                                    items: [
                                      'Resolución rápida de errores técnicos.',
                                      'Prevención proactiva de incidentes.',
                                      'Monitoreo con Grafana, Sentry o Prometheus.',
                                      'Informes de estabilidad y rendimiento.',
                                      'Soporte con SLA y canales directos.'
                                    ]
                                  }
                                ]
                                : index === 2
                                  ? [
                                    {
                                      title: 'Soluciones Personalizadas',
                                      description: 'Desarrollo específico para cada industria.',
                                      image: '/servicio5.jpg',
                                      items: [
                                        'Levantamiento y análisis de necesidades reales del negocio.',
                                        'Diseño de arquitectura tecnológica adaptada al proyecto.',
                                        'Automatización de procesos internos para mayor eficiencia.',
                                        'Integración con sistemas existentes (ERP, CRM, etc.).'
                                      ]
                                    },
                                    {
                                      title: 'Escalabilidad y crecimiento',
                                      description: 'Diseñados para crecer con tu negocio.',
                                      image: '/servicio6.avif',
                                      items: [
                                        'Estructura modular que permite agregar nuevas funciones fácilmente.',
                                        'Soporte para trabajar en distintos ambientes (desarrollo, pruebas y producción).',
                                        'Automatización de despliegues para actualizaciones rápidas y seguras.',
                                        'Preparado para manejar mayor cantidad de usuarios o datos sin perder rendimiento.'
                                      ]
                                    }
                                  ]
                                  : [
                                    {
                                      title: 'Catálogo y Gestión de Productos',
                                      description: 'Administra tus productos con facilidad.',
                                      image: '/servicio7.jpg',
                                      items: [
                                        'Carga masiva de productos desde archivos Excel o CSV.',
                                        'Control automático de stock, precios y disponibilidad.',
                                        'Descripciones optimizadas para buscadores (SEO).',
                                        'Clasificación por categorías, filtros y etiquetas personalizadas.'
                                      ]
                                    },
                                    {
                                      title: 'Integración de medios de pago',
                                      description: 'Pagos seguros y rápidos.',
                                      image: '/servicio8.jpg',
                                      items: [
                                        'Webpay, PayPal, MercadoPago, OneClick.',
                                        'Boletas electrónicas automáticas.',
                                        'Facturas electrónicas.',
                                        'Envíos e integración logística.'
                                      ]
                                    }
                                  ]).map((section, sIdx) => (
                                    <Box
                                      key={sIdx}
                                      sx={{
                                        width: '100%',
                                        height: 360,
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        position: 'relative',
                                        color: 'white',
                                        backgroundImage: `url(${section.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          width: '100%',
                                          height: '100%',
                                          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0))',
                                          zIndex: 1
                                        }}
                                      />
                                      <Box sx={{ zIndex: 2, px: 2, textAlign: 'center', mt: 3, fontFamily: 'Roboto,Arial,sans-serif' }}>
                                        <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                          {section.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1, color: 'white' }}>
                                          {section.description}
                                        </Typography>
                                        <Box
                                          sx={
                                            section.items.length > 5
                                              ? {
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                                gap: 1,
                                                justifyContent: 'center',
                                                marginTop: '20px'
                                              }
                                              : { marginTop: '20px' }
                                          }
                                        >
                                          {expandedIndex === index &&
                                            section.items.map((item, idx) => (
                                              <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                              >
                                                <Box sx={{ display: 'flex', alignItems: 'start', gap: 1, mb: 1 }}>
                                                  <CheckIcon fontSize="small" sx={{ color: '#7fe084' }} />
                                                  <Typography variant="body2" color="white" sx={{ lineHeight: 1.4 }}>
                                                    {item}
                                                  </Typography>
                                                </Box>
                                              </motion.div>
                                            ))}
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              px: 2,
                              py: 2,
                              borderTop: `1px solid ${theme.palette.divider}`,
                              display: 'flex',
                              flexDirection: { xs: 'column', sm: 'row' },
                              gap: 2,
                              alignItems: 'center',
                              transition: 'all 0.5s ease',
                            }}
                          >
                            <Box
                              component="img"
                              src={service.img}
                              alt={service.title}
                              sx={{
                                width: { xs: '100%', sm: 180 },
                                height: 'auto',
                                borderRadius: 2,
                                objectFit: 'cover',
                                boxShadow: 2,
                                transition: 'all 0.5s ease',
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="white"
                              sx={{ flex: 1, transition: 'all 0.5s ease' }}
                            >
                              {service.description}
                            </Typography>
                          </Box>
                        )}
                      </Collapse>


                      <Button onClick={() => handleExpandClick(index)} fullWidth sx={{ height: 36, minHeight: 36, borderTop: `1px solid ${theme.palette.divider}`, borderRadius: 0, px: 2, py: 0.5, textTransform: 'none', fontSize: '0.9rem', color: 'white', bgcolor: '#ffffff40', transition: 'all 0.3s ease', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                        <motion.div animate={expandedIndex === index ? { y: 0 } : { y: [0, 6, 0] }} transition={expandedIndex === index ? {} : { duration: 1.2, repeat: 2 }}>
                          <KeyboardArrowDownIcon fontSize="large" sx={{ fontSize: '23px', transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                        </motion.div>
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box >
    </Container >
  );
};

export default Servicios;
