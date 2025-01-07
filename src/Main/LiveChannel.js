import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import VideoPlayer from "./VideoPlayer"; 
import axios from "axios";

const LiveChannel = (props) => {
  const [channelsList, setChannelsList] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const transformCategories = async (categories) => {
    const result = {};

    categories.forEach(category => {
      const { category_id, category_name } = category;
      result[category_id] = {
        category_name,
        channels: []
      };
    });

    await axios.get(`http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_live_streams`)
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
      await axios.get(`http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_live_categories`)
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
  };

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    channelsList ?
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Column - Categories */}
        <div style={{ 
          width: '25%', 
          borderRight: '1px solid #ccc', 
          padding: '10px', 
          overflowY: 'auto', 
          maxHeight: '100vh' // Fixed height for scrolling
        }}>
          <h3>Categories</h3>
          <ul>
            {Object.keys(channelsList).map((categoryId) => (
              <li key={categoryId} onClick={() => handleCategoryClick(categoryId)} style={{ cursor: 'pointer' }}>
                {channelsList[categoryId].category_name}
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Column - Channels */}
        <div style={{ 
          width: '25%', 
          borderRight: '1px solid #ccc', 
          padding: '10px', 
          overflowY: 'auto', 
          maxHeight: '100vh' // Fixed height for scrolling
        }}>
          <h3>Channels</h3>
          {selectedCategory ? (
            <ul>
              {selectedCategory.channels.map((channel) => (
                <li key={channel.stream_id} onClick={() => handleChannelClick(channel)} style={{ cursor: 'pointer' }}>
                  {channel.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>Please select a category to see the channels.</p>
          )}
        </div>

        {/* Right Column - Video Stream */}
        <div style={{ 
          width: '25%', 
          padding: '10px' 
        }}>
          <h3>Video Stream</h3>
          {selectedChannel ? (
            <VideoPlayer videoUrl={`http://tvway.pro/live/${props.username}/${props.password}/${selectedChannel.stream_id}.m3u8`} />
          ) : (
            <p>Select a channel to watch the stream.</p>
          )}
        </div>
      </div>
      : <></>
  );
};

export default LiveChannel;
