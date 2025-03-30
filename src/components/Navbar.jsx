import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  Typography,
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
import { motion, AnimatePresence } from "framer-motion";
import { keyframes } from "@emotion/react";
import ViewListIcon from '@mui/icons-material/ViewList';
import "@fontsource/poppins";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';


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
const menuItemVariants = {
  hidden: { x: 60, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: i * 0.1, // 🪄 Efecto cascada
      ease: "easeOut",
    },
  }),
};
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};
const bienvenidaVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.2,
    },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: { opacity: 0, x: 40, transition: { duration: 0.3 } },
};


const SocialButton = ({ href, Icon, bgColor, hoverStyles }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener"
    sx={{
      width: 55,
      height: 55,
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
        fontSize: 37,
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
  { name: "Catálogo", icon: <ViewListIcon /> },
  { name: "Contacto", icon: <Mail /> },
];

function Navbar({ contactoRef, informationsRef }) {
  const navigate = useNavigate();
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
    if (item.name === "Contacto" && contactoRef?.current) {
      const offset = -80; // 🔧 Ajusta según tu layout
      const y = contactoRef.current.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    if (item.name === "Inicio") {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        scrollToTop();
      }
    }
    if (item.name === "Catálogo") {
      navigate("/catalogo"); // Redirige a /catalogo
    }
  };

  const LogoInicio = () => {
    navigate("/");
    scrollToTop();
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
            backgroundColor: isScrolled ? "rgba(0,0,0,0.8)" : "transparent",
            backdropFilter: isScrolled ? "blur(10px)" : "none",
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
                    onClick={LogoInicio}
                  />
                </motion.div>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
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
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            height: "100vh", // ✅ Ocupa toda la pantalla
            width: { xs: '80vw', sm: '60vw', md: '50vw' },
            maxWidth: '700px',
            minWidth: '300px',
            background: `
        linear-gradient(135deg, rgba(18, 22, 35, 0.92), rgba(24, 29, 47, 0.95)),
        radial-gradient(circle at 25% 20%, rgba(63,141,245,0.3) 0%, transparent 40%),
        radial-gradient(circle at 80% 80%, rgba(160,64,255,0.15) 0%, transparent 50%)
      `,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#ffffff',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            p: 0,
          },
        }}
      >
        <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* ❌ Botón cerrar */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <IconButton onClick={() => setOpen(false)}>
              <Close sx={{ fontSize: 32, color: "white" }} />
            </IconButton>
          </Box>

          {/* 📋 Menú navegación */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
                style={{ listStyle: "none", padding: 0, margin: 0, width: "100%" }}
              >
                {menuItems.map((item, index) => (
                  <motion.li key={item.name} variants={itemVariants}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleClick(item)}
                        sx={{
                          px: 3,
                          py: 1.2,
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          borderTop: index === 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <Box sx={{ color: "#7ab7ff", fontSize: "1.7rem" }}>{item.icon}</Box>
                              <span style={{ color: "#fff", fontWeight: "500", fontSize: "1.05rem" }}>
                                {item.name}
                              </span>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* 🧱 Espacio flexible para empujar bienvenida y redes al fondo */}
          <Box sx={{ flexGrow: 1 }} />

          {/* 🌟 Tarjeta bienvenida */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                variants={bienvenidaVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Box
                  sx={{
                    background: `
        radial-gradient(circle at top left, rgba(144,202,249,0.1), transparent 70%),
        linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))
      `,
                    borderRadius: 3,
                    px: 2.5,
                    py: 2.5,
                    mx: 2,
                    mb: 3,
                    color: "#ffffff",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 0 12px rgba(255,255,255,0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.2 }}>
                    <Box
                      component="img"
                      src="/logo-react.png"
                      alt="Bienvenidos"
                      sx={{
                        width: 50,
                        height: 50,
                        objectFit: "contain",
                        borderRadius: 2,
                        mr: 2,
                      }}
                    />
                    <Typography
                      fontSize="1.05rem"
                      fontWeight={600}
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        letterSpacing: 0.3,
                      }}
                    >
                      Bienvenid@ a plataformas.web
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 0.85,
                      fontSize: "0.85rem",
                      mb: 1.5,
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Conecta con nuestro equipo y descubre todo lo que podemos hacer por ti.
                  </Typography>


                  <Button
                    variant="text"
                    size="small"
                    endIcon={
                      <ArrowForwardIosRoundedIcon
                        sx={{
                          fontSize: 16,
                          transition: 'transform 0.3s ease',
                        }}
                      />
                    }
                    onClick={() => {
                      if (informationsRef?.current) {
                        const offset = -80; // 📏 Ajusta este valor según tu diseño (por ejemplo, altura del navbar)
                        const y = informationsRef.current.getBoundingClientRect().top + window.scrollY + offset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        setOpen(false);
                      }
                    }}
                    sx={{
                      mt: 1,
                      minHeight: 'unset',
                      color: "#90caf9",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      textTransform: "none",
                      fontFamily: 'Poppins, sans-serif',
                      pl: 0,
                      py: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        color: "#ffffff",
                        textDecoration: "underline",
                        backgroundColor: "transparent",
                        "& .MuiSvgIcon-root": {
                          transform: "translateX(3px)",
                        },
                      },
                    }}
                  >
                    Empezar ahora
                  </Button>



                </Box>
              </motion.div>

            )}
          </AnimatePresence>

          {/* Redes sociales al final del menú móvil */}
          <AnimatePresence mode="wait">
            {open && (
              <>
                {/* Redes sociales animadas */}

                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.12,
                        delayChildren: 0.3,
                      },
                    },
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "24px",
                    marginTop: "auto",
                    padding: "20px 0",
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
                        href: "https://www.facebook.com/profile.php?id=100063452866880",
                        Icon: FacebookIcon,
                        bgColor: "linear-gradient(45deg, #00B5F5, #002A8F)",
                      },
                      LinkedIn: {
                        href: "https://www.linkedin.com/company/plataformas-web/",
                        Icon: LinkedInIcon,
                        bgColor: "linear-gradient(45deg, #00B5F5, #0077b7)",
                      },
                    };

                    return (
                      <motion.div
                        key={social}
                        variants={{
                          hidden: { opacity: 0, x: 40 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.5, ease: "easeOut" },
                          },
                          exit: { opacity: 0, x: 30, transition: { duration: 0.3 } },
                        }}
                      >
                        <SocialButton
                          href={socialData[social].href}
                          Icon={socialData[social].Icon}
                          bgColor={socialData[social].bgColor}
                          hoverStyles={{
                            color:
                              social === "Instagram"
                                ? "#cf198c"
                                : social === "Facebook"
                                  ? "#0077b7"
                                  : "#0077b7",
                            background: `-webkit-linear-gradient(45deg, ${socialData[social].bgColor})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </Box>
      </Drawer >

    </>
  );
}

export default Navbar;
