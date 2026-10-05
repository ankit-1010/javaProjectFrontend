import { apiRequest } from './api';

export const userService = {
  getCurrentProfile: async () => {
    return await apiRequest('/users/me');
  },

  updateProfile: async (profileData) => {
    return await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  changePassword: async (passwordData) => {
    return await apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }
};
