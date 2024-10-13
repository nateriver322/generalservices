import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';

// Import the logo image
import citLogo from '../images/cit-logo.png';

const pages = ['Home', 'My Tickets'];
const settings = ['Logout'];

function TicketAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null); // New state for notification popover
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/');
    } else {
      fetchNotifications(username);
    }
  }, [navigate]);

  const fetchNotifications = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${username}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${notificationId}`, {
        method: 'PUT',
      });
      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationMenu = (event) => {
    setAnchorElNotification(event.currentTarget); // Open notifications popover
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null); // Close notifications popover
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username'); // Clear username from sessionStorage
    navigate('/'); // Redirect to login page
  };

  const handlePageNavigation = (page) => {
    handleCloseNavMenu(); // Close the navigation menu
    if (page === 'Home') {
      navigate('/dashboard'); // Redirect to the dashboard page
    } else if (page === 'My Tickets') {
      navigate('/myTickets'); // Redirect to the tickets created page
    }
  };

  return (
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
          >
            {/* Add the title here */}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
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
                <MenuItem key={page} onClick={() => handlePageNavigation(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate('/dashboard')}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {/* Add the title here */}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageNavigation(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <IconButton 
            color="inherit" 
            onClick={handleOpenNotificationMenu} // Open notification menu
            sx={{ ml: 2 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(anchorElNotification)} // Use the notification anchor state
            anchorEl={anchorElNotification}
            onClose={handleCloseNotificationMenu} // Close notification menu
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ p: 2, maxWidth: 300, maxHeight: 400, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Typography>No new notifications</Typography>
              ) : (
                notifications.map((notification) => (
                  <Box key={notification.id} sx={{ mb: 2 }}>
                    <Typography>{notification.message}</Typography>
                    <Button 
                      size="small" 
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      Mark as Read
                    </Button>
                  </Box>
                ))
              )}
            </Box>
          </Popover>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <SettingsTwoToneIcon sx={{ fontSize: 30 }} />
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
  );
}

export default TicketAppBar;
