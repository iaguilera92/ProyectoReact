import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
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
import { useNavigate } from "react-router-dom";

const menuItems = ["Inicio", "Servicios", "Contacto"];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

  // Maneja el clic en el menú (actualmente redirige a Contacto si es ese ítem)
  const handleClick = (item) => {
    setOpen(false);
    if (item === "Contacto") {
      navigate("/contacto");
    }
    // Aquí puedes agregar lógica para otros ítems si es necesario.
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
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: isScrolled
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0)",
            boxShadow: "none",
            transition: "background-color 0.3s ease-in-out",
            borderRadius: "inherit",
          }}
        >
          <Container>
            <Toolbar>
              {/* Título animado, clickeable para redirigir a "/" */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Proyecto React
                </Typography>
              </motion.div>

              {/* Espacio flexible para centrar los botones */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Menú en escritorio alineado a la derecha con animación */}
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

              {/* Botón hamburguesa en móvil */}
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

      {/* Menú desplegable en móvil */}
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
