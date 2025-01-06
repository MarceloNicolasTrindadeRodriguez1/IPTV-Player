// src/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LanguageIcon from '@mui/icons-material/Language';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <AppBar position="static" style={{ backgroundColor: '#3f51b5' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src={''} alt="Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            IPTV Dashboard
          </Typography>
          <Typography variant="body1" style={{ marginRight: '16px', color: 'white' }}>
            {currentTime}
          </Typography>
        </Box>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit">
          <LanguageIcon />
        </IconButton>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
