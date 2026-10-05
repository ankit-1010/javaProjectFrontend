import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState('#3B82F6');
  const [budgetLimit, setBudgetLimit] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    onAdd({
      name,
      icon,
      color,
      type: 'EXPENSE',
      transactionCount: 0,
      budgetLimit: budgetLimit ? parseFloat(budgetLimit) : 0
    });

    setName('');
    setBudgetLimit('');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Category</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Category Name</label>
            <input type="text" placeholder="e.g. Travel, Utilities" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Category Icon Name</label>
            <select className="form-select" value={icon} onChange={e => setIcon(e.target.value)}>
              <option value="Utensils">Utensils (Food)</option>
              <option value="Car">Car (Transport)</option>
              <option value="ShoppingBag">ShoppingBag (Shopping)</option>
              <option value="FileText">FileText (Bills)</option>
              <option value="GraduationCap">GraduationCap (Education)</option>
              <option value="Heart">Heart (Health)</option>
              <option value="Gamepad2">Gamepad2 (Entertainment)</option>
              <option value="Tag">Tag (General)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Accent Color</label>
            <input type="color" className="form-input" style={{ height: '42px', padding: '4px' }} value={color} onChange={e => setColor(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Budget Limit (₹)</label>
            <input type="number" placeholder="e.g. 5000" className="form-input" value={budgetLimit} onChange={e => setBudgetLimit(e.target.value)} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-submit">Create Category</button>
          </div>
        </form>
      </div>
    </div>
  );
};
