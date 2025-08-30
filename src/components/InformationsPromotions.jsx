import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import MouseIcon from '@mui/icons-material/Mouse';
import 'swiper/css';

const InformationsPromotions = ({
  isMobile,
  promotions,
  swiperRef,
  showArrow,
  swiperInstance,
  setSwiperInstance,
  setShowArrow,
  handleContactClick,
  showPopularBadge,
}) => {

  const [showOriginalPriceId1, setShowOriginalPriceId1] = useState(true);


  useEffect(() => {
    if (showPopularBadge) {
      const timer = setTimeout(() => {
        setShowOriginalPriceId1(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopularBadge]);

  return (
    <Box
      ref={swiperRef}
      sx={{
        display: "block",
        position: "relative",
        px: 1,
        pt: 2,
        pb: 1,
        overflow: "hidden",
      }}
    >
      <Swiper
        style={{ overflow: "visible" }}
        spaceBetween={isMobile ? 12 : 20}
        slidesPerView="auto"
        onSwiper={setSwiperInstance}
        initialSlide={promotions.length - 1}
        centeredSlides={false}
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setShowArrow(swiper.activeIndex !== 2)}
      >
        {promotions.map((promo, index) => (
          <SwiperSlide
            key={index}
            style={{ width: isMobile ? '345px' : '430px' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >

              {promo.id === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={showPopularBadge ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    top: "-16px",
                    left: 8,
                    background: "linear-gradient(#f14c2e, #d8452e)",
                    color: "white",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    padding: "6px 16px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    height: "35px",
                    minWidth: "110px",
                    textAlign: "center",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: 6,
                    boxShadow: "0 0 12px 2px rgba(255, 105, 0, 0.6)", // Naranja brillante
                    border: "2px solid #ff6a00",
                  }}
                >
                  Popular
                </motion.div>
              )}


              {promo.id === 1 ? (
                <Box
                  sx={{
                    width: isMobile ? "350px" : "430px",
                    height: "420px",
                    py: isMobile ? 0 : 0,
                    mt: 1.4,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    position: "relative",
                    bgcolor: "#111827",
                    zIndex: 2,
                  }}
                >
                  {/* Fondo */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `url(${promo.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center %",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                      },
                    }}
                  />

                  {/* Contenido */}
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      display: "flex",
                      width: "100%",
                      flexDirection: "row",
                      px: 2,
                      pt: isMobile ? 10.5 : 16, // 👈 Espacio superior interno ajustado
                      pb: 0,
                      minHeight: isMobile ? "110px" : "105px",
                      alignItems: "flex-start", // sigue pegando arriba, pero con padding controlado
                      justifyContent: "space-between",
                    }}
                  >


                    {/* Texto Izquierdo */}
                    {showPopularBadge && (
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      >
                        <Box sx={{ flex: 1, textAlign: "left" }}>
                          <Typography
                            variant="h1"
                            sx={{
                              fontWeight: 900,
                              fontSize: isMobile ? "2.4rem" : "2.6rem",
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: "2px",
                              color: "#ffb905",
                              textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
                              mt: isMobile ? 2.0 : -2.5,
                              mb: 0,
                            }}
                          >
                            {promo.title}
                          </Typography>
                          <Typography
                            variant="h1"
                            sx={{
                              fontWeight: 900,
                              fontSize: isMobile ? "1.8rem" : "2.2rem",
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: isMobile ? "2.3px" : "1.5px",
                              color: "white",
                              textShadow: "2px 2px 5px rgba(0,0,0,0.6)",
                            }}
                          >
                            {promo.title2}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: isMobile ? "0.85rem" : "0.95rem",
                              fontWeight: 600,
                              color: "white",
                              fontFamily: "'Poppins', sans-serif",
                              letterSpacing: "0.5px",
                              textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
                              mt: 0.2
                            }}
                          >
                            LO QUE TU{" "}
                            <Box component="span" sx={{ textDecoration: "underline" }}>
                              EMPRENDIMIENTO
                            </Box>{" "}
                            NECESITA
                          </Typography>

                        </Box>
                      </motion.div>
                    )}

                    {showPopularBadge && (
                      <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} // leve delay
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            width: "100%",
                            maxWidth: "0px",
                            position: "relative",
                            mt: isMobile ? "30px" : "0px",
                          }}
                        >
                          {/* Bloque negro: $99.990 */}
                          <Box
                            sx={{
                              position: "relative",
                              transform: "skewX(-12deg)",
                              backgroundColor: "black",
                              px: 0,
                              py: 1.5,
                              boxShadow: "0 6px 15px rgba(0,0,0,0.35)",
                              width: isMobile ? "160px" : "200px",
                            }}
                          >
                            {/* Bloque blanco: PRECIO DESARROLLO */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: "-15px",
                                right: "0px",
                                backgroundColor: "white",
                                px: 1,
                                py: 0,
                                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                minWidth: isMobile ? "130px" : "170px",
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "black",
                                  fontWeight: 600,
                                  fontSize: isMobile ? "0.52rem" : "0.7rem",
                                  fontFamily: "'Poppins', sans-serif",
                                  transform: "skewX(12deg)",
                                  mr: 3.5
                                }}
                              >
                                DESARROLLO (2 CUOTAS)
                              </Typography>
                            </Box>

                            <AnimatePresence mode="wait">
                              {showOriginalPriceId1 ? (
                                <motion.div
                                  key="original"
                                  initial={{ opacity: 0, x: 0 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 80 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "flex-start", // 👈 Alineación superior para que el CLP baje visualmente
                                      transform: "skewX(12deg)",
                                      mr: 1.5,
                                      mt: 1
                                    }}
                                  >
                                    <Typography
                                      variant="h3"
                                      sx={{
                                        color: "#ccc",
                                        fontWeight: "bold",
                                        fontSize: isMobile ? "1.6rem" : "2rem",
                                        fontFamily: "'Anton', sans-serif",
                                        letterSpacing: "1px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      $120.000
                                    </Typography>

                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: isMobile ? "0.7rem" : "0.8rem",
                                        fontWeight: 600,
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#ccc",
                                        opacity: 0.9,
                                        ml: "0px",
                                        lineHeight: 1,
                                        position: "relative",
                                        top: isMobile ? "13px" : "18px",
                                        transform: "skewX(-12deg)",
                                      }}
                                    >
                                      CLP
                                    </Typography>
                                  </Box>
                                </motion.div>

                              ) : (
                                <motion.div
                                  key="promo"
                                  initial={{ opacity: 0, x: 80 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -80 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "flex-start", // 👈 asegura que el CLP se posicione bien hacia abajo
                                      transform: "skewX(12deg)",
                                      mr: 1.5,
                                      mt: 1
                                    }}
                                  >
                                    {/* PRECIO */}
                                    <Typography
                                      variant="h3"
                                      sx={{
                                        color: "#ffb905",
                                        fontWeight: "bold",
                                        fontSize: isMobile ? "1.6rem" : "2rem",
                                        fontFamily: "'Anton', sans-serif",
                                        letterSpacing: "1px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      {promo.price}
                                    </Typography>

                                    {/* CLP como subíndice visual */}
                                    <Typography
                                      component="span"
                                      sx={{
                                        fontSize: isMobile ? "0.7rem" : "0.8rem",
                                        fontWeight: 600,
                                        fontFamily: "'Poppins', sans-serif",
                                        color: "#ffb905",
                                        opacity: 0.9,
                                        ml: "0px",            // 👈 menos espacio horizontal
                                        lineHeight: 1,        // 👈 evita “aire” extra
                                        position: "relative",
                                        top: isMobile ? "13px" : "18px",           // 👈 apenas lo bajas
                                        transform: "skewX(-12deg)",
                                      }}
                                    >
                                      CLP
                                    </Typography>
                                  </Box>
                                </motion.div>

                              )}

                            </AnimatePresence>



                          </Box>
                        </Box>
                      </motion.div>
                    )}

                  </Box>



                  {showPopularBadge && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                      <Box
                        sx={{
                          mt: isMobile ? 3 : 0,
                          mb: 1,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 0.6 : 0.4,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "300px",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          zIndex: 3,
                          mx: "auto",
                          alignSelf: "center",
                          boxSizing: "border-box",
                          textAlign: "center"
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Mukta', sans-serif",
                            fontWeight: 700,
                            fontSize: isMobile ? "14px" : "16px",
                            textTransform: "uppercase",
                            lineHeight: 1.2
                          }}
                        >
                          <Box component="span" sx={{ color: "rgb(243, 210, 98)", fontWeight: 700 }}>
                            $30.000
                          </Box>{" "}
                          Y PARA FINALIZAR $60.000.<br />
                          ENTREGA EN MENOS DE <Box component="span" sx={{ color: "rgb(243, 210, 98)", fontWeight: 700 }}>
                            72HRS.
                          </Box>
                        </Typography>
                      </Box>
                    </motion.div>
                  )}


                  {showPopularBadge && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                      <Box
                        sx={{
                          mt: isMobile ? 0.6 : 0,
                          mb: 0.5,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 0.5 : 0.3,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "300px",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          zIndex: 3,
                          mx: "auto",
                          alignSelf: "center",
                          boxSizing: "border-box"

                        }}
                      >
                        {/* DOMINIO .CL */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              ELIGE TU DOMINIO .CL
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[0]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            ANUAL
                          </Typography>
                        </Box>


                        {/* Separador */}
                        <Box
                          sx={{
                            width: "1px",
                            height: isMobile ? "45px" : "55px", // 👈 también más compacto
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            mx: 1.5,
                          }}
                        />

                        {/* HOSTING */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              HOSTING + SOPORTE
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[1]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            MENSUAL
                          </Typography>
                        </Box>

                      </Box>
                    </motion.div>
                  )}


                  {/* Botón debajo */}
                  {showPopularBadge && (
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                      <Box
                        component="button"
                        onClick={() => handleContactClick(promo.title)}
                        sx={{
                          position: "relative",
                          zIndex: 2,
                          alignSelf: "center",
                          background: "linear-gradient(90deg, #f5d76e 0%, #e0a800 100%)",
                          border: "2px solid #e0a800",
                          boxShadow: "none",
                          "&:hover": {
                            background: "linear-gradient(90deg, #e0c060 0%, #c28e00 100%)",
                            transform: "scale(1.02)",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                          },
                          color: "white",
                          borderRadius: "10px",
                          width: "100%",
                          maxWidth: "300px",
                          px: 1,
                          py: 0.7,
                          fontWeight: "bold",
                          fontSize: isMobile ? "1rem" : "1.1rem",
                          letterSpacing: "0.5px",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          mt: 1,
                          mb: 1,
                          fontFamily: "'Montserrat', sans-serif",
                          boxSizing: "border-box"

                        }}
                      >
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                          <Box
                            component="img"
                            src="/clic.jpg"
                            alt="Ícono de clic"
                            sx={{
                              width: 20,
                              height: 20,
                              cursor: "pointer",
                              userSelect: "none",
                              filter: 'invert(1) brightness(2)',
                              ml: 1, // margen izquierdo si lo usas al lado de un texto
                              mt: 0.5, // ajusta si necesitas moverlo verticalmente
                              transition: "transform 0.2s ease-in-out",
                              "&:hover": {
                                transform: "scale(1.15)",
                              },
                            }}
                          />

                          <span>Solicitar DEMO Gratis</span>
                        </Stack>
                      </Box>
                    </motion.div>
                  )}

                </Box>



              ) : (

                <Box
                  sx={{
                    width: isMobile ? "350px" : "430px", // Igual que el slide principal
                    height: "420px",
                    py: isMobile ? 0 : 0,
                    mt: 1.4,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                    position: "relative",
                    bgcolor: "#111827", // Puedes personalizar si quieres otro fondo
                    zIndex: 2,
                  }}
                >

                  <Box sx={{
                    position: "absolute", inset: 0, backgroundImage: `url(${promo.image})`,
                    backgroundSize: "cover", backgroundPosition: "center 20%",
                    "&::after": { content: '""', position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.55)" }, zIndex: 0
                  }} />

                  <Box sx={{
                    position: "relative", zIndex: 2, p: 2, pt: 3, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "flex-start", flexGrow: 1
                  }}>
                    <Box
                      sx={{
                        width: isMobile ? "100%" : "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        mb: 3,
                      }}
                    >
                      {/* Título */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          fontSize: { xs: "1.2rem", md: "1.35rem" },
                          textAlign: "left",
                          color: promo.textColor || "#fff",
                          letterSpacing: "1.1px",
                          mb: 0,
                          position: "relative",
                          display: "inline-block",
                        }}
                      >
                        {promo.title}
                      </Typography>

                      {/* Descripción */}
                      <Typography
                        variant="body2"
                        sx={{
                          textAlign: "left",
                          fontSize: { xs: "0.85rem", md: "0.8rem" },
                          lineHeight: 1.6,
                          color: "#eee",
                          fontFamily: "'Roboto', sans-serif",
                          opacity: 0.9,
                        }}
                      >
                        {promo.description}
                      </Typography>
                    </Box>



                    <Box sx={{
                      width: isMobile ? "100%" : "80%", mt: 0,
                      display: "flex", flexDirection: "column", alignItems: "flex-start"
                    }}>
                      {promo.descriptors.map((desc, idx) => (
                        <Typography key={idx} variant="caption" sx={{
                          display: "flex", alignItems: "center", mb: 0.3,
                          fontSize: "0.8rem", color: "#eee"
                        }}>
                          <Box sx={{
                            width: 15, height: 15, bgcolor: "white", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center", mr: 0, flexShrink: 0
                          }}>
                            <CheckIcon sx={{ fontSize: 13, color: "black" }} />
                          </Box>&nbsp;{desc}
                        </Typography>
                      ))}
                    </Box>


                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                      <Box
                        sx={{
                          mt: isMobile ? 4.5 : 4.4,
                          mb: 0,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 0.5 : 0.8,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "310px",
                          maxWidth: "100%",
                          mx: "auto",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          zIndex: 3,
                          boxSizing: "border-box",
                          textAlign: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Mukta', sans-serif",
                            fontWeight: 700,
                            fontSize: isMobile ? "14px" : "15px",
                            textTransform: "none",
                            lineHeight: 1.1,
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          El valor será determinado por el negocio.
                          <br /> {/* 👈 fuerza segunda fila */}
                          <Box
                            component="span"
                            sx={{ color: "rgb(243, 210, 98)", fontWeight: "bold" }}
                          >
                            (Valor Estimado: {promo.price})
                          </Box>
                        </Typography>


                      </Box>

                    </motion.div>

                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                    >
                      <Box
                        sx={{
                          mt: isMobile ? 1.7 : 1,
                          mb: 0,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 0.5 : 0.3,
                          display: "flex",
                          flex: 1,
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "310px",
                          maxWidth: "100%",
                          color: "white",
                          boxShadow: "0 3px 12px rgba(0, 0, 0, 0.3)",
                          position: "relative",
                          zIndex: 3,
                          mx: "auto",
                          alignSelf: "center",
                          boxSizing: "border-box"

                        }}
                      >
                        {/* DOMINIO .CL */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              ELIGE TU DOMINIO .CL
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[0]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            ANUAL
                          </Typography>
                        </Box>


                        {/* Separador */}
                        <Box
                          sx={{
                            width: "1px",
                            height: isMobile ? "45px" : "55px", // 👈 también más compacto
                            backgroundColor: "rgba(255, 255, 255, 0.35)",
                            mx: 1.5,
                          }}
                        />

                        {/* HOSTING */}
                        <Box sx={{ textAlign: "center", flex: 1, mt: isMobile ? 1.2 : 0.8 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                              lineHeight: 1.1,
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box component="span" sx={{ display: "block", lineHeight: 1.1 }}>
                              HOSTING + SOPORTE
                            </Box>
                          </Typography>

                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.3rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
                              mt: 0.5,
                            }}
                          >
                            {promo.extraPrices?.[1]?.price || "$10.000"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              opacity: 0.85,
                              color: "white",
                              mt: 0.3,
                              fontFamily: "'Mukta', sans-serif",
                            }}
                          >
                            MENSUAL
                          </Typography>
                        </Box>

                      </Box>
                    </motion.div>


                    <Box sx={{ fontFamily: "'Inter', sans-serif", py: isMobile ? 0.7 : 0.2, px: 3, mb: 0.5, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50px" }}>

                      <Box
                        component="button"
                        onClick={() => handleContactClick(promo.title)}
                        sx={{
                          background: "linear-gradient(90deg, #FF9800, #F57C00)", // degradado naranja
                          color: "white",
                          border: "2px solid #E65100", // borde sólido más oscuro
                          borderRadius: "8px",
                          width: "100%",
                          maxWidth: "290px",
                          py: 1,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            background: "linear-gradient(90deg, #FFA726, #FB8C00)", // hover degradado
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                            borderColor: "#FB8C00", // en hover se aclara el borde
                          },
                        }}
                      >
                        Cotizar
                      </Box>

                    </Box>
                  </Box>
                </Box>
              )}

            </Box>

          </SwiperSlide >
        ))}
      </Swiper >

      {
        showArrow && swiperInstance && (
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "absolute", top: -4, right: 10, zIndex: 10 }}
          >
            <IconButton
              onClick={() => swiperInstance.slideNext()}
              sx={{
                color: "white",
                transition: "opacity 0.3s ease-in-out",
                backgroundColor: "transparent",
                boxShadow: "none",
                padding: 0,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              <ArrowForwardIcon fontSize="large" sx={{ fontSize: "23px" }} />
            </IconButton>
          </motion.div>
        )
      }
    </Box >
  );
};

export default InformationsPromotions;
