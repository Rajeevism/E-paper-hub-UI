// src/components/BookSection.jsx --- CLEAN VERSION ---

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs } from "firebase/firestore";
import BookCard from "./BookCard";

const BookSection = ({ title, firestoreQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(firestoreQuery);
        setProducts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        // This error for the index is normal and can be ignored once the index is built
        if (error.code !== "failed-precondition") {
          console.error(`Error fetching section "${title}":`, error);
        }
      }
      setLoading(false);
    };
    fetchProducts();
  }, [firestoreQuery, title]);

  const getCategoryForUrl = (product) => {
    if (
      product.category === "new-book" ||
      product.category === "used-book" ||
      product.condition === "Used" ||
      product.condition === "New"
    ) {
      return "books";
    }
    return product.category;
  };

  return (
    <section className="book-section">
      <h2>{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="book-grid">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() =>
                navigate(`/product/${getCategoryForUrl(product)}/${product.id}`)
              }
            >
              <BookCard
                {...product}
                rating_avg={product.ratingAvg || 0}
                rating_count={product.ratingCount || 0}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for this section.</p>
      )}
    </section>
  );
};

export default BookSection;
