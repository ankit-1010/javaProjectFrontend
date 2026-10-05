import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { StatCard } from '../../components/common/StatCard';
import { AdminUserGrowthChart } from '../../components/admin/AdminUserGrowthChart';
import { AdminDualLineChart } from '../../components/admin/AdminDualLineChart';
import { 
  Users, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar 
} from 'lucide-react';
import './AdminDashboardPage.css';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('Jan 1, 2024 - Dec 31, 2024');

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    const data = await adminService.getStats();
    setStats(data);
  };

  const totalUsers = stats?.totalUsers ?? 0;
  const totalTransactions = stats?.totalTransactions ?? 0;
  const totalIncome = Number(stats?.totalIncome) || 0;
  const totalExpenses = Number(stats?.totalExpenses) || 0;

  return (
    <div className="admin-dashboard-wrapper">
      {/* Header matching Image 2 item 1 */}
      <div className="admin-header-row">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Monitor and manage your MapFinance platform</p>
        </div>

        <div className="admin-date-badge">
          <Calendar size={15} />
          <span>{dateRange}</span>
        </div>
      </div>

      {/* 4 Stat Cards dynamically bound to real calculations */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Users"
          value={totalUsers.toLocaleString()}
          change={stats?.userGrowth || (totalUsers > 0 ? "Active platform users" : "No users yet")}
          changeType="positive"
          icon={Users}
          iconBg="#EFF6FF"
        />

        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          change={stats?.txGrowth || (totalTransactions > 0 ? "Recorded transactions" : "No transactions")}
          changeType="positive"
          icon={CreditCard}
          iconBg="#ECFDF5"
        />

        <StatCard
          title="Total Income"
          value={`₹${totalIncome.toLocaleString('en-IN')}`}
          change={stats?.incomeGrowth || (totalIncome > 0 ? "System-wide recorded income" : "₹0 recorded")}
          changeType="positive"
          icon={ArrowDownLeft}
          iconBg="#ECFDF5"
        />

        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          change={stats?.expenseGrowth || (totalExpenses > 0 ? "System-wide recorded expense" : "₹0 recorded")}
          changeType="positive"
          icon={ArrowUpRight}
          iconBg="#FEF2F2"
        />
      </div>

      {/* 2 Charts Grid matching Image 2 item 1 */}
      <div className="admin-charts-grid">
        {/* User Growth */}
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>User Growth</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <div className="admin-chart-body">
            <AdminUserGrowthChart totalUsers={totalUsers} />
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="admin-chart-box">
          <div className="admin-chart-header">
            <h3>Income vs Expenses</h3>
            <span className="selector-tag">This Year</span>
          </div>
          <div className="admin-chart-body">
            <AdminDualLineChart totalIncome={totalIncome} totalExpenses={totalExpenses} />
          </div>
        </div>
      </div>

      {/* Bottom 2 Data Cards: Recent Users & Recent Transactions */}
      <div className="admin-recent-grid">
        {/* Recent Users */}
        <div className="admin-recent-card">
          <div className="recent-card-header">
            <h3>Recent Users</h3>
            <button className="btn-view-all" onClick={() => navigate('/admin/users')}>
              View All
            </button>
          </div>

          <table className="recent-mini-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined On</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map(u => (
                  <tr key={u.id}>
                    <td className="user-name-cell">
                      <div className="mini-avatar">{u.avatar || u.fullName?.charAt(0) || 'U'}</div>
                      <span>{u.fullName}</span>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>{u.joinedOn || 'Recently'}</td>
                    <td>
                      <span className={`admin-status-badge ${u.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8' }}>
                    No registered users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Transactions */}
        <div className="admin-recent-card">
          <div className="recent-card-header">
            <h3>Recent Transactions</h3>
            <button className="btn-view-all" onClick={() => navigate('/admin/transactions')}>
              View All
            </button>
          </div>

          <table className="recent-mini-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
                stats.recentTransactions.map(t => (
                  <tr key={t.id}>
                    <td className="user-name-cell">
                      <div className="mini-avatar">{t.userName?.charAt(0) || 'T'}</div>
                      <span>{t.userName || 'User'}</span>
                    </td>
                    <td>
                      <span className={`admin-type-tag ${t.type?.toLowerCase() === 'income' ? 'income' : 'expense'}`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="amount-bold">₹{Number(t.amount).toLocaleString('en-IN')}</td>
                    <td>{t.transactionDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem', color: '#94A3B8' }}>
                    No transactions recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
