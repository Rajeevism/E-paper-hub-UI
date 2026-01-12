// src/App.jsx --- FINAL, SIMPLIFIED, AND CORRECT ---

import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Router/AppRouter.jsx";
import NavBar from "./components/NavBar.jsx";
import SecondaryNavBar from "./components/SecondaryNavBar.jsx";
import AuthModal from "./components/AuthModal.jsx";
import "./styles/App.css";

import AuthProvider from "./context/AuthProvider.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";

// We no longer need the AppContent wrapper or useAuth here.

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        {/* The AuthProvider will now prevent this from rendering until ready */}
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
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
