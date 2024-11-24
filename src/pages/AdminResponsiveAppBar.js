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


    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutButtonClick = async () => {
      setIsLoggingOut(true); // Start loading animation
  
      // Simulate a small delay for the animation
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      // Clear session and local storage
      sessionStorage.clear();
      localStorage.clear();
  
      // Navigate to the login page
      navigate('/');
  
      setIsLoggingOut(false); // Stop loading animation (though component will unmount)
    };


    return (
      <>
        <AppBar position="static" sx={{ backgroundColor: '#d4ac0d', height: 100 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <img
                src={citLogo}
                alt="CIT-U Logo"
                style={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px', height: 80 }}
              />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                Account Management
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
              disabled={isLoggingOut}
              sx={{
                color: 'white',
                backgroundColor: isLoggingOut ? 'gray' : '#f44336',
                borderColor: 'white',
                '&:hover': {
                  backgroundColor: isLoggingOut ? 'gray' : '#e53935',
                },
              }}
            >
              {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : 'Logout'}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

<Backdrop
sx={{
  color: '#fff',
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
}}
open={isLoggingOut}
>
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
  <CircularProgress color="info" />
  <Typography variant="h6" component="div">
    Logging out...
  </Typography>
</Box>
</Backdrop>
</>
      );
    };
    
    export default AdminResponsiveAppBar;
