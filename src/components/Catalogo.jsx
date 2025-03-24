import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Snackbar,
  Box,
  Alert,
  Grid,
  Card,
  useMediaQuery,
  Typography
} from '@mui/material';
import './css/Catalogo.css';
import { motion } from 'framer-motion';
const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', message: '' });
  const isMobile = useMediaQuery("(max-width:600px)"); // Detectar si la pantalla es menor a 600px
  const FormatearPesos = (valor) => `$${valor.toLocaleString('es-CL')}`;
  const CalcularValorOld = (valor) => FormatearPesos(valor + 10000);

  const ImgUrlAleatorio = (imgUrl) => {
    const urls = [
      'https://emprendepyme.net/wp-content/uploads/2023/03/comercializar-productos.jpg',
      'https://www.hostingplus.cl/wp-content/uploads/2023/08/Importancia-del-carrito-de-compra.jpg',
      'https://logistica360.pe/wp-content/uploads/2023/11/compras-inte.jpg',
      'https://www.ticobuycr.com/wp-content/uploads/2021/04/venta-por-internet_1.jpg',
      'https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpK3luyjdef0_KFW3p1I7upURnq3Rf31eVyQ&s'
    ];
    return urls[imgUrl - 1] || urls[0];
  };

  const GetProducto = (id, precio, img, stock = 1, descuento = false) => ({
    IdProducto: id,
    NombreProducto: `Producto ${id}`,
    Descripcion: 'Esta es una descripción del producto en stock, click para agregar al carrito.',
    Valor: precio,
    Stock: stock,
    ImageUrl: ImgUrlAleatorio(img),
    ConDescuento: descuento
  });

  useEffect(() => {
    setProductos([
      GetProducto(1, 20000, 1, 2, true),
      GetProducto(2, 15000, 2, 10, false),
      GetProducto(3, 35000, 3, 3, false),
      GetProducto(4, 23990, 4, 4, true),
      GetProducto(5, 17990, 5, 12, true),
      GetProducto(6, 7000, 6, 1, false)
    ]);

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.snackbar) {
      setSnackbar(location.state.snackbar);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const renderCard = (producto) => (
    <Box
  key={producto.IdProducto}
  sx={{
    width: '100%',
    maxWidth: 260, // 🔧 Fija un ancho máximo para alinear tarjeta y su contenido
    mx: 'auto',
    position: 'relative'
  }}
>

  {/* Stock Badge */}
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
        producto.Stock >= 10 ? '#4CAF50' : producto.Stock > 0 ? '#FFA000' : '#F44336',
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

  {/* CARD */}
  <Card
    sx={{
      border: '2px solid white',
      position: 'relative',
      width: '100%',
      height: { xs: 260, sm: 280, md: 300 },
      overflow: 'hidden',
      borderRadius: 3,
      boxShadow: 4
    }}
  >
    <Box
      component="img"
      src={producto.ImageUrl}
      alt={producto.NombreProducto}
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        top: 0,
        left: 0,
        zIndex: 1,
        filter: 'brightness(0.6)'
      }}
    />

    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        height: '100%',
        color: 'white',
        p: 1.2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          noWrap
          sx={{
            color: 'white',
            fontFamily: '"RC Type Cond", Arial, sans-serif',
            fontWeight: 700
          }}
        >
          {producto.NombreProducto}
        </Typography>
        
      </Box>
    </Box>
  </Card>

 {/* Bloque de precios y botón FUERA del card */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 1,
    mt: 1
  }}
>
  {/* Precio */}
<Box sx={{ position: 'relative', display: 'inline-block' }}>
  {/* Descuento ladeado */}
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

  {/* Precio actual */}
  <Typography
    variant="body1"
    fontWeight="bold"
    sx={{
      bgcolor: 'success.main',
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

  {/* Botón */}
  {/* Botón rojo a la derecha */}
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
        const nombreProducto = producto.NombreProducto;
        const mensaje = `¡Hola!%20Me%20intereso%20el%20${encodeURIComponent(
          nombreProducto
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

  return (
    <Box>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: '100vh',
          width: '100vw',
          py: 14,
          px: 1.2,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: isMobile ? 'url("https://blz-contentstack-images.akamaized.net/v3/assets/blta8f9a8e092360c6c/blt367ca4b27c88c078/Desktop_Blizz_Footer.jpg")' : 'url(/fondo-blanco.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <Grid container spacing={2}>
        {productos.map((producto, index) => (
  <Grid
    item
    xs={6}
    md={4}
    key={producto.IdProducto}
    component={motion.div}
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.5,
      ease: 'easeOut'
    }}
  >
    {renderCard(producto)}
  </Grid>
))}


          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Box
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src="catalogo-img.png"
                alt="Shopping"
                style={{ maxHeight: '80vh', width: 'auto', objectFit: 'contain' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: '100%', maxWidth: 360 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Catalogo;
