// src/pages/CategoryPage.jsx --- FULLY UPDATED ---

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import BookCard from "../components/BookCard";
import "../styles/HomePage.css"; // Reuse homepage styles for the grid

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionNameMap = {
    books: "books",
    notebooks: "stationery",
    stationery: "stationery",
    newspapers: "newspapers",
    magazines: "magazines",
    "e-library": "elibrary",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const collectionNameToQuery =
        collectionNameMap[categoryName] || categoryName;
      try {
        const productsRef = collection(db, collectionNameToQuery);
        const querySnapshot = await getDocs(productsRef);
        setProducts(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching from Firestore: ", error);
      }
      setLoading(false);
    };

    if (categoryName) {
      fetchProducts();
    }
  }, [categoryName]);

  const pageTitle = categoryName
    .replace("-", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="category-page-container">
      <section className="book-section">
        <h2>{pageTitle}</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="book-grid">
            {products.map((product) => (
              // --- THIS IS THE CHANGE: The URL now includes the category ---
              <div
                key={product.id}
                onClick={() =>
                  navigate(`/product/${categoryName}/${product.id}`)
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
          <p>No products found in this category.</p>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
