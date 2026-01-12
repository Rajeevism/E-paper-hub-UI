// src/components/NavBar.jsx --- FINAL, WITH AVATAR FALLBACK LOGIC ---

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.js"; // Correct import for the hook
import logo from "../assets/appLogo.png";
import "../styles/NavBar.css";
import ProfileDropdown from "./ProfileDropdown.jsx";
import SearchBar from "./SearchBar.jsx";

const NavBar = ({ onProfileClick }) => {
  const { currentUser } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/">
            <img src={logo} alt="E-Paper Hub" className="app-logo" />
          </Link>
        </div>
        <div className="navbar-center">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="navbar-right">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/cart" className="nav-link">
            My Cart
          </Link>

          {currentUser ? (
            <div className="profile-container" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="profile-btn"
              >
                {/* --- THIS IS THE NEW, SMARTER LOGIC --- */}
                {currentUser.photoURL ? (
                  // If photoURL exists, display the image
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  // If photoURL is missing, display the initial
                  <div className="profile-avatar-initial">
                    {
                      currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : "U" // Failsafe if displayName is also missing
                    }
                  </div>
                )}
                {/* --- END OF NEW LOGIC --- */}
              </button>
              {showDropdown && (
                <ProfileDropdown onClose={() => setShowDropdown(false)} />
              )}
            </div>
          ) : (
            <a href="#" className="nav-link" onClick={onProfileClick}>
              Profile
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
