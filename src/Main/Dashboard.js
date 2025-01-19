// src/Dashboard.js
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import TheatersIcon from '@mui/icons-material/Theaters';
import TvIcon from '@mui/icons-material/Tv';

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

const translations = {
  English: {
    live: 'Live TV',
    movies: 'Movies',
    tvSeries: 'TV Series',
  },
  Spanish: {
    live: 'En Vivo',
    movies: 'Películas',
    tvSeries: 'Series de TV',
  },
  French: {
    live: 'En Direct',
    movies: 'Films',
    tvSeries: 'Séries TV',
  },
  // Add other languages as needed
};

const Dashboard = (props) => {

  const appBarBackgroundColor = '#001f3f'; // original color

  return (
    <div style={{ marginTop:20,minHeight: '100vh', backgroundColor: appBarBackgroundColor }}>
      
      {/* Main content */}
      <Grid container spacing={3} justifyContent="center" style={{ padding: '20px' }}>
        {/* Live TV Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #0097a7, #80deea)" height="300px" onClick={()=>props.setPage('Live')}>
            <LiveTvIcon style={{ fontSize: 120 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10 ,fontWeight:600}}>
              {translations[props.language]?.live}
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Movies Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #ff5722, #ff8a65)" height="300px" onClick={()=>props.setPage('Movie')}>
            <TheatersIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
            {translations[props.language]?.movies}
            </Typography>
          </GradientPaper>
        </Grid>

        {/* Series Card */}
        <Grid item xs={12} sm={6} md={4} style={{ cursor:'pointer' }} >
          <GradientPaper elevation={3} gradient="linear-gradient(135deg, #673ab7, #9575cd)" height='300px'  onClick={()=>props.setPage('Serie')}>
            <TvIcon style={{ fontSize: 90 }} />
            <Typography variant="h4" component="h2" style={{ marginTop: 10,fontWeight:600 }}>
            {translations[props.language]?.tvSeries}
            </Typography>
          </GradientPaper>
        </Grid>


        {/* Footer */}
        <Grid item xs={12} style={{ textAlign: 'center', marginTop: '20px', color: '#fff' }}>
          {props.expiration?
          <Typography>{props.language === 'Spanish'? 'Expiración' : props.language === 'English'? 'Expiration' : 'Expiration' } : {new Intl.DateTimeFormat(props.language === 'Spanish'? 'es' : props.language === 'English'? 'en' : 'fr' , {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(props.expiration)}</Typography>
          :
          <></>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
