import React, { useEffect, useState, useRef } from "react";
import { IconButton, Snackbar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { cargarClientesDesdeExcel } from "../../helpers/HelperClientes";
import MenuInferior from './MenuInferior';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GroupIcon from "@mui/icons-material/Group";
import emailjs from "@emailjs/browser";
import { FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress } from "@mui/material";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import DialogClientePagos from "./DialogClientePagos";
import DialogClientesPaseMensual from "./DialogClientesPaseMensual";
import DialogAgregarCliente from "./DialogAgregarCliente";
import AddIcon from "@mui/icons-material/Add";
import * as XLSX from "xlsx";

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

// Animaciones definidas correctamente
const greenMoneyPulse = keyframes({
  "0%": { textShadow: "0 0 4px rgba(0, 200, 83, 0.4)" },
  "50%": { textShadow: "0 0 16px rgba(0, 200, 83, 1)" },
  "100%": { textShadow: "0 0 4px rgba(0, 200, 83, 0.4)" },
});

const revertFlash = keyframes({
  "0%": { textShadow: "0 0 4px rgba(255,0,0,0.4)" },
  "50%": { textShadow: "0 0 16px rgba(255,0,0,0.9)" },
  "100%": { textShadow: "0 0 4px rgba(255,0,0,0.4)" },
});

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const variantes = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, };

