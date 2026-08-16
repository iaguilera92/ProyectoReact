import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase/client";
import { Snackbar, Alert, Slider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Slide, Box, Typography, useTheme, useMediaQuery, InputAdornment } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//COLORES PROGRESO
const getGradient = (val) => {
  if (val < 20) return "linear-gradient(90deg,#ff8a80,#e57373)"; // rojo suave
  if (val < 30) return "linear-gradient(90deg,#ef5350,#e53935)"; // rojo fuerte
  if (val < 70) return "linear-gradient(90deg,#ffb74d,#fb8c00)"; // naranjo
  return "linear-gradient(90deg,#81c784,#388e3c)"; // verde
};

export default function DialogAgregarTrabajo({ open, onClose, onSave, trabajoInicial, trabajoEditar }) {
  const modoEditar = !!trabajoEditar;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    trabajo: "",
    tipoApp: "1",
    progreso: 0,
    nombreCliente: "",
    emailCliente: "",
    telefonoCliente: "",
    logoCliente: "",
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onSave(form);
        setSuccess(false);
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose, onSave, form]);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      if (modoEditar) {
        setForm({
          trabajo: trabajoEditar.SitioWeb || "",
          tipoApp: String(trabajoEditar.TipoApp || trabajoEditar.tipoApp || "1"),
          progreso: Number(trabajoEditar.Porcentaje) || 0,
          nombreCliente: trabajoEditar.NombreCliente || "",
          emailCliente: trabajoEditar.EmailCliente || "",
          telefonoCliente: String(trabajoEditar.TelefonoCliente || ""),
          logoCliente: trabajoEditar.LogoCliente || "",
        });
      } else {
        setForm({
          trabajo: trabajoInicial?.Negocio || "",
          tipoApp: trabajoInicial?.tipoApp || "1",
          progreso: trabajoInicial?.Porcentaje || 0,
          nombreCliente: "",
          emailCliente: trabajoInicial?.EmailCliente || "",
          telefonoCliente: trabajoInicial?.TelefonoCliente || "",
          logoCliente: "",
        });
      }
    }
  }, [open, trabajoInicial, trabajoEditar, modoEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = async () => {
    if (!form.trabajo || !form.tipoApp || !form.nombreCliente || !form.emailCliente || !form.telefonoCliente) {
      setSnackbar({ open: true, type: "error", message: "Completa todos los campos obligatorios" });
      return;
    }

    const base = window.location.hostname === "localhost" ? "http://localhost:8888" : "";

    try {
      setLoading(true);
      window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: modoEditar ? "Guardando trabajo..." : "Creando trabajo..." } }));

      if (modoEditar) {
        const { error } = await supabase
          .from("trabajos")
          .update({
            sitio_web: form.trabajo,
            tipo_app: Number(form.tipoApp),
            porcentaje: Number(form.progreso),
            nombre_cliente: form.nombreCliente,
            email_cliente: form.emailCliente,
            telefono_cliente: form.telefonoCliente,
            logo_cliente: form.logoCliente,
          })
          .eq("sitio_web", trabajoEditar.SitioWeb);
        if (error) throw new Error(error.message);
      } else {
        const response = await fetch(`${base}/.netlify/functions/agregarTrabajo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al guardar");
      }

      setLoading(false);
      setSuccess(true);

    } catch (error) {
      console.error("❌ Error al guardar:", error);
      setSnackbar({ open: true, type: "error", message: "Hubo un problema al guardar el trabajo." });
    } finally {
      setLoading(false);
      window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "" } }));
    }
  };



  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
      bgcolor: "#fff",
      fontSize: "0.88rem",
      "&:hover fieldset": { borderColor: "#FB8C00" },
      "&.Mui-focused fieldset": { borderColor: "#F57C00", borderWidth: 2 },
    },
    "& .MuiInputLabel-root": { fontSize: "0.88rem" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#F57C00" },
  };

  const SectionLabel = ({ icon, children }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
      <Box sx={{ color: "#E65100", display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#E65100", textTransform: "uppercase", letterSpacing: "0.09em" }}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      scroll={isMobile ? "paper" : "body"}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 0, sm: -3 },
          borderRadius: { xs: 0, sm: 2.5 },
          border: "1px solid rgba(255,167,38,.3)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
          height: { xs: "100dvh", sm: "auto" },
          maxHeight: { xs: "100dvh", sm: "90vh" },
          display: "flex",
          flexDirection: "column",
          "& .MuiDialogContent-root": { marginTop: 0 },
        },
      }}
    >
      {/* ── Header ── */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 2.5,
          borderBottom: "1px solid rgba(255,167,38,.3)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: "url('/servicio1.webp')",
            backgroundPosition: "center", backgroundRepeat: "no-repeat", zIndex: 0,
            backgroundSize: "130%",
            animation: "zoomInDesktop 2.5s ease-out forwards",
            "@media (max-width:600px)": { backgroundSize: "250%", animation: "zoomInMobile 2.5s ease-out forwards" },
            "@keyframes zoomInDesktop": { "0%": { backgroundSize: "150%" }, "100%": { backgroundSize: "110%" } },
            "@keyframes zoomInMobile": { "0%": { backgroundSize: "270%" }, "100%": { backgroundSize: "140%" } },
          },
          "&::after": {
            content: '""', position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            bgcolor: "rgba(0,0,0,0.5)", zIndex: 1,
          },
          "& > *": { position: "relative", zIndex: 2 },
        }}
      >
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute", top: 10, right: 10, color: "#FFF", zIndex: 4,
            "&:hover": { backgroundColor: "rgba(255,255,255,.12)" },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            animationFillMode: "forwards",
            "@keyframes spinTwice": { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(720deg)" } },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 22 }} />
        </IconButton>

        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.6, borderRadius: 99, bgcolor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
          <WorkOutlineIcon sx={{ color: "#FFB74D", fontSize: 18 }} />
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: { xs: "1rem", sm: "1.1rem" }, fontFamily: "'Poppins', sans-serif" }}>
            {success ? "¡Guardado!" : modoEditar ? "Editar trabajo" : "Nuevo trabajo"}
          </Typography>
        </Box>
      </DialogTitle>

      <AnimatePresence>
        {!loading && (
          <motion.div
            key="content"
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
          >
            <DialogContent
              dividers
              sx={{
                py: 3, px: { xs: 2.5, sm: 3 },
                bgcolor: success ? "#e6f4ea" : "#FFFBF5",
                position: "relative", overflow: "auto", flex: 1,
              }}
            >
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <Box textAlign="center" sx={{ py: 3 }}>
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                      >
                        <Box sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", bgcolor: "#4caf50", borderRadius: "50%", width: 88, height: 88, mb: 2, boxShadow: "0 4px 20px rgba(76,175,80,0.35)" }}>
                          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 1 }}>
                            <CheckIcon sx={{ fontSize: 52, color: "#fff", transform: "translateY(2px)" }} />
                          </motion.div>
                        </Box>
                      </motion.div>
                      <Typography variant="h6" fontWeight={700} color="success.dark">
                        {modoEditar ? "Trabajo actualizado" : "Trabajo creado correctamente"}
                      </Typography>
                    </Box>
                  </motion.div>
                ) : (
                  <Box display="flex" flexDirection="column" gap={3}>

                    {/* ── Datos del trabajo ── */}
                    <Box>
                      <SectionLabel icon={<WorkOutlineIcon sx={{ fontSize: 14 }} />}>Datos del trabajo</SectionLabel>
                      <TextField
                        label="Nombre / Sitio Web *"
                        name="trabajo"
                        value={form.trabajo}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={fieldSx}
                      />
                    </Box>

                    {/* ── Tipo ── */}
                    <Box>
                      <SectionLabel icon={<SettingsIcon sx={{ fontSize: 14 }} />}>Tipo de proyecto</SectionLabel>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {[
                          { val: "1", label: "Sitio Web", icon: <LanguageIcon sx={{ fontSize: 16 }} />, activeColor: "#1565C0", activeBg: "#EBF4FF", activeBorder: "#1976D2" },
                          { val: "2", label: "Sistema",   icon: <SettingsIcon sx={{ fontSize: 16 }} />, activeColor: "#5E35B1", activeBg: "#F0EBFF", activeBorder: "#673AB7" },
                        ].map(({ val, label, icon, activeColor, activeBg, activeBorder }) => {
                          const active = form.tipoApp === val;
                          return (
                            <Box
                              key={val}
                              onClick={() => setForm(p => ({ ...p, tipoApp: val }))}
                              sx={{
                                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75,
                                py: 1, px: 1.5, borderRadius: 1.5, cursor: "pointer", userSelect: "none",
                                border: `1.5px solid ${active ? activeBorder : "#E0E0E0"}`,
                                bgcolor: active ? activeBg : "#fff",
                                color: active ? activeColor : "#BDBDBD",
                                fontWeight: 600, fontSize: "0.83rem",
                                transition: "all 0.15s ease",
                                "&:hover": { borderColor: active ? activeBorder : "#F57C00", color: active ? activeColor : "#F57C00" },
                              }}
                            >
                              {icon}
                              <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "inherit" }}>{label}</Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    {/* ── Datos del cliente ── */}
                    <Box>
                      <SectionLabel icon={<PersonOutlineIcon sx={{ fontSize: 14 }} />}>Datos del cliente</SectionLabel>
                      <Box display="flex" flexDirection="column" gap={1.5}>
                        <TextField
                          label="Nombre del cliente *"
                          name="nombreCliente"
                          value={form.nombreCliente}
                          onChange={(e) => { if (/^[a-zA-ZÀ-ÿ\s]*$/.test(e.target.value)) handleChange(e); }}
                          size="small"
                          fullWidth
                          sx={fieldSx}
                        />
                        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
                          <TextField
                            label="Email *"
                            name="emailCliente"
                            type="email"
                            value={form.emailCliente}
                            onChange={handleChange}
                            size="small"
                            sx={{ ...fieldSx, flex: 1 }}
                            error={form.emailCliente !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailCliente)}
                            helperText={form.emailCliente !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailCliente) ? "Correo inválido" : ""}
                          />
                          <TextField
                            label="Teléfono *"
                            name="telefonoCliente"
                            type="tel"
                            value={form.telefonoCliente}
                            onChange={(e) => { const onlyNums = e.target.value.replace(/\D/g, ""); setForm((prev) => ({ ...prev, telefonoCliente: onlyNums.slice(0, 12) })); }}
                            size="small"
                            inputProps={{ inputMode: "numeric", maxLength: 12 }}
                            sx={{ ...fieldSx, flex: 1 }}
                          />
                        </Box>
                        <TextField
                          label="URL Logo"
                          name="logoCliente"
                          value={form.logoCliente}
                          onChange={handleChange}
                          size="small"
                          fullWidth
                          placeholder="https://ejemplo.com/logo.png"
                          sx={fieldSx}
                          InputProps={{
                            endAdornment: form.logoCliente ? (
                              <Box component="img" src={form.logoCliente} alt="preview"
                                onError={(e) => { e.target.style.display = "none"; }}
                                onLoad={(e) => { e.target.style.display = "block"; }}
                                sx={{ width: 28, height: 28, borderRadius: 1, objectFit: "contain", border: "1px solid #eee", bgcolor: "#fff", flexShrink: 0 }}
                              />
                            ) : null,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* ── Progreso inicial ── */}
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#E65100", textTransform: "uppercase", letterSpacing: "0.09em" }}>
                          Progreso inicial
                        </Typography>
                        <Box sx={{ px: 1.2, py: 0.2, borderRadius: 99, backgroundImage: getGradient(form.progreso) }}>
                          <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, color: "#fff" }}>{form.progreso}%</Typography>
                        </Box>
                      </Box>
                      <Slider
                        value={form.progreso}
                        onChange={(e, newValue) => handleChange({ target: { name: "progreso", value: newValue } })}
                        valueLabelDisplay="off"
                        step={5} min={0} max={100}
                        sx={{
                          "& .MuiSlider-track": { backgroundImage: getGradient(form.progreso), border: "none", height: 5 },
                          "& .MuiSlider-rail": { opacity: 0.2, backgroundColor: "#bbb", height: 5 },
                          "& .MuiSlider-thumb": { width: 16, height: 16, bgcolor: "#fff", border: "2px solid #FB8C00", boxShadow: "0 2px 6px rgba(0,0,0,0.18)", "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 8px rgba(251,140,0,0.12)" } },
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </AnimatePresence>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(255,255,255,0.7)", backdropFilter: "blur(3px)", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={44} sx={{ color: "#FB8C00" }} />
        </Box>
      )}

      {/* ── Footer ── */}
      <DialogActions sx={{ justifyContent: "flex-end", px: 3, py: 1.5, bgcolor: "#FFF8EE", borderTop: "1px solid rgba(255,167,38,.25)", gap: 1 }}>
        {success ? (
          <Button variant="contained" color="success" disabled sx={{ fontWeight: 700, textTransform: "none", borderRadius: 1.5 }}>
            {modoEditar ? "Actualizado ✓" : "Registrado ✓"}
          </Button>
        ) : (
          <>
            <Button
              onClick={onClose}
              sx={{ color: "#9E9E9E", fontWeight: 600, textTransform: "none", borderRadius: 1.5, px: 2.5, border: "1px solid #E0E0E0", "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "#BDBDBD" } }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                textTransform: "none", fontWeight: 700, px: 3, borderRadius: 1.5,
                bgcolor: modoEditar ? "#1565C0" : "#F57C00",
                "&:hover": { bgcolor: modoEditar ? "#1976D2" : "#EF6C00" },
                boxShadow: "none",
              }}
            >
              {modoEditar ? "Guardar cambios" : "Crear trabajo"}
            </Button>
          </>
        )}
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.type}>{snackbar.message}</Alert>
      </Snackbar>
    </Dialog >
  );
}
