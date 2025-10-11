// src/components/Home.jsx
import React, { Suspense } from "react";
import { Box } from "@mui/material";
import Hero from "./Hero";
import Features from "./Features";
import Informations from "./Informations";
import { useOutletContext } from "react-router-dom";

function Home() {
    // 🔹 Obtiene todo desde App.jsx (Outlet context)
    const { showApp, informationsRef, triggerInformations, setHasSeenInformations } = useOutletContext();

    return (
        <Box sx={{ position: "relative", overflow: "visible" }}>
            {/* 🏁 Hero */}
            <Hero informationsRef={informationsRef} setVideoReady={setHasSeenInformations} />

            {/* 🌌 Fondo compartido */}
            <Box
                sx={{
                    position: "relative",
                    backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
                    backgroundSize: "50px 50px",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    color: "white",
                    overflow: "visible",
                }}
            >
                {/* 💡 Glow */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "25%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 250,
                        height: 250,
                        borderRadius: "50%",
                        backgroundColor: "#06b6d41a",
                        filter: "blur(64px)",
                        animation: "float 6s ease-in-out infinite",
                        zIndex: 1,
                    }}
                />

                {/* 🚀 Contenido */}
                <Box sx={{ position: "relative", zIndex: 2 }}>
                    <Suspense fallback={null}>
                        <Features videoReady={showApp} />
                    </Suspense>

                    <Suspense fallback={null}>
                        <Informations
                            informationsRef={informationsRef}
                            triggerInformations={triggerInformations}
                            setHasSeenInformations={setHasSeenInformations}
                        />
                    </Suspense>
                </Box>

                <style>
                    {`
            @keyframes float {
              0%, 100% { transform: translate(-50%, -50%) translateY(0); }
              50% { transform: translate(-50%, -50%) translateY(-20px); }
            }
          `}
                </style>
            </Box>
        </Box>
    );
}

export default Home;
