import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Box, Typography, IconButton, Slide, CircularProgress } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { cargarPaseMensual } from "../../helpers/HelperPaseMensual";

// 🎯 Transición Slide
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Emojis por misión
const emojiMap = { 1: "📢", 2: "💳", 3: "🔗", 4: "👥", 5: "🎯", };

// Gradientes dinámicos según estado
const getGradient = (id, estado) => {
  if (estado === "aprobado") {
    return "linear-gradient(135deg,#81C784,#4CAF50,#2E7D32)"; // verde
  }
  if (estado === "rechazado") {
    return "linear-gradient(135deg,#EF9A9A,#F44336,#B71C1C)"; // rojo
  }
  if (id === 5) {
    return "linear-gradient(135deg,#FFF176,#FFD54F,#FFA000,#FF6F00)"; // dorado solo grande
  }
  // pendiente o revision
  return "linear-gradient(135deg,#6EC6FF,#2196F3,#1565C0)"; // azul
};

// 📦 Cuadro individual
const Cuadro = ({ id, titulo, estado, onDecision, loadingId }) => {
  const fondo = getGradient(id, estado);
  const disabled =
    estado === "aprobado" || estado === "rechazado" || loadingId === id;

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 1.5,
        height: id === 5
          ? (window.innerWidth >= 900 ? "120px" : "100px") // >=900px lo tomamos como desktop
          : "100%",
        background: fondo,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: id === 5 ? "center" : "space-between",
        gap: 1,
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        textAlign: "center",

      }}
    >
      <Box textAlign="center">
        <Typography variant="h5">{emojiMap[id] || "✨"}</Typography>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{
            lineHeight: 1.2,
            textAlign: "center",
            // 🔽 Responsive
            fontSize: { xs: "0.65rem", sm: "0.8rem", md: "0.9rem" },
            whiteSpace: "nowrap",      // evita salto de línea raro
            overflow: "hidden",        // corta exceso
            textOverflow: "ellipsis",  // muestra "..." si no cabe
          }}
        >
          {titulo}
        </Typography>

        <Typography variant="caption" sx={{ fontWeight: 600, mt: 0.5 }}>
          {estado === "aprobado" && "✅ Aprobado"}
          {estado === "rechazado" && "❌ Rechazado"}
          {estado === "revision" && "⏳ En Revisión"}
          {estado === "pendiente" && "🕒 Pendiente"}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="center" gap={0.5}>
        <Button
          onClick={() => onDecision(id, true)}
          variant="contained"
          color="success"
          size="small"
          disabled={disabled}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: disabled
              ? "rgba(76,175,80,0.5)"
              : "rgba(76,175,80,0.9)",
            "&:hover": disabled ? {} : { backgroundColor: "rgba(56,142,60,0.9)" },
            // 🔽 Responsive
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            px: { xs: 0.8, sm: 1.2 },
            py: { xs: 0.2, sm: 0.3 },
            minWidth: { xs: "58px", sm: "70px" }, // más angosto en iPhone SE
          }}
        >
          {loadingId === id ? (
            <CircularProgress size={14} color="inherit" /> // más chico en móviles
          ) : (
            "Aprobar"
          )}
        </Button>

        <Button
          onClick={() => onDecision(id, false)}
          variant="contained"
          color="error"
          size="small"
          disabled={disabled}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            backgroundColor: disabled
              ? "rgba(244,67,54,0.5)"
              : "rgba(244,67,54,0.9)",
            "&:hover": disabled ? {} : { backgroundColor: "rgba(211,47,47,0.9)" },
            // 🔽 Responsive
            fontSize: { xs: "0.6rem", sm: "0.7rem" },
            px: { xs: 0.8, sm: 1.2 },
            py: { xs: 0.2, sm: 0.3 },
            minWidth: { xs: "58px", sm: "70px" },
          }}
        >
          {loadingId === id ? (
            <CircularProgress size={14} color="inherit" />
          ) : (
            "Rechazar"
          )}
        </Button>

      </Box>
    </Box>
  );
};

