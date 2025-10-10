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
  useTheme,
  useMediaQuery, Dialog, DialogTitle, DialogContent
} from "@mui/material";
import { WhatsApp as WhatsAppIcon, Menu as MenuIcon, Home, Mail, Close } from "@mui/icons-material"; // Agregamos Close para la "X"
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { motion, AnimatePresence } from "framer-motion";
import { keyframes } from "@emotion/react";
import ViewListIcon from '@mui/icons-material/ViewList';
import GroupsIcon from '@mui/icons-material/Groups';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import "@fontsource/poppins";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from 'react-router-dom';


const socialData = {
  Instagram: { href: "https://www.instagram.com/plataformas.web/?hl=es-la", Icon: InstagramIcon, bgColor: "linear-gradient(45deg, #cf198c, #f41242)", hoverColor: "#cf198c" },
  Facebook: { href: "https://www.facebook.com/profile.php?id=100063452866880", Icon: FacebookIcon, bgColor: "linear-gradient(45deg, #00B5F5, #002A8F)", hoverColor: "#0077b7" },
  LinkedIn: { href: "https://www.linkedin.com/company/plataformas-web/", Icon: LinkedInIcon, bgColor: "linear-gradient(45deg, #00B5F5, #0077b7)", hoverColor: "#0077b7" }
};

const shrinkCircle = keyframes`0%{transform:scale(1);opacity:1;}100%{transform:scale(0);opacity:0;}`;
const expandIcon = keyframes`0%{transform:scale(1);opacity:1;}100%{transform:scale(1.5);opacity:1;}`;
const rotateTwice = keyframes`from{transform:rotate(0deg);}to{transform:rotate(720deg);}`;

