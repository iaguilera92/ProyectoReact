import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box, IconButton } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import "@fontsource/poppins";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Areas from "./components/Areas";
import Contacto from "./components/Contacto";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"; // Icono de flecha hacia arriba

// Componente Home (página principal)
function Home() {
  return (
    <Box>
      <Hero />
      <Box sx={{ minHeight: "100vh" }}>
        <Features />
        <Areas />
      </Box>
    </Box>
  );
}

function App() {
  const [openBubble, setOpenBubble] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  // Detectar el scroll
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setOpenBubble(true);
    }, 2000);
    const timer2 = setTimeout(() => {
      setOpenBubble(false);
    }, 5000);

    // Mostrar la flecha solo después de haber hecho scroll hacia abajo
    const handleScroll = () => {
      if (window.scrollY > 300) { // Muestra la flecha cuando se hace scroll hacia abajo
        setShowArrow(true);
      } else {
        setShowArrow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Función para desplazar hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          m: 2,
          border: "4px solid white",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            background: "radial-gradient(circle, #111111 20%, #000000 80%)",
            color: "white",
            position: "relative",
          }}
        >
          <Navbar />
          <Box sx={{ minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
          </Box>
          <Footer />

          {/* Botón flotante de WhatsApp con animación de deslizamiento desde la derecha */}
          <Box
            sx={{
              position: "fixed",
              bottom: "40px",
              right: "40px",
              width: "60px",
              height: "60px",
              backgroundColor: "#25d366",
              color: "#FFF",
              borderRadius: "50px",
              textAlign: "center",
              fontSize: "30px",
              boxShadow: "2px 2px 3px #999",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.5s ease-in-out", // Transición para aparecer
              transform: "translateX(100%)", // Empieza fuera de la pantalla
              opacity: 0, // Invisible al principio
              animation: "slideIn 0.5s forwards 1s", // Animación para hacer aparecer el botón
            }}
          >
            <a
              href="https://api.whatsapp.com/send?phone=56992914526"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <WhatsAppIcon sx={{ fontSize: "30px" }} />
            </a>
          </Box>

          {/* Diálogo emergente estilo burbuja con fade in/out */}
          <Box
            sx={{
              position: "fixed",
              bottom: "110px",
              right: "40px",
              backgroundColor: "#fff",
              color: "#000",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              borderRadius: "20px",
              padding: "8px 16px",
              fontFamily: "Poppins, sans-serif",
              zIndex: 101,
              opacity: openBubble ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            Puedes escribirnos directamente al wsp!
          </Box>

          {/* Flecha para volver al inicio, solo visible después de bajar en el scroll */}
          {showArrow && (
            <IconButton
              onClick={scrollToTop}
              sx={{
                position: "fixed",
                bottom: "120px", // Justo encima del botón de WhatsApp
                right: "40px",
                backgroundColor: "#fff",
                color: "#000",
                borderRadius: "50%",
                padding: "10px",
                boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
                zIndex: 101,
                transition: "transform 0.3s ease-in-out",
                opacity: 1,
                animation: "fadeIn 0.5s ease-in-out", // Animación de aparición
                "&:hover": {
                  transform: "scale(1)", // Agranda al hacer hover
                  cursor: "pointer", // Cambia el cursor a pointer
                  backgroundColor: "#000", // Fondo negro al hacer hover
                  color: "#fff", // Flecha blanca al hacer hover
                },
              }}
            >
              <ArrowUpwardIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </ThemeProvider>
  );
}

export default App;
