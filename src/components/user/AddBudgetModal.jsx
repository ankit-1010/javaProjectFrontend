import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddBudgetModal = ({ isOpen, onClose, onAdd }) => {
  const [category, setCategory] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !allocatedAmount) return;

    onAdd({
      category,
      allocatedAmount: parseFloat(allocatedAmount),
      spentAmount: 0,
      monthYear: 'September 2026',
      icon: 'Wallet',
      color: '#3B82F6'
    });

    setCategory('');
    setAllocatedAmount('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Category Budget</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Category</label>
            <input 
              type="text" 
              placeholder="e.g. Travel, Entertainment, Fitness" 
              className="form-input" 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Budget Limit (₹)</label>
            <input 
              type="number" 
              placeholder="e.g. 5000" 
              className="form-input" 
              value={allocatedAmount} 
              onChange={e => setAllocatedAmount(e.target.value)} 
              required 
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-submit">Create Budget</button>
          </div>
        </form>
      </div>
    </div>
  );
};
