// src/components/Home.jsx
import React from "react";
import { Box } from "@mui/material";
import Hero from "./Hero";
import Features from "./Features";
import { useOutletContext } from "react-router-dom";

function Home({ informationsRef, setVideoReady }) {
    const { showApp } = useOutletContext();
    return (
        <Box>
            <Hero informationsRef={informationsRef} setVideoReady={setVideoReady} />
            <Box>
                <Features videoReady={showApp} />
            </Box>
        </Box>
    );
}


export default Home;
