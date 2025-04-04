// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import Servicios from "./components/Servicios";
import Nosotros from "./components/Nosotros";
import Contacto from "./components/Contacto";
import Administracion from "./components/Administracion";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            children: [
                { path: "", element: <Home /> },
                { path: "servicios", element: <Servicios /> },
                { path: "nosotros", element: <Nosotros /> },
                { path: "contacto", element: <Contacto /> },
                { path: "administracion", element: <Administracion /> },
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
