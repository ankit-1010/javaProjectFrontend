import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AddUserModal } from '../../components/admin/AddUserModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import './AdminUsersPage.css';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const pageSize = 8;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await adminService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load users from database');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddUser = async (newUser) => {
    setErrorMsg('');
    try {
      await adminService.createUser(newUser);
      showNotification('User added successfully to database');
      await loadUsers();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to remove this user from the database? This action cannot be undone.')) {
      setErrorMsg('');
      try {
        await adminService.deleteUser(id);
        showNotification('User deleted successfully from database');
        await loadUsers();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (user) => {
    setErrorMsg('');
    try {
      await adminService.toggleUserStatus(user.id);
      showNotification(`Status updated to ${user.status === 'Active' ? 'Inactive' : 'Active'}`);
      await loadUsers();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update user status');
    }
  };

  const handleEditUser = async (user) => {
    const newName = prompt('Enter updated full name for user:', user.fullName);
    if (!newName || newName.trim() === user.fullName) return;

    setErrorMsg('');
    try {
      await adminService.updateUser(user.id, { ...user, fullName: newName.trim() });
      showNotification('User details updated successfully');
      await loadUsers();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update user');
    }
  };

  // Filter users
  let filteredUsers = users.filter(u => {
    const matchesSearch = (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort users
  if (sortBy === 'Name') {
    filteredUsers = [...filteredUsers].sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  } else if (sortBy === 'Date') {
    filteredUsers = [...filteredUsers].sort((a, b) => new Date(b.joinedOn || 0) - new Date(a.joinedOn || 0));
  } else if (sortBy === 'Txns') {
    filteredUsers = [...filteredUsers].sort((a, b) => (b.txCount || 0) - (a.txCount || 0));
  }

  // Real Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const visibleUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  return (
    <div className="admin-users-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Users Management</h2>
          <p>Manage all registered users in Aiven MySQL</p>
        </div>
        <button className="btn-add-tx-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="admin-feedback-banner success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#ECFDF5', color: '#065F46', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #A7F3D0' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="admin-feedback-banner error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #FECACA' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="admin-filter-bar">
        {/* Search */}
        <div className="admin-filter-search">
          <Search size={16} className="tx-search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        {/* All Status dropdown */}
        <div className="tx-dropdown-pill">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Sort by dropdown */}
        <div className="tx-dropdown-pill">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="Default">Sort by Default</option>
            <option value="Name">Sort by Name</option>
            <option value="Date">Sort by Joined Date</option>
            <option value="Txns">Sort by Transactions</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <Loader className="spin" size={24} style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
            <p>Loading users from database...</p>
          </div>
        ) : (
          <table className="admin-data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Transactions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                visibleUsers.map((u, index) => (
                  <tr key={u.id}>
                    <td className="row-num-cell">{startIndex + index + 1}</td>
                    <td>
                      <div className="user-name-cell">
                        <div className="mini-avatar">{u.avatar || (u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U')}</div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.joinedOn || 'N/A'}</td>
                    <td className="amount-bold">{u.txCount ?? 0}</td>
                    <td>
                      <span 
                        className={`admin-status-badge ${u.status ? u.status.toLowerCase() : 'active'}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle status"
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="tx-actions-cell">
                      <button 
                        className="action-btn view-btn" 
                        title="View User"
                        onClick={() => alert(`User Details:\nName: ${u.fullName}\nEmail: ${u.email}\nRole: ${u.role}\nPhone: ${u.phone || 'N/A'}\nStatus: ${u.status}\nJoined: ${u.joinedOn}\nTransactions: ${u.txCount || 0}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit-btn" 
                        title="Edit User"
                        onClick={() => handleEditUser(u)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        title="Delete User"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Real Working Pagination */}
        <div className="admin-pagination-row">
          <span className="pagination-info">
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + pageSize, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className="pagination-controls">
            <button 
              className="page-nav-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={validCurrentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
              <button 
                key={pageNum} 
                className={`page-num-btn ${validCurrentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}

            <button 
              className="page-nav-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={validCurrentPage >= totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};
