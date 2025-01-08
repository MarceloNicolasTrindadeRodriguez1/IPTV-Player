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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: appBarBackgroundColor }}>
      
      {/* Main content */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {/* Live TV Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #0097a7, #80deea)" height="300px" onClick={()=>props.setPage('Live')}>
            <LiveTvIcon style={{ fontSize: 120 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10 ,fontWeight:600}}>
              Live TV
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Movies Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #ff5722, #ff8a65)" height="300px" onClick={()=>props.setPage('Movie')}>
            <TheatersIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
              Movies
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Series Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #673ab7, #9575cd)" height='300px'  onClick={()=>props.setPage('Serie')}>
            <TvIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
              Series
            </Typography>
          </GradientPaper>
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
