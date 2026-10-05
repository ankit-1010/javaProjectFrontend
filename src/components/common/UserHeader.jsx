import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import './UserHeader.css';

export const UserHeader = ({ onToggleSidebar }) => {
  const { currentUser, notifications } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = (notifications || []).filter(n => n.unread).length;
  const displayName = currentUser?.fullName?.split(' ')[0] || currentUser?.fullName || 'User';

  return (
    <header className="user-top-header">
      <div className="header-left-group">
        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-header-hamburger" 
          onClick={onToggleSidebar}
          aria-label="Open sidebar menu"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Input */}
        <div className="header-search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="header-search-input"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="header-right-actions">
        {/* Notifications */}
        <div className="notification-dropdown-container">
          <button 
            className="header-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge-dot" />}
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="popover-header">
                <h4>Notifications</h4>
                <span className="unread-text">{unreadCount} new</span>
              </div>
              <div className="popover-list">
                {(notifications || []).map(n => (
                  <div key={n.id} className={`popover-item ${n.unread ? 'unread' : ''}`}>
                    <p className="popover-item-text">{n.text}</p>
                    <span className="popover-item-time">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar dropdown */}
        <div className="user-avatar-pill" onClick={() => navigate('/profile')}>
          <div className="user-avatar-circle">
            {currentUser?.avatar || displayName.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-meta-text">
            <span className="user-display-name">{displayName}</span>
            <span className="user-display-role">{currentUser?.role || 'User'}</span>
          </div>
          <ChevronDown size={14} className="user-chevron" />
        </div>
      </div>
    </header>
  );
};
