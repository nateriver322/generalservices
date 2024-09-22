import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Box, Typography } from '@mui/material'; // Import MUI components
import '../css/PersonnelDashboard.css';
import ResponsiveAppBar from './ResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

function PersonnelDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // Get username from localStorage

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/'); // Adjust this if your login route is different
        }
    }, [navigate, username]);

    const handleTicketButtonClick = () => {
        navigate("/PersonnelTickets"); 
        console.log("Tickets assigned button clicked");
    };

    const handleViewButtonClick = () => {
        navigate("/ticketsHistory"); 
        console.log("Fixed Tickets button clicked");
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
            <div className="user-info">
                <Typography variant="h3">Welcome Personnel {username}!</Typography>
            </div>
            <Box className="container">
                <Box className="buttoncontainer"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: -50,   // Move the container up by reducing the margin top
                    height: '60vh',  // Adjust container height to control button placement
                    gap: { xs: 2, sm: 4 },  // Adjust space between buttons for different screen sizes
                }}>
                    {/* Tickets Assigned Button */}
                    <Button
                        variant="contained"
                        onClick={handleTicketButtonClick}
                        sx={{
                            width: { xs: '90%', sm: 400,  },  // Full width on mobile, 400px on larger screens
                            height: { xs: 150, sm: 200 },  // Smaller height on mobile
                            fontSize: { xs: '18px', sm: '24px' },  // Smaller font size on mobile
                            backgroundColor: '#800000',  // Dark red background
                            color: '#ffffff',  // White text
                            '&:hover': {
                                backgroundColor: '#922B21',  // Hover color (slightly lighter red)
                            },
                            mt: { xs: 2, sm: 0 },  // Margin top for smaller screens (optional)
                        }}
                    >
                        Tickets Assigned
                    </Button>

                    {/* Tickets History Button */}
                    <Button
                        variant="contained"
                        onClick={handleViewButtonClick}
                        sx={{
                            width: { xs: '90%', sm: 400 },  // Full width on mobile, 400px on larger screens
                            height: { xs: 150, sm: 200 },  // Smaller height on mobile
                            fontSize: { xs: '18px', sm: '24px' },  // Smaller font size on mobile
                            backgroundColor: '#800000',  // Dark red background
                            color: '#ffffff',  // White text
                            '&:hover': {
                                backgroundColor: '#922B21',  // Hover color (slightly lighter red)
                            },
                            mt: { xs: 2, sm: 0 },  // Margin top for smaller screens (optional)
                        }}
                    >
                        Tickets History
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default PersonnelDashboard;
