// Function to get query parameter from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const tmdbApiKey = '5a41a4ff0e4bfcc5608165fe4ae559ed'; // Replace with your actual API key

// Fetch parameters from the URL
const movieId = getQueryParam('movie'); // Movie ID parameter
const tvId = getQueryParam('tv'); // TV show ID parameter

// Local storage helper functions
function getLocalStorage(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
}

function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

// DOM elements
const iframe = document.getElementById('video-player');
const showNameElement = document.getElementById('show-name');
const containerheader = document.getElementById('containerheader');
const seasonsContainer = document.getElementById('seasons-actual-container');
const loader = document.getElementById('loader');
const iframeLoader = document.getElementById('iframe-loader');

// Show loader initially
loader.style.display = 'block';
iframeLoader.style.display = 'flex';

// Hide loader when iframe loads
iframe.addEventListener('load', () => {
    iframeLoader.style.display = 'none';
});

// Fetch and display TV show details
async function fetchTVShowDetails(tvId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${tmdbApiKey}`);
        const tvShowDetails = await response.json();
        let description = document.getElementById("Description");

        showNameElement.textContent = `Now Watching: ${tvShowDetails.name}`;
        document.title = `${tvShowDetails.name} - Ronny Flix`;
        description.textContent = tvShowDetails.overview;
        containerheader.textContent = `Seasons list`;
    } catch (error) {
        console.error('Error fetching TV show details:', error);
        showNameElement.textContent = "Error: Unable to fetch TV show details.";
    }
}

// Fetch series data and build season list
async function fetchSeriesData(seriesId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${tmdbApiKey}`);
        const tmdbSeries = await response.json();

        seasonsContainer.innerHTML = ''; // Clear seasons container

        tmdbSeries.seasons = tmdbSeries.seasons.filter(season => season.season_number !== 0);

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

            toggleButton.addEventListener('click', function () {
                const allEpisodeContainers = document.querySelectorAll('.episode-container');
                allEpisodeContainers.forEach(container => {
                    if (container !== episodeContainer) container.style.display = 'none';
                });

                const isExpanded = episodeContainer.style.display === 'block';
                episodeContainer.style.display = isExpanded ? 'none' : 'block';
                toggleButton.textContent = isExpanded ? '+' : '-';

                if (!isExpanded) {
                    fetchEpisodes(seriesId, season.season_number, episodeContainer);
                }
            });
        });

        loader.style.display = 'none';
    } catch (error) {
        console.error('Error fetching series data:', error);
        loader.style.display = 'none';
    }
}

// Fetch and display episodes for a season
async function fetchEpisodes(seriesId, seasonNumber, episodeContainer) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${tmdbApiKey}`);
        const seasonData = await response.json();

        episodeContainer.innerHTML = ''; // Clear previous episodes

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
                setLocalStorage(`season_${seriesId}`, seasonNumber);
                setLocalStorage(`episode_${seriesId}`, episode.episode_number);
                loadEpisode(seriesId, seasonNumber, episode.episode_number);
            });

            episodeContainer.appendChild(episodeCard);
        });
    } catch (error) {
        console.error('Error fetching episode data:', error);
    }
}

// Load selected episode
function loadEpisode(seriesId, seasonNumber, episodeNumber) {
    const selectedServer = document.getElementById('tv-server-selector').value;
    iframe.src = `${selectedServer}${seriesId}/${seasonNumber}/${episodeNumber}`;
}

// Fetch and display movie details
async function fetchMovieData(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`);
        const movieData = await response.json();
        let description = document.getElementById("Description");

        showNameElement.textContent = `Now Playing: ${movieData.title}`;
        description.textContent = movieData.overview;
        document.title = `${movieData.title} - Ronny Flix`;
        containerheader.textContent = `Movies list`;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        showNameElement.textContent = "Error: Unable to fetch movie details.";
    }
}

// Handle server switching
document.getElementById('tv-server-selector').addEventListener('change', () => {
    const seriesId = getQueryParam('tv');
    const seasonNumber = getLocalStorage(`season_${seriesId}`, 1);
    const episodeNumber = getLocalStorage(`episode_${seriesId}`, 1);
    loadEpisode(seriesId, seasonNumber, episodeNumber);
});

document.getElementById('movie-server-selector').addEventListener('change', () => {
    const movieId = getQueryParam('movie');
    const selectedServer = document.getElementById('movie-server-selector').value;
    iframe.src = `${selectedServer}${movieId}`;
});

// Initialization: Check for movie or TV show
if (movieId) {
    const selectedServer = document.getElementById('movie-server-selector').value;
    iframe.src = `${selectedServer}${movieId}`;
    document.getElementById('movie-server').style.display = "flex";
    document.getElementById('sever-selecter-loader-main').style.display = "none";

    fetchMovieData(movieId); // Fetch and display movie data

    // Fetch and display related movies
    fetchRelatedMovies(movieId);

} else if (tvId) {
    const savedSeason = getLocalStorage(`season_${tvId}`, 1);
    const savedEpisode = getLocalStorage(`episode_${tvId}`, 1);
    iframe.src = `https://vidbinge.dev/embed/tv/${tvId}/${savedSeason}/${savedEpisode}`;
    document.getElementById('tv-server').style.display = "flex";
    document.getElementById('sever-selecter-loader-main').style.display = "none";

    fetchTVShowDetails(tvId); // Fetch TV show details
    fetchSeriesData(tvId);    // Fetch and display seasons and episodes

} else {
    console.error("Error: Missing required parameters in the URL.");
    showNameElement.textContent = "Error: Missing required parameters in the URL.";
    loader.style.display = 'none';
}

async function fetchRelatedMovies(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${tmdbApiKey}`);
        const relatedMoviesData = await response.json();
        
        if (relatedMoviesData.results && relatedMoviesData.results.length > 0) {
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
    // Create a container for related movies
    const relatedMoviesContainer = document.createElement('div');
    relatedMoviesContainer.classList.add('related-movies-container');

    // Loop through each movie and create a card
    relatedMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || '/placeholder.jpg'}" 
                 alt="${movie.title}" 
                 class="movie-poster">
            <h4>${movie.title}</h4>
        `;
        relatedMoviesContainer.appendChild(movieCard);
    });

    // Append related movies to the seasons container or any target container
    seasonsContainer.innerHTML = ''; // Clear existing content if needed
    seasonsContainer.appendChild(relatedMoviesContainer);
}


// ----------remove sandbox-------------------------



const movieServerSelector = document.getElementById('movie-server-selector');
const tvServerSelector = document.getElementById('tv-server-selector');

movieServerSelector.addEventListener('change', Removesandbox );


function Removesandbox() {
    const selectedOption = movieServerSelector.options[movieServerSelector.selectedIndex];
    const isAds = selectedOption.classList.contains('ads');
    const selectedServer = document.getElementById('movie-server-selector').value;

    if (isAds) {
        // Remove the sandbox attribute if ads server is selected
        iframe.removeAttribute('sandbox'); // Ensure sandbox is removed
        iframe.src = ''; // Clear the iframe src to force reload
        iframe.src = `${selectedServer}${movieId}`;
        console.log("Sandbox removed, and iframe reloaded with URL:", selectedServer);       
    } else {
       
    }
}


// -----------------------------------------------
// -----------------------------------------------
// -----------------------------------------------
  


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