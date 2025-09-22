import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function DialogPaseMensual({ open, onClose }) {
  const [misiones, setMisiones] = useState([
    {
      id: 1,
      recompensa: "2,5%",
      descripcion: "Compartir en Instagram o Facebook",
      estado: "pendiente",
      color: "linear-gradient(135deg,#42a5f5,#1e88e5)",
      tipo: "pequeña",
    },
    {
      id: 2,
      recompensa: "2,5%",
      descripcion: "Pagar suscripción antes de fin de mes",
      estado: "pendiente",
      color: "linear-gradient(135deg,#66bb6a,#2e7d32)",
      tipo: "pequeña",
    },
    {
      id: 3,
      recompensa: "100%",
      descripcion: "Conseguir un Cliente para Plataformas web",
      estado: "pendiente",
      color: "linear-gradient(135deg,#fdd835,#fbc02d)",
      tipo: "grande",
    },
  ]);

  const handleAccion = (id) => {
    setMisiones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, estado: "revision" } : m
      )
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(180deg,#2c3e50,#34495e)",
          border: "4px solid #FFD700",
          boxShadow: "0 20px 50px rgba(0,0,0,.7)",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: 900,
          fontSize: { xs: "1.3rem", sm: "1.7rem" },
          background: "linear-gradient(90deg,#1565C0,#1E88E5,#42A5F5)",
          color: "#fff",
          textShadow: "2px 2px 6px rgba(0,0,0,.6)",
          borderBottom: "3px solid #FFD700",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        ⚔️ Pase Mensual 🎟️
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "#fff" }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      {/* CONTENIDO */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="pase-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <DialogContent sx={{ py: 1.5 }}>
              {/* Grid para misiones pequeñas */}
              <Grid container spacing={2}>
                {misiones
                  .filter((m) => m.tipo === "pequeña")
                  .map((m) => (
                    <Grid item xs={12} sm={6} key={m.id}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: m.color,
                          color: "#fff",
                          textAlign: "center",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          position: "relative",
                          overflow: "hidden",
                          // Brillo especial estilo clash
                          boxShadow: `
      inset 0 0 15px rgba(255,255,255,0.4),
      0 6px 15px rgba(0,0,0,.4)
    `,
                          border: "2px solid #FFD700",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-50%",
                            width: "200%",
                            height: "100%",
                            background:
                              "linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 60%)",
                            transform: "skewX(-20deg)",
                            animation: "shine 3s infinite",
                          },
                          "@keyframes shine": {
                            "0%": { left: "-50%" },
                            "100%": { left: "100%" },
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 900,
                            textShadow: "2px 2px 6px rgba(0,0,0,.9)",
                          }}
                        >
                          {m.recompensa}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ mt: 1, mb: 1, fontWeight: 600 }}
                        >
                          {m.descripcion}
                        </Typography>

                        {m.estado === "pendiente" ? (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleAccion(m.id)}
                            sx={{
                              fontWeight: 800,
                              background: "linear-gradient(90deg,#FFD700,#FFA000)",
                              color: "#000",
                              border: "2px solid #fff",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                              "&:hover": {
                                background: "linear-gradient(90deg,#FFC107,#FFB300)",
                              },
                            }}
                          >
                            🎯 Completar Misión
                          </Button>
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            disabled
                            startIcon={<AccessTimeIcon />}
                            sx={{
                              fontWeight: 700,
                              color: "#eee",
                              borderColor: "rgba(255,255,255,0.6)",
                              backgroundColor: "rgba(0,0,0,0.4)",
                            }}
                          >
                            ⏳ En revisión
                          </Button>
                        )}
                      </Box>

                    </Grid>
                  ))}
              </Grid>

              {/* Misión grande */}
              <Box sx={{ mt: 1.5 }}>
                {misiones
                  .filter((m) => m.tipo === "grande")
                  .map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: m.color,
                        color: "#000",
                        textAlign: "center",
                        boxShadow: "0 10px 25px rgba(0,0,0,.4)",
                        border: "3px solid rgba(255,255,255,0.6)",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          textShadow: "2px 2px 6px rgba(0,0,0,.7)",
                        }}
                      >
                        {m.recompensa} DESCUENTO
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ mt: 1, mb: 2, fontWeight: 700 }}
                      >
                        {m.descripcion}
                      </Typography>

                      {m.estado === "pendiente" ? (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleAccion(m.id)}
                          sx={{
                            fontWeight: 800,
                            background: "linear-gradient(90deg,#FFD700,#FFA000)",
                            color: "#000",
                            "&:hover": {
                              background: "linear-gradient(90deg,#FFC107,#FFB300)",
                            },
                          }}
                        >
                          Hice la acción
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          variant="outlined"
                          disabled
                          startIcon={<AccessTimeIcon />}
                          sx={{
                            fontWeight: 700,
                            color: "#fff",
                            borderColor: "rgba(255,255,255,0.5)",
                            backgroundColor: "rgba(0,0,0,0.3)",
                          }}
                        >
                          En revisión
                        </Button>
                      )}
                    </Box>
                  ))}
              </Box>

              {/* Swiper anuncio */}
              <Box sx={{ mt: 1.5 }}>
                <Swiper spaceBetween={20} slidesPerView={1}>
                  <SwiperSlide>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        background:
                          "linear-gradient(135deg,#EF6C00,#F57C00,#FFA726)",
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        boxShadow: "0 10px 25px rgba(0,0,0,.5)",
                        border: "3px solid #FFD700",
                        textTransform: "uppercase",
                        textShadow: "2px 2px 6px rgba(0,0,0,.7)",
                      }}
                    >
                      🐶🐱 Pon a trabajar a tus mascotas <br />
                      <span style={{ fontSize: "1.6rem" }}>💰 $10.000 CLP</span>
                    </Box>
                  </SwiperSlide>
                </Swiper>
              </Box>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
