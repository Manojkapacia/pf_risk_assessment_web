import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  // Check for the UAN in local storage
  const isAuthenticated = !!localStorage.getItem("user_uan");

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children (protected routes)
  return children;
};

export default AuthGuard;
