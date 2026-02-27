// src/components/SearchBar.jsx
import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    // Optional: If you want it to reset the search results page immediately:
    // onSearch("");
  };

  return (
    <form className="search-bar-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for books, stationery..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

export default SearchBar;
