// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Router/AppRouter.jsx";
import NavBar from "./components/NavBar.jsx";
import SecondaryNavBar from "./components/SecondaryNavBar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import "./styles/App.css";
import AuthProvider from "./context/AuthProvider.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import { CartProvider } from "./context/CartContext.jsx";
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <NavBar onProfileClick={openAuthModal} />
              <SecondaryNavBar />
              <main className="main-content">
                <AppRoutes onAuthRequired={openAuthModal} />
              </main>
              <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
