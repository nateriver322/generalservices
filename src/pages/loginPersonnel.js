import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

const PersonnelLogin = () => {
    const navigate = useNavigate();
    const { loginPersonnel } = useAuth(); // Assume this function is defined in your AuthContext
    const [idNumber, setIdNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setIdNumber(event.target.value);
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const userData = await loginPersonnel(idNumber); // Adjust this function to handle ID login
            sessionStorage.setItem('username', userData.username);
            sessionStorage.setItem('userRole', userData.role);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };
    const handleLoginClick = (event) => {
        event.preventDefault();
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
            <img
                src="/logo.png"
                alt="Background Logo"
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.5,
                    width: '1000px',
                    height: 'auto',
                    zIndex: -1,
                }}
            />
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <LoginResponsiveAppBar />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            marginTop: '30px'
                        }}
                    >

                    </Box>
                    <Box
                        component="form"
                        onSubmit={handleLoginSubmit}
                        sx={{
                            maxWidth: '400px',
                            width: '100%',
                            bgcolor: 'white',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                            margin: '0 auto',
                            mt: 4,
                            
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
                                Personnel Log In
                            </Typography>
                        {error && <Typography color="error" gutterBottom>{error}</Typography>}
    
                        <TextField
                            label="ID Number"
                            type="text"
                            name="idNumber"
                            fullWidth
                            required
                            margin="normal"
                            onChange={handleInputChange}
                            value={idNumber}
                            inputProps={{ minLength: 1, maxLength: 20 }} // Adjust based on expected ID format
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
                                    mb: 2,
                                }}
                                fullWidth
                            >
                                Log In
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={handleLoginClick}
                                sx={{
                                    borderColor: '#800000',
                                    color: '#800000',
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Box>
                </>
            )}
        </div>
    );
};

export default PersonnelLogin;