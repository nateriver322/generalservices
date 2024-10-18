import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/dashboard.css';
import { Button, Box, Typography } from '@mui/material';
import TicketAppBar from './TicketAppBar';
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
            <TicketAppBar />
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


            <Box 
                sx={{ 
                    textAlign: 'center', 
                    marginTop: { xs: -16, sm: -14,lg: -18  },  // Larger marginTop for mobile (xs), smaller for large screens (sm+)
                    px: { xs: 2, sm: 0 },  // Padding for mobile to avoid cutting off
                    maxWidth: '100%',  // Ensure it doesn't overflow
                    
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, color: 'black',  }}>
                    How to submit a request for a repair/installation?
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '600px', margin: '0 auto', color: 'black',  textAlign: 'justify', padding: { xs: '0 10px', sm: '0' }, fontSize: { xs: '15px', sm: '16px', md: '16px'} }}>
                    1. Click the "Submit Ticket" button above.<br />
                    2. Fill in the necessary details, including a description of the issue and relevant attachments if required.<br />
                    3. Once you've filled out the form, click the "Submit" button.<br />
                    4. You will receive a confirmation that your ticket has been successfully created, and you can track the status in the "View Tickets" section.
                </Typography>
            </Box>
        </>
    );
}

export default Dashboard;
