// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Servicios from "./components/Servicios";
import Nosotros from "./components/Nosotros";
import Contacto from "./components/Contacto";
import Administracion from "./components/Administracion";
import Catalogo from "./components/Catalogo";
import Home from "./components/Home";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "",
                    element: <HomeWrapper />, // 👈 usamos wrapper para pasar los refs
                },
                { path: "servicios", element: <Servicios /> },
                { path: "nosotros", element: <Nosotros /> },
                { path: "contacto", element: <Contacto /> },
                { path: "administracion", element: <Administracion /> },
                { path: "catalogo", element: <Catalogo /> },
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
        <Home
            contactoRef={contactoRef}
            informationsRef={informationsRef}
            setVideoReady={setVideoReady}
        />
    );
}


export default router;
