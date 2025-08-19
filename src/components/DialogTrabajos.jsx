// DialogTrabajos.jsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Slide, Chip, LinearProgress,
  Box, Button, Typography, useTheme, useMediaQuery
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeFilledRoundedIcon from '@mui/icons-material/AccessTimeFilledRounded';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - trabajos: Array<{ SitioWeb: string, Porcentaje: number, Estado: boolean }>
 * - primaryLabel?: string  (texto del botón primario)
 * - onPrimaryClick?: () => void  (acción del botón primario)
 */
export default function DialogTrabajos({
  open,
  onClose,
  trabajos = [],
  primaryLabel = "Ver servicios",
  onPrimaryClick,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const enDesarrollo = trabajos.filter(t => t.Estado && t.Porcentaje < 100).length;
  const enCola = trabajos.filter(t => !t.Estado).length;

  const progresoMedio = trabajos.length
    ? Math.round(trabajos.reduce((acc, t) => acc + (t.Porcentaje || 0), 0) / trabajos.length)
    : 0;

  const getEstado = (t) => {
    if (t.Porcentaje >= 100) return { label: "Completado", color: "success" };
    if (!t.Estado) return { label: "En cola", color: "warning" };
    return { label: "En curso", color: "info" };
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          mt: { xs: 0, sm: -3 },
          borderRadius: 2,
          border: "1px solid rgba(255,167,38,.35)",
          boxShadow: "0 24px 64px rgba(0,0,0,.45)",
          overflow: "hidden",
          "& .MuiDialogContent-root": { marginTop: 0 },
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#E65100",
          fontFamily: "'Poppins', sans-serif",
          py: 2,
          background: "linear-gradient(90deg,#FFF3E0,#FFE0B2)",
          borderBottom: "1px solid rgba(255,167,38,.35)",
          position: "relative",

          // keyframes para el “tictac”
          "@keyframes clock": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      >
        {/* Fila: ícono reloj + título */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <AccessTimeFilledRoundedIcon
            sx={{
              fontSize: { xs: 20, sm: 22 },
              color: "#E65100",
              transformOrigin: "50% 50%",
              animation: "clock 12s steps(12) infinite",   // “tictac” en 12 pasos
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Typography variant="h6" component="span">
            Estado de desarrollos
          </Typography>
        </Box>

        {/* Línea 1: cantidades */}
        <Typography
          variant="caption"
          sx={{ color: "#6D4C41", mt: 0.5, display: "block" }}
          aria-live="polite"
        >
          {trabajos.length
            ? `${enDesarrollo} ${enDesarrollo === 1 ? "sitio" : "sitios"} en desarrollo, ${enCola} ${enCola === 1 ? "sistema" : "sistemas"} en cola`
            : "Sin trabajos activos por ahora"}
        </Typography>

        {/* Línea 2: pill de Progreso medio (si hay trabajos) */}
        {trabajos.length > 0 && (
          <Box
            sx={{
              mt: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.2,
              py: 0.4,
              borderRadius: "999px",
              bgcolor: "rgba(255,224,130,.7)",
              border: "1px solid rgba(255,167,38,.55)",
              boxShadow: "0 2px 10px rgba(255,167,38,.22)",
            }}
          >
            <Typography
              variant="overline"
              sx={{ m: 0, p: 0, lineHeight: 1, letterSpacing: ".7px", color: "#6D4C41" }}
            >
              Progreso
            </Typography>
            <Typography
              component="span"
              sx={{
                fontWeight: 900,
                color: "#E65100",
                fontSize: { xs: 16, sm: 18 },
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {progresoMedio}%
            </Typography>
          </Box>
        )}

        {/* Cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            position: "absolute", right: 8, top: 8,
            color: "#E65100",
            "&:hover": { backgroundColor: "rgba(255,167,38,.15)" },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          background: "linear-gradient(180deg, #FFF8E1 0%, #FFF3E0 100%)",
          py: 2.5,
          mb: 0
        }}
      >
        {trabajos.length === 0 && (
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ color: "#5D4037", textAlign: "center" }}>
              Pronto verás aquí tus próximos desarrollos.
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: { xs: 1.5, sm: 2.5 } }}>
          {trabajos.map((t) => {
            const st = getEstado(t);
            return (
              <Box key={`${t.SitioWeb}-${st.label}`} sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.75,
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "#5D4037",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: isMobile ? "68%" : "78%",
                    }}
                    title={t.SitioWeb}
                  >
                    {t.SitioWeb}
                  </Typography>
                  <Chip size="small" color={st.color} label={st.label} />
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.max(0, t.Porcentaje || 0))}
                  sx={{
                    height: 8,
                    borderRadius: 6,
                    bgcolor: "rgba(0,0,0,.08)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg,#FFB74D,#FB8C00)",
                    },
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "#6D4C41" }}>Progreso</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#6D4C41" }}>
                    {t.Porcentaje ?? 0}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          background: "linear-gradient(90deg,#FFF3E0,#FFE0B2)",
          borderTop: "1px solid rgba(255,167,38,.35)",
        }}
      >
        <Button onClick={onClose} sx={{ color: "#E65100", fontWeight: 700 }}>
          Cerrar
        </Button>

        {onPrimaryClick && (
          <Button
            variant="contained"
            onClick={onPrimaryClick}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(90deg,#FF9800,#F57C00)",
              boxShadow: "0 6px 18px rgba(255,152,0,.35)",
              "&:hover": { background: "linear-gradient(90deg,#FFA726,#FB8C00)" },
            }}
          >
            {primaryLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
