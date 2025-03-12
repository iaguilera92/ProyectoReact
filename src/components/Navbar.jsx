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
import { Menu as MenuIcon, Home, Build, Mail, Close } from "@mui/icons-material"; // Agregamos Close para la "X"
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn"; 
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react"; 
import ViewListIcon from '@mui/icons-material/ViewList';
import "@fontsource/poppins";

const shrinkCircle = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
`;

const expandIcon = keyframes`
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 1; }
`;

const growElement = keyframes`
  0% { transform: scale(0.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

const SocialButton = ({ href, Icon, bgColor, hoverStyles }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener"
    sx={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      "&:hover .circle": {
        animation: `${shrinkCircle} 300ms forwards`,
      },
      "&:hover .icon": {
        animation: `${expandIcon} 300ms forwards`,
        ...hoverStyles,
      },
    }}
  >
    <Box
      className="circle"
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: bgColor,
        transition: "transform 300ms ease-out",
      }}
    />
    <Icon
      className="icon"
      sx={{
        color: "white",
        fontSize: 24,
        position: "absolute",
        transition: "color 300ms ease-in, transform 300ms ease-in",
      }}
    />
  </Box>
);
const rotate360 = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;
const menuItems = [
  { name: "Inicio", icon: <Home /> },
  { name: "Catalogo", icon: <ViewListIcon  /> },
  { name: "Contacto", icon: <Mail /> },
];

function Navbar({ contactoRef }) {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (item) => {
    setOpen(false);
    if (item.name === "Contacto") {
      contactoRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (item.name === "Inicio") {
      scrollToTop();
    }
  };

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
          marginTop: "15px",
        }}
      >
        <AppBar
          position="relative"
          sx={{
            backgroundColor: isScrolled ? "black" : "rgba(0, 0, 0, 0)",
            boxShadow: "none",
            transition: "background-color 0.3s ease-in-out",
            borderRadius: "inherit",
            overflow: "hidden",
          }}
        >
          <Container>
            <Toolbar>
              <Box
                sx={{
                  position: "absolute",
                  left: { xs: "50%", md: "calc(15% + 0%)" },
                  transform: "translateX(-50%)",
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <motion.div
                  initial={{ x: -200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="/logo-react.png"
                    alt="Logo"
                    style={{ height: "75px", marginTop: "10px", cursor: "pointer" }}
                    onClick={scrollToTop}
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
                      sx={{
                        color: "white",
                        fontFamily: "Poppins, sans-serif",
                        padding: "10px 20px",
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                      }}
                      onClick={() => handleClick(item)}
                    >
                      {item.name}
                    </Button>
                  </motion.div>
                ))}
              </Box>

              <IconButton
                color="inherit"
                edge="end"
                onClick={() => setOpen(!open)}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <motion.div
                  initial={{ x: 200, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <MenuIcon />
                </motion.div>
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      {/* Menú móvil */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "50%",
            maxWidth: "500px",
            backgroundImage: 'url(/fondo-fono.png)',
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Botón de cerrar ("X") */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: "2px" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              animation: open ? `${rotate360} 1s` : "none", // Aplica el efecto de rotación cuando se abre el menú
            }}
          >
            <Close sx={{ fontSize: 30 }} />
          </IconButton>
        </Box>


        {/* Menú de opciones */}
        <List sx={{ flexGrow: 1, paddingTop: "0", marginTop: "-10px" }}> {/* Añadimos paddingTop para bajar el menú */}
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleClick(item)}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Box sx={{ color: "#3f8df5", fontSize: "1.3rem" }}>
                          {item.icon}
                        </Box>
                        <span style={{ color: "#3f8df5", lineHeight: "0.5", marginBottom: "5px" }}>{item.name}</span>
                      </Box>
                    }
                    sx={{
                      fontFamily: "Poppins, sans-serif",
                      padding: "0px",
                      borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>

        {/* Redes sociales al final del menú móvil */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: "auto",  // Esto asegura que las redes sociales estén al fondo
            padding: "20px 0",  // Aquí le damos un padding
          }}
        >
          {["Instagram", "Facebook", "LinkedIn"].map((social, index) => {
            const socialData = {
              Instagram: {
                href: "https://www.instagram.com/plataformas.web/?hl=es-la",
                Icon: InstagramIcon,
                bgColor: "linear-gradient(45deg, #cf198c, #f41242)",
              },
              Facebook: {
                href: "https://www.facebook.com/Mittarentacar",
                Icon: FacebookIcon,
                bgColor: "linear-gradient(45deg, #00B5F5, #002A8F)",
              },
              LinkedIn: {
                href: "https://www.linkedin.com/company/mittarentacar/?viewAsMember=true",
                Icon: LinkedInIcon,
                bgColor: "linear-gradient(45deg, #00B5F5, #0077b7)",
              },
            };

            return (
              <motion.div
                key={social}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <SocialButton
                  href={socialData[social].href}
                  Icon={socialData[social].Icon}
                  bgColor={socialData[social].bgColor}
                  hoverStyles={{
                    color: social === "Instagram" ? "#cf198c" : social === "Facebook" ? "#0077b7" : "#0077b7",
                    background: `-webkit-linear-gradient(45deg, ${socialData[social].bgColor})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />
              </motion.div>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar;
