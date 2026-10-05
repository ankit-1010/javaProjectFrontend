import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardRedirect = () => {
    setMobileMenuOpen(false);
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="landing-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => handleNavClick('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#3B82F6" />
              <path d="M7 15V9L12 13L17 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="logo-text">MapFinance</span>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Desktop Links */}
        <nav className="nav-links">
          <button className="nav-link active" onClick={() => handleNavClick('/')}>Home</button>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="nav-actions">
          {currentUser ? (
            <button className="btn-primary" onClick={handleDashboardRedirect}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                className="btn-admin-portal" 
                onClick={() => handleNavClick('/admin-login')}
                title="Go to Admin Portal"
              >
                <Shield size={16} />
                <span>Admin Login</span>
              </button>

              <button className="btn-secondary" onClick={() => handleNavClick('/login')}>
                Login
              </button>
              <button className="btn-primary" onClick={() => handleNavClick('/register')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <nav className="mobile-menu-links">
            <button className="mobile-nav-link" onClick={() => handleNavClick('/')}>Home</button>
            <a href="#features" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
          </nav>

          <div className="mobile-menu-actions">
            {currentUser ? (
              <button className="btn-primary full-width" onClick={handleDashboardRedirect}>
                Go to Dashboard
              </button>
            ) : (
              <>
                <button 
                  className="btn-admin-portal full-width" 
                  onClick={() => handleNavClick('/admin-login')}
                >
                  <Shield size={16} />
                  <span>Admin Login</span>
                </button>
                <button className="btn-secondary full-width" onClick={() => handleNavClick('/login')}>
                  Login
                </button>
                <button className="btn-primary full-width" onClick={() => handleNavClick('/register')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
