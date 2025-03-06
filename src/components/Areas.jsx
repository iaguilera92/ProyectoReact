import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import "@fontsource/poppins";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const data = [
  { count: 20, text: "Proyectos terminados en distintos rubros y empresas" },
  { count: 45, text: "Proyectos a Pymes e Independientes" },
  { count: 6, text: "Años de Experiencia como desarrolladores" },
  { count: 8, text: "Tazas de café en el día" },
];

const Areas = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const { ref: imgRef, inView: imgInView } = useInView({ triggerOnce: true });

  return (
    <Box
      sx={{
        backgroundImage:
          "url(https://dsmsolutions.cl/wp-content/uploads/2023/08/integraciones_dsmsolutions.webp)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        padding: { xs: 4, md: 8 },
        color: "white",
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* Sección de contadores */}
        <Grid item xs={12} md={6} ref={ref}>
          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  whileHover={{
                    rotate: 15, // Rota a la derecha cuando el mouse pasa por encima
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      backgroundColor: "var(--darkreader-background-ffffff, #181a1b)",
                      color: "white",
                      padding: 3,
                      borderRadius: 2,
                      height: "150px", // Asegurar tamaño uniforme
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      fontFamily: "'Poppins', sans-serif", // Mantener el fontFamily
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Typography variant="h3" component="h1" gutterBottom>
                      +<CountUp start={0} end={inView ? item.count : 0} duration={3} />
                    </Typography>
                    {/* Texto con animación palabra por palabra */}
                    <motion.div
                      initial={{ x: "100%" }} // Comienza fuera de la vista (a la derecha)
                      animate={{
                        x: inView ? 0 : "100%", // Se mueve a su posición original cuando entra en vista
                      }}
                      transition={{
                        duration: 1, // Duración de la animación
                        ease: "easeOut", // Suavizado de la animación
                      }}
                    >
                      {/* Aquí se separan las palabras */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "center",
                          fontFamily: "'Poppins', sans-serif", // Mantener el fontFamily
                        }}
                      >
                        {item.text.split(" ").map((word, wordIndex) => (
                          <motion.span
                            key={wordIndex}
                            initial={{ opacity: 0, x: "100%" }} // Empieza desde la derecha y invisible
                            animate={{
                              opacity: inView ? 1 : 0, // Se hace visible cuando entra en vista
                              x: inView ? 0 : "100%", // Se mueve a su posición original
                            }}
                            transition={{
                              duration: 0.5,
                              delay: wordIndex * 0.2, // Cada palabra aparece con un retraso secuencial
                              ease: "easeOut",
                            }}
                            style={{
                              marginRight: "5px", // Espacio entre las palabras reducido
                            }}
                          >
                            {word}{" "}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sección de imagen animada */}
        <Grid item xs={12} md={6} display="flex" justifyContent="center" ref={imgRef}>
          <motion.img
            src="https://www.connectic.cl/wp-content/uploads/2024/07/Daco_5762223-400x316.png"
            alt="Daco_5762223"
            width={400}
            height={316}
            initial={{ opacity: 0, y: -50 }}  // Imagen comienza fuera de vista (arriba)
            animate={{
              opacity: imgInView ? 1 : 0,  // Se vuelve visible cuando está en vista
              y: imgInView ? ["0px", "-10px", "0px"] : "-50px", // Efecto de boteo solo cuando está en vista
            }}
            transition={{
              opacity: { duration: 1, ease: "easeOut" }, // Transición de opacidad
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" }, // Efecto de boteo infinito
            }}
            style={{ position: "relative" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Areas;
