import React, { useEffect, useState, useRef } from "react";
import { IconButton, Snackbar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Typography, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import { cargarClientesDesdeExcel } from "../../helpers/HelperClientes";
import { useOutletContext } from "react-router-dom";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import GroupIcon from "@mui/icons-material/Group";
import emailjs from "@emailjs/browser";
import { FormControl, InputLabel, Select, MenuItem, Tooltip, CircularProgress } from "@mui/material";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DialogClientePagos from "./DialogClientePagos";
import DialogClientesPaseMensual from "./DialogClientesPaseMensual";
import DialogAgregarCliente from "./DialogAgregarCliente";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { supabase } from "../../supabase/client";

const baseDelay = 1.5; // segundos antes de comenzar la animaciÃ³n
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

const totalChars = "Gestión Clientes".length;
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

const shineCard = keyframes({
  "0%":   { left: "-75%" },
  "55%":  { left: "130%" },
  "100%": { left: "130%" },
});

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
  const clientesPorPagina = 9;
  const [actualizando, setActualizando] = useState(false);
  const indiceInicio = (paginaActual - 1) * clientesPorPagina;
  const indiceFin = indiceInicio + clientesPorPagina;
  const clientesPaginados = clientes.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [mostrarMenuInferior, setMostrarMenuInferior] = useState(false);
  const menuInferiorTimeoutRef = useRef(null);
  const touchStartYRef = useRef(null);
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
  const [clienteAEditar, setClienteAEditar] = useState(null);
  const [dialog, setDialog] = useState({ open: false, sitioWeb: "" });
  const [loadingDialogAction, setLoadingDialogAction] = useState(null);
  const [cobrando, setCobrando] = useState(false);
  const [botonesDeshabilitados, setBotonesDeshabilitados] = useState(false);
  const [mostrarTextoAgregar, setMostrarTextoAgregar] = useState(true);
  const { temaOscuro, forzarPrd, setNavbarAccion } = useOutletContext();

  const datosCliente = (cliente) => { setClienteSeleccionado(cliente); setOpenDialogCliente(true); };
  const MotionBox = motion.create(Box);

  // 💵 COBROS - $9.990 o $300 CLP
  const dominio = (clienteSeleccionado?.sitioWeb || "")
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

  const sitiosPrueba = ["plataformas-web.cl", "ivelpink.cl"];
  const esSitioPrueba = sitiosPrueba.some((s) => dominio.includes(s));

  const montoCobro = esSitioPrueba ? 300 : 9990;

  //DÍAS ATRASO
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const diffMs = hoy - primerDiaMes;
  const diasAtraso = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // Suscriptores siempre cuentan como pagados
  const esPagado = (c) => c.pagado || !!c.suscripcion;

  const PAGINAS_PROPIAS = ["ivelpink.cl", "plataformas-web.cl", "plataformas-web.com"];
  const esPaginaPropia = (c) => PAGINAS_PROPIAS.includes((c.sitioWeb || c.URL || "").toLowerCase().trim());

  const CLIENTES_AL_FINAL_POR_COBRAR = ["investigadores-privados.cl", "masatracker.cl"];

  const ordenarClientes = (lista) =>
    [...lista].sort((a, b) => {
      const propiaA = esPaginaPropia(a) ? 1 : 0;
      const propiaB = esPaginaPropia(b) ? 1 : 0;
      if (propiaA !== propiaB) return propiaA - propiaB;

      const suscA = !!a.suscripcion ? 1 : 0;
      const suscB = !!b.suscripcion ? 1 : 0;
      if (suscA !== suscB) return suscA - suscB;

      const pagadoA = a.pagado ? 0 : 1;
      const pagadoB = b.pagado ? 0 : 1;
      if (pagadoA !== pagadoB) return pagadoA - pagadoB;

      // Dentro de los por cobrar: estos van al final
      if (!a.pagado && !a.suscripcion && !b.pagado && !b.suscripcion) {
        const finA = CLIENTES_AL_FINAL_POR_COBRAR.includes(a.SitioWeb) ? 1 : 0;
        const finB = CLIENTES_AL_FINAL_POR_COBRAR.includes(b.SitioWeb) ? 1 : 0;
        return finA - finB;
      }

      return 0;
    });

  //GANADO
  const totalGanado = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return esPagado(c) ? acc + valor : acc;
  }, 0);

  //DEUDA
  const totalDeuda = clientes.reduce((acc, c) => {
    const valorLimpio = c.valor?.replace(/[$.\s\r\n]/g, "") || "0";
    const valor = parseInt(valorLimpio, 10) || 0;
    return !esPagado(c) ? acc + valor : acc;
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
          // 2. Cargar pase_mensual desde Supabase
          const { data: paseMensual, error: pmError } = await supabase
            .from('pase_mensual')
            .select('sitio_web, compartir_anuncio, pagar_suscripcion_antes, conexion_mensual, visitas_mensual, conseguir_cliente');

          if (!pmError && paseMensual) {
            // 3. Hacer el "left join"
            clientesConEstado = clientesConEstado.map((c) => {
              const filaPase = paseMensual.find(
                (row) => String(row.sitio_web || "").trim() === String(c.sitioWeb || "").trim()
              );

              const enRevision = filaPase
                ? filaPase.compartir_anuncio === true ||
                  filaPase.pagar_suscripcion_antes === true ||
                  filaPase.conexion_mensual === true ||
                  filaPase.visitas_mensual === true ||
                  filaPase.conseguir_cliente === true
                : false;

              return { ...c, enRevision };
            });
          }
        } catch (err) {
          console.warn("⚠️ Error cargando pase_mensual:", err);
        }

        // 4. Guardar en estado
        setClientes(ordenarClientes(clientesConEstado));

      } catch (err) {
        console.error("❌ Error cargando Clientes.xlsx:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (menuInferiorTimeoutRef.current) clearTimeout(menuInferiorTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarTextoAgregar(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAbrirMenuInferior = () => {
    if (mostrarMenuInferior) {
      setMostrarMenuInferior(false);
      if (menuInferiorTimeoutRef.current) clearTimeout(menuInferiorTimeoutRef.current);
      return;
    }
    setMostrarMenuInferior(true);
    if (menuInferiorTimeoutRef.current) clearTimeout(menuInferiorTimeoutRef.current);
    menuInferiorTimeoutRef.current = setTimeout(() => {
      setMostrarMenuInferior(false);
    }, 4000);
  };

  const handleTouchStart = (e) => {
    touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e) => {
    if (touchStartYRef.current == null) return;
    const endY = e.changedTouches?.[0]?.clientY ?? touchStartYRef.current;
    const delta = touchStartYRef.current - endY;
    touchStartYRef.current = null;
    if (delta > 30) {
      handleAbrirMenuInferior();
    }
  };


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
        setClientes(ordenarClientes(nuevosClientes));

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

  const enviarCorreoPagoRecibido = async (cliente, mesFinal, overrides = {}) => {
    const {
      metodoPago = "Transferencia",
      montoPagado = cliente.valor || "$10.000 CLP",
    } = overrides;

    try {
      const templateParams = {
        sitioWeb: `www.${cliente.sitioWeb}`,
        nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
        mes: mesFinal,
        fechaPago: new Date().toLocaleDateString("es-CL"),
        montoPagado,
        metodoPago,
        logoCliente: cliente.logoCliente || "/logo-plataformas-web-correo.png",
        email: modoDesarrollo
          ? "plataformas.web.cl@gmail.com"
          : (cliente.correo || "plataformas.web.cl@gmail.com"),
        cc: "plataformas.web.cl@gmail.com",
      };

      const resultadoCorreo = await emailjs.send(
        "service_ocjgtpc",
        "template_ligrzq3",
        templateParams,
        "byR6suwAx2-x6ddVp"
      );

      console.log("✅ Correo enviado (pago realizado):", resultadoCorreo);
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


  // COBRO
  const enviarCorreoCobro = async (cliente, mesCapitalizado) => {
    const year = new Date().getFullYear();

    // 🧠 Normaliza estado suscripción
    const suscrito =
      cliente.suscripcion === true ||
      cliente.suscripcion === 1 ||
      cliente.suscripcion === "1" ||
      cliente.suscripcion === "true" ||
      cliente.suscripcion === "TRUE";

    const tbkUser = (cliente.tbk_user || "").trim();
    const username = (cliente.correo || "").trim();

    // 💳 Ejecutar cobro automático si corresponde
    if (suscrito && tbkUser) {
      try {
        const baseUrl =
          window.location.hostname === "localhost" ? "http://localhost:8888" : "";
        const endpoint = `${baseUrl}/.netlify/functions/autorizarTransaccion`;

        const buyOrder = `ORD-${Date.now()}`;

        // 💵 Lógica dinámica según dominio
        const dominio = (cliente.sitioWeb || "").toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "");

        // si es alguno de los sitios "exentos" => cobra 300 CLP
        const sitiosPrueba = ["plataformas-web.cl", "ivelpink.cl"];
        const esSitioPrueba = sitiosPrueba.some((s) => dominio.includes(s));

        const amount = esSitioPrueba
          ? 300
          : cliente.valor
            ? Number(String(cliente.valor).replace(/[^\d]/g, "")) || 9990
            : 9990;

        console.log("💳 Iniciando cobro automático OneClick Mall...", {
          tbk_user: tbkUser,
          username,
          buy_order: buyOrder,
          amount,
        });

        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tbk_user: tbkUser,
            username,
            buy_order: buyOrder,
            amount,
            child_commerce_code: "597053022840",
            entorno_tbk: cliente.entorno_tbk || "PRODUCCION"
          }),
        });


        if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${resp.statusText}`);

        const data = await resp.json();

        const detalle = data?.data?.details?.[0] || data?.details?.[0];
        if (detalle && detalle.response_code === 0) {

          // 🟢 Marcar en Excel como pagado
          await actualizarClientePagado(cliente.idCliente);

          // 🧾 Enviar comprobante (pago realizado)
          const montoCLP = amount;
          await enviarCorreoPagoRecibido(cliente, mesCapitalizado, {
            metodoPago: "OneClick Webpay",
            montoPagado: `$${montoCLP} CLP`,
          });

          setSnackbar({
            open: true,
            message: `Cobro automático aprobado para ${cliente.sitioWeb}`,
            severity: "success",
            type: "success-cobro",
          });
        } else {
          console.warn("❌ Cobro rechazado o error en Transbank:", detalle);
          setSnackbar({
            open: true,
            message: `❌ Cobro rechazado para ${cliente.sitioWeb}`,
            severity: "error",
          });
        }
      } catch (err) {
        console.error("⚠️ Error al procesar cobro automático:", err);
        setSnackbar({
          open: true,
          message: "⚠️ Error al procesar el cobro automático",
          severity: "error",
        });
      }
    } else {
      // 📨 Si NO está suscrito → enviar correo de cobro manual
      const templateParams = {
        sitioWeb: `www.${cliente.sitioWeb}`,
        nombre: cliente.cliente || cliente.sitioWeb || "Cliente",
        mes: `${mesCapitalizado} ${year}`,
        email: modoDesarrollo
          ? "plataformas.web.cl@gmail.com"
          : cliente.correo || "plataformas.web.cl@gmail.com",
        monto: cliente.valor
          ? `$${cliente.valor.replace(/\$/g, "").trim()} CLP`
          : "$9.990 CLP",
        cc: "plataformas.web.cl@gmail.com",
      };

      try {
        await emailjs.send(
          "service_ocjgtpc",
          "template_eoaqvlw",
          templateParams,
          "byR6suwAx2-x6ddVp"
        );
        console.log("📧 Correo de cobro enviado a", templateParams.email);
      } catch (error) {
        console.error("❌ Error al enviar el correo de cobro:", error);
      }

      console.log("ℹ️ Cliente no suscrito o sin tbk_user, se notificó por correo de cobro.", {
        suscripcionOriginal: cliente.suscripcion,
        tbk_user: cliente.tbk_user,
      });
    }
  };

  // ✅ Marca el pago como exitoso en el Excel del S3
  const actualizarClientePagado = async (idCliente) => {
    try {
      const baseUrl = window.location.hostname === "localhost" ? "http://localhost:8888" : "";
      const resp = await fetch(`${baseUrl}/.netlify/functions/actualizarCliente`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCliente,
          cobroExitoso: true,
        }),
      });

      if (!resp.ok) throw new Error(`Error HTTP ${resp.status}`);
      console.log("✅ Cliente marcado como pagado en Excel");
    } catch (err) {
      console.error("❌ Error al actualizar cliente pagado:", err);
    }
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
    }, 10000);
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

          // Despues de 2s, apaga el zoom y el efecto
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
          fontSize: "1rem",
          lineHeight: 1.3,
          color: mostrarEfecto
            ? esGanancia
              ? "transparent"
              : esReversion
                ? "#ffcdd2"
                : "#fff"
            : "#fff",
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

  // Para dialogo de cobro
  useEffect(() => {
    if (openDialogCobro) {
      setMesManual(mesCapitalizado);
    }
  }, [openDialogCobro, mesCapitalizado]);

  // Para dialogo  de pago
  useEffect(() => {
    if (openDialog && !esReversion) {
      setMesManual(mesCapitalizado);
    }
  }, [openDialog, esReversion, mesCapitalizado]);

  //DIALOG AGREGAR CLIENTE
  const agregarCliente = () => {
    setClienteAEditar(null);
    setOpenAgregarCliente(true);
  };

  //DIALOG EDITAR CLIENTE
  const editarCliente = (cliente) => {
    setClienteAEditar(cliente);
    setOpenAgregarCliente(true);
  };

  //DIALOG CERRAR
  const handleCloseAgregarCliente = () => {
    setOpenAgregarCliente(false);
    setClienteAEditar(null);
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
      setClientes(ordenarClientes(clientesConEstado));
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

      // âœ… Actualiza la lista en pantalla
      setClientes((prev) => prev.filter((c) => c.sitioWeb !== dialog.sitioWeb));
      setSnackbar({
        open: true,
        type: "success",
        message: `Cliente "${dialog.sitioWeb}" eliminado correctamente`,
      });
    } catch (error) {
      console.error("âŒ Error al eliminar cliente:", error);
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

  //SUSCRITO
  const actualizarASuscrito = async (cliente, nuevoEstado) => {
    try {
      const url = `${window.location.hostname === "localhost"
        ? "http://localhost:8888"
        : ""
        }/.netlify/functions/actualizarCliente`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idCliente: cliente.idCliente,
          suscripcion: nuevoEstado, // ðŸ'ˆ true = activar, false = anular
        }),
      });

      const data = await res.json();
      console.log("Suscripcion actualizada:", data);

      if (res.ok) {
        const nuevosClientes = await cargarClientesDesdeExcel();
        setClientes(nuevosClientes);
      }
    } catch (err) {
      console.error("âŒ Error al actualizar suscripciÃ³n:", err);
    }
  };

  useEffect(() => {
    setNavbarAccion(
      <Button
        onClick={() => agregarCliente()}
        variant="outlined"
        size="small"
        sx={{
          color: temaOscuro ? "white" : "#111",
          borderColor: temaOscuro ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
          fontSize: "0.75rem",
          px: 1,
          py: 0.4,
          minWidth: 36,
          display: "flex",
          alignItems: "center",
          gap: 0,
          overflow: "hidden",
          "&:hover": { backgroundColor: temaOscuro ? "#ffffff22" : "#00000011", borderColor: temaOscuro ? "#fff" : "#000" },
        }}
      >
        <AddIcon sx={{ fontSize: 18, flexShrink: 0 }} />
        <AnimatePresence>
          {mostrarTextoAgregar && (
            <motion.span
              initial={{ maxWidth: 130, opacity: 1, marginLeft: 4 }}
              exit={{ maxWidth: 0, opacity: 0, marginLeft: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden", whiteSpace: "nowrap", display: "block" }}
            >
              Agregar Cliente
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    );
    return () => setNavbarAccion(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temaOscuro, mostrarTextoAgregar]);

  return (
    <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", overflowX: "hidden", pb: 4, px: { xs: 1, md: 3 }, pt: 2 }}>

      <Box sx={{ width: "100%" }}>

        {/* ── Indicadores ── */}
        {(() => {
          const total = clientes.length || 1;
          const cobrados = clientes.filter(esPagado).length;
          const pendientes = clientes.filter(c => !esPagado(c)).length;
          const pctCobrado = Math.round((cobrados / total) * 100);

          return (
            <Box sx={{ display: "flex", gap: 1.5, mb: 2, width: "100%", alignItems: "stretch" }}>
              {/* Recaudado */}
              <Box sx={{
                flex: "1 1 0", width: 0,
                borderRadius: 3, overflow: "hidden",
                background: "linear-gradient(145deg, #0a3d1a 0%, #1b5e20 60%, #2e7d32 100%)",
                boxShadow: "0 6px 24px rgba(27,94,32,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
              }}>
                {/* Shine */}
                <Box sx={{
                  position: "absolute", top: 0, left: "-75%", width: "50%", height: "100%",
                  background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                  transform: "skewX(-20deg)",
                  animation: `${shineCard} 3.5s ease-in-out infinite`,
                  pointerEvents: "none",
                }} />

                <Box sx={{ px: 1.5, pt: 0.6, pb: 0.4, position: "relative", zIndex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                      Recaudado · {mesCapitalizado}
                    </Typography>
                    <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                      💰
                    </Box>
                  </Box>
                  <ContadorGanado valorFinal={totalGanado} valorInicial={totalGanadoAnterior} tipoCambio={tipoCambioVisual} />
                  <Box sx={{ mt: 0.4, mb: 0.3 }}>
                    <Box sx={{ height: 3, borderRadius: 99, bgcolor: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${pctCobrado}%`, borderRadius: 99, bgcolor: "rgba(255,255,255,0.6)", transition: "width 0.6s ease" }} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                    {cobrados} de {total} cobrados · {pctCobrado}%
                  </Typography>
                </Box>
              </Box>

              {/* Por cobrar */}
              <Box sx={{
                flex: "1 1 0", width: 0,
                borderRadius: 3,
                background: "linear-gradient(145deg, #4a0000 0%, #7f1010 60%, #b71c1c 100%)",
                boxShadow: "0 6px 24px rgba(183,28,28,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative", overflow: "hidden",
              }}>
                <Box sx={{ px: 1.5, pt: 0.6, pb: 0.4, position: "relative", zIndex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3 }}>
                    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                      Por cobrar
                    </Typography>
                    <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>
                      ⏳
                    </Box>
                  </Box>
                  <Typography fontWeight={800} sx={{ fontSize: "1rem", lineHeight: 1.3, color: "#fff", letterSpacing: "-0.3px" }}>
                    ${totalDeuda.toLocaleString("es-CL")}
                    <Typography component="span" sx={{ fontSize: "0.6rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", ml: 0.5 }}>CLP</Typography>
                  </Typography>
                  <Box sx={{ mt: 0.4, mb: 0.3 }}>
                    <Box sx={{ height: 3, borderRadius: 99, bgcolor: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${100 - pctCobrado}%`, borderRadius: 99, bgcolor: "rgba(255,255,255,0.6)", transition: "width 0.6s ease" }} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>
                    {pendientes} pendiente{pendientes !== 1 ? "s" : ""} · {100 - pctCobrado}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })()}

        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            maxHeight: "calc(100vh - 160px)",
            borderRadius: "12px",
            overflowX: isMobile ? "auto" : "hidden", // ðŸ'ˆ scroll horizontal solo en mobile
            overflowY: "auto",
            boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
            backgroundColor: "#fdfdfd",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              minWidth: isMobile ? 340 : "auto",
              "& .MuiTableCell-root": {
                fontFamily: "Poppins, sans-serif",
                borderColor: "rgba(0,0,0,0.1)",
              },
              "& thead th, & thead .MuiTableCell-root, & .MuiTableCell-stickyHeader": {
                borderColor: "#1e2d40 !important",
                boxShadow: "none !important",
                outline: "none !important",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {/* Clientes — ocupa todo el espacio disponible */}
                <TableCell
                  sx={{
                    background: "#1e2d40",
                    borderColor: "#1e2d40",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: { xs: "0.68rem", sm: "0.75rem" },
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                    py: 0.3,
                  }}
                >
                  Clientes
                </TableCell>

                {/* Dot indicator — ancho mínimo fijo */}
                <TableCell
                  style={{ borderColor: "#1e2d40", borderBottom: "1px solid #1e2d40", borderRight: "1px solid #1e2d40", borderLeft: "1px solid #1e2d40", borderTop: "1px solid #1e2d40" }}
                  sx={{
                    background: "#1e2d40",
                    width: isMobile ? 28 : 32,
                    minWidth: isMobile ? 28 : 32,
                    maxWidth: isMobile ? 28 : 32,
                    py: 0.3,
                    px: 0,
                  }}
                />

                {/* Sin label — abarca las 2 columnas de botones */}
                <TableCell
                  colSpan={2}
                  sx={{
                    background: "#1e2d40",
                    borderColor: "#1e2d40",
                    py: 0.3,
                    px: 1,
                  }}
                />
              </TableRow>
            </TableHead>


            <TableBody>
              {clientesPaginados.map((cliente, index) => {
                const estaAlDia = cliente.pagado;
                const estaSuscrito = cliente.suscripcion === true;

                return (
                  <TableRow
                    key={index}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      background: estaSuscrito
                        ? "linear-gradient(90deg, rgba(255,215,0,0.22), rgba(255,223,128,0.18))"
                        : estaAlDia
                          ? "rgba(200, 255, 200, 0.12)"
                          : "rgba(239,83,80,0.07)",
                      transition: "background 0.3s ease-in-out",

                      "&:hover": {
                        background: estaSuscrito
                          ? "linear-gradient(90deg, rgba(255,215,0,0.32), rgba(255,223,128,0.25))"
                          : estaAlDia
                            ? "rgba(200, 255, 200, 0.22)"
                            : "rgba(239,83,80,0.14)",
                      },

                      // Efecto de brillo diagonal solo si esta suscrito
                      ...(estaSuscrito && {
                        boxShadow: "inset 0 0 0.5px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.25)",
                        position: "relative",
                        isolation: "isolate", // asegura que el brillo no afecte layout exterior
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%)",
                          maskImage: "linear-gradient(90deg, transparent, black, transparent)",
                          WebkitMaskImage: "linear-gradient(90deg, transparent, black, transparent)",
                          animation: "shineRowMask 6s linear infinite",
                          pointerEvents: "none",
                          zIndex: 1,
                          opacity: 0.5,
                        },
                      }),
                      "@keyframes shineRowMask": {
                        "0%": { maskPosition: "150% 0", WebkitMaskPosition: "150% 0" },
                        "100%": { maskPosition: "-50% 0", WebkitMaskPosition: "-50% 0" },
                      },

                      "& td, & th": {
                        py: { xs: 0, sm: 0 },
                        px: { xs: 1, sm: 2 },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        position: "relative",
                        zIndex: 2,
                      },
                    }}
                  >

                    {/* Cliente */}
                    <TableCell
                      sx={{
                        minWidth: isMobile ? 150 : 360,
                        maxWidth: isMobile ? 200 : 700,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "wrap", // permite que los Ã­conos bajen a la siguiente lÃ­nea si falta espacio
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#1a0dab",
                            textDecoration: "underline",
                            fontWeight: 500,
                            fontSize: isMobile ? "0.75rem" : "1rem",
                            cursor: "pointer",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap", // evita que se rompa el texto, mantiene el ellipsis
                            flex: 1, // ocupa todo el espacio disponible antes de los Ã­conos
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

                        {/* Iconos */}
                        <Box sx={{ display: "flex", gap: 0.4, alignItems: "center" }}>
                          {/* Botón editar */}
                          <Tooltip title="Editar Cliente" arrow>
                            <IconButton
                              onClick={() => editarCliente(cliente)}
                              size="small"
                              sx={{
                                background: "linear-gradient(135deg, #1565C0, #1976D2)",
                                width: 22,
                                height: 22,
                                p: 0.3,
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                                color: "#fff",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #1976D2, #42A5F5)",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                            >
                              <EditRoundedIcon fontSize="inherit" sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>

                          {/* Botón eliminar */}
                          <Tooltip title="Eliminar Cliente" arrow>
                            <IconButton
                              onClick={() => abrirDialog(cliente.sitioWeb)}
                              size="small"
                              sx={{
                                background: "linear-gradient(135deg, #f44336, #d32f2f)",
                                width: 22,
                                height: 22,
                                p: 0.3,
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                                color: "#fff",
                                "&:hover": {
                                  background: "linear-gradient(135deg, #ef5350, #e53935)",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                            >
                              <DeleteForeverRoundedIcon fontSize="inherit" sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>

                          {/* Botón suscribir manualmente */}
                          <Tooltip
                            title={cliente.suscripcion ? "Anular suscripción" : "Activar suscripción"}
                            arrow
                          >
                            <IconButton
                              onClick={() =>
                                actualizarASuscrito(cliente, !cliente.suscripcion) // ðŸ'ˆ enviamos nuevo estado
                              }
                              size="small"
                              sx={{
                                background: cliente.suscripcion
                                  ? "linear-gradient(135deg, #f44336, #d32f2f)" // ðŸ"´ rojo si estÃ¡ suscrito
                                  : "linear-gradient(135deg, #43a047, #2e7d32)", // ðŸŸ¢ verde si no
                                width: 22,
                                height: 22,
                                p: 0.3,
                                borderRadius: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                                color: "#fff",
                                "&:hover": {
                                  background: cliente.suscripcion
                                    ? "linear-gradient(135deg, #ef5350, #e53935)"
                                    : "linear-gradient(135deg, #66bb6a, #388e3c)",
                                  transform: "scale(1.1)",
                                  transition: "all 0.2s ease",
                                },
                              }}
                            >
                              <HowToRegRoundedIcon fontSize="inherit" sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </TableCell>


                    <TableCell
                      align="center"
                      sx={{
                        width: isMobile ? 28 : 48,
                        minWidth: isMobile ? 28 : 48,
                        maxWidth: isMobile ? 28 : 48,
                        paddingLeft: 0,
                        paddingRight: 0,
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
                        {estaSuscrito ? (
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              background: "radial-gradient(circle at 40% 40%, #FFD700, #B8860B)",
                              boxShadow: "0 0 8px rgba(255, 215, 0, 0.6)",
                              animation: "pulseGold 2s infinite ease-in-out",
                              "@keyframes pulseGold": {
                                "0%": { transform: "scale(1)", opacity: 1 },
                                "50%": { transform: "scale(1.3)", opacity: 0.85 },
                                "100%": { transform: "scale(1)", opacity: 1 },
                              },
                            }}
                          />
                        ) : estaAlDia ? (
                          <GreenDot />
                        ) : (
                          <RedDot />
                        )}
                      </Box>
                    </TableCell>


                    {/* === CELDA 1: Botón COBRAR (siempre visible) === */}
                    <TableCell align="center" sx={{ width: isMobile ? 72 : 130, minWidth: isMobile ? 72 : 130, pr: isMobile ? 0.5 : 1 }}>
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
                          size="small"
                          onClick={() => {
                            setClienteSeleccionado(cliente);
                            setOpenDialogCobro(true);
                          }}
                          color={
                            cliente.pagado === 1 || cliente.pagado === true
                              ? "success"
                              : "error"
                          }
                          disabled={!estaSuscrito && (estaAlDia || botonesBloqueados.includes(index))}
                          sx={{
                            minWidth: isMobile ? "auto" : 96,
                            px: isMobile ? 1.3 : 2,
                            py: isMobile ? 0.5 : 0.8,
                            fontSize: isMobile ? 0 : "0.8rem",
                            fontWeight: 600,
                            transition: "all 0.3s ease",
                            "& .emoji": { fontSize: "1rem" },
                            "&.Mui-disabled": {
                              cursor: "not-allowed !important",
                              pointerEvents: "auto",
                              opacity: 0.6,
                            },
                          }}
                        >
                          {isMobile ? (
                            <span className="emoji">
                              {cliente.pagado === 1 || cliente.pagado === true ? "🏦" : "💰"}
                            </span>
                          ) : (
                            <>
                              {cliente.pagado === 1 || cliente.pagado === true ? "Cobrado" : "Cobrar"}
                            </>
                          )}
                        </Button>

                      </Box>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        width: isMobile ? 72 : 155,
                        minWidth: isMobile ? 72 : 155,
                        pl: isMobile ? 0.5 : 1,
                        pr: isMobile ? 1 : 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start", // ðŸ"¹ pegado a la izquierda
                          alignItems: "center",
                          minHeight: "50px",
                          gap: 0.5, // espacio entre iconos y/o botÃ³n
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {estaSuscrito ? (
                            <motion.div
                              key="suscrito"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Tooltip title="Suscriptor" arrow>
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    minWidth: isMobile ? "auto" : undefined,
                                    px: isMobile ? 1.3 : 2,
                                    py: isMobile ? 0.5 : 0.8,
                                    fontSize: isMobile ? 0 : "0.8rem",
                                    fontWeight: 600,
                                    transition: "all 0.3s ease",
                                    "& .emoji": { fontSize: "1rem" },

                                    // ðŸ"¹ Fondo mÃ¡s visible
                                    background: "linear-gradient(90deg, rgba(255,215,0,0.35), rgba(255,195,0,0.2))",
                                    // ðŸ"¹ Borde mÃ¡s oscuro
                                    border: "1px solid rgba(184,134,11,0.8)",
                                    color: "#b8860b",
                                    boxShadow: "0 0 8px rgba(184,134,11,0.5)",
                                    position: "relative",
                                    overflow: "hidden",
                                    borderRadius: "6px",

                                    "&:hover": {
                                      background: "linear-gradient(90deg, rgba(255,215,0,0.5), rgba(255,195,0,0.3))",
                                      boxShadow: "0 0 10px rgba(184,134,11,0.7)",
                                    },

                                    "&::after": {
                                      content: '""',
                                      position: "absolute",
                                      top: 0,
                                      left: "-150%",
                                      width: "250%",
                                      height: "100%",
                                      background:
                                        "linear-gradient(120deg, transparent 45%, rgba(255,255,255,0.6) 50%, transparent 55%)",
                                      animation: "shineGold 4s linear infinite",
                                      pointerEvents: "none",
                                      zIndex: 1,
                                      opacity: 0.7,
                                    },
                                    "@keyframes shineGold": {
                                      "0%": { transform: "translateX(-100%)" },
                                      "100%": { transform: "translateX(100%)" },
                                    },
                                  }}
                                >
                                  <span className="emoji">💎</span>
                                </Button>
                              </Tooltip>


                            </motion.div>
                          ) : estaAlDia ? (
                            <motion.div
                              key="pagado"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.3 }}
                              style={{ display: "flex", alignItems: "center", gap: 6 }}
                            >
                              {isMobile ? (
                                <>
                                  <DoneAllIcon fontSize="small" htmlColor="#2e7d32" />
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    onClick={() => abrirDialogoConfirmacion(cliente, true)}
                                    sx={{ minWidth: 0, padding: 0, ml: 0 }}
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
                                    ✅ Pago recibido
                                  </Typography>
                                  <Button
                                    size="small"
                                    variant="text"
                                    color="warning"
                                    onClick={() => abrirDialogoConfirmacion(cliente, true)}
                                    sx={{ minWidth: 0, padding: 0, ml: 0 }}
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
                                  "& .emoji": { fontSize: "1rem" },
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
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: 1,
            }}
          >
            <Button
              variant="outlined"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
              sx={{
                color: temaOscuro ? "white" : "#111",
                borderColor: temaOscuro ? "white" : "#111",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                px: isMobile ? 1.5 : 2,
                "&:hover": {
                  borderColor: "#E95420",
                  backgroundColor: "#E95420",
                  color: "#fff",
                },
              }}
            >
              Anterior
            </Button>
            <Typography variant="body2" sx={{ color: temaOscuro ? "white" : "#111", minWidth: 90, textAlign: "center" }}>
              Página {paginaActual} de {totalPaginas}
            </Typography>
            <Button
              variant="outlined"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
              sx={{
                color: temaOscuro ? "white" : "#111",
                borderColor: temaOscuro ? "white" : "#111",
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                px: isMobile ? 1.5 : 2,
                "&:hover": {
                  borderColor: "#E95420",
                  backgroundColor: "#E95420",
                  color: "#fff",
                },
              }}
            >
              Siguiente
            </Button>
          </Box>
        )}


      </Box>




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
              animation: openDialogCobro ? "spinTwice 0.6s ease-in-out" : "none", // ðŸ'ˆ depende del estado del dialog
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
              gap: { xs: 0.6, sm: 1 }, // ðŸ'ˆ menos separaciÃ³n
              px: { xs: 1, sm: 1.5 },  // ðŸ'ˆ padding horizontal reducido
              py: { xs: 0.3, sm: 0.6 }, // ðŸ'ˆ padding vertical reducido
              borderRadius: "999px",
              bgcolor: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              boxShadow: "0 3px 10px rgba(0,0,0,.3)", // ðŸ'ˆ sombra mÃ¡s sutil
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                letterSpacing: { xs: "0.2px", sm: "0.8px" },
                fontFamily: "'Poppins', sans-serif",
                color: "#fff",
                fontSize: { xs: "0.83rem", sm: "1.1rem" },
              }}
            >
              Cobro del mes de {mesManual || mesCapitalizado} {new Date().getFullYear()}
            </Typography>
          </Box>
        </DialogTitle>


        <DialogContent sx={{ pt: 4, borderTop: "1px solid rgba(255,255,255,0.1)" }}>

          <DialogContentText sx={{ pt: 2 }}>
            Notificaremos al cliente <strong>{clienteSeleccionado?.cliente}</strong> por el sitio{" "}
            <strong>{clienteSeleccionado?.sitioWeb}</strong>.

            {/* 💰 Información de monto a cobrar */}
            <Box
              sx={{
                mt: 1,
                mb: 0,
                px: 2,
                py: 1.5,
                borderRadius: 2,
                position: "relative",
                background: "linear-gradient(90deg, #25D366 0%, #128C7E 100%)",
                boxShadow: "0 4px 12px rgba(18,140,126,0.35)",
                transition: "all 0.3s ease",
                textAlign: "center",
                color: "#fff",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-2px)",
                  background: "linear-gradient(90deg, #20bd5a 0%, #0d745f 100%)",
                  boxShadow: "0 6px 16px rgba(18,140,126,0.45)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {/* ✨ Brillo animado */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "-75%",
                  width: "50%",
                  height: "100%",
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)",
                  transform: "skewX(-25deg)",
                  animation: "shine 3s infinite",
                  "@keyframes shine": {
                    "0%": { left: "-75%" },
                    "60%": { left: "130%" },
                    "100%": { left: "130%" },
                  },
                  pointerEvents: "none",
                }}
              />

              {/* 🚀 Contenedor animado con altura fluida */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={cobrando ? "procesando" : "monto"}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    layout: { duration: 0.4, ease: "easeInOut" },
                    opacity: { duration: 0.4 },
                    y: { duration: 0.4 },
                  }}
                >
                  {cobrando ? (
                    <>
                      {/* 🏦 Animación Transbank → Banco */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 2,
                          px: 1,
                          py: 0.5,
                          minHeight: 60,
                          position: "relative",
                        }}
                      >
                        {/* Transbank */}
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1 }}>
                          <Box
                            component="img"
                            src="/logo-cargo-transbank.png"
                            alt="Transbank"
                            sx={{ width: 30, height: "auto", mb: 0.3 }}
                          />
                          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, opacity: 0.9, letterSpacing: 0.3 }}>
                            Transbank
                          </Typography>
                        </Box>

                        {/* Puntos animados */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.1, flex: 1, zIndex: 2 }}>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: "radial-gradient(circle, #ffffff 0%, #b2f7d8 100%)",
                                boxShadow: "0 0 8px rgba(255,255,255,0.7)",
                              }}
                              animate={{
                                scale: [0.8, 1.4, 0.8],
                                opacity: [0.3, 1, 0.3],
                                x: [0, 2, 0],
                              }}
                              transition={{
                                repeat: Infinity,
                                repeatDelay: 0.2,
                                duration: 1.4,
                                delay: i * 0.25,
                                ease: "easeInOut",
                              }}
                            />
                          ))}
                        </Box>

                        {/* Banco */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            zIndex: 1,
                            mt: { xs: 1, sm: 0.8 },
                          }}
                        >
                          <Box
                            component="img"
                            src="/logo-cargo-banco.webp"
                            alt="Banco"
                            sx={{ width: 70, height: "auto", mb: 0.3 }}
                          />
                          <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, opacity: 0.9, letterSpacing: 0.3 }}>
                            Banco
                          </Typography>
                        </Box>
                      </Box>

                      {/* Texto inferior animado */}
                      <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <Typography
                          sx={{
                            mt: 1.2,
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", sm: "1.05rem" },
                            textShadow: "0 2px 4px rgba(0,0,0,0.25)",
                          }}
                        >
                          Procesando pago...
                        </Typography>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: "0.9rem", sm: "1.05rem" },
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.6,
                        }}
                      >
                        💰 Monto a cobrar: ${montoCobro.toLocaleString("es-CL")} CLP
                      </Typography>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.85rem" }, opacity: 0.9, mt: 0.3 }}>
                        {esSitioPrueba ? "(Monto especial por sitio asociado)" : "(Suscripción mensual estándar)"}
                      </Typography>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </Box>


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
                      paddingTop: 0,
                    },
                    "&::before": {
                      display: "none",
                    },
                    "&::after": {
                      display: "none",
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
            background: "linear-gradient(90deg, #FFF3E0, #FFE0B2)",
            borderTop: "1px solid rgba(255,167,38,.35)",
          }}
        >
          <Button
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.6rem" : "0.875rem" }}
            onClick={() => setOpenDialogCobro(false)}
            disabled={botonesDeshabilitados}
          >
            Cancelar
          </Button>

          <Button
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? "0.7rem" : "0.875rem" }}
            onClick={() => {
              if (botonesDeshabilitados) return;
              setBotonesDeshabilitados(true);

              enviarCorreoSuspension(clienteSeleccionado);

              const mensaje = `🔴 Estimado ${clienteSeleccionado.cliente}, su Suscripción (${clienteSeleccionado.sitioWeb}) tiene ${diasAtraso} día${diasAtraso === 1 ? "" : "s"} de atraso. Se debe regularizar o será suspendido en 24 hrs.`;
              const numero = clienteSeleccionado.telefono || "56946873014";
              const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
              window.open(url, "_blank");

              setOpenDialogCobro(false);
              setBotonesDeshabilitados(false);
            }}
            color="warning"
            variant="contained"
            disabled={botonesDeshabilitados}
          >
            🚫 Suspensión
          </Button>

          <Button
            size={isMobile ? "small" : "medium"}
            sx={{
              fontSize: isMobile ? "0.7rem" : "0.875rem",
              fontWeight: 600,
              transition: "all 0.3s ease",
            }}
            color={
              clienteSeleccionado?.suscripcion &&
                (clienteSeleccionado?.pagado === 1 || clienteSeleccionado?.pagado === true)
                ? "success"
                : "error"
            }
            variant="contained"
            disabled={cobrando}
            onClick={async () => {
              setCobrando(true);

              const mesFinal = mesManual || mesCapitalizado;
              const mesFinalCapitalizado =
                mesFinal.charAt(0).toUpperCase() + mesFinal.slice(1);

              const cliente = clienteSeleccionado;
              const suscrito =
                cliente.suscripcion === true ||
                cliente.suscripcion === 1 ||
                cliente.suscripcion === "1" ||
                cliente.suscripcion === "true" ||
                cliente.suscripcion === "TRUE";
              const tieneToken = (cliente.tbk_user || "").trim() !== "";

              try {
                if (suscrito && tieneToken) {
                  await enviarCorreoCobro(cliente, mesFinalCapitalizado);
                } else {
                  const mensaje = `Buenas! recordar el pago del HOSTING de ${cliente.sitioWeb} de *${cliente.valor}* del mes de ${mesFinalCapitalizado}.`;
                  const numero = cliente.telefono || "56946873014";
                  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
                  window.open(url, "_blank");

                  await enviarCorreoCobro(cliente, mesFinalCapitalizado);
                }

                if (cliente.index !== undefined) {
                  bloquearBotonTemporalmente(cliente.index);
                }

              } finally {
                setCobrando(false);
                setOpenDialogCobro(false);
              }
            }}
          >
            {cobrando ? "⏳ Cobrando..." : (
              clienteSeleccionado?.suscripcion &&
                (clienteSeleccionado?.pagado === 1 || clienteSeleccionado?.pagado === true)
                ? "👁️ Cobrar"
                : "💰 Cobrar"
            )}
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

      {/* DIALOG Agregar / Editar Cliente */}
      <DialogAgregarCliente
        open={openAgregarCliente}
        onClose={handleCloseAgregarCliente}
        onSave={handleSaveCliente}
        clienteEditar={clienteAEditar}
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
      {/* Snackbar genérico */}
      <Snackbar
        open={snackbar.open && snackbar.type !== "success-cobro"}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />

      {/* Snackbar especial de cobro */}
      <Snackbar
        open={snackbar.open && snackbar.type === "success-cobro"}
        autoHideDuration={4500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              background: "linear-gradient(90deg,#2E7D32 0%,#43A047 50%,#66BB6A 100%)",
              color: "#fff",
              px: 2.8,
              py: 1.6,
              borderRadius: 2.5,
              boxShadow: "0 6px 22px rgba(67,160,71,0.4)",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              textShadow: "0 1px 2px rgba(0,0,0,0.25)",
              minWidth: 300,
            }}
          >
            {/* 👏 Aplausos animados */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ fontSize: "1.7rem" }}
            >
              👏
            </motion.span>

            {/* Texto */}
            <Box sx={{ flex: 1, textAlign: "left" }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  lineHeight: 1.3,
                }}
              >
                Cobro automático aprobado
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                  opacity: 0.95,
                }}
              >
                💰 Transacción exitosa para{" "}
                {snackbar?.message?.match(/para (.*)/)?.[1] || "el cliente"}
              </Typography>
            </Box>

            {/* 💵 Dinero flotante */}
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
              style={{ fontSize: "1.6rem" }}
            >
              💵
            </motion.span>
          </Box>
        </motion.div>
      </Snackbar>

    </Box>
  );
};

export default Clientes;
