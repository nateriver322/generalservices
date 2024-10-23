// RoleBasedDashboard.js
import React from 'react';
import { useAuth } from './AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PersonnelDashboard from './pages/PersonnelDashboard';
import Dashboard from './pages/dashboard';
import Login from './pages/login';

const RoleBasedDashboard = () => {
  const { user, loading } = useAuth();
  const userRole = sessionStorage.getItem('userRole');

  console.log('RoleBasedDashboard rendering. User:', user, 'Loading:', loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !userRole) {
    console.log('No user, rendering LoginPage from RoleBasedDashboard');
    return <Login />;
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
