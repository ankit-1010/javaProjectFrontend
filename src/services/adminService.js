import { apiRequest } from './api';

export const adminService = {
  getStats: async () => {
    return await apiRequest('/admin/stats');
  },

  getUserOverview: async (userId) => {
    return await apiRequest(`/admin/user-overview/${userId}`);
  },

  getAllUsers: async () => {
    return await apiRequest('/users');
  },

  createUser: async (user) => {
    return await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  updateUser: async (id, user) => {
    return await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  },

  toggleUserStatus: async (id) => {
    return await apiRequest(`/users/${id}/status`, {
      method: 'PATCH'
    });
  },

  deleteUser: async (id) => {
    return await apiRequest(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  changePassword: async (passwordData) => {
    return await apiRequest('/admin/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }
};
