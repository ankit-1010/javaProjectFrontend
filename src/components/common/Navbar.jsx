import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="landing-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#3B82F6" />
              <path d="M7 15V9L12 13L17 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="logo-text">MapFinance</span>
        </div>

        {/* Links */}
        <nav className="nav-links">
          <button className="nav-link active" onClick={() => navigate('/')}>Home</button>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {currentUser ? (
            <button className="btn-primary" onClick={handleDashboardRedirect}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                className="btn-admin-portal" 
                onClick={() => navigate('/admin-login')}
                title="Go to Admin Portal"
              >
                <Shield size={16} />
                <span>Admin Login</span>
              </button>

              <button className="btn-secondary" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
