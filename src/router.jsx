// src/router.jsx
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useOutletContext } from "react-router-dom";
import App from "./App";
const Servicios = lazy(() => import("./components/Servicios"));
const Nosotros = lazy(() => import("./components/Nosotros"));
const Contacto = lazy(() => import("./components/Contacto"));
const Administracion = lazy(() => import("./components/Administracion"));
const Catalogo = lazy(() => import("./components/Catalogo"));
const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const ConfigurarServicios = lazy(() => import("./components/configuraciones/ConfigurarServicios"));
const ConfigurarTrabajos = lazy(() => import("./components/configuraciones/ConfigurarTrabajos"));
const Clientes = lazy(() => import("./components/configuraciones/Clientes"));
const Reserva = lazy(() => import("./components/Reserva"));
const Reservas = lazy(() => import("./components/configuraciones/Reservas"));
const Suscripcion = lazy(() => import("./components/Suscripcion"));

// ✅ HOC para envolver cualquier componente con Suspense
const withSuspense = (Component) => (
    <Suspense fallback={null}>
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
        <Suspense fallback={null}>
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
                { path: "dashboard", element: withSuspense(Dashboard) },
                { path: "reserva", element: withSuspense(Reserva) },
                { path: "suscripcion", element: withSuspense(Suscripcion) },
                {
                    path: "configurar-servicios",
                    element: (
                        <ProtectedRoute>
                            {withSuspense(ConfigurarServicios)}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "configurar-trabajos",
                    element: (
                        <ProtectedRoute>
                            {withSuspense(ConfigurarTrabajos)}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "clientes",
                    element: (
                        <ProtectedRoute>
                            {withSuspense(Clientes)}
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "reservas",
                    element: (
                        <ProtectedRoute>
                            {withSuspense(Reservas)}
                        </ProtectedRoute>
                    ),
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