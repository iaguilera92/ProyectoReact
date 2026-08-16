import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Box, Typography, Paper, Chip, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody,
  Collapse, IconButton, Tooltip, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
  TextField, Snackbar, Alert,
} from "@mui/material";
import CheckCircleIcon          from "@mui/icons-material/CheckCircle";
import ErrorIcon                from "@mui/icons-material/Error";
import ExpandMoreIcon           from "@mui/icons-material/ExpandMore";
import ExpandLessIcon           from "@mui/icons-material/ExpandLess";
import RefreshIcon              from "@mui/icons-material/Refresh";
import AccessTimeIcon           from "@mui/icons-material/AccessTime";
import BugReportIcon            from "@mui/icons-material/BugReport";
import DeleteSweepIcon          from "@mui/icons-material/DeleteSweep";
import OpenInNewIcon            from "@mui/icons-material/OpenInNew";
import WarningAmberIcon         from "@mui/icons-material/WarningAmber";
import PlayArrowIcon            from "@mui/icons-material/PlayArrow";
import DataObjectIcon           from "@mui/icons-material/DataObject";
import NotificationsActiveIcon  from "@mui/icons-material/NotificationsActive";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabase/client";

// ── constants ─────────────────────────────────────────────────────────────────
const AZURE_URL = (id) =>
  `https://dev.azure.com/plataformasweb/API-REST/_build/results?buildId=${id}&view=results`;

const REFRESH_INTERVAL = 30_000;

