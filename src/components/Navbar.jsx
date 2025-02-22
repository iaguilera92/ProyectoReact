import { useState } from "react";
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
import "@fontsource/poppins"; // Importa la fuente Poppins

const menuItems = ["Inicio", "Servicios", "Contacto"];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar transparente sin línea ni sombra */}
      <AppBar
        position="absolute"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0)", // Transparente
          boxShadow: "none", // Quita la sombra
          borderBottom: "none", // Elimina la línea inferior
        }}
      >
        <Container>
          <Toolbar>
            {/* Título con Poppins */}
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                color: "white",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              Proyecto React
            </Typography>

            {/* Menú en escritorio */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  color="inherit"
                  sx={{
                    color: "white",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {item}
                </Button>
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

      {/* Menú desplegable en móvil */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => setOpen(false)}>
                <ListItemText
                  primary={item}
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                  }}
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
