import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import { userService } from '../../services/userService';
import { StatCard } from '../../components/common/StatCard';
import { IncomeExpenseBarChart } from '../../components/user/IncomeExpenseBarChart';
import { ExpenseDonutChart } from '../../components/user/ExpenseDonutChart';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Calendar, Loader, AlertCircle } from 'lucide-react';
import './DashboardPage.css';

export const DashboardPage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('All Months');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [txData, profileData] = await Promise.all([
        transactionService.getMyTransactions('All'),
        userService.getCurrentProfile()
      ]);
      setTransactions(txData || []);
      if (profileData) {
        setCurrentUser(profileData);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Dynamic calculations from user transactions
  const totalIncome = transactions
    .filter(t => t.type?.toLowerCase() === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter(t => t.type?.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalBalance = currentUser?.totalBalance != null 
    ? Number(currentUser.totalBalance) 
    : (totalIncome - totalExpenses);

  const totalSavings = totalIncome > totalExpenses ? totalIncome - totalExpenses : 0;
  const userName = currentUser?.fullName?.split(' ')[0] || 'User';

  return (
    <div className="dashboard-content-page">
      {/* Top Banner */}
      <div className="dashboard-welcome-header">
        <div className="welcome-text-group">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Here is your real-time financial overview powered by Aiven MySQL.</p>
        </div>

        <div className="date-selector-pill">
          <Calendar size={16} className="date-icon" />
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(e.target.value)}
            className="date-select"
          >
            <option value="All Months">All Records</option>
            <option value="Current">Current Period</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: '#FEF2F2', color: '#991B1B', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #FECACA' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748B' }}>
          <Loader className="spin" size={28} style={{ display: 'inline-block', marginBottom: '0.75rem' }} />
          <p>Loading real-time financial metrics...</p>
        </div>
      ) : (
        <>
          {/* 4 Stat Cards dynamically calculated */}
          <div className="dashboard-stat-cards-grid">
            {/* Total Balance */}
            <StatCard
              title="Total Balance"
              value={`₹${totalBalance.toLocaleString('en-IN')}`}
              change={transactions.length > 0 ? "Real-time sync" : "No balance yet"}
              changeType="positive"
              icon={Wallet}
              iconBg="#EEF2FF"
            />

            {/* Total Income */}
            <StatCard
              title="Total Income"
              value={`₹${totalIncome.toLocaleString('en-IN')}`}
              change={totalIncome > 0 ? `${transactions.filter(t => t.type?.toLowerCase() === 'income').length} credits` : "₹0 recorded"}
              changeType="positive"
              icon={TrendingUp}
              iconBg="#ECFDF5"
            />

            {/* Total Expenses */}
            <StatCard
              title="Total Expenses"
              value={`₹${totalExpenses.toLocaleString('en-IN')}`}
              change={totalExpenses > 0 ? `${transactions.filter(t => t.type?.toLowerCase() === 'expense').length} debits` : "₹0 recorded"}
              changeType="positive"
              icon={TrendingDown}
              iconBg="#FEF2F2"
            />

            {/* Total Savings */}
            <StatCard
              title="Total Savings"
              value={`₹${totalSavings.toLocaleString('en-IN')}`}
              change={totalSavings > 0 ? "Net surplus" : "₹0 surplus"}
              changeType="positive"
              icon={PiggyBank}
              iconBg="#EFF6FF"
            />
          </div>

          {/* 2 Main Visual Cards */}
          <div className="dashboard-charts-grid">
            {/* Chart 1: Income vs Expenses */}
            <div className="dashboard-chart-card">
              <div className="chart-card-header">
                <h3>Income vs Expenses</h3>
              </div>
              <div className="chart-card-body">
                <IncomeExpenseBarChart transactions={transactions} />
              </div>
            </div>

            {/* Chart 2: Expense Breakdown */}
            <div className="dashboard-chart-card">
              <div className="chart-card-header">
                <h3>Expense Breakdown</h3>
              </div>
              <div className="chart-card-body">
                <ExpenseDonutChart transactions={transactions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
