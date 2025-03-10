import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@mui/material";
import "@fontsource/poppins";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

// Añadimos la propiedad 'image' a cada item
const data = [
  {
    count: 20,
    text: "Proyectos terminados en distintos rubros y empresas",
    image:
      "https://www.aycelaborytax.com/wp-content/uploads/2020/12/fusion-empresas.jpeg",
  },
  {
    count: 45,
    text: "Proyectos a Pymes e Independientes",
    image:
      "https://www.portafolio.co/files/article_new_multimedia/uploads/2017/06/12/593f19f4bdbc5.jpeg",
  },
  {
    count: 6,
    text: "Años de Experiencia como desarrolladores",
    image:
      "https://itahora.com/wp-content/uploads/2024/02/UX.jpg",
  },
  {
    count: 8,
    text: "Tazas de café en el día",
    image:
      "https://www.viadurini.es/data/prod/img/servizio-18-tazze-da-caffe-the-con-zuccheriera-e-vassoio-in-porcellana-lucerna-1.jpg",
  },
];

const Areas = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { ref: imgRef, inView: imgInView } = useInView({ triggerOnce: true });

  // Estado para manejar el retraso en la aparición del contador y el texto
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    // Solo se activa el retraso cuando el item está en vista
    if (inView) {
      const timer = setTimeout(() => {
        setDelayed(true);
      }, 800); // 0.8 segundos de retraso
      return () => clearTimeout(timer); // Limpiamos el timer cuando el componente se desmonta o cambia el estado
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

  return (
    <Box
  sx={{
    backgroundImage:
      "url(https://www.nextibs.com/wp-content/uploads/2021/12/seguridad-informatica-scaled.jpeg)",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundSize: "cover",
    padding: { xs: 4, md: 8 },
    paddingBottom: { xs: 0, md: 8 }, // Menos paddingBottom en teléfonos
    color: "white",
  }}
>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
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
                    perspective: "1000px", // Añadido para el efecto 3D
                    cursor: "pointer",
                    position: "relative", // Asegura que el contenido se posicione dentro del Box
                  }}
                  ref={ref} // El ref está aquí para controlar la visibilidad
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
                      transition: "transform 0.6s",
                      transitionDelay: inView ? "0.8s" : "0s", // Retraso de 0.8 segundos cuando entra en vista
                      transform: inView ? "rotateY(180deg)" : "rotateY(0deg)", // Rota el contenido cuando está en vista
                      position: "relative",
                    }}
                  >
                    {/* Cara trasera: Información */}
                    <Box
                      sx={{
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        backgroundColor: "rgba(24, 26, 27, 0.9)",
                        borderRadius: 2,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                        zIndex: 2, // Asegura que el contenido esté por encima de la imagen
                        transform: "rotateY(180deg)", // La información está en la parte trasera inicialmente
                      }}
                    >
                      {/* Contador con retraso de 0.8 segundos */}
                      <Typography variant="h3" gutterBottom>
                        +{delayed ? (
                          <CountUp start={0} end={item.count} duration={3} />
                        ) : (
                          "0"
                        )}
                      </Typography>

                      {/* Texto con retraso de 0.8 segundos y animación palabra por palabra */}
                      <div style={{ display: "inline-block", paddingRight: "10px", paddingLeft:"10px" }}>
                        {splitTextIntoWords(item.text)}
                      </div>
                    </Box>

                    {/* Cara delantera: Imagen */}
                    <Box
                      sx={{
                        position: "absolute",
                        backfaceVisibility: "hidden",
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${item.image})`, // Usamos la imagen del item
                        backgroundSize: "cover", // Hace que la imagen ocupe todo el espacio
                        backgroundPosition: "center",
                        borderRadius: 2,
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Imagen animada a la derecha */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center" ref={imgRef}>
          <motion.img
            src="https://www.connectic.cl/wp-content/uploads/2024/07/Daco_5762223-400x316.png"
            alt="Daco_5762223"
            width={450}
            height={336}
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: imgInView ? 1 : 0,
              y: imgInView ? [0, -10, 0] : -50,
            }}
            transition={{
              opacity: { duration: 1, ease: "easeOut" },
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ position: "relative" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Areas;
