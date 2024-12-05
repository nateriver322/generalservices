import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
    TextField, Button, Box, Typography, IconButton, 
    InputAdornment, CircularProgress, Backdrop, Grid 
} from '@mui/material';
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
        setCredentials({ ...credentials, [name]: value });
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
            setTimeout(() => setError(''), 1000);
        } finally {
            setLoading(false);
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
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
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
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
               
            }}
        >
            <LoginResponsiveAppBar />
            <Grid container justifyContent="center" alignItems="center" sx={{ flexGrow: 1, p: 2 }}>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <Box
                        component="form"
                        onSubmit={handleLoginSubmit}
                        sx={{
                            bgcolor: 'white',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                            width: '100%',
                            textAlign: 'center',
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                            <ConstructionIcon sx={{ fontSize: 50, color: '#800000' }} />
                            <Typography variant="h5" sx={{ ml: 1, color: '#800000' }}>
                                JobTrack
                            </Typography>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Log In
                        </Typography>
                        {error && (
                            <Typography color="error" variant="body2" gutterBottom>
                                {error}
                            </Typography>
                        )}
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
                                '& .MuiOutlinedInput-root:hover fieldset': { borderColor: '#800000' },
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
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ bgcolor: '#800000', color: 'white', mb: 1 }}
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
                                sx={{ borderColor: '#800000', color: '#800000', mb: 1 }}
                            >
                                Sign Up
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={handleMicrosoftLogin}
                                startIcon={<FaMicrosoft />}
                                sx={{ borderColor: '#800000', color: '#800000', mb: 1 }}
                            >
                                Login with Microsoft
                            </Button>
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={handleLogInAsPersonnelClick}
                                sx={{ borderColor: '#800000', color: '#800000' }}
                            >
                                Log In as Personnel
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            {loading && (
                <Backdrop open={loading} sx={{ color: '#fff', zIndex: 1201 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Logging in...
                    </Typography>
                </Backdrop>
            )}
        </Box>
    );
});

export default Login;
