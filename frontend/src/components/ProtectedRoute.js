import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const auth = localStorage.getItem("auth");

  if (!auth) {
    // not logged in → go back to login
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
