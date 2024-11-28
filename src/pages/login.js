import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { TextField, Button, Box, Typography, IconButton, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { loginRequest } from "../AuthConfig";
import { useMsal } from "@azure/msal-react";
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import { FaMicrosoft } from 'react-icons/fa';
import ConstructionIcon from '@mui/icons-material/Construction';


const Login = React.memo(() => {
    const navigate = useNavigate();
    const { login, microsoftLogin } = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            const userData = await login(credentials.email, credentials.password);
            sessionStorage.setItem('username', userData.username);
            sessionStorage.setItem('userRole', userData.role);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 1000);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleMicrosoftLogin = async () => {
        setLoading(true);
        try {
            const result = await instance.loginPopup(loginRequest);
            const userData = await microsoftLogin(result.accessToken);
            sessionStorage.setItem('username', userData.username);
            sessionStorage.setItem('userRole', userData.role);
            navigate('/dashboard', { state: { username: userData.username } });
        } catch (error) {
            setError('Microsoft login failed');
            setTimeout(() => {
                setError('');
            }, 3000);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSignUpClick = () => {
        navigate('/register');
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgot_password');
    };
    const handleLogInAsPersonnelClick = () => {
        navigate('/personnel-login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            style={{
                position: 'relative',
                minHeight: '100vh',
                width: '100%',
                margin: '0 auto',
                backgroundColor: '#FFD700',
                overflow: 'hidden',
            }}
        >
            <LoginResponsiveAppBar />
            <Box
                component="form"
                onSubmit={handleLoginSubmit}
                sx={{
                    maxWidth: { xs: '95%', sm: '400px' },
                    width: '100%',
                    bgcolor: 'white',
                    p: { xs: 2, sm: 4 },
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
                            '& fieldset': { borderColor: 'black' },
                            '&:hover fieldset': { borderColor: '#922B21' },
                            '&.Mui-focused fieldset': { borderColor: '#800000' },
                        },
                        '& .MuiInputLabel-root': { color: 'black' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
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
                            '& fieldset': { borderColor: 'black' },
                            '&:hover fieldset': { borderColor: '#922B21' },
                            '&.Mui-focused fieldset': { borderColor: '#800000' },
                        },
                        '& .MuiInputLabel-root': { color: 'black' },
                        '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
                    }}
                />

                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            bgcolor: '#800000',
                            '&:hover': { bgcolor: '#A00000' },
                            color: 'white',
                            mb: 2,
                        }}
                        fullWidth
                    >
                        Log In
                    </Button>
                    <Button
                        type="button"
                        variant="text"
                        fullWidth
                        onClick={handleForgotPasswordClick}
                        sx={{ color: '#800000', mb: 1 }}
                    >
                        Forgot Password?
                    </Button>
                </Box>
            </Box>
        </div>
    );
});

export default Login;