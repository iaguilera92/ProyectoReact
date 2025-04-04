// src/components/Home.jsx
import React from "react";
import { Box } from "@mui/material";
import Hero from "./Hero";
import Features from "./Features";

function Home({ contactoRef, informationsRef }) {
    return (
        <Box>
            <Hero scrollToContacto={contactoRef} />
            <Box>
                <Features scrollToInformations={informationsRef} />
            </Box>
        </Box>
    );
}

export default Home;
