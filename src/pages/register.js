import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import { API_BASE_URL, API_ENDPOINTS } from '../config/apiConfig';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        contactNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (emailError || Object.keys(errors).length > 0) {
            const timer = setTimeout(() => {
                setEmailError('');
                setErrors({});
            }, 2000); // Clear error after 2 seconds

            return () => clearTimeout(timer); // Clean up timer on unmount
        }
    }, [emailError, errors]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'contactNumber') {
            const onlyNumbers = value.replace(/\D/g, '');
            const limitedToElevenDigits = onlyNumbers.slice(0, 11);
            setUserData({
                ...userData,
                [name]: limitedToElevenDigits
            });
        } else {
            setUserData({
                ...userData,
                [name]: value
            });
        }

        if (name === 'email' && emailError) {
            setEmailError('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateForm = async () => {
        const newErrors = {}; // Define newErrors here
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(userData.email)) {
            newErrors.email = "Please enter a valid email address.";
        } else {
            const isRegistered = await isEmailAlreadyRegistered(userData.email);
            if (isRegistered) {
                setEmailError("This email is already registered.");
                newErrors.email = "This email is already registered.";
            }
        }

        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordPattern.test(userData.password)) {
            newErrors.password = "Password must be 8 characters long and include at least 1 number.";
        }

        const contactNumberPattern = /^\d{11}$/;
        if (!contactNumberPattern.test(userData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be exactly 11 digits.";
        }

        // Check if passwords match
        if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
    
        if (!await validateForm()) {
            return;
        }
    
        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.addUser}`, { // Use the new dynamic URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                console.log('Registration successful');
                navigate('/successregistration');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/');
    };

    const isEmailAlreadyRegistered = async (email) => {
        try {
            const response = await fetch(`http://localhost:8080/user/checkEmail?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            return result.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    return (
        <div>
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
                <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                <Typography variant="h4" component="h2">JobTrack</Typography>
            </Box>
            <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                    maxWidth: '400px',
                    bgcolor: 'white',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    margin: '0 auto'
                }}
            >
                <Typography variant="h5" component="h3" gutterBottom>Create Account</Typography>
                

                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    inputProps={{ minLength: 3, maxLength: 20 }}
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
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.password}
                    helperText={errors.password}
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

                {/* Confirm Password Field */}
                <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    inputProps={{ minLength: 8, maxLength: 80 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                    {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
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

                <TextField
                    label="Contact Number"
                    name="contactNumber"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
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
                        Sign Up
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
                        Login
                    </Button>
                </Box>
            </Box>

        </div>
    );
};

export default Register;