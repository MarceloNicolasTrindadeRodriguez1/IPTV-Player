// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import TheatersIcon from '@mui/icons-material/Theaters';
import TvIcon from '@mui/icons-material/Tv';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const GradientPaper = styled(Paper)(({ theme, gradient, height }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.palette.common.white,
  background: gradient,
  transition: 'transform 0.3s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: height || '250px', // Default height
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const Dashboard = (props) => {
    const [currentTime, setCurrentTime] = useState('');


    useEffect(() => {
      const updateCurrentTime = () => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCurrentTime(formattedTime);
      };

      // Update time initially and every minute
      updateCurrentTime();
      const timer = setInterval(updateCurrentTime, 60000);
      
      
      // Cleanup interval on unmount
      return () => clearInterval(timer);
    }, []);
  const appBarBackgroundColor = '#001f3f'; // original color
  const appBarDarkerColor = '#001a33'; // slightly darker color

  return (
    <div style={{ minHeight: '100vh', backgroundColor: appBarBackgroundColor }}>
      {/* AppBar for the header */}
      <AppBar position="static" style={{ backgroundColor: appBarDarkerColor }}>
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

      {/* Main content */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {/* Live TV Card */}
        <Grid item xs={12} sm={6} md={4} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #0097a7, #80deea)" height="300px" onClick={()=>props.setPage('player')}>
            <LiveTvIcon style={{ fontSize: 120 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10 ,fontWeight:600}}>
              Live TV
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Movies Card */}
        <Grid item xs={12} sm={4}>
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #ff5722, #ff8a65)" height="250px">
            <TheatersIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
              Movies
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Series Card */}
        <Grid item xs={12} sm={4}>
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #673ab7, #9575cd)" height='250px'>
            <TvIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
              Series
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Update EPG, Account, and Catch Up Buttons */}
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper style={{ padding: 20, background: '#4caf50', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">UPDATE EPG</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper style={{ padding: 20, background: '#4caf50', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">ACCOUNT</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper style={{ padding: 20, background: '#4caf50', color: '#fff', textAlign: 'center' }}>
                <Typography variant="h6">CATCH UP</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Footer */}
        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px', color: '#fff' }}>
          <Typography>Expiration: Unlimited</Typography>
          <Typography>Logged in as: Yanis</Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
