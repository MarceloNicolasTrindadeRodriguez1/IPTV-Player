import './App.css';
import Dashboard from './Main/Dashboard';
import React , { useEffect, useState,useRef } from 'react';
import LiveChannel from './Main/Live/LiveChannel';
import axios from 'axios';
import 'video.js/dist/video-js.css';
import Header from './Main/Header';
import Movies from './Main/Movie/Movies'

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

  useEffect(()=>{
    const getChannels = async() => {
      console.log('Channel Yanis:');
      await axios.get(url)
       .then(response => {
         // Handle the response data
         const parseChannels = (data) => {
          const lines = data.trim().split("\n");
          const groupedChannels = {};
        
          let currentChannel = {};
          let groupTitle = "";
        
          lines.forEach((line) => {
            // Check for channel info line
            if (line.startsWith("#EXTINF:")) {
              const parts = line.split(",");
              const info = parts[0]; // Metadata
              const name = parts[1].trim(); // Channel name
        
              // Extract tvg-name, tvg-logo, and group-title using regex
              const logoMatch = info.match(/tvg-logo="([^"]+)"/);
              const logo = logoMatch ? logoMatch[1] : "";
              const groupMatch = info.match(/group-title="([^"]+)"/);
              groupTitle = groupMatch ? groupMatch[1] : "Other"; // Default to 'Other' if no group title
        
              // Add the channel data to the currentChannel object
              currentChannel = { name, logo };
        
              // Initialize group if it doesn't exist
              if (!groupedChannels[groupTitle]) {
                groupedChannels[groupTitle] = [];
              }
            } else if (line.startsWith("http")) {
              // Check for the URL line
              const url = line.trim();
              if (currentChannel.name) {
                currentChannel.url = url;
                groupedChannels[groupTitle].push(currentChannel); // Add the complete channel object to the respective group
                currentChannel = {}; // Reset currentChannel for the next one
              }
            }
          });
        
          // Order groups and channels alphabetically
          const sortedGroupedChannels = Object.keys(groupedChannels)
            .sort() // Sort group titles alphabetically
            .reduce((sorted, groupTitle) => {
              sorted[groupTitle] = groupedChannels[groupTitle].sort((a, b) =>
                a.name.localeCompare(b.name)
              ); // Sort channels alphabetically within each group
              return sorted;
            }, {});
        
          console.log("groupedChannels", sortedGroupedChannels);
          return sortedGroupedChannels;
        };
        
        
        setChannels(parseChannels(response.data));
       })
       .catch(error => {
         // Handle any errors
         console.error('Error fetching the channel:', error);
       });
    }
    getChannels()
  },[])
  
  /*useEffect(() =>{
   if (!playerRef.current) {
         // Initialize Video.js player
         playerRef.current = videojs(videoRef.current, { liveui: true });
       }
   
       if (videoUrl) {
         // Set the source of the video player
         playerRef.current.src({ src: videoUrl, type: "application/x-mpegurl" });
   
         // Play the video
         playerRef.current.play().catch((err) => {
           console.error("Video playback failed:", err);
         });
       }
   
       return () => {
         if (playerRef.current) {
           playerRef.current.dispose(); // Dispose of the Video.js player instance on unmount
           playerRef.current = null;
         }
       };
  },[])*/
  //http://tvway.pro:80/N8TV7J6Y/NMH0F4/94596
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
