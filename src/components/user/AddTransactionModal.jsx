import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddTransactionModal.css';

export const AddTransactionModal = ({ isOpen, onClose, onAdd, onEdit, editData = null, categories = [] }) => {
  const [type, setType] = useState('Income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (editData) {
      setType(editData.type || 'Income');
      setAmount(editData.amount?.toString() || '');
      setCategory(editData.category || '');
      setDescription(editData.description || '');
      setDate(editData.transactionDate || new Date().toISOString().split('T')[0]);
    } else {
      setType('Income');
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description) return;

    const payload = {
      type,
      amount: parseFloat(amount),
      category: category || (type === 'Income' ? 'Salary' : 'Food'),
      description,
      transactionDate: date,
      status: 'Completed'
    };

    if (editData && onEdit) {
      onEdit({ ...editData, ...payload });
    } else {
      onAdd(payload);
    }

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content add-tx-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>{editData ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Type Toggle */}
          <div className="form-group">
            <label className="form-label">Type</label>
            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-btn income-type ${type === 'Income' ? 'active' : ''}`}
                onClick={() => setType('Income')}
              >
                <span className="dot-indicator green" />
                Income
              </button>
              <button
                type="button"
                className={`type-btn expense-type ${type === 'Expense' ? 'active' : ''}`}
                onClick={() => setType('Expense')}
              >
                <span className="dot-indicator red" />
                Expense
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Amount</label>
            <div className="input-with-prefix">
              <span className="input-prefix">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                className="form-input"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                min="1"
                step="any"
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {type === 'Income' ? (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investment">Investment</option>
                  <option value="Gift">Gift</option>
                  <option value="Others">Others</option>
                </>
              ) : (
                <>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Others">Others</option>
                </>
              )}
            </select>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              placeholder="Enter description"
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Footer buttons */}
          <div className="modal-footer">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-submit">
              {editData ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
