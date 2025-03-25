import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Productos = ({ producto, FormatearPesos, CalcularValorOld }) => {
  const [girado, setGirado] = useState(false);

  return (
<Box
  sx={{
    width: {
      xs: '100%',
      sm: 260,
      md: 280,
      lg: 300
    },
    mx: 'auto',
    position: 'relative'
  }}
>      {/* Contenedor giratorio */}
      <Box
        onClick={() => setGirado(!girado)}
        sx={{
          height: {
            xs: 290,
            sm: 310,
            md: 330, // 💻 más alto en escritorio
            lg: 360
          },
          perspective: 1200,
          position: 'relative',
          cursor: 'pointer'
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
              border: '2px solid white' // ✅ borde blanco
            }}
          >
            <Card
              sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                p: 0
              }}
            >
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
                  left: 0
                }}
              />
             <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              color: 'white',
              p: {
                xs: 1,
                sm: 1.5,
                md: 2
              },
              display: 'flex',
              alignItems: 'flex-start'
            }}
          >
            <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        sx={{
                          fontFamily: '"RC Type Cond", Arial, sans-serif',
                          color: 'white',         
                          borderRadius: 1,
                          px: 1,
                          fontSize: {
                            xs: '0.9rem',
                            sm: '1rem',
                            md: '1.1rem'
                          }
                        }}
                      >
                {producto.NombreProducto}
              </Typography>
            </Box>
            </Card>
          </Box>

          {/* Cara trasera con       */}
          <Box
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
           <Card
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
  {/* GIF fondo absoluto */}
  <Box
    component="img"
    src="online-shop.gif"
    alt="gif"
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 1
    }}
  />

  {/* Título encima del GIF */}
  <Box
  sx={{
    position: 'relative',
    zIndex: 2,
    height: '100%',
    color: 'white',
    p: {
      xs: 1,
      sm: 1.5,
      md: 2
    },
    display: 'flex',
    alignItems: 'flex-start'
  }}
>
    <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{
              fontFamily: '"RC Type Cond", Arial, sans-serif',
              color: 'white',
              borderRadius: 1,
              px: 1,
              fontSize: {
                xs: '0.9rem',
                sm: '1rem',
                md: '1.1rem'
              }
            }}
          >
      {producto.NombreProducto}
    </Typography>
  </Box>
</Card>

          </Box>
        </motion.div>
      </Box>

      {/* Precio y botón */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 1,
          mt: 1,
          mb: 3
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          {producto.ConDescuento && (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                top: -5,
                right: -15,
                transform: 'rotate(30deg)',
                bgcolor: 'black',
                color: 'grey.300',
                fontSize: '0.5rem',
                px: 0.5,
                py: 0.1,
                borderRadius: 1,
                textDecoration: 'line-through',
                zIndex: 5,
                boxShadow: '0px 2px 6px rgba(0,0,0,0.4)'
              }}
            >
              {CalcularValorOld(producto.Valor)}
            </Typography>
          )}

          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              bgcolor: producto.ConDescuento ? 'success.main' : 'black',
              color: 'white',
              px: 0.6,
              py: 0.1,
              borderRadius: 1,
              fontSize: '0.95rem',
              display: 'inline-block',
              position: 'relative'
            }}
          >
            {FormatearPesos(producto.Valor)}
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0, maxWidth: '50%' }}>
          <button
            type="button"
            className="knLqRt"
            style={{
              backgroundColor: '#E2001A',
              borderColor: '#E2001A',
              color: 'white',
              fontSize: '0.9rem',
              fontFamily: '"RC Type", Arial, sans-serif',
              fontWeight: 500,
              padding: '0.22rem 1rem',
              borderRadius: '2em',
              borderStyle: 'solid',
              borderWidth: '2px',
              lineHeight: 1.15,
              width: '100%',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            onClick={(e) => {
              e.preventDefault();
              const mensaje = `¡Hola!%20Me%20intereso%20el%20${encodeURIComponent(
                producto.NombreProducto
              )},%20¿sigue%20a%20la%20venta?`;
              window.open(
                `https://api.whatsapp.com/send?phone=56992914526&text=${mensaje}`,
                '_blank'
              );
            }}
          >
            Solicitar
            <span style={{ marginLeft: 3, display: 'inline-flex' }}>
              <svg
                viewBox="0 0 32 32"
                width="14"
                height="14"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.59 27a1 1 0 01-.66-.25 1 1 0 01-.1-1.41l7.49-8.58a1.23 1.23 0 000-1.52l-7.49-8.58a1 1 0 011.51-1.32l7.49 8.59a3.21 3.21 0 010 4.14l-7.49 8.59a1 1 0 01-.75.34z" />
              </svg>
            </span>
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default Productos;
