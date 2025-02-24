import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { Routes, Route } from "react-router-dom"; // Importa Routes y Route
import "@fontsource/poppins";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Areas from "./components/Areas";
import Contacto from "./components/Contacto"; // Importa el componente de contacto

// Puedes crear un componente Home para la página principal
function Home() {
  return (
    <Box>
    <Navbar />
      <Hero />
      <Box sx={{ minHeight: "100vh" }}>
        <Features />
        <Areas />
      </Box>
  </Box>
  );
}
function App() {
  return (
    <Box
    sx={{
      m: 2,
      border: "4px solid white",
      borderRadius: "20px",
      overflow: "hidden",
    }}
    >
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle, #333333 40%, #000000 100%)",
        color: "white",
      }}
    >
        <Navbar />
        <Box sx={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
        </Box>
      <Footer />
      </Box>
    </Box>
  );
}

export default App;
