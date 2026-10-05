import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { userService } from '../../services/userService';
import { User, Shield, Bell, CheckCircle, AlertCircle, Upload, Loader } from 'lucide-react';
import './AdminSettingsPage.css';

export const AdminSettingsPage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName || 'Admin');
      setEmail(currentUser.email || 'admin@gmail.com');
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setErrorMsg('');
    setLoading(true);

    try {
      const updated = await userService.updateProfile({
        fullName: name.trim(),
        avatar: name.trim().charAt(0).toUpperCase()
      });
      setCurrentUser(updated);
      setSaveSuccess('Admin profile updated successfully in Aiven MySQL!');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update admin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setErrorMsg('');

    if (newPw !== confirmPw) {
      setErrorMsg('New password and confirm password do not match');
      return;
    }

    if (newPw.length < 6) {
      setErrorMsg('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await adminService.changePassword({
        currentPassword: currentPw,
        newPassword: newPw,
        confirmPassword: confirmPw
      });
      setSaveSuccess('Admin password updated successfully with BCrypt in database!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change admin password');
    } finally {
      setLoading(false);
    }
  };

  const adminInitial = currentUser?.avatar || name.charAt(0).toUpperCase() || 'A';

  return (
    <div className="admin-settings-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Admin Settings</h2>
          <p>Manage your platform administrator profile and account credentials</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-settings-tabs">
        <button
          className={`admin-setting-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => { setActiveTab('profile'); setErrorMsg(''); setSaveSuccess(''); }}
        >
          <User size={16} />
          <span>Profile</span>
        </button>

        <button
          className={`admin-setting-tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => { setActiveTab('security'); setErrorMsg(''); setSaveSuccess(''); }}
        >
          <Shield size={16} />
          <span>Security</span>
        </button>

        <button
          className={`admin-setting-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => { setActiveTab('notifications'); setErrorMsg(''); setSaveSuccess(''); }}
        >
          <Bell size={16} />
          <span>System Alerts</span>
        </button>
      </div>

      {/* Main Settings Card */}
      <div className="admin-settings-card">
        {saveSuccess && (
          <div className="admin-settings-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ECFDF5', color: '#065F46', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #A7F3D0' }}>
            <CheckCircle size={18} />
            <span>{saveSuccess}</span>
          </div>
        )}

        {errorMsg && (
          <div className="admin-settings-alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FEF2F2', color: '#991B1B', padding: '0.85rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #FECACA' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="admin-settings-form">
            <h3 className="settings-section-title">Profile Information</h3>

            {/* Photo section */}
            <div className="admin-photo-row">
              <div className="admin-photo-avatar">{adminInitial}</div>
              <div className="photo-actions">
                <button 
                  type="button" 
                  className="btn-change-photo" 
                  disabled
                  title="Photo storage is not configured"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <Upload size={14} />
                  <span>Photo Upload (Unavailable)</span>
                </button>
                <span className="photo-hint">Profile photo storage service is currently unconfigured</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="admin-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Administrator Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Administrator Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  disabled
                  style={{ backgroundColor: '#F1F5F9', cursor: 'not-allowed' }}
                />
                <small style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '0.25rem' }}>Primary admin identity account</small>
              </div>
            </div>

            <div className="admin-form-submit-row">
              <button type="submit" className="btn-save-admin-changes" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="admin-settings-form">
            <h3 className="settings-section-title">Security & Password</h3>

            <div className="password-inputs-grid">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter current password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (min 6 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-form-submit-row">
              <button type="submit" className="btn-save-admin-changes" disabled={loading}>
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'notifications' && (
          <div className="admin-settings-form">
            <h3 className="settings-section-title">System Alert Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Notify when new user registers</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Notify on high-value transaction creation (over ₹50,000)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <span>Daily system transaction audit summaries</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
