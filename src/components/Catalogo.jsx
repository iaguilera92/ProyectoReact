import React, { useState, useEffect } from 'react';
import { Container, Snackbar, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion'; // Usaremos framer-motion para las animaciones
import { useInView } from 'react-intersection-observer'; // Para manejar el scroll
import './css/Catalogo.css';

const Catalogo = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [productos, setProductos] = useState([]);
  const [isMobile, setIsMobile] = useState(false); // Estado para detectar si es mobile

  const GetProducto = (idProducto, precio, imgUrl, stock = 1, conDescuento = false) => {
    const url = ImgUrlAleatorio(imgUrl);
    const producto = {
      IdProducto: idProducto,
      NombreProducto: `Producto ${idProducto}`,
      Descripcion: 'Esta es una descripción del producto en stock, click para agregar al carrito.',
      Valor: precio,
      Stock: stock,
      ImageUrl: url,
      ConDescuento: conDescuento
    };
    return producto;
  };
  //https://enteldigital.cl/hubfs/raw_assets/public/HandyApps/Site_pages/Home/images/network-bg.svg APLICAR IMG
  const ImgUrlAleatorio = (imgUrl) => {
    let url = "https://emprendepyme.net/wp-content/uploads/2023/03/comercializar-productos.jpg";
    if (imgUrl === 2) {
      url = "https://www.hostingplus.cl/wp-content/uploads/2023/08/Importancia-del-carrito-de-compra.jpg";
    } else if (imgUrl === 3) {
      url = "https://logistica360.pe/wp-content/uploads/2023/11/compras-inte.jpg";
    } else if (imgUrl === 4) {
      url = "https://www.ticobuycr.com/wp-content/uploads/2021/04/venta-por-internet_1.jpg";
    } else if (imgUrl === 5) {
      url = "https://emprendepyme.net/wp-content/uploads/2023/03/cualidades-producto.jpg";
    } else if (imgUrl === 6) {
      url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpK3luyjdef0_KFW3p1I7upURnq3Rf31eVyQ&s";
    }
    return url;
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

    // Detectamos si es móvil o escritorio
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Si el ancho es menor o igual a 768px, es móvil
    };

    // Agregamos el event listener para el resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Llamamos una vez al cargar la página

    return () => window.removeEventListener('resize', handleResize); // Limpiamos el event listener
  }, []);

  const FormatearPesos = (valor) => {
    return `$${valor.toLocaleString('es-CL')}`;
  };

  const CalcularValorOld = (valor) => {
    const valorOld = valor + 10000;
    return FormatearPesos(valorOld);
  };

  return (
    <Box>
      <Container
        sx={{
          py: 11,
          minHeight: "calc(100vh - 64px)", // Asegurando que se ajuste a la pantalla
          maxWidth: '1500px !important',
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '90px',  // Espacio en la parte superior
          paddingBottom: '80px',  // Espacio en la parte inferior
          backgroundImage: 'url(/fondo-blanco.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <ul className="producto-cards">
          {productos.map((producto) => (
            <motion.li
              key={producto.IdProducto}
              
              style={{ backgroundImage: `url(${producto.ImageUrl})` }}
              initial={isMobile ? { x: '100vw', opacity: 0 } : { opacity: 0 }} // En mobile, comienza invisible y desde la derecha
              animate={isMobile ? { x: 0, opacity: 1 } : { opacity: 1 }} // En escritorio, usa solo opacidad
              transition={{ type: "spring", stiffness: 50, damping: 25 }} // Transición suave
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
                <span style={{ color: '#25D366' }}> {/* Color WhatsApp para "Contactar" */}
                  Contactar
                  <i className="fab fa-whatsapp" style={{ marginLeft: '4px', marginBottom: '3px', fontSize: '20px', color: '#25D366', verticalAlign: 'middle' }}></i>
                </span>
                <span>Solicitar Producto <i className="fas fa-shopping-cart" /></span>
              </button>
            </motion.li>
          ))}
        </ul>
      </Container>

      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: "100%" }}>
          Se contactará con la Empresa para solicitar el producto.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Catalogo;
