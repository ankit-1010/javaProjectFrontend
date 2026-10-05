import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/transactionService';
import { 
  Download, 
  Search, 
  Calendar, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import './AdminTransactionsPage.css';

export const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Jan 1, 2024 - Dec 31, 2024');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // View / Edit modal state
  const [viewTx, setViewTx] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const [editFormData, setEditFormData] = useState({ amount: '', description: '', category: '', type: 'expense' });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,User,Type,Category,Amount,Date,Status\n';
    const rows = filtered.map(t => `${t.id},"${t.userName || 'User'}",${t.type},"${t.category}",${t.amount},${t.transactionDate},${t.status || 'Completed'}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MapFinance_all_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction permanently from the database?')) {
      try {
        await transactionService.deleteTransaction(id);
        await loadTransactions();
      } catch (err) {
        alert(err.message || 'Failed to delete transaction');
      }
    }
  };

  const handleOpenEdit = (t) => {
    setEditTx(t);
    setEditFormData({
      amount: t.amount,
      description: t.description || '',
      category: t.category || '',
      type: t.type || 'expense'
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.amount || Number(editFormData.amount) <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }
    try {
      await transactionService.updateTransaction(editTx.id, {
        ...editTx,
        amount: parseFloat(editFormData.amount),
        description: editFormData.description,
        category: editFormData.category,
        type: editFormData.type
      });
      setEditTx(null);
      await loadTransactions();
    } catch (err) {
      alert(err.message || 'Failed to update transaction');
    }
  };

  const filtered = transactions.filter(t => {
    const matchesSearch = (t.userName && t.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'All' || t.type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesCat = categoryFilter === 'All' || t.category?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesType && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const validCurrentPage = Math.min(currentPage, totalPages);
  const visibleTransactions = filtered.slice((validCurrentPage - 1) * pageSize, validCurrentPage * pageSize);

  return (
    <div className="admin-transactions-wrapper">
      {/* Header matching Image 2 item 3 */}
      <div className="page-header-row">
        <div>
          <h2>Transactions Management</h2>
          <p>View and manage all user transactions</p>
        </div>
        <button className="btn-export-csv" onClick={handleExportCSV}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>

      {error && <div className="admin-error-banner" style={{ marginBottom: '1rem', color: '#DC2626', background: '#FEE2E2', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}

      {/* Filter Row matching screenshot */}
      <div className="admin-filter-bar">
        {/* Search */}
        <div className="admin-filter-search">
          <Search size={16} className="tx-search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* Types */}
        <div className="tx-dropdown-pill">
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        {/* Categories */}
        <div className="tx-dropdown-pill">
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Categories</option>
            <option value="Salary">Salary</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Freelance">Freelance</option>
            <option value="Investment">Investment</option>
            <option value="Health">Health</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="tx-dropdown-pill">
          <Calendar size={15} />
          <span>{dateRange}</span>
        </div>
      </div>

      {/* Table matching Image 2 item 3 */}
      <div className="admin-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>User</th>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="empty-table-cell">Loading transactions from database...</td>
              </tr>
            ) : visibleTransactions.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-cell">No transactions found.</td>
              </tr>
            ) : (
              visibleTransactions.map((t, idx) => (
                <tr key={t.id}>
                  <td className="row-num-cell">{(validCurrentPage - 1) * pageSize + idx + 1}</td>
                  <td className="user-name-cell">
                    <span>{t.userName || 'User'}</span>
                  </td>
                  <td>
                    <span className={`admin-type-tag ${t.type?.toLowerCase()}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="text-muted">{t.category}</td>
                  <td className="amount-bold">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                  <td>{t.transactionDate}</td>
                  <td>
                    <span className={`tx-status-pill ${t.status?.toLowerCase() || 'completed'}`}>
                      {t.status || 'Completed'}
                    </span>
                  </td>
                  <td className="tx-actions-cell">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => setViewTx(t)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleOpenEdit(t)}
                      title="Edit Transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => handleDelete(t.id)}
                      title="Delete Transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Real Functional Pagination */}
        <div className="admin-pagination-row">
          <span className="pagination-info">
            Showing {filtered.length > 0 ? (validCurrentPage - 1) * pageSize + 1 : 0} to {Math.min(validCurrentPage * pageSize, filtered.length)} of {filtered.length} transactions
          </span>
          <div className="pagination-controls">
            <button 
              className="page-nav-btn" 
              disabled={validCurrentPage <= 1} 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-num-btn ${validCurrentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="page-nav-btn" 
              disabled={validCurrentPage >= totalPages} 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {viewTx && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '420px', background: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Transaction Details</h3>
              <button onClick={() => setViewTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><strong>ID:</strong> {viewTx.id}</div>
              <div><strong>User:</strong> {viewTx.userName || 'User'}</div>
              <div><strong>Type:</strong> <span className={`admin-type-tag ${viewTx.type?.toLowerCase()}`}>{viewTx.type}</span></div>
              <div><strong>Amount:</strong> ₹{Number(viewTx.amount).toLocaleString('en-IN')}</div>
              <div><strong>Category:</strong> {viewTx.category}</div>
              <div><strong>Description:</strong> {viewTx.description || 'N/A'}</div>
              <div><strong>Date:</strong> {viewTx.transactionDate}</div>
              <div><strong>Status:</strong> {viewTx.status || 'Completed'}</div>
            </div>
            <button onClick={() => setViewTx(null)} style={{ marginTop: '1.25rem', width: '100%', padding: '0.6rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTx && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '450px', background: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Edit Transaction</h3>
              <button onClick={() => setEditTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={editFormData.amount} 
                  onChange={e => setEditFormData({ ...editFormData, amount: e.target.value })} 
                  required 
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Description</label>
                <input 
                  type="text" 
                  value={editFormData.description} 
                  onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} 
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Category</label>
                <input 
                  type="text" 
                  value={editFormData.category} 
                  onChange={e => setEditFormData({ ...editFormData, category: e.target.value })} 
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setEditTx(null)} style={{ flex: 1, padding: '0.6rem', background: '#F1F5F9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '0.6rem', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
