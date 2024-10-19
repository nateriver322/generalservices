import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import citLogo from '../images/cit-logo.png';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Popover from '@mui/material/Popover';

const pages = ['Home', 'Resolved', 'Roles'];
const settings = ['Logout'];

function StaffAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications/staff');
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
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationMenu = () => {
    setAnchorElNotification(null);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    navigate('/');
  };

  const handlePageNavigation = (page) => {
    handleCloseNavMenu();
    if (page === 'Home') {
      navigate('/dashboard');
    } else if (page === 'Resolved') {
      navigate('/ticketsFixed');
    } else if (page === 'Roles') {
      navigate('/subrole');
    }
  };

  const isActive = (path) => {
    if (path === 'Home' && location.pathname === '/dashboard') return true;
    if (path === 'Resolved' && location.pathname === '/ticketsFixed') return true;
    if (path === 'Roles' && location.pathname === '/subrole') return true;
    return false;
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
                  display: 'block',
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

          <IconButton 
            color="inherit" 
            onClick={handleOpenNotificationMenu}
            sx={{ ml: -1.3 }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Popover
            open={Boolean(anchorElNotification)}
            anchorEl={anchorElNotification}
            onClose={handleCloseNotificationMenu}
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
  );
}

export default StaffAppBar;