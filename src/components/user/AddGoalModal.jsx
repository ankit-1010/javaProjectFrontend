import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddGoalModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('Dec 2026');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onAdd({
      title,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
      targetDate,
      icon: 'Target',
      color: '#3B82F6'
    });

    setTitle('');
    setTargetAmount('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create Financial Goal</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Goal Title</label>
            <input 
              type="text" 
              placeholder="e.g. Dream House, Vacation, Car" 
              className="form-input" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Amount (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 100000" 
              className="form-input" 
              value={targetAmount} 
              onChange={e => setTargetAmount(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Date</label>
            <input 
              type="text" 
              placeholder="e.g. Dec 2026, Jun 2027" 
              className="form-input" 
              value={targetDate} 
              onChange={e => setTargetDate(e.target.value)} 
              required 
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-submit">Add Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
};
