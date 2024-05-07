import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import Register from './pages/register';
import Successregistration from './pages/succcessregistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/successregistration" element={<Successregistration />} />
    </Routes>
  );
}

export default App;