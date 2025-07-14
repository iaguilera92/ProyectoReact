import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { cargarClientesDesdeExcel } from "../../helpers/HelperClientes";
import MenuInferior from './MenuInferior';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GroupIcon from "@mui/icons-material/Group";
import { motion } from "framer-motion";

const baseDelay = 1.5; // segundos antes de comenzar la animación
const letterDelay = 0.04;

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: baseDelay + i * letterDelay,
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  }),
};

const totalChars = "Gestión Mensual de Clientes".length;
const iconDelay = baseDelay + totalChars * letterDelay + 0.2;

// 🔴 Pulsación animada
const RedDot = styled("div")(() => ({
  position: "relative",
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  backgroundColor: "#ff3b3b",
  boxShadow: "0 0 6px rgba(255,0,0,0.5)",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundColor: "#ff3b3b",
    opacity: 0.6,
    transform: "scale(1)",
    animation: `${keyframes`
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    `} 1.4s ease-out infinite`,
  },
}));


const GreenDot = styled("div")(() => ({
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  backgroundColor: "#00e676",
  boxShadow: "0 0 6px rgba(0,255,0,0.5)",
}));

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const cardSize = isMobile ? "300px" : "340px";
  const [clientesPagados, setClientesPagados] = useState([]);
  const mes = new Date().toLocaleString("es-CL", { month: "long" });

  useEffect(() => {
    const fetchData = async () => {
      const data = await cargarClientesDesdeExcel();
      setClientes(data);
    };
    fetchData();
  }, []);

  const marcarComoPagado = (index) => {
    setClientesPagados((prev) => [...prev, index]);
  };

  return (
    <Box
      sx={{
        height: isMobile ? "100dvh" : "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundImage: 'url(/fondo-blizz.avif)',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        paddingTop: isMobile ? 14 : 13,
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h5"}
        fontWeight={700}
        sx={{
          color: "#e3f2fd",
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          textShadow: "2px 2px 6px rgba(0,0,0,0.5)",
          mb: 3,
        }}
      >
        {"Gestión Mensual de Clientes".split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}

        <motion.div
          style={{ display: 'flex', alignItems: 'center' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: iconDelay, duration: 0.4, type: "spring" }}
        >
          <GroupIcon sx={{ fontSize: isMobile ? 28 : 34, ml: 1.5, color: "#90caf9" }} />
        </motion.div>

      </Typography>

      <Box sx={{ width: "100%", px: isMobile ? 1 : 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            width: isMobile ? "100%" : "70%",
            maxHeight: "80vh",
            borderRadius: "12px",
            overflowX: isMobile ? "auto" : "hidden", // 👈 scroll horizontal solo en mobile
            overflowY: "auto",
            boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: isMobile ? 400 : "auto", // ← esto estabiliza el ancho de columnas en mobile
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", minWidth: isMobile ? 160 : 160 }}>Clientes</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: isMobile ? 50 : 100 }}>Estado</TableCell>
                <TableCell
                  align="center"
                  sx={{ width: isMobile ? 60 : 140, px: isMobile ? 0.5 : 1 }}
                />

                <TableCell
                  align="center"
                  sx={{ width: isMobile ? 80 : 170, px: isMobile ? 0.5 : 1, pr: isMobile ? 1.5 : 0 }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.map((cliente, index) => {
                const estaAlDia = index === 1 || clientesPagados.includes(index);

                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: estaAlDia ? 'rgba(200, 255, 200, 0.12)' : 'transparent',
                      transition: 'background-color 0.3s ease-in-out',
                    }}
                  >
                    {/* Cliente */}
                    <TableCell
                      sx={{
                        minWidth: isMobile ? 160 : 160,
                        maxWidth: isMobile ? 160 : 200,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#1a0dab",
                          textDecoration: "underline",
                          fontWeight: 500,
                          fontSize: isMobile ? "0.75rem" : "1rem",
                          cursor: "pointer",
                          "&:hover": { color: "#0b0080" },
                        }}
                        onClick={() => window.open(`https://${cliente.sitioWeb}`, "_blank")}
                      >
                        {cliente.sitioWeb || "Sin sitio"}
                      </Typography>
                    </TableCell>


                    {/* Estado */}
                    <TableCell
                      align="center"
                      sx={{
                        pl: 1, // 👈 reduce padding izquierdo
                        width: isMobile ? 50 : 100,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          minHeight: "50px",
                        }}
                      >
                        {estaAlDia ? <GreenDot /> : <RedDot />}
                      </Box>
                    </TableCell>

                    {/* Cobrar */}
                    <TableCell
                      align="center"
                      sx={{
                        pl: 0.5, // 👈 reducir espacio izquierdo
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          minHeight: "50px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            const mensaje = `Buenas! recordar el pago del HOSTING de www.${cliente.sitioWeb} de *${cliente.valor}* del mes de ${mes}.`;
                            const numero = cliente.telefono || "56992914526"; // ← Usa aquí el número real del cliente
                            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
                            window.open(url, "_blank");
                          }}
                          disabled={estaAlDia}
                          sx={{
                            fontSize: isMobile ? 0 : "0.8rem",
                            px: isMobile ? 1.5 : 2.2,
                            py: isMobile ? 0.7 : 0.8,
                            '&.Mui-disabled': {
                              cursor: 'not-allowed !important',
                              pointerEvents: 'auto',
                              opacity: 0.6,
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          }}
                        >
                          {isMobile ? <MonetizationOnIcon fontSize="small" /> : "Cobrar"}
                        </Button>
                      </Box>
                    </TableCell>

                    {/* Pago recibido o Pagado */}
                    <TableCell
                      align="center"
                      sx={{
                        pl: 0.5, // 👈 reducir espacio izquierdo
                      }}
                    >
                      {estaAlDia ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 0.6,
                            px: 1.5,
                            py: 0.8,
                            borderRadius: "8px",
                            minHeight: "56px",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ color: "#2e7d32", fontWeight: 600 }}
                          >
                            ✅ {isMobile ? "Pagado" : "Pago recibido"}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "56px",
                            px: 1.2,
                            py: 0.5,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => marcarComoPagado(index)}
                            sx={{
                              px: isMobile ? 1.5 : 2.2,
                              py: isMobile ? 0.7 : 0.8,
                              fontSize: isMobile ? 0 : "0.8rem",
                              fontWeight: 600,
                              textTransform: "none",
                            }}
                          >
                            {isMobile ? <DoneAllIcon fontSize="small" /> : "Pago recibido"}
                          </Button>

                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>

          </Table>
        </TableContainer>
      </Box>
      <MenuInferior cardSize={cardSize} modo="clientes" />
    </Box>
  );
};

export default Clientes;
