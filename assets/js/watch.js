// Function to get query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const tmdbApiKey = '5a41a4ff0e4bfcc5608165fe4ae559ed'; // Replace with your actual API key

// Fetch parameters from the URL
const movieId = getQueryParam('movie'); // Movie ID parameter
const tvId = getQueryParam('tv'); // TV show ID parameter






  




// Get the iframe element
const iframe = document.getElementById('video-player');
const showNameElement = document.getElementById('show-name');
const containerheader = document.getElementById('containerheader');
const seasonsContainer = document.getElementById('seasons-actual-container');
const loader = document.getElementById('loader');

// Show loader while fetching data
loader.style.display = 'block';




async function fetchTVShowDetails(tvId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${tmdbApiKey}`);
        const tvShowDetails = await response.json();
        let description = document.getElementById("Description");

        // Update the show name element with the fetched name
        showNameElement.textContent = `Now Watching: ${tvShowDetails.name}`;
        document.title = `${tvShowDetails.name} - Ronny Flix`;
        description.textContent = tvShowDetails.overview;
        containerheader.textContent = `Seasons list`;

    } catch (error) {
        console.error('Error fetching TV show details:', error);
        showNameElement.textContent = "Error: Unable to fetch TV show details.";
    }
}

// Show the loader initially
const iframeLoader = document.getElementById('iframe-loader');
iframeLoader.style.display = 'flex'; // Flex to show it as a block container

// Add event listener to hide the loader once iframe loads
iframe.addEventListener('load', () => {
    iframeLoader.style.display = 'none'; // Hide loader once the iframe loads
});




// Check if it's a movie or a TV show and set the iframe accordingly
if (movieId) {
    // Movie URL with the updated format
    
    iframe.src = `https://player.vidbinge.com/media/tmdb-movie-${movieId}`;
    console.log(`This is a movie with ID: ${movieId}`);

    // Hide loader as no seasons are needed for movies
    loader.style.display = 'none';
    fetchMovieData(movieId);  // Fetch and show movie details and related movies
} else if (tvId) {
    // TV show URL with the vidbinge format
    iframe.src = `https://vidbinge.dev/embed/tv/${tvId}`;
    fetchTVShowDetails(tvId);

    console.log(`This is a TV show with ID: ${tvId}`);

    // Fetch series data to get seasons and episodes
    fetchSeriesData(tvId);
} else {
    console.error("Error: Missing required parameters in the URL.");
    showNameElement.textContent = "Error: Missing required parameters in the URL.";
    loader.style.display = 'none';
}


