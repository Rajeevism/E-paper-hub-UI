// src/components/ProfileDropdown.jsx --- FINAL VERSION ---

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.js";
import { useTheme } from "../context/theme.js";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/ProfileDropdown.css";

import {
  FaUser,
  FaBoxOpen,
  FaSun,
  FaMoon,
  FaDesktop,
  FaSignOutAlt,
} from "react-icons/fa";

const ProfileDropdown = ({ onClose }) => {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme(); // <-- Get the global theme and setter
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        onClose();
        navigate("/");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  if (!currentUser) return null;

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <h3>Hello, {currentUser.displayName || "User"}</h3>
        <p>{currentUser.email}</p>
      </div>

      <div className="dropdown-body">
        <Link to="/profile" className="dropdown-item" onClick={onClose}>
          <FaUser className="dropdown-icon" />
          <span>My Profile</span>
        </Link>
        <Link to="/orders" className="dropdown-item" onClick={onClose}>
          <FaBoxOpen className="dropdown-icon" />
          <span>My Orders</span>
        </Link>

        <div className="dropdown-divider"></div>

        <div className="theme-switcher">
          <p className="theme-label">THEME</p>
          <div className="theme-options">
            <button
              className={`theme-btn ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")} // <-- Connect to the working system
            >
              <FaSun />
              <span>Light</span>
            </button>
            <button
              className={`theme-btn ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")} // <-- Connect to the working system
            >
              <FaMoon />
              <span>Dark</span>
            </button>
            <button
              className={`theme-btn ${theme === "system" ? "active" : ""}`}
              onClick={() => setTheme("system")} // <-- Connect to the working system
            >
              <FaDesktop />
              <span>System</span>
            </button>
          </div>
        </div>

        <div className="dropdown-divider"></div>

        <button className="dropdown-item logout-btn" onClick={handleLogout}>
          <FaSignOutAlt className="dropdown-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
