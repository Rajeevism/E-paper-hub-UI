// src/components/NavBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.js";
import { useCart } from "../context/CartContext.jsx";
import logo from "../assets/appLogo.png";
import "../styles/NavBar.css";
import ProfileDropdown from "./ProfileDropdown.jsx";
import SearchBar from "./SearchBar.jsx";

const NavBar = ({ onProfileClick }) => {
  const { currentUser } = useAuth();
  const { cartCount } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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
      // Fixed: Added backticks for template literal
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        {/* Left Section: Logo */}
        <div className="navbar-left">
          <Link to="/">
            <img src={logo} alt="E-Paper Hub" className="app-logo" />
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="navbar-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Right Section: Navigation Links */}
        <div className="navbar-right">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/cart" className="nav-link cart-link-container">
            My Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {currentUser ? (
            <div className="profile-container" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="profile-btn"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-initial">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </button>
              {showDropdown && (
                <ProfileDropdown onClose={() => setShowDropdown(false)} />
              )}
            </div>
          ) : (
            <div
              className="nav-link"
              onClick={onProfileClick}
              style={{ cursor: "pointer" }}
            >
              Profile
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
