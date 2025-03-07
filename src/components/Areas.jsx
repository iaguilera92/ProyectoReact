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
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6} ref={ref}>
          <Grid container spacing={3}>
            {data.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  whileHover={{
                    rotate: 5,
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      backgroundColor: "rgba(24, 26, 27, 0.9)",
                      color: "white",
                      padding: 3,
                      borderRadius: 2,
                      width: "100%",
                      height: 150,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      fontFamily: "'Poppins', sans-serif",
                      transition: "all 0.3s ease-in-out",
                      cursor: "pointer"
                    }}
                  >
                    <Typography variant="h3" gutterBottom>
                      +<CountUp start={0} end={inView ? item.count : 0} duration={3} />
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: "90%" }}>
                      {item.text}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} display="flex" justifyContent="center" ref={imgRef}>
          <motion.img
            src="https://www.connectic.cl/wp-content/uploads/2024/07/Daco_5762223-400x316.png"
            alt="Daco_5762223"
            width={400}
            height={316}
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
