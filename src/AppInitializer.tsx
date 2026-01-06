import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './reducers/authSlice';

const AppInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Restore Redux state from localStorage on page load
      dispatch(login({ token }));
    }
  }, [dispatch]);

  return null;
};

export default AppInitializer;
