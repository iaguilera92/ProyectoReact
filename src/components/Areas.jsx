import React, { useState, useEffect, useRef } from "react";
import { Grid, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import "@fontsource/poppins";
import CountUp from "react-countup";
import { styled, keyframes } from "@mui/system";
import { useInView } from "react-intersection-observer";
import { motion, useAnimation } from "framer-motion";

const data = [
  { count: 20, text: "Proyectos terminados en distintas empresas", image: "ProyectoTerminado.mp4" },
  { count: 45, text: "Proyectos a Pymes e Independientes", image: "ProyectoPymes.mp4" },
  { count: 9, text: "Años de Experiencia como desarrolladores", image: "Experience.mp4" },
  { count: 7, text: "Tazas de café en el día ☕", image: "Cafe.mp4" },
];

const letterVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.4 + i * 0.04 }, // puedes ajustar el tiempo
  }),
};
const textoAnimado = "Tecnología que integramos";

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
`;
const GreenDot = styled("div")(() => ({
  position: "relative",
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  top: -1,
  backgroundColor: "#00e676",
  boxShadow: "0 0 8px rgba(0,255,0,0.5)",
  marginRight: "10px",
  flexShrink: 0,
  "&::after": {
    content: '""',
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#00e676",
    opacity: 0.6,
    transform: "scale(1)",
    animation: `${pulse} 1.4s ease-out infinite`,
  },
}));

function OrbitSystem({ isMobile, orbitInViewRef, orbitInView, controls }) {

  // --- Tamaños base ---
  const S = isMobile
    ? { xl: 150, md: 90, sm: 70 }
    : { xl: 170, md: 100, sm: 80 };

  // Orbitantes intercalados
  const orbit = [
    { idx: 0, size: S.md },
    { idx: 1, size: S.sm },
    { idx: 2, size: S.md },
    { idx: 3, size: S.sm },
    { idx: 4, size: S.md },
    { idx: 5, size: S.sm },
    { idx: 6, size: S.md },
    { idx: 7, size: S.sm },
  ];

  const hoverFactor = 1.05;
  const padTangential = 5;
  const padRadial = 6;
  const rCenterEff = (S.xl / 2) * hoverFactor;
  const rEff = orbit.map(o => (o.size / 2) * hoverFactor + padTangential);
  const step = (2 * Math.PI) / orbit.length;
  const halfStepSin = Math.sin(step / 2);

  let minFromNeighbors = 0;
  for (let i = 0; i < rEff.length; i++) {
    const a = rEff[i];
    const b = rEff[(i + 1) % rEff.length];
    minFromNeighbors = Math.max(minFromNeighbors, (a + b) / (2 * halfStepSin));
  }
  const minFromCenter = rCenterEff + Math.max(...rEff) + padRadial;
  const Rring = Math.ceil(Math.max(minFromNeighbors, minFromCenter));

  let theta = -Math.PI / 2;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const layout = orbit.map(o => {
    const node = { idx: o.idx, size: o.size, ring: 1, deg: toDeg(theta) };
    theta += step;
    return node;
  });

  const R = { 0: 0, 1: Rring };

  const imgs = [
    "logos-productos/aws.png",
    "logos-productos/SSL.png",
    "logos-productos/google-ads.jpg",
    "logos-productos/webpay.png",
    "logos-productos/google-analytics.png",
    "logos-productos/SEO.png",
    "logos-productos/SQL.png",
    "logos-productos/correos.png",
    "logos-productos/hosting.jpg", // central
  ];

  return (
    <>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
          mb: -1.2,
          ml: isMobile ? 5 : 6,
        }}
      >
        {/* 💚 Animación del GreenDot controlada por orbitInView */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={
            orbitInView
              ? { scale: 1, opacity: 1 }
              : { scale: 0, opacity: 0 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <GreenDot />
        </motion.div>

        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontSize: { xs: "1.2rem", md: "1.8rem" },
            letterSpacing: "0.5px",
            color: "white",
            display: "inline-flex",
            flexWrap: "wrap",
            overflow: "hidden",
          }}
        >
          {textoAnimado.split("").map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate={orbitInView ? "visible" : "hidden"}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {char}
            </motion.span>
          ))}
        </Typography>
      </Box>


      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          mt: -0.5,
        }}
      >
        <motion.div
          ref={orbitInViewRef}
          animate={controls}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: `${isMobile ? "63%" : "59%"} ${isMobile ? "59%" : "54%"}`,
          }}
        >
          {layout.map((n, i) => {
            const rad = (n.deg * Math.PI) / 180;
            let x = R[n.ring] * Math.cos(rad);
            const y = R[n.ring] * Math.sin(rad);

            if ([1, 3].includes(i)) {
              x += 13;
            }
            return (
              <Box
                key={i}
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -4, 0],
                  transition: {
                    duration: 0.6,
                    ease: "easeOut",
                    delay: 0.08 + i * 0.06,
                    y: {
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  },
                }}
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 18px rgba(255,255,255,0.35)",
                  zIndex: 4,
                }}
                sx={{
                  position: "absolute",
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: "translate(-50%, -50%)",
                  width: n.size,
                  height: n.size,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                  p: "4px",
                  zIndex: 2,
                }}
              >
                <Box
                  component="img"
                  src={imgs[n.idx]}
                  alt={`Orbita ${i + 1}`}
                  sx={{
                    background: "white",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "contain",
                    border: "2px solid black",
                  }}
                />
              </Box>
            );
          })}
        </motion.div>

        {/* --- CENTRO --- */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${isMobile ? "13%" : "10%"}, ${isMobile ? "13%" : "13%"
              })`,
            zIndex: 3,
          }}
        >
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -4, 0],
              transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.08,
                y: {
                  duration: 3.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              },
            }}
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 18px rgba(255,255,255,0.35)",
              zIndex: 4,
            }}
            sx={{
              position: "relative", // 🔥 Necesario para posicionar el pseudo-elemento
              width: S.xl,
              height: S.xl,
              borderRadius: "50%",
              background:
                "linear-gradient(45deg, #4f5bd5, #962fbf, #d62976, #fa7e1e, #feda75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 30px rgba(255,255,255,0.5)",
              p: "4px",
              overflow: "hidden", // evita que el brillo se salga
              // ✨ Brillo diagonal
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                transform: "translateX(-100%)",
                animation: "shineDiagonal 4s ease-in-out infinite",
                borderRadius: "inherit",
                pointerEvents: "none",
                zIndex: 1,
              },
              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(-100%)" },
                "50%": { transform: "translateX(100%)" },
                "100%": { transform: "translateX(100%)" },
              },
            }}
          >
            <Box
              component="img"
              src={imgs[8]}
              alt="Centro"
              sx={{
                background: "white",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "contain",
                border: "3px solid black",
                zIndex: 2, // 👈 para que quede sobre el pseudo-elemento
              }}
            />
          </Box>

        </Box>
      </Box >
    </>
  );
}


