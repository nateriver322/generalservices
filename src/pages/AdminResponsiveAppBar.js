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

const AdminResponsiveAppBar = ({
    searchUsername,
    handleSearchChange,
    handleSearchClick,
    handleCreateAccountButtonClick,
    handleLogoutButtonClick,
    isSearching
  }) => {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <TextField
            label="Search Username"
            value={searchUsername}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ marginRight: 2 }}
          />
          <Button
            color="inherit"
            onClick={handleSearchClick}
            disabled={isSearching}
          >
            {isSearching ? <CircularProgress size={20} /> : 'Search'}
          </Button>
          <Button
            color="inherit"
            onClick={handleCreateAccountButtonClick}
            sx={{ marginLeft: 2 }}
          >
            Create Account
          </Button>
          <Button
            color="inherit"
            onClick={handleLogoutButtonClick}
            sx={{ marginLeft: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  };
  
export default AdminResponsiveAppBar;
