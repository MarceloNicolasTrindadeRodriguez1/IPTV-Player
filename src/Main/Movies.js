import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Typography, Grid } from "@mui/material";

const Movies = (props) => {
  const [moviesList, setMoviesList] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null); // Store movie details for the modal
  const [loadingMovieDetails, setLoadingMovieDetails] = useState(false); // Loading state for movie details
  const [showModal, setShowModal] = useState(false); // Control modal visibility

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
      setMovieDetails(response.data.info); // Store the movie details
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

  const handlePlayClick = () => {
    // Simulate playing the movie (you can replace this logic with actual movie playback)
    alert(`Now playing: ${selectedMovie.name}`);
    setShowModal(false); // Close modal after play
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left Column - Categories */}
      <div
        style={{
          width: "25%",
          borderRight: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <h3>Categories</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {moviesList &&
            Object.keys(moviesList).map((categoryId) => (
              <li
                key={categoryId}
                onClick={() => handleCategoryClick(categoryId)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                  transition: "background-color 0.3s, color 0.3s",
                  backgroundColor: selectedCategoryId === categoryId ? "#f0f0f0" : "transparent", 
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
                >
                  <img
                    src={movie.stream_icon}
                    alt={movie.name}
                    width="100"
                    height="auto"
                  />
                  <p>{movie.name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Please select a category to see the movies.</p>
        )}
      </div>

      {/* Movie Details Modal */}
      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogContent>
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
                    src={movieDetails.cover_big}
                    alt={movieDetails.name}
                    width="100%"
                    height="auto"
                    style={{ borderRadius: "8px" }}
                  />
                </Grid>

                {/* Right side - Movie Information */}
                <Grid item xs={12} sm={8}>
                  <Typography variant="h5" gutterBottom>
                    {movieDetails.name} ({movieDetails.releasedate.split("-")[0]})
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {movieDetails.genre} - {movieDetails.duration} mins
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Rating: {movieDetails.rating}
                  </Typography>
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
                    {movieDetails.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Cast:
                  </Typography>
                  <Typography variant="body1">{movieDetails.cast}</Typography>
                </Grid>
              </Grid>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Movies;
