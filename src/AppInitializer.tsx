/**
 * AppInitializer component to restore authentication state from localStorage
 * on application startup.
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './reducers/authSlice';

const AppInitializer = () => {
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;
