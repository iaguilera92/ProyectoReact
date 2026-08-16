import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import NavbarAdmin from "./NavbarAdmin";
import SidebarAdmin from "./SidebarAdmin";

const TITULOS = {
  "/dashboard":              "Dashboard",
  "/clientes":               "Clientes",
  "/reservas":               "Reservas",
  "/configurar-trabajos":    "Configurar Trabajos",
  "/configurar-en-revision": "En Revisión",
  "/pruebas-qas":            "Pruebas Automatizadas",
};

export default function AdminLayout() {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen]   = useState(() => localStorage.getItem("pw-sidebar") !== "false");
  const [temaOscuro,  setTemaOscuro]    = useState(() => localStorage.getItem("pw-tema")    !== "claro");
  const [forzarPrd,   setForzarPrd]     = useState(false);
  const [navbarAccion, setNavbarAccion] = useState(null);

  const toggleSidebar = () =>
    setSidebarOpen(p => { const next = !p; localStorage.setItem("pw-sidebar", String(next)); return next; });

  const handleTema = (oscuro) => {
    setTemaOscuro(oscuro);
    localStorage.setItem("pw-tema", oscuro ? "oscuro" : "claro");
  };

  const titulo = TITULOS[location.pathname] ?? "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", bgcolor: temaOscuro ? "#0a0a0a" : "#f0f0f0" }}>
      <NavbarAdmin
        titulo={titulo}
        temaOscuro={temaOscuro}
        onMenuClick={toggleSidebar}
        forzarPrd={forzarPrd}
        onForzarPrd={setForzarPrd}
        accion={navbarAccion}
      />
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SidebarAdmin
          open={sidebarOpen}
          temaOscuro={temaOscuro}
          onTemaChange={handleTema}
          onClose={() => { setSidebarOpen(false); localStorage.setItem("pw-sidebar", "false"); }}
          esPrd={forzarPrd}
        />
        <Box sx={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Outlet context={{ temaOscuro, forzarPrd, setForzarPrd, setNavbarAccion }} />
        </Box>
      </Box>
    </Box>
  );
}
