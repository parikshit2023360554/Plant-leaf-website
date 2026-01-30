import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import AuthModal from './AuthModal';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginClick = () => {
    setShowAuthModal(true);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link to="/" className="logo-link">
              <h1>🌿</h1>
            </Link>
          </div>
          
          <div className="header-content">
            <nav className="nav">
              <ul>
                <li>
                  <Link 
                    to="/" 
                    className={location.pathname === '/' ? 'active' : ''}
                  >
                    Home
                  </Link>
                </li>
                <li><a href="#about">About</a></li>
                <li>
                  <Link 
                    to="/disease-guide" 
                    className={location.pathname === '/disease-guide' ? 'active' : ''}
                  >
                    Disease Guide
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/history" 
                    className={location.pathname === '/history' ? 'active' : ''}
                  >
                    History
                  </Link>
                </li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </nav>

            <div className="auth-section">
              {!isLoading && (
                isAuthenticated ? (
                  <UserProfile />
                ) : (
                  <button 
                    className="login-btn"
                    onClick={handleLoginClick}
                  >
                    Login
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;
