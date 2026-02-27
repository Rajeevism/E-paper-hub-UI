// src/Router/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import ProfilePage from "../pages/ProfilePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import CategoryPage from "../pages/CategoryPage";
import BookDetailsPage from "../pages/BookDetailsPage";
import SellPage from "../pages/SellPage"; // 1. Imported the SellPage

const AppRoutes = ({ onAuthRequired }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />

      <Route
        path="/product/:categoryName/:productId"
        element={<BookDetailsPage openAuthModal={onAuthRequired} />}
      />

      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute onAuthRequired={onAuthRequired}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute onAuthRequired={onAuthRequired}>
            <CartPage />
          </ProtectedRoute>
        }
      />

      {/* 2. Added the Sell Route (Protected) */}
      <Route
        path="/sell"
        element={
          <ProtectedRoute onAuthRequired={onAuthRequired}>
            <SellPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
