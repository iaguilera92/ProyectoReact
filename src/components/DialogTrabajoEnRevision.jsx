import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, useMediaQuery } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AnimatePresence, motion } from "framer-motion";
import theme from "../theme";
import { cargarTrabajosEnRevision } from "../helpers/HelperTrabajosEnRevision";
import TrabajosEnRevision from "./TrabajosEnRevision";
import ButtonHablarConEjecutivo from "./DialogTrabajoEnRevisionButton";

const DialogTrabajoEnRevision = ({ open, onClose }) => {
  const timestamp = Date.now();
  const URL_EXCEL = `https://plataformas-web-buckets.s3.us-east-2.amazonaws.com/TrabajosEnRevision.xlsx?t=${timestamp}`;
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [localTrabajos, setLocalTrabajos] = useState([]);
  const [ultimaFecha, setUltimaFecha] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [showContent, setShowContent] = useState(true);

  // 🔎 Detectar ?workInProgress=ID
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("workInProgress");

    if (id) {
      cargarDatos(id);
    }
  }, []);

  const cargarDatos = async (id) => {

    const trabajos = await cargarTrabajosEnRevision(URL_EXCEL);

    if (!trabajos || trabajos.length === 0) {
      console.warn("⚠️ El Excel está vacío o no se pudo leer.");
      return;
    }
    const filtrado = trabajos.filter(t => t.Id === Number(id));

    setLocalTrabajos(filtrado);

    if (filtrado.length > 0) {
      setUltimaFecha(filtrado[0].FechaActualizacion || "");
    } else {
      console.warn("❌ No se encontró el ID en el Excel:", id);
    }
  };


  const handleClose = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    onClose();
  };

  function RelojAnimado() {
    return (
      <Box
        sx={{
          position: "relative",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "2px solid #E65100",
          bgcolor: "#FFF8E1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,.25) inset",
        }}
      >
        {/* Aguja */}
        <Box
          sx={{
            position: "absolute",
            width: 2,
            height: "40%",
            bgcolor: "#E65100",
            borderRadius: 1,
            top: "10%",
            left: "47%",
            transformOrigin: "bottom center",
            animation: "spin 5s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />

        {/* Centro */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: "#E65100",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
      </Box>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
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
      {/* HEADER ORIGINAL SIN CAMBIOS VISUALES */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#FFF",
          fontFamily: "'Poppins', sans-serif",
          py: 1.5,
          borderBottom: "1px solid rgba(255,167,38,.35)",
          position: "relative", // 👈 ancla para el botón
          height: isMobile ? "75px" : "75px",
          overflow: "hidden",

          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: isMobile ? "75px" : "75px",
            backgroundImage: "url('/servicio1.webp')",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
            backgroundSize: { xs: "250%", sm: "130%" },
            animation: {
              xs: "zoomInMobile 2.5s ease-out forwards",
              sm: "zoomInDesktop 2.5s ease-out forwards",
            },
          },

          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: isMobile ? "75px" : "75px",
            bgcolor: "rgba(0,0,0,0.45)", // overlay oscuro
            zIndex: 1,
          },

          "& > *": {
            position: "relative",
            zIndex: 2,
          },

          "@keyframes zoomInDesktop": {
            "0%": { backgroundSize: "150%" },
            "100%": { backgroundSize: "110%" },
          },
          "@keyframes zoomInMobile": {
            "0%": { backgroundSize: "270%" },
            "100%": { backgroundSize: "140%" },
          },
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
            color: "#FFF",
            zIndex: 6,
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 28 }} />
        </IconButton>

        {/* Título fijo */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.8, sm: 1.2 }, // espacio entre ícono y texto
            px: { xs: 1.5, sm: 2 },
            py: { xs: 0.5, sm: 0.8 },
            borderRadius: "999px",
            bgcolor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 14px rgba(0,0,0,.35)",
            mt: 2
          }}
        >
          <RelojAnimado />

          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 800,
              letterSpacing: { xs: "0.3px", sm: "1px" },
              fontFamily: "'Poppins', sans-serif",
              color: "#fff",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Solicitud en Revisión!
          </Typography>
        </Box>

      </DialogTitle>

      {/* CONTENIDO (misma animación) */}
      <AnimatePresence>
        {showContent && (
          <motion.div key="dialogContent" initial={false}
            animate={expanded ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <DialogContent sx={{ background: "linear-gradient(180deg,#FFF8E1 0%,#FFF3E0 100%)", py: 1, px: 1.5, mb: 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mt: 0.5 }}>
                {localTrabajos.map((t) => {
                  const porcentaje = Math.min(100, Math.max(0, t.Porcentaje || 0));
                  const completado = porcentaje === 100;

                  return (
                    <Box
                      key={`${t.Negocio}-${t.Id}`}
                      sx={{
                        border: "1px solid rgba(230,81,0,0.25)",
                        borderRadius: 1,
                        py: 1,
                        px: 1.5,
                        background: completado
                          ? "linear-gradient(180deg, #FFEFD5 0%, #FFF5EB 100%)" // tono durazno pastel
                          : "#fff",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                      }}
                    >
                      <TrabajosEnRevision trabajo={t} />
                    </Box>
                  );
                })}
              </Box>


              {/* INFORMATIVO */}
              <Box
                sx={{
                  mt: 1,
                  p: 1.5,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #fff8f1, #fde7d9)", // fondo beige/naranja
                  border: "1px solid #f5c6a5",
                  boxShadow: "0 4px 14px rgba(230,124,36,0.15)",
                }}
              >
                {/* BOT → HUMANO */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    px: 1,
                    py: 1.5,
                  }}
                >
                  {/* BOT */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifySelf: "end",
                      pr: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "50%",
                        padding: "2px", // 🔹 grosor del borde degradado
                        background: "conic-gradient(from 0deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)", // 🔹 degradado tipo IG
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(230,124,36,0.2)",
                      }}
                    >
                      <Box
                        component="img"
                        src="/plataformas-web-img.jpeg"
                        alt="Bot"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          background: "#fff8f1", // fondo interno para resaltar la imagen
                          padding: "2px", // 🔹 opcional: espacio extra entre imagen y borde
                        }}
                      />
                    </Box>


                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#6b4a2c",
                        mt: 0.45,
                      }}
                    >
                      Analista
                    </Typography>
                  </Box>

                  {/* FLUJO ANIMADO MEJORADO */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 0.8, // un poquito más de espacio para respiración
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "radial-gradient(circle, #fbbf93 0%, #f97316 100%)",
                          boxShadow: "0 0 10px rgba(251,115,24,0.6)",
                        }}
                        animate={{
                          scale: [0.8, 1.4, 0.8], // un poco más dramático
                          opacity: [0.3, 1, 0.3],
                          y: [0, -4, 0], // cambio de x a y para simular “bote vertical”
                          rotate: [0, 15, -15, 0], // pequeña rotación para dinamismo
                        }}
                        transition={{
                          repeat: Infinity,
                          repeatDelay: 0.15,
                          duration: 1.2,
                          delay: i * 0.25,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </Box>


                  {/* HUMANO */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifySelf: "start",
                      pl: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 65,
                        height: 65,
                        borderRadius: "50%",
                        padding: "2px", // 🔹 grosor del borde degradado
                        background: "conic-gradient(from 0deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5, #feda75)", // 🔹 degradado tipo IG
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(251,115,24,0.2)",
                      }}
                    >
                      <Box
                        component="img"
                        src="/user.webp"
                        alt="Humano"
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover", // 🔹 recorta la imagen si es necesario
                          background: "#fef3e0", // fondo interno
                          padding: "2px", // espacio entre la imagen y el borde degradado
                        }}
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#6b4a2c",
                        mt: 0.45,
                      }}
                    >
                      Cliente
                    </Typography>
                  </Box>
                </Box>

                {/* Mensaje Informativo */}
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#7a4b2f", // marrón suave
                      lineHeight: 1.3,
                    }}
                  >
                    Su solicitud está en revisión,
                    <br />
                    un Analista se comunicará pronto.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#d97706", // naranja suave
                      letterSpacing: 0.3,
                    }}
                  >
                    {localTrabajos[0]?.TelefonoCliente || "Número desconocido"}
                  </Typography>
                </Box>

              </Box>



            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>


      <DialogActions
        sx={{
          px: 1.5,
          py: 1,
          background: "linear-gradient(90deg,#FFF3E0,#FFE0B2)",
          borderTop: "1px solid rgba(255,167,38,.35)",
          display: "flex",
          justifyContent: "flex-end", // todo a la derecha
          alignItems: "center",
          gap: 0, // más pegados
        }}
      >
        {/* Botón Cancelar */}
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "#E65100",
            fontWeight: 700,
            borderColor: "#E65100",
            textTransform: "none",
            height: 38, // mismo que Hablar con Ejecutivo
            minWidth: 100,
            "&:hover": {
              backgroundColor: "rgba(230,81,16,0.1)",
              borderColor: "#E65100",
            },
          }}
        >
          Cancelar
        </Button>

        {/* Botón Hablar con Ejecutivo */}
        {localTrabajos.length > 0 && (
          <ButtonHablarConEjecutivo trabajo={localTrabajos[0]} height={38} />
        )}
      </DialogActions>



    </Dialog>
  );
};

export default DialogTrabajoEnRevision;
