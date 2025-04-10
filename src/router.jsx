// src/router.jsx
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
const Servicios = lazy(() => import("./components/Servicios"));
const Nosotros = lazy(() => import("./components/Nosotros"));
const Contacto = lazy(() => import("./components/Contacto"));
const Administracion = lazy(() => import("./components/Administracion"));
const Catalogo = lazy(() => import("./components/Catalogo"));
const Home = lazy(() => import("./components/Home"));

// ✅ HOC para envolver cualquier componente con Suspense
const withSuspense = (Component) => (
    <Suspense fallback={null}>
        <Component />
    </Suspense>
);

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "",
                    element: (
                        <Suspense fallback={null}>
                            <HomeWrapper />
                        </Suspense>
                    ),
                },
                { path: "servicios", element: withSuspense(Servicios) },
                { path: "nosotros", element: withSuspense(Nosotros) },
                { path: "contacto", element: withSuspense(Contacto) },
                { path: "administracion", element: withSuspense(Administracion) },
                { path: "catalogo", element: withSuspense(Catalogo) },
            ],
        },
    ],
    {
        future: {
            v7_startTransition: true,
        },
    }
);


// 👇 Wrapper para pasar los refs desde el contexto de App
import { useOutletContext } from "react-router-dom";

function HomeWrapper() {
    const { contactoRef, informationsRef, setVideoReady } = useOutletContext();
    return (
        <Suspense fallback={null}>
            <Home
                contactoRef={contactoRef}
                informationsRef={informationsRef}
                setVideoReady={setVideoReady}
            />
        </Suspense>
    );
}


export default router;
