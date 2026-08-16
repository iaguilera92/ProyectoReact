import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { CssBaseline, Box, IconButton, useMediaQuery, Snackbar, Alert, Dialog, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import theme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import "@fontsource/poppins";
const Areas = lazy(() => import("./components/Areas"));
const Informations = lazy(() => import("./components/Informations"));
const Contacto = lazy(() => import("./components/Contacto"));
const Evidencias = lazy(() => import("./components/Evidencias"));
const Evidencias2 = lazy(() => import("./components/Evidencias2"));
const Footer = lazy(() => import("./components/Footer"));
const Navbar = lazy(() => import("./components/Navbar"));
const MusicaApp = lazy(() => import("./components/MusicaApp"));
import { ArrowUpward as ArrowUpwardIcon } from "@mui/icons-material";
import { useLocation, Outlet } from "react-router-dom";
import Cargando from './components/Cargando';
import { AnimatePresence, motion } from 'framer-motion';
import "./components/css/App.css";
import { initGoogleAnalytics, trackPageView } from "./helpers/HelperAnalytics.js"; //GOOGLE ANALYTICS
import { supabase } from "./supabase/client";
import { obtenerConCuposDesdeSeguridad } from "./helpers/HelperSeguridad.js";
import DialogTrabajoEnRevision from "./components/DialogTrabajoEnRevision";
import { useSearchParams, useNavigate } from "react-router-dom";
import Chat from "./components/PWBot/Chat";
import DevTools from "./components/configuraciones/DevTools";

function App() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [showContacto, setShowContacto] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const [openBubble, setOpenBubble] = useState(false);
  const contactoRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const informationsRef = useRef(null);
  const location = useLocation();
  const [videoReady, setVideoReady] = useState(false);
  const [showApp, setShowApp] = useState(false);
  const [snackbarVersion, setSnackbarVersion] = useState({ open: false, version: "", });
  const [shouldAnimateInformations, setShouldAnimateInformations] = useState(false);
  const triggerInformations = (value) => setShouldAnimateInformations(value);
  const [hasSeenInformations, setHasSeenInformations] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openRevision, setOpenRevision] = useState(false);
  const [revisionId, setRevisionId] = useState(null);
  const [openChat, setOpenChat] = useState(false);
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const isMmansouletRoute = location.pathname === "/mmansoulet";
  const ADMIN_ROUTES = ["/configurar-trabajos", "/dashboard", "/clientes", "/reservas", "/configurar-servicios", "/configurar-en-revision", "/pruebas-qas"];
  const isAdminRoute = ADMIN_ROUTES.includes(location.pathname);

  //EFECTO CAMBIAR DE RUTA
  useEffect(() => {
    setIsFading(true);
    const timer = setTimeout(() => setIsFading(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  //GOOGLE ANALYTICS
  useEffect(() => {
    initGoogleAnalytics(); // solo una vez
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search); // en cada cambio de ruta
  }, [location]);

  useEffect(() => {
    const syncConCupos = async () => {
      try {
        const conCupos = await obtenerConCuposDesdeSeguridad();
        localStorage.setItem("ConCupos", String(conCupos));
        window.dispatchEvent(new Event("conCuposChanged"));
      } catch (error) {
        console.warn("No se pudo cargar ConCupos desde Seguridad.xlsx:", error);
      }
    };

    syncConCupos();
  }, []);

  // Warm-up Chat API + preconnect para reducir latencia inicial
  useEffect(() => {
    let apiOrigin = null;
    try {
      apiOrigin = new URL(API_URL, window.location.href).origin;
    } catch (_) {
      apiOrigin = null;
    }

    if (apiOrigin) {
      const existing = document.querySelector(
        `link[rel="preconnect"][href="${apiOrigin}"]`
      );
      if (!existing) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = apiOrigin;
        link.crossOrigin = "";
        document.head.appendChild(link);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const warmupSessionId =
      (globalThis.crypto?.randomUUID && globalThis.crypto.randomUUID()) ||
      `pwbot_warmup_${Date.now()}`;

    fetch(`${API_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: warmupSessionId,
        messages: [],
        desdeSitioWeb: true,
      }),
      cache: "no-store",
      keepalive: true,
      signal: controller.signal,
    }).catch(() => { });

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const areasSection = document.getElementById("areas-section");
      if (areasSection) {
        const rect = areasSection.getBoundingClientRect();
        setShowContacto(rect.top < window.innerHeight * 0.5);
      }
      setShowArrow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //ABRIR DIALOGO WSP
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenBubble(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  //CERRAR DIALOGO WSP
  useEffect(() => {
    if (openBubble) {
      const timer = setTimeout(() => {
        setOpenBubble(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [openBubble]);

  //location.pathname
  useEffect(() => {
    if (location.pathname === "/") {
      // Ejecutar lógica cuando se vuelva a la ruta de inicio
    }
  }, [location.pathname]);

  // ⏳ CARGANDO
  useEffect(() => {

    if (["/dashboard", "/administracion"].includes(location.pathname)) {
      setShowApp(true);
      return;
    }

    const requiereVideo = ["/", "/inicio", ""].includes(location.pathname);

    const minTimeout = setTimeout(() => {
      if (!requiereVideo || videoReady) {
        setShowApp(true);
      }
    }, 1500); // mínimo visible

    const maxTimeout = setTimeout(() => {
      setShowApp(true); // fuerza mostrar app
    }, 3600); // máximo espera

    return () => {
      clearTimeout(minTimeout);
      clearTimeout(maxTimeout);
    };
  }, [videoReady, location.pathname]);

  //LIBERAR CARGANDO
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (!showApp) {
      body.classList.add('no-scroll');
      html.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
      html.classList.remove('no-scroll');
    }

    return () => {
      body.classList.remove('no-scroll');
      html.classList.remove('no-scroll');
    };
  }, [showApp]);


  //LIMPIAR CACHE
  useEffect(() => {
    const checkVersionAndClearCache = async () => {
      try {
        const response = await fetch("/version.json", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-store",
            "Pragma": "no-cache"
          }
        });

        const data = await response.json();
        const storedVersion = localStorage.getItem("app_version");
        const currentVersion = data.version;

        if (!storedVersion) {
          localStorage.setItem("app_version", currentVersion);
          return;
        }

        if (storedVersion !== currentVersion) {
          console.log("🆕 Nueva versión detectada. Limpiando caché...");
          console.log("🗂️ Versión anterior:", storedVersion);
          console.log("📄 Versión nueva:", currentVersion);

          setSnackbarVersion({ open: true, version: currentVersion }); // tu Snackbar, si usas uno

          setTimeout(async () => {
            // 🧹 Eliminar todas las caches
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log("✅ Caches eliminadas:", cacheNames);

            // 🧹 Eliminar todos los Service Workers
            if ("serviceWorker" in navigator) {
              const registrations = await navigator.serviceWorker.getRegistrations();
              for (const registration of registrations) {
                await registration.unregister();
                console.log("🧹 Service Worker eliminado");
              }
            }

            // 💾 Actualizar versión guardada
            localStorage.setItem("app_version", currentVersion);

            // 🔁 Recarga completa desde el servidor (no solo pathname)
            window.location.reload(true); // o usa window.location.href = "/"
          }, 1500);
        } else {
          console.log("✅ App actualizada. Versión:", currentVersion);
        }
      } catch (err) {
        console.warn("⚠️ No se pudo verificar la versión:", err);
      }
    };

    checkVersionAndClearCache();
  }, []);

  //TRABAJOS EN REVISIÓN
  useEffect(() => {
    const workInProgress = searchParams.get("workInProgress");

    if (workInProgress) {
      setRevisionId(workInProgress);
      setOpenRevision(true);
    }
  }, [searchParams]);

  const handleCloseRevision = () => {
    setOpenRevision(false);
    navigate(location.pathname, { replace: true });
  };

  const requestCloseChat = () => setConfirmCloseOpen(true);
  const forceCloseChat = () => {
    setConfirmCloseOpen(false);
    setOpenChat(false);
  };
  const handleConfirmCloseChat = () => {
    setConfirmCloseOpen(false);
    setOpenChat(false);
  };
  const handleCancelCloseChat = () => setConfirmCloseOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isAdminRoute && location.pathname !== "/administracion" && !isMmansouletRoute && (
        <MusicaApp src="/musica-app.mp3" volume={0.25} btnSize={33} />
      )}
      {/* Pantalla de carga */}
      <AnimatePresence>
        {!showApp && location.pathname !== "/dashboard" && location.pathname !== "/administracion" && location.pathname !== "/configurar-servicios" && (
          <>
            <motion.div key="cargando" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, }}>
              <Cargando />
            </motion.div>

            {/* Snackbar como overlay global */}
            <Snackbar open={snackbarVersion.open} autoHideDuration={1400} anchorOrigin={{ vertical: "top", horizontal: "center" }} sx={{ zIndex: 20000 }}>
              <Alert
                severity="info"
                icon={false}
                sx={{
                  width: "100%",
                  fontSize: "0.9rem",
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // ✅ centra horizontalmente el contenido
                  justifyContent: "center",
                  textAlign: "center",  // ✅ centra el texto
                }}
              >
                <Box>
                  ✅ Nueva versión disponible: {snackbarVersion.version}
                  <br />
                  🔄 Actualizando...
                </Box>
              </Alert>
            </Snackbar>

          </>
        )}
      </AnimatePresence>

      {/* Contenido principal, oculto mientras se carga */}
      <Box
        sx={{
          visibility: showApp ? "visible" : "hidden",
          pointerEvents: showApp ? "auto" : "none",
          overflowX: 'hidden',
        }}
      >
        {/* Navbar solo si no estás en /administracion */}
        {!isAdminRoute && location.pathname !== "/administracion" && !isMmansouletRoute && (
          <Suspense fallback={null}>
            <Navbar contactoRef={contactoRef} informationsRef={informationsRef} videoReady={videoReady} />
          </Suspense>
        )}

        {/* 🧭 Transición entre rutas */}
        <Box sx={{ position: "relative" }}>
          <Outlet context={{ showApp, informationsRef, triggerInformations, setHasSeenInformations }} />

          {isFading && !isAdminRoute && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "#061F35",
                zIndex: 2000,
              }}
            />
          )}
        </Box>


        {/* Secciones visibles solo en la página de inicio */}
        {["/", ""].includes(location.pathname) && (
          <>
            <Suspense fallback={null}>
              <Box id="areas-section">
                <Areas />
              </Box>
            </Suspense>

            <Suspense fallback={null}>
              {isMobile ? <Evidencias /> : <Evidencias2 />}
            </Suspense>

            <Suspense fallback={null}>
              <Box ref={contactoRef}>
                <Contacto />
              </Box>
            </Suspense>

          </>
        )}

        {/* Footer (excepto en administración) */}
        {!isAdminRoute && location.pathname !== "/administracion" && !isMmansouletRoute && <Footer />}

        {/* Botón WhatsApp */}
        {!isAdminRoute && location.pathname !== "/administracion" && !isMmansouletRoute && (
          <Box sx={{ position: "fixed", bottom: "75px", right: "15px", zIndex: 100, transition: "bottom 0.3s ease", }}>
            <IconButton
              className="pwbot-pulse"
              onClick={() => setOpenChat(true)}
              sx={{
                width: 65,
                height: 65,
                borderRadius: "50%",
                background: "linear-gradient(145deg, #25D366, #1ebe5d)",
                border: "4px solid #ffffff",
                position: "fixed",
                bottom: 10,
                right: 15,
                cursor: "pointer",
                zIndex: 101,
                transform: openChat ? "scale(0.75)" : "scale(1)",
                opacity: openChat ? 0 : 1,
                pointerEvents: openChat ? "none" : "auto",
                transition: "transform 0.2s ease, opacity 0.2s ease",
                "&:active": {
                  transform: "scale(0.9)",
                }
              }}
            >
              <Box
                component="img"
                src="/PWBot.png"
                alt="PWBot"
                sx={{
                  width: 50,
                  height: 50,
                  objectFit: "contain",
                  zIndex: 2,
                  position: "relative",
                }}
              />
            </IconButton>
            {/* Burbuja de mensaje */}
            {openBubble && (
              <Box
                onClick={() => setOpenChat(true)}
                sx={{
                  position: "fixed",
                  bottom: 83,
                  right: 20,
                  background: "linear-gradient(145deg, #ffffff, #f3f3f3)",
                  color: "#061F35",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  borderRadius: "25px",
                  padding: "10px 18px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  zIndex: 100,
                  cursor: "pointer",
                  opacity: openBubble ? 1 : 0,
                  transform: openBubble ? "translateX(0)" : "translateX(100%)",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateX(0) scale(1.05)",
                    boxShadow: "0 10px 25px rgba(18, 194, 162, 0.4)",
                  },
                }}
              >
                Hablemos de tu proyecto 🤖
              </Box>
            )}
          </Box>
        )}

        {/* Botón scroll arriba */}
        {showArrow && (
          <IconButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              position: "fixed",
              bottom: "85px",
              right: "15px",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "50%",
              padding: "10px",
              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.2)",
              zIndex: 101,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "#000",
                color: "#fff",
              },
            }}
          >
            <ArrowUpwardIcon sx={{ fontSize: 30 }} />
          </IconButton>
        )}
      </Box>
      <DialogTrabajoEnRevision
        open={openRevision}
        onClose={handleCloseRevision}
        revisionId={revisionId}
      />
      <AnimatePresence>
        {openChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.94)",
                zIndex: 1500,
              }}
              onClick={requestCloseChat}
            />

            {/* Chat */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                position: "fixed",
                bottom: 0,
                right: isMobile ? "5%" : 20,
                width: isMobile ? "90%" : "600px",
                height: isMobile ? "85vh" : "600px",
                zIndex: 2000,
              }}
            >
              <Chat onClose={requestCloseChat} onForceClose={forceCloseChat} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Dialog
        open={confirmCloseOpen}
        maxWidth="xs"
        fullWidth
        onClose={(e, reason) => {
          if (reason === "escapeKeyDown") return;
          handleCancelCloseChat();
        }}
        disableEscapeKeyDown
        sx={{ zIndex: 3000 }}
        PaperProps={{
          sx: {
            animation: "dialogEnter .35s ease-out",
            "@keyframes dialogEnter": {
              "0%": { opacity: 0, transform: "scale(0.92) translateY(10px)" },
              "100%": { opacity: 1, transform: "scale(1) translateY(0)" },
            },
            background: "linear-gradient(180deg, #111827, #0b1220)",
            borderRadius: 4,
            color: "#e5e7eb",
            boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            pt: 4,
            pb: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            background:
              "radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 70%)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1f2937, #020617)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow:
                "0 0 0 6px rgba(37,99,235,0.15), 0 0 25px rgba(59,130,246,0.45)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-2px",
                borderRadius: "50%",
                padding: "2px",
                background:
                  "linear-gradient(120deg, transparent 20%, #60a5fa 35%, #2563eb 50%, #60a5fa 65%, transparent 80%)",
                backgroundSize: "300% 300%",
                animation: "borderFlow 4s linear infinite",
                mask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
              },
              "@keyframes borderFlow": {
                "0%": { backgroundPosition: "0% 50%" },
                "100%": { backgroundPosition: "300% 50%" },
              },
            }}
          >
            <Box
              component="img"
              src="/PWBot.png"
              alt="PWBot"
              sx={{
                width: 90,
                height: 90,
                objectFit: "contain",
                filter: "drop-shadow(0 0 6px rgba(147,197,253,0.85))",
              }}
            />
          </Box>

          <Box sx={{ height: 8 }} />
        </Box>

        <DialogContent
          sx={{
            textAlign: "center",
            px: 3,
            pt: 1,
            pb: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: "#e5e7eb",
              lineHeight: 1.4,
            }}
          >
            ¿Salir ahora? La conversación se perderá.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pb: 3,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            onClick={handleConfirmCloseChat}
            sx={{
              px: 3,
              py: 1.4,
              fontSize: 16,
              textTransform: "none",
              color: "#9ca3af",
              minWidth: 110,
              "&:hover": {
                color: "#e5e7eb",
              },
            }}
          >
            Salir
          </Button>

          <Button
            variant="contained"
            onClick={handleCancelCloseChat}
            sx={{
              px: 6,
              py: 1.2,
              position: "relative",
              overflow: "hidden",
              textTransform: "none",
              fontWeight: 600,
              fontSize: 15,
              color: "#ffffff",
              background:
                "linear-gradient(135deg, #2563eb, #3b82f6 45%, #60a5fa 85%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 8s ease infinite",
              boxShadow: "0 4px 14px rgba(59,130,246,.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#1d4ed8,#2563eb,#3b82f6)",
                boxShadow:
                  "0 0 8px rgba(59,130,246,.7), inset 0 0 6px rgba(255,255,255,0.25)",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-1px",
                borderRadius: "inherit",
                background:
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 12%, #93c5fd 22%, rgba(255,255,255,0.9) 32%, transparent 44%)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "300% 300%",
                animation: "shineBorderSweep 3.2s linear infinite",
                pointerEvents: "none",
                zIndex: 2,
                mask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                maskComposite: "exclude",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(130deg, transparent 42%, rgba(255,255,255,0.85) 50%, transparent 58%)",
                transform: "translateX(-120%)",
                animation: "shineDiagonal 4s ease-in-out infinite",
                borderRadius: "inherit",
                pointerEvents: "none",
                zIndex: 1,
              },
              "&:hover::after": {
                animation: "shineDiagonal 1.2s ease-in-out",
              },
              "@keyframes shineBorderSweep": {
                "0%": { backgroundPosition: "-300% 0" },
                "100%": { backgroundPosition: "300% 0" },
              },
              "@keyframes shineDiagonal": {
                "0%": { transform: "translateX(-120%)" },
                "100%": { transform: "translateX(120%)" },
              },
              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            Seguir
          </Button>
        </DialogActions>
      </Dialog>
      {isAdminRoute && (
        <DevTools
          label={location.pathname.replace("/", "")}
          checks={[
            { label: "Sesión", status: sessionStorage.getItem("usuario") ? "ok" : "warn", detail: (() => { try { return JSON.parse(sessionStorage.getItem("usuario") || "{}").nombre || "—"; } catch { return "—"; } })() },
            { label: "Supabase", status: "ok", detail: "conectado" },
            { label: "Ambiente", status: "ok", detail: "QAS" },
          ]}
        />
      )}
    </ThemeProvider >
  );
}

export default App;
