import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const MotionBox = motion(Box);

const ContactoForm = ({ setSnackbar }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!name.trim()) newErrors.name = true;
        if (!phone.trim()) newErrors.phone = true;
        if (!message.trim()) newErrors.message = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setSnackbar({
                open: true,
                message: "Por favor, completa todos los campos.",
                type: "error"
            });
            return;
        }

        setErrors({});

        emailjs
            .send(
                "service_29hsjvu",
                "template_j4i5shl",
                {
                    nombre: name,
                    telefono: phone,
                    mensaje: message,
                    email: "aguileraignacio1992@gmail.com"
                },
                "Oa-0XdMQ4lgneSOXx"
            )
            .then(() => {
                setSnackbar({
                    open: true,
                    message: "¡Mensaje enviado con éxito! 📬",
                    type: "success"
                });
                setName("");
                setPhone("");
                setMessage("");
            })
            .catch((error) => {
                console.error("Error al enviar el correo:", error);
                setSnackbar({
                    open: true,
                    message: "Ocurrió un error al enviar el mensaje 😥",
                    type: "error"
                });
            });
    };

    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        if (inView) {
            setTimeout(() => {
                setStartAnimation(true);
            }, 1700);
        }
    }, [inView]);

    return (
        <Box>
            <Box
                ref={ref}
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    mt: 0,
                    backgroundColor: "#0D1117",
                    padding: "20px",
                    borderRadius: 5,
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    border: "1px solid #30363D",
                    maxHeight: "100vh",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)"
                    }
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre/Apellido"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => {
                                const input = e.target.value;
                                const soloTexto = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
                                setName(soloTexto);
                            }}
                            error={Boolean(errors.name)}
                            sx={{
                                backgroundColor: "#161B22",
                                borderRadius: 2,
                                input: { color: "#E6EDF3", fontSize: "0.9rem" },
                                label: { color: errors.name ? "#ff4d4f" : "#E6EDF3" },
                                fieldset: {
                                    borderColor: errors.name ? "#ff4d4f" : "#30363D"
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.name ? "#ff4d4f" : "#58A6FF"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.name ? "#ff4d4f" : "#58A6FF"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Teléfono"
                            variant="outlined"
                            fullWidth
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\+?\d*$/.test(value) && value.length <= 12) {
                                    setPhone(value);
                                }
                            }}
                            inputProps={{ maxLength: 12 }}
                            error={Boolean(errors.phone)}
                            sx={{
                                backgroundColor: "#161B22",
                                borderRadius: 2,
                                input: { color: "#E6EDF3", fontSize: "0.9rem" },
                                label: { color: errors.phone ? "#ff4d4f" : "#E6EDF3" },
                                fieldset: {
                                    borderColor: errors.phone ? "#ff4d4f" : "#30363D"
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.phone ? "#ff4d4f" : "#58A6FF"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.phone ? "#ff4d4f" : "#58A6FF"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Mensaje"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            error={Boolean(errors.message)}
                            sx={{
                                backgroundColor: "#161B22",
                                borderRadius: 2,
                                textarea: { color: "#E6EDF3", fontSize: "0.9rem" },
                                label: { color: errors.message ? "#ff4d4f" : "#E6EDF3" },
                                fieldset: {
                                    borderColor: errors.message ? "#ff4d4f" : "#30363D"
                                },
                                "&:hover fieldset": {
                                    borderColor: errors.message ? "#ff4d4f" : "#58A6FF"
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: errors.message ? "#ff4d4f" : "#58A6FF"
                                }
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                fontSize: "1rem",
                                fontWeight: "bold",
                                padding: "10px",
                                borderRadius: 3,
                                textTransform: "none",
                                backgroundColor: "var(--darkreader-background-c4211a, #9d1a15)",
                                color: "#fff",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                "&:hover": {
                                    backgroundColor: "var(--darkreader-background-b62821, #92201a)",
                                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.4)"
                                }
                            }}
                        >
                            Contactar
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 2, px: 1 }}>
                <MotionBox
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={startAnimation ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundImage: `linear-gradient(180deg, #ffe9e9 22.77%, #f6c9c9), linear-gradient(180deg, hsla(0, 100%, 96%, 0) 30%, #f5c8c8 87.1%)`,
                                    backgroundBlendMode: "normal",
                                    backgroundSize: "cover",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 0,
                                    p: 2,
                                    textAlign: "left"
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                    <img
                                        src="soporte-tecnico.png"
                                        alt="Servicio al cliente"
                                        loading="lazy"
                                        style={{
                                            marginLeft: 4,
                                            width: "130px",
                                            marginBottom: "5px",
                                            objectFit: "contain",
                                            borderRadius: 0
                                        }}
                                    />
                                </Box>
                                <Box sx={{ textAlign: "left", alignItems: "flex-start" }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: "0.9rem", mb: 1, color: "#000", marginLeft: 1 }}
                                    >
                                        Ponte en contacto con uno de nuestros ejecutivos para asistirte.
                                    </Typography>
                                    <Button
                                        href="tel:6002000202"
                                        size="small"
                                        variant="text"
                                        sx={{
                                            fontSize: "0.85rem",
                                            fontWeight: "bold",
                                            color: "#e1251b",
                                            textTransform: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                                background: "transparent"
                                            },
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5
                                        }}
                                    >
                                        <SupportAgentIcon sx={{ fontSize: 18 }} />
                                        Contactar ahora
                                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    backgroundImage: `linear-gradient(180deg, hsla(155, 100%, 96%, 0) 30%, #d1f5e4 87.1%), linear-gradient(180deg, #b2f5dc 22.77%, #25d366)`,
                                    backgroundBlendMode: "normal",
                                    backgroundSize: "cover",
                                    borderRadius: "16px",
                                    overflow: "hidden",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: 0,
                                    p: 2,
                                    textAlign: "left"
                                }}
                            >
                                <Box sx={{ width: "auto", display: "flex", justifyContent: "flex-start" }}>
                                    <img
                                        src="whatsapp-logo.png"
                                        alt="WhatsApp"
                                        loading="lazy"
                                        style={{
                                            marginLeft: 4,
                                            width: "130px",
                                            marginBottom: "8px",
                                            objectFit: "contain",
                                            borderRadius: "0"
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: "0.9rem", mb: 1, marginLeft: 1 }}
                                    >
                                        Escríbenos directamente por WhatsApp para resolver tus dudas al instante.
                                    </Typography>
                                    <Button
                                        href="https://api.whatsapp.com/send?phone=56992914526"
                                        target="_blank"
                                        size="small"
                                        variant="text"
                                        sx={{
                                            fontSize: "0.85rem",
                                            fontWeight: "bold",
                                            color: "#128C7E",
                                            textTransform: "none",
                                            "&:hover": {
                                                textDecoration: "underline",
                                                background: "transparent"
                                            },
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5
                                        }}
                                    >
                                        <WhatsAppIcon sx={{ fontSize: 18 }} />
                                        Chatear ahora
                                        <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </MotionBox>
            </Box>
        </Box>
    );
};

export default ContactoForm;
