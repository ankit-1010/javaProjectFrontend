import { apiRequest } from './api';

export const budgetService = {
  getMyBudgets: async () => {
    return await apiRequest('/budgets/my');
  },

  getUserBudgets: async (userId) => {
    if (!userId) {
      return await apiRequest('/budgets/my');
    }
    return await apiRequest(`/budgets/user/${userId}`);
  },

  createBudget: async (budget) => {
    return await apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budget)
    });
  },

  updateBudget: async (id, budget) => {
    return await apiRequest(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budget)
    });
  },

  deleteBudget: async (id) => {
    return await apiRequest(`/budgets/${id}`, {
      method: 'DELETE'
    });
  }
};
