import React, { useRef, useEffect } from 'react';
import { Box, Card, Typography, Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const Productos = ({ producto, girado, onGirar, FormatearPesos }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const botonWhatsappRef = useRef(null);

  useEffect(() => {
    if (girado && videoRef.current) {
      videoRef.current.currentTime = 0; // Reinicia claramente el video al inicio
      videoRef.current.play();          // Reproduce claramente el video
    }
  }, [girado]);

  const handleFullScreen = () => {
    if (containerRef.current && videoRef.current) {
      const container = containerRef.current;
      const video = videoRef.current;

      const afterFullscreen = () => {
        // Intenta simular una interacción real
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        video.dispatchEvent(clickEvent);

        video.currentTime = 0;
        video.muted = true; // ⚠️ debe estar silenciado para evitar bloqueos
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Reproducción exitosa
            })
            .catch((error) => {
              console.warn('No se pudo reproducir el video:', error);
            });
        }

        // Limpia el listener
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



  return (
    <Box
      className="productos-card"
      sx={{
        width: '100%',
        height: { xs: 420, sm: 320 },
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
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            right: -11,
            zIndex: 10,
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
        </Box>

        <motion.div
          animate={{ rotateY: girado ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Cara frontal */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 4,
              border: '2px solid white',
            }}
          >
            <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box
                component="img"
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
                      handleFullScreen();
                    }}
                  >
                    Visualizar
                  </Button>

                  {/* Precio claramente centrado */}
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{
                      fontFamily: '"RC Type Cond", Arial, sans-serif',
                      fontSize: { xs: '1.2rem', sm: '1rem' },
                      letterSpacing: 0.5,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      flex: '1'
                    }}
                  >
                    {FormatearPesos(producto.Valor)}
                  </Typography>

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
              transform: 'rotateY(180deg)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: 4,
              border: '2px solid white'
            }}
          >
            <Card sx={{ width: '100%', height: '100%', position: 'relative' }}>
              <Box
                component="video"
                ref={videoRef}
                src="/video-catalogo1.mp4"
                muted
                playsInline
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: girado ? 1 : 0,
                  pointerEvents: girado ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease',
                }}
                onEnded={() => {
                  onGirar();
                }}
              />

              {/* Botón "Me interesa!" siempre visible en fullscreen */}
              <Button
                ref={botonWhatsappRef}
                variant="contained"
                sx={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: '#25D366',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderRadius: '20px',
                  px: 2,
                  py: 1,
                  zIndex: 9999,
                  display: 'none', // inicialmente oculto
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
