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
  const currentIndex = useRef(0);
  const [logo, setLogo] = useState("/logo-james.png");

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const usuarioValido = await validarCredenciales(email, password);

    if (usuarioValido) {
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

      // ⏳ Esperar 1 segundo antes de navegar
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      setIsSubmitting(false);
      setSnackbar({ open: true, type: "error", message: "Usuario o contraseña incorrectos" });
    }
  };


  useEffect(() => {
    // lista de logos disponibles
    const logos = ["/logo-james.png", "/logo-flaca.png", "/logo-gorda.png"];
    // seleccionar uno aleatorio
    const randomLogo = logos[Math.floor(Math.random() * logos.length)];
    setLogo(randomLogo);
  }, []);

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const typing = setInterval(() => {
        const nextChar = textToType.current[currentIndex.current];
        if (currentIndex.current < textToType.current.length) {
          setTypedText((prev) => prev + nextChar);
          currentIndex.current += 1;
        } else {
          clearInterval(typing);
          setShowCursor(false);
        }
      }, 100);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  useEffect(() => {
    const creds = JSON.parse(localStorage.getItem("credenciales"));
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setRecordarme(true);
    }
  }, []);

  useEffect(() => {
    if (email?.toLowerCase() === "iaguilera") {
      sessionStorage.setItem("mostrarAdmin", "1");
    }
  }, [email]);

  return (
    <Box sx={{
      height: "100vh", width: "100vw", backgroundImage: "url(/fondo-administracion.webp)",
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)",
      position: "relative", overflow: "hidden",
    }}>
      <Paper elevation={3} sx={{
        backgroundColor: "rgba(0,0,0,0.6)", color: "white", p: 4, borderRadius: 3,
        maxWidth: 350, width: "90%", textAlign: "center", mt: isMobile ? -8 : 0
      }}>
        <Box
          sx={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            padding: "3px",
            background: "radial-gradient(circle at 30% 30%, #ffe082, #ffb300, #ff6f00, #e65100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 1,
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
            <motion.img
              src={logo}
              alt="Usuario"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                transformOrigin: "bottom center", // 👈 pivote en la base
              }}
              animate={
                isSubmitting
                  ? { rotate: [-10, 10, -8, 8, -6, 6, 0] } // 👈 efecto péndulo
                  : { rotate: 0 }
              }
              transition={{
                duration: 1.2,
                ease: "easeInOut",
                repeat: isSubmitting ? Infinity : 0,
              }}
            />
          </Box>
        </Box>



        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: "monospace", color: "white", minHeight: "1.5em" }}>
          {isSubmitting ? <DotsAnimation /> : <>{typedText}{showCursor && <span style={{ display: "inline-block", fontWeight: "bold", transform: "scaleX(1.8)" }}>|</span>}</>}
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
            InputProps={{ style: { backgroundColor: "#ffffff10", color: "white" } }}
            InputLabelProps={{ style: { color: "#bbb" } }}
          />
          <TextField
            fullWidth type={showPassword ? "text" : "password"} variant="filled"
            label="Contraseña" margin="dense" value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: { backgroundColor: "#ffffff10", color: "white" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "#fff" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            InputLabelProps={{ style: { color: "white" } }}
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
      </Paper>

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
