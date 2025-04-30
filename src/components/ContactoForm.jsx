import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { useInView } from "react-intersection-observer";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


const MotionBox = motion.create(Box);

const ContactoForm = ({ setSnackbar }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [enviarCopia, setEnviarCopia] = useState(false);
    const [emailCopia, setEmailCopia] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true); // 👈 Bloquea

        emailjs
            .send(
                "service_29hsjvu",
                "template_j4i5shl",
                {
                    nombre: name,
                    telefono: phone,
                    mensaje: message,
                    email: "aguileraignacio1992@gmail.com",
                    cc: enviarCopia ? emailCopia : ""
                },
                "Oa-0XdMQ4lgneSOXx"
            )
            .then(() => {
                setSnackbar({
                    open: true,
                    message: "¡Mensaje el correo a Plataformas.web con éxito! 📬",
                    type: "success"
                });
                setName("");
                setPhone("");
                setMessage("");
                setEmailCopia("");
                setIsSubmitting(false); // ✅ Desbloquea
            })
            .catch((error) => {
                console.error("Error al enviar el correo:", error);
                setSnackbar({
                    open: true,
                    message: "Ocurrió un error al enviar el mensaje 😥",
                    type: "error"
                });
                setIsSubmitting(false); // ✅ Desbloquea
            });
    };


    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        if (inView) {
            setTimeout(() => {
                setStartAnimation(true);
            }, 800);
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
                    height: "auto",
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
                                }, opacity: isSubmitting ? 0.6 : 1,
                                pointerEvents: isSubmitting ? "none" : "auto"
                            }}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5
                            }}
                        >
                            <TextField
                                label="Teléfono"
                                variant="outlined"
                                fullWidth
                                disabled={isSubmitting}
                                InputProps={{
                                    style: {
                                        color: "#888", // texto más apagado
                                        cursor: "not-allowed"
                                    }
                                }}
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
                                    opacity: isSubmitting ? 0.6 : 1,
                                    pointerEvents: isSubmitting ? "none" : "auto",
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
                                    },
                                    flex: 1
                                }}
                            />

                            {!enviarCopia ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={enviarCopia}
                                            onChange={(e) => setEnviarCopia(e.target.checked)}
                                            size="small"
                                            sx={{
                                                color: "#58A6FF",
                                                "&.Mui-checked": { color: "#58A6FF" },
                                                p: 0.25
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{ fontSize: "0.7rem", color: "#E6EDF3", whiteSpace: "nowrap" }}>
                                            Copia correo
                                        </Typography>
                                    }
                                    sx={{
                                        ml: 0,
                                        mr: 0,
                                        whiteSpace: "nowrap",
                                        minWidth: "fit-content"
                                    }}
                                />
                            ) : (
                                <TextField
                                    label="Correo electrónico"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    InputProps={{
                                        style: {
                                            color: "#888", // texto más apagado
                                            cursor: "not-allowed"
                                        }
                                    }}
                                    fullWidth={false}
                                    value={emailCopia}
                                    onChange={(e) => setEmailCopia(e.target.value)}
                                    error={Boolean(!emailCopia.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) && emailCopia.length > 0}
                                    sx={{
                                        width: "200px",
                                        backgroundColor: "#161B22",
                                        borderRadius: 2,

                                        input: {
                                            color: "#E6EDF3",
                                            fontSize: "0.9rem",
                                            fontFamily: '"Segoe UI", sans-serif'
                                        },
                                        label: {
                                            color:
                                                !emailCopia.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && emailCopia.length > 0
                                                    ? "#ff4d4f"
                                                    : "#E6EDF3",
                                            fontSize: "0.9rem",
                                            fontFamily: '"Segoe UI", sans-serif'
                                        },
                                        fieldset: {
                                            borderColor:
                                                !emailCopia.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && emailCopia.length > 0
                                                    ? "#ff4d4f"
                                                    : "#30363D"
                                        },
                                        "&:hover fieldset": {
                                            borderColor:
                                                !emailCopia.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && emailCopia.length > 0
                                                    ? "#ff4d4f"
                                                    : "#58A6FF"
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor:
                                                !emailCopia.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && emailCopia.length > 0
                                                    ? "#ff4d4f"
                                                    : "#58A6FF"
                                        }, opacity: isSubmitting ? 0.6 : 1,
                                        pointerEvents: isSubmitting ? "none" : "auto"
                                    }}
                                />

                            )}

                        </Box>
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                            label="Mensaje"
                            variant="outlined"
                            disabled={isSubmitting}
                            InputProps={{
                                style: {
                                    color: "#888", // texto más apagado
                                    cursor: "not-allowed"
                                }
                            }}
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
                                }, opacity: isSubmitting ? 0.6 : 1,
                                pointerEvents: isSubmitting ? "none" : "auto"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            sx={{
                                fontSize: "1rem",
                                fontWeight: "bold",
                                padding: "10px",
                                borderRadius: 3,
                                textTransform: "none",
                                backgroundColor: "var(--darkreader-background-c4211a, #9d1a15)",
                                color: "#fff",
                                opacity: isSubmitting ? 0.6 : 1,
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                "&:hover": {
                                    backgroundColor: "var(--darkreader-background-b62821, #92201a)",
                                    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.4)"
                                }
                            }}
                        >
                            {isSubmitting ? "Enviando..." : "Contactar"}
                        </Button>

                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 2, px: 1 }}>
                <MotionBox
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

                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {/* Imagen */}
                                    <img
                                        src="soporte-tecnico-1.png"
                                        alt="Servicio al cliente"
                                        loading="lazy"
                                        style={{
                                            marginLeft: 4,
                                            width: "30px",
                                            objectFit: "contain",
                                            borderRadius: 0,
                                            alignSelf: "center", // 👈 Asegura que se centre como el texto
                                        }}
                                    />

                                    {/* Texto al lado */}
                                    <Typography
                                        sx={{
                                            fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
                                            fontWeight: 700,
                                            fontSize: { xs: "1.1rem", sm: "1.1rem", md: "1.2rem" },
                                            color: "#1f4f4f",
                                            textShadow: "0px 0px 2px rgba(0,0,0,0.3)",
                                            letterSpacing: "1px",
                                            ml: 0.5,
                                            lineHeight: 1.2, // 👈 Ajusta el centro del texto para que no se despegue
                                        }}
                                    >
                                        Soporte técnico
                                    </Typography>
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
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    {/* Imagen */}
                                    <img
                                        src="whatsapp-logo-icon.webp"
                                        alt="whatsapp"
                                        loading="lazy"
                                        style={{
                                            marginLeft: 4,
                                            width: "30px",
                                            objectFit: "contain",
                                            borderRadius: 0,
                                            alignSelf: "center", // 👈 Asegura que se centre como el texto
                                        }}
                                    />

                                    {/* Texto al lado */}
                                    <Typography
                                        sx={{
                                            fontFamily: "'Poppins', 'Roboto', 'Segoe UI', sans-serif",
                                            fontWeight: 700,
                                            fontSize: { xs: "1.1rem", sm: "1.1rem", md: "1.2rem" },
                                            color: "#1f4f4f",
                                            textShadow: "0px 0px 2px rgba(0,0,0,0.3)",
                                            letterSpacing: "1px",
                                            ml: 0.5,
                                            lineHeight: 1.2, // 👈 Ajusta el centro del texto para que no se despegue
                                        }}
                                    >
                                        WhatsApp
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: "0.9rem", mb: 1, marginLeft: 1 }}
                                    >
                                        Escríbenos directamente por WhatsApp para resolver tus dudas.
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
