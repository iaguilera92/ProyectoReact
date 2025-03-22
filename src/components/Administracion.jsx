import React, { useState, useEffect, useRef } from "react";
import {
  Box,  
  Link,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  useMediaQuery,
  Snackbar,
  Alert
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { validarCredenciales } from "../helpers/HelperUsuarios";



const Administracion = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [showPassword, setShowPassword] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const textToType = useRef("Iniciar sesión"); // ✅ text fijo y confiable
  const currentIndex = useRef(0); // ✅ índice persistente entre renders
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


//VALIDAR INICIO DE SESIÓN
const [snackbar, setSnackbar] = useState({
  open: false,
  type: "success", // "success", "error", "warning", "info"
  message: "",
});


const handleSubmit = async (e) => {
  e.preventDefault();

  const usuarioValido = await validarCredenciales(email, password);
  console.log("Resultado de validación:", usuarioValido);

  if (usuarioValido) {
    setSnackbar({
      open: true,
      type: "success",
      message: "Bienvenido 😎",
    });
  } else {
    setSnackbar({
      open: true,
      type: "error",
      message: "Usuario o contraseña incorrectos",
    });
  }
};


  useEffect(() => {
    setOpenAlert(true);
  }, []);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  // Animación de tipeo
  useEffect(() => {
    const typingInterval = setInterval(() => {
      const nextChar = textToType.current[currentIndex.current];

      if (currentIndex.current < textToType.current.length) {
        setTypedText((prev) => prev + nextChar);
        currentIndex.current += 1;
      } else {
        clearInterval(typingInterval);
        setShowCursor(false); // deja de mostrar el cursor
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url(/fondo-administracion.jpg)", // reemplaza por tu imagen
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "white",
          p: 4,
          borderRadius: 3,
          maxWidth: 350,
          width: "90%",
          textAlign: "center",
        }}
      >
        <Box
        component="img"
        src="/user.png" // asegúrate que esté en la carpeta `public/`
        alt="Usuario"
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          objectFit: "cover",
          margin: "0 auto",
          mb: 2,
          border: "2px solid #E95420",
        }}
      />

<Typography
      variant="h6"
      fontWeight="bold"
      gutterBottom
      sx={{
        fontFamily: "monospace",
        color: "white",
        minHeight: "1.5em",
      }}
    >
      {typedText}
      {showCursor && (
          <span
            style={{
              display: "inline-block",
              fontWeight: "bold",
              transform: "scaleX(1.8)", // 👉 hace el | más ancho
            }}
          >
            |
          </span>
        )}
    </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
  fullWidth
  variant="filled"
  label="Usuario o correo"
  margin="dense"
  value={email} // ← este es el estado que almacena lo escrito
  onChange={(e) => setEmail(e.target.value)} // ← actualiza el estado al escribir
  InputProps={{
    style: { backgroundColor: "#ffffff10", color: "white" },
  }}
  InputLabelProps={{
    style: { color: "#bbb" },
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
    style: { backgroundColor: "#ffffff10", color: "white" },
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={handleTogglePassword} edge="end" sx={{ color: "#fff" }}>
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  InputLabelProps={{
    style: { color: "white" },
  }}
/>

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "#E95420",
                backgroundColor: "#E95420",
              },
            }}
          >       
            Entrar
          </Button>
          <Box sx={{ mt: 2 }}>
          <Link
            component="button"
            onClick={() => navigate("/")}
            underline="hover"
            sx={{
              color: "#bbb",
              fontSize: "0.9rem",
              "&:hover": {
                color: "#E95420",
              },
            }}
          >
            ← Volver al inicio
          </Link>
        </Box>

        </Box>
        
      </Paper>    
      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={() => setSnackbar({ ...snackbar, open: false })}
  anchorOrigin={{ vertical: "top", horizontal: "center" }} // ✅ centrado
>
  <Alert
    onClose={() => setSnackbar({ ...snackbar, open: false })}
    severity={snackbar.type}
    sx={{
      width: "100%",
      maxWidth: 360,
      fontSize: "0.9rem",
      boxShadow: 3,
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>

    </Box>
    
  );
};

export default Administracion;
