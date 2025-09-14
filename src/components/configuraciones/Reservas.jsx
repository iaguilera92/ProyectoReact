// src/components/Reservas.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
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
import MenuInferior from "./MenuInferior";

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const cardSize = isMobile ? "300px" : "360px";
  const paginadas = reservas.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
        console.error("❌ Error cargando Reservas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        width: "100%",
        py: 10,
        px: { xs: 1, sm: 3 },
        backgroundImage: "url(/fondo-blizz.avif)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ pb: 8 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={0.3}
          mb={2}
          mt={2}
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            background: "linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))",
            backdropFilter: "blur(6px)",
          }}
        >
          <Box
            component="img"
            src="/logo-transbank.png"
            alt="Transbank"
            sx={{
              height: { xs: 14, sm: 24 },
              mt: "-2px",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            }}
          />
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: { xs: "0.8rem", sm: "1.35rem" },
              textShadow: "0 2px 6px rgba(0,0,0,0.45)",
              letterSpacing: "0.2px",
            }}
          >
            Transacciones recibidas – Reservas💰
          </Typography>
        </Box>


        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
            }}
          >
            <CircularProgress />
          </Box>
        ) : reservas.length === 0 ? (
          <Typography
            sx={{ textAlign: "center", color: "white", mt: 4 }}
          >
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
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    mb: 0,
                    background: "linear-gradient(135deg, #e8f5e9, #f9fbe7)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* Email + Orden en la misma fila */}
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.3}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        color: "black", // azul fuerte (similar al de "info.main")
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "65%",
                        display: "inline-block",
                      }}
                    >
                      📧 {reserva.Email || "Sin correo"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.7rem", color: "text.secondary", fontWeight: 500 }}
                    >
                      Orden: {reserva.BuyOrder}
                    </Typography>
                  </Box>

                  {/* Monto + Estado + Nueva si es hoy */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography
                      fontWeight={700}
                      fontSize="0.85rem"
                      color="success.main"
                      sx={{ display: "flex", alignItems: "center", gap: 0.4 }}
                    >
                      <Box component="span" sx={{ fontSize: "1rem", lineHeight: 1, mt: "-3px" }}>
                        💵
                      </Box>
                      ${Number(reserva.Amount || 0).toLocaleString("es-CL")}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                      {/* Badge NUEVA si la transacción es de hoy */}
                      {reserva.CreatedAt &&
                        new Date(reserva.CreatedAt).toDateString() === new Date().toDateString() && (
                          <Box
                            component="span"
                            sx={{
                              px: 0.8,
                              py: 0.2,
                              borderRadius: "8px",
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              bgcolor: "rgba(33, 150, 243, 0.15)", // azul claro translúcido
                              color: "#1565c0", // azul fuerte
                              border: "1px solid #64b5f6", // azul pastel
                            }}
                          >
                            💳 Nueva transacción
                          </Box>

                        )}

                      {/* Estado */}
                      <Box
                        component="span"
                        sx={{
                          px: 0.7,
                          py: 0.1,
                          borderRadius: "10px",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          color: reserva.Status === "AUTHORIZED" ? "success.dark" : "error.dark",
                          bgcolor:
                            reserva.Status === "AUTHORIZED"
                              ? "rgba(56,142,60,0.12)"
                              : "rgba(211,47,47,0.12)",
                          border: "1px solid",
                          borderColor: reserva.Status === "AUTHORIZED" ? "success.light" : "error.light",
                        }}
                      >
                        {reserva.Status}
                      </Box>
                    </Box>
                  </Box>

                  {/* Fecha */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.68rem",
                      display: "block",
                      mt: 0.2,
                    }}
                  >
                    {reserva.CreatedAt
                      ? new Date(reserva.CreatedAt).toLocaleString("es-CL")
                      : "N/D"}
                  </Typography>
                </Paper>

              ))}
            </Box>

            {/* Paginador */}
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={Math.ceil(reservas.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#fff", // números en blanco
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.2)", // seleccionado con fondo translúcido
                    color: "#fff",
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: "#fff", // puntos suspensivos
                  },
                  "& .MuiPaginationItem-icon": {
                    color: "#fff", // flechas
                  },
                }}
              />
            </Box>
          </>
        ) : (
          // 💻 Desktop: Tabla
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: 3,
              boxShadow: 6,
              bgcolor: "white",
            }}
          >
            <Table
              size="small"
              sx={{
                "& .MuiTableCell-root": {
                  fontFamily: "Poppins, sans-serif",
                },
                "& .MuiTableCell-head": {
                  backgroundColor: "#fafafa",
                  fontWeight: "bold",
                  color: "#1b263b",
                },
              }}
            >
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
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" },
                      "&:hover": { bgcolor: "#f1f7ff" },
                    }}
                  >
                    <TableCell>{reserva.IdReserva}</TableCell>
                    <TableCell>{reserva.Email}</TableCell>
                    <TableCell>{reserva.BuyOrder}</TableCell>
                    <TableCell>
                      ${Number(reserva.Amount || 0).toLocaleString("es-CL")}
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.3,
                          borderRadius: "8px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color:
                            reserva.Status === "AUTHORIZED" ? "success.dark" : "error.dark",
                          bgcolor:
                            reserva.Status === "AUTHORIZED"
                              ? "rgba(56,142,60,0.12)"
                              : "rgba(211,47,47,0.12)",
                        }}
                      >
                        {reserva.Status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {reserva.CardNumber
                        ? `**** ${String(reserva.CardNumber).slice(-4)}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {reserva.CreatedAt
                        ? new Date(reserva.CreatedAt).toLocaleString("es-CL")
                        : "N/D"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 🔽 Paginación debajo de la tabla */}
            <Box display="flex" justifyContent="center" py={2}>
              <Pagination
                count={Math.ceil(reservas.length / rowsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#1b263b", // números en azul oscuro
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "rgba(56,142,60,0.15)", // verde pastel
                    color: "#1b263b",
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: "#1b263b",
                  },
                  "& .MuiPaginationItem-icon": {
                    color: "#1b263b",
                  },
                }}
              />
            </Box>
          </Paper>
        )}
      </Box>

      {/* Menú inferior */}
      <MenuInferior cardSize={cardSize} modo="reservas" />
    </Container>
  );
};

export default Reservas;
