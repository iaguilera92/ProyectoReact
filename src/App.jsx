import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import "@fontsource/poppins";
import theme from "./theme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Hero />
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
        <Features />
      </Box>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
