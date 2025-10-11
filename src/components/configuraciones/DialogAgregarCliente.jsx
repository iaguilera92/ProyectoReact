import React, { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Slide,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import { motion, AnimatePresence } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogAgregarCliente({ open, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  const [form, setForm] = useState({
    sitioWeb: "",
    URL: "",
    telefono: "",
    correo: "",
    pagado: 0,
    valor: "",
    fechaPago: "",
    estado: 1,
    logoCliente: "",
  });

  useEffect(() => {
    if (success) {
      // 🚀 Llama inmediatamente al padre para actualizar la grilla
      onSave(form);

      // Mantiene la animación 3 segundos, pero sin retrasar el refresh
      const timer = setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      setForm({
        sitioWeb: "",
        URL: "",
        telefono: "",
        correo: "",
        pagado: 0,
        valor: "",
        fechaPago: "",
        estado: 1,
        logoCliente: "",
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Validación de campos obligatorios
    if (!form.nombreCliente || !form.sitioWeb || !form.URL || !form.telefono || !form.correo) {
      setSnackbar({
        open: true,
        type: "error",
        message: "⚠️ Completa todos los campos obligatorios",
      });
      return;
    }

    try {
      setLoading(true);

      // 📡 URL del endpoint (modo local o producción)
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/agregarCliente`;

      // 🚀 Envío de datos al backend
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al guardar cliente");

      setSuccess(true);
      setSnackbar({
        open: true,
        type: "success",
        message: "✅ Cliente agregado correctamente",
      });
    } catch (error) {
      console.error("❌ Error al guardar cliente:", error);
      setSnackbar({
        open: true,
        type: "error",
        message: "Hubo un problema al guardar el cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      scroll="body"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 0, sm: -3 },
          borderRadius: 2,
          border: "1px solid rgba(129,245,180,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 2,
          borderBottom: "2px solid rgba(255,215,0,0.35)",
          position: "relative",
          overflow: "hidden",

          // 🌟 Fondo dorado con degradado animado
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #FFD700 0%, #FFC300 30%, #FFB000 60%, #FFD54F 100%)",
            backgroundSize: "250% 250%",
            animation: "goldShift 8s ease-in-out infinite",
            zIndex: 0,
            "@keyframes goldShift": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          },

          // ✨ Brillo interno — Sheen diagonal (idéntico a tus botones)
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
            transform: "translateX(-100%)",
            animation: "shineDiagonal 4s ease-in-out infinite",
            pointerEvents: "none",
            zIndex: 1,
            "@keyframes shineDiagonal": {
              "0%": { transform: "translateX(-120%) rotate(0deg)" },
              "100%": { transform: "translateX(120%) rotate(0deg)" },
            },
          },

          // 🔤 Texto y elementos por encima del fondo y brillo
          "& > *": {
            position: "relative",
            zIndex: 2,
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          },
        }}
      >
        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFF",
            zIndex: 5,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Título */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            px: 2,
            py: 0.8,
            borderRadius: "999px",
            bgcolor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
          }}
        >
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.5px",
              fontFamily: "'Poppins', sans-serif",
              color: "#fff",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {success ? "¡Éxito!" : "Agregar Cliente"}
          </Typography>
          <PersonAddRoundedIcon sx={{ color: "#fff", fontSize: 24 }} />
        </Box>
      </DialogTitle>

      {/* CONTENIDO */}
      <DialogContent
        dividers
        sx={{
          py: 1,
          pb: 0,
          bgcolor: success ? "#fff9db" : "#fffbea", // 🎨 amarillo pastel limpio
          backgroundImage: success
            ? "linear-gradient(180deg, #fff9db, #fff6cc)"
            : "linear-gradient(180deg, #fffef4, #fffbea)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{ textAlign: "center" }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#FFD54F",
                  borderRadius: "50%",
                  width: 96,
                  height: 96,
                  mb: 2,
                  boxShadow: "0 0 12px rgba(255, 215, 0, 0.6)",
                }}
              >
                <CheckIcon sx={{ fontSize: 60, color: "#fff" }} />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{
                  color: "#B28704",
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                }}
              >
                🎉 ¡Cliente agregado correctamente!
              </Typography>

            </motion.div>
          ) : (
            <Box display="flex" flexDirection="column" gap={1}>
              {/* 💼 DATOS DEL CLIENTE */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#B28704",
                    fontWeight: 700,
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  💼 Datos del Cliente
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="👤 Nombre Cliente"
                    name="nombreCliente"
                    value={form.nombreCliente}
                    onChange={handleChange}
                    size="small"
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                  <TextField
                    label="📱 Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setForm((p) => ({ ...p, telefono: val }));
                    }}
                    size="small"
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                  <TextField
                    label="✉️ Correo"
                    name="correo"
                    type="email"
                    value={form.correo}
                    onChange={handleChange}
                    size="small"
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* 🏢 INFORMACIÓN DEL NEGOCIO */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#B28704",
                    fontWeight: 700,
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                  }}
                >
                  🏢 Información del Negocio
                </Typography>

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="🌐 Sitio Web"
                    name="sitioWeb"
                    value={form.sitioWeb}
                    onChange={handleChange}
                    size="small"
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                  <TextField
                    label="🔗 URL"
                    name="URL"
                    value={form.URL}
                    onChange={handleChange}
                    size="small"
                    required
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                  <TextField
                    label="💰 Valor"
                    name="valor"
                    value={form.valor || "$10.000"}
                    onChange={handleChange}
                    size="small"
                    placeholder="$10.000"
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />
                  <TextField
                    label="🖼️ Logo Cliente (URL)"
                    name="logoCliente"
                    value={form.logoCliente}
                    onChange={handleChange}
                    size="small"
                    placeholder="https://..."
                    sx={{
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#FFD54F" },
                        "&.Mui-focused fieldset": { borderColor: "#FBC02D", borderWidth: 2 },
                      },
                    }}
                  />

                  <FormControl>
                    <FormLabel sx={{ fontWeight: 700, color: "#8D6E00" }}>¿Pagado?</FormLabel>
                    <RadioGroup
                      row
                      name="pagado"
                      value={String(form.pagado)}
                      onChange={(e) => setForm((p) => ({ ...p, pagado: Number(e.target.value) }))}
                    >
                      <FormControlLabel value="1" control={<Radio color="success" />} label="✅ Sí" />
                      <FormControlLabel value="0" control={<Radio color="error" />} label="❌ No" />
                    </RadioGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel sx={{ fontWeight: 700, color: "#8D6E00", mt: -2 }}>Estado</FormLabel>
                    <RadioGroup
                      row
                      name="estado"
                      value={String(form.estado)}
                      onChange={(e) => setForm((p) => ({ ...p, estado: Number(e.target.value) }))}
                    >
                      <FormControlLabel value="1" control={<Radio color="success" />} label="🟢 Activo" />
                      <FormControlLabel value="0" control={<Radio color="error" />} label="🔴 Inactivo" />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </DialogContent>


      {/* FOOTER */}
      <DialogActions
        sx={{
          justifyContent: "center",
          py: 1.6,
          background: "linear-gradient(90deg, #FFF8E1, #FFECB3, #FFE082)", // dorado suave
          borderTop: "1px solid rgba(255,215,0,0.35)",
        }}
      >
        {success ? (
          <Button
            variant="contained"
            disabled
            sx={{
              fontWeight: 700,
              textTransform: "none",
              color: "#fff",
              background: "linear-gradient(135deg, #FFD54F, #FBC02D, #F9A825)",
              boxShadow: "0 0 12px rgba(255,215,0,0.5)",
            }}
          >
            Cliente Agregado 💛
          </Button>
        ) : (
          <>
            {/* 🔸 Botón cancelar */}
            <Button
              onClick={onClose}
              sx={{
                color: "#B28704",
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                minWidth: 160,
                border: "1px solid #B28704",
                backgroundColor: "rgba(255,255,255,0.25)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.45)",
                  borderColor: "#FFD54F",
                },
              }}
            >
              Cancelar
            </Button>

            {/* 💎 Botón Crear Cliente con brillo animado */}
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                position: "relative",
                overflow: "hidden",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                minWidth: 160,
                color: "#fff",
                background: "linear-gradient(135deg, #FFD54F, #FFB300, #FFA000)",
                boxShadow: "0 0 12px rgba(255,215,0,0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #FFEE58, #FFC107, #FFB300)",
                  boxShadow: "0 0 16px rgba(255,215,0,0.6)",
                },

                // ✨ Sheen diagonal
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(130deg, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%)",
                  transform: "translateX(-100%)",
                  animation: "shineDiagonal 4s ease-in-out infinite",
                  pointerEvents: "none",
                  borderRadius: "inherit",
                  "@keyframes shineDiagonal": {
                    "0%": { transform: "translateX(-120%) rotate(0deg)" },
                    "100%": { transform: "translateX(120%) rotate(0deg)" },
                  },
                },
              }}
            >
              Crear Cliente
            </Button>
          </>
        )}
      </DialogActions>


      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.65)",
            backdropFilter: "blur(3px)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="success" size={48} />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog>
  );
}
