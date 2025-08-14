const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_ACTIVITY: `${API_BASE_URL}/api/admin/dashboard/activity`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_STORES: `${API_BASE_URL}/api/admin/stores`,
  
  // User endpoints
  USER_STORES: `${API_BASE_URL}/api/user/stores`,
  USER_RATINGS: `${API_BASE_URL}/api/user/ratings`,
  USER_MY_RATINGS: `${API_BASE_URL}/api/user/my-ratings`,
  
  // Store endpoints
  STORE_MY_STORES: `${API_BASE_URL}/api/store/my-stores`,
  STORE_RATINGS: (storeId) => `${API_BASE_URL}/api/store/${storeId}/ratings`,
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API call failed');
  }

  return response.json();
};
