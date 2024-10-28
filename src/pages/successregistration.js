import React from 'react';
import '../css/successregistration.css'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

const Successregistration = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/');
  };

  return (
    <div
            style={{
                position: 'relative', 
                height: '100vh',
                width: '100vw',
            }}
        >
            {/* Blurry and semi-transparent background logo */}
                <img
                src="/logo.png"
                alt="Background Logo"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', 
                    opacity: 0.3, 
                    width: '800px',
                    height: 'auto',
                    zIndex: -1, 
            }}
        />
      <LoginResponsiveAppBar />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          marginTop: '30px',
        }}
      >
        <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
        <Typography variant="h4" component="h2">
          JobTrack
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: '400px',
          width: '100%',
          bgcolor: 'white',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          margin: '0 auto',
          mt: 4,
          textAlign: 'center', // Center align content
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Account Successfully Created!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the General Services Portal.
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: '#800000',
            '&:hover': {
              bgcolor: '#A00000',
            },
            color: 'white',
            mt: 2,
            mb: 2,
          }}
          onClick={handleLoginClick}
          fullWidth
        >
          Login
        </Button>
      </Box>
    </div>
  );
};

export default Successregistration;
