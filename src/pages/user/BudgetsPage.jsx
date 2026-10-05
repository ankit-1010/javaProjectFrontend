import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { budgetService } from '../../services/budgetService';
import { AddBudgetModal } from '../../components/user/AddBudgetModal';
import { 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Lightbulb, 
  GraduationCap, 
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Loader,
  Trash2
} from 'lucide-react';
import './BudgetsPage.css';

export const BudgetsPage = () => {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadBudgets();
  }, [currentUser]);

  const loadBudgets = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await budgetService.getMyBudgets();
      setBudgets(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddBudget = async (newB) => {
    setErrorMsg('');
    try {
      await budgetService.createBudget(newB);
      showNotification('Budget created successfully');
      await loadBudgets();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create budget');
    }
  };

  const handleDeleteBudget = async (id, category) => {
    if (window.confirm(`Delete budget for "${category}"?`)) {
      setErrorMsg('');
      try {
        await budgetService.deleteBudget(id);
        showNotification('Budget removed');
        await loadBudgets();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete budget');
      }
    }
  };

  const getBudgetIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return <Utensils size={20} />;
      case 'transport': return <Car size={20} />;
      case 'shopping': return <ShoppingBag size={20} />;
      case 'bills': return <Lightbulb size={20} />;
      case 'education': return <GraduationCap size={20} />;
      default: return <MoreHorizontal size={20} />;
    }
  };

  const getIconClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'food': return 'food-icon';
      case 'transport': return 'transport-icon';
      case 'shopping': return 'shopping-icon';
      case 'bills': return 'bills-icon';
      case 'education': return 'education-icon';
      default: return 'others-icon';
    }
  };

  return (
    <div className="budgets-page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Budgets</h2>
          <p>Set monthly limits and monitor real transaction spending.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button className="btn-add-tx-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Budget</span>
          </button>
        </div>
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

      {/* Budgets Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          <Loader className="spin" size={24} style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
          <p>Loading budgets and calculating spent amounts...</p>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748B', padding: '3rem' }}>
              No budgets created yet. Click "Add Budget" to allocate category limits.
            </p>
          ) : (
            budgets.map(b => {
              const allocated = Number(b.allocatedAmount) || 1;
              const spent = Number(b.spentAmount) || 0;
              const remaining = Math.max(0, allocated - spent);
              const percent = Math.min(100, Math.round((spent / allocated) * 100));
              const isOver = spent > allocated;

              return (
                <div key={b.id} className="budget-card">
                  <div className="budget-card-top">
                    <div className={`budget-icon-circle ${getIconClass(b.category)}`}>
                      {getBudgetIcon(b.category)}
                    </div>
                    <button 
                      className="budget-dots-btn" 
                      title="Delete Budget"
                      onClick={() => handleDeleteBudget(b.id, b.category)}
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="budget-category-title">
                    {b.category}
                  </div>

                  <div className="budget-amounts-row">
                    <span className="budget-spent">₹{spent.toLocaleString('en-IN')}</span>
                    <span className="budget-allocated"> / ₹{allocated.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="budget-progress-track">
                    <div 
                      className={`budget-progress-fill ${isOver ? 'danger' : ''}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="budget-footer-info">
                    <span>{percent}% spent (₹{remaining.toLocaleString('en-IN')} left)</span>
                    {percent >= 80 && (
                      <span className="budget-warning-tag">
                        <AlertCircle size={12} /> Near limit
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBudget}
      />
    </div>
  );
};
