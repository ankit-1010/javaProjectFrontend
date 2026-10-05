import { apiRequest } from './api';

export const transactionService = {
  getAllTransactions: async () => {
    return await apiRequest('/transactions');
  },

  getMyTransactions: async (type = 'All') => {
    return await apiRequest(`/transactions/my?type=${encodeURIComponent(type)}`);
  },

  getUserTransactions: async (userId, type = 'All') => {
    if (!userId) {
      return await apiRequest(`/transactions/my?type=${encodeURIComponent(type)}`);
    }
    return await apiRequest(`/transactions/user/${userId}?type=${encodeURIComponent(type)}`);
  },

  createTransaction: async (transaction) => {
    return await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
  },

  updateTransaction: async (id, transaction) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    });
  },

  deleteTransaction: async (id) => {
    return await apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    });
  }
};
