document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '5a41a4ff0e4bfcc5608165fe4ae559ed';
    const resultsContainer = document.getElementById('results-container');

    // Get the query parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        fetchSearchResults(query);
    }

    // Fetch search results from TMDB API (for both movies and TV shows)
    function fetchSearchResults(query) {
        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                displaySearchResults(data.results);
            })
            .catch(() => {
                alert('Failed to fetch data. Please try again later.');
            });
    }


            // Display search results in HTML and fetch additional details
            function displaySearchResults(results) {
                let resultsHTML = '';
                results.forEach(result => {
                    const title = result.title || result.name;
                    const mediaType = result.media_type;
                    const link = mediaType === 'movie' 
                        ? `details.html?movieId=${result.id}` 
                        : mediaType === 'tv' 
                        ? `tv-show-details.html?tvId=${result.id}` 
                        : '#';

                    // Initial HTML structure for each item
                    resultsHTML += `
                        <div class="search-result-item" id="result-${result.id}">
                            <a href="${link}">
                                <img src="https://image.tmdb.org/t/p/w300${result.poster_path}" alt="${title}">
                                <div>
                                    <h3>${title}</h3>
                                    <p><b> Type: ${mediaType === 'movie' ? 'Movie' : 'TV Show'}</b></p>
                                    <p id="details-${result.id}">Loading details...</p>
                                    <p>${result.overview ? result.overview.substr(0, 200) + '...' : 'No description available.'}</p>
                                </div>
                            </a>
                        </div>
                    `;


// Fetch additional details based on media type
if (mediaType === 'movie') {
    fetch(`https://api.themoviedb.org/3/movie/${result.id}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(movieData => {
            if (movieData.runtime) {
                const hours = Math.floor(movieData.runtime / 60);
                const minutes = movieData.runtime % 60;
                const runtimeFormatted = `${hours} hr ${minutes} min`;
                document.getElementById(`details-${result.id}`).innerHTML = `<b>Runtime: ${runtimeFormatted}</B>`;
            } else {
                document.getElementById(`details-${result.id}`).textContent = 'Runtime not available';
            }
        })
        .catch(() => {
            document.getElementById(`details-${result.id}`).textContent = 'Failed to load movie runtime.';
        });
} else if (mediaType === 'tv') {
    fetch(`https://api.themoviedb.org/3/tv/${result.id}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(tvData => {
            const seasons = tvData.number_of_seasons;
            const episodes = tvData.number_of_episodes;
            document.getElementById(`details-${result.id}`).innerHTML = `<b>Seasons: ${seasons}, Episodes: ${episodes}</b>`;
        })
        .catch(() => {
            document.getElementById(`details-${result.id}`).textContent = 'Failed to load TV show details.';
        });
    }
});




        resultsContainer.innerHTML = resultsHTML;
    }
});