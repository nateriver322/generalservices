import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css';
import { Button, Box, Typography } from '@mui/material';
import ResponsiveAppBar from './ResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

function Dashboard() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username'); // Get username from localStorage

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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px',
                    marginTop: '30px' // Move the form down
                }}
            >
                <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                <Typography
                    variant="h4"
                    component="h2"
                    
                   
                >
                    JobTrack
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mb: -15, mt: 5  }}>
                
                <Typography variant="h3"sx={{ fontSize: '40px' }}>Welcome, {username}!</Typography>
            </Box>
            <Box className="container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Box className="buttoncontainer"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', sm: 'row' }, // Column on mobile, row on larger screens
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 4 },
                     
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
