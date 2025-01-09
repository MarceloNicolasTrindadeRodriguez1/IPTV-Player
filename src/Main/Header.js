// src/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null); // State for the menu anchor element
  const currentTime = new Date().toLocaleTimeString();
  const appBarDarkerColor = '#001a33'; // Slightly darker color

  // Handle menu open
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.setItem('cred_jazmin', '{}');
    props.setCredentials()
  };

  return (
    <AppBar position="static" style={{ backgroundColor: appBarDarkerColor }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer', color: 'white' }} onClick={() => props.setPage('home')}>
          Jazmin Player PRO 
        </Typography>
        <Typography variant="subtitle1" style={{ marginRight: 20, color: 'white' }}>
          {currentTime}
        </Typography>
        {props.credentials &&
        <IconButton style={{ color: 'white' }} onClick={handleMenuClick}>
          <AccountCircle />
        </IconButton>
        }
        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
