import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { categoryService } from '../../services/categoryService';
import { StatCard } from '../../components/common/StatCard';
import { AdminUserGrowthChart } from '../../components/admin/AdminUserGrowthChart';
import { AdminDualLineChart } from '../../components/admin/AdminDualLineChart';
import { TransactionTypeChart } from '../../components/admin/TransactionTypeChart';
import { UserActivityChart } from '../../components/admin/UserActivityChart';
import { TopCategoriesList } from '../../components/admin/TopCategoriesList';
import { MonthlyRevenueChart } from '../../components/admin/MonthlyRevenueChart';
import { 
  Download, 
  Calendar, 
  Users, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';
import './AdminReportsPage.css';

export const AdminReportsPage = () => {
  const [dateRange, setDateRange] = useState('Jan 1, 2024 - Dec 31, 2024');
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    adminService.getStats().then(data => setStats(data));
    categoryService.getAllCategories().then(data => setCategories(data || []));
  }, []);

  const totalUsers = stats?.totalUsers ?? 0;
  const totalTransactions = stats?.totalTransactions ?? 0;
  const totalIncome = Number(stats?.totalIncome) || 0;
  const totalExpenses = Number(stats?.totalExpenses) || 0;

  const handleDownloadReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Users', totalUsers],
      ['User Growth', stats?.userGrowth || 'N/A'],
      ['Total Transactions', totalTransactions],
      ['Transaction Growth', stats?.txGrowth || 'N/A'],
      ['Total Income', `₹${totalIncome}`],
      ['Income Growth', stats?.incomeGrowth || 'N/A'],
      ['Total Expenses', `₹${totalExpenses}`],
      ['Expense Growth', stats?.expenseGrowth || 'N/A'],
      ['Generated On', new Date().toISOString()]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MapFinance_admin_analytics_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-reports-wrapper">
      {/* Header matching Image 2 item 5 */}
      <div className="page-header-row">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Detailed insights about your platform</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="tx-dropdown-pill">
            <Calendar size={15} />
            <span>{dateRange}</span>
          </div>
          <button className="btn-download-report" onClick={handleDownloadReport}>
            <Download size={16} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards dynamically bound */}
      <div className="admin-stats-grid">
        <StatCard
          title="New Users"
          value={totalUsers.toLocaleString()}
          change={stats?.userGrowth || (totalUsers > 0 ? "Platform users" : "0")}
          changeType="positive"
          icon={Users}
          iconBg="#EFF6FF"
        />

        <StatCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString('en-IN')}`}
          change={stats?.incomeGrowth || (totalIncome > 0 ? "Recorded income" : "₹0")}
          changeType="positive"
          icon={ArrowDownLeft}
          iconBg="#ECFDF5"
        />

        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          change={stats?.expenseGrowth || (totalExpenses > 0 ? "Recorded expenses" : "₹0")}
          changeType="positive"
          icon={ArrowUpRight}
          iconBg="#FEF2F2"
        />

        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          change={stats?.txGrowth || (totalTransactions > 0 ? "Recorded transactions" : "0")}
          changeType="positive"
          icon={CreditCard}
          iconBg="#EFF6FF"
        />
      </div>

      {/* Row 1 Charts: User Registration Trend & Income vs Expenses */}
      <div className="admin-charts-grid">
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>User Registration Trend</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <AdminUserGrowthChart totalUsers={totalUsers} />
        </div>

        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>Income vs Expenses</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <AdminDualLineChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>
      </div>

      {/* Row 2: Transaction Type Distribution & User Activity Donut Charts */}
      <div className="admin-charts-grid">
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>Transaction Type Distribution</h3>
          </div>
          <TransactionTypeChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
        </div>

        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>User Activity</h3>
          </div>
          <UserActivityChart totalUsers={totalUsers} />
        </div>
      </div>

      {/* Row 3: Top Categories & Monthly Revenue */}
      <div className="admin-charts-grid">
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>Top Categories by Transactions</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <TopCategoriesList categories={categories} />
        </div>

        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>Monthly Revenue</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <MonthlyRevenueChart totalIncome={totalIncome} />
        </div>
      </div>
    </div>
  );
};
