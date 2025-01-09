// src/Login.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Alert, Paper } from '@mui/material';
import axios from 'axios';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() =>{
    const getAuth = async() =>{
        let credential = JSON.parse(localStorage.getItem('cred_jazmin'));
        if(credential){
            try {
                await axios.get(`http://tvway.pro/player_api.php?username=${credential.username}&password=${credential.password}`)
                .then(response =>{
                  if(response.data.user_info.auth === 1){
                    props.setCredentials({username:credential.username,password:credential.password})
                    props.setPage('dashboard')
                  }else{
                    setError('Invalid username or password');
                  }
                })
            } catch (err) {
              console.error('Error during login:', err);
              setError('An unexpected error occurred');
            }
        }
    }
    getAuth()
  },[])

  const handleLogin = async() => {
    if (username === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }

    try {
        await axios.get(`http://tvway.pro/player_api.php?username=${username}&password=${password}`)
        .then(response =>{
          if(response.data.user_info.auth === 1){
            localStorage.setItem('cred_jazmin', JSON.stringify({username:username,password:password}));
            props.setCredentials({username:username,password:password})
            props.setPage('dashboard')
          }else{
            setError('Invalid username or password');
          }
        })
    } catch (err) {
      console.error('Error during login:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px', backgroundColor: 'transparent' }}>
      <Paper elevation={5} maxWidth="xs"  style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
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
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth onClick={() => handleLogin()}>
            Login
          </Button>
      </Paper>
    </Container>
  );
};

export default Login;
