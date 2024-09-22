import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css';
import { Button, Box, Typography } from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar';

function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/'); // Adjust this if your login route is different
        }
    }, [navigate, username]);

    const handleTicketButtonClick = () => {
        navigate("/ticket"); 
    };

    const handleViewButtonClick = () => {
        navigate("/myTickets"); 
        console.log("View Tickets button clicked");
    };

    return (
        <>
            <ResponsiveAppBar />
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h2" className="h2" sx={{ mb: 2 }}>
                    General Services Portal
                </Typography>
                <Typography variant="h3">Welcome, {username}!</Typography>
            </Box>
            <Box className="container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Box className="buttoncontainer"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' }, // Column on mobile, row on larger screens
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 4 },  // Space between buttons
                    }}>
                    
                    {/* Submit Ticket Button */}
                    <Button
                        variant="contained"
                        onClick={handleTicketButtonClick}
                        sx={{
                            width: { xs: '90%', sm: 400 },
                            height: { xs: 150, sm: 200 },
                            fontSize: { xs: '18px', sm: '24px' },
                            backgroundColor: '#800000',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#922B21',
                            },
                            boxShadow: 3,
                            borderRadius: 2,
                        }}
                    >
                        Submit Ticket
                    </Button>
                    
                    {/* View Tickets Button */}
                    <Button
                        variant="contained"
                        onClick={handleViewButtonClick}
                        sx={{
                            width: { xs: '90%', sm: 400 },
                            height: { xs: 150, sm: 200 },
                            fontSize: { xs: '18px', sm: '24px' },
                            backgroundColor: '#800000',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#922B21',
                            },
                            boxShadow: 3,
                            borderRadius: 2,
                        }}
                    >
                        View Tickets
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default Dashboard;
