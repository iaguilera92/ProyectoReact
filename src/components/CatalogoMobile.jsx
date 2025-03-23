import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Snackbar,
  Box,
  Alert,
  Grid,
  Card,
  Button,
  Typography
} from '@mui/material';
import './css/Catalogo.css';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', message: '' });

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
    <Box key={producto.IdProducto} sx={{ position: 'relative', mb: 6 }}>
      {/* Stock badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          zIndex: 10,
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor:
            producto.Stock >= 10 ? '#4CAF50' : producto.Stock > 0 ? '#FFA000' : '#F44336',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
          border: '3px solid white'
        }}
      >
        {producto.Stock}
      </Box>

      {/* Card */}
      <Card
        sx={{
          position: 'relative',
          width: '100%',
          height: 350,
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
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {producto.NombreProducto}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {producto.Descripcion}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            {producto.ConDescuento ? (
              <Box>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', color: 'grey.300' }}
                >
                  {CalcularValorOld(producto.Valor)}
                </Typography>
                <Box
                  sx={{
                    display: 'inline-block',
                    bgcolor: 'success.main',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    mt: 0.5
                  }}
                >
                  <Typography variant="body1" fontWeight="bold">
                    {FormatearPesos(producto.Valor)}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="h6" fontWeight="bold">
                {FormatearPesos(producto.Valor)}
              </Typography>
            )}

            <Button
              variant="contained"
              color="secondary"
              sx={{ color: 'white' }}
              onClick={() =>
                setSnackbar({
                  open: true,
                  type: 'success',
                  message: `Compraste ${producto.NombreProducto}`
                })
              }
            >
              Comprar
            </Button>
          </Box>
        </Box>
      </Card>
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
          py: 11,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'url(/fondo-blanco.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }}
      >
        <Grid container spacing={4}>
          {[0, 1].map((groupIndex) => (
            <Grid item xs={12} md={4} key={groupIndex}>
              <ul className="producto-cards">
                {productos
                  .filter((_, i) => i % 2 === groupIndex)
                  .map(renderCard)}
              </ul>
            </Grid>
          ))}

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                height: '100%',
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
