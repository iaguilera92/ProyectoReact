import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Snackbar, Box, Alert, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import './css/Catalogo.css';

const Catalogo = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [productos, setProductos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', message: '' });

  const GetProducto = (idProducto, precio, imgUrl, stock = 1, conDescuento = false) => {
    const url = ImgUrlAleatorio(imgUrl);
    return {
      IdProducto: idProducto,
      NombreProducto: `Producto ${idProducto}`,
      Descripcion: 'Esta es una descripción del producto en stock, click para agregar al carrito.',
      Valor: precio,
      Stock: stock,
      ImageUrl: url,
      ConDescuento: conDescuento
    };
  };

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

  useEffect(() => {
    const productosData = [
      GetProducto(1, 20000, 1, 2, true),
      GetProducto(2, 15000, 2, 10, false),
      GetProducto(3, 35000, 3, 3, false),
      GetProducto(4, 23990, 4, 4, true),
      GetProducto(5, 17990, 5, 12, true),
      GetProducto(6, 7000, 6, 1, false)
    ];
    setProductos(productosData);

    window.scrollTo(0, 0);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.snackbar) {
      setSnackbar(location.state.snackbar);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const FormatearPesos = (valor) => `$${valor.toLocaleString('es-CL')}`;
  const CalcularValorOld = (valor) => FormatearPesos(valor + 10000);

  return (
    <Box>
      <Container maxWidth={false} disableGutters sx={{
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
      }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ul className="producto-cards">
              {productos.filter((_, i) => i % 2 === 0).map(producto => (
                <motion.li
                key={producto.IdProducto}
                style={{ backgroundImage: `url(${producto.ImageUrl})` }}
                initial={isMobile ? { x: '100vw', opacity: 0 } : { opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 25 }}
              >
                <div className="producto-info">
                  <span className="title">{producto.NombreProducto}</span>
                  <p>{producto.Descripcion}</p>
                  {producto.ConDescuento && (
                    <span className="price-old">
                      <s>{CalcularValorOld(producto.Valor)}</s>
                    </span>
                  )}
                  <span className="price">{FormatearPesos(producto.Valor)}</span>

                  {/* Valoración */}
                  <div className="rating" title="Valoración del producto">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <React.Fragment key={rating}>
                        <input type="radio" name={`rating-${producto.IdProducto}`} id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`}></label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div className="producto-stock">
                  <div className="stocks">
                    {producto.Stock >= 10 ? (
                      <span className="stock-verde">{producto.Stock}</span>
                    ) : producto.Stock > 0 && producto.Stock < 10 ? (
                      <span className="stock-naranjo">{producto.Stock}</span>
                    ) : (
                      <span className="stock-rojo">{producto.Stock}</span>
                    )}
                  </div>
                </div>

                {/* Botón Agregar */}
                <button
                  style={{ marginTop: '226px', cursor: 'pointer' }}
                  className="custom-boton btn-12"
                  onClick={() => {
                    setOpenAlert(true);
                    const nombreProducto = producto.NombreProducto;
                    const mensaje = `¡Hola!%20Me%20intereso%20el%20${encodeURIComponent(nombreProducto)}, sigue a la venta?`;
                    window.open(`https://api.whatsapp.com/send?phone=56992914526&text=${mensaje}`, "_blank");
                  }}
                >
                  <span style={{ color: '#25D366' }}>
                    Contactar
                    <i className="fab fa-whatsapp" style={{ marginLeft: '4px', marginBottom: '3px', fontSize: '20px', color: '#25D366', verticalAlign: 'middle' }}></i>
                  </span>
                  <span>Solicitar Producto <i className="fas fa-shopping-cart" /></span>
                </button>
              </motion.li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12} md={4}>
            <ul className="producto-cards">
              {productos.filter((_, i) => i % 2 !== 0).map(producto => (
                <motion.li
                key={producto.IdProducto}
                style={{ backgroundImage: `url(${producto.ImageUrl})` }}
                initial={isMobile ? { x: '100vw', opacity: 0 } : { opacity: 0 }}
                animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 25 }}
              >
                <div className="producto-info">
                  <span className="title">{producto.NombreProducto}</span>
                  <p>{producto.Descripcion}</p>
                  {producto.ConDescuento && (
                    <span className="price-old">
                      <s>{CalcularValorOld(producto.Valor)}</s>
                    </span>
                  )}
                  <span className="price">{FormatearPesos(producto.Valor)}</span>

                  {/* Valoración */}
                  <div className="rating" title="Valoración del producto">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <React.Fragment key={rating}>
                        <input type="radio" name={`rating-${producto.IdProducto}`} id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`}></label>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div className="producto-stock">
                  <div className="stocks">
                    {producto.Stock >= 10 ? (
                      <span className="stock-verde">{producto.Stock}</span>
                    ) : producto.Stock > 0 && producto.Stock < 10 ? (
                      <span className="stock-naranjo">{producto.Stock}</span>
                    ) : (
                      <span className="stock-rojo">{producto.Stock}</span>
                    )}
                  </div>
                </div>

                {/* Botón Agregar */}
                <button
                  style={{ marginTop: '226px', cursor: 'pointer' }}
                  className="custom-boton btn-12"
                  onClick={() => {
                    setOpenAlert(true);
                    const nombreProducto = producto.NombreProducto;
                    const mensaje = `¡Hola!%20Me%20intereso%20el%20${encodeURIComponent(nombreProducto)}, sigue a la venta?`;
                    window.open(`https://api.whatsapp.com/send?phone=56992914526&text=${mensaje}`, "_blank");
                  }}
                >
                  <span style={{ color: '#25D366' }}>
                    Contactar
                    <i className="fab fa-whatsapp" style={{ marginLeft: '4px', marginBottom: '3px', fontSize: '20px', color: '#25D366', verticalAlign: 'middle' }}></i>
                  </span>
                  <span>Solicitar Producto <i className="fas fa-shopping-cart" /></span>
                </button>
              </motion.li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.type} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%', maxWidth: 360 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Catalogo;