const Areas = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [delayed, setDelayed] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.15, triggerOnce: false, });
  const [scrollY, setScrollY] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const videosRef = useRef([]);
  const { ref: refGrid, inView: inViewGrid } = useInView({ threshold: 0.25, triggerOnce: false });
  const [hasEntered, setHasEntered] = useState(false);
  const controls = useAnimation();
  const { ref: orbitInViewRef, inView: orbitInView } = useInView({ threshold: 0.25, triggerOnce: false, });


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

  useEffect(() => {
    if (inViewGrid && !hasEntered) {
      setHasEntered(true);
    }
  }, [inViewGrid, hasEntered]);

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
    if (isMobile) {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isMobile]);

  useEffect(() => {
    data.forEach((_, index) => {
      if (inView && videosRef.current[index]) {
        videosRef.current[index].play().catch(() => { });
      }
    });
  }, [inView]);


  useEffect(() => {
    if (orbitInView) {
      // Reiniciamos la animación desde 0 grados para evitar que se dispare antes
      controls.set({ rotate: 0 });

      // Le damos un pequeño delay para que se vea al entrar
      const timer = setTimeout(() => {
        controls.start({
          rotate: [0, 360],
          transition: {
            duration: 3.8,
            ease: [0.33, 1, 0.68, 1],
          },
        });
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [orbitInView, controls]);

  return (

    <Box
      sx={{
        position: 'relative', // 👈 necesario para que el degradado se posicione correctamente
        backgroundImage: isMobile ? 'url(/fondo-areas2.webp)' : 'url(/fondo-areas1.webp)',
        backgroundRepeat: "no-repeat",
        backgroundSize: isMobile ? "100% 100%" : "100% auto",
        backgroundPosition: isMobile ? "center" : "",
        backgroundAttachment: isMobile ? "initial" : "fixed",
        minHeight: isMobile ? "85vh" : "auto",
        paddingTop: "10px !important",
        padding: { xs: 4, md: 16 },
        paddingBottom: { xs: 16, md: 5 },
        marginTop: "-100px",
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        pt={10}
      >
        {/* 🪐 Columna izquierda: OrbitSystem */}
        <Grid
          item
          xs={12}
          md={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          sx={{
            height: { xs: 500, md: 560 },
            overflow: "visible",
            order: { xs: 2, md: 1 }, // 👉 en móvil va abajo
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: isMobile ? 350 : 480,
              height: isMobile ? 360 : 420,
              left: { xs: "-13%", md: 0 },
              transition: "left 0.3s ease",
            }}
          >
            <OrbitSystem
              isMobile={isMobile}
              orbitInViewRef={orbitInViewRef}
              orbitInView={orbitInView}
              controls={controls}
            />
          </Box>
        </Grid>


        {/* 📊 Columna derecha: tarjetas de datos */}
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            order: { xs: 3, md: 3 },
          }}
        >
          <motion.div
            ref={refGrid}
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{
              opacity: inViewGrid ? 1 : 0,
              scale: inViewGrid ? 1 : 0.95,
              y: inViewGrid ? 0 : 40,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Grid container spacing={4}>
              {data.map((item, index) => (
                <Grid item xs={6} sm={6} md={6} key={index}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: hasEntered ? 1 : 0,
                      opacity: hasEntered ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: 0.1 * index,
                    }}
                  >
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
                      {/* Caja rotatoria */}
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
                          transform: inView || hasAnimated
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                          position: "relative",
                        }}
                      >
                        {/* Cara trasera */}
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
                          <Box
                            sx={{
                              minWidth: "100px",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="h3"
                              gutterBottom
                              sx={{
                                fontFamily: "'Saira', Sans-serif",
                                fontWeight: "700",
                                textAlign: "center",
                                mb: 0.5,
                                fontSize: isMobile ? "2.6rem" : "2.2rem",
                              }}
                            >
                              +{delayed ? (
                                <CountUp start={0} end={item.count} duration={3.1} />
                              ) : (
                                "0"
                              )}
                            </Typography>
                            <Box
                              sx={{
                                textAlign: "center",
                                maxWidth: isMobile ? "100%" : "90%",
                                fontSize: isMobile ? "0.93rem" : "1.1rem",
                                fontFamily: "'Oswald', sans-serif",
                              }}
                            >
                              {splitTextIntoWords(item.text)}
                            </Box>
                          </Box>
                        </Box>

                        {/* Cara delantera */}
                        <video
                          ref={(el) => (videosRef.current[index] = el)}
                          src={item.image}
                          muted
                          playsInline
                          style={{
                            position: "absolute",
                            backfaceVisibility: "hidden",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                          }}
                        />
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>
      </Grid>


      {
        !isMobile && (
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
        )
      }

    </Box >

  );
};

export default Areas;
