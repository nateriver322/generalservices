import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import TicketAppBar from './TicketAppBar';
// Memoized instruction component to prevent unnecessary re-renders
const Instructions = memo(() => (
  <div className="space-y-4">
    <h3 className="text-3xl font-semibold text-black mb-2">
      How to submit a request for a repair/installation?
    </h3>
    <p className="text-black text-xl leading-relaxed max-w-2xl mx-auto">
      1. Click the "Submit Ticket" button above.
      <br /><br />
      2. Fill in the necessary details, including a description of the issue and relevant attachments if required.
      <br /><br />
      3. Once you've filled out the form, click the "Submit" button.
      <br /><br />
      4. You will receive a confirmation that your ticket has been successfully created, and you can track the status in the "View Tickets" section.
    </p>
  </div>
));

Instructions.displayName = 'Instructions';

// Memoized welcome component
const Welcome = memo(({ username }) => (
  <h4 className="text-2xl font-medium text-center mb-8">
    Welcome, {username}!
  </h4>
));

Welcome.displayName = 'Welcome';

const Dashboard = () => {
  // Get username once during initial render
  const username = sessionStorage.getItem('username');

  // If no username, redirect immediately without extra rendering
  if (!username) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen">
      <TicketAppBar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Welcome username={username} />
        <Instructions />
      </main>
    </div>
  );
};

export default memo(Dashboard);