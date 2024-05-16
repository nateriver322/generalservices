// RoleBasedDashboard.js
import React from 'react';
import { useAuth } from './AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PersonnelDashboard from './pages/PersonnelDashboard';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';

const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Staff':
      return <StaffDashboard />;
    case 'Personnel':
      return <PersonnelDashboard />;
    default:
      return <Dashboard />;
  }
};

export default RoleBasedDashboard;
