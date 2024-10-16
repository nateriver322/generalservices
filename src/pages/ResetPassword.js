import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';

const ResetPasswordForm = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // New state to control button disabled state
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token not found in the URL.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/reset_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setError('');
        setIsDisabled(true); // Disable the button once the password is reset

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000); // 3 seconds delay for user feedback
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred while updating your password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <LoginResponsiveAppBar />
      {/* JobTrack Logo Section */}
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
        <Typography variant="h4" component="h2">
          JobTrack
        </Typography>
      </Box>
      <Box
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
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" component="h3" gutterBottom>
          Reset Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your password has been successfully reset. Redirecting to login...
          </Alert>
        )}

        <TextField
          label="New Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          label="Confirm New Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            fullWidth
            sx={{
              bgcolor: '#800000',
              '&:hover': {
                bgcolor: '#A00000',
              },
              color: 'white',
            }}
            disabled={isDisabled} // Disable button when isDisabled is true
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ResetPasswordForm;
