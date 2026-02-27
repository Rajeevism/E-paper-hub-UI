import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/ProfilePage.css";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // NEW: Track if the profile image fails to load
  const [imgError, setImgError] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  // 1. Fetch User Data
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setFormData((prev) => ({ ...prev, ...docSnap.data() }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Save Data
  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setLoading(true);
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, formData, { merge: true });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get the Initial
  const getInitial = () => {
    if (formData.displayName)
      return formData.displayName.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return "U";
  };

  if (loading) return <div className="profile-loading">Loading Profile...</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>My Account</h1>
        <p>Manage your personal details and shipping address.</p>
      </div>

      <div className="profile-card">
        {/* LEFT SIDE: Avatar & Basic Info */}
        <div className="profile-sidebar">
          <div className="avatar-large">
            {/* --- UPDATED LOGIC HERE --- */}
            {!imgError && currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                onError={() => setImgError(true)} // If image fails, switch to initial
              />
            ) : (
              <div className="avatar-initial-large">{getInitial()}</div>
            )}
            {/* -------------------------- */}
          </div>
          <h2 className="user-name">{formData.displayName || "User"}</h2>
          <p className="user-email">{currentUser?.email}</p>
        </div>

        {/* RIGHT SIDE: Details Form */}
        <div className="profile-details">
          <div className="details-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit
              </button>
            )}
          </div>

          {isEditing ? (
            /* --- EDIT MODE --- */
            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <div className="input-with-icon">
                  <FaPhone className="input-icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <h4 className="section-title">Shipping Address</h4>

              <div className="form-group">
                <label>Flat, House no., Building, Company, Apartment</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Area, Street, Sector, Village</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>City / Town</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="save-btn">
                  <FaSave /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            /* --- VIEW MODE --- */
            <div className="view-details">
              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">
                  {formData.displayName || "Not set"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">
                  {formData.phone || "Not set"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value">
                  {formData.addressLine1 ? (
                    <>
                      {formData.addressLine1}, {formData.addressLine2}
                      <br />
                      {formData.city}, {formData.state} - {formData.pincode}
                      <br />
                      {formData.country}
                    </>
                  ) : (
                    <span className="warning-text">No address saved yet.</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
