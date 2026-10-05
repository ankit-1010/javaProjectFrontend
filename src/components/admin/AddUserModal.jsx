import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [status, setStatus] = useState('Active');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onAdd({
      fullName: fullName.trim(),
      email: email.trim(),
      password: password || 'password123',
      role,
      status,
      phone: phone.trim()
    });

    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" placeholder="e.g. Rahul Sharma" className="form-input" value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" placeholder="e.g. user@gmail.com" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Password (Optional, defaults to password123)</label>
            <input type="password" placeholder="••••••••" className="form-input" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="text" placeholder="e.g. +91 9876543210" className="form-input" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
              <label className="form-label">Role</label>
              <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: '120px' }}>
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-submit">Create User</button>
          </div>
        </form>
      </div>
    </div>
  );
};
