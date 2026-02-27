// src/pages/BookDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/auth.js";
import { useCart } from "../context/CartContext.jsx";
import RatingStars from "../components/RatingStars";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import "../styles/BookDetailsPage.css";

const BookDetailsPage = ({ openAuthModal }) => {
  const { categoryName, productId } = useParams();
  const { currentUser } = useAuth();

  // 1. Get cartItems and update functions from Context
  const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Find if this specific book is already in the cart
  const cartItem = book ? cartItems.find((item) => item.id === book.id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;

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
          setError("Sorry, this item could not be found.");
        }
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (productId && categoryName) {
      fetchBook();
    }
  }, [productId, categoryName]);

  // 3. Handle Initial Add
  const handleAddToCart = () => {
    if (currentUser) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.imageUrl,
        category: categoryName,
      });
    } else {
      openAuthModal();
    }
  };

  // 4. Handle Increment (+)
  const handleIncrement = () => {
    updateQuantity(book.id, 1);
  };

  // 5. Handle Decrement (-)
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(book.id, -1);
    } else {
      removeFromCart(book.id); // Remove if qty becomes 0
    }
  };

  const handleRatingClick = (e) => {
    e.preventDefault();
    const reviewSection = document.getElementById("customer-reviews-section");
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">{error}</div>;
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
            <p>{book.description || "No description available."}</p>
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

            {/* --- ZOMATO STYLE BUTTON LOGIC --- */}
            {quantity > 0 ? (
              <div className="qty-control-group">
                <button className="qty-btn minus" onClick={handleDecrement}>
                  −
                </button>
                <span className="qty-display">{quantity}</span>
                <button className="qty-btn plus" onClick={handleIncrement}>
                  +
                </button>
              </div>
            ) : (
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )}
            {/* --------------------------------- */}

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
