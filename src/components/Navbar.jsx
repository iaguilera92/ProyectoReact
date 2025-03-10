import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Box,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import "@fontsource/poppins";

const menuItems = ["Inicio", "Servicios", "Contacto"];

function Navbar({ contactoRef }) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Maneja el clic en el menú
  const handleClick = (item) => {
    setOpen(false);
    if (item === "Contacto") {
      // Hacer scroll al componente Contacto usando el ref
      contactoRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (item === "Inicio") {
      scrollToTop();
    }
  };

  // Función para hacer scroll hacia el inicio
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          width: "96%",
          zIndex: 1100,
          borderRadius: "50px",
          overflow: "hidden",
          marginTop : "15px"
        }}
      >
            <AppBar
              position="static"
              sx={{
                backgroundColor: isScrolled ? "black" : "rgba(0, 0, 0, 0)",
                boxShadow: "none",
                transition: "background-color 0.3s ease-in-out",
                borderRadius: "inherit",
                overflow: "hidden", // Esto asegura que cualquier contenido fuera de la AppBar se oculte
              }}
            >

                      <Container>
                        <Toolbar>
                        <Box
              sx={{
                position: "fixed",
                left: { xs: "50%", md: "calc(50% + 15%)" }, // Centrado en móvil y 20% a la derecha en escritorio
                transform: "translateX(-50%)", // Mantener el centrado en móvil
                width: "96%",
                borderRadius: "0px",    
                display: "flex", // Asegura que el contenido esté alineado
                justifyContent: { xs: "center", md: "flex-start" }, // Ajuste con marginTop para mayor distancia
              }}
            >
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/logo-react.png"
                  alt="Logo"
                  style={{
                    height: "75px",
                    marginTop: "10px",
                    cursor: "pointer"
                  }}
                  onClick={scrollToTop} // Agregar función de scroll al hacer clic
                />
              </motion.div>
            </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Button
                      color="inherit"
                      sx={{ color: "white", fontFamily: "Poppins, sans-serif" }}
                      onClick={() => handleClick(item)}
                    >
                      {item}
                    </Button>
                  </motion.div>
                ))}
              </Box>

              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setOpen(true)}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleClick(item)}>
                <ListItemText
                  primary={item}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Navbar;
