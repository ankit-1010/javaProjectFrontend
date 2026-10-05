import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Layers, 
  BarChart2, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import './AdminSidebar.css';

export const AdminSidebar = ({ isOpen = false, onClose }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
    { path: '/admin/reports', label: 'Reports', icon: BarChart2 },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
    if (onClose) onClose();
  };

  const adminName = currentUser?.fullName || 'Admin';
  const adminEmail = currentUser?.email || 'admin@gmail.com';
  const adminInitial = currentUser?.avatar || adminName.charAt(0).toUpperCase() || 'A';

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand */}
      <div className="admin-brand-row">
        <div className="admin-brand" onClick={() => handleNavClick('/admin/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="admin-logo-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="4" fill="#3B82F6" />
              <path d="M7 15V9L12 13L17 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="admin-brand-info">
            <span className="brand-name">MapFinance</span>
            <span className="admin-tag">ADMIN</span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button 
          className="admin-mobile-close-btn" 
          onClick={onClose} 
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Menu */}
      <nav className="admin-nav">
        {adminMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <Icon size={19} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin Profile */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-card" onClick={() => handleNavClick('/admin/settings')} style={{ cursor: 'pointer' }}>
          <div className="admin-user-avatar">{adminInitial}</div>
          <div className="admin-user-details">
            <span className="admin-user-name">{adminName}</span>
            <span className="admin-user-email">{adminEmail}</span>
          </div>
        </div>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
