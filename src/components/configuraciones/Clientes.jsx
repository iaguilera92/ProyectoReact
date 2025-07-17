import React, { useEffect, useState } from "react";
import { Snackbar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { cargarClientesDesdeExcel } from "../../helpers/HelperClientes";
import MenuInferior from './MenuInferior';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GroupIcon from "@mui/icons-material/Group";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

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
  const mes = new Date().toLocaleString("es-CL", { month: "long" });
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const [botonesBloqueados, setBotonesBloqueados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 5;
  const [actualizando, setActualizando] = useState(false);

  const indiceInicio = (paginaActual - 1) * clientesPorPagina;
  const indiceFin = indiceInicio + clientesPorPagina;
  const clientesPaginados = clientes.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [esReversion, setEsReversion] = useState(false);

  const totalGanado = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return c.pagado ? acc + valor : acc;
  }, 0);

  const totalDeuda = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return !c.pagado ? acc + valor : acc;
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cargarClientesDesdeExcel();
      const clientesConEstado = data.map((c) => ({
        ...c,
        pagado: !!c.pagado,
      }));
      setClientes(clientesConEstado);
    };
    fetchData();
  }, []);


  const abrirDialogoConfirmacion = (cliente, revertir = false) => {
    setClienteSeleccionado(cliente);
    setEsReversion(revertir);
    setOpenDialog(true);
  };


  const marcarComoPagado = (index) => {
    setClientes((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, pagado: true } : c
      )
    );
  };

  const confirmarPago = async (revertir = false) => {
    console.log("⚙️ Ejecutando confirmarPago...");
    console.log("➡️ Cliente seleccionado:", clienteSeleccionado);
    if (!clienteSeleccionado || !clienteSeleccionado.idCliente) {
      setSnackbar({ open: true, message: "Debe seleccionar un cliente válido." });
      return;
    }

    const url = `${window.location.hostname === "localhost" ? "http://localhost:9999" : ""}/.netlify/functions/actualizarCliente`;
    setActualizando(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCliente: clienteSeleccionado.idCliente,
          revertir,
        }),
      });

      const text = await res.text();
      let result = {};

      try {
        result = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("❌ Error parseando respuesta JSON:", e, text);
        result = { message: "Respuesta inválida del servidor." };
      }

      if (res.ok) {
        const nuevosClientes = await cargarClientesDesdeExcel();
        setClientes(nuevosClientes);
        setSnackbar({
          open: true,
          message: result.message || (revertir ? "Pago revertido correctamente" : "Pago confirmado correctamente"),
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message || "No se pudo actualizar el pago.",
        });
      }
    } catch (error) {
      console.error("❌ Error de red/servidor:", error);
      setSnackbar({ open: true, message: "Error de red o del servidor." });
    } finally {
      setOpenDialog(false);
      setActualizando(false);
      setClienteSeleccionado(null);
    }
  };








  const enviarCorreoCobro = (cliente, mesCapitalizado) => {
    const templateParams = {
      sitioWeb: `www.${cliente.sitioWeb}`,
      nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
      mes: mesCapitalizado,
      email: cliente.correo || "plataformas.web.cl@gmail.com", // ← destinatario real
      cc: "plataformas.web.cl@gmail.com", // copia interna
    };

    emailjs
      .send(
        "service_dgbzstm",
        "template_rapmi7b",
        templateParams,
        "bk4Szn-mnTqjPaQQ5"
      )
      .then(() => {
        console.log("📧 Correo enviado exitosamente a", templateParams.email);
      })
      .catch((error) => {
        console.error("❌ Error al enviar el correo:", error);
      });
  };

  const bloquearBotonTemporalmente = (index) => {
    setBotonesBloqueados((prev) => [...prev, index]);

    setTimeout(() => {
      setBotonesBloqueados((prev) => prev.filter((i) => i !== index));
    }, 10000); // 10 segundos
  };


  useEffect(() => {
    setPaginaActual(1);
  }, [clientes]);


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
        paddingTop: isMobile ? 14 : 11,
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
          mb: 1,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "stretch",
          gap: 2,
          mb: 2,
          width: "100%",
          px: isMobile ? 1 : 0,
        }}
      >

        <Box
          sx={{
            backgroundColor: "#e8f5e9",
            border: "2px solid #66bb6a",
            borderRadius: 2,
            px: 1.5,
            py: 1,
            flex: "1 1 auto",
            maxWidth: 160,
            minWidth: 140,
            textAlign: "center",
            height: "72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="green"
            sx={{ fontSize: "0.85rem", mt: 0.1 }}
          >
            Ganado en {mesCapitalizado}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontSize: "1rem", lineHeight: 1.2 }}
          >
            ${totalGanado.toLocaleString("es-CL")} CLP
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {clientes.filter(c => c.pagado).length} pagado
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "#fff3e0",
            border: "2px solid #ff9800",
            borderRadius: 2,
            px: 1.5,
            py: 1,
            flex: "1 1 auto",
            maxWidth: 160,
            minWidth: 140,
            textAlign: "center",
            height: "72px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="orange"
            sx={{ fontSize: "0.85rem", mt: 0.1 }}
          >
            Deuda actual
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontSize: "1rem", lineHeight: 1.2, color: "#d32f2f" }} // rojo fuerte
          >
            ${totalDeuda.toLocaleString("es-CL")} CLP
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.75rem" }}
          >
            {clientes.filter(c => !c.pagado).length} deben
          </Typography>
        </Box>
      </Box>


      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "80%", // ← centrar en desktop
          px: isMobile ? 1 : 4,
          display: "flex",
          flexDirection: "column", // ← importante para alinear la tabla y la paginación abajo
          alignItems: "center", // ← centra horizontalmente
        }}
      >

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

                <TableCell sx={{ fontWeight: "bold", minWidth: 160, py: 0.5, fontSize: "0.85rem" }}>
                  Clientes
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", width: isMobile ? 50 : 100, py: 0.5, fontSize: "0.85rem", }}>Estado</TableCell>
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
              {clientesPaginados.map((cliente, index) => {
                const estaAlDia = cliente.pagado;
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
                            const numero = cliente.telefono || "56992914526";
                            const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

                            // Abrir WhatsApp
                            window.open(url, "_blank");

                            // Enviar correo
                            enviarCorreoCobro(cliente, mesCapitalizado);

                            // Bloquear este botón por 10 segundos
                            bloquearBotonTemporalmente(index);
                          }}

                          disabled={estaAlDia || botonesBloqueados.includes(index)}

                          sx={{
                            fontSize: isMobile ? 0 : "0.8rem",
                            fontWeight: 600,
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
                            flexWrap: "nowrap",       // ⛔ evita saltos de línea
                            gap: 0,
                            px: 1.5,
                            py: 0.8,
                            borderRadius: "8px",
                            minHeight: "36px",
                            maxWidth: "100%",         // evita que se desborde
                            overflow: "hidden",       // oculta si llega a colapsar
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#2e7d32",
                              fontWeight: 600,
                              whiteSpace: "nowrap",   // ⛔ evita salto en el texto
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            ✅ {isMobile ? "Pagado" : "Pago recibido"}
                          </Typography>

                          <Button
                            size="small"
                            variant="text"
                            color="warning"
                            onClick={() => abrirDialogoConfirmacion(cliente, true)} // <-- importante
                            sx={{
                              minWidth: 0,
                              padding: 0.5,
                              ml: 0,
                              '& .MuiSvgIcon-root': { fontSize: '18px' },
                            }}
                          >
                            <span title="Revertir pago">
                              🔄
                            </span>
                          </Button>
                        </Box>

                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "36px",
                            px: 1.2,
                            py: 0.5,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => abrirDialogoConfirmacion(cliente)}


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
      {totalPaginas > 1 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(p => p - 1)}
          >
            Anterior
          </Button>
          <Typography variant="body2">
            Página {paginaActual} de {totalPaginas}
          </Typography>
          <Button
            variant="outlined"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(p => p + 1)}
          >
            Siguiente
          </Button>
        </Box>
      )}

      <MenuInferior cardSize={cardSize} modo="clientes" />
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>
          {esReversion ? "Confirmar reversión de pago" : "Confirmar pago recibido"}
        </DialogTitle>
        <DialogContent>
          {openDialog && (
            <DialogContentText>
              {esReversion ? (
                <>¿Estás seguro de que deseas <strong>revertir</strong> el pago de <strong>{clienteSeleccionado?.sitioWeb}</strong>?</>
              ) : (
                <>¿Estás seguro de que deseas <strong>marcar como pagado</strong> a <strong>{clienteSeleccionado?.sitioWeb}</strong>?</>
              )}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={() => confirmarPago(esReversion)}
            color={esReversion ? "warning" : "success"}
            variant="contained"
            autoFocus
            disabled={actualizando}
          >
            {esReversion ? "Revertir pago" : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Clientes;
