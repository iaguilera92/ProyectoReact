import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Snackbar,
  Box,
  Alert,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import './css/Catalogo.css';
import { motion } from 'framer-motion';
import Productos from './Productos';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Grid } from '@mui/material';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IconButton } from '@mui/material';
import { Virtual } from 'swiper/modules';
import Cargando from './Cargando';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success', message: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const FormatearPesos = (valor) => `$${valor.toLocaleString('es-CL')}`;
  const CalcularValorOld = (valor) => FormatearPesos(valor + 10000);
  const [productoActivo, setProductoActivo] = useState(null);
  const [showArrow, setShowArrow] = useState(true);
  const [videoFullScreenProducto, setVideoFullScreenProducto] = useState(null);
  const [mostrarControlesVideo, setMostrarControlesVideo] = useState(false);
  const [animarFlecha, setAnimarFlecha] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);


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
    ConDescuento: descuento,
    VideoUrl: `/Producto${(id % 3) + 1}.mp4`, // entre 4 opciones distintas
  });


  useEffect(() => {
    setProductos([
      GetProducto(1, 20000, 1, 2, true),
      GetProducto(2, 15000, 2, 10, false),
      GetProducto(3, 35000, 3, 3, false),
      GetProducto(4, 23990, 4, 4, true),
      GetProducto(5, 17990, 5, 12, true),
      GetProducto(6, 7000, 6, 1, false),
      GetProducto(7, 23990, 4, 4, true),
      GetProducto(8, 17990, 5, 12, true),
      GetProducto(9, 7000, 6, 1, false),
      GetProducto(10, 7000, 6, 1, false),
      GetProducto(11, 23990, 4, 4, true),
      GetProducto(12, 17990, 5, 12, true),
      GetProducto(13, 7000, 6, 1, false)
    ]);

    window.scrollTo(0, 0);
  }, []);

  //CARGAR ANTES DE EMPEZAR
  useEffect(() => {
    const esperarCargaRecursos = () => {
      const images = Array.from(document.images);
      const videos = Array.from(document.querySelectorAll('video'));

      const totalRecursos = [...images, ...videos];
      let cargados = 0;

      if (totalRecursos.length === 0) {
        // Si no hay recursos, pasamos altiro
        setIsLoaded(true);
        return;
      }

      const verificarCarga = () => {
        cargados++;
        if (cargados === totalRecursos.length) {
          setTimeout(() => {
            setIsLoaded(true);
          }, 1500); // opcional: para una transición más suave
        }
      };

      totalRecursos.forEach((recurso) => {
        if (recurso.complete || recurso.readyState >= 3) {
          verificarCarga();
        } else {
          recurso.addEventListener('load', verificarCarga);
          recurso.addEventListener('error', verificarCarga);
        }
      });
    };

    if (document.readyState === 'complete') {
      esperarCargaRecursos();
    } else {
      window.addEventListener('load', esperarCargaRecursos);
    }

    return () => window.removeEventListener('load', esperarCargaRecursos);
  }, []);


  useEffect(() => {
    if (location.state?.snackbar) {
      setSnackbar(location.state.snackbar);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const chunkProductos = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const grupos = chunkProductos(productos, 5);

  useEffect(() => {
    window.scrollTo(0, 0);
    setProductoActivo({ 0: 0 }); // ← activa claramente el primer producto (grupo 0, índice 0)
  }, []);

  useEffect(() => {
    if (videoFullScreenProducto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [videoFullScreenProducto]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimarFlecha(false);
    }, 3000); // ⏱️ dura aprox. 3 segundos para mostrar 2 movimientos

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'; // ← impide la restauración automática
    }

    window.scrollTo(0, 0); // fuerza el inicio al tope
  }, []);

  return (
    <Box key={isLoaded ? 'loaded' : 'loading'}>
      {isLoaded ? (
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            overflowX: 'hidden',
            minHeight: '100vh',
            width: '100%', // ✅ CAMBIO AQUÍ
            py: 14,
            px: 1.2, // Puedes mantener esto ahora sin problema
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: isMobile
              ? 'url(fondo-blizz.avif)'
              : 'url(fondo-blizz.avif)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
          }}
        >


          {
            isMobile ? (
              grupos.map((grupo, grupoIndex) => (
                <Box key={`swiper-container-${grupoIndex}`} sx={{ position: 'relative', py: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      px: 0,
                      mb: 0,
                      position: 'relative',
                      zIndex: 20,
                      height: 40,
                    }}
                  >
                    {/* Título con ícono estilo reels */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, ml: 1 }}>
                      <Box
                        component="img"
                        src="cine.png"
                        alt="Reels icon"
                        sx={{
                          width: 18,
                          height: 18,
                          marginBottom: 0.5,
                          filter: 'invert(1)',
                        }}
                      />
                      <Box
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          color: 'white',
                          letterSpacing: 0.5,
                          fontFamily: '"Segoe UI", sans-serif',
                        }}
                      >
                        {grupoIndex === 0 ? 'Explora el catálogo' : 'Más productos..'}
                      </Box>
                    </Box>

                    {/* Flecha o espacio */}
                    <Box sx={{ width: 40, textAlign: 'right' }}>
                      {showArrow ? (
                        animarFlecha ? (
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: 1, ease: "easeInOut" }}
                          >

                            <IconButton
                              sx={{
                                color: "white",
                                boxShadow: "none",
                                padding: 0.5,
                                "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" },
                              }}
                            >
                              <ArrowForwardIcon fontSize="large" sx={{ fontSize: "24px" }} />
                            </IconButton>
                          </motion.div>
                        ) : (
                          <IconButton
                            sx={{
                              color: "white",
                              boxShadow: "none",
                              padding: 0.5,
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.4)" },
                            }}
                          >
                            <ArrowForwardIcon fontSize="large" sx={{ fontSize: "24px" }} />
                          </IconButton>
                        )
                      ) : (
                        <Box sx={{ width: 40 }} />
                      )}
                    </Box>

                  </Box>


                  <Swiper
                    modules={[Virtual]} // ✅ Solo usa los módulos que realmente ocupas
                    lazy={true}
                    watchSlidesProgress
                    spaceBetween={12}
                    slidesPerView={'auto'}
                    centeredSlides={false}
                    touchRatio={1.2}
                    threshold={5}
                    style={{ padding: '16px 10px', paddingRight: '20px' }}
                    onSlideChange={(swiper) => {
                      setShowArrow(!swiper.isEnd);
                    }}
                  >
                    {grupo.map((producto, index) => {
                      const productoIndexGlobal = index + grupoIndex * 5;
                      const isGirado = productoActivo[grupoIndex] === index;

                      return (
                        <SwiperSlide
                          key={producto.IdProducto}
                          style={{
                            width: '60vw', // 👉 Ocupa dos tercios del ancho
                            maxWidth: '320px',
                            scrollSnapAlign: 'start',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Productos
                              index={productoIndexGlobal}
                              producto={producto}
                              girado={isGirado}
                              onGirar={() => {
                                setProductoActivo((prevState) => ({
                                  ...prevState,
                                  [grupoIndex]: prevState[grupoIndex] === index ? null : index
                                }));
                              }}
                              FormatearPesos={FormatearPesos}
                              CalcularValorOld={CalcularValorOld}
                              onVisualizarMobile={setVideoFullScreenProducto}
                            />

                          </Box>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </Box>

              ))
            ) : (

              // Vista desktop (Grid exacto con 5 productos por fila)
              <Grid container spacing={2}>
                {productos.map((producto, index) => (
                  <Grid item md={12 / 5} key={producto.IdProducto}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Productos
                        index={index}
                        producto={producto}
                        girado={productoActivo === index}
                        onGirar={() =>
                          setProductoActivo(productoActivo === index ? null : index)
                        }
                        FormatearPesos={FormatearPesos}
                        CalcularValorOld={CalcularValorOld}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}



          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              severity={snackbar.type}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              sx={{ width: '100%', maxWidth: 360 }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>



          {videoFullScreenProducto && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'black',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                overflowY: 'auto',
                py: 4
              }}
            >

              <video
                key={videoFullScreenProducto?.IdProducto}
                src={videoFullScreenProducto?.VideoUrl}
                autoPlay
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                controlsList="nodownload"
                controls={mostrarControlesVideo} // solo si el usuario toca
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  backgroundColor: 'black',
                }}
                onClick={() => setMostrarControlesVideo(true)} // tap = muestra controles
                onCanPlay={(e) => {
                  const playPromise = e.target.play();
                  if (playPromise !== undefined) {
                    playPromise.catch(err => console.warn("AutoPlay Error:", err));
                  }
                }}
              />

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: '#25D366',
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 4,
                  py: 1,
                  borderRadius: '30px',
                  boxShadow: '0px 4px 12px rgba(0,0,0,0.4)'
                }}
                onClick={() => {
                  const mensaje = `Me interesó el ${videoFullScreenProducto.NombreProducto}, ¿sigue disponible?`;
                  const telefono = '56992914526';
                  const urlWhatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
                  window.open(urlWhatsapp, '_blank');
                }}
              >
                Me interesa!
              </Button>

              <Button
                onClick={() => setVideoFullScreenProducto(null)}
                sx={{
                  mt: 1,
                  color: 'white',
                  textTransform: 'none'
                }}
              >
                Cerrar
              </Button>
            </Box>
          )}
        </Container>
      ) : (
        <Cargando />
      )}
    </Box>
  )
};

export default Catalogo;
