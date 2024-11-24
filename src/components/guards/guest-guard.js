import React from "react";
import { Navigate } from "react-router-dom";

const GuestGuard = ({ children }) => {
  // Check if the user is authenticated by checking the UAN
  const isAuthenticated = !!localStorage.getItem("user_uan");

  // If authenticated, redirect to the default page (e.g., dashboard)
  if (isAuthenticated) {
    return <Navigate to="/service-history" replace />;
  }

  // If not authenticated, allow access to the children (public routes)
  return children;
};

export default GuestGuard;
