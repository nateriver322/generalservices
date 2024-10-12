import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Box, Typography } from '@mui/material';
import '../css/staffDashboard.css';
import ResponsiveAppBar from './ResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

function StaffDashboard() {
    const navigate = useNavigate();
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (!username) {
            console.log('No user data found, redirecting to login');
            navigate('/');
        }
    }, [navigate, username]);

    const handleTicketButtonClick = () => {
        navigate("/ticketsCreated"); 
        console.log("Tickets Created button clicked");
    };

    const handleViewButtonClick = () => {
        navigate("/ticketsFixed"); 
        console.log("Fixed Tickets button clicked");
    };

    const handleSubroleButtonClick = () => {
        navigate("/subrole");
        console.log("Assign Subrole button clicked");
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
                    marginTop: '30px',
                }}
            >
                <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                <Typography variant="h4" component="h2">
                    JobTrack
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', mb: -15, mt: 5 }}>
                <Typography variant="h3" sx={{ fontSize: '40px' }}>
                    Welcome Staff, {username}!
                </Typography>
            </Box>
            <Box className="container" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', minHeight: '60vh', mx: { xs: 2, sm: 4, md: 10 },  }}>
                <Box
                    className="buttoncontainer"
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { xs: 2, sm: 4 },
                        mt: { xs: 20, sm: 20, md: 25 },
                    }}
                >
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
                        Pending and On-Process
                    </Button>

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
                        Resolved Tickets
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSubroleButtonClick}
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
                        Assign Subrole
                    </Button>
                </Box>
            </Box>
        </>
    );
}

export default StaffDashboard;