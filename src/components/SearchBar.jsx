// src/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/SearchBar.css"; // We will create this file next

const SearchBar = ({ onSearch, onClear }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // 1. Handle Click Outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. The "Live Search" Logic (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length < 1) {
        setSuggestions([]);
        return;
      }

      // Convert input to lowercase for comparison
      const lowerCaseTerm = searchTerm.toLowerCase();

      // Define collections
      const collectionsToSearch = [
        "books",
        "stationery",
        "newspapers",
        "magazines",
        "elibrary",
      ];
      let matches = [];

      // We search all collections (Limited to top 5 total for speed)
      for (const colName of collectionsToSearch) {
        if (matches.length >= 5) break; // Stop if we already have 5 suggestions

        const querySnapshot = await getDocs(collection(db, colName));

        querySnapshot.forEach((doc) => {
          if (matches.length >= 5) return;

          const data = doc.data();
          const title = data.title ? String(data.title).toLowerCase() : "";

          // Check if title contains the search term
          if (title.includes(lowerCaseTerm)) {
            matches.push({
              id: doc.id,
              title: data.title,
              category: colName,
              image: data.imageUrl || data.coverImage, // For the tiny thumbnail
            });
          }
        });
      }

      setSuggestions(matches);
      setShowSuggestions(true);
    }, 300); // Wait 300ms after typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSuggestions([]);
    if (onClear) onClear();
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.title); // Fill the bar
    setShowSuggestions(false);
    // Navigate directly to product
    navigate(`/product/${product.category}/${product.id}`);
  };

  return (
    <div className="search-bar-wrapper" ref={wrapperRef}>
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for books, stationery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="search-input"
        />

        {searchTerm && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
          >
            <FaTimes />
          </button>
        )}

        <button type="submit" className="search-submit-btn">
          <FaSearch />
        </button>
      </form>

      {/* 3. The Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-suggestions-list">
          {suggestions.map((item) => (
            <li key={item.id} onClick={() => handleSuggestionClick(item)}>
              <img src={item.image} alt="" className="suggestion-thumb" />
              <div className="suggestion-text">
                <span className="suggestion-title">{item.title}</span>
                <span className="suggestion-cat">in {item.category}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
