// src/components/Reservas.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Pagination
} from "@mui/material";
import { motion } from "framer-motion";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const paginadas = reservas.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem("pw-sidebar") !== "false");
  const toggleSidebar = () => setSidebarOpen(p => { const next = !p; localStorage.setItem("pw-sidebar", String(next)); return next; });
  const [temaOscuro, setTemaOscuro] = useState(() => localStorage.getItem("pw-tema") !== "claro");
  const handleTema = (oscuro) => { setTemaOscuro(oscuro); localStorage.setItem("pw-tema", oscuro ? "oscuro" : "claro"); };
  const [forzarPrd, setForzarPrd] = useState(false);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const resp = await fetch(
          `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/Reservas.xlsx?t=${Date.now()}`
        );
        const buffer = await resp.arrayBuffer();
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(hoja, { defval: "" });
        const ordenadas = data.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setReservas(ordenadas);
      } catch (err) {
        console.error("Error cargando Reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", bgcolor: temaOscuro ? "#0a0a0a" : "#f0f0f0" }}>
      <NavbarAdmin
        titulo="Reservas"
        temaOscuro={temaOscuro}
        onMenuClick={toggleSidebar}
        forzarPrd={forzarPrd}
        onForzarPrd={setForzarPrd}
      />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SidebarAdmin
          open={sidebarOpen}
          temaOscuro={temaOscuro}
          onTemaChange={handleTema}
          onClose={() => { setSidebarOpen(false); localStorage.setItem("pw-sidebar", "false"); }}
          esPrd={forzarPrd}
        />
        <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", pb: 4, px: { xs: 1, md: 4 }, pt: 2 }}>

          {/* Encabezado */}
          <Box display="flex" alignItems="center" gap={0.3} mb={2} sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: temaOscuro ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
            <Box component="img" src="/logo-transbank.png" alt="Transbank" sx={{ height: { xs: 14, sm: 24 }, mt: "-2px", width: "auto", objectFit: "contain" }} />
            <Typography variant="h6" fontWeight={800} sx={{ color: temaOscuro ? "#fff" : "#1b263b", fontSize: { xs: "0.8rem", sm: "1.1rem" } }}>
              Transacciones recibidas – Reservas
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : reservas.length === 0 ? (
            <Typography sx={{ textAlign: "center", color: temaOscuro ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", mt: 4 }}>
              No hay reservas registradas todavía.
            </Typography>
          ) : isMobile ? (
            <>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {paginadas.map((reserva, index) => (
                  <Paper
                    key={reserva.IdReserva || index}
                    component={motion.div}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    sx={{ p: 1, borderRadius: 1.5, background: temaOscuro ? "#141414" : "linear-gradient(135deg,#e8f5e9,#f9fbe7)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.3}>
                      <Typography variant="body2" sx={{ fontSize: "0.7rem", fontWeight: 700, color: temaOscuro ? "#fff" : "black", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "65%" }}>
                        {reserva.Email || "Sin correo"}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: "0.7rem", color: temaOscuro ? "rgba(255,255,255,0.5)" : "text.secondary", fontWeight: 500 }}>
                        Orden: {reserva.BuyOrder}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight={700} fontSize="0.85rem" color="success.main">
                        ${Number(reserva.Amount || 0).toLocaleString("es-CL")}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        {reserva.CreatedAt && new Date(reserva.CreatedAt).toDateString() === new Date().toDateString() && (
                          <Box component="span" sx={{ px: 0.8, py: 0.2, borderRadius: "8px", fontSize: "0.65rem", fontWeight: 700, bgcolor: "rgba(33,150,243,0.15)", color: "#1565c0", border: "1px solid #64b5f6" }}>
                            Nueva transacción
                          </Box>
                        )}
                        <Box component="span" sx={{ px: 0.7, py: 0.1, borderRadius: "10px", fontSize: "0.65rem", fontWeight: 600, color: reserva.Status === "AUTHORIZED" ? "success.dark" : "error.dark", bgcolor: reserva.Status === "AUTHORIZED" ? "rgba(56,142,60,0.12)" : "rgba(211,47,47,0.12)", border: "1px solid", borderColor: reserva.Status === "AUTHORIZED" ? "success.light" : "error.light" }}>
                          {reserva.Status}
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="caption" sx={{ color: temaOscuro ? "rgba(255,255,255,0.4)" : "text.secondary", fontSize: "0.68rem", display: "block", mt: 0.2 }}>
                      {reserva.CreatedAt ? new Date(reserva.CreatedAt).toLocaleString("es-CL") : "N/D"}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={Math.ceil(reservas.length / rowsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  sx={{ "& .MuiPaginationItem-root": { color: temaOscuro ? "#fff" : "#1b263b" } }}
                />
              </Box>
            </>
          ) : (
            <Paper sx={{ overflow: "hidden", borderRadius: 3, boxShadow: 6, bgcolor: temaOscuro ? "#141414" : "white" }}>
              <Table size="small" sx={{ "& .MuiTableCell-root": { fontFamily: "Poppins, sans-serif" }, "& .MuiTableCell-head": { backgroundColor: temaOscuro ? "#1a1a1a" : "#fafafa", fontWeight: "bold", color: temaOscuro ? "#fff" : "#1b263b" } }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Orden</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Tarjeta</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginadas.map((reserva, index) => (
                    <TableRow
                      key={reserva.IdReserva || index}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: temaOscuro ? "#1a1a1a" : "#f9f9f9" }, "&:hover": { bgcolor: temaOscuro ? "#222" : "#f1f7ff" }, "& td": { color: temaOscuro ? "rgba(255,255,255,0.85)" : "#1b263b" } }}
                    >
                      <TableCell>{reserva.IdReserva}</TableCell>
                      <TableCell>{reserva.Email}</TableCell>
                      <TableCell>{reserva.BuyOrder}</TableCell>
                      <TableCell>${Number(reserva.Amount || 0).toLocaleString("es-CL")}</TableCell>
                      <TableCell>
                        <Box component="span" sx={{ px: 1, py: 0.3, borderRadius: "8px", fontSize: "0.75rem", fontWeight: 600, color: reserva.Status === "AUTHORIZED" ? "success.dark" : "error.dark", bgcolor: reserva.Status === "AUTHORIZED" ? "rgba(56,142,60,0.12)" : "rgba(211,47,47,0.12)" }}>
                          {reserva.Status}
                        </Box>
                      </TableCell>
                      <TableCell>{reserva.CardNumber ? `**** ${String(reserva.CardNumber).slice(-4)}` : "-"}</TableCell>
                      <TableCell>{reserva.CreatedAt ? new Date(reserva.CreatedAt).toLocaleString("es-CL") : "N/D"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box display="flex" justifyContent="center" py={2}>
                <Pagination
                  count={Math.ceil(reservas.length / rowsPerPage)}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  shape="rounded"
                  sx={{ "& .MuiPaginationItem-root": { color: temaOscuro ? "#fff" : "#1b263b" }, "& .MuiPaginationItem-root.Mui-selected": { backgroundColor: temaOscuro ? "rgba(255,255,255,0.15)" : "rgba(56,142,60,0.15)" } }}
                />
              </Box>
            </Paper>
          )}

        </Box>
      </Box>
    </Box>
  );
};

export default Reservas;