async function fetchSeriesData(seriesId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKey}`);
        const tmdbSeries = await response.json();

        // Clear the seasons container
        seasonsContainer.innerHTML = '';

        // Remove season 0 if it exists
        tmdbSeries.seasons = tmdbSeries.seasons.filter(season => season.season_number !== 0);

        // Iterate over the seasons and create cards for each season
        tmdbSeries.seasons.forEach(season => {
            const seasonCard = document.createElement('div');
            seasonCard.classList.add('season-card');
            seasonCard.innerHTML = `
                <div class="season-header">
                    <h3>Season ${season.season_number}</h3>
                    <button class="toggle-episodes">+</button>
                </div>
                <div class="episode-container" id="season-${season.season_number}" style="display: none;"></div>
            `;
            seasonsContainer.appendChild(seasonCard);

            const toggleButton = seasonCard.querySelector('.toggle-episodes');
            const episodeContainer = document.getElementById(`season-${season.season_number}`);

            // Add event listener to toggle episodes on click
            toggleButton.addEventListener('click', function () {
                // Collapse all other episode containers
                const allEpisodeContainers = document.querySelectorAll('.episode-container');
                allEpisodeContainers.forEach(container => {
                    if (container !== episodeContainer) container.style.display = 'none';
                });

                // Toggle current season
                const isExpanded = episodeContainer.style.display === 'block';
                episodeContainer.style.display = isExpanded ? 'none' : 'block';
                toggleButton.textContent = isExpanded ? '+' : '-';

                if (!isExpanded) {
                    fetchEpisodes(seriesId, season.season_number, episodeContainer);
                }
            });
        });

        loader.style.display = 'none'; // Hide loader once data is fetched
    } catch (error) {
        console.error('Error fetching series data:', error);
        loader.style.display = 'none';
    }
}

async function fetchEpisodes(seriesId, seasonNumber, episodeContainer) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${tmdbApiKey}`);
        const seasonData = await response.json();

        // Clear previous episodes (if any)
        episodeContainer.innerHTML = '';

        // Create cards for each episode
        seasonData.episodes.forEach(episode => {
            const episodeCard = document.createElement('div');
            episodeCard.classList.add('episode-card');
            episodeCard.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${episode.still_path || '/placeholder.jpg'}" 
                     alt="${episode.name || `Episode ${episode.episode_number}`}" 
                     class="episode-thumbnail">
                <div class="episode-details">
                    <h4>Episode ${episode.episode_number}:</h4>
                    <h3 id="ep-name">${episode.name || `Episode ${episode.episode_number}`}</h3>
                </div>
            `;
            episodeCard.addEventListener('click', function () {
                loadEpisode(seriesId, seasonNumber, episode.episode_number);
            });

            episodeContainer.appendChild(episodeCard);
        });
    } catch (error) {
        console.error('Error fetching episode data:', error);
    }
}

function loadEpisode(seriesId, seasonNumber, episodeNumber) {
    // Update the iframe src to load the selected episode
    iframe.src = `https://vidbinge.dev/embed/tv/${seriesId}/${seasonNumber}/${episodeNumber}`;
}


async function fetchMovieData(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`);
        const movieData = await response.json();
let description = document.getElementById("Description")
        // Update the video player title
        showNameElement.textContent = `Now Playing: ${movieData.title}`;
        description.textContent = movieData.overview;
        document.title = `${movieData.title} - Ronny Flix`;
        containerheader.textContent = `Movies list`;


        // Fetch related movies
        fetchRelatedMovies(movieId);

    } catch (error) {
        console.error('Error fetching movie data:', error);
        showNameElement.textContent = "Error: Unable to fetch movie details.";
    }
}



async function fetchRelatedMovies(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${tmdbApiKey}`);
        const relatedMoviesData = await response.json();

        if (relatedMoviesData.results && relatedMoviesData.results.length > 0) {
            // Display related movies
            displayRelatedMovies(relatedMoviesData.results);
        } else {
            seasonsContainer.innerHTML += '<div>No related movies found.</div>';
        }

    } catch (error) {
        console.error('Error fetching related movies:', error);
        seasonsContainer.innerHTML += '<div>Error loading related movies.</div>';
    }
}

function displayRelatedMovies(relatedMovies) {
    const relatedMoviesContainer = document.createElement('div');
    relatedMoviesContainer.classList.add('related-movies-container');

    relatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || 'https://via.placeholder.com/150'}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h4>${movie.title}</h4>
            </div>
        `;
        
        // Add click event to the movie card to load that movie
        movieCard.addEventListener('click', () => {
            window.location.href = `watch.html?movie=${movie.id}`;
        });

        relatedMoviesContainer.appendChild(movieCard);
    });

    // Append the related movies container below the video player
    seasonsContainer.appendChild(relatedMoviesContainer);
}








  


// List of domains to block
const blockedDomains = ["ads.com", "adservice.google.com"];

// Save the original XMLHttpRequest open method
const originalOpen = XMLHttpRequest.prototype.open;

// Override the open method
XMLHttpRequest.prototype.open = function (method, url) {
  // Check if the URL matches any of the blocked domains
  if (blockedDomains.some(domain => url.includes(domain))) {
    console.warn(`Blocked ad request: ${url}`);
    return; // Do not proceed with the request
  }

  // Call the original open method for non-blocked requests
  return originalOpen.apply(this, arguments);
};

