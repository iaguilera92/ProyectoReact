import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import "@fontsource/poppins";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Areas from "./components/Areas";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Contenedor externo con borde blanco */}
      <Box
        sx={{
          m: 2, // Margen para separar del viewport
          border: "4px solid white", // Borde blanco
          borderRadius: "20px", // Esquinas redondeadas sutiles
          overflow: "hidden", // Evita que el contenido sobresalga
        }}
      >
        {/* Contenedor interno con fondo degradado radial (más oscuro) */}
        <Box
          sx={{
            minHeight: "100vh",
            background: "radial-gradient(circle, #333333 40%, #000000 100%)",
            color: "white",
          }}
        >
          <Navbar />
          <Hero />
          <Box sx={{ minHeight: "100vh" }}>
            <Features />
            <Areas />
          </Box>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