const fadein = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ── helpers ───────────────────────────────────────────────────────────────────
function formatMs(ms) {
  if (ms == null || ms === 0) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function formatFecha(iso) {
  return new Date(iso).toLocaleString("es-CL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function tiempoRelativo(date) {
  if (!date) return "";
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 10)  return "justo ahora";
  if (s < 60)  return `hace ${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60)  return `hace ${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `hace ${h}h ${rm}m` : `hace ${h}h`;
}


// ── parseJestError ────────────────────────────────────────────────────────────
// Formato estructurado: "msg | archivo: src/routes/x.ts | linea: 42"
// Formato Jest clásico: "Error: ... at Object.<anonymous> (test.ts:24:14) ..."
function parseJestError(raw) {
  if (!raw) return { msg: raw, file: null, archivo: null, linea: null, full: raw };

  const archivoMatch = raw.match(/\|\s*archivo:\s*([^|]+)/);
  const lineaMatch   = raw.match(/\|\s*linea:\s*(\d+)/);

  if (archivoMatch || lineaMatch) {
    return {
      msg:     raw.split("|")[0].trim(),
      file:    null,
      archivo: archivoMatch ? archivoMatch[1].trim() : null,
      linea:   lineaMatch   ? lineaMatch[1].trim()   : null,
      full:    raw,
    };
  }

  const atIdx     = raw.indexOf(" at ");
  const msg       = atIdx > -1 ? raw.slice(0, atIdx).trim() : raw.trim();
  const fileMatch = raw.match(/\(([^)]*\.test\.[jt]sx?:\d+:\d+)\)/);
  const file      = fileMatch ? fileMatch[1].replace(/^.*\//, "") : null;
  return { msg, file, archivo: null, linea: null, full: raw };
}

// ── EstadoBadge ───────────────────────────────────────────────────────────────
function EstadoBadge({ estado, size = "small" }) {
  const ok = estado === "passed";
  return (
    <Chip
      icon={ok
        ? <CheckCircleIcon sx={{ fontSize: size === "small" ? 13 : 16, color: "inherit !important" }} />
        : <ErrorIcon       sx={{ fontSize: size === "small" ? 13 : 16, color: "inherit !important" }} />}
      label={ok ? "passed" : "failed"}
      size={size}
      sx={{
        fontWeight: 700,
        fontSize: size === "small" ? "0.68rem" : "0.78rem",
        height: size === "small" ? 22 : 28,
        bgcolor: ok ? "rgba(34,197,94,0.13)" : "rgba(239,68,68,0.13)",
        color:   ok ? "#4ade80"              : "#f87171",
        border:  `1px solid ${ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
        "& .MuiChip-icon": { color: "inherit" },
      }}
    />
  );
}

// ── TestRow ───────────────────────────────────────────────────────────────────
function TestRow({ t, i, dark, avgDuracion, workflowOpen, onToggleWorkflow }) {
  const ok    = t.estado === "passed";
  const avg   = avgDuracion?.[t.nombre] ?? 0;
  const lento = avg > 0 && t.duracion_ms != null && t.duracion_ms > avg * 2;
  const ratio = lento ? (t.duracion_ms / avg).toFixed(1) : null;
  const [stackOpen, setStackOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSent, setNotifSent] = useState(false);
  const parsed = !ok && t.error ? parseJestError(t.error) : null;

  const mensajeNotif = parsed
    ? [
        `⚠️ Error detectado en pipeline — ${new Date().toLocaleString("es-CL")}`,
        ``,
        `Test:    ${t.nombre}`,
        `Error:   ${parsed.msg}`,
        parsed.archivo ? `Archivo: ${parsed.archivo}${parsed.linea ? `:${parsed.linea}` : ""}` : parsed.file ? `Archivo: ${parsed.file}` : null,
        ``,
        `Acción requerida: revisar el endpoint y corregir la validación antes del próximo deploy.`,
      ].filter(l => l !== null).join("\n")
    : "";

  const handleEnviar = () => {
    setNotifOpen(false);
    setNotifSent(true);
  };

  return (
    <Box sx={{
      borderBottom: "1px solid",
      borderColor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)",
      bgcolor: i % 2 === 0 ? "transparent" : dark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.018)",
    }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: { xs: 1, md: 1.5 }, px: { xs: 1, md: 2 }, py: 1 }}>
        <Typography sx={{ fontSize: "0.68rem", color: dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.3)", fontFamily: "monospace", flexShrink: 0, pt: 0.3, width: 18 }}>
          {String(i + 1).padStart(2, "0")}
        </Typography>

        <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", alignSelf: "flex-start", pt: "3px" }}>
          {ok
            ? <CheckCircleIcon sx={{ fontSize: 15, color: "#4ade80" }} />
            : <ErrorIcon       sx={{ fontSize: 15, color: "#f87171" }} />}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography sx={{ fontSize: "0.83rem", color: dark ? "rgba(255,255,255,0.85)" : "#1b263b", fontWeight: ok ? 400 : 600, lineHeight: 1.4, flex: 1, minWidth: 0, pt: "1px" }}>
              {t.nombre}
            </Typography>
            {parsed && onToggleWorkflow && (
              <Tooltip title={workflowOpen ? "Minimizar" : "Ver detalle"} arrow>
                <IconButton
                  size="small"
                  onClick={() => onToggleWorkflow()}
                  sx={{ p: 0.3, color: "rgba(248,113,113,0.45)", flexShrink: 0, "&:hover": { color: "#f87171" } }}
                >
                  {workflowOpen
                    ? <ExpandLessIcon sx={{ fontSize: 14 }} />
                    : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          {lento && (
            <Tooltip title={`Este test tardó ${ratio}x más que su promedio (${formatMs(t.duracion_ms)} vs ${formatMs(Math.round(avg))})`} arrow>
              <WarningAmberIcon sx={{ fontSize: 14, color: "#fbbf24", cursor: "help" }} />
            </Tooltip>
          )}
          <Typography sx={{ fontSize: "0.72rem", color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)", fontFamily: "monospace", minWidth: 52, textAlign: "right" }}>
            {t.duracion_ms != null ? formatMs(t.duracion_ms) : ""}
          </Typography>
        </Box>
      </Box>

      {/* Canvas — full row width, outside the icon indent */}
      <Collapse in={workflowOpen} timeout="auto" unmountOnExit>
      {parsed && (() => {
            const rawFile = parsed.archivo || parsed.file || null;
            const fileShort = rawFile
              ? `${rawFile.split("/").pop()}${parsed.linea ? `:${parsed.linea}` : ""}`
              : null;
            const testShort = t.nombre.includes("/") ? t.nombre.split("/").pop() : t.nombre;

            // n8n-style constants — always dark canvas regardless of page theme
            const canvasBg    = "#0d0d18";
            const nodeBg      = "#1a1b2e";
            const nodeBorder  = "rgba(255,255,255,0.07)";
            const connLine    = "#252640";
            const connDot     = "#383a5c";
            const txtPrimary  = "rgba(255,255,255,0.88)";
            const txtSub      = "rgba(255,255,255,0.3)";

            const N8nNode = ({ icon, iconBg, iconColor, title, sub, isError, isAction, onClick: onClickNode }) => (
              <Box
                onClick={onClickNode}
                sx={{
                  display: "flex", alignItems: "center",
                  gap: { xs: 0.7, md: 1.1 },
                  px: { xs: 0.85, md: 1.25 }, py: { xs: 1.05, md: 1.4 },
                  flex: 1, minWidth: { xs: 96, md: 110 },
                  borderRadius: 1.75, bgcolor: nodeBg,
                  border: `1px solid ${isError ? "rgba(239,68,68,0.55)" : isAction ? "rgba(74,222,128,0.35)" : nodeBorder}`,
                  boxShadow: isError
                    ? "0 0 18px rgba(239,68,68,0.22), 0 2px 10px rgba(0,0,0,0.55)"
                    : isAction
                      ? "0 0 12px rgba(74,222,128,0.1), 0 2px 10px rgba(0,0,0,0.45)"
                      : "0 2px 10px rgba(0,0,0,0.5)",
                  cursor: onClickNode ? "pointer" : "default",
                  transition: "all 0.15s",
                  ...(onClickNode ? {
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: isError
                        ? "0 0 26px rgba(239,68,68,0.35), 0 4px 14px rgba(0,0,0,0.6)"
                        : "0 0 18px rgba(74,222,128,0.2), 0 4px 14px rgba(0,0,0,0.55)",
                    },
                  } : {}),
                }}
              >
                {/* Colored icon square */}
                <Box sx={{
                  width: { xs: 28, md: 34 }, height: { xs: 28, md: 34 },
                  borderRadius: 1, flexShrink: 0,
                  bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  {React.cloneElement(icon, { sx: { fontSize: { xs: 14, md: 17 }, color: iconColor } })}
                  {isError && (
                    <Box sx={{
                      position: "absolute", top: -4, right: -4,
                      width: 13, height: 13, borderRadius: "50%",
                      bgcolor: "#ef4444", border: `2px solid ${nodeBg}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Typography sx={{ fontSize: "0.42rem", color: "#fff", fontWeight: 900, lineHeight: 1 }}>✕</Typography>
                    </Box>
                  )}
                </Box>

                {/* Text */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{
                    fontSize: { xs: "0.62rem", md: "0.69rem" }, fontWeight: 700, lineHeight: 1.25,
                    color: isError ? "#f87171" : isAction ? "#4ade80" : txtPrimary,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {title}
                  </Typography>
                  <Typography sx={{
                    fontSize: { xs: "0.48rem", md: "0.54rem" }, lineHeight: 1, mt: 0.2, whiteSpace: "nowrap",
                    color: isError ? "rgba(248,113,113,0.48)" : txtSub,
                  }}>
                    {sub}
                  </Typography>
                </Box>

                {/* Expand chevron for error node */}
                {isError && (stackOpen
                  ? <ExpandLessIcon sx={{ fontSize: { xs: 11, md: 13 }, color: "rgba(248,113,113,0.45)", flexShrink: 0 }} />
                  : <ExpandMoreIcon sx={{ fontSize: { xs: 11, md: 13 }, color: "rgba(248,113,113,0.45)", flexShrink: 0 }} />
                )}
              </Box>
            );

            const Conn = ({ errorTone }) => (
              <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, mx: { xs: 0.25, md: 0.5 } }}>
                <Box sx={{ width: { xs: 5, md: 7 }, height: { xs: 5, md: 7 }, borderRadius: "50%", bgcolor: errorTone ? "rgba(239,68,68,0.4)" : connDot, border: `1.5px solid ${errorTone ? "rgba(239,68,68,0.25)" : connLine}`, flexShrink: 0 }} />
                <Box sx={{ width: { xs: 10, md: 20 }, height: 1.5, bgcolor: errorTone ? "rgba(239,68,68,0.28)" : connLine }} />
                <Box sx={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderLeft: `5px solid ${errorTone ? "rgba(239,68,68,0.28)" : connLine}` }} />
              </Box>
            );

            return (
              <Box sx={{ px: { xs: 1, md: 2 }, pb: 1 }}>
              <Box sx={{ borderRadius: 1.75, bgcolor: canvasBg, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>

                {/* Canvas topbar */}
                <Box sx={{ px: 1.5, pt: 0.85, pb: 0.5, display: "flex", alignItems: "center", gap: 0.85, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#ef4444", boxShadow: "0 0 7px rgba(239,68,68,0.7)", flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", userSelect: "none" }}>
                    Pipeline · Error detectado
                  </Typography>
                </Box>

                {/* Dot-grid canvas with nodes */}
                <Box sx={{
                  px: { xs: 1, md: 1.5 }, py: { xs: 1, md: 1.35 },
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  "&::-webkit-scrollbar": { height: 3 },
                  "&::-webkit-scrollbar-thumb": { bgcolor: "#252640", borderRadius: 2 },
                }}>
                  {/* ── Mobile: 2 filas de 2 nodos ── */}
                  <Box sx={{ display: { xs: "flex", md: "none" }, flexDirection: "column", gap: 1, width: "100%" }}>
                    {/* Fila 1 */}
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                      <N8nNode
                        icon={<PlayArrowIcon />}
                        iconBg="rgba(74,222,128,0.14)"
                        iconColor="#4ade80"
                        title={testShort.length > 14 ? testShort.slice(0, 14) + "…" : testShort}
                        sub="Servicio probado"
                      />
                      <Conn />
                      {fileShort ? (
                        <N8nNode
                          icon={<DataObjectIcon />}
                          iconBg="rgba(251,191,36,0.14)"
                          iconColor="#fbbf24"
                          title={fileShort.length > 14 ? fileShort.slice(0, 14) + "…" : fileShort}
                          sub="Archivo afectado"
                        />
                      ) : (
                        <N8nNode
                          icon={<ErrorIcon />}
                          iconBg="rgba(239,68,68,0.18)"
                          iconColor="#f87171"
                          title={parsed.msg.length > 14 ? parsed.msg.slice(0, 14) + "…" : parsed.msg}
                          sub={stackOpen ? "Ocultar stack" : "Ver stack"}
                          isError
                          onClick={() => setStackOpen(p => !p)}
                        />
                      )}
                    </Box>
                    {/* Fila 2 */}
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                      {fileShort ? (
                        <>
                          <N8nNode
                            icon={<ErrorIcon />}
                            iconBg="rgba(239,68,68,0.18)"
                            iconColor="#f87171"
                            title={parsed.msg.length > 14 ? parsed.msg.slice(0, 14) + "…" : parsed.msg}
                            sub={stackOpen ? "Ocultar stack" : "Ver stack"}
                            isError
                            onClick={() => setStackOpen(p => !p)}
                          />
                          <Conn errorTone />
                          <N8nNode
                            icon={<NotificationsActiveIcon />}
                            iconBg="rgba(74,222,128,0.14)"
                            iconColor="#4ade80"
                            title="Notificar Soporte"
                            sub="Escalar al equipo"
                            isAction
                            onClick={() => setNotifOpen(true)}
                          />
                        </>
                      ) : (
                        <>
                          <N8nNode
                            icon={<NotificationsActiveIcon />}
                            iconBg="rgba(74,222,128,0.14)"
                            iconColor="#4ade80"
                            title="Notificar Soporte"
                            sub="Escalar al equipo"
                            isAction
                            onClick={() => setNotifOpen(true)}
                          />
                        </>
                      )}
                    </Box>
                  </Box>

                  {/* ── Desktop: fila horizontal ── */}
                  <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", width: "100%" }}>
                    <N8nNode
                      icon={<PlayArrowIcon />}
                      iconBg="rgba(74,222,128,0.14)"
                      iconColor="#4ade80"
                      title={testShort.length > 16 ? testShort.slice(0, 16) + "…" : testShort}
                      sub="Servicio probado"
                    />
                    <Conn />
                    {fileShort && (<>
                      <N8nNode
                        icon={<DataObjectIcon />}
                        iconBg="rgba(251,191,36,0.14)"
                        iconColor="#fbbf24"
                        title={fileShort.length > 18 ? fileShort.slice(0, 18) + "…" : fileShort}
                        sub="Archivo afectado"
                      />
                      <Conn />
                    </>)}
                    <N8nNode
                      icon={<ErrorIcon />}
                      iconBg="rgba(239,68,68,0.18)"
                      iconColor="#f87171"
                      title={parsed.msg.length > 17 ? parsed.msg.slice(0, 17) + "…" : parsed.msg}
                      sub={stackOpen ? "Ocultar stack" : "Ver stack"}
                      isError
                      onClick={() => setStackOpen(p => !p)}
                    />
                    <Conn errorTone />
                    <N8nNode
                      icon={<NotificationsActiveIcon />}
                      iconBg="rgba(74,222,128,0.14)"
                      iconColor="#4ade80"
                      title="Notificar Soporte"
                      sub="Escalar al equipo"
                      isAction
                      onClick={() => setNotifOpen(true)}
                    />
                  </Box>
                </Box>

                {/* Stack trace panel */}
                <Collapse in={stackOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ px: 1.5, pb: 1.25 }}>
                    <Box sx={{ px: 1.25, py: 0.9, borderRadius: 1.25, bgcolor: "rgba(0,0,0,0.45)", overflowX: "auto", border: "1px solid rgba(239,68,68,0.14)" }}>
                      <Typography component="pre" sx={{ fontSize: "0.62rem", color: "rgba(248,113,113,0.5)", fontFamily: "monospace", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all", lineHeight: 1.7 }}>
                        {parsed.full.replace(/ at /g, "\nat ")}
                      </Typography>
                    </Box>
                  </Box>
                </Collapse>

              </Box>
              </Box>
            );
          })()}
      </Collapse>

      {/* Dialog notificación */}
      <Dialog open={notifOpen} onClose={() => setNotifOpen(false)} maxWidth="md" fullWidth
        sx={{ "& .MuiDialog-paper": { mx: { xs: 1.5, md: "auto" } } }}
        PaperProps={{ sx: { borderRadius: 2.5, bgcolor: "#0d0d18", border: "1px solid rgba(74,222,128,0.2)", boxShadow: "0 0 40px rgba(74,222,128,0.07), 0 8px 32px rgba(0,0,0,0.6)", overflow: "hidden", maxWidth: 780, width: "100%" } }}>

        {/* Header verde */}
        <Box sx={{ px: 2, py: 1.4, bgcolor: "rgba(74,222,128,0.06)", borderBottom: "1px solid rgba(74,222,128,0.12)", display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box sx={{ width: 30, height: 30, borderRadius: 1, bgcolor: "rgba(74,222,128,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <NotificationsActiveIcon sx={{ fontSize: 16, color: "#4ade80" }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.83rem", fontWeight: 700, color: "#4ade80", lineHeight: 1.25 }}>
              Notificar equipo de soporte
            </Typography>
            <Typography sx={{ fontSize: "0.64rem", color: "rgba(74,222,128,0.45)", lineHeight: 1 }}>
              Se enviará el reporte al equipo técnico
            </Typography>
          </Box>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.85)", flexShrink: 0 }} />
        </Box>

        {/* Contenido */}
        <Box sx={{ p: 2 }}>
          <Box sx={{
            px: 1.5, py: 1.25, borderRadius: 1.5,
            bgcolor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(74,222,128,0.1)",
            borderLeft: "3px solid rgba(74,222,128,0.45)",
            overflowX: "auto",
            "&::-webkit-scrollbar": { height: 3 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(74,222,128,0.25)", borderRadius: 2 },
          }}>
            <Typography component="pre" sx={{
              fontSize: "0.72rem", color: "rgba(255,255,255,0.75)",
              fontFamily: "monospace", margin: 0,
              whiteSpace: "pre", lineHeight: 1.85,
            }}>
              {mensajeNotif}
            </Typography>
          </Box>
        </Box>

        {/* Acciones */}
        <Box sx={{ px: 2, pb: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={() => setNotifOpen(false)} sx={{ textTransform: "none", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleEnviar}
            startIcon={<NotificationsActiveIcon sx={{ fontSize: 15 }} />}
            sx={{ textTransform: "none", fontWeight: 700, bgcolor: "rgba(74,222,128,0.16)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.32)", boxShadow: "none", "&:hover": { bgcolor: "rgba(74,222,128,0.26)", boxShadow: "none" }, borderRadius: 1.5, px: 2 }}
          >
            Enviar notificación
          </Button>
        </Box>
      </Dialog>

      {/* Snackbar confirmación */}
      <Snackbar open={notifSent} autoHideDuration={3500} onClose={() => setNotifSent(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setNotifSent(false)} sx={{ fontWeight: 600 }}>
          Notificación enviada al equipo de soporte
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ── FilaHistorial ─────────────────────────────────────────────────────────────
function FilaHistorial({ run, index, dark }) {
  const [open, setOpen] = useState(false);
  const detalle = Array.isArray(run.detalle) ? run.detalle : [];

  return (
    <>
      <TableRow
        onClick={() => detalle.length && setOpen(p => !p)}
        sx={{
          cursor: detalle.length ? "pointer" : "default",
          bgcolor: index % 2 === 0 ? "transparent" : dark ? "rgba(255,255,255,0.013)" : "rgba(0,0,0,0.018)",
          "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" },
          transition: "background 0.12s",
        }}
      >
        <TableCell sx={{ py: 1, fontSize: "0.78rem", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", whiteSpace: "nowrap" }}>
          {formatFecha(run.created_at)}
        </TableCell>
        <TableCell sx={{ py: 1, borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          <EstadoBadge estado={run.estado} />
        </TableCell>
        <TableCell sx={{ py: 1, fontWeight: 700, fontSize: "0.82rem", color: "#4ade80", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          {run.tests_passed}
        </TableCell>
        <TableCell sx={{ py: 1, fontWeight: 700, fontSize: "0.82rem", color: run.tests_failed > 0 ? "#f87171" : dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          {run.tests_failed}
        </TableCell>
        <TableCell sx={{ py: 1, fontSize: "0.78rem", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", fontFamily: "monospace", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          {formatMs(run.duracion_ms)}
        </TableCell>
        {/* Actions cell */}
        <TableCell sx={{ py: 1, borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Tooltip title="Ver en Azure DevOps" arrow>
              <IconButton
                size="small"
                component="a"
                href={AZURE_URL(run.pipeline_id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                sx={{ p: 0.3, color: dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)", "&:hover": { color: "#60a5fa" } }}
              >
                <OpenInNewIcon sx={{ fontSize: 13 }} />
              </IconButton>
            </Tooltip>
            {detalle.length > 0 && (
              <IconButton size="small" sx={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", p: 0.25 }}>
                {open ? <ExpandLessIcon sx={{ fontSize: 15 }} /> : <ExpandMoreIcon sx={{ fontSize: 15 }} />}
              </IconButton>
            )}
          </Box>
        </TableCell>
      </TableRow>

      {detalle.length > 0 && (
        <TableRow sx={{ bgcolor: dark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.025)" }}>
          <TableCell colSpan={6} sx={{ py: 0, px: 0, borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ px: 2, py: 1 }}>
                {detalle.map((t, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 0.5, borderBottom: i < detalle.length - 1 ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` : "none" }}>
                    <Box sx={{ flexShrink: 0, pt: 0.15 }}>
                      {t.estado === "passed"
                        ? <CheckCircleIcon sx={{ fontSize: 12, color: "#4ade80" }} />
                        : <ErrorIcon       sx={{ fontSize: 12, color: "#f87171" }} />}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "0.75rem", color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)", lineHeight: 1.4 }}>
                        {t.nombre}
                      </Typography>
                      {t.estado === "failed" && t.error && (() => {
                        const p = parseJestError(t.error);
                        const etiqueta = p.archivo
                          ? [p.archivo, p.linea ? `L${p.linea}` : null].filter(Boolean).join(":")
                          : p.file;
                        return (
                          <Box sx={{ mt: 0.3, display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: "0.68rem", color: "#f87171", fontWeight: 600 }}>
                              {p.msg}
                            </Typography>
                            {etiqueta && (
                              <Chip label={etiqueta} size="small" sx={{ fontSize: "0.6rem", height: 16, fontFamily: "monospace", bgcolor: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "none" }} />
                            )}
                          </Box>
                        );
                      })()}
                    </Box>
                    <Typography sx={{ fontSize: "0.68rem", color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)", flexShrink: 0, fontFamily: "monospace" }}>
                      {t.duracion_ms != null ? formatMs(t.duracion_ms) : ""}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// ── FiltroChips ───────────────────────────────────────────────────────────────
function FiltroChips({ value, onChange, dark, C }) {
  return (
    <Box sx={{ display: "flex", gap: 0.75, mb: 2 }}>
      {[
        { key: "todos",  label: "Todos" },
        { key: "passed", label: "Passed" },
        { key: "failed", label: "Failed" },
      ].map(({ key, label }) => {
        const active = value === key;
        const accentColor = key === "passed" ? "#4ade80" : key === "failed" ? "#f87171" : C.text;
        const accentBg    = key === "passed" ? "rgba(34,197,94,0.14)"  : key === "failed" ? "rgba(239,68,68,0.14)"  : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.09)";
        const accentBdr   = key === "passed" ? "rgba(34,197,94,0.35)"  : key === "failed" ? "rgba(239,68,68,0.35)"  : C.border;
        return (
          <Chip
            key={key}
            label={label}
            size="small"
            onClick={() => onChange(key)}
            sx={{
              cursor: "pointer",
              fontWeight: active ? 700 : 500,
              fontSize: "0.72rem",
              height: 26,
              bgcolor: active ? accentBg : dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              color:   active ? accentColor : C.textDim,
              border:  `1px solid ${active ? accentBdr : "transparent"}`,
              "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" },
            }}
          />
        );
      })}
    </Box>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export default function PruebasQAS() {
  const [ultima, setUltima]               = useState(null);
  const [historial, setHistorial]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [confirmLimpiar, setConfirmLimpiar] = useState(false);
  const [limpiando, setLimpiando]         = useState(false);
  const [searchParams] = useSearchParams();
  const [filtro, setFiltro]               = useState(() => {
    const f = searchParams.get("filtro");
    return (f === "failed" || f === "passed") ? f : "todos";
  });

  // Sync filtro when URL param changes (e.g. navigating from PWBOT "Revisar pruebas")
  useEffect(() => {
    const f = searchParams.get("filtro");
    if (f === "failed" || f === "passed") setFiltro(f);
  }, [searchParams]);

  // Reset accordion when filtro changes
  useEffect(() => { setOpenWorkflowIndex(0); }, [filtro]);
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [tiempoLabel, setTiempoLabel]     = useState("");
  const [flash, setFlash]                 = useState(false);
  const [runSeleccionado, setRunSeleccionado] = useState(null);
  const [tabHistorial, setTabHistorial]       = useState(0);
  const [openWorkflowIndex, setOpenWorkflowIndex] = useState(0);

  const prevIdRef = useRef(null);
  const detailRef = useRef(null);

  const { temaOscuro, forzarPrd } = useOutletContext();
  const dark = temaOscuro;

  const C = {
    bg:        dark ? "#0a0a0a"                 : "#f4f4f6",
    card:      dark ? "rgba(255,255,255,0.03)"  : "#ffffff",
    border:    dark ? "rgba(255,255,255,0.07)"  : "rgba(0,0,0,0.08)",
    text:      dark ? "#ffffff"                 : "#1b263b",
    textDim:   dark ? "rgba(255,255,255,0.4)"   : "rgba(0,0,0,0.45)",
    textFaint: dark ? "rgba(255,255,255,0.22)"  : "rgba(0,0,0,0.28)",
    label:     dark ? "rgba(255,255,255,0.32)"  : "rgba(0,0,0,0.38)",
  };

  // ── cargar datos ──────────────────────────────────────────────────────────
  const cargar = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("pruebas_qas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (!error && data) {
        const nueva = data[0] ?? null;
        if (prevIdRef.current !== null && nueva && nueva.id !== prevIdRef.current) {
          setFlash(true);
          setTimeout(() => setFlash(false), 1600);
        }
        prevIdRef.current = nueva?.id ?? null;
        setUltima(nueva);
        setHistorial(data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error("Error cargando pruebas QAS:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // inicial
  useEffect(() => { cargar(); }, [cargar]);

  // auto-refresh cada 30s
  useEffect(() => {
    const t = setInterval(() => cargar(false), REFRESH_INTERVAL);
    return () => clearInterval(t);
  }, [cargar]);

  // etiqueta "hace Xs"
  useEffect(() => {
    if (!lastUpdated) return;
    const tick = () => setTiempoLabel(tiempoRelativo(lastUpdated));
    tick();
    const t = setInterval(tick, 5000);
    return () => clearInterval(t);
  }, [lastUpdated]);

  // ── promedio duración por test (últimas 5 ejecuciones) ────────────────────
  const avgDuracion = useMemo(() => {
    const map = {};
    historial.slice(0, 5).forEach(run => {
      (Array.isArray(run.detalle) ? run.detalle : []).forEach(t => {
        if (t.duracion_ms != null) {
          if (!map[t.nombre]) map[t.nombre] = { sum: 0, n: 0 };
          map[t.nombre].sum += t.duracion_ms;
          map[t.nombre].n++;
        }
      });
    });
    const result = {};
    Object.entries(map).forEach(([nombre, { sum, n }]) => {
      result[nombre] = n >= 2 ? sum / n : 0;
    });
    return result;
  }, [historial]);

  // ── duración promedio del pipeline (últimas 5) ────────────────────────────
  const avgDuracionPipeline = useMemo(() => {
    const runs = historial.slice(0, 5).filter(r => r.duracion_ms != null && r.duracion_ms > 0);
    if (runs.length < 2) return null;
    return runs.reduce((s, r) => s + r.duracion_ms, 0) / runs.length;
  }, [historial]);

  // ── tests que fallaron en más de una ejecución ────────────────────────────
  const fallosRecurrentes = useMemo(() => {
    const map = {};
    historial.forEach(run => {
      (Array.isArray(run.detalle) ? run.detalle : []).forEach(t => {
        if (t.estado === "failed") {
          if (!map[t.nombre]) map[t.nombre] = { nombre: t.nombre, count: 0, error: t.error };
          map[t.nombre].count++;
        }
      });
    });
    return Object.values(map).filter(e => e.count >= 2).sort((a, b) => b.count - a.count);
  }, [historial]);

  // ── datos derivados ───────────────────────────────────────────────────────
  const ok          = ultima?.estado === "passed";
  const detalle     = Array.isArray(ultima?.detalle) ? ultima.detalle : [];
  const porcentaje  = ultima ? Math.round((ultima.tests_passed / Math.max(ultima.total_tests, 1)) * 100) : 0;
  const fallidos    = detalle.filter(t => t.estado === "failed");
  const primerFallo = fallidos[0];

  const detalleVisible   = filtro === "todos" ? detalle   : detalle.filter(t => t.estado === filtro);
  const historialVisible = filtro === "todos" ? historial : historial.filter(r => r.estado === filtro);
  const failedVisible    = detalleVisible.filter(t => t.estado === "failed");
  const isSingleFail     = failedVisible.length === 1;

  // ── PWBOT error notification ──────────────────────────────────────────────
  useEffect(() => {
    if (!loading && ultima) {
      if (!ok) {
        window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "Error en producción", errorMode: true } }));
      } else {
        window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "", errorMode: false } }));
      }
    }
    return () => {
      window.dispatchEvent(new CustomEvent("devtools-status", { detail: { message: "", errorMode: false } }));
    };
  }, [loading, ultima, ok]);

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ flex: 1, overflowY: "auto", bgcolor: C.bg, px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>

      {/* Error banner removed — PWBOT notifies via DevTools widget */}

      {/* ── Header ── */}
      <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, gap: 1.5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 1.5, flexShrink: 0, border: `1px solid ${C.border}`, bgcolor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/azure-devops.webp" alt="Azure DevOps" style={{ width: 22, height: 22, objectFit: "contain" }} />
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                  Pruebas Automatizadas
                </Typography>
                <Chip
                  label={forzarPrd ? "PRD" : "QAS"}
                  size="small"
                  sx={{ height: 18, fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.06em", bgcolor: forzarPrd ? "rgba(220,38,38,0.15)" : "rgba(59,130,246,0.15)", color: forzarPrd ? "#f87171" : "#60a5fa", border: `1px solid ${forzarPrd ? "rgba(220,38,38,0.3)" : "rgba(59,130,246,0.3)"}` }}
                />
              </Box>
              <Typography sx={{ fontSize: "0.72rem", color: C.textDim }}>
                Jest · Supertest · Azure DevOps
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {tiempoLabel && (
              <Typography sx={{ fontSize: "0.67rem", color: C.textFaint, display: { xs: "none", sm: "block" }, userSelect: "none" }}>
                {tiempoLabel}
              </Typography>
            )}
            <Tooltip title="Actualizar">
              <IconButton
                onClick={() => cargar(false)}
                disabled={refreshing}
                sx={{ color: C.textDim, border: `1px solid ${C.border}`, borderRadius: 1.5, p: 0.8, "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: C.text } }}
              >
                <RefreshIcon sx={{ fontSize: 18, animation: refreshing ? "spin 0.8s linear infinite" : "none", "@keyframes spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } } }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Limpiar todos los registros">
              <IconButton
                onClick={() => setConfirmLimpiar(true)}
                disabled={limpiando || historial.length === 0}
                sx={{ color: "rgba(239,68,68,0.5)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 1.5, p: 0.8, "&:hover": { bgcolor: "rgba(239,68,68,0.08)", color: "#f87171", borderColor: "rgba(239,68,68,0.4)" }, "&:disabled": { opacity: 0.28 } }}
              >
                <DeleteSweepIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>

      {/* ── Loading ── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
          <CircularProgress size={32} thickness={4} sx={{ color: "#3b82f6" }} />
        </Box>
      )}

      {/* ── Sin datos ── */}
      {!loading && !ultima && (
        <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35 }}>
          <Box sx={{ textAlign: "center", py: 10 }}>
            <BugReportIcon sx={{ fontSize: 42, color: C.textFaint, mb: 1.5 }} />
            <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: C.textDim }}>Sin resultados aún</Typography>
            <Typography sx={{ fontSize: "0.78rem", color: C.textFaint, mt: 0.5 }}>
              El pipeline guardará el primer resultado al ejecutarse.
            </Typography>
          </Box>
        </motion.div>
      )}

      {/* ── Con datos ── */}
      {!loading && ultima && (
        <>
          {/* Banner estado */}
          <motion.div
            variants={fadein} initial="hidden"
            animate={flash ? { opacity: [1, 0.35, 1, 0.35, 1], transition: { duration: 0.9 } } : "show"}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <Paper elevation={0} sx={{ mb: 2.5, borderRadius: 2.5, border: `1px solid ${ok ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.35)"}`, bgcolor: ok ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)", overflow: "hidden", boxShadow: ok ? "none" : "0 0 0 1px rgba(239,68,68,0.12), 0 4px 20px rgba(239,68,68,0.1)" }}>

              {/* Barra de progreso */}
              <LinearProgress variant="determinate" value={porcentaje} sx={{ height: 4, bgcolor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", "& .MuiLinearProgress-bar": { bgcolor: ok ? "#4ade80" : "#f87171", transition: "none" } }} />

              <Box sx={{ px: { xs: 2, md: 2.5 }, pt: 2, pb: ok ? 2 : 1.5 }}>

                {/* Fila superior: icono + título + badge + stats */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "flex-start" }}>

                  {/* Icono estado */}
                  <Box sx={{ flexShrink: 0, width: 42, height: 42, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: `1px solid ${ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                    {ok
                      ? <CheckCircleIcon sx={{ fontSize: 22, color: "#4ade80" }} />
                      : <ErrorIcon       sx={{ fontSize: 22, color: "#f87171" }} />}
                  </Box>

                  {/* Título + meta */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.3 }}>
                      <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: C.text, lineHeight: 1.2 }}>
                        {ok ? "Todos los tests pasaron" : "Pipeline con errores"}
                      </Typography>
                      <Chip
                        label={`Última prueba ${tiempoRelativo(new Date(ultima.created_at))}`}
                        size="small"
                        sx={{ height: 20, fontSize: "0.67rem", fontWeight: 500, bgcolor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", color: C.textDim, border: "none" }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: C.textFaint }} />
                      <Typography sx={{ fontSize: "0.74rem", color: C.textDim }}>{formatFecha(ultima.created_at)}</Typography>
                      <Typography sx={{ fontSize: "0.74rem", color: C.textFaint }}>·</Typography>
                      <Tooltip title="Ver pipeline en Azure DevOps" arrow>
                        <Box
                          component="a"
                          href={AZURE_URL(ultima.pipeline_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, color: C.textDim, textDecoration: "none", fontSize: "0.74rem", fontWeight: 500, "&:hover": { color: "#60a5fa" } }}
                        >
                          Build #{ultima.pipeline_id}
                          <OpenInNewIcon sx={{ fontSize: 11 }} />
                        </Box>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, md: 2.5 }, alignSelf: "center", width: { xs: "100%", md: "auto" } }}>
                    {[
                      { label: "Total",      val: ultima.total_tests,                                                    color: C.text },
                      { label: "Operativos", val: ultima.tests_passed,                                                   color: "#4ade80" },
                      { label: "Fallidos",   val: ultima.tests_failed,                                                   color: ultima.tests_failed > 0 ? "#f87171" : C.textFaint },
                      { label: "Duración",   val: formatMs(ultima.duracion_ms),                                          color: "#60a5fa" },
                      ...(avgDuracionPipeline ? [{ label: "Prom. 5x", val: formatMs(Math.round(avgDuracionPipeline)),    color: C.textFaint, hide: true }] : []),
                    ].map(m => (
                      <Box key={m.label} sx={{ textAlign: "center", display: m.hide ? { xs: "none", md: "block" } : "block" }}>
                        <Typography sx={{ fontSize: { xs: "1rem", md: "1.15rem" }, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</Typography>
                        <Typography sx={{ fontSize: "0.6rem", color: C.label, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", mt: 0.3 }}>{m.label}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

              </Box>
            </Paper>
          </motion.div>


          {/* Filtros */}
          <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35, delay: 0.1 }}>
            <FiltroChips value={filtro} onChange={setFiltro} dark={dark} C={C} />
          </motion.div>

          {/* Detalle última ejecución */}
          {detalle.length > 0 && (
            <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35, delay: 0.12 }}>
              <Paper
                ref={detailRef}
                elevation={0}
                sx={{ mb: 2.5, borderRadius: 2, bgcolor: C.card, border: `1px solid ${C.border}`, overflow: "hidden" }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Detalle — última ejecución
                  </Typography>
                  <Chip
                    label={`${detalleVisible.filter(t => t.estado === "passed").length} / ${detalleVisible.length}`}
                    size="small"
                    sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700, fontFamily: "monospace", bgcolor: ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: ok ? "#4ade80" : "#f87171", border: `1px solid ${ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}` }}
                  />
                </Box>
                {detalleVisible.length === 0 ? (
                  <Box sx={{ px: 2, py: 3, textAlign: "center" }}>
                    <Typography sx={{ fontSize: "0.78rem", color: C.textFaint }}>Sin tests que coincidan con el filtro.</Typography>
                  </Box>
                ) : (
                  detalleVisible.map((t, i) => (
                    <TestRow
                      key={i} t={t} i={i} dark={dark} avgDuracion={avgDuracion}
                      workflowOpen={isSingleFail ? t.estado === "failed" : openWorkflowIndex === i}
                      onToggleWorkflow={isSingleFail ? undefined : () => setOpenWorkflowIndex(prev => prev === i ? null : i)}
                    />
                  ))
                )}
              </Paper>
            </motion.div>
          )}

          {/* Historial + Fallos recurrentes */}
          {historial.length > 1 && (
            <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35, delay: 0.14 }}>
              <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: C.card, border: `1px solid ${C.border}`, overflow: "hidden" }}>

                {/* Header: segmented control + círculos */}
                <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${C.border}`, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: { xs: 0.75, sm: 1.5 } }}>
                  {/* Segmented control */}
                  <Box sx={{ display: "flex", bgcolor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)", borderRadius: 1.5, p: 0.4, gap: 0.3, flexShrink: 0 }}>
                    {[
                      { i: 0, label: `Historial · ${historial.length}` },
                      { i: 1, label: "Fallos recurrentes", badge: fallosRecurrentes.length > 0 ? fallosRecurrentes.length : null },
                    ].map(({ i, label, badge }) => (
                      <Box
                        key={i}
                        onClick={() => setTabHistorial(i)}
                        sx={{ px: 1.4, py: 0.55, borderRadius: 1.25, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.6, bgcolor: tabHistorial === i ? (dark ? "rgba(255,255,255,0.11)" : "#fff") : "transparent", boxShadow: tabHistorial === i ? "0 1px 4px rgba(0,0,0,0.18)" : "none", transition: "all 0.15s", userSelect: "none" }}
                      >
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: tabHistorial === i ? C.text : C.textDim, whiteSpace: "nowrap", lineHeight: 1 }}>
                          {label}
                        </Typography>
                        {badge != null && (
                          <Box sx={{ width: 15, height: 15, borderRadius: "50%", bgcolor: tabHistorial === i ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Typography sx={{ fontSize: "0.56rem", fontWeight: 800, color: "#f87171", lineHeight: 1 }}>{badge}</Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                  {/* Mini-timeline circles */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    {[...historial].reverse().map((run) => {
                      const selected = runSeleccionado?.id === run.id;
                      return (
                        <Tooltip key={run.id} title={`Build #${run.pipeline_id} · ${run.tests_passed}/${run.total_tests} passed · ${formatFecha(run.created_at)}`} arrow>
                          <Box
                            onClick={() => { setRunSeleccionado(selected ? null : run); setTabHistorial(0); }}
                            sx={{ width: selected ? 12 : 9, height: selected ? 12 : 9, borderRadius: "50%", flexShrink: 0, cursor: "pointer", bgcolor: run.estado === "passed" ? "#4ade80" : "#f87171", outline: selected ? `2px solid ${run.estado === "passed" ? "#4ade80" : "#f87171"}` : "none", outlineOffset: 2, transition: "all 0.15s", "&:hover": { transform: "scale(1.4)" } }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>

                {/* Tab 0: tabla historial */}
                {tabHistorial === 0 && (
                  <Box sx={{ overflowX: "auto" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          {["Fecha", "Estado", "Pass", "Fail", "Duración", ""].map(h => (
                            <TableCell key={h} sx={{ py: 1, fontSize: "0.67rem", fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.06em", borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", whiteSpace: "nowrap" }}>
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {historialVisible.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} sx={{ textAlign: "center", py: 3, fontSize: "0.78rem", color: C.textFaint, borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)" }}>
                              Sin ejecuciones que coincidan con el filtro.
                            </TableCell>
                          </TableRow>
                        ) : (
                          historialVisible.map((run, i) => (
                            <FilaHistorial key={run.id} run={run} index={i} dark={dark} />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </Box>
                )}

                {/* Tab 1: fallos recurrentes */}
                {tabHistorial === 1 && (
                  <Box>
                    {fallosRecurrentes.length === 0 ? (
                      <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
                        <CheckCircleIcon sx={{ fontSize: 28, color: "#4ade80", mb: 1 }} />
                        <Typography sx={{ fontSize: "0.82rem", color: C.textDim, fontWeight: 500 }}>Sin fallos recurrentes</Typography>
                        <Typography sx={{ fontSize: "0.72rem", color: C.textFaint, mt: 0.4 }}>Ningún test ha fallado más de una vez en el historial.</Typography>
                      </Box>
                    ) : fallosRecurrentes.map((t, i) => {
                      const p = parseJestError(t.error);
                      return (
                        <Box key={t.nombre} sx={{ px: 2, py: 1.2, display: "flex", alignItems: "flex-start", gap: 1.5, borderBottom: i < fallosRecurrentes.length - 1 ? `1px solid ${C.border}` : "none" }}>
                          <Box sx={{ flexShrink: 0, mt: 0.1, width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.22)" }}>
                            <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, color: "#f87171" }}>{t.count}×</Typography>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: C.text }}>{t.nombre}</Typography>
                            {p?.msg && <Typography sx={{ fontSize: "0.72rem", color: "#f87171", mt: 0.2 }}>{p.msg}</Typography>}
                            {(p?.archivo || p?.file) && (
                              <Typography sx={{ fontSize: "0.65rem", color: C.textFaint, fontFamily: "monospace", mt: 0.2 }}>
                                {p.archivo ? `${p.archivo}${p.linea ? `:${p.linea}` : ""}` : p.file}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}

          {/* Detalle run seleccionado desde mini-timeline */}
          <Collapse in={!!runSeleccionado} timeout="auto" unmountOnExit>
            {historial.length > 1 && (
              <motion.div variants={fadein} initial="hidden" animate="show" transition={{ duration: 0.35 }}>
                <Paper elevation={0} sx={{ mt: 1, borderRadius: 2, bgcolor: C.card, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <Collapse in={!!runSeleccionado} timeout="auto" unmountOnExit>
                  {runSeleccionado && (() => {
                    const detRun = Array.isArray(runSeleccionado.detalle) ? runSeleccionado.detalle : [];
                    const runOk  = runSeleccionado.estado === "passed";
                    return (
                      <Box sx={{ borderTop: `1px solid ${C.border}` }}>
                        <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <EstadoBadge estado={runSeleccionado.estado} />
                            <Typography sx={{ fontSize: "0.73rem", color: C.textDim }}>
                              Build #{runSeleccionado.pipeline_id} · {formatFecha(runSeleccionado.created_at)}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: "0.7rem", color: C.textFaint, fontFamily: "monospace" }}>
                            {runSeleccionado.tests_passed}/{runSeleccionado.total_tests} · {formatMs(runSeleccionado.duracion_ms)}
                          </Typography>
                        </Box>
                        {detRun.map((t, i) => (
                          <Box key={i} sx={{ px: 2, py: 0.75, display: "flex", alignItems: "flex-start", gap: 1.5, borderTop: `1px solid ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}` }}>
                            <Box sx={{ flexShrink: 0, pt: 0.15 }}>
                              {t.estado === "passed"
                                ? <CheckCircleIcon sx={{ fontSize: 13, color: "#4ade80" }} />
                                : <ErrorIcon       sx={{ fontSize: 13, color: "#f87171" }} />}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontSize: "0.78rem", color: t.estado === "passed" ? C.textDim : C.text, fontWeight: t.estado === "failed" ? 600 : 400 }}>
                                {t.nombre}
                              </Typography>
                              {t.estado === "failed" && t.error && (() => {
                                const p = parseJestError(t.error);
                                return <Typography sx={{ fontSize: "0.68rem", color: "#f87171", mt: 0.2 }}>{p.msg}</Typography>;
                              })()}
                            </Box>
                            <Typography sx={{ fontSize: "0.68rem", color: C.textFaint, fontFamily: "monospace", flexShrink: 0 }}>
                              {t.duracion_ms != null ? formatMs(t.duracion_ms) : ""}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })()}
                </Collapse>
                </Paper>
              </motion.div>
            )}
          </Collapse>
        </>
      )}

      {/* Diálogo confirmar limpiar */}
      <Dialog
        open={confirmLimpiar}
        onClose={() => setConfirmLimpiar(false)}
        PaperProps={{ sx: { bgcolor: dark ? "#111" : "#fff", border: `1px solid ${C.border}`, borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: C.text, fontSize: "1rem", fontWeight: 700, pb: 0.5 }}>
          Limpiar historial de pruebas
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: C.textDim, fontSize: "0.85rem" }}>
            Se eliminarán <strong style={{ color: "#f87171" }}>todos los registros</strong> de la tabla{" "}
            <code style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>pruebas_qas</code>. Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmLimpiar(false)} size="small" sx={{ color: C.textDim, textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              setLimpiando(true);
              try {
                await supabase.from("pruebas_qas").delete().neq("id", 0);
                setUltima(null);
                setHistorial([]);
                prevIdRef.current = null;
              } catch (e) {
                console.error("Error limpiando tabla:", e);
              } finally {
                setLimpiando(false);
                setConfirmLimpiar(false);
              }
            }}
            disabled={limpiando}
            variant="contained"
            size="small"
            sx={{ bgcolor: "#ef4444", color: "#fff", textTransform: "none", "&:hover": { bgcolor: "#dc2626" }, "&:disabled": { opacity: 0.5 } }}
          >
            {limpiando ? "Eliminando..." : "Sí, limpiar todo"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
