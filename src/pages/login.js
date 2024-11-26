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
                height: '100vh',
                width: '100vw',
            }}
        >
            <LoginResponsiveAppBar />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 'calc(100vh - 64px)', // Adjusted to leave space for the AppBar
                    padding: 2,
                    bgcolor: '#f5f5f5',
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleLoginSubmit}
                    sx={{
                        maxWidth: { xs: '90%', sm: '400px' }, // Dynamic width for smaller devices
                        width: '100%',
                        bgcolor: 'white',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3,
                    }}
                >
                    {/* Logo Section */}
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
    
                    {/* Login Header */}
                    <Typography variant="h5" component="h3" gutterBottom>
                        Log In
                    </Typography>
    
                    {error && <Typography color="error" gutterBottom>{error}</Typography>}
    
                    {/* Email Input */}
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        fullWidth
                        required
                        margin="normal"
                        onChange={handleInputChange}
                        value={credentials.email}
                        inputProps={{ minLength: 3, maxLength: 80 }}
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
    
                    {/* Password Input */}
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        fullWidth
                        required
                        margin="normal"
                        onChange={handleInputChange}
                        value={credentials.password}
                        inputProps={{ minLength: 8, maxLength: 80 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <AiOutlineEye />
                                        ) : (
                                            <AiOutlineEyeInvisible />
                                        )}
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
    
                    {/* Action Buttons */}
                    <Box sx={{ mt: 3 }}>
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
                            startIcon={<FaMicrosoft size={20} />}
                            sx={{
                                borderColor: '#800000',
                                color: '#800000',
                                mb: 2,
                            }}
                        >
                            Login with Microsoft
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            fullWidth
                            onClick={handleLogInAsPersonnelClick}
                            sx={{
                                borderColor: '#800000',
                                color: '#800000',
                            }}
                        >
                            Log In as Personnel
                        </Button>
                    </Box>
                </Box>
            </Box>
            {/* Backdrop */}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }}
                open={loading}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <CircularProgress color="info" />
                    <Typography variant="h6" component="div">
                        Logging in...
                    </Typography>
                </Box>
            </Backdrop>
        </div>
    );
    
});

export default Login;