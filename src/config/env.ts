export const config = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  apiTimeout: Number(process.env.REACT_APP_API_TIMEOUT) || 10000,
  isDev: process.env.NODE_ENV === 'development',
} as const;
