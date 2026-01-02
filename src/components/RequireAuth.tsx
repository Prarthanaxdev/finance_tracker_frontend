import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // redirect to sign-in page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
