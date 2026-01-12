// src/context/AuthProvider.jsx --- THE REAL, FINAL, BULLETPROOF FIX ---

import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./auth";

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { currentUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* --- THIS IS THE FIX --- */}
      {/* Do NOT render the rest of the app until loading is complete. */}
      {/* This guarantees that when the app appears, it has the correct user data. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