export default function DialogPaseMensual({ open, onClose, cliente }) {
  const [fechaEdicion, setFechaEdicion] = useState("");
  const montoBase = 10000;
  const [monto, setMonto] = useState(montoBase);
  const [displayMonto, setDisplayMonto] = useState(monto);
  const [loadingRestablecer, setLoadingRestablecer] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const [misiones, setMisiones] = useState([
    {
      id: 1,
      titulo: "Compartir Anuncio",
      descuento: 0.025,
      recompensa: "2,5% descuento",
      estado: "pendiente",
      tipo: "pequeña",
      imagen: "/facebook-insta.png",
    },
    {
      id: 2,
      titulo: "Pagar Suscripción",
      descuento: 0.025,
      recompensa: "2,5% descuento",
      estado: "pendiente",
      tipo: "pequeña",
      imagen: "/logo-pagar.png",
    },
    {
      id: 3,
      titulo: "Conexión Mensual",
      descuento: 0.025,
      recompensa: "2,5% descuento",
      estado: "pendiente",
      tipo: "pequeña",
      imagen: "/conexion.png",
    },
    {
      id: 4,
      titulo: "Visitas Mensual",
      descuento: 0.025,
      recompensa: "2,5% descuento",
      estado: "pendiente",
      tipo: "pequeña",
      imagen: "/visitas.png",
    },
    {
      id: 5,
      titulo: "Conseguir Cliente para Plataformas web",
      descuento: 1,
      recompensa: "100%",
      estado: "pendiente",
      tipo: "grande",
      imagen: "/mision5.png",
    },
  ]);

  const camposMap = {
    1: "CompartirAnuncioEstado",
    2: "PagarSuscripcionAntesEstado",
    3: "ConexionMensualEstado",
    4: "VisitasMensualEstado",
    5: "ConseguirClienteEstado",
  };

  const handleDecision = async (id, aprobado) => {
    const campo = camposMap[id];
    const valor = aprobado ? 1 : 2;

    setLoadingId(id); // ⏳ empieza
    try {
      const baseUrl =
        window.location.hostname === "localhost"
          ? "http://localhost:8888"
          : "";

      await fetch(`${baseUrl}/.netlify/functions/actualizarPaseMensual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          SitioWeb: cliente.sitioWeb,
          campo,
          valor,
        }),
      });

      setMisiones((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, estado: aprobado ? "aprobado" : "rechazado" } : m
        )
      );
    } catch (err) {
      console.error("❌ Error al actualizar misión:", err);
    } finally {
      setLoadingId(null); // ✅ termina
    }
  };

  // Cargar datos desde Excel en S3 al abrir el diálogo
  useEffect(() => {
    const fetchPase = async () => {
      if (!cliente?.sitioWeb) return;
      const result = await cargarPaseMensual(
        `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/PaseMensual.xlsx?t=${Date.now()}`,
        misiones,
        true,
        cliente.sitioWeb // 👈 importante: obligamos a usar el sitio del cliente
      );

      setMisiones(result.misiones);
      setFechaEdicion(result.fechaEdicion);
    };
    if (open) fetchPase();
  }, [open, cliente]);

  useEffect(() => {
    const totalDescuento = misiones
      .filter((m) => m.estado === "aprobado") // ✅ solo aprobados
      .reduce((acc, m) => acc + m.descuento, 0);

    const nuevoMonto = montoBase - Math.round(montoBase * totalDescuento);
    setMonto(Math.max(nuevoMonto, 0));
    setDisplayMonto(Math.max(nuevoMonto, 0)); // 👈 se actualiza lo que se muestra
  }, [misiones]);


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "95%", md: "800px" }, // 👉 más ancho en desktop
          maxWidth: "none", // 🔑 elimina límite interno de MUI
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontFamily: "'Poppins', sans-serif",
          background: "linear-gradient(90deg,#00695C,#26A69A,#80CBC4)",
          color: "#fff",
          position: "relative",
          // 🔽 Responsive fontSize
          fontSize: { xs: "0.85rem", sm: "1rem", md: "1.1rem" },
          textAlign: "left", // opcional, centra el título
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Pase Mensual — {cliente?.sitioWeb || cliente?.nombre || "Cliente"}
        {/* Botón cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#FFF",
            zIndex: 3,
            "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
            animation: open ? "spinTwice 0.6s ease-in-out" : "none",
            "@keyframes spinTwice": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(720deg)" },
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </DialogTitle>


      <DialogContent
        dividers
        sx={{
          px: { xs: 2, sm: 4, md: 6 },
          py: { xs: 1, sm: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 0.6,
            mb: 1,
            border: "2px solid #fff",
            borderRadius: 2,
            background: "rgba(0,0,0,0.6)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "0.8rem", sm: "1rem" },
              color: "#fff",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              fontFamily: "'Luckiest Guy','Poppins', sans-serif",
            }}
          >
            SUSCRIPCIÓN ACTUAL:{" "}
            <Box
              component="span"
              sx={{
                color: "#FFD700",
                fontSize: { xs: "1rem", sm: "1.2rem" },
                textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
                fontFamily: "'Luckiest Guy','Poppins', sans-serif",
              }}
            >
              ${displayMonto.toLocaleString("es-CL")} CLP
            </Box>
          </Typography>

        </Box>
        <Grid container spacing={2} columns={2}>
          <Grid item xs={1}>
            <Cuadro {...misiones.find((m) => m.id === 1)} onDecision={handleDecision} loadingId={loadingId} />
          </Grid>
          <Grid item xs={1}>
            <Cuadro {...misiones.find((m) => m.id === 2)} onDecision={handleDecision} loadingId={loadingId} />
          </Grid>
          <Grid item xs={1}>
            <Cuadro {...misiones.find((m) => m.id === 3)} onDecision={handleDecision} loadingId={loadingId} />
          </Grid>
          <Grid item xs={1}>
            <Cuadro {...misiones.find((m) => m.id === 4)} onDecision={handleDecision} loadingId={loadingId} />
          </Grid>
          <Grid item xs={2}>
            <Cuadro {...misiones.find((m) => m.id === 5)} onDecision={handleDecision} loadingId={loadingId} />
          </Grid>
        </Grid>

        {/* 👇 Fecha más estilizada */}
        {fechaEdicion && (
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.65rem",
                fontWeight: 500,
                color: "white",
                lineHeight: 1.1,
              }}
            >
              📅 Última actualización: {fechaEdicion}
            </Typography>
          </Box>
        )}
      </DialogContent>


      <DialogActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          py: 0.5,
          background: "linear-gradient(90deg,#263238,#37474F,#455A64)",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          gap: 0,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loadingRestablecer} // 👈 desactiva si está cargando
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 0.4,
            borderRadius: 2,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            background: "linear-gradient(90deg,#546E7A,#455A64)",
            "&:hover": {
              background: "linear-gradient(90deg,#607D8B,#546E7A)",
              borderColor: "rgba(255,255,255,0.7)",
            },
          }}
        >
          ✖ Cerrar
        </Button>

        <Button
          onClick={async () => {
            setLoadingRestablecer(true); // 👈 inicia loading
            try {
              const baseUrl =
                window.location.hostname === "localhost"
                  ? "http://localhost:8888"
                  : "";

              for (const campo of Object.values(camposMap)) {
                await fetch(`${baseUrl}/.netlify/functions/actualizarPaseMensual`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    SitioWeb: cliente.sitioWeb,
                    campo,
                    valor: 0,
                  }),
                });
              }

              // 🔄 refrescar estado local
              setMisiones((prev) =>
                prev.map((m) => ({ ...m, estado: "pendiente" }))
              );
            } catch (err) {
              console.error("❌ Error al restablecer:", err);
            } finally {
              setLoadingRestablecer(false); // 👈 termina loading
            }
          }}
          disabled={loadingRestablecer} // 👈 desactiva mientras carga
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 1,
            py: 0.4,
            borderRadius: 2,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.4)",
            background: "linear-gradient(90deg,#1E88E5,#1565C0)",
            "&:hover": {
              background: "linear-gradient(90deg,#42A5F5,#1E88E5)",
              borderColor: "rgba(255,255,255,0.7)",
            },
          }}
        >
          {loadingRestablecer ? (
            <CircularProgress size={20} color="inherit" /> // 👈 spinner
          ) : (
            "🔄 Restablecer"
          )}
        </Button>
      </DialogActions>

    </Dialog>
  );
}
