import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00B0FF', // Orange
    },
    secondary: {
      main: '#673ab7', // Deep Purple
    },
    background: {
      paper: '#ffffff',
    },
    common: {
      white: '#ffffff',
    },
    
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
);

// Measure performance in your app
reportWebVitals();
