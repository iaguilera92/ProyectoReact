// src/router.jsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useOutletContext } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
import App from "./App";
import AdminLayout from "./components/configuraciones/AdminLayout";
const Servicios = lazy(() => import("./components/Servicios"));
const Nosotros = lazy(() => import("./components/Nosotros"));
const Contacto = lazy(() => import("./components/Contacto"));
const Administracion = lazy(() => import("./components/Administracion"));
const Catalogo = lazy(() => import("./components/Catalogo"));
const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Mmansoulet = lazy(() => import("./components/Mmansoulet"));
const ConfigurarServicios = lazy(() => import("./components/configuraciones/ConfigurarServicios"));
const ConfigurarTrabajos = lazy(() => import("./components/configuraciones/ConfigurarTrabajos"));
const ConfigurarEnRevision = lazy(() => import("./components/configuraciones/ConfigurarEnRevision"));

const Clientes = lazy(() => import("./components/configuraciones/Clientes"));
const Reserva = lazy(() => import("./components/Reserva"));
const Reservas = lazy(() => import("./components/configuraciones/Reservas"));
const PruebasQAS = lazy(() => import("./components/configuraciones/PruebasQAS"));
const Suscripcion = lazy(() => import("./components/Suscripcion"));
const SuscripcionPayPal = lazy(() => import("./components/SuscripcionPayPal"));
//LEGAL
const Privacy = lazy(() => import("./components/legal/Privacy"));
const Terms = lazy(() => import("./components/legal/Terms"));
const DataDeletion = lazy(() => import("./components/legal/DataDeletion"));

// ✅ HOC para envolver cualquier componente con Suspense
const RouteLoadingFallback = () => (
    <Box
        sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
            background: "linear-gradient(180deg, rgba(6,31,53,0.95), rgba(3,17,30,0.98))",
        }}
    >
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                color: "#fff",
            }}
        >
            <CircularProgress size={34} thickness={4.2} sx={{ color: "#3b82f6" }} />
            <Typography
                sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.92)",
                }}
            >
                Cargando contenido...
            </Typography>
        </Box>
    </Box>
);

const withSuspense = (Component) => (
    <Suspense fallback={<RouteLoadingFallback />}>
        <Component />
    </Suspense>
);

const withSuspenseAdmin = (Component) => (
    <Suspense fallback={<Box sx={{ minHeight: "100vh", bgcolor: "rgba(8,8,12,0.97)" }} />}>
        <Component />
    </Suspense>
);

// ✅ Función para proteger rutas con autenticación
const isAuthenticated = () => {
    const creds = sessionStorage.getItem("credenciales");
    return creds !== null;
};


const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/administracion" replace />;
};


function HomeWrapper() {
    const { informationsRef, setVideoReady } = useOutletContext();
    return (
        <Suspense fallback={<RouteLoadingFallback />}>
            <Home informationsRef={informationsRef} setVideoReady={setVideoReady} />
        </Suspense>
    );
}

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                { path: "", element: <HomeWrapper /> },
                { path: "suscribir", element: <HomeWrapper /> },
                { path: "servicios", element: withSuspense(Servicios) },
                { path: "nosotros", element: withSuspense(Nosotros) },
                { path: "contacto", element: withSuspense(Contacto) },
                { path: "administracion", element: withSuspense(Administracion) },
                { path: "catalogo", element: withSuspense(Catalogo) },
                { path: "mmansoulet", element: withSuspense(Mmansoulet) },
                { path: "reserva", element: withSuspense(Reserva) },
                { path: "suscripcion", element: withSuspense(Suscripcion) },
                { path: "paypal-exito", element: withSuspense(SuscripcionPayPal) },
                { path: "paypal-cancelado", element: withSuspense(SuscripcionPayPal) },
                { path: "privacy", element: withSuspense(Privacy) },
                { path: "terms", element: withSuspense(Terms) },
                { path: "data-deletion", element: withSuspense(DataDeletion) },
                {
                    path: "configurar-servicios",
                    element: (
                        <ProtectedRoute>
                            {withSuspenseAdmin(ConfigurarServicios)}
                        </ProtectedRoute>
                    ),
                },
                // Admin layout compartido — sidebar y navbar persistentes
                {
                    element: (
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    ),
                    children: [
                        { path: "dashboard",              element: withSuspenseAdmin(Dashboard) },
                        { path: "clientes",               element: withSuspenseAdmin(Clientes) },
                        { path: "reservas",               element: withSuspenseAdmin(Reservas) },
                        { path: "configurar-trabajos",    element: withSuspenseAdmin(ConfigurarTrabajos) },
                        { path: "configurar-en-revision", element: withSuspenseAdmin(ConfigurarEnRevision) },
                        { path: "pruebas-qas",            element: withSuspenseAdmin(PruebasQAS) },
                    ],
                },
            ],
        },
    ],
    {
        future: {
            v7_startTransition: true,
        },
    }
);

export default router;
