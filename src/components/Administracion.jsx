import React, { useState, useEffect, useRef } from "react";
import {
  Box, Link, TextField, Button, Typography, Paper, InputAdornment,
  IconButton, useMediaQuery, Snackbar, Alert, useTheme, Checkbox, FormControlLabel
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { validarCredenciales } from "../helpers/HelperUsuarios";
import Fade from "@mui/material/Fade";

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
  const textToType = useRef("Iniciar sesión");
  const currentIndex = useRef(0);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioValido = await validarCredenciales(email, password);
    if (usuarioValido) {
      if (recordarme) {
        localStorage.setItem("credenciales", JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem("credenciales");
      }

      // 🧠 Guardar datos en sessionStorage antes de redirigir
      sessionStorage.setItem("snackbar", JSON.stringify({
        open: true,
        type: "success",
        message: `Bienvenido ${usuarioValido.nombre} 😎`
      }));
      sessionStorage.setItem("usuario", JSON.stringify(usuarioValido));

      // 🚀 Redirige limpiando caché
      window.location.href = "/dashboard";
    }
    else {
      setSnackbar({ open: true, type: "error", message: "Usuario o contraseña incorrectos" });
    }
  };

  // Efecto para ocultar snackbar
  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  // Efecto de tipeo
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

  // Evitar scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Cargar credenciales guardadas
  useEffect(() => {
    const creds = JSON.parse(localStorage.getItem("credenciales"));
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      setRecordarme(true);
    }
  }, []);

  return (
    <Box sx={{
      height: "100vh", width: "100vw", backgroundImage: "url(/fondo-administracion.jpg)",
      backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)",
      position: "relative", overflow: "hidden",
    }}>
      <Paper elevation={3} sx={{
        backgroundColor: "rgba(0,0,0,0.6)", color: "white", p: 4, borderRadius: 3,
        maxWidth: 350, width: "90%", textAlign: "center", mt: isMobile ? -2 : 0
      }}>
        <Box component="img" src="/user.png" alt="Usuario" sx={{
          width: 80, height: 80, borderRadius: "50%", objectFit: "cover",
          margin: "0 auto", mb: 2, border: "2px solid #E95420"
        }} />
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontFamily: "monospace", color: "white", minHeight: "1.5em" }}>
          {typedText}{showCursor && <span style={{ display: "inline-block", fontWeight: "bold", transform: "scaleX(1.8)" }}>|</span>}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth variant="filled" label="Usuario o correo" margin="dense"
            value={email} onChange={(e) => setEmail(e.target.value)}
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
          <Button type="submit" fullWidth variant="outlined" sx={{
            mt: 2, color: "white", borderColor: "white",
            "&:hover": { borderColor: "#E95420", backgroundColor: "#E95420" }
          }}>
            Entrar
          </Button>
          <Box sx={{ mt: 2 }}>
            <Link component="button" onClick={() => navigate("/")} underline="hover" sx={{
              color: "#bbb", fontSize: "0.9rem", "&:hover": { color: "#E95420" }
            }}>
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

export default Administracion;
