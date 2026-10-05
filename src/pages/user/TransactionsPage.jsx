import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import { AddTransactionModal } from '../../components/user/AddTransactionModal';
import { 
  Plus, 
  Search, 
  Tag, 
  Eye, 
  Edit2, 
  Trash2, 
  Utensils, 
  Car, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  Laptop,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import './TransactionsPage.css';

export const TransactionsPage = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // All, Income, Expense
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadTransactions();
  }, [currentUser]);

  const loadTransactions = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await transactionService.getMyTransactions('All');
      setTransactions(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddTransaction = async (newTx) => {
    setErrorMsg('');
    try {
      await transactionService.createTransaction(newTx);
      showNotification('Transaction added and balance updated in Aiven MySQL');
      await loadTransactions();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create transaction');
    }
  };

  const handleEditTransaction = async (updatedTx) => {
    setErrorMsg('');
    try {
      await transactionService.updateTransaction(updatedTx.id, updatedTx);
      showNotification('Transaction updated and balance recalculated successfully');
      setEditingTx(null);
      await loadTransactions();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction? Balance will be automatically recalculated.')) {
      setErrorMsg('');
      try {
        await transactionService.deleteTransaction(id);
        showNotification('Transaction deleted and balance adjusted');
        await loadTransactions();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete transaction');
      }
    }
  };

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchesTab = activeTab === 'All' || t.type?.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch = (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || t.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesTab && matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'salary': return <Briefcase size={15} />;
      case 'food': return <Utensils size={15} />;
      case 'transport': return <Car size={15} />;
      case 'education': return <GraduationCap size={15} />;
      case 'freelance': return <Laptop size={15} />;
      case 'bills': return <FileText size={15} />;
      case 'shopping': return <ShoppingBag size={15} />;
      default: return <Tag size={15} />;
    }
  };

  return (
    <div className="transactions-page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Transactions</h2>
          <p>Manage and track all your income and expenses.</p>
        </div>
        <button className="btn-add-tx-primary" onClick={() => { setEditingTx(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#ECFDF5', color: '#065F46', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #A7F3D0' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #FECACA' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="tx-filter-bar">
        {/* Tabs: [All, Income, Expense] */}
        <div className="tx-tabs-group">
          {['All', 'Income', 'Expense'].map(tab => (
            <button
              key={tab}
              className={`tx-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="tx-search-input-box">
          <Search size={16} className="tx-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category dropdown */}
        <div className="tx-dropdown-pill">
          <Tag size={15} />
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Education">Education</option>
            <option value="Freelance">Freelance</option>
            <option value="Bills">Bills</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="tx-table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <Loader className="spin" size={24} style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
            <p>Loading transactions...</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table-cell">
                    No transactions recorded yet. Click "Add Transaction" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map(tx => {
                  const isIncome = tx.type?.toLowerCase() === 'income';
                  return (
                    <tr key={tx.id}>
                      <td className="tx-date-cell">
                        {tx.transactionDate}
                      </td>

                      <td className="tx-desc-cell">
                        {tx.description}
                      </td>

                      <td>
                        <div className={`tx-category-badge ${(tx.category || '').toLowerCase()}`}>
                          {getCategoryIcon(tx.category)}
                          <span>{tx.category}</span>
                        </div>
                      </td>

                      <td>
                        <span className={`tx-type-badge ${isIncome ? 'income' : 'expense'}`}>
                          {tx.type}
                        </span>
                      </td>

                      <td className={`tx-amount-cell ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? `+₹${Number(tx.amount).toLocaleString('en-IN')}` : `-₹${Number(tx.amount).toLocaleString('en-IN')}`}
                      </td>

                      <td className="tx-actions-cell">
                        <button 
                          className="action-btn view-btn" 
                          title="View Details"
                          onClick={() => alert(`Transaction Details:\nDescription: ${tx.description}\nCategory: ${tx.category}\nType: ${tx.type}\nAmount: ₹${tx.amount}\nDate: ${tx.transactionDate}\nStatus: ${tx.status}`)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit-btn" 
                          title="Edit Transaction"
                          onClick={() => {
                            setEditingTx(tx);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="action-btn delete-btn" 
                          title="Delete Transaction"
                          onClick={() => handleDelete(tx.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTx(null); }}
        onAdd={handleAddTransaction}
        onEdit={handleEditTransaction}
        editData={editingTx}
      />
    </div>
  );
};
