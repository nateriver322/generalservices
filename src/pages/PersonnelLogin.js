import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

const PersonnelLogin = () => {
    const navigate = useNavigate();
    const [personnelId, setPersonnelId] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
      event.preventDefault();
      setError('');
  
      try {
        const response = await fetch('https://generalservicescontroller.onrender.com/api/personnel-login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ personnelId }),
      });
      
  
          if (response.ok) {
              const { message, id, username, role, subrole } = await response.json();
              // Store user data in localStorage or context
              localStorage.setItem('user', JSON.stringify({ id, username, role, subrole }));
              navigate('/PersonnelTickets');
          } else {
              const errorMessage = await response.text();
              setError(errorMessage || 'An error occurred during login');
          }
      } catch (err) {
          console.error('Login error:', err);
          setError('An error occurred during login');
      }
  };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    return (
        <div style={{
            position: 'relative', 
            height: '100vh',
            width: '100vw',
        }}>
            <LoginResponsiveAppBar />
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    maxWidth: '400px',
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    margin: '0 auto',
                    marginTop: '100px'
                }}
            >
                <Box 
                    display="flex" 
                    flexDirection="row" 
                    alignItems="center" 
                    justifyContent="center" 
                    textAlign="center" 
                    mb={4}
                >
                    <ConstructionIcon sx={{ fontSize: 60, mb: 2, mr: 2 }} />
                    <Typography variant="h4" component="h2" gutterBottom>
                        JobTrack
                    </Typography>
                </Box>
                <Typography variant="h5" component="h3" gutterBottom>
                    Personnel Login
                </Typography>

                <TextField
                    label="Personnel ID"
                    fullWidth
                    required
                    margin="normal"
                    value={personnelId}
                    onChange={(e) => setPersonnelId(e.target.value)}
                    error={!!error}
                    helperText={error}
                    inputProps={{
                        maxLength: 11,
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'black',
                            },
                            '&:hover fieldset': {
                                borderColor: '#922B21',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#800000',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'black',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black',
                        },
                    }}
                />

                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#800000',
                            '&:hover': {
                                bgcolor: '#A00000',
                            },
                            color: 'white',
                            mb: 2
                        }}
                        fullWidth
                    >
                        Login
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        onClick={handleRegisterClick}
                        sx={{
                            borderColor: '#800000',
                            color: '#800000',
                        }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default PersonnelLogin;