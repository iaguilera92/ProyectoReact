import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import "@fontsource/poppins";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const data = [
  { count: 20, text: "Proyectos terminados en distintas empresas", image: "ProyectoTerminado.mp4" },
  { count: 45, text: "Proyectos a Pymes e Independientes", image: "ProyectoPymes.mp4" },
  { count: 6, text: "Años de Experiencia como desarrolladores", image: "Experience.mp4" },
  { count: 8, text: "Tazas de café en el día ☕", image: "Cafe.mp4" },
];
const images = ["servicios.png", "computador.png"];

const Areas = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [delayed, setDelayed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: false, });
  const [rotationActive, setRotationActive] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  //EVITAR ANIMACIÓN DUPLICADA
  useEffect(() => {
    if (inView && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true); //
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [inView, hasAnimated]);

  useEffect(() => {
    // Solo se activa el retraso cuando el item está en vista
    if (inView) {
      const timer = setTimeout(() => {
        setDelayed(true);
      }, 1700); // ⏳ Ahora el contador se activa después de 1.2 segundos

      return () => clearTimeout(timer); // Limpia el temporizador al desmontarse
    }
  }, [inView]);

  // Función para dividir el texto en palabras
  const splitTextIntoWords = (text) => {
    return text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, x: "100%" }} // Empieza invisible y desde la derecha
        animate={{
          opacity: delayed ? 1 : 0,
          x: delayed ? 0 : "100%", // Aparece palabra por palabra
        }}
        transition={{
          delay: 0.2 + index * 0.2, // Retraso escalonado para cada palabra
          duration: 1,
          ease: "easeOut",
        }}
        style={{ display: "inline-block", marginRight: "5px" }} // Espaciado entre palabras
      >
        {word}
      </motion.span>
    ));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length); // Cambia la imagen cada vez
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);


  return (

    <Box
      sx={{
        position: 'relative', // 👈 necesario para que el degradado se posicione correctamente
        backgroundImage: isMobile ? 'url(/fondo-areas2.jpg)' : 'url(/fondo-areas1.webp)',
        backgroundRepeat: "no-repeat",
        backgroundSize: isMobile ? "100% 100%" : "100% auto",
        backgroundPosition: isMobile ? "center" : "",
        backgroundAttachment: isMobile ? "initial" : "fixed",
        minHeight: isMobile ? "85vh" : "auto",
        paddingTop: "30px !important",
        padding: { xs: 4, md: 16 },
        paddingBottom: { xs: 14, md: 12 },
        marginTop: "-120px",
      }}
    >
      <Grid container spacing={4} alignItems="center" pt={20}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            {data.map((item, index) => (
              <Grid item xs={6} sm={6} md={6} key={index}>
                <Box
                  sx={{
                    textAlign: "center",
                    color: "white",
                    borderRadius: 2,
                    width: "100%",
                    height: 150,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "'Poppins', sans-serif",
                    perspective: "1000px",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  ref={ref}
                >
                  {/* Caja para rotación 3D */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transformStyle: "preserve-3d",
                      transition: "transform 2.6s",
                      transitionDelay: inView ? "0.8s" : "0s",
                      transform: inView || hasAnimated ? "rotateY(180deg)" : "rotateY(0deg)",
                      position: "relative",
                    }}
                  >
                    {/* Cara trasera: Información */}
                    <Box
                      sx={{
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        width: isMobile ? "115%" : "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        backgroundColor: "rgba(24, 26, 27, 0.9)",
                        borderRadius: 2,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        zIndex: 2,
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {/* Contenedor fijo para evitar que se mueva el contador */}
                      <Box
                        sx={{
                          minWidth: "100px", // Asegura que el ancho no cambie
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* Contador con retraso de 0.8 segundos */}
                        <Typography
                          variant="h3"
                          gutterBottom
                          sx={{
                            fontFamily: "'Saira', Sans-serif",
                            fontWeight: "700",
                            minWidth: "80px",
                            textAlign: "center",
                            marginBottom: "0.15em",
                            fontSize: isMobile ? "2.6rem" : "2.2rem", // Aumentado el tamaño
                          }}
                        >
                          +{delayed ? <CountUp start={0} end={item.count} duration={3.1} /> : "0"}
                        </Typography>
                        <Box
                          sx={{
                            textAlign: "center",
                            maxWidth: isMobile ? "100%" : "90%",
                            fontSize: isMobile ? "0.93rem" : "1.1rem", // Reducir tamaño del texto en móviles
                            fontFamily: "'Oswald', sans-serif", // Fuente agregada
                          }}
                        >
                          {splitTextIntoWords(item.text)}
                        </Box>
                      </Box>
                    </Box>

                    {/* Cara delantera: Imagen */}
                    <Box
                      component="video"
                      src={item.image}
                      autoPlay
                      muted
                      playsInline
                      onEnded={(e) => {
                        e.target.pause(); // ✅ Detiene el video al finalizar
                      }}
                      sx={{
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 2,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)"
                      }}
                    />

                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <motion.div
            key={currentImage}
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: [0, 90, 180], // Gira hasta 180° y cambia la imagen en el proceso
              y: [0, -10, 0], // Flotación de arriba a abajo
            }}
            transition={{
              rotateY: { duration: 1.4, ease: "easeInOut" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }, // Mantiene la flotación constante
            }}
            onAnimationComplete={() => setTimeout(() => { setCurrentImage((prev) => (prev + 1) % images.length); }, 5000)} // Cambia la imagen después de 5 segundos
            style={{
              position: "relative",
              width: isMobile ? 420 : 450,
              height: isMobile ? 280 : 336,
              perspective: 1200, // Mantiene el efecto 3D
              transformStyle: 'preserve-3d', // Necesario para que las imágenes se giren correctamente
            }}
          >
            {/* Imagen visible antes del giro */}
            <motion.img
              key={`front-${currentImage}`}
              src={images[currentImage]}
              alt="Rotating Image"
              width={isMobile ? "100%" : "100%"}
              height={isMobile ? "100%" : "100%"}
              style={{
                position: "absolute",
                backfaceVisibility: "hidden", // Oculta la cara trasera de la imagen
                transform: 'rotateY(0deg)', // Asegura que la imagen frontal no se voltee
              }}
            />

            {/* Imagen visible después del giro */}
            <motion.img
              key={`back-${(currentImage + 1) % images.length}`}
              src={images[(currentImage + 1) % images.length]}
              alt="Next Rotating Image"
              width={isMobile ? "100%" : "100%"}
              height={isMobile ? "100%" : "100%"}
              initial={{ rotateY: 180, opacity: 1 }}
              style={{
                position: "absolute",
                transform: 'rotateY(180deg)', // Imagen trasera en la posición de 180 grados
                backfaceVisibility: "hidden", // Oculta la cara trasera de la imagen
              }}
            />
          </motion.div>
        </Grid>


      </Grid>
      {!isMobile && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '120px',
            background: 'linear-gradient(to bottom, transparent, white)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

    </Box >

  );
};

export default Areas;
