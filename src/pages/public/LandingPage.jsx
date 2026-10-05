import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { 
  ArrowRight, 
  FileCheck, 
  PieChart, 
  Trophy, 
  ShieldCheck
} from 'lucide-react';
import './LandingPage.css';

export const LandingPage = () => {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="landing-page-wrapper">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Text */}
          <div className="hero-text-col">
            <h1 className="hero-title">
              Take Control <br />
              of <span className="highlight-text">Your Money</span>
            </h1>
            <p className="hero-subtitle">
              Track your income, expenses, set budgets, achieve your financial goals and build a better financial future with live Aiven MySQL cloud persistence.
            </p>
            <div className="hero-cta-group">
              <button 
                className="btn-hero-primary"
                onClick={handleGetStarted}
              >
                <span>{currentUser ? 'Go to Dashboard' : 'Get Started'}</span>
                <ArrowRight size={18} />
              </button>
              <button 
                className="btn-hero-admin"
                onClick={() => navigate('/admin-login')}
              >
                <ShieldCheck size={18} />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          {/* Right Floating Card Mockup */}
          <div className="hero-visual-col">
            <div className="glass-card-mockup">
              {/* Card Header */}
              <div className="mockup-header">
                <div className="mockup-logo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="4" fill="#3B82F6" />
                    <path d="M7 15V9L12 13L17 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>MapFinance</span>
                </div>
              </div>

              {/* Total Balance & 3D Mini Bar Chart */}
              <div className="mockup-balance-section">
                <div>
                  <span className="balance-label">Total Balance</span>
                  <div className="balance-amount">₹45,320</div>
                </div>
                {/* 3D mini bars */}
                <div className="mini-bars-graphic">
                  <span style={{ height: '22px', backgroundColor: '#818CF8' }} />
                  <span style={{ height: '34px', backgroundColor: '#6366F1' }} />
                  <span style={{ height: '18px', backgroundColor: '#A5B4FC' }} />
                  <span style={{ height: '42px', backgroundColor: '#4F46E5' }} />
                </div>
              </div>

              {/* Income, Expenses, Savings Pills */}
              <div className="mockup-metrics-list">
                <div className="mockup-metric-row">
                  <div className="metric-left">
                    <span className="status-dot green" />
                    <span className="metric-name">Income</span>
                  </div>
                  <span className="metric-val">₹60,000</span>
                </div>

                <div className="mockup-metric-row">
                  <div className="metric-left">
                    <span className="status-dot red" />
                    <span className="metric-name">Expenses</span>
                  </div>
                  <span className="metric-val">₹32,450</span>
                </div>

                <div className="mockup-metric-row">
                  <div className="metric-left">
                    <span className="status-dot teal" />
                    <span className="metric-name">Savings</span>
                  </div>
                  <span className="metric-val">₹27,550</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Features Cards */}
      <section className="features-section" id="features">
        <div className="features-container">
          {/* Card 1: Track Expenses */}
          <div className="feature-card">
            <div className="feature-icon-wrapper blue">
              <FileCheck size={24} />
            </div>
            <div className="feature-card-content">
              <h3>Track Expenses</h3>
              <p>Stay on top of spending in real-time</p>
            </div>
          </div>

          {/* Card 2: Set Budgets */}
          <div className="feature-card">
            <div className="feature-icon-wrapper purple">
              <PieChart size={24} />
            </div>
            <div className="feature-card-content">
              <h3>Set Budgets</h3>
              <p>Plan and monitor category budgets</p>
            </div>
          </div>

          {/* Card 3: Achieve Goals */}
          <div className="feature-card">
            <div className="feature-icon-wrapper indigo">
              <Trophy size={24} />
            </div>
            <div className="feature-card-content">
              <h3>Achieve Goals</h3>
              <p>Turn financial targets into reality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <p>© 2026 MapFinance. All rights reserved. Secure finance management platform.</p>
          <div className="footer-links">
            <button onClick={() => navigate('/admin-login')} className="footer-admin-link">
              Admin Portal Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
