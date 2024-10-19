import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import { Box, Typography, Container } from '@mui/material';
import TicketAppBar from './TicketAppBar';

function Dashboard() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/');
        }
    }, [navigate, username]);

    return (
        <>
            <TicketAppBar />
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                {/* Welcome Text */}
                <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
                    Welcome, {username}!
                </Typography>
                
                {/* Instruction Section */}
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
        fontSize: '1.3rem', // Increased font size
        lineHeight: 1.6 // Adjusted line height for better readability
    }}
>
    1. Click the "Submit Ticket" button above.<br />
    2. Fill in the necessary details, including a description of the issue and relevant attachments if required.<br />
    3. Once you've filled out the form, click the "Submit" button.<br />
    4. You will receive a confirmation that your ticket has been successfully created, and you can track the status in the "View Tickets" section.
</Typography>
                </Box>
            </Container>
        </>
    );
}

export default Dashboard;