import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import SuccessRegistration from './pages/successregistration'; // Ensure this path is correct
import TicketForm from './pages/ticket';
import MyTickets from './pages/myTickets';
import RoleBasedDashboard from './RoleBasedDashboard'; // Import the RoleBasedDashboard

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/successregistration" element={<SuccessRegistration />} />
      <Route path="/ticket" element={<TicketForm />} />
      <Route path="/dashboard" element={<RoleBasedDashboard />} /> {/* Use RoleBasedDashboard */}
      <Route path="/myTickets" element={<MyTickets />} />
    </Routes>
  );
}

export default App;
