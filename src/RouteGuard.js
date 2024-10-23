import React from 'react';
import { Navigate } from 'react-router-dom';

const RouteGuard = ({ requiredRole, children }) => {
  const userRole = sessionStorage.getItem('userRole');
  const username = sessionStorage.getItem('username');

  if (!username || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RouteGuard;