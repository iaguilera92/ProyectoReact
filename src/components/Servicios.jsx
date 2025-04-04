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
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BuildIcon from '@mui/icons-material/Build';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const services = [
  {
    title: 'Servicios de Ingeniería.',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/2-Automatizacion-y-Control-2.jpg',
    link: '',
    description: '',
    background: 'linear-gradient(180deg, #4a1f1f, #702d2d)',
    icon: <PrecisionManufacturingIcon fontSize="small" />,
  },
  {
    title: 'Control de Procesos.',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/5-Evaluacion-y-Gestion-de-Proyectos-1.jpg',
    link: '',
    description: 'Optimización y eficiencia de procesos industriales.',
    background: 'linear-gradient(180deg, #1f2b4a, #2d3d70)',
    icon: <ShowChartIcon fontSize="small" />,
  },
  {
    title: 'Servicios Especializados.',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/1-Modificaciones-Industriales-1.jpg',
    link: '',
    description: 'Soluciones a medida en ingeniería especializada.',
    background: 'linear-gradient(180deg, #1f4a36, #2d7052)',
    icon: <BuildIcon fontSize="small" />,
  },
  {
    title: 'Especialidad Eléctrica y Eléctricos',
    img: 'https://autoges.cl/wp-content/uploads/2022/08/3-Especialidad-Electrica-1.jpg',
    link: '',
    description: 'Instalaciones eléctricas seguras y normadas.',
    background: 'linear-gradient(180deg, #4a441f, #70672d)',
    icon: <ElectricalServicesIcon fontSize="small" />,
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

        <Grid container spacing={2} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} key={index}>
              <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.4, duration: 0.6, ease: 'easeOut' }}
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
                          background: 'linear-gradient(to right, transparent 70%, rgba(255,255,255,0.12) 90%, rgba(255,255,255,0.2) 100%)',
                          opacity: 0.6,
                          pointerEvents: 'none',
                        },
                      }}
                    >
                      <motion.div
                        animate={startSpin ? { rotate: 360 } : {}}
                        transition={startSpin ? { repeat: 2, duration: 0.3, ease: 'linear' } : {}}
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
                        }}
                      >
                        {service.icon}
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
                                title: 'ÁREA ELÉCTRICA',
                                description: 'Especialización en estudios eléctricos industriales y asistencia técnica avanzada.',
                                image: 'area-electrica-1.jpg',
                                items: [
                                  'Estudio de Energía Incidente.',
                                  'Estudios de Cortocircuito.',
                                  'Estudio de Coordinación de Protecciones.',
                                  'Revisión y Modelamiento de Mallas de Puesta a Tierra.',
                                  'Asistencia PEM y Comisionamiento.'
                                ]
                              },
                              {
                                title: 'CIVIL Y ESTRUCTURAL',
                                description: 'Servicios integrales en evaluación, diseño y gestión de obras civiles y estructurales.',
                                image: 'civil-estructural.jpg',
                                items: [
                                  'Ingeniería de Contraparte.',
                                  'Evaluación de Obras Civiles.',
                                  'Levantamientos de Planta.',
                                  'Planos de Layout.',
                                  'Diseños Estructural.',
                                  'Management Industrial.',
                                  'Cubicación de Materiales.',
                                  'Estimación Presupuestaria.'
                                ]
                              }
                            ]
                            : index === 1
                              ? [
                                {
                                  title: 'DISEÑO Y REVISIÓN SISTEMAS DE CONTROL',
                                  description: 'Diseño e integración de redes de comunicación industrial.',
                                  image: 'sistema-control.jpg',
                                  items: ['Ethernet.', 'Devicenet.', 'Controlnet.', 'Profibus.', 'Modbus.']
                                },
                                {
                                  title: 'PROGRAMACIÓN SISTEMA DE CONTROL',
                                  description: 'Programación de PLC y sistemas SCADA avanzados.',
                                  image: 'programacion-21.jpg',
                                  items: ['Rockwell.', 'Siemens.', 'Schneider Electric.', 'Integración de Sistemas OT(Tecnologías Operativas).', ' Integración de Sistemas IT(Tecnologías de la Información).']
                                }
                              ]
                              : index === 2
                                ? [
                                  {
                                    title: 'GESTIÓN DE PROYECTOS',
                                    description: 'Asesoría en la gestión de proyectos basado en la buenas prácticas y recomendaciones del PMI®.',
                                    image: 'gestion-proyectos.jpg',
                                    items: [
                                      'Gestión de Stakeholder.',
                                      'Gestión de Comunicaciones.',
                                      'Gestión de Riesgos.',
                                      'Gestión del Alcance, Costo, Cronograma, etc.'
                                    ]
                                  },
                                  {
                                    title: 'EVALUACIÓN DE PROYECTOS',
                                    description: 'Modelación financiera, flujo de caja, capital de trabajo, índices de servicio y cobertura de la deuda.',
                                    image: 'evaluacion-proyectos.jpg',
                                    items: [
                                      'Análisis de Sensibilidad.',
                                      'Análisis de Riesgo @Risk.',
                                      'Auditoría de Proyectos y Análisis Expost.'
                                    ]
                                  },
                                ]
                                : [
                                  {
                                    title: 'ESPECIALIDAD ELÉCTRICA',
                                    description: 'Diseño y desarrollo de soluciones normativas y técnicas en sistemas eléctricos.',
                                    image: 'modificaciones-industriales.jpg',
                                    items: [
                                      'Especificaciones Técnicas Generales.',
                                      'Planos Eléctricos de Fuerza y Control.',
                                      'Memorias de Cálculo.',
                                      'Asesoría en Cumplimientos Normativos.',
                                      'Diseño y Desarrollo Sistemas SCADA.',
                                      'Estudio de Calidad de la Energía.',
                                      'Revisión Normativa Chilena de servicios de distribución (Comisión nacional de Energía).',
                                      'Estándar IEC 610000-4-30:2016.',
                                      'Desarrollo de Planes de Seguridad Eléctrica.',
                                      'Servicios Eléctricos.',
                                      'Variadores de Frecuencia.',
                                      'Relés de Protección.',
                                      'Medidores y Analizadores de Energía.'
                                    ]
                                  },
                                  {
                                    title: 'ELÉCTRICOS',
                                    description: 'Servicios eléctricos especializados para instalaciones industriales.',
                                    image: '4-Electricos.jpg',
                                    items: [
                                      'Estudio de Energía Incidente.',
                                      'Estudios de Cortocircuito.',
                                      'Estudio de Coordinación de Protecciones.',
                                      'Revisión y Modelamiento de Mallas de Puesta a Tierra.',
                                      'Asistencia PEM y Comisionamiento.'
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
      </Box>
    </Container >
  );
};

export default Servicios;
