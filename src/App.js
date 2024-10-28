import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./AuthConfig";
import { AuthProvider } from './AuthContext';
import Login from './pages/login';
import PersonnelLogin from './pages/loginPersonnel';
import Register from './pages/register';
import SuccessRegistration from './pages/successregistration'; // Ensure this path is correct
import TicketForm from './pages/ticket';
import MyTickets from './pages/myTickets';
import RoleBasedDashboard from './RoleBasedDashboard'; // Import the RoleBasedDashboard
import AccountManagement from './pages/AdminDashboard';
import SuccessTicket from './pages/SuccessTicket';
import StaffDashboard from './pages/StaffDashboard';
import PersonnelTickets from './pages/personneltickets';
import TicketsFixed from './pages/ticketsFixed';
import TicketsHistory from './pages/ticketsHistory';
import AssignSubrole from './pages/subrole';
import ForgotPassword from './pages/ForgotPassword';
import RouteGuard from './RouteGuard';

import ResetPasswordForm from './pages/ResetPassword';
function App() {
  console.log('App rendering');
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/personnellogin" element={<PersonnelLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/successregistration" element={<SuccessRegistration />} />
          <Route 
             path="/ticket" 
              element={
                <RouteGuard requiredRole="User">
              <TicketForm />
             </RouteGuard>
             } 
          />

        <Route path="/dashboard" element={<RoleBasedDashboard />} />

          <Route 
            path="/myTickets" 
            element={
              <RouteGuard requiredRole="User">
                <MyTickets />
             </RouteGuard>
             } 
          />

          <Route 
            path="/AccountManagement" 
            element={
              <RouteGuard requiredRole="Admin">
                <AccountManagement />
              </RouteGuard>
            } 
          />

          <Route path="/SuccessTicket" element={<SuccessTicket />} />

          <Route 
            path="/StaffDashboard" 
            element={
              <RouteGuard requiredRole="Staff">
                <StaffDashboard />
              </RouteGuard>
            } 
          />


          <Route 
          path="/PersonnelTickets" 
          element={
            <RouteGuard requiredRole="Personnel">
          <PersonnelTickets />
        </RouteGuard>
        } 
        />

        <Route 
        path="/TicketsFixed" 
        element={
              <RouteGuard requiredRole="Staff">
        <TicketsFixed />
      </RouteGuard>
        } 
      />

        <Route 
         path="/TicketsHistory" 
          element={
              <RouteGuard requiredRole="Personnel">
             <TicketsHistory />
         </RouteGuard>
        } 
         />

          <Route 
          path="/subrole" 
           element={
            <RouteGuard requiredRole="Staff">
            <AssignSubrole />
          </RouteGuard>
           } 
        />

        <Route 
          path="/PersonnelDashboard" 
           element={
            <RouteGuard requiredRole="Personnel">
            <AssignSubrole />
          </RouteGuard>
           } 
        />

          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPasswordForm />} />

        </Routes>
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;
