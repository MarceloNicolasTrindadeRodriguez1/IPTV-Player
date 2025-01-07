// src/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = () => {
  const currentTime = new Date().toLocaleTimeString();
  const appBarDarkerColor = '#001a33'; // slightly darker color

  return (
    <AppBar position="static" style={{minHeight : '12vh' ,backgroundColor: appBarDarkerColor }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Jazmin IPTV PRO
          </Typography>
          <Typography variant="subtitle1" style={{ marginRight: 20 }}>
            {currentTime}
          </Typography>
          <IconButton color="inherit">
            <RefreshIcon />
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
  );
};

export default Header;
