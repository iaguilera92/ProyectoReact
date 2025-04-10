import React, { useEffect, useState, useRef } from "react";
import { CssBaseline, Box, IconButton, useMediaQuery } from "@mui/material";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import "@fontsource/poppins";
import { lazy, Suspense } from "react";
const Areas = lazy(() => import("./components/Areas"));
const Informations = lazy(() => import("./components/Informations"));
const Contacto = lazy(() => import("./components/Contacto"));
const Evidencias = lazy(() => import("./components/Evidencias"));
const Footer = lazy(() => import("./components/Footer"));
const Navbar = lazy(() => import("./components/Navbar"));

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Cargando from './components/Cargando';
import { AnimatePresence, motion } from 'framer-motion';
import "./components/css/App.css";
import "./css/App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContacto, setShowContacto] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [openBubble, setOpenBubble] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const contactoRef = useRef(null); // Crear ref para la sección de contacto
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const informationsRef = useRef(null); // ✅ AÑADE AQUÍ EL REF PARA SCROLL
  const location = useLocation();
  const [videoReady, setVideoReady] = useState(false);
  const isHome = ["/", "/inicio", ""].includes(location.pathname);
  const isCompletelyReady = !isLoading && (isHome ? videoReady : true);
  const [showApp, setShowApp] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const areasSection = document.getElementById("areas-section");
      if (areasSection) {
        const rect = areasSection.getBoundingClientRect();
        setShowContacto(rect.top < window.innerHeight * 0.5);
      }
      setShowArrow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenBubble(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openBubble) {
      const timer = setTimeout(() => {
        setOpenBubble(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [openBubble]);

  const scrollToTop = () => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUserInteraction = () => {
    setHasInteracted(true);
  };

  //location.pathname
  useEffect(() => {
    if (location.pathname === "/") {
      // Ejecutar lógica cuando se vuelva a la ruta de inicio
    }
  }, [location.pathname]);

  // ⏳ CARGANDO CON LÓGICA CORRECTA
  useEffect(() => {
    let minListo = false;

    const requiereVideo = ["/", "/inicio", ""].includes(location.pathname);

    const minTimeout = setTimeout(() => {
      minListo = true;
      if (!requiereVideo || videoReady) {
        setShowApp(true);
      }
    }, 1500); // mínimo visible

    const maxTimeout = setTimeout(() => {
      setShowApp(true); // fuerza mostrar app
    }, 4000); // máximo espera

    return () => {
      clearTimeout(minTimeout);
      clearTimeout(maxTimeout);
    };
  }, [videoReady, location.pathname]);

  const timeout = setTimeout(() => {
    setIsLoading(false);
  }, 1500);
  return () => clearTimeout(timeout);
}, []);

useEffect(() => {
  const body = document.body;
  const html = document.documentElement;

  if (!showApp) {
    body.classList.add('no-scroll');
    html.classList.add('no-scroll');
  } else {
    body.classList.remove('no-scroll');
    html.classList.remove('no-scroll');
  }

  return () => {
    body.classList.remove('no-scroll');
    html.classList.remove('no-scroll');
  };
}, [showApp]);



return (
  <ThemeProvider theme={theme}>
    <CssBaseline />

    {/* Pantalla de carga */}
    <AnimatePresence>
      {!showApp && (
        <motion.div
          key="cargando"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <Cargando />
        </motion.div>
      )}
    </AnimatePresence>

    {/* Contenido principal, oculto mientras se carga */}
    <Box
      sx={{
        visibility: showApp ? "visible" : "hidden",
        pointerEvents: showApp ? "auto" : "none",
      }}
    >
      {/* Navbar solo si no estás en /administracion */}
      {location.pathname !== "/administracion" && (
        <Suspense fallback={null}>
          <Navbar contactoRef={contactoRef} informationsRef={informationsRef} />
        </Suspense>
      )}

      {/* Rutas principales con contexto */}
      <Outlet context={{ setVideoReady, contactoRef, informationsRef }} />

      {/* Secciones visibles solo en la página de inicio */}
      {["/", ""].includes(location.pathname) && (
        <>
          <Suspense fallback={null}>
            <Box id="areas-section">
              <Areas />
            </Box>
          </Suspense>

          <Suspense fallback={null}>
            <div ref={informationsRef}>
              <Informations />
            </div>
          </Suspense>
          <Suspense fallback={null}>
            <Evidencias />
          </Suspense>

          <Suspense fallback={null}>
            <Box ref={contactoRef}>
              <Contacto />
            </Box>
          </Suspense>

        </>
      )}

      {/* Footer (excepto en administración) */}
      {location.pathname !== "/administracion" && <Footer />}

      {/* Botón WhatsApp */}
      {location.pathname !== "/administracion" && (
        <Box
          sx={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 100,
            transition: "bottom 0.3s ease",
          }}
        >
          <IconButton
            onClick={() => {
              window.open("https://api.whatsapp.com/send?phone=56992914526", "_blank");
              setHasInteracted(true);
            }}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "#25d366",
              color: "#FFF",
              borderRadius: "50%",
              boxShadow: "2px 2px 3px #999",
              "&:hover": { backgroundColor: "#1ebe5d" },
              zIndex: 101,
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 30 }} />
          </IconButton>

          {/* Burbuja de mensaje */}
          {openBubble && (
            <Box
              sx={{
                position: "fixed",
                bottom: 110,
                right: 40,
                backgroundColor: "#fff",
                color: "#000",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                borderRadius: "20px",
                padding: "8px 16px",
                fontFamily: "Poppins, sans-serif",
                zIndex: 102,
                opacity: openBubble ? 1 : 0,
                transform: openBubble ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.5s ease, opacity 0.5s ease",
              }}
              onClick={() => setOpenBubble(false)}
            >
              Puedes escribirnos al wsp!
            </Box>
          )}
        </Box>
      )}

      {/* Botón scroll arriba */}
      {showArrow && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          sx={{
            position: "fixed",
            bottom: "120px",
            right: "40px",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "50%",
            padding: "10px",
            boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 101,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.1)",
              backgroundColor: "#000",
              color: "#fff",
            },
          }}
        >
          <ArrowUpwardIcon sx={{ fontSize: 30 }} />
        </IconButton>
      )}
    </Box>
  </ThemeProvider>
);
}

export default App;
