import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import '../css/dashboard.css';
import { Box, Typography, Container } from '@mui/material';
import TicketAppBar from './TicketAppBar';

// Memoized instruction component
const Instructions = memo(() => (
  <Box sx={{ textAlign: 'center', mt: 2 }}>
    <Typography variant="h3" sx={{ mb: 2, color: 'black' }}>
      How to submit a request for a repair/installation?
    </Typography>
    <Typography
      variant="body1"
      sx={{
        color: 'black',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
        fontSize: '1.3rem',
        lineHeight: 1.6
      }}
    >
      1. Click the "Submit Ticket" button above.<br /><br/>
      2. Fill in the necessary details, including a description of the issue and relevant attachments if required.<br /><br/>
      3. Once you've filled out the form, click the "Submit" button.<br /><br/>
      4. You will receive a confirmation that your ticket has been successfully created, and you can track the status in the "View Tickets" section.<br/>
    </Typography>
  </Box>
));

Instructions.displayName = 'Instructions';

// Memoized welcome component
const Welcome = memo(({ username }) => (
  <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
    Welcome, {username}!
  </Typography>
));

Welcome.displayName = 'Welcome';

const Dashboard = () => {
  const username = sessionStorage.getItem('username');

  if (!username) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <TicketAppBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Welcome username={username} />
        <Instructions />
      </Container>
    </>
  );
};

export default memo(Dashboard);