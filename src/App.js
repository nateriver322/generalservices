import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import Successregistration from './pages/succcessregistration';
import TicketForm from './pages/ticket';
import Dashboard from './pages/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/successregistration" element={<Successregistration />} />
      <Route path="/ticket" element={<TicketForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;