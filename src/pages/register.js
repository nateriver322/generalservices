import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        contactNumber: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;

        if (name === 'contactNumber') {
            updatedValue = value.replace(/[^0-9]/g, '').slice(0, 11);
        }

        if (name === 'email' && emailError) {
            setEmailError('');
        }

        setUserData({
            ...userData,
            [name]: updatedValue
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateForm = async () => {
        const newErrors = {};
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!await validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/user/add', {
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
                    marginTop: '70px' // Move the form down
                }}
            >
                <ConstructionIcon sx={{ fontSize: 60, mr: 2 }} />
                <Typography
                    variant="h4"
                    component="h2"
                    
                   
                >
                    JobTrack
                </Typography>
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
                <Typography variant="h5" component="h3" gutterBottom>
                    Create Account
                </Typography>
                {emailError && <Typography color="error" gutterBottom>{emailError}</Typography>}

                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
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
                    label="Email"
                    type="email"
                    name="email"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email}
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
                    error={!!errors.password}
                    helperText={errors.password}
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
                <Typography variant="body2" color="textSecondary">Must be 8 characters with numerical values.</Typography>

                <TextField
                    label="Contact Number"
                    type="text"
                    name="contactNumber"
                    fullWidth
                    required
                    margin="normal"
                    onChange={handleInputChange}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
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
}

export default Register;
