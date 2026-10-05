import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './AdminLoginPage.css';

export const AdminLoginPage = () => {
  const { adminLogin, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [currentUser, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message || 'Admin authentication failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Back button */}
      <button className="admin-back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      {/* Admin Card */}
      <div className="admin-login-box">
        {/* Top Badge */}
        <div className="admin-shield-icon-wrapper">
          <Shield size={32} className="shield-icon" />
        </div>

        <div className="admin-login-header">
          <h2>MapFinance Admin Portal</h2>
          <p>Secure authentication for system administrators</p>
        </div>

        {errorMsg && (
          <div className="admin-error-banner">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-group">
            <label>Admin Email</label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Security Password</label>
            <div className="admin-input-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-admin-submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Admin Dashboard'}
          </button>
        </form>

        <div className="admin-login-footer">
          <button type="button" onClick={() => navigate('/login')} className="user-login-link">
            ← Return to User Login
          </button>
        </div>
      </div>
    </div>
  );
};
