import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserSidebar } from './components/common/UserSidebar';
import { AdminSidebar } from './components/common/AdminSidebar';
import { UserHeader } from './components/common/UserHeader';
import { AdminHeader } from './components/common/AdminHeader';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';

// User pages
import { DashboardPage } from './pages/user/DashboardPage';
import { TransactionsPage } from './pages/user/TransactionsPage';
import { BudgetsPage } from './pages/user/BudgetsPage';
import { GoalsPage } from './pages/user/GoalsPage';
import { ReportsPage } from './pages/user/ReportsPage';
import { ProfilePage } from './pages/user/ProfilePage';

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminTransactionsPage } from './pages/admin/AdminTransactionsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

import './App.css';

// Protected Layout for User Pages
const UserLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-app-layout">
      <UserSidebar />
      <div className="dashboard-main-area">
        <UserHeader />
        <main className="dashboard-view-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Protected Layout for Admin Pages
const AdminLayout = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin) {
    // Normal users attempting admin routes are blocked
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="dashboard-app-layout admin-mode">
      <AdminSidebar />
      <div className="dashboard-main-area">
        <AdminHeader />
        <main className="dashboard-view-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage defaultSignUp={false} />} />
      <Route path="/register" element={<LoginPage defaultSignUp={true} />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected User Routes */}
      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
        <Route path="/admin/categories" element={<AdminCategoriesPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
