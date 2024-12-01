import React from "react";
import { Navigate } from "react-router-dom";

const AuthGuardAdmin = ({ children }) => {
  // Check for the UAN in local storage
  const isAuthenticated = !!localStorage.getItem("admin_logged_in");

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/operation/login" replace />;
  }

  // If authenticated, render the children (protected routes)
  return children;
};

export default AuthGuardAdmin;
