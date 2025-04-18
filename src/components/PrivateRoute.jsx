// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("auth_token");
    return isAuthenticated ? children : <Navigate to="/administracion" replace />;
};

export default PrivateRoute;
