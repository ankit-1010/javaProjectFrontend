import { apiRequest } from './api';

export const categoryService = {
  getAllCategories: async () => {
    return await apiRequest('/categories');
  },

  createCategory: async (category) => {
    return await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category)
    });
  },

  updateCategory: async (id, category) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category)
    });
  },

  deleteCategory: async (id) => {
    return await apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
  }
};
