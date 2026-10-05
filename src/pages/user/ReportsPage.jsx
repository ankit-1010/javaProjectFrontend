import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/transactionService';
import { MonthlyExpensesTrendChart } from '../../components/user/MonthlyExpensesTrendChart';
import { ExpenseDonutChart } from '../../components/user/ExpenseDonutChart';
import { Calendar, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import './ReportsPage.css';

export const ReportsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (currentUser?.id) {
      transactionService.getUserTransactions(currentUser.id, 'All').then(data => {
        setTransactions(data || []);
      });
    }
  }, [currentUser]);

  // Compute metrics from actual transactions
  const expenses = transactions.filter(t => t.type?.toLowerCase() === 'expense');

  let highestTx = null;
  let lowestTx = null;

  if (expenses.length > 0) {
    highestTx = expenses.reduce((max, t) => Number(t.amount) > Number(max.amount) ? t : max, expenses[0]);
    lowestTx = expenses.reduce((min, t) => Number(t.amount) < Number(min.amount) ? t : min, expenses[0]);
  }

  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const avgMonthlyExpense = expenses.length > 0 ? Math.round(totalExpense / Math.max(1, new Set(expenses.map(e => e.transactionDate?.slice(0, 7))).size)) : 0;

  return (
    <div className="reports-page-wrapper">
      {/* Header matching Image 1 item 8 */}
      <div className="page-header-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Analyze your spending patterns.</p>
        </div>
        <div className="tx-dropdown-pill">
          <Calendar size={15} />
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="September 2026">September 2026</option>
            <option value="August 2026">August 2026</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="reports-tabs-bar">
        {['Overview', 'Category Analysis', 'Monthly Trend'].map(tab => (
          <button
            key={tab}
            className={`report-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2 Charts Grid */}
      <div className="reports-charts-grid">
        {/* Monthly Expenses Trend */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h3>Monthly Expenses Trend</h3>
          </div>
          <div className="chart-card-body">
            <MonthlyExpensesTrendChart transactions={transactions} />
          </div>
        </div>

        {/* Category Wise Expenses */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h3>Category Wise Expenses</h3>
          </div>
          <div className="chart-card-body">
            <ExpenseDonutChart transactions={transactions} />
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Badges calculated dynamically */}
      <div className="reports-metrics-row">
        {/* Highest Expense */}
        <div className="metric-badge-box">
          <div className="metric-badge-icon purple">
            <ArrowUpRight size={22} />
          </div>
          <div className="metric-badge-info">
            <span className="metric-badge-label">Highest Expense</span>
            <div className="metric-badge-val">
              {highestTx ? `₹${Number(highestTx.amount).toLocaleString('en-IN')}` : '₹0'}
            </div>
            <span className="metric-badge-desc">
              {highestTx ? `${highestTx.category} (${highestTx.description})` : 'No expenses recorded'}
            </span>
          </div>
        </div>

        {/* Lowest Expense */}
        <div className="metric-badge-box">
          <div className="metric-badge-icon green">
            <ArrowDownRight size={22} />
          </div>
          <div className="metric-badge-info">
            <span className="metric-badge-label">Lowest Expense</span>
            <div className="metric-badge-val">
              {lowestTx ? `₹${Number(lowestTx.amount).toLocaleString('en-IN')}` : '₹0'}
            </div>
            <span className="metric-badge-desc">
              {lowestTx ? `${lowestTx.category} (${lowestTx.description})` : 'No expenses recorded'}
            </span>
          </div>
        </div>

        {/* Average Monthly Expense */}
        <div className="metric-badge-box">
          <div className="metric-badge-icon blue">
            <Activity size={22} />
          </div>
          <div className="metric-badge-info">
            <span className="metric-badge-label">Average Monthly Expense</span>
            <div className="metric-badge-val">
              {`₹${avgMonthlyExpense.toLocaleString('en-IN')}`}
            </div>
            <span className="metric-badge-desc">
              {expenses.length > 0 ? 'Calculated from actual transactions' : 'No data recorded'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
