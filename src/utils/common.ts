export const BASE_URL = 'http://localhost:5000';

export const EMAIL_VALIDATION = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
};

export const TABS = ['expenses', 'income', 'category'];

export const getAuthToken = (): string | null => {
  try {
    // Dynamically import store to avoid circular dependency
    const { store } = require('../store');
    const state = store.getState() as any;
    return state.auth?.user?.token || localStorage.getItem('authToken');
  } catch {
    return localStorage.getItem('authToken');
  }
};
