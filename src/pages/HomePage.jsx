// src/pages/HomePage.jsx --- FINAL, TYPO FIXED ---

import React from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import BookSection from "../components/BookSection";
import "../styles/HomePage.css";

const HomePage = () => {
  // --- THIS IS THE FIX for Bestselling Books ---
  // Changed 'rating_count' to 'ratingCount' to match your database
  const bestsellingQuery = query(
    collection(db, "books"),
    orderBy("ratingCount", "desc"), // <-- TYPO FIXED
    limit(5)
  );

  // --- THIS IS THE FIX for The Pre-Loved Library ---
  // Changed 'rating_count' to 'ratingCount' to match your database
  const preLovedQuery = query(
    collection(db, "books"),
    where("condition", "==", "Used"),
    orderBy("ratingCount", "desc"), // <-- TYPO FIXED
    limit(5)
  );

  return (
    <div className="homepage-container">
      <BookSection
        title="Bestselling Books"
        firestoreQuery={bestsellingQuery}
      />

      <BookSection
        title="The Pre-Loved Library"
        firestoreQuery={preLovedQuery}
      />
    </div>
  );
};

export default HomePage;
