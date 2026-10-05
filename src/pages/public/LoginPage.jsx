import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Shield } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = ({ defaultSignUp = false }) => {
  const { login, register, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(defaultSignUp || location.pathname === '/register');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsSignUp(true);
    } else if (location.pathname === '/login') {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  // If already logged in, redirect
  useEffect(() => {
    if (currentUser) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [currentUser, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const res = await register(fullName, email, password, phone);
        if (res.success) {
          navigate('/dashboard', { replace: true });
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          if (res.user?.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setErrorMsg(res.message || 'Invalid email or password');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Back to Home Button */}
      <button className="auth-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Main Split Box */}
      <div className="auth-card-wrapper">
        {/* Left Col: Branded Graphic Card */}
        <div className="auth-banner-col">
          <div className="banner-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#FFFFFF" />
              <path d="M7 15V9L12 13L17 9V15" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>MapFinance</span>
          </div>

          <div className="banner-content">
            <h2 className="banner-headline">
              Manage Today <br />
              for a Better Tomorrow
            </h2>
            <p className="banner-subtext">
              Simple. Secure. Smarter. <br />
              Your personal finance companion.
            </p>
          </div>

          {/* Graphical Illustration */}
          <div className="banner-illustration">
            <div className="illustration-character">
              <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="80" fill="rgba(255,255,255,0.15)" />
                <circle cx="100" cy="65" r="22" fill="#FFE4E6" />
                <path d="M85 58C85 45 115 45 115 58C115 62 105 60 85 58Z" fill="#1E293B" />
                <path d="M72 135C72 105 85 92 100 92C115 92 128 105 128 135H72Z" fill="#3B82F6" />
                <rect x="75" y="115" width="50" height="32" rx="4" fill="#0F172A" />
                <rect x="80" y="118" width="40" height="22" rx="2" fill="#E2E8F0" />
                <rect x="30" y="60" width="35" height="25" rx="6" fill="#FFFFFF" opacity="0.9" />
                <path d="M36 78L43 70L48 74L58 64" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="140" y="70" width="30" height="35" rx="6" fill="#FFFFFF" opacity="0.9" />
                <rect x="145" y="85" width="5" height="15" rx="2" fill="#4F46E5" />
                <rect x="153" y="78" width="5" height="22" rx="2" fill="#6366F1" />
                <rect x="161" y="82" width="5" height="18" rx="2" fill="#818CF8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="auth-form-col">
          {/* Header */}
          <div className="auth-form-header">
            <h2>{isSignUp ? 'Create an Account' : 'Welcome Back'}</h2>
            <p>{isSignUp ? 'Start managing your finances today' : 'Login to your account'}</p>
          </div>

          {errorMsg && (
            <div className="auth-error-banner">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isSignUp && (
              <div className="auth-input-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isSignUp && (
              <div className="auth-input-group">
                <label>Phone Number (Optional)</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="auth-form-options">
                <label className="remember-me-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            <button type="submit" className="btn-auth-submit" disabled={loading}>
              {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
            </button>
          </form>

          {/* Toggle between Login and Sign Up */}
          <div className="auth-switch-text" style={{ marginTop: '1.5rem' }}>
            {isSignUp ? (
              <>Already have an account? <button type="button" onClick={() => { setIsSignUp(false); setErrorMsg(''); navigate('/login'); }}>Login</button></>
            ) : (
              <>Don't have an account? <button type="button" onClick={() => { setIsSignUp(true); setErrorMsg(''); navigate('/register'); }}>Sign Up</button></>
            )}
          </div>

          {/* Dedicated Admin Login Button */}
          <div className="admin-login-prompt">
            <button 
              type="button" 
              className="btn-admin-redirect"
              onClick={() => navigate('/admin-login')}
            >
              <Shield size={16} />
              <span>Are you an Admin? Login to Admin Portal →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
