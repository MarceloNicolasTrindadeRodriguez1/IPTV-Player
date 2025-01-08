import './App.css';
import Dashboard from './Main/Dashboard';
import React , { useEffect, useState,useRef } from 'react';
import LiveChannel from './Main/Live/LiveChannel';
import axios from 'axios';
import 'video.js/dist/video-js.css';
import Header from './Main/Header';
import Movies from './Main/Movie/Movies'
import Series from './Main/Series/Series';

const App = () => {
  const videoRef = React.useRef(null);
  const playerRef = useRef(null); // Ref for the Video.js player instance
  const [page,setPage] = useState('home')
  const [channels,setChannels] = useState();
  const username = 'N8TV7J6Y'
  const password = 'NMH0F4'
  const videoUrl = 'http://tvway.pro/live/N8TV7J6Y/NMH0F4/94596.m3u8'
  const url = 'http://tvway.pro/get.php?username=N8TV7J6Y&password=NMH0F4&type=m3u_plus&output=mpegts'

  useEffect(() => {
    const getAuth = async() => {
      await axios.get(`http://tvway.pro/player_api.php?username=${username}&password=${password}`)
      .then(response =>{
        console.log('logg ',response)
      })
    }  

    getAuth()
  },[])
  
  return (
    <>
    <Header setPage={setPage} />
    {
    page === 'home' ?
      <Dashboard setPage={setPage} />
      :
    page === 'Live' ?
      <LiveChannel username={username} password={password} channels={channels} />
      :
    page === 'Movie' ?
    <Movies username={username} password={password} channels={channels} />
    :
    page === 'Serie' ?
    <Series username={username} password={password} channels={channels} />
    :
      <>
       <div data-vjs-player>
       <video ref={videoRef} controls style={{ width: '100%', height: 'auto' }} />
      </div>
      </>
      }
    </>
  );
};

export default App;
