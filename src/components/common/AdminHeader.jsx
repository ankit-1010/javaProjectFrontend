import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import './AdminHeader.css';

export const AdminHeader = () => {
  const { currentUser, notifications } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const adminName = currentUser?.fullName || 'Admin';
  const adminInitial = currentUser?.avatar || adminName.charAt(0).toUpperCase() || 'A';

  return (
    <header className="admin-top-header">
      {/* Search Input */}
      <div className="admin-search-bar">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search anything..." 
          className="admin-search-input"
        />
      </div>

      {/* Right controls */}
      <div className="admin-right-actions">
        {/* Notifications */}
        <div className="admin-notification-container">
          <button 
            className="admin-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="admin-badge-dot" />
          </button>

          {showNotifications && (
            <div className="admin-notifications-popover">
              <div className="popover-header">
                <h4>System Alerts</h4>
                <span className="unread-text">1 new</span>
              </div>
              <div className="popover-list">
                <div className="popover-item unread">
                  <p className="popover-item-text">Aiven MySQL database connected and verified</p>
                  <span className="popover-item-time">Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar */}
        <div className="admin-header-avatar-pill" onClick={() => navigate('/admin/settings')} style={{ cursor: 'pointer' }}>
          <div className="admin-header-avatar">{adminInitial}</div>
          <span className="admin-header-name">{adminName}</span>
          <ChevronDown size={14} className="admin-chevron" />
        </div>
      </div>
    </header>
  );
};
