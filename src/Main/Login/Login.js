import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Alert, Paper, FormControlLabel, Switch, Checkbox } from '@mui/material';
import axios from 'axios';
import Terms from '../Terms/Terms';

const Login = (props) => {
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [link, setLink] = useState('');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    const getAuth = async () => {
      let credential = JSON.parse(localStorage.getItem('cred_player'));
      if (credential && Object.entries(credential).length !== 0) {
        try {
          await axios
            .get(`${credential.domain}/player_api.php?username=${credential.username}&password=${credential.password}`)
            .then((response) => {
              if (response.data.user_info.auth === 1) {
                props.setCredentials({ username: credential.username, password: credential.password, domain: credential.domain });
                props.setPage('dashboard');
              } else {
                setError(props.language === 'Spanish' ? 'Nombre de usuario o contraseña inválidos' : props.language === 'English' ? 'Invalid username or password' : 'Nom d’utilisateur ou mot de passe invalide');
              }
            });
        } catch (err) {
          console.error('Error during login:', err);
          setError(props.language === 'Spanish' ? 'Ocurrió un error inesperado' : props.language === 'English' ? 'An unexpected error occurred' : 'Une erreur inattendue s\'est produite');
        }
      }
    };
    getAuth();
  }, []);

  const handleLogin = async () => {
    if (!isChecked) {
      setError(props.language === 'Spanish' ? 'Debes aceptar los términos y condiciones' : props.language === 'English' ? 'You must accept the Terms and Conditions' : 'Vous devez accepter les termes et conditions');
      return;
    }

    if (isAdvanced) {
      // Advanced login with link
      if (link === '') {
        setError(props.language === 'Spanish' ? 'Por favor ingresa el enlace' : props.language === 'English' ? 'Please enter the link' : 'Veuillez entrer le lien');
        return;
      } else {
        const url = new URL(link);
        const domain = url.origin;
        const params = new URLSearchParams(url.search);
        const usernameTmp = params.get('username');
        const passwordTmp = params.get('password');

        await axios
          .get(`${domain}/player_api.php?username=${usernameTmp}&password=${passwordTmp}`)
          .then((response) => {
            if (response.data.user_info.auth === 1) {
              localStorage.setItem('cred_player', JSON.stringify({ username: usernameTmp, password: passwordTmp, domain: domain }));
              props.setCredentials({ username: usernameTmp, password: passwordTmp, domain: domain });
              props.setPage('dashboard');
            } else {
              setError(props.language === 'Spanish' ? 'Nombre de usuario o contraseña inválidos' : props.language === 'English' ? 'Invalid username or password' : 'Nom d’utilisateur ou mot de passe invalide');
            }
          });
      }
      return;
    } else {
      if (username === '' || password === '' || server === '') {
        setError(props.language === 'Spanish' ? 'Por favor completa todos los campos' : props.language === 'English' ? 'Please fill in all fields' : 'Veuillez remplir tous les champs');
        return;
      }
      if (!server.includes('http://') && !server.includes('https://')) {
        setError(props.language === 'Spanish' ? 'Asegúrate de insertar http:// o https://' : props.language === 'English' ? 'Make sure to insert http:// or https://' : 'Assurez-vous d\'insérer http:// ou https://');
        return;
      }

      try {
        await axios
          .get(`${server}/player_api.php?username=${username}&password=${password}`)
          .then((response) => {
            if (response.data.user_info.auth === 1) {
              localStorage.setItem('cred_player', JSON.stringify({ username: username, password: password, domain: server }));
              props.setCredentials({ username: username, password: password, domain: server });
              props.setPage('dashboard');
            } else {
              setError(props.language === 'Spanish' ? 'Nombre de usuario o contraseña inválidos' : props.language === 'English' ? 'Invalid username or password' : 'Nom d’utilisateur ou mot de passe invalide');
            }
          });
      } catch (err) {
        console.error('Error during login:', err);
        setError(props.language === 'Spanish' ? 'Ocurrió un error inesperado' : props.language === 'English' ? 'An unexpected error occurred' : 'Une erreur inattendue s\'est produite');
      }
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px', backgroundColor: 'transparent' }}>
      <Paper elevation={5} maxWidth="xs" style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          {props.language === 'Spanish' ? 'Iniciar sesión' : props.language === 'English' ? 'Login' : 'Connexion'}
        </Typography>
        <FormControlLabel
          control={<Switch checked={isAdvanced} onChange={() => setIsAdvanced(!isAdvanced)} />}
          label={props.language === 'Spanish' ? 'Inicio de sesión avanzado' : props.language === 'English' ? 'Advanced Login' : 'Connexion avancée'}
        />
        {!isAdvanced ? (
          <>
            <TextField
              label={props.language === 'Spanish' ? 'Servidor' : props.language === 'English' ? 'Server' : 'Serveur'}
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              fullWidth
              margin="normal"
              required
              placeholder="http://exemple.com"
            />
            <TextField
              label={props.language === 'Spanish' ? 'Nombre de usuario' : props.language === 'English' ? 'Username' : 'Nom d’utilisateur'}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label={props.language === 'Spanish' ? 'Contraseña' : props.language === 'English' ? 'Password' : 'Mot de passe'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </>
        ) : (
          <TextField
            label={props.language === 'Spanish' ? 'Ingresa enlace' : props.language === 'English' ? 'Enter Link' : 'Entrer le lien'}
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
          {props.language === 'Spanish' ? 'Iniciar sesión' : props.language === 'English' ? 'Login' : 'Connexion'}
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              color="primary"
            />
          }
          label={
            <>
              {props.language === 'Spanish' ? 'Acepto los ' : props.language === 'English' ? 'I accept the ' : 'J\'accepte les '}
              <Button onClick={() => setIsTermsOpen(true)}>
                {props.language === 'Spanish' ? 'Términos y Condiciones' : props.language === 'English' ? 'Terms and Conditions' : 'Termes et conditions'}
              </Button>
            </>
          }
          style={{ marginTop: '10px' }}
        />
      </Paper>
      <Terms open={isTermsOpen} onClose={setIsTermsOpen} setIsChecked={setIsChecked} language={props.language} />
    </Container>
  );
};

export default Login;
