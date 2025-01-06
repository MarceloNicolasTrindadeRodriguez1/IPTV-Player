import React, { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Grid, List, ListItem, ListItemText } from "@mui/material";
import VideoPlayer from "./VideoPlayer"; // Import your VideoPlayer component
import axios from "axios";

const IPTVPlayer = (props) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentChannel, setCurrentChannel] = useState();
  const [finalVideoUrl, setFinalVideoUrl] = useState();

  const fetchFinalVideoUrl = async (url) => {
    try {
      let response = await fetch(url, {
        method: "GET",
        redirect: "follow", // Follow redirects
      });

      // Check if the response is okay and return the final URL
      if (response.ok) {

        response = await fetch(response.url, {
            method: "GET",
            redirect: "follow", // Follow redirects
          });
          console.log(response.url)
        return response.url; // This will give you the final URL after redirection
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching the video URL:", error);
      return null; // Return null on error
    }
  };

  useEffect(() => {
    const getVideoUrl = async () => {
      if (currentChannel) {
        const url = await fetchFinalVideoUrl(currentChannel);
        setFinalVideoUrl(url);
      }
    };
    getVideoUrl();
  }, [currentChannel]);

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">IPTV Player</Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
            <>
        <Grid item xs={12} md={4}>
          <List>
            {Object.keys(props.channels).map((groupName, index) => (
              <ListItem button key={index} onClick={() => setSelectedGroup(groupName)}>
                <ListItemText primary={groupName} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedGroup ? (
            <List>
              {props.channels[selectedGroup].map((channel, index) => (
                <ListItem button key={index} onClick={() => setCurrentChannel(channel.url)}>
                  <ListItemText primary={channel.name} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="h6" align="center">
              Select a group to view channels
            </Typography>
          )}
        </Grid>
        </>

        <Grid item xs={12} md={4}>
          {finalVideoUrl && <VideoPlayer videoUrl={finalVideoUrl} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default IPTVPlayer;
