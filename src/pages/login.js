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
                    mt: 4
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
                    inputProps={{ minLength: 3, maxLength: 80 }}
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
        Log In
    </Button>

    {/* Forgot Password Button */}
    <Button
        type="button"
        variant="text"
        fullWidth
        onClick={handleForgotPasswordClick}
        sx={{ color: '#800000', mb: 1 }}  // Reduced margin-bottom
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
            mb: 2,  // This margin is kept for spacing between the buttons
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
            color: '#800000' }} 
    >
        Log In as Personnel
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
});

export default Login;
