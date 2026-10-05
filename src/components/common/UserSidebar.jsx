import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  Target, 
  BarChart2, 
  User, 
  LogOut,
  X
} from 'lucide-react';
import './UserSidebar.css';

export const UserSidebar = ({ isOpen = false, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/budgets', label: 'Budgets', icon: Wallet },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/reports', label: 'Reports', icon: BarChart2 },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside className={`user-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-row">
        <div className="sidebar-brand" onClick={() => handleNavClick('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#3B82F6" />
              <path d="M7 15V9L12 13L17 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="brand-name">MapFinance</span>
        </div>

        {/* Mobile close button */}
        <button 
          className="sidebar-mobile-close-btn" 
          onClick={onClose} 
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <Icon size={19} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
