import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, IconButton, Typography, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
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
                      pt: isMobile ? 12 : 18, // 👈 Espacio superior interno ajustado
                      pb: 0,
                      minHeight: isMobile ? "110px" : "130px",
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
                              fontSize: isMobile ? "2.4rem" : "2.8rem",
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: "2px",
                              color: "#ffb905",
                              textShadow: "2px 2px 5px rgba(0,0,0,0.5)",
                              mt: isMobile ? 2.5 : -2,
                              mb: 0,
                            }}
                          >
                            {promo.title}
                          </Typography>
                          <Typography
                            variant="h1"
                            sx={{
                              fontWeight: 900,
                              fontSize: isMobile ? "1.8rem" : "2.3rem",
                              fontFamily: "'Anton', sans-serif",
                              letterSpacing: "1.1px",
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
                              mt: 0.5
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
                              py: 2,
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
                                minWidth: isMobile ? "130px" : "150px",
                                textAlign: "center",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "black",
                                  fontWeight: 600,
                                  fontSize: isMobile ? "0.59rem" : "0.8rem",
                                  fontFamily: "'Poppins', sans-serif",
                                  transform: "skewX(12deg)",
                                  mr: 3,
                                }}
                              >
                                PRECIO DESARROLLO
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
                                  <Typography
                                    variant="h3"
                                    sx={{
                                      color: "#ccc",
                                      fontWeight: "bold",
                                      fontSize: isMobile ? "1.9rem" : "2.2rem",
                                      fontFamily: "'Anton', sans-serif",
                                      letterSpacing: "1px",
                                      transform: "skewX(12deg)",
                                      textAlign: "center",
                                      mb: 0,
                                      mr: 1.8,
                                      textDecoration: "line-through",
                                    }}
                                  >
                                    $200.000
                                  </Typography>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="promo"
                                  initial={{ opacity: 0, x: 80 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -80 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Typography
                                    variant="h3"
                                    sx={{
                                      color: "#ffb905",
                                      fontWeight: "bold",
                                      fontSize: isMobile ? "1.9rem" : "2.2rem",
                                      fontFamily: "'Anton', sans-serif",
                                      letterSpacing: "1px",
                                      transform: "skewX(12deg)",
                                      textAlign: "center",
                                      mb: 0,
                                      mr: 1.8
                                    }}
                                  >
                                    {promo.price}
                                  </Typography>
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
                          mt: isMobile ? 4 : 0,
                          mb: 1,
                          background: "linear-gradient(180deg, #1E1EBA 0%, #0075FF 100%)",
                          borderRadius: "12px",
                          px: 2,
                          py: isMobile ? 1.2 : 1.1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                          maxWidth: "290px",
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
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.85rem", // 👈 más grande
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                            }}
                          >
                            {promo.extraPrices?.[0]?.label || "DOMINIO .CL"}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.4rem", // 👈 levemente más compacto
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
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
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "'Mukta', sans-serif",
                              fontWeight: 300,
                              fontSize: "0.85rem", // 👈 más grande
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "white",
                            }}
                          >
                            {promo.extraPrices?.[1]?.label || "HOSTING"}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: isMobile ? "1.3rem" : "1.4rem",
                              fontWeight: "bold",
                              color: "white",
                              lineHeight: 1,
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
                          maxWidth: "290px",
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
                          <RocketLaunchIcon sx={{ fontSize: "1.2rem", color: "white" }} />
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
                    <Box sx={{ width: isMobile ? "100%" : "80%", display: "flex", flexDirection: "column", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.2rem", textAlign: "left", color: promo.textColor || "white", mb: 1 }}>{promo.title}</Typography>
                      <Typography variant="body2" sx={{ textAlign: "left", fontSize: "0.9rem", color: "#ddd" }}>{promo.description}</Typography>
                    </Box>


                    <Box sx={{
                      width: isMobile ? "100%" : "80%", mt: 0.5,
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

                    <Box sx={{
                      width: "80%", mt: 6.8, display: "flex", height: "15%",
                      justifyContent: "space-between", gap: 2
                    }}>
                      {promo.extraPrices?.map(({ label, price }, idx) => (
                        <Box key={idx} sx={{
                          flex: 1,
                          border: "1px solid white",
                          borderRadius: "8px",
                          p: 1,
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          position: "relative"
                        }}>
                          <Box sx={{
                            position: "absolute",
                            top: 4,
                            right: 5,
                            fontSize: "0.49rem",
                            color: "#aaa",
                            fontWeight: 300,
                            lineHeight: 1,
                          }}>
                            Requerido
                          </Box>

                          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3 }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: "bold",
                                color: "white",
                                fontSize: "1.4rem",
                                lineHeight: 1.2,
                                mt: 1 // 🔽 Mueve el número más abajo
                              }}
                            >
                              {price || "-"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#ddd",
                                fontSize: "0.68rem",
                                lineHeight: 1.2
                              }}
                            >
                              {label}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ fontFamily: "'Inter', sans-serif", py: promo.price ? 1.3 : 1.5, px: 3, mb: 0.5, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "90px" }}>

                      <Box
                        component="button"
                        onClick={() => handleContactClick(promo.title)}
                        sx={{
                          backgroundColor: "#007de0",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          width: "100%",
                          py: 1,
                          fontWeight: "bold",
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            backgroundColor: "#005bb5",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 14px rgba(0,0,0,0.3)"
                          }
                        }}
                      >
                        Cotizar
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

            </Box>

          </SwiperSlide>
        ))}
      </Swiper>

      {showArrow && swiperInstance && (
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
      )}
    </Box>
  );
};

export default InformationsPromotions;
