import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Alert } from '@mui/material';

const ResetPasswordForm = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
        const data = await response.json();
        setSuccess(true);
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred while updating your password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Typography variant="h4">Reset Password</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Your password has been successfully reset. You can now log in with your new password.</Alert>}

      <TextField
        label="New Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <TextField
        label="Confirm New Password"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary">
        Reset Password
      </Button>
    </form>
  );
};

export default ResetPasswordForm;