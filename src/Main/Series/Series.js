import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, Button, CircularProgress, Typography, Grid, Modal, Box,  } from "@mui/material";
import './Series.css'

const Series = (props) => {
  const [seriesList, setSeriesList] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [serieDetails, setSerieDetails] = useState(null); 
  const [loadingSerieDetails, setLoadingSerieDetails] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [VideoPlaying, setVideoPlaying] = useState({isplaying:false,url:''});
  const [selectedSeason, setSelectedSeason] = useState(null);

  const handlePlayClick = async(episode) => {
    setShowModal(false); 

    setVideoPlaying({isplaying:true,url:`http://tvway.pro/series/${props.username}/${props.password}/${episode.id}.${episode.container_extension}`});
  };

  const handleCloseVideo = () => {
    setVideoPlaying({isplaying:false,url:''});
  };

  const transformCategories = async (categories) => {
    const result = {};

    categories.forEach((category) => {
      const { category_id, category_name } = category;
      result[category_id] = {
        category_name,
        series: [],
      };
    });

    // Fetch and add series to categories
    try {
      const response = await axios.get(
        `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_series`
      );
      addSeriesToCategories(result, response.data);
    } catch (error) {
      console.error("Error fetching VOD streams:", error);
    }
  };

  const addSeriesToCategories = (categoriesArray, seriesArray) => {
    seriesArray.forEach((serie) => {
      const { category_id } = serie;
      if (categoriesArray[category_id]) {
        categoriesArray[category_id].series.push(serie);
      }
    });
    setSeriesList(categoriesArray);
  };

  useEffect(() => {
    const getSeries = async () => {
      try {
        const response = await axios.get(
          `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_series_categories`
        );
        transformCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getSeries();
  }, [props.username, props.password]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(seriesList[categoryId]);
    setSelectedCategoryId(categoryId); // Set selected category ID
  };

  const handleSerieClick = async (serie) => {
    setLoadingSerieDetails(true); // Start loading movie details
    try {
      // Fetch the details for the selected movie
      const response = await axios.get(
        `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_series_info&series_id=${serie.series_id}`
      );
      setSerieDetails(response.data); // Store the movie details
      setShowModal(true); // Show modal with movie details
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoadingSerieDetails(false); // Stop loading state
    }
  };

  const handleCloseModal = () => {
    setSelectedSeason(null)
    setSerieDetails(null)
    setShowModal(false);
  };

  

  return (
    seriesList?
    <div style={{ display: "flex", height: "100vh" ,backgroundColor:'#001f3f'}}>
      <>
      <div
        className="custom-scrollbar" // Add this class to your div
        style={{
          width: "25%",
          padding: "10px",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <h3 style={{ color: 'white' }}>Categories</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {seriesList &&
            Object.keys(seriesList).map((categoryId) => (
              <li
                key={categoryId}
                onClick={() => handleCategoryClick(categoryId)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  transition: "background-color 0.3s, color 0.3s",
                  backgroundColor: selectedCategoryId === categoryId ? "#f0f0f0" : "transparent",
                  color: 'white',
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
                }}
              >
                {seriesList[categoryId].category_name}
              </li>
            ))}
        </ul>
      </div>


      {/* Right Column - Serie */}
      <div
        style={{
          width: "75%",
          padding: "10px",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        {selectedCategory ? (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)", // 5 items per row
                gap: "10px", // Space between items
                marginBottom: "20px",
              }}
            >
              {selectedCategory.series.map((serie) => (
                <div
                  key={serie.series_id}
                  onClick={() => handleSerieClick(serie)}
                  style={{
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "10px",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.05)"; // Slight zoom effect
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // Reset zoom
                  }}
                >
                  <img
                    src={serie.cover}
                    alt={serie.name}
                    width="100"
                    height="auto"
                  />
                  <p style={{color:'white'}}>{serie.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Movie Details Modal */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
            style: {
            position: 'relative',
            backgroundImage: serieDetails
                ? `url(${serieDetails.info.backdrop_path ? serieDetails.info.backdrop_path[0] : serieDetails.info.cover})`
                : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            },
        }}
        >
        <div
            style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            }}
        />
        <DialogContent style={{ position: 'relative', zIndex: 2 }}>
            {loadingSerieDetails ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
                <CircularProgress />
            </div>
            ) : (
            serieDetails && (
                <Grid container spacing={2}>
                {/* Top Section - Image and Movie Information */}
                <Grid item xs={12} container spacing={2}>
                    {/* Left side - Movie Image */}
                    <Grid item xs={12} sm={4} style={{ display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={serieDetails.info.cover}
                        alt={serieDetails.info.name}
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                    </Grid>

                    {/* Right side - Movie Information */}
                    <Grid item xs={12} sm={8}>
                    <Typography variant="h5" gutterBottom>
                        {serieDetails.info.name} ({serieDetails.info.releaseDate.split('-')[0]})
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        {serieDetails.info.genre}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                        <CircularProgress
                            variant="determinate"
                            value={parseFloat(serieDetails.info.rating) * 10} // Convert to percentage
                            size={60} // Circle size
                            thickness={4} // Circle thickness
                        />
                        <Typography
                            variant="body1"
                            style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#fff',
                            }}
                        >
                            {`${Math.round(parseFloat(serieDetails.info.rating) * 10)}%`}
                        </Typography>
                        </div>
                        <Typography variant="body1" style={{ marginLeft: 10 }} gutterBottom>
                        User Score
                        </Typography>
                    </div>
                    <Typography variant="body1" paragraph>
                        {serieDetails.info.plot}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Cast:
                    </Typography>
                    <Typography variant="body1">{serieDetails.info.cast}</Typography>
                    </Grid>
                </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                        Saisons et Épisodes
                        </Typography>
                        {/* Seasons List */}
                        <Grid container spacing={2}>
                        {serieDetails.seasons.map((season, index) => (
                            <Grid item xs={12} sm={3} key={index}>
                            <Button 
                                variant="outlined" 
                                color="white" 
                                fullWidth 
                                onClick={() => setSelectedSeason(index)}
                                style={{
                                    cursor:'pointer',
                                    borderColor: selectedSeason === index ? 'black' : undefined, // Blue border if selected
                                    color: selectedSeason === index ? 'black' : undefined, // Change text color to blue if selected
                                    backgroundColor :selectedSeason === index ? 'white' : 'transparent'
                                  }}
                                onMouseEnter={(e) => {
                                if (selectedSeason !== index ) {
                                    e.target.style.backgroundColor = "white"; // Light gray on hover
                                    e.target.style.color = "black"; // Light gray on hover
                                }
                                }}
                                onMouseLeave={(e) => {
                                if (selectedSeason !== index ) {
                                    e.target.style.backgroundColor = "transparent"; // Remove background
                                    e.target.style.color = "white"; // Light gray on hover
                                }
                                }}
                                >
                                {season.name}
                            </Button>
                            </Grid>
                        ))}
                        </Grid>

                        {/* Episodes List */}
                        {selectedSeason !== null && (
                        <div style={{ marginTop: '20px' }}>
                            <Typography variant="h6" gutterBottom>
                            Épisodes ({serieDetails.seasons[selectedSeason].name})
                            </Typography>
                            <Grid container spacing={2}>
                            {serieDetails.episodes[selectedSeason + 1].map((episode, index) => (
                                <Grid item xs={12} sm={6} key={index}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    color="white"
                                    onClick={() => handlePlayClick(episode)}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "white"; // Light gray on hover
                                        e.target.style.color = "black"; // Light gray on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "transparent"; // Remove background
                                        e.target.style.color = "white"; // Light gray on hover
                                    }}
                                    style={{
                                        cursor:'pointer'
                                    }}
                                >
                                    {episode.title}
                                </Button>
                                </Grid>
                            ))}
                            </Grid>
                        </div>
                        )}
                    </Grid>

            </Grid>
            )
            )}
        </DialogContent>
        </Dialog>


    <Modal open={VideoPlaying.isplaying} onClose={() => {handleCloseVideo()}} >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '90%',
          bgcolor: 'black',
          boxShadow: 24,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <video
          src={VideoPlaying.url}
          controls
          autoPlay
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
    </Modal>
    </>
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
        Loading Series...
      </Typography>
    </Box>
    </>
    
  );
};

export default Series;
