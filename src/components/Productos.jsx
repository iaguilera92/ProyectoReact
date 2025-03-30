import React, { useRef, useEffect } from 'react';
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const Productos = ({ producto, girado, onGirar, FormatearPesos, onVisualizarMobile }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const botonWhatsappRef = useRef(null);

  useEffect(() => {
    if (girado && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reinicia claramente el video al inicio
      videoRef.current.play();          // Reproduce claramente el video
    }
  }, [girado]);

  const handleFullScreen = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (videoRef.current) {
      const video = videoRef.current;

      if (isMobile) {
        // ✅ MÓVIL: Safari o Chrome
        if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen(); // Safari iOS
          video.currentTime = 0;
          video.play();
        } else if (video.requestFullscreen) {
          video.requestFullscreen();
          video.currentTime = 0;
          video.play();
        }
      } else if (containerRef.current) {
        // ✅ DESKTOP: usa tu código actual
        const container = containerRef.current;

        const afterFullscreen = () => {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          video.dispatchEvent(clickEvent);

          video.currentTime = 0;
          video.muted = true;
          const playPromise = video.play();

          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn('No se pudo reproducir el video:', error);
            });
          }

          document.removeEventListener('fullscreenchange', afterFullscreen);
          document.removeEventListener('webkitfullscreenchange', afterFullscreen);
        };

        document.addEventListener('fullscreenchange', afterFullscreen);
        document.addEventListener('webkitfullscreenchange', afterFullscreen);

        container.requestFullscreen?.() ||
          container.webkitRequestFullscreen?.() ||
          container.mozRequestFullScreen?.() ||
          container.msRequestFullscreen?.();
      }
    }
  };


  useEffect(() => {
    const contenedor = containerRef.current;
    const botonWhatsapp = botonWhatsappRef.current;

    const mostrarBoton = () => {
      if (botonWhatsapp) botonWhatsapp.style.display = 'block';
    };
    const ocultarBoton = () => {
      if (botonWhatsapp) botonWhatsapp.style.display = 'none';
    };

    const fullscreenChangeHandler = () => {
      if (
        document.fullscreenElement === contenedor ||
        document.webkitFullscreenElement === contenedor
      ) {
        mostrarBoton();
      } else {
        ocultarBoton();
      }
    };

    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler);

    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
      document.removeEventListener('webkitfullscreenchange', fullscreenChangeHandler);
    };
  }, [producto.IdProducto]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    if (girado) {
      video.currentTime = 0;
      setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => console.warn("Error al reproducir:", err));
        }
      }, 100);
    } else {
      video.pause();
    }
  }, [girado]);



  return (
    <Box
      className="productos-card"
      sx={{
        width: '100%',
        height: { xs: 300, sm: 260 }, // Ajustado
        mx: 'auto',
        position: 'relative',
      }}
    >
      <Box
        onClick={onGirar}
        sx={{
          width: '100%',
          height: '100%',
          perspective: 1200,
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        {/* Stock badge */}
        {/* <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: -11,
            zIndex: 99,
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor:
              producto.Stock >= 10
                ? '#4CAF50'
                : producto.Stock > 0
                  ? '#FFA000'
                  : '#F44336',
            color: 'white',
            fontWeight: 'bold',
            fontSize: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
            border: '2px solid white'
          }}
        >
          {producto.Stock}
        </Box>*/}

        <motion.div
          animate={{ rotateY: girado ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            willChange: 'transform',
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Cara frontal */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden', // Safari fix
              zIndex: 2, // Asegura que esté sobre la trasera cuando se ve
              transform: 'rotateY(0deg)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 4,
              border: '2px solid white',
            }}
          >
            <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box
                component="img"
                loading="lazy"
                src={producto.ImageUrl}
                alt={producto.NombreProducto}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.6)',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
              {/* Botones claramente visibles aquí abajo */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                  p: 1.5,
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  pointerEvents: girado ? 'none' : 'auto'
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>

                  {/* Botón Visualizar (izquierda) */}
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#FFFFFF',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: '#FFFFFF'
                      },
                      fontSize: '0.75rem',
                      borderRadius: '10px',
                      py: 0.5,
                      flex: '1'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                      if (isMobile) {
                        onVisualizarMobile(producto); // <- asegúrate que se ejecuta
                      } else {
                        handleFullScreen();
                      }
                    }}
                  >
                    Visualizar
                  </Button>


                  {/* Precio (con o sin descuento) */}
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                      minHeight: '32px',
                      overflow: 'hidden',
                      minWidth: '80px', // 💡 nuevo: mejora visibilidad
                    }}
                  >
                    <Typography
                      fontWeight="bold"
                      sx={{
                        fontFamily: '"RC Type Cond", Arial, sans-serif',
                        fontSize: { xs: '1.2rem', sm: '1rem' },
                        color: producto.ConDescuento ? '#00e676' : '#FFFFFF',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 20)', // contraste suav
                        letterSpacing: 0.5,
                        lineHeight: 1.2,
                        textAlign: 'center',
                      }}
                    >
                      {FormatearPesos(producto.Valor)}
                    </Typography>

                    {producto.ConDescuento && (
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          color: '#ccc',
                          textDecoration: 'line-through',
                          lineHeight: 1,
                          mt: 0,
                          textAlign: 'center',
                        }}
                      >
                        {FormatearPesos(producto.Valor + 10000)}
                      </Typography>
                    )}
                  </Box>



                  {/* Botón Solicitar (derecha) */}
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#FFFFFF',
                      color: '#222222',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#f0f0f0' },
                      fontSize: '0.75rem',
                      borderRadius: '10px',
                      py: 0.5,
                      flex: '1'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const mensaje = `Me interesó el ${producto.NombreProducto}, ¿sigue disponible?`;
                      const telefono = '56992914526';
                      const urlWhatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
                      window.open(urlWhatsapp, '_blank');
                    }}
                  >
                    Solicitar
                  </Button>
                </Stack>




              </Box>
            </Card>
          </Box>


          {/* Cara trasera */}
          <Box
            ref={containerRef}
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              zIndex: 1,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 4,
              border: '2px solid white',
            }}
          >

            <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
              {girado && (
                <Box
                  component="video"
                  ref={videoRef}
                  className="swiper-lazy"
                  src={producto.VideoUrl}
                  poster={producto.ImageUrl}
                  muted
                  playsInline
                  preload="metadata"
                  decode="async"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 60%', // 💡 Esto asegura que el recorte comience desde arriba
                    backgroundColor: 'black',
                    borderRadius: 0,
                    zIndex: 2,
                  }}
                  onEnded={() => {
                    onGirar();
                  }}
                />

              )}
              {/* Botón "Me interesa!" siempre visible en fullscreen */}
              <Button
                ref={botonWhatsappRef}
                variant="contained"
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: '#25D366',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: '20px',
                  px: 3,
                  py: 1,
                  zIndex: 9999,
                  display: 'none', // ← lo controlamos desde el fullscreen listener
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
                  '@media (max-width: 600px)': {
                    fontSize: '0.95rem',
                    px: 2,
                    py: 0.8,
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const mensaje = `Me interesó el ${producto.NombreProducto}, ¿sigue disponible?`;
                  const telefono = '56992914526';
                  const urlWhatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
                  window.open(urlWhatsapp, '_blank');
                }}
              >
                Me interesa!
              </Button>


            </Card>
          </Box>

        </motion.div>
      </Box >
    </Box >
  );
};

export default Productos;
