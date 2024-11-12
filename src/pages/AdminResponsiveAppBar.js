import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

function AdminResponsiveAppBar({ searchUsername, handleSearchChange, handleSearchClick, handleCreateAccountButtonClick, handleLogoutButtonClick, isSearching }) {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#d4ac0d', height: 100 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Account Management
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Enter username"
              value={searchUsername}
              onChange={handleSearchChange}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchClick}
              disabled={isSearching}
            >
              {isSearching ? <CircularProgress size={24} /> : 'Search Account'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCreateAccountButtonClick}>
              Create Account
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogoutButtonClick}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AdminResponsiveAppBar;
