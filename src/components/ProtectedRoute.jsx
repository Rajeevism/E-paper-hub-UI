// src/components/ProtectedRoute.jsx --- FINAL, CORRECTED VERSION ---

import React, { useEffect } from "react";
import { useAuth } from "../context/auth.js"; // Make sure this path is correct
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, onAuthRequired }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // useEffect is the correct place to perform "side effects" like navigation
  // or opening modals.
  useEffect(() => {
    // If there is no logged-in user...
    if (!currentUser) {
      // 1. First, navigate the user to the homepage so they are not on a blank screen.
      navigate("/");

      // 2. THEN, call the function to open the auth modal.
      // We wrap it in a setTimeout to ensure the navigation happens first.
      setTimeout(() => {
        onAuthRequired();
      }, 0);
    }
  }, [currentUser, navigate, onAuthRequired]); // This effect runs when the user status changes

  // If there IS a user, render the child component (e.g., ProfilePage).
  // If there is NO user, render null while we are redirecting them.
  return currentUser ? children : null;
};

export default ProtectedRoute;
