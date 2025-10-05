import React, { useState, useEffect, useRef } from "react";
import {
  Box, Link, TextField, Button, Typography, Paper, InputAdornment,
  IconButton, useMediaQuery, Alert, useTheme, Checkbox, FormControlLabel
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { validarCredenciales } from "../helpers/HelperUsuarios";
import Fade from "@mui/material/Fade";
import "./css/Administracion.css"; // Importamos el CSS
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

const Administracion = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });

  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const emailRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textToType = useRef("Iniciar sesión");
  const [logoAnimacion, setLogoAnimacion] = useState("idle"); // idle | pendulo | error
  const logoTimeoutRef = useRef(null);
  const [estadoMensaje, setEstadoMensaje] = useState("idle");
  const [logoBase, setLogoBase] = useState("/logo-james.webp");
  const modoDesarrollo = false;

  const showSnackbar = (type, message) => {
    setSnackbar({ open: true, type, message });
    setTimeout(() => setSnackbar(prev => ({ ...prev, open: false })), 4000);
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const getLogoAnimado = () => {
    if (logoAnimacion === "error") return logoBase.replace(".webp", "-enojada.webp").replace(".png", "-enojada.png");
    return logoBase;
  };

  const handleSubmit = async (e) => {
    if (logoAnimacion === "error" || isSubmitting) return;

    e.preventDefault();
    setIsSubmitting(true);

    const usuarioValido = await validarCredenciales(email, password);

    if (usuarioValido) {
      setLogoAnimacion("pendulo");

      sessionStorage.setItem("credenciales", JSON.stringify({ email, password }));
      if (recordarme) {
        localStorage.setItem("credenciales", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("credenciales");
      }

      sessionStorage.setItem("snackbar", JSON.stringify({
        open: true,
        type: "success",
        message: `Bienvenido ${usuarioValido.nombre} 😎`
      }));
      sessionStorage.setItem("usuario", JSON.stringify(usuarioValido));

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      setLogoAnimacion("error");

      setTimeout(() => {
        setLogoAnimacion("idle");
        setIsSubmitting(false);
      }, 800);

      showSnackbar("error", "Usuario o contraseña incorrectos");
    }
  };


  useEffect(() => {
    return () => {
      if (logoTimeoutRef.current) clearTimeout(logoTimeoutRef.current);
    };
  }, []);


  useEffect(() => {
    if (modoDesarrollo) {
      // Si es desarrollo, siempre usar user.png
      setLogoBase("/user.webp");

      // Preload de variante enojada
      const angry = new Image();
      angry.src = "/user-enojada.webp";
    } else {
      // Modo normal (random entre james, flaca, gorda)
      const logos = ["/logo-james.webp", "/logo-flaca.webp", "/logo-gorda.webp"];
      setLogoBase(logos[Math.floor(Math.random() * logos.length)]);

      // Preload variantes enojadas
      logos.forEach((logo) => {
        const angry = new Image();
        angry.src = logo.replace(".webp", "-enojada.webp");
      });
    }

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: "auto" });

    // Bloquear scroll global
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  useEffect(() => {
    let i = 0;
    const text = textToType.current; // "Iniciar sesión"

    const typeNext = () => {
      if (i < text.length) {
        setTypedText(text.slice(0, i + 1)); // 👈 escribe hasta la posición actual
        i++;
        setTimeout(typeNext, 100);
      } else {
        setShowCursor(false);
      }
    };

    typeNext();

    // limpiar si el componente se desmonta
    return () => {
      i = text.length;
    };
  }, []);



  useEffect(() => {
    const creds = JSON.parse(localStorage.getItem("credenciales"));
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setRecordarme(true);
    }

    if (creds?.email?.toLowerCase() === "iaguilera") {
      sessionStorage.setItem("mostrarAdmin", "1");
    }
  }, []); // 👈 se ejecuta solo al montar



  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        touchAction: "manipulation",
      }}
    >
      {/* Fondo inferior (55%) */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: isMobile ? "60%" : "55%",   // solo ocupa el 55% inferior
          backgroundImage: "url(/fondo-administracion.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          zIndex: 0,

        }}
      />

      {/* Fondo superior (45%) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? "40%" : "45%",   // solo ocupa el 45% superior
          backgroundImage: isMobile ? "url(/fondo-adm-1.webp)" : "url(/fondo-adm-2.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center right 30%",
          backgroundRepeat: "no-repeat",
          zIndex: 0,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.1)", // oscurece un poco
          },
        }}
      />

      {/* Contenido (login box, etc) */}
      <MotionPaper
        elevation={6}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          background:
            logoAnimacion === "error"
              ? "linear-gradient(145deg, #3b0000, #5c0000, #8b0000, #b22222, #d32f2f, #7b1fa2)"
              : "rgba(0,0,0,0.7)"
        }}
        transition={{
          duration: logoAnimacion === "error" ? 0.4 : 0.6,
          ease: "easeOut",
        }}
        sx={{
          color: "white",
          p: isMobile ? 4 : 5,
          borderRadius: 3,
          maxWidth: isMobile ? 350 : 450,
          width: isMobile ? "90%" : "100%",
          textAlign: "center",
          backdropFilter: "blur(6px)",
          zIndex: 2,
        }}
      >

        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            padding: "3px",
            background:
              logoAnimacion === "error"
                ? "radial-gradient(circle at 30% 30%, #ff8a80, #e53935, #b71c1c)"
                : "radial-gradient(circle at 30% 30%, #ffe082, #ffb300, #ff6f00, #e65100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 1,
            transition: "background 0.4s ease",
          }}
        >
          {/* Fondo negro fijo */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Imagen con efecto pendular */}
            <motion.div
              animate={
                logoAnimacion === "error"
                  ? {
                    filter: [
                      "brightness(1) contrast(1)",
                      "brightness(1.2) contrast(1.5) drop-shadow(0 0 10px red)",
                      "brightness(1) contrast(1)",
                    ],
                    scale: [1, 1.05, 1],
                  }
                  : {
                    filter: "brightness(1) contrast(1)",
                    scale: 1,
                  }
              }
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
              }}
            >
              <motion.img
                src={getLogoAnimado()}
                alt="Usuario"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  transformOrigin: "center center",
                }}
                animate={
                  logoAnimacion === "pendulo"
                    ? { rotate: [-10, 10, -8, 8, -6, 6, 0] }
                    : logoAnimacion === "error"
                      ? { x: [-6, 6, -5, 5, -2, 2, 0] }
                      : { rotate: 0, x: 0 }
                }
                transition={{
                  duration: logoAnimacion === "error" ? 0.5 : 1.2,
                  ease: "easeInOut",
                  repeat: logoAnimacion === "pendulo" ? Infinity : 0,
                }}
              />
            </motion.div>


          </Box>
        </Box>



        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ fontFamily: "monospace", color: "white", minHeight: "1.5em" }}
        >
          {estadoMensaje === "cargando" ? (
            <DotsAnimation />
          ) : estadoMensaje === "error" ? (
            "Usuario incorrecto"
          ) : (
            <>
              {typedText}
              {showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    fontWeight: "bold",
                    transform: "scaleX(1.8)",
                  }}
                >
                  |
                </span>
              )}
            </>
          )}
        </Typography>


        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            inputRef={emailRef}
            fullWidth
            variant="filled"
            label="Usuario o correo"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: {
                backgroundColor: logoAnimacion === "error" ? "#fff" : "#ffffff10",
                color: logoAnimacion === "error" ? "black" : "white",
              },
            }}
            InputLabelProps={{
              style: { color: logoAnimacion === "error" ? "#333" : "#bbb" },
            }}
          />

          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            variant="filled"
            label="Contraseña"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: {
                backgroundColor: logoAnimacion === "error" ? "#fff" : "#ffffff10",
                color: logoAnimacion === "error" ? "black" : "white",
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    sx={{ color: logoAnimacion === "error" ? "black" : "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              style: { color: logoAnimacion === "error" ? "#333" : "white" },
            }}
          />

          <FormControlLabel
            control={<Checkbox checked={recordarme} onChange={(e) => setRecordarme(e.target.checked)} sx={{ color: "white" }} />}
            label="Recordarme" sx={{ color: "#bbb", mt: 0, fontSize: "0.8rem" }}
          />
          <motion.div
            initial={false}
            animate={{ scale: isSubmitting ? 0.98 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              disabled={isSubmitting}
              sx={{
                mt: 2,
                height: 45,
                position: "relative",
                color: isSubmitting ? "#fff" : "white",
                backgroundColor: isSubmitting ? "#E95420" : "transparent",
                borderColor: isSubmitting ? "#E95420" : "white",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: "#E95420",
                  backgroundColor: "#E95420",
                },
                "&.Mui-disabled": {
                  borderColor: "#888",
                  color: "#ccc",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={22} sx={{ color: "#fff" }} />
              ) : (
                "Entrar"
              )}
            </Button>

          </motion.div>

          <Box sx={{ mt: 2 }}>
            <Link
              component="button"
              type="button"   // 👈 esto evita que dispare el onSubmit
              onClick={() => {
                sessionStorage.removeItem("credenciales");
                localStorage.removeItem("credenciales");
                navigate("/");
              }}
              underline="hover"
              sx={{ color: "#bbb", fontSize: "0.9rem", "&:hover": { color: "#E95420" } }}
            >
              ← Volver al inicio
            </Link>
          </Box>
        </Box>
      </MotionPaper>

      <Fade in={snackbar.open} timeout={{ enter: 400, exit: 400 }} unmountOnExit>
        <Box sx={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: 400 }}>
          <Alert severity={snackbar.type} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))} sx={{
            fontSize: "0.9rem", borderRadius: 2, boxShadow: 3
          }}>
            {snackbar.message}
          </Alert>
        </Box>
      </Fade>
    </Box>
  );
};

const DotsAnimation = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return <span style={{ fontWeight: "bold" }}>Cargando{dots}</span>;
};

export default Administracion;
