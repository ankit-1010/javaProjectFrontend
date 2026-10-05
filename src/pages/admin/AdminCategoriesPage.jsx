import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { AddCategoryModal } from '../../components/admin/AddCategoryModal';
import { 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  FileText, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  MoreHorizontal,
  Edit2,
  Trash2,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import './AdminCategoriesPage.css';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddCategory = async (newCat) => {
    setErrorMsg('');
    try {
      await categoryService.createCategory(newCat);
      showNotification(`Category "${newCat.name}" added successfully`);
      await loadCategories();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to add category');
    }
  };

  const handleEditCategory = async (cat) => {
    const newName = prompt('Enter updated category name:', cat.name);
    if (!newName || newName.trim() === cat.name) return;

    setErrorMsg('');
    try {
      await categoryService.updateCategory(cat.id, { ...cat, name: newName.trim() });
      showNotification(`Category updated to "${newName.trim()}"`);
      await loadCategories();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update category');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"? This action cannot be undone.`)) {
      setErrorMsg('');
      try {
        await categoryService.deleteCategory(id);
        showNotification(`Category "${name}" deleted from database`);
        await loadCategories();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete category');
      }
    }
  };

  const getCategoryIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'utensils': return <Utensils size={22} />;
      case 'car': return <Car size={22} />;
      case 'shoppingbag': return <ShoppingBag size={22} />;
      case 'filetext': return <FileText size={22} />;
      case 'graduationcap': return <GraduationCap size={22} />;
      case 'heart': return <Heart size={22} />;
      case 'gamepad2': return <Gamepad2 size={22} />;
      default: return <MoreHorizontal size={22} />;
    }
  };

  const getCardIconColor = (name) => {
    switch (name?.toLowerCase()) {
      case 'food': return { bg: '#EFF6FF', color: '#2563EB' };
      case 'transport': return { bg: '#ECFDF5', color: '#10B981' };
      case 'shopping': return { bg: '#FDF2F8', color: '#EC4899' };
      case 'bills': return { bg: '#FEF3C7', color: '#F59E0B' };
      case 'education': return { bg: '#F5F3FF', color: '#8B5CF6' };
      case 'health': return { bg: '#FEF2F2', color: '#EF4444' };
      case 'entertainment': return { bg: '#EFF6FF', color: '#3B82F6' };
      default: return { bg: '#F3E8FF', color: '#7C3AED' };
    }
  };

  return (
    <div className="admin-categories-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Categories Management</h2>
          <p>Manage all transaction categories in Aiven MySQL</p>
        </div>
        <button className="btn-add-tx-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Add Category</span>
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

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          <Loader className="spin" size={24} style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
          <p>Loading categories from database...</p>
        </div>
      ) : (
        <div className="admin-categories-grid">
          {categories.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748B', padding: '2rem' }}>
              No categories found. Click "Add Category" to create one.
            </p>
          ) : (
            categories.map(c => {
              const style = getCardIconColor(c.name);
              return (
                <div key={c.id} className="category-admin-card">
                  <div className="cat-card-left">
                    <div className="cat-icon-circle" style={{ backgroundColor: style.bg, color: style.color }}>
                      {getCategoryIcon(c.icon)}
                    </div>
                    <div className="cat-card-info">
                      <h3>{c.name}</h3>
                      <p>{c.transactionCount || 0} transactions</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="cat-card-actions">
                    <button 
                      className="cat-action-btn edit" 
                      title="Edit Category"
                      onClick={() => handleEditCategory(c)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="cat-action-btn delete" 
                      title="Delete Category"
                      onClick={() => handleDelete(c.id, c.name)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </div>
  );
};
