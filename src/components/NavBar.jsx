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
  const [imgError, setImgError] = useState(false);

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

  const handleClearSearch = () => {
    navigate("/");
  };

  const getUserInitial = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return "U";
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
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
        </div>

        <div className="navbar-right">
          <Link to="/" className="nav-link">
            Home
          </Link>

          <div className="cart-link-container">
            <Link to="/cart" className="nav-link cart-link-container">
              My Cart
              {/* UPDATED LOGIC: Only show badge if user exists AND count > 0 */}
              {currentUser && cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>

          {currentUser ? (
            <div className="profile-container" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="profile-btn"
              >
                {!imgError && currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="profile-avatar"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="profile-avatar-initial">
                    {getUserInitial()}
                  </div>
                )}
              </button>

              {showDropdown && (
                <ProfileDropdown onClose={() => setShowDropdown(false)} />
              )}
            </div>
          ) : (
            <div
              className="nav-link profile-btn-guest" /* Added a class for styling */
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
