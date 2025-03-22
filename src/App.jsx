import React, { useEffect, useState, useRef } from "react";
import { CssBaseline, Box, IconButton, useMediaQuery } from "@mui/material";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import "@fontsource/poppins";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Areas from "./components/Areas";
import Informations from "./components/Informations";
import Contacto from "./components/Contacto";
import Footer from "./components/Footer";
import Catalogo from "./components/Catalogo";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
function Home({ informationsRef, contactoRef }) {
  return (
    <Box>
      <Hero scrollToContacto={contactoRef} />
      <Box>
        <Features scrollToInformations={informationsRef} />
      </Box>
    </Box>
  );
}

function App() {
  
  const [showContacto, setShowContacto] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [openBubble, setOpenBubble] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const contactoRef = useRef(null); // Crear ref para la sección de contacto
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const informationsRef = useRef(null); // ✅ AÑADE AQUÍ EL REF PARA SCROLL


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
    if (openBubble && hasInteracted) {
      const notificationSound = new Audio("/whatsapp-notification.mp3");
      notificationSound.play().catch((err) => console.error("Error al reproducir el sonido:", err));
    }
  }, [openBubble, hasInteracted]);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ m: isMobile ? 0 : 2, border: isMobile ? "none" : "4px solid white", borderRadius: isMobile ? "none" : "20px", overflow: "hidden" }}>
        <Box sx={{ minHeight: "100vh", background: "radial-gradient(circle, #111111 20%, #000000 80%)", color: "white", position: "relative" }}>
          <Navbar contactoRef={contactoRef} /> {/* Pasamos el ref al Navbar */}
          <Box sx={{ minHeight: "100vh" }}>
            <Routes>
              <Route path="/" element={<Home informationsRef={informationsRef} contactoRef= {contactoRef}/>} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes> 
            {/* Solo muestra estas secciones si NO estamos en /catalogo */}
            {location.pathname !== "/catalogo" && (
              <>
                <Box id="areas-section">
                  <Areas />
                </Box>                        
                <div ref={informationsRef}>
                  <Informations />
                </div>
                <Box ref={contactoRef}>
                  <Contacto />
                </Box>
              </>
            )}            
          </Box>
          <Footer />

          <Box sx={{
            position: "fixed", bottom: "40px", right: "40px", zIndex: 100,
            transition: "bottom 0.3s ease", 
          }}>
            <IconButton onClick={() => {
              window.open("https://api.whatsapp.com/send?phone=56992914526", "_blank");
              handleUserInteraction();
            }} sx={{
              width: "60px", height: "60px", backgroundColor: "#25d366", color: "#FFF", borderRadius: "50%",
              boxShadow: "2px 2px 3px #999", "&:hover": { backgroundColor: "#1ebe5d" }, zIndex: 101,
            }}>
              <WhatsAppIcon sx={{ fontSize: "30px" }} />
            </IconButton>

            {openBubble && (
              <Box sx={{
                position: "fixed", bottom: "110px", right: "40px", backgroundColor: "#fff", color: "#000",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)", borderRadius: "20px", padding: "8px 16px",
                fontFamily: "Poppins, sans-serif", zIndex: 102, opacity: openBubble ? 1 : 0,
                transform: openBubble ? "translateX(0)" : "translateX(100%)", transition: "transform 0.5s ease, opacity 0.5s ease",
              }} onClick={() => setOpenBubble(false)}>
                Puedes escribirnos al wsp!
              </Box>
            )}
          </Box>

          {showArrow && (
            <IconButton onClick={scrollToTop} sx={{
              position: "fixed", bottom: "120px", right: "40px", backgroundColor: "#fff", color: "#000",
              borderRadius: "50%", padding: "10px", boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)", zIndex: 101,
              transition: "transform 0.3s ease-in-out", "&:hover": { transform: "scale(1.1)", cursor: "pointer", backgroundColor: "#000", color: "#fff" }
            }}>
              <ArrowUpwardIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
