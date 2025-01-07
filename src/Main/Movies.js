import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, Button, CircularProgress, Typography, Grid, Modal, Box,  } from "@mui/material";
import './Movies.css'

const Movies = (props) => {
  const [moviesList, setMoviesList] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null); // Store movie details for the modal
  const [loadingMovieDetails, setLoadingMovieDetails] = useState(false); // Loading state for movie details
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [VideoPlaying, setVideoPlaying] = useState({isplaying:false,url:''});

  const handlePlayClick = () => {
    setShowModal(false); // Close modal after play
    setVideoPlaying({isplaying:true,url:`http://tvway.pro/movie/${props.username}/${props.password}/${movieDetails.movie_data.stream_id}.${movieDetails.movie_data.container_extension}`});
  };

  const handleCloseVideo = () => {
    setVideoPlaying({isplaying:false,url:''});
  };

  const transformCategories = async (categories) => {
    const result = {};

    // Transform categories into an object for easy access
    categories.forEach((category) => {
      const { category_id, category_name } = category;
      result[category_id] = {
        category_name,
        movies: [],
      };
    });

    // Fetch and add movies to categories
    try {
      const response = await axios.get(
        `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_vod_streams`
      );
      addMoviesToCategories(result, response.data);
    } catch (error) {
      console.error("Error fetching VOD streams:", error);
    }
  };

  const addMoviesToCategories = (categoriesArray, moviesArray) => {
    moviesArray.forEach((movie) => {
      const { category_id } = movie;
      if (categoriesArray[category_id]) {
        categoriesArray[category_id].movies.push(movie);
      }
    });
    setMoviesList(categoriesArray);
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await axios.get(
          `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_vod_categories`
        );
        transformCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getMovies();
  }, [props.username, props.password]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(moviesList[categoryId]);
    setSelectedMovie(null); // Reset movie when category changes
    setSelectedCategoryId(categoryId); // Set selected category ID
  };

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie);
    setLoadingMovieDetails(true); // Start loading movie details
    try {
      // Fetch the details for the selected movie
      const response = await axios.get(
        `http://tvway.pro/player_api.php?username=${props.username}&password=${props.password}&action=get_vod_info&vod_id=${movie.stream_id}`
      );
      setMovieDetails(response.data); // Store the movie details
      setShowModal(true); // Show modal with movie details
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoadingMovieDetails(false); // Stop loading state
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  

  return (
    moviesList?
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
          {moviesList &&
            Object.keys(moviesList).map((categoryId) => (
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
                {moviesList[categoryId].category_name}
              </li>
            ))}
        </ul>
      </div>


      {/* Right Column - Movies */}
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
              {selectedCategory.movies.map((movie) => (
                <div
                  key={movie.stream_id}
                  onClick={() => handleMovieClick(movie)}
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
                    src={movie.stream_icon}
                    alt={movie.name}
                    width="100"
                    height="auto"
                  />
                  <p style={{color:'white'}}>{movie.name}</p>
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
          position: 'relative', // Required for absolute positioning of overlay
          backgroundImage: movieDetails ? `url(${movieDetails.info.backdrop_path? movieDetails.info.backdrop_path[0]: movieDetails.info.cover_big})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff', // Set text color to white for better contrast
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
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
          zIndex: 1, // Ensure the overlay is above the background
        }}
      />
      <DialogContent style={{ position: 'relative', zIndex: 2 }}>
        {loadingMovieDetails ? (
          <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          movieDetails && (
            <Grid container spacing={2}>
              {/* Left side - Movie Image */}
              <Grid item xs={12} sm={4} style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={movieDetails.info.cover_big}
                  alt={movieDetails.info.name}
                  width="100%"
                  height="auto"
                  style={{ borderRadius: "8px" }}
                />
              </Grid>

              {/* Right side - Movie Information */}
              <Grid item xs={12} sm={8}>
                <Typography variant="h5" gutterBottom>
                  {movieDetails.info.name} ({movieDetails.info.releasedate.split("-")[0]})
                </Typography>
                <Typography variant="body1"  gutterBottom>
                  {movieDetails.info.genre} - {movieDetails.info.duration} mins
                </Typography>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <CircularProgress
                      variant="determinate"
                      value={parseFloat(movieDetails.info.rating) * 10} // Convert to percentage
                      size={60} // Circle size
                      style={{  }}
                      thickness={4} // Circle thickness
                    />
                    <Typography
                      variant="body1"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)', // Center the text
                        color: '#fff',
                      }}
                    >
                      {`${Math.round(parseFloat(movieDetails.info.rating) * 10)}%`}
                    </Typography>
                  </div>
                  <Typography variant="body1" style={{marginLeft:10}}  gutterBottom>
                   User Score
                </Typography>
                </div>
                
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handlePlayClick}
                  style={{ marginBottom: "20px" }}
                >
                  PLAY
                </Button>
                <Typography variant="body1" paragraph>
                  {movieDetails.info.description}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Cast:
                </Typography>
                <Typography variant="body1">{movieDetails.info.cast}</Typography>
              </Grid>
            </Grid>
          )
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <Modal open={VideoPlaying.isplaying} onClose={() => {setVideoPlaying({isplaying:false,url:''})}} >
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
        Loading Movies...
      </Typography>
    </Box>
    </>
    
  );
};

export default Movies;
