import React, { useEffect, useState } from "react";
import axios from "axios";

const Movies = (props) => {
  const [moviesList, setMoviesList] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

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

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
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
                onMouseEnter={(e) => {
                  if(selectedCategoryId !== categoryId){
                    e.target.style.backgroundColor = "#f0f0f0"; // Light gray on hover
                    e.target.style.color = "#007BFF"; // Blue text on hover
                  }
                }}
                onMouseLeave={(e) => {
                  if(selectedCategoryId !== categoryId){
                    e.target.style.backgroundColor = "transparent"; // Remove background
                    e.target.style.color = "black"; // Reset text color
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
                    width="100" // Adjust as needed
                    height="auto"
                  />
                  <p>{movie.name}</p>
                </div>
              ))}
            </div>
            {selectedMovie && (
              <div>
                <h4>{selectedMovie.name}</h4>
                <img
                  src={selectedMovie.stream_icon}
                  alt={selectedMovie.name}
                  width="200"
                  height="auto"
                />
                <video
                  src={`http://tvway.pro/movie/${props.username}/${props.password}/${selectedMovie.stream_id}.${selectedMovie.container_extension}`}
                  width="640"
                  height="360"
                  controls
                />
              </div>
            )}
          </div>
        ) : (
          <p>Please select a category to see the movies.</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
