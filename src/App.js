import './App.css';
import Dashboard from './Main/Dashboard';
import React , { useEffect, useState } from 'react';
import LiveChannel from './Main/Live/LiveChannel';
import axios from 'axios';
import 'video.js/dist/video-js.css';
import Header from './Main/Header';
import Movies from './Main/Movie/Movies'
import Series from './Main/Series/Series';
import Login from './Main/Login/Login';

const App = () => {
  const [page,setPage] = useState()
  const [credentials,setCredentials] = useState(JSON.parse(localStorage.getItem('cred_player')));

  useEffect(() => {
    const getAuth = async() => {
      if(credentials && Object.entries(credentials).length !== 0){
        await axios.get(`http://${credentials.domain}/player_api.php?username=${credentials.username}&password=${credentials.password}`)
        .then(response =>{
          if(response.data.user_info.auth === 1){
            setPage('dashboard')
          }else{
            setPage('home')
          }
        })
      }  else{
        setPage('home')
      }
    }

    getAuth()
  },[credentials])
  
  return (
    <>
    <Header setPage={setPage} setCredentials={setCredentials} credentials={credentials} />
    {
    page === 'home' ?
      <Login setPage={setPage} setCredentials={setCredentials} />
      :
    page === 'dashboard' ?
      <Dashboard setPage={setPage} />
      :
    page === 'Live' ?
      <LiveChannel credentials={credentials} />
      :
    page === 'Movie' ?
    <Movies credentials={credentials} />
    :
    page === 'Serie' ?
    <Series credentials={credentials}  />
    :
      <>
      </>
      }
    </>
  );
};

export default App;
