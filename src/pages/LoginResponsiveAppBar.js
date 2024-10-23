import * as React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
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
// Import the logo image
import citLogo from '../images/cit-logo.png';

const pages= ['Home'];
const settings = ['Logout'];

function LoginResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole'); // Clear username from sessionStorage
    navigate('/'); // Redirect to login page
}

  const handlePageNavigation = (page) => {
    handleCloseNavMenu(); // Close the navigation menu
    
    // Redirect to the dashboard (Home) page only
    if (page === 'Home') {
      navigate('/dashboard'); // Redirect to the dashboard page
    }
};


  return (
    <AppBar position="static" sx={{ backgroundColor: '#d4ac0d', height: 100 }}>  {/* Maroon color */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img
            src={citLogo}
            alt="CIT-U Logo"
            style={{ display: { xs: 'none', md: 'flex' }, marginRight: '10px', height: 80 }} // Adjust height as needed
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           
          </Typography>

          
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
           
          </Typography>

          

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default LoginResponsiveAppBar;
