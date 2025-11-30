// API Configuration for Admin Portal

// Backend API Base URL - Admin Portal Backend runs on port 5002
export const API_BASE_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5002/api/admin';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    signup: `${API_BASE_URL}/auth/signup`,
    me: `${API_BASE_URL}/auth/me`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,
  },
  
  // Add more endpoints as you create them
  users: {
    create: `${API_BASE_URL}/users`,
    getAll: `${API_BASE_URL}/users`,
    getById: (id) => `${API_BASE_URL}/users/${id}`,
    update: (id) => `${API_BASE_URL}/users/${id}`,
    delete: (id) => `${API_BASE_URL}/users/${id}`,
    resetStreak: (id) => `${API_BASE_URL}/users/${id}/reset-streak`,
    resetXP: (id) => `${API_BASE_URL}/users/${id}/reset-xp`,
    assignXP: (id) => `${API_BASE_URL}/users/${id}/xp`,
    getProgress: (id) => `${API_BASE_URL}/users/${id}/progress`,
  },
  rewards: {
    getAll: `${API_BASE_URL}/rewards`,
    getById: (id) => `${API_BASE_URL}/rewards/${id}`,
    create: `${API_BASE_URL}/rewards`,
    update: (id) => `${API_BASE_URL}/rewards/${id}`,
    delete: (id) => `${API_BASE_URL}/rewards/${id}`,
  },
  resources: {
    getAll: `${API_BASE_URL}/resources`,
    getById: (id) => `${API_BASE_URL}/resources/${id}`,
    create: `${API_BASE_URL}/resources`,
    update: (id) => `${API_BASE_URL}/resources/${id}`,
    delete: (id) => `${API_BASE_URL}/resources/${id}`,
  },
  notifications: {
    getAll: `${API_BASE_URL}/notifications`,
    getById: (id) => `${API_BASE_URL}/notifications/${id}`,
    send: `${API_BASE_URL}/notifications/send`,
    schedule: `${API_BASE_URL}/notifications/schedule`,
    sendToUser: (id) => `${API_BASE_URL}/notifications/user/${id}`,
    getScheduled: `${API_BASE_URL}/notifications/scheduled`,
    update: (id) => `${API_BASE_URL}/notifications/${id}`,
    delete: (id) => `${API_BASE_URL}/notifications/${id}`,
  },
  analytics: {
    overview: `${API_BASE_URL}/analytics/overview`,
    quizzes: `${API_BASE_URL}/analytics/quizzes`,
    gamification: `${API_BASE_URL}/analytics/gamification`,
    errors: `${API_BASE_URL}/analytics/errors`,
  },
  colleges: {
    getAll: `${API_BASE_URL}/colleges`,
    getById: (id) => `${API_BASE_URL}/colleges/${id}`,
    create: `${API_BASE_URL}/colleges`,
    update: (id) => `${API_BASE_URL}/colleges/${id}`,
    delete: (id) => `${API_BASE_URL}/colleges/${id}`,
    bulk: `${API_BASE_URL}/colleges/bulk`,
  },
  quizzes: {
    getAll: `${API_BASE_URL}/quizzes`,
    getById: (id) => `${API_BASE_URL}/quizzes/${id}`,
    create: `${API_BASE_URL}/quizzes`,
    update: (id) => `${API_BASE_URL}/quizzes/${id}`,
    delete: (id) => `${API_BASE_URL}/quizzes/${id}`,
    publish: (id) => `${API_BASE_URL}/quizzes/${id}/publish`,
    addQuestion: (id) => `${API_BASE_URL}/quizzes/${id}/questions`,
    updateQuestion: (id) => `${API_BASE_URL}/quizzes/questions/${id}`,
    deleteQuestion: (id) => `${API_BASE_URL}/quizzes/questions/${id}`,
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('acceptopia-admin-token') || sessionStorage.getItem('acceptopia-admin-token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// API request wrapper with error handling
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getAuthHeaders,
  apiRequest,
};









