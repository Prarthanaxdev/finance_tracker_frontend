import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface Props {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    // redirect to sign-in page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
