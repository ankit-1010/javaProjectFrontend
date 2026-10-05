import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { goalService } from '../../services/goalService';
import { AddGoalModal } from '../../components/user/AddGoalModal';
import { SavingsProgressChart } from '../../components/user/SavingsProgressChart';
import { Plus, Laptop, Plane, Shield, Target, Trash2, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import './GoalsPage.css';

export const GoalsPage = () => {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadGoals();
  }, [currentUser]);

  const loadGoals = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await goalService.getMyGoals();
      setGoals(data || []);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load financial goals');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleAddGoal = async (newG) => {
    setErrorMsg('');
    try {
      await goalService.createGoal(newG);
      showNotification('Goal created and saved to Aiven MySQL');
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      await loadGoals();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create goal');
    }
  };

  const handleAddSavings = async (goal) => {
    const amountStr = prompt(`Add savings to "${goal.title}" (Current: ₹${goal.savedAmount} / Target: ₹${goal.targetAmount}):`, '5000');
    if (!amountStr) return;
    const addAmt = parseFloat(amountStr);
    if (isNaN(addAmt) || addAmt <= 0) {
      alert('Please enter a valid positive savings amount.');
      return;
    }

    const updatedSaved = (Number(goal.savedAmount) || 0) + addAmt;
    setErrorMsg('');
    try {
      await goalService.updateGoal(goal.id, { ...goal, savedAmount: updatedSaved });
      showNotification(`Added ₹${addAmt.toLocaleString('en-IN')} to "${goal.title}"`);
      if (updatedSaved >= Number(goal.targetAmount)) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        alert(`🎉 Congratulations! You achieved your goal: ${goal.title}!`);
      }
      await loadGoals();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete goal "${title}"?`)) {
      setErrorMsg('');
      try {
        await goalService.deleteGoal(id);
        showNotification(`Goal "${title}" removed`);
        await loadGoals();
      } catch (err) {
        setErrorMsg(err.message || 'Failed to delete goal');
      }
    }
  };

  const getGoalIcon = (iconName) => {
    switch (iconName?.toLowerCase()) {
      case 'laptop': return <Laptop size={22} />;
      case 'plane': return <Plane size={22} />;
      case 'shield': return <Shield size={22} />;
      default: return <Target size={22} />;
    }
  };

  return (
    <div className="goals-page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Financial Goals</h2>
          <p>Set targets, contribute funds, and track real progress in Aiven MySQL.</p>
        </div>
        <button className="btn-add-tx-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>Add Goal</span>
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

      {/* Goal Cards Row */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
          <Loader className="spin" size={24} style={{ display: 'inline-block', marginBottom: '0.5rem' }} />
          <p>Loading financial goals...</p>
        </div>
      ) : (
        <div className="goals-cards-grid">
          {goals.length === 0 ? (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#64748B', padding: '2rem' }}>
              No goals set up yet. Click "Add Goal" to begin your financial journey.
            </p>
          ) : (
            goals.map(goal => {
              const target = Number(goal.targetAmount) || 1;
              const saved = Number(goal.savedAmount) || 0;
              const percent = Math.min(100, Math.round((saved / target) * 100));

              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-card-header">
                    <div className="goal-icon-box">
                      {getGoalIcon(goal.icon)}
                    </div>
                    <h3 className="goal-title">{goal.title}</h3>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id, goal.title)}
                      title="Delete Goal"
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="goal-amounts-row">
                    <span className="goal-saved">₹{saved.toLocaleString('en-IN')}</span>
                    <span className="goal-target"> / ₹{target.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="goal-progress-wrap">
                    <div className="goal-progress-track">
                      <div className="goal-progress-bar" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="goal-percent-text">{percent}%</span>
                  </div>

                  <div className="goal-card-footer">
                    <span className="goal-target-date">Target: {goal.targetDate}</span>
                    <button className="btn-add-funds" onClick={() => handleAddSavings(goal)}>
                      + Add Funds
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Savings Progress Card */}
      <div className="savings-progress-card">
        <div className="savings-card-header">
          <h3>Savings Progress</h3>
        </div>

        <div className="savings-chart-body">
          <SavingsProgressChart goals={goals} />
        </div>
      </div>

      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGoal}
      />
    </div>
  );
};
