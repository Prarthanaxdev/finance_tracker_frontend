import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authSlice';

/**
 * Custom hook to restore authentication state from localStorage on app startup
 */
export const useAuthRestore = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        dispatch(login(userData));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        // Clean up corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, [dispatch]);
};