const menuItemVariants = {
  hidden: { x: 60, opacity: 0 },
  visible: (i) => ({ x: 0, opacity: 1, transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" } }),
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const bienvenidaVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, x: 40, transition: { duration: 0.3 } },
};



const SocialButton = ({ href, Icon, bgColor, hoverStyles }) => (
  <Box component="a" href={href} target="_blank" rel="noopener" sx={{
    width: 55, height: 55, borderRadius: "50%", position: "relative", display: "flex",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
    "&:hover .circle": { animation: `${shrinkCircle} 300ms forwards` },
    "&:hover .icon": { animation: `${expandIcon} 300ms forwards`, ...hoverStyles },
  }}>
    <Box className="circle" sx={{
      position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
      background: bgColor, transition: "transform 300ms ease-out",
    }} />
    <Icon className="icon" sx={{
      color: "white", fontSize: 37, position: "absolute",
      transition: "color 300ms ease-in, transform 300ms ease-in",
    }} />
  </Box>
);

const menuItems = [
  { name: "Inicio", icon: <Home /> }, { name: "Servicios", icon: <ViewListIcon /> },
  { name: "Presentación", icon: <SlideshowIcon /> }, //{ name: "Catálogo", icon: <ViewCarouselIcon /> }
  { name: "Nosotros", icon: <GroupsIcon /> }, { name: "Contacto", icon: <Mail /> },
  { name: "Suscribirse", icon: <NotificationsNoneIcon /> }
];

function Navbar({ contactoRef, informationsRef, videoReady }) {
  const [open, setOpen] = useState(false), [isScrolled, setIsScrolled] = useState(false), [openPDF, setOpenPDF] = useState(false);
  const theme = useTheme(), isMobile = useMediaQuery(theme.breakpoints.down('sm')), navigate = useNavigate();
  const pdfSrc = `/plataformasweb-pdf.pdf#zoom=${isMobile ? 100 : 60}`;
  const location = useLocation();
  const mostrarAnimacion = videoReady || (location.pathname !== '/' && location.pathname !== '');
  const [animacionMostrada, setAnimacionMostrada] = useState(false);
  const mostrarLogo = mostrarAnimacion || animacionMostrada;
  const [scrollY, setScrollY] = useState(0);
  const maxScroll = 80; // hasta dónde se desvanece
  const translateY = Math.min(scrollY, maxScroll);
  const [mostrarTexto, setMostrarTexto] = useState(true);

  // ⏱️ ALERTA PRINCIPAL
  useEffect(() => {
    const intervalo = setInterval(() => {
      setMostrarTexto((prev) => !prev);
    }, 4000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mostrarAnimacion && !animacionMostrada) {
        setAnimacionMostrada(true); // Forzar SIEMPRE a los 5s
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);


  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToRef = (ref, offset = -80) => ref?.current && window.scrollTo({ top: ref.current.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' });
  const handleOpenPDF = () => isMobile ? window.open("/plataformasweb-pdf.pdf", "_blank") : setOpenPDF(true);
  const handleClosePDF = () => setOpenPDF(false);

  const handleClick = (item) => {
    setOpen(false);
    const actions = {
      Contacto: () => {
        if (location.pathname === "/") {
          scrollToRef(contactoRef);
        } else {
          navigate("/");
          setTimeout(() => {
            scrollToRef(contactoRef);
          }, 400);
        }
      },
      Inicio: () => location.pathname !== "/" ? navigate("/") : scrollToTop(),
      Servicios: () => navigate("/servicios"),
      Catálogo: () => navigate("/catalogo"),
      Nosotros: () => navigate("/nosotros"),
      Presentación: handleOpenPDF,
      Suscribirse: () => handleSuscribirse("Ignacio Aguilera", "plataformas.web.cl@gmail.com"),
    };
    actions[item.name]?.();
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LogoInicio = () => (navigate("/"), scrollToTop());

  useEffect(() => {
    if (mostrarAnimacion) {
      setAnimacionMostrada(true);
    }
  }, [mostrarAnimacion]);

  //PATPASS
  const handleSuscribirse = async (nombre, email) => {
    try {
      const isLocal = window.location.hostname === "localhost";
      const endpoint = isLocal
        ? "http://localhost:8888/.netlify/functions/suscribirse"
        : "/.netlify/functions/suscribirse";

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email }),
      });

      const data = await resp.json();
      console.log("Respuesta suscribirse OneClick:", data);

      if (data.url && data.token) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.url;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "TBK_TOKEN";
        input.value = data.token;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      console.error("Error en handleSuscribirse:", err);
    }
  };


  return (
    <>
      <motion.div
        style={{
          transform: `translateY(-${translateY}px)`,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1200,
        }}
      >
        <Box
          onClick={() => {
            window.open("https://api.whatsapp.com/send?phone=56946873014", "_blank");
          }}
          sx={{
            background: "linear-gradient(135deg, #ff3b3b, #b71c1c)",
            boxShadow: "0px 3px 10px rgba(183,28,28,0.5)",
            height: { xs: 30, sm: 32 },
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: scrollY < maxScroll
              ? "0px 2px 10px rgba(255,0,0,0.4)"
              : "none",
            transition: "box-shadow 0.3s ease, transform 0.2s ease",
            cursor: "pointer",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0px 4px 14px rgba(255,0,0,0.6)",
              background: "linear-gradient(135deg, hsl(0deg 90% 60%), hsl(0deg 80% 45%))",
            },
          }}
        >
          <AnimatePresence mode="wait">
            {(mostrarAnimacion || animacionMostrada) && (
              <motion.div
                key={mostrarTexto ? "llamanos" : "telefono"}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "white",
                  fontWeight: 600,
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "0.95rem",
                  lineHeight: "1",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000
      `,
                  }}
                >
                  {/* Ícono fijo */}
                  {mostrarTexto ? (
                    <img
                      src="/logo-sitio-web.webp"
                      alt="Bandera"
                      style={{
                        width: "18px",
                        height: "auto",
                        borderRadius: "2px",
                        display: "inline-block",
                      }}
                    />
                  ) : (
                    <IconButton
                      sx={{
                        width: 20,
                        height: 20,
                        p: 0,
                        backgroundColor: "#25d366",
                        color: "#FFF",
                        borderRadius: "50%",
                        boxShadow: "2px 2px 3px #999",
                        "&:hover": { backgroundColor: "#1ebe5d" },
                        zIndex: 101,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}

                  {/* Texto fijo */}
                  <span>
                    {mostrarTexto ? "¡QUEDAN 5 CUPOS!" : "¡SOLICITA TU WEB!"}
                  </span>
                </span>
              </motion.div>

            )}
          </AnimatePresence>
        </Box>
      </motion.div >
      <Box
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          width: "96%",
          zIndex: 1100,
          borderRadius: "50px",
          overflow: "hidden",
          marginTop: `${Math.max(40 - translateY, 15)}px`,
        }}
      >
        <AppBar
          position="relative"
          sx={{
            backgroundColor: isScrolled ? "rgba(0,0,0,0.8)" : "transparent",
            backdropFilter: isScrolled ? "blur(10px)" : "none",
            boxShadow: "none",
            transition: "all 0.3s ease",
            borderRadius: "50px",
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
                <AnimatePresence mode="wait">
                  {mostrarLogo && (
                    <motion.div
                      key={mostrarAnimacion ? "mostrar" : "forzado"}
                      initial={{ x: -200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 1,
                        delay: mostrarAnimacion ? 1 : 0,
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <motion.img
                        src="/logo-plataformas-web.png"
                        alt="Logo"
                        onClick={LogoInicio}
                        initial={{ scale: 1 }}
                        animate={{ scale: isScrolled ? 0.8 : 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ height: "55px", marginTop: "10px", cursor: "pointer" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                {menuItems
                  .filter((item) => item.name !== "Suscribirse") // 🚫 oculta el ítem
                  .map((item, index) => (
                    <Button
                      key={item.name}
                      component={motion.button}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                      onClick={() => handleClick(item)}
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
              </Box>


              <IconButton color="inherit" edge="end" onClick={() => setOpen(!open)} sx={{ display: { xs: "block", md: "none" } }}>
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
            height: "100dvh",// ✅ Dinámico y confiable
            width: { xs: '80vw', sm: '60vw', md: '50vw' },
            maxWidth: '700px',
            minWidth: '300px',
            background: `linear-gradient(135deg, rgba(18, 22, 35, 0.92), rgba(24, 29, 47, 0.95)),
                        radial-gradient(circle at 25% 20%, rgba(63,141,245,0.3) 0%, transparent 40%),
                        radial-gradient(circle at 80% 80%, rgba(160,64,255,0.15) 0%, transparent 50%)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: '#ffffff',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            p: 0,
          },
        }}
      >
        <Box sx={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 0.5 }}>
            <IconButton
              aria-label="Abrir menú"
              onClick={() => setOpen(false)}
              sx={{
                animation: open ? `${rotateTwice} 1s ease-in-out` : "none",
              }}
            >
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
                {menuItems.map((item, index) => {
                  const isDisabled = item.name === "Suscribirse"; // 🔒 detecta el ítem a bloquear

                  return (
                    <ListItem
                      key={item.name}
                      component={motion.li}
                      variants={itemVariants}
                      disablePadding
                    >
                      <ListItemButton
                        onClick={() => !isDisabled && handleClick(item)} // 🚫 no hace nada si está bloqueado
                        disabled={isDisabled} // desactiva visualmente
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderBottom: "1px solid rgba(255,255,255,0.1)",
                          borderTop:
                            index === 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
                          backgroundColor: isDisabled
                            ? "rgba(255,0,0,0.1)" // 🔴 leve fondo rojo desactivado
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isDisabled
                              ? "rgba(255,0,0,0.15)" // hover rojo apagado
                              : "rgba(255,255,255,0.05)",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                          },
                          opacity: isDisabled ? 0.6 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <Box
                                sx={{
                                  color: isDisabled ? "#ff5252" : "#7ab7ff", // rojo si está bloqueado
                                  fontSize: "1.7rem",
                                  marginBottom: "-5px",
                                }}
                              >
                                {item.icon}
                              </Box>
                              <span
                                style={{
                                  color: isDisabled ? "#ffb3b3" : "#fff",
                                  fontWeight: "500",
                                  fontSize: "1.05rem",
                                }}
                              >
                                {item.name}
                                {isDisabled && " (Próximamente)"} {/* 👈 mensaje opcional */}
                              </span>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
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
                    px: 2,
                    py: 1,
                    mx: 2,
                    mb: 0,
                    pt: 0,
                    color: "#ffffff",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 0 12px rgba(255,255,255,0.05)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
                    <Box
                      component="img"
                      src="/logo-plataformas-web.png"
                      alt="Bienvenidos"
                      sx={{
                        width: 110,
                        height: 70,
                        objectFit: "contain",
                        borderRadius: 2,
                        mr: 1,
                      }}
                    />
                    <Typography
                      fontSize="0.8rem"
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
                      mb: 1.1,
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Conecta y trabaja con nosotros.
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
                        const offset = -80;
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

          {/* Administración */}
          {open && (
            <motion.div
              variants={bienvenidaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Box
                onClick={() => navigate("/administracion")}
                sx={{
                  background: `
          radial-gradient(circle at top left, rgba(144,202,249,0.1), transparent 70%),
          linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))
        `,
                  borderRadius: 3,
                  px: 2,
                  py: 2,
                  mx: 2,
                  mt: 1,
                  color: "#ffffff",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 0 12px rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  maxHeight: 45,
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.05)",
                    boxShadow: "0 0 16px rgba(144,202,249,0.2)",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600,
                    fontSize: "1rem",
                    letterSpacing: 0.5,
                    textAlign: "center",
                  }}
                >
                  ⚙️ Administración
                </Typography>
              </Box>
            </motion.div>
          )}





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
                    marginBottom: isMobile ? 0 : 90,
                    padding: "20px 0",
                  }}
                >
                  {["Instagram", "Facebook", "LinkedIn"].map((social, index) => {
                    const info = socialData[social];

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
                          href={info.href}
                          Icon={info.Icon}
                          bgColor={info.bgColor}
                          hoverStyles={{
                            color: info.hoverColor,
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
      {/* PDF */}
      <Dialog
        open={openPDF}
        onClose={handleClosePDF}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: "#f5f7fa",
            color: "#1a1a1a",
            borderRadius: 3,
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.7)"
          }
        }}
        disableScrollLock
      >

        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            px: 3,
            py: 2.5,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            position: "relative",
            background: `linear-gradient(135deg, #e0f2ff 0%, #ffffff 100%)`,
            color: "#1a237e",
          }}
        >
          Presentación Plataformas.web - PDF
          <IconButton aria-label="close" onClick={handleClosePDF} sx={{ position: "absolute", right: 12, top: 12, color: "#1a237e" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: { xs: "75vh", sm: "80vh", md: "85vh" }, width: "100%", backgroundColor: "#000", }}>

            <iframe src={pdfSrc} title="Presentación Plataformas web" width="100%" height="100%" style={{ border: 'none' }} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Navbar;
