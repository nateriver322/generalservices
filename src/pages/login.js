import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { loginRequest } from "../AuthConfig";
import { useMsal } from "@azure/msal-react";
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import { FaMicrosoft } from 'react-icons/fa';

const Login = React.memo(() => {
    const navigate = useNavigate();
    const { login, microsoftLogin } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { instance } = useMsal();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        try {
            const userData = await login(credentials.email, credentials.password);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        }
    };

    const handleMicrosoftLogin = async () => {
        try {
            const result = await instance.loginPopup(loginRequest);
            const userData = await microsoftLogin(result.accessToken);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            console.error('Microsoft login error:', error);
            setError('Microsoft login failed');
        }
    };

    const handleSignUpClick = () => {
        navigate('/register');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <LoginResponsiveAppBar />
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '20px'
                }}
            >
                JobTrack
            </Typography>
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
                    margin: '0 auto'
                }}
            >
                <Typography variant="h5" component="h3" gutterBottom>
                    Log In
                </Typography>

                {error && <Typography color="error" gutterBottom>{error}</Typography>}

                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    value={credentials.email}
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
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
                        },
                    }}
                />

                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    value={credentials.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                    {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                </IconButton>
                            </InputAdornment>
                        ),
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
                            color: 'black', // Default label color
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'black', // Label color when focused
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
                        Log In
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        onClick={handleSignUpClick}
                        sx={{
                            borderColor: '#800000',
                            color: '#800000',
                            mb: 2,
                        }}
                    >
                        Sign Up
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        onClick={handleMicrosoftLogin}
                        startIcon={<FaMicrosoft size={20} style={{ marginRight: 10 }} />}
                        sx={{
                            borderColor: '#800000',
                            color: '#800000',
                        }}
                    >
                        Login with Microsoft
                    </Button>
                </Box>
            </Box>
        </div>
    );
});

export default Login;
