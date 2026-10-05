import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User, Shield, Bell, Sliders, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // personal, security, notifications, preferences

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setFetching(true);
    try {
      const data = await userService.getCurrentProfile();
      if (data) {
        setFullName(data.fullName || '');
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setCurrentUser(data);
      }
    } catch (err) {
      if (currentUser) {
        setFullName(currentUser.fullName || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
      }
    } finally {
      setFetching(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setErrorMsg('');
    setLoading(true);

    try {
      const updated = await userService.updateProfile({
        fullName: fullName.trim(),
        phone: phone ? phone.trim() : '',
        avatar: fullName.trim().charAt(0).toUpperCase()
      });
      setCurrentUser(updated);
      setSaveSuccess('Profile details updated successfully in Aiven MySQL!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation password do not match');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      setSaveSuccess('Password changed successfully and encrypted with BCrypt in database!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
        <Loader className="spin" size={28} style={{ display: 'inline-block', marginBottom: '0.75rem' }} />
        <p>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Profile Settings</h2>
          <p>Manage your account details and security settings.</p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Left Submenu Navigation */}
        <div className="profile-nav-card">
          <button
            className={`profile-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => { setActiveTab('personal'); setErrorMsg(''); setSaveSuccess(''); }}
          >
            <User size={18} />
            <span>Personal Information</span>
          </button>

          <button
            className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => { setActiveTab('security'); setErrorMsg(''); setSaveSuccess(''); }}
          >
            <Shield size={18} />
            <span>Security</span>
          </button>

          <button
            className={`profile-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => { setActiveTab('notifications'); setErrorMsg(''); setSaveSuccess(''); }}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>

          <button
            className={`profile-nav-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => { setActiveTab('preferences'); setErrorMsg(''); setSaveSuccess(''); }}
          >
            <Sliders size={18} />
            <span>Preferences</span>
          </button>
        </div>

        {/* Right Form Content */}
        <div className="profile-form-card">
          {saveSuccess && (
            <div className="profile-success-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ECFDF5', color: '#065F46', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #A7F3D0' }}>
              <CheckCircle size={18} />
              <span>{saveSuccess}</span>
            </div>
          )}

          {errorMsg && (
            <div className="profile-error-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF2F2', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #FECACA' }}>
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'personal' && (
            <div>
              {/* User Avatar Badge */}
              <div className="profile-user-badge">
                <div className="profile-avatar-large">
                  {currentUser?.avatar || fullName.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="profile-badge-text">
                  <h3>{fullName || 'User Profile'}</h3>
                  <p className="profile-email-text">{email}</p>
                  <span className="profile-joined-text">Member since {currentUser?.joinedOn || 'Recently'}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdateProfile} className="personal-info-form">
                <h4 className="section-title">Personal Information</h4>

                <div className="profile-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    disabled
                    title="Email cannot be changed directly"
                    style={{ backgroundColor: '#F1F5F9', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '0.25rem' }}>Email is your unique account identifier.</small>
                </div>

                <div className="profile-input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>

                <div className="profile-form-footer">
                  <button type="submit" className="btn-update-profile" disabled={loading}>
                    {loading ? 'Saving Changes...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="personal-info-form">
              <h4 className="section-title">Change Password</h4>

              <div className="profile-input-group">
                <label>Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>New Password (min 6 characters)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="profile-form-footer">
                <button type="submit" className="btn-update-profile" disabled={loading}>
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="personal-info-form">
              <h4 className="section-title">Notification Preferences</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>In-app alert on large expenses (over ₹5,000)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Budget limit threshold warning (at 80%)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Monthly financial summary notification</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="personal-info-form">
              <h4 className="section-title">System Preferences</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div className="profile-input-group">
                  <label>Default Currency</label>
                  <select className="form-select">
                    <option>INR (₹) - Indian Rupee</option>
                    <option>USD ($) - US Dollar</option>
                    <option>EUR (€) - Euro</option>
                  </select>
                </div>
                <div className="profile-input-group">
                  <label>Fiscal Year Start</label>
                  <select className="form-select">
                    <option>April (Indian Standard)</option>
                    <option>January (Calendar Year)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
