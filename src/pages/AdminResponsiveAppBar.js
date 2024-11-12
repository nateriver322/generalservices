import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import citLogo from '../images/cit-logo.png';


const AdminResponsiveAppBar = ({
    searchUsername,
    handleSearchChange,
    handleSearchClick,
    handleCreateAccountButtonClick,
    handleLogoutButtonClick,
    isSearching
  }) => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#d4ac0d', height: 100 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <img
                src={citLogo}
                alt="CIT-U Logo"
                style={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px', height: 80 }}
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                Admin Dashboard
              </Typography>
    
              <TextField
                label="Search Username"
                value={searchUsername}
                onChange={handleSearchChange}
                variant="outlined"
                size="small"
                sx={{ backgroundColor: 'white', 
                      borderRadius: 1,
                      marginRight: 2,
                    '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                    borderColor: '#5dade2', 
                    },
                '&:hover fieldset': {
                  borderColor: '#5499c7', 
                },
              },
                }}
              />
              
              <Button
                color="inherit"
                onClick={handleSearchClick}
                disabled={isSearching}
                sx={{ color: 'white', 
                    backgroundColor: '#5dade2',
                    borderColor: 'white', 
                    marginRight: 2,
                '&:hover': {
                backgroundColor: '#5499c7',
              },
             }}
              >
                {isSearching ? <CircularProgress size={20} /> : 'Search'}
              </Button>
              
              <Button
                color="inherit"
                onClick={handleCreateAccountButtonClick}
                sx={{ color: 'white', 
                    backgroundColor: '#4caf50',
                    borderColor: 'white', 
                    marginRight: 2,
                '&:hover': {
                backgroundColor: '#45a049', 
              },
             }}
              >
                Create Account
              </Button>
    
              <Button
                color="inherit"
                onClick={handleLogoutButtonClick}
                sx={{ color: 'white', 
                    backgroundColor: '#f44336',
                    borderColor: 'white',
                '&:hover': {
                backgroundColor: '#e53935', 
              }, }}

              >
                Logout
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
      );
    };
    
    export default AdminResponsiveAppBar;
