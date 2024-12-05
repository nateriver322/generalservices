import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Backdrop, CircularProgress } from '@mui/material';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useAuth } from '../AuthContext';

const PersonnelLogin = () => {
    const navigate = useNavigate();
    const { personnelLogin } = useAuth();
    const [personnelId, setPersonnelId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userData = await personnelLogin(personnelId);
            // After successful login, navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Invalid personnel ID');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleBackToLogin = () => {
        navigate('/');
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
                    // Removed numeric restrictions and allowed general input
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
                            mb: 1
                        }}
                    >
                        Register
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={handleBackToLogin}
                        sx={{
                            borderColor: '#800000',
                            color: '#800000'
                        }}
                        fullWidth
                    >
                        Back to Login
                    </Button>
                </Box>
            </Box>

            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }}
                open={loading}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress color="info" />
                    <Typography variant="h6" component="div">
                        Logging in...
                    </Typography>
                </Box>
            </Backdrop>

        </div>
    );
};

export default PersonnelLogin;
