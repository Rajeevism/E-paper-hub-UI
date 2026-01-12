// src/pages/BookDetailsPage.jsx --- FINAL, COMPLETE, NO WARNINGS ---

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/auth.js"; // Correct import path for the hook
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "../styles/BookDetailsPage.css";
import RatingStars from "../components/RatingStars";
import CustomerReviewsSection from "../components/CustomerReviewsSection";

const BookDetailsPage = ({ openAuthModal }) => {
  const { categoryName, productId } = useParams();
  const { currentUser } = useAuth(); // We need the current user to check for login

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const collectionNameMap = {
      books: "books",
      notebooks: "stationery",
      stationery: "stationery",
      newspapers: "newspapers",
      magazines: "magazines",
      "e-library": "elibrary",
    };

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const collectionNameToQuery =
          collectionNameMap[categoryName] || categoryName;
        const productRef = doc(db, collectionNameToQuery, productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setBook({ id: productSnap.id, ...productSnap.data() });
        } else {
          setError(`Sorry, this item could not be found.`);
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId && categoryName) {
      fetchBook();
    }
  }, [productId, categoryName]);

  // --- THIS IS THE FIX ---
  // This function uses both 'currentUser' and 'openAuthModal'
  const handleAddToCart = () => {
    if (currentUser) {
      // If the user is logged in, add to cart
      alert(`"${book.title}" added to your cart! (Functionality to be built)`);
    } else {
      // If the user is NOT logged in, open the login modal
      openAuthModal();
    }
  };

  const handleRatingClick = (e) => {
    e.preventDefault();
    document
      .getElementById("customer-reviews-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "2rem" }}>
        Loading book details...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", padding: "2rem", color: "red" }}>
        {error}
      </p>
    );
  if (!book) return null;

  return (
    <div className="book-detail-page-container">
      <div className="book-detail-main-content">
        <div className="image-column">
          <img src={book.imageUrl} alt={book.title} />
        </div>
        <div className="info-column">
          <span className="condition-badge">{book.condition}</span>
          <h1>{book.title}</h1>
          {book.author && <p className="author-link">by {book.author}</p>}
          {book.ratingAvg && book.ratingCount > 0 && (
            <a
              href="#customer-reviews-section"
              className="details-rating-link"
              onClick={handleRatingClick}
            >
              <RatingStars rating={book.ratingAvg} />
              <span className="rating-count-link">
                {book.ratingCount} ratings
              </span>
            </a>
          )}
          <hr />
          <div className="price-section">
            <span className="price-symbol">₹</span>
            <span className="price-whole">{book.price}</span>
            <div className="mrp-details">
              <span>M.R.P.: </span>
              <span className="mrp-price">₹{book.mrp}</span>
            </div>
            <span className="discount-percent">({book.discount}% off)</span>
          </div>
          <p className="info-text">Inclusive of all taxes</p>
          <hr />
          <div className="description-section">
            <h3>Description</h3>
            <p>
              {book.description ||
                "No description available for this book yet."}
            </p>
          </div>
        </div>
        <div className="buy-box-column">
          <div className="buy-box">
            <div className="buy-box-price">
              <span className="price-symbol">₹</span>
              <span className="price-whole">{book.price}</span>
            </div>
            <p className="delivery-info">
              <span className="delivery-fast">FREE delivery</span> Monday, July
              22.
            </p>
            <p className="stock-status">In Stock.</p>
            {/* --- THIS BUTTON NOW USES THE FUNCTION --- */}
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now-btn">Buy Now</button>
          </div>
        </div>
      </div>

      <div id="customer-reviews-section">
        <CustomerReviewsSection bookId={productId} />
      </div>
    </div>
  );
};

export default BookDetailsPage;
