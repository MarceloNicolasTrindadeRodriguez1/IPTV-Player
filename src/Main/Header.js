// src/Header.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
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
    localStorage.setItem('cred_player', '{}');
    props.setCredentials({})
    props.setPage('home')
  };

  return (
    <AppBar position="static" style={{ backgroundColor: appBarDarkerColor }}>
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer', color: 'white' }} onClick={() => props.setPage('home')}>
          Payaso Player PRO 
        </Typography>
        <Typography variant="subtitle1" style={{ marginRight: 20, color: 'white' }}>
          {currentTime?currentTime:''}
        </Typography>
        {props.credentials && Object.entries(props.credentials).length !== 0 &&
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
