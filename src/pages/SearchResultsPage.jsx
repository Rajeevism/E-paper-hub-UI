// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/HomePage.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);

      // 1. FORCE LOWERCASE HERE
      const lowerCaseQuery = searchQuery.toLowerCase().trim();

      if (!lowerCaseQuery) {
        setResults([]);
        setLoading(false);
        return;
      }

      const collectionsToSearch = [
        "books",
        "stationery",
        "newspapers",
        "magazines",
        "elibrary",
      ];
      let allResults = [];

      try {
        const searchPromises = collectionsToSearch.map(
          async (collectionName) => {
            const querySnapshot = await getDocs(collection(db, collectionName));

            const matchedDocs = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();

              // 2. SAFELY CHECK TITLE & AUTHOR (Convert to String first to avoid crashes)
              const title = data.title ? String(data.title).toLowerCase() : "";
              const author = data.author
                ? String(data.author).toLowerCase()
                : "";

              // 3. COMPARE
              if (
                title.includes(lowerCaseQuery) ||
                author.includes(lowerCaseQuery)
              ) {
                matchedDocs.push({
                  id: doc.id,
                  ...data,
                  category: collectionName,
                });
              }
            });
            return matchedDocs;
          },
        );

        const resultsArray = await Promise.all(searchPromises);
        allResults = resultsArray.flat();

        setResults(allResults);
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="category-page-container" style={{ padding: "20px" }}>
      <h2>
        {results.length} results for "{searchQuery}"
      </h2>

      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <div className="no-results">
          <p>No products found matching your search.</p>
          <Link to="/" style={{ color: "#007185", textDecoration: "none" }}>
            Explore all products
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {results.map((product) => (
            <Link
              to={`/product/${product.category}/${product.id}`}
              key={product.id}
              className="book-card-link"
            >
              <div className="book-card">
                <div className="book-image-container">
                  <img
                    src={product.imageUrl || product.coverImage}
                    alt={product.title}
                  />
                </div>
                <div className="book-info">
                  <h3 className="book-title">{product.title}</h3>
                  <p className="book-author">{product.author}</p>
                  <div className="book-rating">
                    <span className="stars">★★★★☆</span>
                    <span className="rating-count">
                      ({product.ratingCount || 0})
                    </span>
                  </div>
                  <div className="book-price">
                    <span className="currency">₹</span>
                    <span className="amount">{product.price}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
