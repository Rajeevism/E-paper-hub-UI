// src/pages/ProfilePage.jsx

import React from "react";
import { useAuth } from "../context/auth.js";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css"; // We will create this CSS file next

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If for some reason a user gets here without being logged in, redirect them.
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h1>My Profile</h1>
        <div className="profile-header">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <div className="profile-initial">
              {currentUser.displayName
                ? currentUser.displayName[0].toUpperCase()
                : "U"}
            </div>
          )}
          <div className="profile-info">
            <h2>{currentUser.displayName || "No Name Provided"}</h2>
            <p>{currentUser.email}</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">User ID:</span>
            <span className="detail-value">{currentUser.uid}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email Verified:</span>
            <span className="detail-value">
              {currentUser.emailVerified ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;
