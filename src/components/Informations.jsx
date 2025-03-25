import { Box, Typography, Container, Grid, Button, ListItem, ListItemIcon, ListItemText,useMediaQuery,useTheme,IconButton  } from "@mui/material";
import { Chat, Insights, SmartToy, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInView } from 'react-intersection-observer';  // Importa el hook
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./css/Informations.css"; // Importamos el CSS
import "swiper/css";

const promotions = [
  {
    title: "Sitios web",
    description: "Diseño y desarrollo de sitios web modernos Y rápidos para todos los dispositivos.",
    image: "/Informations-1.jpg",
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))",
    textColor: "white",
  },
  {
    title: "Tienda online",
    description: "Tienda online, pagos seguros y seguimiento de pedidos. Compra rápido y sin complicaciones.",
    image: "/Informations-2.jpg",
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))",
    textColor: "white",
  },
  {
    title: "Sistemas a la medida",
    description: "Desarrollo de sistemas a la medida, eficientes, escalables y adaptados a tus necesidades.",
    image: "/Informations-3.jpg",
    bgColor: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.2))",
    textColor: "white",
  }
];


const Informations = () => {
 // Controla la vista del componente
 const [isGrabbing, setIsGrabbing] = useState(false);
 const { ref, inView } = useInView({
  threshold: 0.1, // Se activa cuando el 20% del componente es visible
  triggerOnce: true, // La animación ocurre solo una vez
});
const [shouldAnimate, setShouldAnimate] = useState(false);
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
const [showArrow, setShowArrow] = useState(true);

  useEffect(() => {
    if (inView) {
      setShouldAnimate(true); // 🔹 Activa la animación cuando el componente es visible
    }
  }, [inView]);


  return (
    <Box
    sx={{
      backgroundImage: 'url("https://blz-contentstack-images.akamaized.net/v3/assets/blta8f9a8e092360c6c/blt367ca4b27c88c078/Desktop_Blizz_Footer.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      py: 4,
      marginTop: "-100px",
      color: "white", 
      borderRadius: isMobile ? '90px 90px 0 0' : '120px 120px 0 0', // Valor general para otros navegadores
      overflow: 'hidden',  // Asegura que no se desborde el contenido
    }}
  >
    <Container sx={{ textAlign: "center", color: "white", maxWidth: "1400px !important", }}>
    
        <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
          
          <Box
      ref={ref} // 🔹 Conecta el detector de scroll
      sx={{
        width: 25,
        height: 25,
        borderRadius: "50%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid white",
        mx: "auto",
        mb: 0.5,
      }}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={shouldAnimate ? { rotate: 360 } : {}} // 🔹 Solo se activa cuando `shouldAnimate` es `true`
        transition={{
          duration: 0.8,
          delay: 0.3,
          repeat: 1, // Se repite una vez más (total: dos veces)
          ease: "linear", // Movimiento fluido
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <FaCode size={17} color="black" />
      </motion.div>
    </Box>

        <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
          fontSize: { xs: "1.5rem", md: "2rem" }, // Ajusta el tamaño de la fuente para móviles y pantallas grandes
          paddingLeft:{ xs: "100px", md: "30px" } ,
          paddingRight: { xs: "100px", md: "30px" },
          letterSpacing: "3px",
          my: 0,
          display: "inline-block",
          position: "relative",
          zIndex: 1,
          backgroundColor: "trasparent",
          color: "white",
          "::after": {
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-5px", // Ajusta la posición del bloque de fondo
            height: "10px", // Ajusta la altura del fondo extendido
            backgroundColor: "trasparent", // Mismo color del fondo del título
            zIndex: 2, // Se coloca por encima del `hr`
          },
        }}
      >
              Ayudanos hacer crecer tu negocio
            </Typography>

          {/* Línea debajo del título con animación (con retraso de 2 segundos) */}
          <motion.hr
          initial={{ opacity: 0 }} // Comienza invisible
          animate={shouldAnimate ? { opacity: 1 } : {}} // Aparece completamente
          transition={{ duration: 0.8, delay: 1 }} // Aparece después de 1s y dura 1s
          style={{
            position: "absolute",
            top: isMobile ? "calc(80% - 30px)" : "calc(100% - 30px)", // Ajusta la posición
            left: "5%",
            width: "90%", // Mantiene su tamaño desde el inicio
            border: "1px solid white",      
            zIndex: 0,
            background: "white",
            clipPath: "polygon(0% 0%, 0% 0%, 19% 100%, 0% 100%, 0% 0%, 100% 0%, 80% 100%, 100% 100%, 100% 0%)",
          }}
        />

        </Box>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          
  {/* Columna de los íconos */}
  <Grid item xs={12} md={6} ref={ref}>
    {[  
      {
        icon: <SmartToy sx={{ color: "white", fontSize: "2.2rem" }} />,
        text: "Automatización Inteligente",
        desc: "Optimiza procesos rutinarios con IA para liberar recursos valiosos.",
        hideLine: false,
      },
      {
        icon: <Insights sx={{ color: "white", fontSize: "2.2rem" }} />,
        text: "Análisis Predictivo",
        desc: "Anticipa el comportamiento de clientes y mejora tu oferta.",
        hideLine: false,
      },
      {
        icon: <Chat sx={{ color: "white", fontSize: "2.2rem" }} />,
        text: "Chatbots y Asistentes Virtuales",
        desc: "Responde 24/7 con chatbots inteligentes potenciados por Hey Now.",
        hideLine: false,
      },
      {
        icon: <Visibility sx={{ color: "white", fontSize: "2.2rem" }} />,
        text: "Visión por Computador",
        desc: "Utiliza reconocimiento de imágenes para mejorar seguridad y eficiencia.",
        hideLine: true,
      },
    ].map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 0 }}
        animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
        transition={{
          delay: 0.5 * index,
          duration: 1,
        }}
      >
        <ListItem sx={{ display: "flex", alignItems: "center", zIndex: 2 }}>
          <ListItemIcon sx={{ zIndex: 2 }}>
            <Box
              sx={{
                position: "relative",
                width: isMobile ? 100 : 100,
                height: isMobile ? 80 : 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: isMobile ? 70 : 70,
                  height: isMobile ? 70 : 70,
                  borderRadius: "50%",
                  border: "2px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#072138",
                  position: "relative",
                  zIndex: 2,
                  fontSize: "1.5rem"
                }}
              >
                {item.icon}
                <motion.div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    zIndex: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    scale: 0,
                    animation: "pulsacion 1s ease-in-out 0.1s infinite",
                  }}
                />
              </Box>
              {!item.hideLine && (
                <motion.div
                  className="vertical-line"
                  initial={{ height: "0%" }}
                  animate={{ height: "40%" }}
                  transition={{
                    delay: 0.5 * (index + 1),
                    duration: 1,
                    ease: [0.175, 0.885, 0.32, 1.275],
                  }}
                />
              )}
            </Box>
          </ListItemIcon>
          <ListItemText
            sx={{
              fontFamily: "'Montserrat', Helvetica, Arial, sans-serif !important",
              "& .MuiListItemText-primary": {
                fontSize: "1.2rem",
              },
              "& .MuiListItemText-secondary": {
                color: "white",
              },
            }}
            primary={item.text}
            secondary={item.desc}
          />
        </ListItem>
      </motion.div>
    ))}
  </Grid>

 {/* Columna de los descriptores */}
 <Grid item xs={12} md={6}>
 <Box sx={{ display: isMobile ? "block" : "block", position: "relative", px: 1, pt: 3, pb: 1.5  }}>
 <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        centeredSlides={false}
        initialSlide={0}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => {
          const index = swiper.activeIndex;
          setShowArrow(index !== 2); // Oculta en la tercera tarjeta
        }}
      >
        {promotions.map((promo, index) => (
          <SwiperSlide key={index}>       
            <Box
              sx={{
                width: "100%%",
                height: "360px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundImage: `url(${promo.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                color: "white",
                p: 0.5,
              }}
            >
            <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))",
        zIndex: 2
      }}
    />
           <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',                
                alignItems: 'center', // centra horizontalmente
                justifyContent: 'center', // centra verticalmente si el contenedor lo permite
                textAlign: 'center',
                mb: 2
              }}
              onPointerDown={() => setIsGrabbing(true)}
              onPointerUp={() => setIsGrabbing(false)}
              onPointerLeave={() => setIsGrabbing(false)}
            >
      {/* Contenido */}
      <Box sx={{ zIndex: 2, textAlign: "center", padding:0 }}>
        <Typography variant="h6" sx={{ mt: 4, fontWeight: "bold", fontSize: "20px", fontFamily: "inherit" }}>
          {promo.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              xs: '0.85rem',
              sm: '0.95rem'
            },
            maxWidth: 400,
            color: 'white'
          }}
        >
          {promo.description}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2, mt: 1, ml: 0 }}>
          {[
            'Primer descriptor producto.',
            'Segundo descriptor producto.',
            'Tercer descriptor producto.'
          ].map((text, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: 'black',
                  color: 'white',
                  fontSize: 10,
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 0.5
                }}
              >
                {index + 1}
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.82rem', color: 'white' }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>          
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {showArrow && (
  <motion.div
    animate={{
      x: [0, 5, 0], // Flota hacia la derecha y vuelve
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    style={{
      position: "absolute",
      top: -12,
      right: 10,
      zIndex: 10,
    }}
  >
    <IconButton
      sx={{
        color: "white",
        transition: "opacity 0.3s ease-in-out",
        backgroundColor: "transparent",
        boxShadow: "none",
        padding: 0,
        "&:hover": {
          backgroundColor: "transparent",
        },
      }}
    >
      <ArrowForwardIcon fontSize="large" sx={{ fontSize: "23px" }} />
    </IconButton>
  </motion.div>
)}
    </Box>
  </Grid>




</Grid>
  


      </Container>
    </Box>
  );
};

export default Informations;
