import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import LoginResponsiveAppBar from './LoginResponsiveAppBar';
import ConstructionIcon from '@mui/icons-material/Construction';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8080/api/forgot_password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setError('An error occurred. Please try again.');
      setTimeout(() => {
        setError('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
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
        <Typography variant="h4" component="h2">
          JobTrack
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleForgotPasswordSubmit}
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
        <Typography variant="h5" component="h3" gutterBottom>
          Forgot Password
        </Typography>

        {error && <Typography color="error" gutterBottom>{error}</Typography>}
        {message && <Typography color="primary" gutterBottom>{message}</Typography>}

        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          onChange={handleInputChange}
          value={email}
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
            disabled={isSubmitting}
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
            {isSubmitting ? 'Sending...' : 'Reset Password'}
          </Button>

          <Button
            type="button"
            variant="outlined"
            fullWidth
            onClick={() => navigate('/')}
            sx={{
              borderColor: '#800000',
              color: '#800000',
              mt: 2,
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ForgotPassword;
