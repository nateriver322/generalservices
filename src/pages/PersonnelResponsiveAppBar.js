
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import citLogo from '../images/cit-logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const pages = ['Home'];
const settings = ['Logout'];

function PersonnelResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true); // Start loading animation
    handleCloseUserMenu(); // Close the menu

    // Simulate a small delay for the animation (you can remove this in production)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear session storage
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    
    // Navigate to login page
    navigate('/');
    setIsLoggingOut(false); // Stop loading animation (though component will unmount)
  };
  const handlePageNavigation = (page) => {
    handleCloseNavMenu();
    
    if (page === 'Home') {
      navigate('/dashboard');
    } 
  };

  const isActive = (path) => {
    if (path === 'Home' && location.pathname === '/dashboard') return true;
    return false;
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
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate('/dashboard')}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ ml: -2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page} 
                  onClick={() => handlePageNavigation(page)}
                  sx={{
                    backgroundColor: isActive(page) ? '#800000' : 'inherit',
                    '&:hover': {
                      backgroundColor: isActive(page) ? '#800000' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Typography sx={{ textAlign: 'center', color: isActive(page) ? 'white' : 'inherit' }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageNavigation(page)}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'bold',
                  backgroundColor: isActive(page) ? '#800000' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive(page) ? '#800000' : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <SettingsTwoToneIcon sx={{ fontSize: 30 }}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => { handleCloseUserMenu(); if (setting === 'Logout') handleLogout(); }}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

<Backdrop
sx={{ 
  color: '#fff', 
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)' 
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
}

export default PersonnelResponsiveAppBar;