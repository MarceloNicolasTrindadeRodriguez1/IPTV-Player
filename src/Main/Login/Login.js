// src/Login.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Alert, Paper, FormControlLabel, Switch } from '@mui/material';
import axios from 'axios';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [link, setLink] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false); // Toggle for normal/advanced mode

  useEffect(() => {
    const getAuth = async () => {
      let credential = JSON.parse(localStorage.getItem('cred_jazmin'));
      if (credential && Object.entries(credential).length !== 0) {
        try {
          await axios.get(`http://${credential.domain}/player_api.php?username=${credential.username}&password=${credential.password}`)
            .then(response => {
              if (response.data.user_info.auth === 1) {
                props.setCredentials({ username: credential.username, password: credential.password,domain:credential.domain });
                props.setPage('dashboard');
              } else {
                setError('Invalid username or password');
              }
            });
        } catch (err) {
          console.error('Error during login:', err);
          setError('An unexpected error occurred');
        }
      }
    };
    getAuth();
  }, []);

  const handleLogin = async () => {
    if (isAdvanced) {
      // Advanced login with link
      if (link === '') {
        setError('Please enter the link');
        return;
      }else{
        const url = new URL(link);

        // Retrieve the domain part
        const domain = url.hostname; // 'tvway.pro'
        
        // Retrieve query parameters
        const params = new URLSearchParams(url.search);
        const usernameTmp = params.get('username'); // 'N8TV7J6Y'
        const passwordTmp = params.get('password'); // 'NMH0F4'
        

        await axios.get(`http://${domain}/player_api.php?username=${usernameTmp}&password=${passwordTmp}`)
            .then(response => {
                if (response.data.user_info.auth === 1) {
                localStorage.setItem('cred_jazmin', JSON.stringify({ username: usernameTmp, password: passwordTmp ,domain:domain}));
                props.setCredentials({ username: usernameTmp, password: passwordTmp ,domain:domain });
                props.setPage('dashboard');
                } else {
                setError('Invalid username or password');
                }
            });
      }

      return;
    }else{

        if (username === '' || password === '') {
            setError('Please fill in all fields');
            return;
        }
    
        try {
            await axios.get(`http://tvway.pro/player_api.php?username=${username}&password=${password}`)
            .then(response => {
                if (response.data.user_info.auth === 1) {
                localStorage.setItem('cred_jazmin', JSON.stringify({ username: username, password: password ,domain:'tvway.pro'}));
                props.setCredentials({ username: username, password: password,domain:'tvway.pro' });
                props.setPage('dashboard');
                } else {
                setError('Invalid username or password');
                }
            });
        } catch (err) {
            console.error('Error during login:', err);
            setError('An unexpected error occurred');
        }
    }

  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px', backgroundColor: 'transparent' }}>
      <Paper elevation={5} maxWidth="xs" style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        <FormControlLabel
          control={<Switch checked={isAdvanced} onChange={() => setIsAdvanced(!isAdvanced)} />}
          label="Advanced Login"
        />
        {!isAdvanced ? (
          <>
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </>
        ) : (
          <TextField
            label="Enter Link"
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
