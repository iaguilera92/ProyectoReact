import { Box, Paper, Typography, Dialog, DialogContent, DialogActions, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTenant } from "./TenantContext";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import { useState, useEffect } from "react";

export default function Chat({ onClose, onForceClose }) {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const tenant = useTenant();
    const [welcomeOpen, setWelcomeOpen] = useState(true);
    const [spin, setSpin] = useState(false);
    const [starting, setStarting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [lead, setLead] = useState({
        offer: null,
        email: null,
        business: null,
        sent: false,
    });
    const [phase, setPhase] = useState("OFFER_SELECTION");
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: tenant.welcomeMessage,
            timestamp: new Date(),
            quickReplies: [
                { label: "Ver Ofertas", value: "Si, quiero ver las ofertas", variant: "blue" },
                { label: "Soy cliente", value: "Soy cliente", variant: "orange", icon: "💎" },
                {
                    label: "Hablar con Ejecutivo",
                    value: "Chat con ejecutivo",
                    variant: "whatsapp",
                    icon: "/whatsapp-logo-icon.webp",
                },
            ],
        },
    ]);
    const offerQuickReplies = [
        { label: "Oferta 1", value: "Oferta 1" },
        { label: "Oferta 2", value: "Oferta 2" },
    ];
    const executiveQuickReplies = [
        {
            label: "Chat con ejecutivo",
            value: "Chat con ejecutivo",
            variant: "whatsapp",
            icon: "/whatsapp-logo-icon.webp",
        },
        {
            label: "Suscribirse",
            value: "Suscribirse",
            variant: "gold",
            icon: "💎",
        },
        {
            label: "🚀 Solicitar nuevo proyecto",
            value: "Solicitar nuevo proyecto",
            variant: "purple",
        },
        {
            label: "🐞 Reportar Bug",
            value: "Reportar Bug",
            variant: "gray",
            disabled: true,
        },
        {
            label: "🧾 Tickets",
            value: "Tickets",
            variant: "gray",
            disabled: true,
        },
    ];
    const confirmQuickReplies = [
        { label: "Confirmo!", value: "Confirmo" },
    ];
    const trackingQuickReplies = [
        { label: "Ver Seguimiento", value: "Ver Seguimiento", variant: "gold" },
    ];
    const [sessionId] = useState(() => {
        const key = "pwbot_session_id";
        try {
            const existing = localStorage.getItem(key);
            if (existing) return existing;
            const newId =
                (crypto?.randomUUID && crypto.randomUUID()) ||
                `pwbot_${Date.now()}_${Math.random().toString(36).slice(2)}`;
            localStorage.setItem(key, newId);
            return newId;
        } catch {
            return `pwbot_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        }
    });

    const handleSend = async (text) => {
        const textRaw = (text || "").trim();
        const textLower = textRaw.toLowerCase();
        const textClean = textLower.replace(/[^\w\sáéíóúñ]/gi, "").trim();
        const normalized = textClean.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const isAffirmative = /\b(si|ok|dale|claro|perfecto|bueno|de acuerdo|vamos|por supuesto|obvio|vale|listo)\b/.test(normalized);
        const isNegative = /\b(no|no gracias|prefiero no|mejor no|ninguna|ninguno|ninguna de las dos|paso|nop|no quiero|no me interesa|no me gusto|no me gustó)\b/.test(normalized);
        const isOffer1 = /\b1\b/.test(normalized) || /oferta\s*1/.test(normalized);
        const isOffer2 = /\b2\b/.test(normalized) || /oferta\s*2/.test(normalized);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(textRaw);

        let nextPhase = phase;
        if (phase === "OFFER_INTRO" && isAffirmative) nextPhase = "OFFER_SELECTION";
        if (phase === "OFFER_SELECTION" && (isOffer1 || isOffer2)) nextPhase = "OFFER_CONFIRMATION";
        if (phase === "OFFER_CONFIRMATION" && isAffirmative) nextPhase = "LEAD_EMAIL_CAPTURE";
        if (phase === "LEAD_EMAIL_CAPTURE" && isValidEmail) nextPhase = "LEAD_BUSINESS_CAPTURE";
        if (phase === "LEAD_BUSINESS_CAPTURE" && textRaw.length >= 2) nextPhase = "LEAD_COMPLETED";
        if (isNegative && phase === "OFFER_CONFIRMATION") nextPhase = "OFFER_SELECTION";
        setPhase(nextPhase);

        const userMessage = {
            from: "user",
            text,
            timestamp: new Date(),
        };

        // 🧠 Detectar selección de oferta
        if (/oferta\s*1|la\s*1|opción\s*1/i.test(text)) {
            setLead((prev) => ({
                ...prev,
                offer: "Oferta 1 - Pago único",
            }));
        }

        if (/oferta\s*2|la\s*2|opción\s*2/i.test(text)) {
            setLead((prev) => ({
                ...prev,
                offer: "Oferta 2 - Suscripción mensual",
            }));
        }

        // 📧 Detectar correo
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
            setLead((prev) => ({
                ...prev,
                email: text,
            }));
        }

        // 🏷️ Detectar nombre del negocio (solo después del correo)
        if (
            lead.email &&
            !lead.business &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
        ) {
            setLead((prev) => ({
                ...prev,
                business: text,
            }));
        }

        // 🔑 Construir historial (ocultar quick replies anteriores)
        const clearedMessages = messages.map((m) =>
            Array.isArray(m.quickReplies) && m.quickReplies.length
                ? { ...m, quickReplies: [], quickRepliesDisabled: true }
                : m
        );
        const updatedMessages = [...clearedMessages, userMessage];

        // UI inmediata
        setMessages(updatedMessages);
        setIsTyping(true);

        try {
            const res = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sessionId,
                    messages: updatedMessages,
                    desdeSitioWeb: true,
                    phase: nextPhase,
                    conCupos: localStorage.getItem("ConCupos") === "true",
                }),
            });

            const data = await res.json();
            const replies = Array.isArray(data.replies)
                ? data.replies
                : [];
            const phaseFromApi = data?.phase;
            if (phaseFromApi) {
                console.log("PHASE (API):", phaseFromApi);
                setPhase(phaseFromApi);
            }

            setIsTyping(false);

            setMessages((prev) => {
                const newMessages = [...prev];

                replies.forEach((r, idx) => {
                    const botText = r.text || "";
                    const lowerText = botText.toLowerCase();
                    const shouldAttachConfirm =
                        phaseFromApi === "OFFER_CONFIRMATION" && idx === replies.length - 1;
                    const shouldAttachOffers =
                        phaseFromApi === "OFFER_SELECTION" && idx === replies.length - 1;
                    const shouldAttachTracking =
                        phaseFromApi === "LEAD_COMPLETED" && idx === replies.length - 1;

                    // 1️⃣ Mensaje normal del bot
                    newMessages.push({
                        from: "bot",
                        text: botText,
                        image: r.image,
                        video: r.video,
                        timestamp: new Date(),
                        ...(shouldAttachTracking
                            ? { quickReplies: trackingQuickReplies }
                            : shouldAttachOffers
                                ? { quickReplies: offerQuickReplies }
                            : shouldAttachConfirm
                                ? { quickReplies: confirmQuickReplies }
                                : {}),
                    });

                    // 2️⃣ Trigger James (video)
                    if (lowerText.includes("james es el perrito")) {
                        newMessages.push({
                            from: "bot",
                            video: "/james.mp4",
                            timestamp: new Date(),
                        });
                    }

                    // 3️⃣ Trigger Maivelyn Sanchez (imagen)
                    if (lowerText.includes("maivelyn sanchez")) {
                        newMessages.push({
                            from: "bot",
                            image: "/fondo_adm.jpeg", // debe estar en /public
                            timestamp: new Date(),
                        });
                    }
                });

                return newMessages;
            });

        } catch (e) {
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text: "⚠️ Error al contactar la IA",
                    timestamp: new Date(),
                },
            ]);
        }
    };

    const handleQuickReply = (value) => {
        if (value === "Chat con ejecutivo") {
            const mensaje = "¡Hola! Me gustaría hablar con un ejecutivo 😊";
            const url = `https://api.whatsapp.com/send?phone=56946873014&text=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank", "noopener,noreferrer");
            setMessages((prev) => {
                const next = [...prev];
                for (let i = next.length - 1; i >= 0; i--) {
                    if (next[i].from === "bot" && Array.isArray(next[i].quickReplies) && next[i].quickReplies.length) {
                        next[i] = { ...next[i], quickReplies: [], quickRepliesDisabled: true };
                        break;
                    }
                }
                return next;
            });
            onForceClose?.();
            return;
        }
        if (value === "Soy cliente") {
            const clientGreeting = "Bienvenid@! siempre a tu servicio 24/7👨‍💻";
            setMessages([
                { from: "bot", text: clientGreeting, timestamp: new Date(), quickReplies: executiveQuickReplies, animateText: true, quickRepliesCascade: true },
            ]);
            setPhase("EXISTING_CLIENT");
            return;
        }
        if (value === "Ver Seguimiento") {
            const lastBotWithLink = [...messages]
                .reverse()
                .find((m) => m.from === "bot" && typeof m.text === "string" && m.text.includes("http"));
            const urlMatch = lastBotWithLink?.text?.match(/https?:\/\/[^\s]+/i);
            const url = urlMatch?.[0] || "https://www.plataformas-web.cl/";
            window.open(url, "_blank", "noopener,noreferrer");
            setMessages((prev) => {
                const next = [...prev];
                for (let i = next.length - 1; i >= 0; i--) {
                    if (next[i].from === "bot" && Array.isArray(next[i].quickReplies) && next[i].quickReplies.length) {
                        next[i] = { ...next[i], quickReplies: [], quickRepliesDisabled: true };
                        break;
                    }
                }
                return next;
            });
            return;
        }
        if (value === "Solicitar nuevo proyecto") {
            const mensaje = "¡Hola! Quiero solicitar un nuevo proyecto con Plataformas Web 🚀";
            const url = `https://api.whatsapp.com/send?phone=56946873014&text=${encodeURIComponent(mensaje)}`;
            window.open(url, "_blank", "noopener,noreferrer");
            setMessages((prev) => {
                const next = [...prev];
                for (let i = next.length - 1; i >= 0; i--) {
                    if (next[i].from === "bot" && Array.isArray(next[i].quickReplies) && next[i].quickReplies.length) {
                        next[i] = { ...next[i], quickReplies: [], quickRepliesDisabled: true };
                        break;
                    }
                }
                return next;
            });
            onForceClose?.();
            return;
        }
        if (value === "Suscribirse") {
            window.dispatchEvent(
                new CustomEvent("openOneClickMall", {
                    detail: {
                        nombre: "Ignacio Aguilera",
                        correo: "plataformas.web.cl@gmail.com",
                    },
                })
            );
            onForceClose?.();
            return;
        }
        setMessages((prev) => {
            const next = [...prev];
            for (let i = next.length - 1; i >= 0; i--) {
                if (next[i].from === "bot" && Array.isArray(next[i].quickReplies) && next[i].quickReplies.length) {
                    next[i] = { ...next[i], quickReplies: [], quickRepliesDisabled: true };
                    break;
                }
            }
            return next;
        });
        handleSend(value);
    };

    useEffect(() => {
        const handleClose = () => setOpenChat(false);
        window.addEventListener("closeChat", handleClose);
        return () => window.removeEventListener("closeChat", handleClose);
    }, []);

    useEffect(() => {
        setSpin(true);
    }, []);

    return (
        <Box
            sx={{
                width: "100%",
                flex: 1,
                minHeight: 0,
                display: "flex",
                justifyContent: "center",
                overflow: "hidden",
                backgroundColor: "transparent",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", md: 600 },
                    height: { xs: "75vh", md: 600 },
                    maxHeight: { xs: "75vh", md: 600 },
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: { xs: "20px", md: "12px" },
                }}
            >
                {/* Header del chat */}
                <Box
                    sx={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1.5,
                        color: "white",
                        background:
                            "linear-gradient(270deg, #0f3c4c, #1b6f8a, #0f3c4c)",
                        backgroundSize: "400% 400%",
                        animation: "headerFlow 8s ease infinite",
                        position: "relative",

                        "@keyframes headerFlow": {
                            "0%": { backgroundPosition: "0% 50%" },
                            "50%": { backgroundPosition: "100% 50%" },
                            "100%": { backgroundPosition: "0% 50%" },
                        },
                    }}
                >
                    {/* Avatar con pulso */}
                    <Box
                        sx={{
                            position: "relative",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            flexShrink: 0,

                            /* Pulso visible */
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                inset: "-4px",
                                borderRadius: "50%",
                                background: "rgba(255,255,255,0.35)",
                                animation: "pulse 2s infinite",
                            },

                            "@keyframes pulse": {
                                "0%": {
                                    transform: "scale(1)",
                                    opacity: 0.6,
                                },
                                "70%": {
                                    transform: "scale(1.6)",
                                    opacity: 0,
                                },
                                "100%": {
                                    opacity: 0,
                                },
                            },
                        }}
                    >
                        {/* Imagen */}
                        <Box
                            component="img"
                            src="/plataformas-web-img.jpeg"
                            alt="Plataformas Web"
                            sx={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid white",
                                position: "relative",
                                zIndex: 1,
                            }}
                        />

                        {/* Badge online */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: -1,
                                right: -1,
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: "#22c55e",
                                border: "2px solid #075e54",
                                boxShadow: "0 0 8px rgba(34,197,94,0.9)",
                                zIndex: 2,
                            }}
                        />
                    </Box>

                    {/* Nombre */}
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                            letterSpacing: 0.4,
                            textShadow: "0 0 6px rgba(255,255,255,0.6)",
                        }}
                    >
                        {tenant.name}
                    </Typography>
                    {/* Botón cerrar */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: "#fff",
                            ml: "auto",
                            backgroundColor: "rgba(255,255,255,0.15)",
                            animation: spin ? "spinTwice 0.6s ease-in-out" : "none",

                            "@keyframes spinTwice": {
                                "0%": { transform: "rotate(0deg)" },
                                "100%": { transform: "rotate(720deg)" }, // 2 vueltas
                            },

                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.25)",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <ChatContainer messages={messages} isTyping={isTyping} onQuickReply={handleQuickReply} />

                <ChatInput onSend={handleSend} />
            </Paper>
        </Box>

    );

}
