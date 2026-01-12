// --- THIS IS THE COMPLETE AND CORRECT FILE ---
// It includes the permanent fix for the social login profile picture.

import React, { useState, useEffect } from "react";
import "../styles/AuthModal.css";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView("login");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setError("");
        setSuccessMessage("");
        setIsLoading(false);
        setIsPasswordVisible(false);
        setIsConfirmPasswordVisible(false);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const resetMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  const handleSocialLogin = async (providerName) => {
    resetMessages();
    setIsLoading(true);
    const provider =
      providerName === "google"
        ? new GoogleAuthProvider()
        : new GithubAuthProvider();
    try {
      // Step 1: You log in. Firebase gets a TEMPORARY profile from Google.
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // --- THIS IS THE FIX ---
      // Step 2: You command Firebase to take the temporary info (name and photo)
      // and save it to the user's PERMANENT record.
      await updateProfile(user, {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      // --- END OF FIX ---

      setSuccessMessage("Logged in successfully!");
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    resetMessages();
    if (view === "signup" && password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    setIsLoading(true);
    try {
      if (view === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredential.user, { displayName: name });
      }
      setSuccessMessage(
        view === "login"
          ? "Logged in Successfully!"
          : "Account created successfully!"
      );
      setTimeout(onClose, 1500);
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect email or password. Please try again.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login.");
      } else {
        setError("An error occurred. Please try again later.");
        console.error("Firebase Auth Error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    resetMessages();
    if (!email) {
      return setError("Please enter your email address.");
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset email sent! Please check your inbox.");
      setView("resetSuccess");
    } catch (err) {
      console.error("Password Reset Error:", err);
      setError("Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        {(view === "login" || view === "signup") && (
          <>
            <h2>{view === "login" ? "Login" : "Sign Up"}</h2>
            {view === "login" && (
              <>
                <div className="social-logins">
                  <button
                    className="social-btn"
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                  >
                    <FcGoogle size={22} />
                    <span>Continue with Google</span>
                  </button>
                  <button
                    className="social-btn"
                    onClick={() => handleSocialLogin("github")}
                    disabled={isLoading}
                  >
                    <FaGithub size={22} />
                    <span>Continue with GitHub</span>
                  </button>
                </div>
                <div className="divider">
                  <span>OR</span>
                </div>
              </>
            )}
            <form className="auth-form" onSubmit={handleEmailSubmit}>
              {view === "signup" && (
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="password-input-wrapper">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {view === "signup" && (
                <div className="password-input-wrapper">
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              )}
              {error && <p className="error-message">{error}</p>}
              {successMessage && !error && (
                <p className="success-message">{successMessage}</p>
              )}
              <button
                type="submit"
                disabled={isLoading || (!!successMessage && !error)}
              >
                {isLoading && view !== "login" ? (
                  <div className="loading-spinner"></div>
                ) : view === "login" ? (
                  "Login"
                ) : (
                  "Create Account"
                )}
              </button>
              {view === "login" && (
                <div className="extras">
                  <a
                    href="#"
                    className="forgot-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      resetMessages();
                      setView("forgotPassword");
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
              )}
              <p className="switch-msg">
                {view === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    resetMessages();
                    setView(view === "login" ? "signup" : "login");
                  }}
                >
                  {view === "login" ? " Sign Up" : " Login"}
                </a>
              </p>
            </form>
          </>
        )}
        {view === "forgotPassword" && (
          <>
            <h2>Reset Password</h2>
            <form className="auth-form" onSubmit={handlePasswordReset}>
              <p>Enter your email to receive a reset link.</p>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              <p className="switch-msg">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    resetMessages();
                    setView("login");
                  }}
                >
                  Back to Login
                </a>
              </p>
            </form>
          </>
        )}
        {view === "resetSuccess" && (
          <>
            <h2>Check Your Email</h2>
            <div className="auth-form">
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
              <button
                type="button"
                className="return-to-login-btn"
                onClick={() => setView("login")}
              >
                Return to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
