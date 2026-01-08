import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './reducers/authSlice';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Restore auth state from localStorage on page load
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('authUser');

    console.log('AppInitializer - token exists:', !!token);
    console.log('AppInitializer - user exists:', !!user);

    if (token && user) {
      try {
        const userData = JSON.parse(user);
        console.log('Restoring user from localStorage:', userData);
        // Pass the userData directly - it should already have token, _id, email
        dispatch(login(userData));
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, [dispatch]);

  // Return null - this component just handles initialization
  return null;
};

export default AppInitializer;
