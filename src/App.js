import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import SuccessRegistration from './pages/successregistration'; // Ensure this path is correct
import TicketForm from './pages/ticket';
import MyTickets from './pages/myTickets';
import RoleBasedDashboard from './RoleBasedDashboard'; // Import the RoleBasedDashboard
import AccountManagement from './pages/AdminDashboard';
import SuccessTicket from './pages/SuccessTicket';
import StaffDashboard from './pages/StaffDashboard';
import TicketsCreated from './pages/ticketsCreated';
import PersonnelTickets from './pages/personneltickets';
import TicketsFixed from './pages/ticketsFixed';
import TicketsHistory from './pages/ticketsHistory';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/successregistration" element={<SuccessRegistration />} />
      <Route path="/ticket" element={<TicketForm />} />
      <Route path="/dashboard" element={<RoleBasedDashboard />} /> {/* Use RoleBasedDashboard */}
      <Route path="/myTickets" element={<MyTickets />} />
      <Route path="/" element={<AccountManagement />} />
      <Route path="/SuccessTicket" element={<SuccessTicket />} />
      <Route path="/StaffDashboard" element={<StaffDashboard />} />
      <Route path="/TicketsCreated" element={<TicketsCreated />} />
      <Route path="/PersonnelTickets" element={<PersonnelTickets />} />
      <Route path="/TicketsFixed" element={<TicketsFixed />} />
      <Route path="/TicketsHistory" element={<TicketsHistory />} />
    </Routes>
  );
}

export default App;
