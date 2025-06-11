const API_BASE_URL = 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  stats: {
    profile: `${API_BASE_URL}/stats/profile`,
    matches: `${API_BASE_URL}/stats/matches`,
    analytics: `${API_BASE_URL}/stats/analytics`,
  },
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return { Authorization: `Bearer ${token}` };
}; 