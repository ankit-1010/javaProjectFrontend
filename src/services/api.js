// Centralized API Service with live Spring Boot backend integration
// No mock fallback: Real database persistence through Aiven MySQL only

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'moneymate_jwt_token';
export const USER_KEY = 'moneymate_user_session';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser() {
  const userJson = localStorage.getItem(USER_KEY);
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      // Ensure plaintext passwords are never stored
      if (user.password) delete user.password;
      return user;
    } catch (e) {
      localStorage.removeItem(USER_KEY);
    }
  }
  return null;
}

export function setStoredUser(user) {
  if (user) {
    const safeUser = { ...user };
    delete safeUser.password;
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    // 204 No Content
    if (res.status === 204) {
      return { success: true };
    }

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { message: text } : {};
    }

    if (res.ok) {
      return data;
    }

    // Handle authentication/authorization expiration
    if (res.status === 401) {
      const msg = data?.message || 'Invalid credentials or session expired';
      if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/admin-login')) {
        clearAuthSession();
      }
      const error = new Error(msg);
      error.status = 401;
      error.data = data;
      throw error;
    }

    if (res.status === 403) {
      const msg = data?.message || 'Access Denied: You do not have permission for this resource';
      const error = new Error(msg);
      error.status = 403;
      error.data = data;
      throw error;
    }

    // 400, 404, 409, 500 errors
    const errorMsg = data?.message || data?.error || `Request failed with status ${res.status}`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    throw error;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const connErr = new Error(`Cannot connect to backend server at ${API_BASE_URL}. Please ensure Spring Boot is running.`);
      connErr.status = 503;
      throw connErr;
    }
    throw err;
  }
}
