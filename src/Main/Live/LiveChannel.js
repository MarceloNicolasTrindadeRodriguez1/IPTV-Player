import React, { useEffect, useState } from "react";
import VideoPlayer from "../VideoPlayer"; 
import axios from "axios";
import './LiveChannel.css'
import { Box, CircularProgress, Typography } from "@mui/material";

const LiveChannel = (props) => {
  const [channelsList, setChannelsList] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedChannelId,setSelectedChannelId] = useState(null);

  const transformCategories = async (categories) => {
    const result = {};

    categories.forEach(category => {
      const { category_id, category_name } = category;
      result[category_id] = {
        category_name,
        channels: []
      };
    });

    await axios.get(`http://tvway.pro/player_api.php?username=${props.credentials.username}&password=${props.credentials.password}&action=get_live_streams`)
      .then(list => {
        addChannelsToCategories(result, list.data);
      });
  }

  function addChannelsToCategories(categoriesArray, channelsArray) {
    channelsArray.forEach(channel => {
      const { category_id } = channel;
      if (categoriesArray[category_id]) {
        categoriesArray[category_id].channels.push(channel);
      }
    });
    console.log('tererer ', categoriesArray);
    setChannelsList(categoriesArray);
  }

  useEffect(() => {
    const getChannels = async () => {
      await axios.get(`http://tvway.pro/player_api.php?username=${props.credentials.username}&password=${props.credentials.password}&action=get_live_categories`)
        .then(async response => {
          transformCategories(response.data);
        }).catch(e => {
          console.log('e', e);
        });
    }

    getChannels();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(channelsList[categoryId]);
    setSelectedChannel(null); // Reset channel when category changes
    setSelectedCategoryId(categoryId); // Set selected category ID
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(null); 
    setSelectedChannel(channel);
    setSelectedChannelId(channel.stream_id)
  };

  return (
    channelsList ?
      <div style={{ display: 'flex', minheight: '100vh',backgroundColor:'#001f3f' }}>
        {/* Left Column - Categories */}
        <div 
        className="custom-scrollbar" // Add this class to your div
        style={{ 
          width: '25%', 
          padding: '10px', 
          overflowY: 'auto', 
          maxHeight: '100vh' // Fixed height for scrolling
        }}
        >
        <h3 style={{ color: 'white' }}>Categories</h3>
          <ul style={{ padding: 0, margin: 0 }}>
            {Object.keys(channelsList).map((categoryId) => (
              <li 
              key={categoryId} 
              onClick={() => handleCategoryClick(categoryId)} 
              style={{ 
                cursor: "pointer",
                padding: "10px",
                transition: "background-color 0.3s, color 0.3s",
                color: 'white',
                backgroundColor: selectedCategoryId === categoryId ? "#f0f0f0" : "transparent",
                borderRadius: '20px',
              }}
              onMouseEnter={(e) => {
                if (selectedCategoryId !== categoryId) {
                  e.target.style.backgroundColor = "#f0f0f0"; // Light gray on hover
                  e.target.style.color = "black"; // Blue text on hover
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategoryId !== categoryId) {
                  e.target.style.backgroundColor = "transparent"; // Remove background
                  e.target.style.color = "white"; // Reset text color
                }
              }}>
                {channelsList[categoryId].category_name}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column - Channels */}
        <div
          className="custom-scrollbar"
          style={{ 
          width: '25%', 
          padding: '10px', 
          overflowY: 'auto', 
          maxHeight: '100vh' // Fixed height for scrolling
        }}>
          
          {selectedCategory ? (
            <>
            <h3 style={{ color: 'white' }}>Channels</h3>
            <ul style={{ padding: 0, margin: 0 }}>
              {selectedCategory.channels.map((channel) => (
                <li 
                  key={channel.stream_id} 
                  onClick={() => handleChannelClick(channel)} 
                  style={{ 
                    cursor: "pointer",
                    padding: "10px",
                    transition: "background-color 0.3s, color 0.3s",
                    color: 'white',
                    backgroundColor: selectedChannelId === channel.stream_id ? "#f0f0f0" : "transparent",
                    borderRadius: '20px', }}
                  onMouseEnter={(e) => {
                    if (selectedChannelId !== channel.stream_id) {
                      e.target.style.backgroundColor = "#f0f0f0"; // Light gray on hover
                      e.target.style.color = "black"; // Blue text on hover
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedChannelId !== channel.stream_id) {
                      e.target.style.backgroundColor = "transparent"; // Remove background
                      e.target.style.color = "white"; // Reset text color
                    }
                  }}>
                  {channel.name}
                </li>
              ))}
            </ul>
            </>
          ) : (
            <></>
          )}
        </div>

        { 
          selectedChannel ? 
            <div style={{ width: "50%", padding: "10px" }}>
              <VideoPlayer
                key={selectedChannel.stream_id}
                videoUrl={`http://tvway.pro/live/${props.credentials.username}/${props.credentials.password}/${selectedChannel.stream_id}.m3u8`} />
            </div>
           : (
            <></>
          )
        }     
      </div>
    :
    <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Stack items vertically
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a light background
      }}
    >
      <CircularProgress size={80} /> {/* Increase size of CircularProgress */}
      <Typography variant="h4" sx={{ marginTop: 2 }}> {/* Big loading text */}
        Loading Live Channel...
      </Typography>
    </Box>
    </>
  );
};

export default LiveChannel;