const Clientes = () => {
  const [iniciarAnimacionContador, setIniciarAnimacionContador] = useState(false);
  const [clientes, setClientes] = useState([]);
  const isMobile = useMediaQuery("(max-width:600px)");
  const cardSize = isMobile ? "300px" : "340px";
  const mes = new Date().toLocaleString("es-CL", { month: "long" });

  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const [botonesBloqueados, setBotonesBloqueados] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 7;
  const [actualizando, setActualizando] = useState(false);
  const indiceInicio = (paginaActual - 1) * clientesPorPagina;
  const indiceFin = indiceInicio + clientesPorPagina;
  const clientesPaginados = clientes.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [esReversion, setEsReversion] = useState(false);
  const [mostrarDialogoUltimoDia, setMostrarDialogoUltimoDia] = useState(false);
  const [tipoCambioVisual, setTipoCambioVisual] = useState(null);
  const [totalGanadoAnterior, setTotalGanadoAnterior] = useState(0);
  const [openDialogCobro, setOpenDialogCobro] = useState(false);
  const [mesManual, setMesManual] = useState("");
  const modoDesarrollo = false;
  const mesDialogPago = mesManual || mesCapitalizado;
  const [animar, setAnimar] = useState(true);
  const [animacionTerminada, setAnimacionTerminada] = useState(false);
  const [openDialogCliente, setOpenDialogCliente] = useState(false);
  const [enRevision, setEnRevision] = useState(false);
  const [openAgregarCliente, setOpenAgregarCliente] = useState(false);
  const [dialog, setDialog] = useState({ open: false, sitioWeb: "" });
  const [loadingDialogAction, setLoadingDialogAction] = useState(null);


  const datosCliente = (cliente) => { setClienteSeleccionado(cliente); setOpenDialogCliente(true); };
  const MotionBox = motion.create(Box);


  //DÍAS ATRASO
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const diffMs = hoy - primerDiaMes;
  const diasAtraso = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  //GANADO
  const totalGanado = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return c.pagado ? acc + valor : acc;
  }, 0);

  //DEUDA
  const totalDeuda = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return !c.pagado ? acc + valor : acc;
  }, 0);


  //CLIENTES
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar clientes (fuente principal)
        const data = await cargarClientesDesdeExcel();
        let clientesConEstado = data.map((c) => ({
          ...c,
          pagado: !!c.pagado,
          enRevision: false, // por defecto
        }));

        try {
          // 2. Intentar cargar PaseMensual.xlsx
          const resp = await fetch(
            `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/PaseMensual.xlsx?t=${Date.now()}`
          );
          if (resp.ok) {
            const buffer = await resp.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const hoja = workbook.Sheets[workbook.SheetNames[0]];
            const paseMensual = XLSX.utils.sheet_to_json(hoja, { defval: "" });

            // 3. Hacer el "left join"
            clientesConEstado = clientesConEstado.map((c) => {
              const filaPase = paseMensual.find(
                (row) => String(row.SitioWeb || "").trim() === String(c.sitioWeb || "").trim()
              );

              let enRevision = false;
              if (filaPase) {
                enRevision =
                  parseInt(filaPase.CompartirAnuncio) === 1 ||
                  parseInt(filaPase.PagarSuscripcionAntes) === 1 ||
                  parseInt(filaPase.ConexionMensual) === 1 ||
                  parseInt(filaPase.VisitasMensual) === 1 ||
                  parseInt(filaPase.ConseguirCliente) === 1;
              } else {
                console.warn(`⚠️ No match para cliente: ${c.sitioWeb}`);
              }

              return { ...c, enRevision };
            });
          } else {
            console.warn("⚠️ No se pudo cargar PaseMensual.xlsx, seguimos sin enRevision");
          }
        } catch (err) {
          console.warn("⚠️ Error cargando PaseMensual.xlsx:", err);
        }

        // 4. Guardar en estado
        setClientes(clientesConEstado);

      } catch (err) {
        console.error("❌ Error cargando Clientes.xlsx:", err);
      }
    };

    fetchData();
  }, []);


  const abrirDialogoConfirmacion = (cliente, revertir = false) => {
    setClienteSeleccionado(cliente);
    setEsReversion(revertir);
    setOpenDialog(true);
  };


  //PAGO RECIBIDO
  const confirmarPago = async (revertir = false) => {
    console.log("➡️ Cliente seleccionado:", clienteSeleccionado);
    if (!clienteSeleccionado || !clienteSeleccionado.idCliente) {
      setSnackbar({ open: true, message: "Debe seleccionar un cliente válido." });
      return;
    }

    const url = `${window.location.hostname === "localhost" ? "http://localhost:8888" : ""}/.netlify/functions/actualizarCliente`;
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
        setTotalGanadoAnterior(totalGanado);
        setClientes(nuevosClientes);

        setTipoCambioVisual(revertir ? "reversion" : "ganancia");
        setIniciarAnimacionContador(true);

        setTimeout(() => {
          setTipoCambioVisual(null);
          setIniciarAnimacionContador(false);
        }, 2000);

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
      setMesManual("");
      setActualizando(false);
      setClienteSeleccionado(null);
    }
  };

  const enviarCorreoPagoRecibido = async (cliente, mesFinal) => {
    try {
      const urlBase = window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : "";

      let pdfUrl = "https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/comprobantes/comprobante-pago.pdf";

      try {
        // 🔹 Intentar generar el comprobante PDF
        const generarPDFResponse = await fetch(`${urlBase}/.netlify/functions/generarComprobante`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente, mes: mesFinal }),
        });

        const raw = await generarPDFResponse.text();
        console.log("🪵 Respuesta generarComprobante:", raw);

        let resultado;
        try {
          resultado = JSON.parse(raw);
        } catch {
          throw new Error("❌ Respuesta inválida desde generarComprobante");
        }

        if (!generarPDFResponse.ok) {
          throw new Error(resultado.message || resultado.detalle || "Error al generar el comprobante");
        }

        console.log("✅ PDF generado exitosamente");

      } catch (err) {
        console.warn("⚠️ No se pudo generar el comprobante, se enviará correo sin adjunto:", err.message);
      }

      // 🔹 Parámetros del correo
      const templateParams = {
        sitioWeb: `www.${cliente.sitioWeb}`,
        nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
        mes: mesFinal,
        fechaPago: new Date().toLocaleDateString("es-CL"),
        montoPagado: cliente.valor || "$10.000 CLP",
        metodoPago: "Transferencia",
        logoCliente: cliente.logoCliente || "/logo-plataformas-web-correo.png",
        email: modoDesarrollo ? "plataformas.web.cl@gmail.com" : (cliente.correo || "plataformas.web.cl@gmail.com"),
        cc: "plataformas.web.cl@gmail.com",
        pdfUrl, // sigue teniendo valor
      };


      // 🔹 Enviar correo
      const resultadoCorreo = await emailjs.send(
        "service_ocjgtpc",
        "template_ligrzq3",
        templateParams,
        "byR6suwAx2-x6ddVp"
      );

      console.log("✅ Correo enviado:", resultadoCorreo);
      return resultadoCorreo;

    } catch (err) {
      console.error("❌ Error en enviarCorreoPagoRecibido:", err);
      throw err;
    }
  };


  //ÚLTIMO DÍA DEL MES
  useEffect(() => {

    const hoy = modoDesarrollo ? new Date(2025, 6, 31) : new Date(); // julio es mes 6 (cero indexado)

    const ultimoDiaDelMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    const esUltimoDia = hoy.getDate() === ultimoDiaDelMes;

    if (esUltimoDia) {
      setMostrarDialogoUltimoDia(true);
    }
  }, []);


  //COBRO
  const enviarCorreoCobro = (cliente, mesCapitalizado) => {
    const year = new Date().getFullYear();

    const templateParams = {
      sitioWeb: `www.${cliente.sitioWeb}`,
      nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
      mes: `${mesCapitalizado} ${year}`,   // 👈 ahora mes + año
      email: modoDesarrollo
        ? "plataformas.web.cl@gmail.com"
        : (cliente.correo || "plataformas.web.cl@gmail.com"),
      monto: cliente.valor
        ? `$${cliente.valor.replace(/\$/g, "").trim()} CLP`
        : "$10.000 CLP",
      cc: "plataformas.web.cl@gmail.com", // copia interna
    };

    emailjs
      .send(
        "service_ocjgtpc",
        "template_eoaqvlw",
        templateParams,
        "byR6suwAx2-x6ddVp"
      )
      .then(() => {
        console.log("📧 Correo enviado exitosamente a", templateParams.email);
      })
      .catch((error) => {
        console.error("❌ Error al enviar el correo:", error);
      });
  };

  // SUSPENSIÓN
  const enviarCorreoSuspension = (cliente) => {

    const diasAtrasoDesc = `${diasAtraso} día${diasAtraso === 1 ? "" : "s"}.`;

    const templateParams = {
      sitioWeb: `www.${cliente.sitioWeb}`,
      nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
      diasAtraso: diasAtrasoDesc,
      email: modoDesarrollo
        ? "plataformas.web.cl@gmail.com"
        : cliente.correo || "plataformas.web.cl@gmail.com",
      cc: "plataformas.web.cl@gmail.com",
    };

    emailjs
      .send(
        "service_kz3yaug",
        "template_rrv14p8",
        templateParams,
        "lwCAuhptLOofypnhx"
      )
      .then(() => {
        console.log("📧 Correo de suspensión enviado a", templateParams.email);
      })
      .catch((error) => {
        console.error("❌ Error al enviar correo de suspensión:", error);
      });
  };


  const bloquearBotonTemporalmente = (index) => {
    setBotonesBloqueados((prev) => [...prev, index]);

    setTimeout(() => {
      setBotonesBloqueados((prev) => prev.filter((i) => i !== index));
    }, 10000); // ← 10 segundos
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [clientes]);


  useEffect(() => {
    const timer = setTimeout(() => setAnimar(true), 100);
    return () => clearTimeout(timer);
  }, []);



  //TOTAL GANADO
  const ContadorGanado = ({ valorFinal, valorInicial, tipoCambio }) => {
    const motionValor = useMotionValue(valorInicial);
    const [display, setDisplay] = useState(`$${valorFinal.toLocaleString("es-CL")} CLP`);
    const [mostrarEfecto, setMostrarEfecto] = useState(false);

    useEffect(() => {
      if (!tipoCambio) return;

      motionValor.set(valorInicial);

      const controls = animate(motionValor, valorFinal, {
        duration: 1.2,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplay(`$${Math.round(latest).toLocaleString("es-CL")} CLP`);
        },
        onComplete: () => {
          setMostrarEfecto(true);

          // Después de 2s, apaga el zoom y el efecto
          setTimeout(() => {
            setMostrarEfecto(false);
          }, 2000);
        },
      });

      return () => controls.stop();
    }, [valorFinal, valorInicial, tipoCambio]);

    const esGanancia = tipoCambio === "ganancia";
    const esReversion = tipoCambio === "reversion";

    return (
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{
          fontSize: "1.1rem",
          lineHeight: 1.2,
          color: mostrarEfecto
            ? esGanancia
              ? "transparent"
              : esReversion
                ? "#d32f2f"
                : "#212121"
            : "#212121",
          background:
            mostrarEfecto && esGanancia
              ? "linear-gradient(90deg, #69f0ae, #00e676, #00c853)"
              : "none",
          WebkitBackgroundClip: mostrarEfecto && esGanancia ? "text" : "unset",
          WebkitTextFillColor: mostrarEfecto && esGanancia ? "transparent" : "unset",
          animation: mostrarEfecto
            ? esGanancia
              ? `${greenMoneyPulse} 1.2s ease-in-out`
              : esReversion
                ? `${revertFlash} 1s ease-in-out`
                : "none"
            : "none",
        }}
      >
        {display}
      </Typography>
    );
  };

  // Para diálogo de cobro
  useEffect(() => {
    if (openDialogCobro) {
      setMesManual(mesCapitalizado);
    }
  }, [openDialogCobro, mesCapitalizado]);

  // Para diálogo de pago
  useEffect(() => {
    if (openDialog && !esReversion) {
      setMesManual(mesCapitalizado);
    }
  }, [openDialog, esReversion, mesCapitalizado]);

  //DIALOG AGREGAR CLIENTE
  const agregarCliente = () => {
    setOpenAgregarCliente(true);
  };

  //DIALOG CERRAR
  const handleCloseAgregarCliente = () => {
    setOpenAgregarCliente(false);
  };

  //DIALOG DESPUES DE GUARDAR
  const handleSaveCliente = async () => {
    try {
      // 🔁 Releer desde Excel para obtener el cliente recién agregado
      const data = await cargarClientesDesdeExcel();
      let clientesConEstado = data.map((c) => ({
        ...c,
        pagado: !!c.pagado,
        enRevision: false,
      }));
      setClientes(clientesConEstado);
      setSnackbar({
        open: true,
        type: "success",
        message: `Cliente agregado correctamente`,
      });
    } catch (error) {
      console.error("❌ Error al recargar clientes:", error);
      setSnackbar({
        open: true,
        type: "error",
        message: "Error al actualizar la grilla",
      });
    }
  };



  //ELIMINAR CLIENTE
  const abrirDialog = (sitioWeb) => {
    setDialog({ open: true, sitioWeb });
  };

  const cerrarDialog = () => {
    setDialog({ open: false, sitioWeb: "" });
    setLoadingDialogAction(null);
  };

  const handleEliminar = async () => {
    setLoadingDialogAction("eliminar");

    try {
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/eliminarCliente`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitioWeb: dialog.sitioWeb }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar");

      // ✅ Actualiza la lista en pantalla
      setClientes((prev) => prev.filter((c) => c.sitioWeb !== dialog.sitioWeb));
      setSnackbar({
        open: true,
        type: "success",
        message: `Cliente "${dialog.sitioWeb}" eliminado correctamente`,
      });
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
      setSnackbar({
        open: true,
        type: "error",
        message: "Hubo un problema al eliminar el cliente",
      });
    } finally {
      setLoadingDialogAction(null);
      cerrarDialog();
    }
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
        paddingTop: isMobile ? 14 : 15,
      }}
    >

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center", // 👈 asegura que se centre en el medio
          alignItems: "stretch",
          gap: 1.5,
          mb: 2,
          width: "100%",
          px: isMobile ? 1 : 0,
        }}
      >
        {/* Cuadro Ganado */}
        <MotionBox
          variants={variantes}
          initial={animacionTerminada ? false : "hidden"}
          animate="visible"
          transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={() => setAnimacionTerminada(true)}
          sx={{
            backgroundColor: "#e8f5e9",
            border: "2px solid #66bb6a",
            borderRadius: 2,
            px: 1.1,
            py: 0.5,
            flex: "1 1 auto",
            maxWidth: 140,
            minWidth: 130,
            textAlign: "center",
            height: "64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="green"
            sx={{ fontSize: "0.69rem", mt: 0.1 }}
          >
            Ganado {mesCapitalizado}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
              minHeight: "1rem",
            }}
          >
            <ContadorGanado
              valorFinal={totalGanado}
              valorInicial={totalGanadoAnterior}
              tipoCambio={tipoCambioVisual}
            />
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem" }}
          >
            {clientes.filter(c => c.pagado).length} pagado
          </Typography>
        </MotionBox>

        {/* Cuadro Deuda */}
        <MotionBox
          variants={variantes}
          initial={animacionTerminada ? false : "hidden"}
          animate="visible"
          transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={() => setAnimacionTerminada(true)}
          sx={{
            backgroundColor: "#fff3e0",
            border: "2px solid #ff9800",
            borderRadius: 2,
            px: 1.1,
            py: 0.5,
            flex: "1 1 auto",
            maxWidth: 140,
            minWidth: 120,
            textAlign: "center",
            height: "64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color="orange"
            sx={{ fontSize: "0.71rem", mt: 0.1 }}
          >
            Deuda actual
          </Typography>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              fontSize: "1rem",
              lineHeight: 1.1,
              color: "#d32f2f",
            }}
          >
            ${totalDeuda.toLocaleString("es-CL")} CLP
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem" }}
          >
            {clientes.filter(c => !c.pagado).length} deben
          </Typography>
        </MotionBox>
      </Box>


      <Box
        sx={{
          width: "100%",
          maxWidth: isMobile ? "100%" : "80%",
          px: isMobile ? 1 : 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 🔹 Contenedor del título + botón */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row" // ✅ invierte el orden visual
          pb={2}
          sx={{ width: isMobile ? "100%" : "70%", }}
        >
          {/* 🔸 Título a la derecha */}
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1 }}>
            <GroupIcon
              sx={{
                color: "white",
                fontSize: { xs: 22, sm: 28 },
                mt: "-2px",
                mr: { xs: "-2px", sm: 0 },
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "1.15rem" },
                whiteSpace: "nowrap",
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
            </Typography>
          </Box>

          {/* 🔸 Botón a la izquierda */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => agregarCliente()}
              variant="outlined"
              color="inherit"
              startIcon={<AddIcon sx={{ mr: -0.5 }} />} // 👈 reduce el espacio entre ícono y texto
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                px: { xs: 1, sm: 1.5 },
                py: { xs: 0.25, sm: 0.5 },
                minWidth: "auto",
                "& .MuiButton-startIcon": {
                  marginRight: "2px", // 👈 aún más fino que el default (8px)
                  marginLeft: "-2px",
                },
                "&:hover": {
                  backgroundColor: "#ffffff22",
                  borderColor: "#ffffffcc",
                },
              }}
            >
              Agregar Cliente
            </Button>
          </motion.div>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            width: isMobile ? "100%" : "70%",
            maxHeight: "80vh",
            borderRadius: "12px",
            overflowX: isMobile ? "auto" : "hidden", // 👈 scroll horizontal solo en mobile
            overflowY: "auto",
            boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            backgroundColor: "#fdfdfd",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: isMobile ? 400 : "auto",
              "& .MuiTableCell-root": {
                fontFamily: "Poppins, sans-serif",
                borderColor: "rgba(0,0,0,0.1)", // 👈 bordes suaves
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#ffffff",   // 👈 fondo blanco fijo
                    fontWeight: "bold",
                    color: "#1b263b",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.85rem",
                    minWidth: 160,
                    py: 0.5,
                  }}
                >
                  Clientes
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#ffffff",
                    fontWeight: "bold",
                    color: "#1b263b",
                    width: isMobile ? 50 : 100,
                    py: 0.5,
                    fontSize: "0.85rem",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#ffffff",
                    width: isMobile ? 60 : 140,
                    px: isMobile ? 0.5 : 1,
                  }}
                />
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#ffffff",
                    width: isMobile ? 80 : 170,
                    px: isMobile ? 0.5 : 1,
                    pr: isMobile ? 1.5 : 0,
                  }}
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
                      backgroundColor: estaAlDia ? "rgba(200, 255, 200, 0.12)" : "transparent",
                      transition: "background-color 0.3s ease-in-out",

                      // 👇 aplica padding distinto en mobile
                      "& td, & th": {
                        py: { xs: 0, sm: 0 }, // menos alto en mobile
                        px: { xs: 1, sm: 2 },   // opcional: menos ancho en mobile
                        fontSize: { xs: "0.75rem", sm: "0.875rem" }, // 👈 texto más chico en mobile
                      },
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5, // 👈 mucho más compacto
                        }}
                      >
                        {/* Link del sitio */}
                        <Typography
                          sx={{
                            color: "#1a0dab",
                            textDecoration: "underline",
                            fontWeight: 500,
                            fontSize: isMobile ? "0.75rem" : "1rem",
                            cursor: "pointer",
                            "&:hover": { color: "#0b0080" },
                          }}
                          onClick={() =>
                            cliente.sitioWeb
                              ? window.open(`https://${cliente.sitioWeb}`, "_blank")
                              : null
                          }
                        >
                          {cliente.sitioWeb || "Sin sitio"}
                        </Typography>

                        {/* Botón circular pincel al lado */}
                        <Tooltip title="Acciones Cliente" arrow>
                          <IconButton
                            onClick={() => datosCliente(cliente)}
                            size="small"
                            sx={{
                              background: cliente.enRevision
                                ? "linear-gradient(135deg, #e74c3c, #c0392b)" // rojo
                                : "linear-gradient(135deg, #2ecc71, #27ae60)", // verde
                              width: 22,
                              height: 22,
                              p: 0.3,
                              borderRadius: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                              color: "#fff",
                              "&:hover": {
                                background: cliente.enRevision
                                  ? "linear-gradient(135deg, #ec7063, #e74c3c)"
                                  : "linear-gradient(135deg, #58d68d, #2ecc71)",
                                transform: "scale(1.1)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          >
                            <ConfirmationNumberRoundedIcon fontSize="inherit" sx={{ fontSize: 14 }} />

                          </IconButton>
                        </Tooltip>
                        {/* 🗑️ Botón eliminar cliente */}
                        <Tooltip title="Eliminar Cliente" arrow>
                          <IconButton
                            onClick={() => abrirDialog(cliente.sitioWeb)} // 👈 abre el diálogo
                            size="small"
                            sx={{
                              background: "linear-gradient(135deg, #f44336, #d32f2f)",
                              width: 22,
                              height: 22,
                              p: 0.3,
                              borderRadius: "8px",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                              color: "#fff",
                              ml: 0.5,
                              "&:hover": {
                                background: "linear-gradient(135deg, #ef5350, #e53935)",
                                transform: "scale(1.1)",
                                transition: "all 0.2s ease",
                              },
                            }}
                          >
                            <DeleteForeverRoundedIcon fontSize="inherit" sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>



                      </Box>

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

                    {/* Botón COBRAR */}
                    <TableCell align="center" sx={{ pl: 0.5, width: isMobile ? 60 : undefined }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "50px",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setOpenDialogCobro(true);
                          }}
                          disabled={estaAlDia || botonesBloqueados.includes(index)}
                          sx={{
                            minWidth: isMobile ? "auto" : undefined,
                            px: isMobile ? 1.3 : 2.2,
                            py: isMobile ? 0.5 : 0.8,
                            fontSize: isMobile ? 0 : "0.8rem", // texto oculto en mobile
                            fontWeight: 600,
                            '& .emoji': {
                              fontSize: '1rem', // 👈 tamaño visible solo del ícono
                            },
                            '&.Mui-disabled': {
                              cursor: 'not-allowed !important',
                              pointerEvents: 'auto',
                              opacity: 0.6,
                            },
                          }}
                        >
                          {isMobile ? <span className="emoji">💰</span> : "Cobrar"}
                        </Button>


                      </Box>
                    </TableCell>

                    {/* Botón PAGO RECIBIDO o Pagado */}
                    <TableCell align="center" sx={{ pl: 0.5, width: isMobile ? 80 : undefined }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "50px",
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {estaAlDia ? (
                            <motion.div
                              key="pagado"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                              {isMobile ? (
                                <>
                                  <DoneAllIcon fontSize="small" htmlColor="#2e7d32" />
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    onClick={() => abrirDialogoConfirmacion(cliente, true)}
                                    sx={{
                                      minWidth: 0,
                                      padding: 0,
                                      ml: 0,
                                    }}
                                  >
                                    🔄
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#2e7d32",
                                      fontWeight: 600,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ✅Pago recibido
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    onClick={() => abrirDialogoConfirmacion(cliente, true)}
                                    sx={{
                                      minWidth: 0,
                                      padding: 0,
                                      ml: 0,
                                    }}
                                  >
                                    🔄
                                  </Button>
                                </>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="pagoRecibido"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => abrirDialogoConfirmacion(cliente)}
                                sx={{
                                  minWidth: isMobile ? "auto" : undefined,
                                  px: isMobile ? 1.2 : 2.2,
                                  py: isMobile ? 0.5 : 0.8,
                                  fontSize: isMobile ? 0 : "0.8rem",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  '& .emoji': {
                                    fontSize: '1rem',
                                  },
                                }}
                              >
                                {isMobile ? <span className="emoji">💸</span> : "Pago recibido"}
                              </Button>

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Box>
                    </TableCell>


                  </TableRow>
                );
              })}

            </TableBody>
          </Table>
        </TableContainer>


        {totalPaginas > 1 && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: isMobile ? "100%" : "70%",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "#E95420",
                  backgroundColor: "#E95420",
                },
              }}
            >
              Anterior
            </Button>
            <Typography variant="body2" sx={{ color: "white" }}>
              Página {paginaActual} de {totalPaginas}
            </Typography>
            <Button
              variant="outlined"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "#E95420",
                  backgroundColor: "#E95420",
                },
              }}
            >
              Siguiente
            </Button>
          </Box>
        )}


      </Box>



      <MenuInferior cardSize={cardSize} modo="clientes" />

      {/* DIALOG: REVERTIR && PAGOS */}
      <DialogClientePagos
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setMesManual("");
        }}
        esReversion={esReversion}
        clienteSeleccionado={clienteSeleccionado}
        mesDialogPago={mesDialogPago}
        meses={meses}
        mesManual={mesManual}
        setMesManual={setMesManual}
        confirmarPago={confirmarPago}
        enviarCorreoPagoRecibido={enviarCorreoPagoRecibido}
        mesCapitalizado={mesCapitalizado}
      />

      {/* DIALOG: COBROS */}
      <Dialog
        open={openDialogCobro}
        onClose={() => setOpenDialogCobro(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(180deg, #FFF8EC, #FFEFD5)",
            borderRadius: 2,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            color: "#FFF",
            fontFamily: "'Poppins', sans-serif",
            py: 2.5,
            borderBottom: "1px solid rgba(255,167,38,.35)",
            position: "relative",
            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/dialog-cobrar.webp')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "140%",
              zIndex: 0,
              animation: "zoomInDesktop 1s ease-out forwards",

              "@media (max-width:600px)": {
                backgroundSize: "220%",
                animation: "zoomInMobile 1s ease-out forwards",
              },

              "@keyframes zoomInDesktop": {
                "0%": { backgroundSize: "160%" },
                "100%": { backgroundSize: "140%" },
              },
              "@keyframes zoomInMobile": {
                "0%": { backgroundSize: "250%" },
                "100%": { backgroundSize: "200%" },
              },
            },

            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.45)", // oscurece para legibilidad
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
            onClick={() => setOpenDialogCobro(false)}
            sx={{
              position: "absolute",
              top: 2,
              right: 1,
              color: "#FFF",
              zIndex: 6,
              "&:hover": { backgroundColor: "rgba(255,255,255,.15)" },
              animation: openDialogCobro ? "spinTwice 0.6s ease-in-out" : "none", // 👈 depende del estado del dialog
              animationFillMode: "forwards",
              "@keyframes spinTwice": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(720deg)" },
              },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 26 }} />
          </IconButton>


          {/* Título dinámico */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.6, sm: 1 }, // 👈 menos separación
              px: { xs: 1, sm: 1.5 },  // 👈 padding horizontal reducido
              py: { xs: 0.3, sm: 0.6 }, // 👈 padding vertical reducido
              borderRadius: "999px",
              bgcolor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 3px 10px rgba(0,0,0,.3)", // 👈 sombra más sutil
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700, // 👈 un poco menos bold
                letterSpacing: { xs: "0.2px", sm: "0.8px" },
                fontFamily: "'Poppins', sans-serif",
                color: "#fff",
                fontSize: { xs: "0.83rem", sm: "1.1rem" }, // 👈 texto más chico
              }}
            >
              Cobro del mes de {mesManual || mesCapitalizado} {new Date().getFullYear()}
            </Typography>
          </Box>
        </DialogTitle>


        <DialogContent sx={{ pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)" }}>

          <DialogContentText sx={{ pt: 3 }}>
            Notificaremos al cliente <strong>{clienteSeleccionado?.cliente}</strong> por el sitio{" "}
            <strong>{clienteSeleccionado?.sitioWeb}</strong>.
          </DialogContentText>
          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel sx={{ color: "#1b263b" }}>Mes de cobro</InputLabel>
            <Select
              label="Mes de cobro"
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
                    "& .MuiList-root": {
                      paddingTop: 0, // 👈 elimina el padding superior
                    },
                    "&::before": {
                      display: "none", // 👈 elimina la línea superior fantasma
                    },
                    "&::after": {
                      display: "none", // por si hay sombra inferior también
                    },
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
                    "&.Mui-selected:hover": {
                      backgroundColor: "#FFCC80",
                    },
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  {mes}
                </MenuItem>
              ))}
            </Select>
          </FormControl>



        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
            px: 2,
            pb: 2,
            gap: 0,
            background: "linear-gradient(90deg, #FFF3E0, #FFE0B2)", // footer en contraste
            borderTop: "1px solid rgba(255,167,38,.35)",
          }}
        >
          <Button
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.6rem" : "0.875rem" }}
            onClick={() => setOpenDialogCobro(false)}
          >
            Cancelar
          </Button>

          <Button
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
            onClick={() => {
              enviarCorreoSuspension(clienteSeleccionado);

              const mensaje = `🔴 Estimado ${clienteSeleccionado.cliente}, su Suscripción (${clienteSeleccionado.sitioWeb}) tiene ${diasAtraso} día${diasAtraso === 1 ? "" : "s"} de atraso. Se debe regularizar o será suspendido en 24 hrs.`;
              const numero = clienteSeleccionado.telefono || "56946873014";
              const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
              window.open(url, "_blank");

              setOpenDialogCobro(false);
            }}
            color="warning"
            variant="contained"
          >
            🚫 Suspensión
          </Button>

          <Button
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
            onClick={() => {
              const mesFinal = mesManual || mesCapitalizado;
              const mesFinalCapitalizado =
                mesFinal.charAt(0).toUpperCase() + mesFinal.slice(1);

              const mensaje = `Buenas! recordar el pago del HOSTING de ${clienteSeleccionado.sitioWeb} de *${clienteSeleccionado.valor}* del mes de ${mesFinalCapitalizado}.`;
              const numero = clienteSeleccionado.telefono || "56946873014";
              const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
              window.open(url, "_blank");

              enviarCorreoCobro(clienteSeleccionado, mesFinalCapitalizado);

              if (clienteSeleccionado.index !== undefined) {
                bloquearBotonTemporalmente(clienteSeleccionado.index);
              }

              setOpenDialogCobro(false);
            }}
            color="error"
            variant="contained"
          >
            💰 Cobrar
          </Button>
        </DialogActions>

      </Dialog>




      {/* 🔔 Dialogo último día del mes */}
      <Dialog
        open={mostrarDialogoUltimoDia}
        onClose={() => setMostrarDialogoUltimoDia(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(180deg, #FFF8EC, #FFEFD5)",
            borderRadius: 2,
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          },
        }}
      >
        <DialogTitle>🔄 Actualización de clientes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Hoy es el <strong>último día del mes</strong>. Se actualizará el listado de clientes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMostrarDialogoUltimoDia(false)}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              setMostrarDialogoUltimoDia(false);
              setActualizando(true);

              try {
                const url = `${window.location.hostname === "localhost"
                  ? "http://localhost:8888"
                  : ""
                  }/.netlify/functions/reiniciarPagos`;

                const res = await fetch(url, { method: "POST" });
                const text = await res.text();
                const result = JSON.parse(text || "{}");

                if (res.ok) {
                  const nuevosClientes = await cargarClientesDesdeExcel();
                  setClientes(nuevosClientes);
                  setSnackbar({
                    open: true,
                    message: result.message || "Listado reiniciado correctamente",
                  });
                } else {
                  setSnackbar({
                    open: true,
                    message: result.message || "No se pudo reiniciar el listado",
                  });
                }
              } catch (error) {
                console.error("❌ Error al reiniciar pagos:", error);
                setSnackbar({ open: true, message: "Error al reiniciar pagos." });
              } finally {
                setActualizando(false);
              }
            }}
            variant="contained"
            color="primary"
            autoFocus
            disabled={actualizando}
          >
            Confirmar
          </Button>

        </DialogActions>
      </Dialog>

      {/* PASE MENSUAL CLIENTE */}
      <DialogClientesPaseMensual
        open={openDialogCliente}
        onClose={() => setOpenDialogCliente(false)}
        cliente={clienteSeleccionado}
      />

      {/* DIALOG Agregar Cliente */}
      <DialogAgregarCliente
        open={openAgregarCliente}
        onClose={handleCloseAgregarCliente}
        onSave={handleSaveCliente}
      />

      {/* DIALOG CONFIRMAR ELIMINACIÓN */}
      <Dialog open={dialog.open} onClose={cerrarDialog}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#B71C1C",
            background: "linear-gradient(180deg, #FFF8E1, #FFE0B2)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: "#E65100" }} />
          Confirmar eliminación
        </DialogTitle>

        <DialogContent
          sx={{
            background: "linear-gradient(180deg, #FFF8E1, #FFF3E0)",
          }}
        >
          <Typography sx={{ fontWeight: 500, color: "#5D4037" }}>
            ¿Deseas eliminar el cliente con sitio web{" "}
            <b style={{ color: "#D84315" }}>{dialog.sitioWeb}</b>?
            <br />
            <span style={{ fontSize: "0.85rem", color: "#795548" }}>
              Esta acción no se puede deshacer.
            </span>
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            background: "linear-gradient(180deg, #FFF8E1, #FFF3E0)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            py: 1.2,
          }}
        >
          <Button
            onClick={cerrarDialog}
            color="inherit"
            disabled={loadingDialogAction !== null}
            sx={{
              fontWeight: 600,
              color: "#5D4037",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
            }}
          >
            Cerrar
          </Button>

          <Button
            onClick={handleEliminar}
            color="error"
            variant="contained"
            disabled={loadingDialogAction !== null}
            startIcon={
              loadingDialogAction === "eliminar" ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <DeleteForeverRoundedIcon />
              )
            }
            sx={{
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              boxShadow: "0 2px 6px rgba(244,67,54,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #ef5350, #e53935)",
              },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box >
  );
};

export default Clientes;
