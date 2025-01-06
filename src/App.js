import './App.css';
import Dashboard from './Main/Dashboard';
import React , { useEffect, useState } from 'react';
import IPTVPlayer from './Main/IPTVPlayer';
import axios from 'axios';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';

const App = () => {
  const videoRef = React.useRef(null);
  const [page,setPage] = useState('home')
  const [channels,setChannels] = useState();
  const url = 'http://tvway.pro/get.php?username=N8TV7J6Y&password=NMH0F4&type=m3u_plus&output=mpegts'

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
  
  return (

    page === 'home' ?
      <Dashboard setPage={setPage} />
      :
    page === 'player' ?
      <IPTVPlayer channels={channels} />
      :
      <>
      </>
  );
};

export default App;
