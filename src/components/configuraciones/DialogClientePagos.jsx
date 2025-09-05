// DialogPagoConfirmacion.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const DialogClientePagos = ({
  open,
  onClose,
  esReversion,
  clienteSeleccionado,
  mesDialogPago,
  meses,
  mesManual,
  setMesManual,
  confirmarPago,
  enviarCorreoPagoRecibido,
  mesCapitalizado,
}) => {
  const [botonCargando, setBotonCargando] = useState(null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "linear-gradient(180deg, #F1F8F6, #DFF0E4)", // 💚 verde suave
          borderRadius: 2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* --- Título con fondo animado --- */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 3,
          position: "relative",
          overflow: "hidden",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,

          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage: esReversion
              ? "url('/dialog-revertir.webp')"
              : "url('/trabajo-terminado.webp')",
            backgroundSize: "130%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            animation: "zoomIn 1.2s ease-out forwards",
          },

          "@keyframes zoomIn": {
            "0%": { backgroundSize: "150%" },
            "100%": { backgroundSize: "115%" },
          },

          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            zIndex: 1,
          },

          "& > *": {
            position: "relative",
            zIndex: 2,
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
            zIndex: 9,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            animationFillMode: "forwards",
            "@keyframes spinTwice": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(720deg)" },
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 26 }} />
        </IconButton>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.8, sm: 1.2 },
            px: { xs: 1.2, sm: 2 },
            py: { xs: 0.5, sm: 0.8 },
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
              letterSpacing: { xs: "0.2px", sm: "1px" },
              fontFamily: "'Poppins', sans-serif",
              color: "#fff",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
            }}
          >
            {esReversion
              ? "Revertir Pago"
              : `Confirmar Hosting Activo ${mesDialogPago}`}
          </Typography>
        </Box>
      </DialogTitle>

      {/* --- Contenido --- */}
      <DialogContent sx={{ pt: 4 }}>
        {open && (
          <DialogContentText sx={{ mt: 1 }}>
            {esReversion ? (
              <>
                ¿Estás seguro de que deseas <strong>revertir</strong> el pago de{" "}
                <strong>{clienteSeleccionado?.sitioWeb}</strong>?
              </>
            ) : (
              <>
                ¿Estás seguro de que deseas <strong>marcar como pagado</strong> a{" "}
                <strong>{clienteSeleccionado?.sitioWeb}</strong>?
              </>
            )}
          </DialogContentText>
        )}

        {/* Combo Mes */}
        {!esReversion && (
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel sx={{ color: "#1b263b" }}>
              Mes que seguirá activo
            </InputLabel>
            <Select
              label="Mes que seguirá activo"
              value={mesManual}
              onChange={(e) => setMesManual(e.target.value)}
              sx={{
                backgroundColor: "#ffffff",
                color: "#1b263b",
                borderRadius: 1,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,167,38,0.6)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,167,38,0.9)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#ff9800",
                },
                "& .MuiSelect-icon": { color: "#1b263b" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    "& .MuiList-root": { paddingTop: 0 },
                    "&::before, &::after": { display: "none" },
                    borderRadius: 1.5,
                    backgroundColor: "#ffffff",
                  },
                },
              }}
            >
              {meses.map((mes, i) => (
                <MenuItem
                  key={i}
                  value={mes}
                  sx={{
                    backgroundColor: "#ffffff",
                    color: "#1b263b",
                    "&.Mui-selected": {
                      backgroundColor: "#FFE0B2",
                      color: "#1b263b",
                      fontWeight: "bold",
                    },
                    "&.Mui-selected:hover": { backgroundColor: "#FFCC80" },
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  {mes}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      {/* --- Acciones --- */}
      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          pb: 2,
          gap: 0.5,
          background: "linear-gradient(90deg, #E8F5E9, #C8E6C9)",
          borderTop: "1px solid rgba(56,142,60,.35)",
        }}
      >
        <Button
          onClick={onClose}
          sx={{ fontSize: "0.75rem", px: 0, minWidth: "auto" }}
        >
          Cancelar
        </Button>

        {!esReversion ? (
          <>
            <Button
              onClick={async () => {
                setBotonCargando("confirmar");
                await confirmarPago(false);
                setBotonCargando(null);
              }}
              color="primary"
              variant="contained"
              disabled={botonCargando !== null}
              sx={{ fontSize: "0.65rem", px: 1.2 }}
            >
              {botonCargando === "confirmar" ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Confirmar"
              )}
            </Button>

            <Button
              onClick={async () => {
                setBotonCargando("confirmarCorreo");
                await confirmarPago(false);
                await enviarCorreoPagoRecibido(
                  clienteSeleccionado,
                  mesManual || mesCapitalizado
                );
                setBotonCargando(null);
              }}
              color="success"
              variant="contained"
              disabled={botonCargando !== null}
              sx={{ fontSize: "0.65rem", px: 1.2 }}
            >
              {botonCargando === "confirmarCorreo" ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Confirmar + 📧"
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={async () => {
              setBotonCargando("revertir");
              await confirmarPago(true);
              setBotonCargando(null);
            }}
            color="warning"
            variant="contained"
            disabled={botonCargando !== null}
            sx={{ fontSize: "0.75rem", px: 1.5 }}
          >
            {botonCargando === "revertir" ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Revertir pago"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogClientePagos;
