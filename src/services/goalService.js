import { apiRequest } from './api';

export const goalService = {
  getMyGoals: async () => {
    return await apiRequest('/goals/my');
  },

  getUserGoals: async (userId) => {
    if (!userId) {
      return await apiRequest('/goals/my');
    }
    return await apiRequest(`/goals/user/${userId}`);
  },

  createGoal: async (goal) => {
    return await apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(goal)
    });
  },

  updateGoal: async (id, goal) => {
    return await apiRequest(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goal)
    });
  },

  deleteGoal: async (id) => {
    return await apiRequest(`/goals/${id}`, {
      method: 'DELETE'
    });
  }
};
