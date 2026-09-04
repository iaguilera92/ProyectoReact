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
import DialogOneClickMall from "./DialogOneClickMall";


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



const SocialButton = ({ href, Icon, bgColor }) => (
  <Box component="a" href={href} target="_blank" rel="noopener" sx={{
    width: 52, height: 52, borderRadius: "14px", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", overflow: "hidden", textDecoration: "none",
    background: bgColor, border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
    "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 20px rgba(0,0,0,0.4)", opacity: 0.9 },
  }}>
    <Icon sx={{ color: "white", fontSize: 26 }} />
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
  const [conCupos, setConCupos] = useState(() => {
    const savedValue = localStorage.getItem("ConCupos");
    return savedValue === "true";
  });
  const showTopBanner = location.pathname === "/" && conCupos;
  const [animacionMostrada, setAnimacionMostrada] = useState(false);
  const mostrarLogo = mostrarAnimacion || animacionMostrada;
  const [scrollY, setScrollY] = useState(0);
  const maxScroll = 80; // hasta dónde se desvanece
  const translateY = Math.min(scrollY, maxScroll);
  const [mostrarTexto, setMostrarTexto] = useState(true);
  const [openDialogOneClick, setOpenDialogOneClick] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [hoveredDesktopItem, setHoveredDesktopItem] = useState(null);

  useEffect(() => {
    const syncConCupos = () => {
      const savedValue = localStorage.getItem("ConCupos");
      setConCupos(savedValue === "true");
    };

    window.addEventListener("storage", syncConCupos);
    window.addEventListener("conCuposChanged", syncConCupos);

    return () => {
      window.removeEventListener("storage", syncConCupos);
      window.removeEventListener("conCuposChanged", syncConCupos);
    };
  }, []);

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
      Suscribirse: () => handleOpenOneClick("Ignacio Aguilera", "plataformas.web.cl@gmail.com"),
    };
    actions[item.name]?.();
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  const LogoInicio = () => (navigate("/"), scrollToTop());

  useEffect(() => {
    if (mostrarAnimacion) {
      setAnimacionMostrada(true);
    }
  }, [mostrarAnimacion]);


  // 🚀 Inscripción OneClick Mall + PayPal
  // 🚀 Inscripción OneClick Mall + PayPal
  const handleSuscribirse = async (sitioWeb, cliente) => {
    try {
      if (!cliente?.nombre || !cliente?.correo || !cliente?.idCliente) {
        console.error("⚠️ Datos incompletos del cliente:", cliente);
        alert("Faltan los datos del cliente.");
        return null;
      }

      const isLocal = window.location.hostname === "localhost";
      const endpoint = isLocal
        ? "http://localhost:8888/.netlify/functions/suscribirse"
        : "/.netlify/functions/suscribirse";

      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: cliente.nombre,
          email: cliente.correo,
          sitioWeb,
          idCliente: cliente.idCliente,
          clienteInternacional: cliente.clienteInternacional ?? 0,
          paypalPlanMode: cliente.paypalPlanMode ?? "standard",
          esClientePaypalPrueba: cliente.paypalPlanMode === "test",
        }),
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("❌ Error HTTP suscribirse:", errorText);
        alert("Ocurrió un error al comunicarse con el servidor.");
        return null;
      }

      const data = await resp.json();
      console.log("🔵 Respuesta suscribirse:", data);
      return data;
    } catch (err) {
      console.error("❌ Error en handleSuscribirse:", err);
      alert("Error al iniciar la suscripción. Ver consola para más detalles.");
      return null;
    }
  };
  // 🟢 Abre el diálogo para suscribirse
  const handleOpenOneClick = (nombre, correo, idCliente) => {
    setPendingUser({ nombre, correo, idCliente });
    setOpenDialogOneClick(true);
  };

  // 🔴 Cierra el diálogo
  const handleCloseOneClick = () => {
    setOpenDialogOneClick(false);
    setPendingUser(null);
    navigate("/", { replace: true });
  };

  // ✅ Confirma el inicio del flujo de inscripción OneClick Mall
  const handleConfirmOneClick = async (sitioWeb, cliente) => {
    if (!cliente?.nombre || !cliente?.correo || !cliente?.idCliente) {
      console.error("⚠️ No se recibieron datos válidos del cliente");
      alert("Faltan los datos del cliente asociados al sitio web.");
      return;
    }

    try {
      const result = await handleSuscribirse(sitioWeb, cliente);

      return result; // opcional, si quieres capturarlo en otro handler
    } catch (err) {
      console.error("❌ Error en handleConfirmOneClick:", err);
      alert("No se pudo iniciar la suscripción. Intenta nuevamente.");
    }
  };

  //Visa TEST
  //Número: 4051885600446623
  //Fecha de vencimiento: 12/12
  //CVV: 123
  //Rut: 11.111.111-1
  //Clave: 123

  // DETECTAR URL
  useEffect(() => {
    let timer;
    if (location.pathname === "/suscribir") {
      timer = setTimeout(() => {
        setOpenDialogOneClick(true);
      }, 2300); // ⏳ espera 2.3 segundos
    }
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Abrir suscripción desde otros componentes (ej: chat)
  useEffect(() => {
    const handleOpenFromEvent = (e) => {
      const detail = e?.detail || {};
      const nombre = detail.nombre || "Ignacio Aguilera";
      const correo = detail.correo || "plataformas.web.cl@gmail.com";
      handleOpenOneClick(nombre, correo);
    };
    window.addEventListener("openOneClickMall", handleOpenFromEvent);
    return () => window.removeEventListener("openOneClickMall", handleOpenFromEvent);
  }, []);



  return (
    <>
      {showTopBanner && (
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
              background: "linear-gradient(135deg, #00ACEE, #027EFB)",
              height: { xs: 30, sm: 32 },
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow:
                scrollY < maxScroll
                  ? "0px 2px 10px rgba(2,126,251,0.4)"
                  : "none",
              transition: "box-shadow 0.3s ease, transform 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0px 4px 14px rgba(0,172,238,0.6)",
                background:
                  "linear-gradient(135deg, hsl(204deg 100% 50%), hsl(214deg 95% 48%))",
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
                    <span>
                      {mostrarTexto ? "¡QUEDAN 5 CUPOS!" : "¡SOLICITA TU WEB!"}
                    </span>
                  </span>

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
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      )}




      <Box
        sx={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          width: "96%",
          zIndex: 1100,
          borderRadius: "50px",
          overflow: "hidden",
          marginTop: showTopBanner ? `${Math.max(40 - translateY, 15)}px` : "12px",
          transition: "box-shadow 0.4s ease, border-color 0.4s ease",
          border: isScrolled ? "1px solid rgba(0,180,255,0.18)" : "1px solid transparent",
          boxShadow: isScrolled ? "0 8px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,180,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)" : "none",
        }}
      >
        <AppBar
          position="relative"
          sx={{
            backgroundColor: isScrolled ? "rgba(4,12,30,0.82)" : "transparent",
            backdropFilter: isScrolled ? "blur(20px) saturate(160%)" : "none",
            boxShadow: "none",
            transition: "all 0.4s ease",
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

              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0 }}>
                {menuItems
                  .map((item, index) => {
                    const isInicioActive = item.name === "Inicio" && location.pathname === "/";
                    const showUnderline = hoveredDesktopItem
                      ? hoveredDesktopItem === item.name
                      : isInicioActive;

                    return (
                    <Button
                      key={item.name}
                      component={motion.button}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={menuItemVariants}
                      onClick={() => handleClick(item)}
                      onMouseEnter={() => setHoveredDesktopItem(item.name)}
                      onMouseLeave={() => setHoveredDesktopItem(null)}
                      sx={{
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        padding: "8px 10px",
                        fontSize: "0.85rem",
                        background: "transparent",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        position: "relative",
                        fontWeight: 600,
                        textShadow: showUnderline ? "0 1px 6px rgba(59,130,246,0.35)" : "none",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          left: "50%",
                          bottom: 4,
                          width: showUnderline ? "68%" : 0,
                          height: "4px",
                          borderRadius: "999px",
                          transform: "translateX(-50%)",
                          background: "linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)",
                          boxShadow: showUnderline ? "0 0 10px rgba(56,189,248,0.65)" : "none",
                          transition: "width 0.28s ease, box-shadow 0.28s ease",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.1)",
                          "&::after": {
                            width: "68%",
                            boxShadow: "0 0 10px rgba(56,189,248,0.5)",
                          },
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {item.name}
                    </Button>
                    );
                  })}
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
        disableScrollLock
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            height: "100dvh",
            width: { xs: '82vw', sm: '55vw', md: '45vw' },
            maxWidth: '420px',
            minWidth: '280px',
            backgroundColor: "#040e20",
            background: "linear-gradient(160deg, #040e20 0%, #071a34 50%, #0a2240 100%)",
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            color: '#ffffff',
            boxShadow: '-4px 0 40px rgba(0,0,0,0.7)',
            borderLeft: '1px solid rgba(0,180,255,0.12)',
            p: 0,
            overflowX: "hidden",
          },
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0,0,0,0.75)",
          },
        }}
      >
        <Box sx={{ overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* ── Header ── */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2.5, pb: 2, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <Box component="img" src="/logo-plataformas-web.png" alt="Logo" onClick={LogoInicio} sx={{ height: 42, objectFit: "contain", cursor: "pointer" }} />
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.08)" }, animation: open ? `${rotateTwice} 0.8s ease-in-out` : "none" }}
            >
              <Close sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>


          {/* ── Nav items ── */}
          <AnimatePresence mode="wait">
            {open && (
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
                style={{ listStyle: "none", padding: "12px 16px", margin: 0, width: "100%", boxSizing: "border-box" }}
              >
                {menuItems.map((item) => {
                  const isDisabled = item.name === "MenuBloqueado";
                  return (
                    <ListItem key={item.name} component={motion.li} variants={itemVariants} disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => !isDisabled && handleClick(item)}
                        disabled={isDisabled}
                        sx={{
                          px: 1.5, py: 1.1,
                          borderRadius: "12px",
                          backgroundColor: "transparent",
                          border: "1px solid transparent",
                          transition: "all 0.22s ease",
                          "&:hover": {
                            backgroundColor: "rgba(0,160,255,0.08)",
                            border: "1px solid rgba(0,180,255,0.2)",
                            "& .nav-arrow": { opacity: 1, transform: "translateX(0)" },
                            "& .nav-icon": { color: "#38bdf8" },
                          },
                          opacity: isDisabled ? 0.45 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                        }}
                      >
                        <Box className="nav-icon" sx={{ color: "rgba(255,255,255,0.45)", fontSize: "1.25rem", display: "flex", mr: 1.5, transition: "color 0.22s ease" }}>
                          {item.icon}
                        </Box>
                        <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#fff", flexGrow: 1 }}>
                          {item.name}
                        </Typography>
                        <ArrowForwardIosRoundedIcon className="nav-arrow" sx={{ fontSize: 13, color: "#38bdf8", opacity: 0, transform: "translateX(-6px)", transition: "all 0.22s ease" }} />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* 🧱 Espacio flexible para empujar bienvenida y redes al fondo */}
          <Box sx={{ flexGrow: 1 }} />

          {/* ── Footer ── */}
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
                    background: "linear-gradient(135deg, rgba(0,100,200,0.18) 0%, rgba(0,40,100,0.12) 100%)",
                    borderRadius: "16px",
                    px: 2,
                    py: 2,
                    mx: 2,
                    mb: 1.5,
                    color: "#ffffff",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0,180,255,0.18)",
                  }}
                >
                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#fff", mb: 0.4 }}>
                    ¿Necesitas una web?
                  </Typography>
                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", mb: 1.2, lineHeight: 1.5 }}>
                    Entrega en 72h · Soporte incluido
                  </Typography>


                  <Button
                    size="small"
                    onClick={() => {
                      if (informationsRef?.current) {
                        const y = informationsRef.current.getBoundingClientRect().top + window.scrollY - 80;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        setOpen(false);
                      }
                    }}
                    sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.78rem", textTransform: "none", color: "#38bdf8", p: 0, "&:hover": { color: "#fff", backgroundColor: "transparent" } }}
                    endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: "11px !important" }} />}
                  >
                    Empezar ahora
                  </Button>
                </Box>

                {/* Admin */}
                <Box onClick={() => navigate("/administracion")} sx={{ mx: 2, mb: 1.5, px: 2, py: 1.2, borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.22s ease", "&:hover": { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" } }}>
                  <Typography sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>⚙️ Administración</Typography>
                </Box>

                {/* Redes */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, pb: 3 }}>
                  {["Instagram", "Facebook", "LinkedIn"].map((social) => {
                    const info = socialData[social];
                    return (
                      <SocialButton key={social} href={info.href} Icon={info.Icon} bgColor={info.bgColor}
                        hoverStyles={{ color: info.hoverColor, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                      />
                    );
                  })}
                </Box>

              </motion.div>
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

      {/* ONE CLICK MALL */}
      <DialogOneClickMall
        open={openDialogOneClick}
        onClose={handleCloseOneClick}
        onConfirm={handleConfirmOneClick}
        primaryLabel="Suscribirme"
      />
    </>
  );
}

export default Navbar;



