import { apiRequest } from './api';

export const authService = {
  login: async (email, password) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password })
    });
  },

  adminLogin: async (email, password) => {
    return await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password })
    });
  },

  register: async (fullName, email, password, phone) => {
    return await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone ? phone.trim() : ''
      })
    });
  }
};
