import React from "react";
import { Navigate } from "react-router-dom";

const AdminGuestGuard = ({ children }) => {
  // Check if the user is authenticated by checking the UAN
  const isAuthenticated = !!localStorage.getItem("admin_logged_in");

  // If authenticated, redirect to the default page (e.g., dashboard)
  if (isAuthenticated) {
    return <Navigate to="/operation/view-details" replace />;
  }

  // If not authenticated, allow access to the children (public routes)
  return children;
};

export default AdminGuestGuard;
