document.addEventListener('DOMContentLoaded', function() {
    const loadingSpinner = document.getElementById('loading-spinner');
    const tvShowDetailsContainer = document.getElementById('tv-show-details');
    const relatedImagesContainer = document.getElementById('related-images');
    const trailerModal = document.getElementById('trailer-modal');
    const closeTrailerBtn = document.getElementById('close-trailer');
    const trailerVideo = document.getElementById('trailer-video');
    const error = document.querySelector('.error');
    const iderror = document.querySelector('.movie-id');


    // Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
    var auth = firebase.auth();
    var db = firebase.firestore();

    const urlParams = new URLSearchParams(window.location.search);
    const tvId = urlParams.get('tvId');

    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block';
    }

    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none';
    }

    function fetchTVShowDetails() {
        showLoadingSpinner();
        fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}&append_to_response=credits,videos,images`)
            .then(response => response.json())
            .then(data => {
                displayTVShowDetails(data);
                hideLoadingSpinner();
            })
            .catch(() => {
                hideLoadingSpinner();
                error.style.display="grid"; 
            });
    }

    function displayTVShowDetails(show) {
        // Set background image
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${show.backdrop_path}')`;
    
        const genres = show.genres.map(genre => genre.name).join(', ');
        const cast = show.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
        const trailer = show.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        const tvId = show.id;
    
        // HTML for the TV show details
        const tvShowDetailsHTML = `
            <div class="tv-show-info">
                <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}">
                <div class="details-content">
                    <h2>${show.name}</h2>
                    <p><strong>Overview:</strong> ${show.overview}</p>
                    <div class="info">
                        <p><strong>First Air Date:</strong> ${show.first_air_date}</p>
                        <p><strong>Rating:</strong> ${show.vote_average}</p>
                        <p><strong>Genres:</strong> ${genres}</p>
                        <p><strong>Number of Seasons:</strong> ${show.number_of_seasons}</p>
                        <p><strong>Cast:</strong> ${cast}</p>
                    </div>
                    <a class="btn watch-now" href="#superembed-player">Watch Now</a>
                    ${trailer ? `<button id="view-trailer" class="btn-1 btn">View Trailer</button>` : ''}
                </div>
            </div>
        `;
    
        // Inject the HTML into the container
        tvShowDetailsContainer.innerHTML = tvShowDetailsHTML;
        tvShowDetailsContainer.classList.add('active');
    
        // Define the favorite button after the HTML is injected
        const favoriteButton = document.getElementById('add-favorite');
    
        // Handle trailer button
        if (trailer) {
            document.getElementById('view-trailer').addEventListener('click', () => {
                trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                trailerModal.style.display = 'flex';
            });
        }
    
        // "Watch Now" button functionality
        document.querySelector(".watch-now").addEventListener("click", function () {
            document.getElementById("superembed-player").style.display = "flex";
            updateEndpoint();
            if (endpoint) {
                videoFrame.src = endpoint;
                videoFrame.style.display = 'block';
                videoFramelogo.style.display = 'block';
            }
        });
    
        // Handle favorite button click
        favoriteButton.addEventListener('click', function () {
            auth.onAuthStateChanged(user => {
                if (user) {
                    db.collection('users').doc(user.uid).collection('favorites').doc(tvId.toString())
                        .get()
                        .then(docSnapshot => {
                            if (docSnapshot.exists) {
                                docSnapshot.ref.delete().then(() => {
                                    showConfirmation('Removed from favorites!');
                                    favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favorites';
                                });
                            } else {
                                const movieData = {
                                    seriesID: tvId,
                                    title: show.name,
                                    type: "Series",
                                    posterPath: show.poster_path,
                                    addedAt: firebase.firestore.Timestamp.now(),
                                };
                                db.collection('users').doc(user.uid).collection('favorites').doc(tvId.toString())
                                    .set(movieData)
                                    .then(() => {
                                        showConfirmation('Added to favorites!');
                                        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Remove from Favorites';
                                    });
                            }
                        });
                } else {
                    showLoginRequiredPopup();
                }
            });
        });
    
        // Check if the show is already in favorites
        auth.onAuthStateChanged(user => {
            if (user) {
                checkIfFavorite(user);
            }
        });
    }
    

    function displayRelatedImages(images) {
        let relatedImagesHTML = '<h3>Related Images</h3><div class="carousel">';
        images.slice(0, 10).forEach(image => {
            relatedImagesHTML += `<img src="https://image.tmdb.org/t/p/w300${image.file_path}" alt="Related Image">`;
        });
        relatedImagesHTML += '</div>';
        relatedImagesHTML += `
            <button class="carousel-control left">&lsaquo;</button>
            <button class="carousel-control right">&rsaquo;</button>
        `;
        relatedImagesContainer.innerHTML = relatedImagesHTML;

        const carousel = document.querySelector('.carousel');
        const leftControl = document.querySelector('.carousel-control.left');
        const rightControl = document.querySelector('.carousel-control.right');
        let scrollAmount = 0;

        rightControl.addEventListener('click', () => {
            scrollAmount += 150;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });

        leftControl.addEventListener('click', () => {
            scrollAmount -= 150;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    closeTrailerBtn.addEventListener('click', () => {
        trailerVideo.src = '';
        trailerModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === trailerModal) {
            trailerVideo.src = '';
            trailerModal.style.display = 'none';
        }
    });

    if (tvId) {
        fetchTVShowDetails();
    } else {
        iderror.style.display="block";     }



//======================================= 
//======================================= 
//======================================= 

    const providerSelect = document.getElementById('provider-select');
    const seasonSelect = document.getElementById('season-select');
    const episodeSelect = document.getElementById('episode-select');
    const playButton = document.getElementById('play-button');
    const videoFrame = document.getElementById('video-frame');
    const videoFramelogo = document.querySelector('.video-watermark');
    let endpoint = '';
    let tmdbSeries = {}; // Initialize tmdbSeries

    // Fetch series data and populate the season dropdown
    async function fetchSeriesData(seriesId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}`);
            tmdbSeries = await response.json();
            
            // Populate season select dropdown
            tmdbSeries.seasons.forEach(season => {
                const option = document.createElement('option');
                option.value = season.season_number;
                option.textContent = `Season ${season.season_number}`;
                seasonSelect.appendChild(option);
            });

            // Set default season to 1 and trigger change to load episodes for season 1
            seasonSelect.value = 1;
            seasonSelect.dispatchEvent(new Event('change'));
        } catch (error) {
            console.error('Error fetching series data:', error);
        }
    }

    // Fetch episode count for a selected season and populate episode select dropdown
    async function fetchEpisodes(seriesId, seasonNumber) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}`);
            const seasonData = await response.json();
            
            // Clear current episode options
            episodeSelect.innerHTML = '';
            
            // Populate episode select dropdown based on the episode count
            seasonData.episodes.forEach(episode => {
                const option = document.createElement('option');
                option.value = episode.episode_number;
                option.textContent = `Episode ${episode.episode_number}`;
                episodeSelect.appendChild(option);
            });

            // Set default episode to 1
            episodeSelect.value = 1;
        } catch (error) {
            console.error('Error fetching episode data:', error);
        }
    }

    // Event listener for season selection to fetch and populate episodes
    seasonSelect.addEventListener('change', function () {
        const selectedSeason = seasonSelect.value;
        if (selectedSeason) {
            fetchEpisodes(tmdbSeries.id, selectedSeason);
        }
    });

    function updateEndpoint() {
        const provider = providerSelect.value;
        const seasonNumber = seasonSelect.value;
        const episodeNumber = episodeSelect.value;
        const seriesId = tmdbSeries.id;

        if (provider === 'vidsrc') {
            endpoint = `https://vidsrc.cc/v2/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}?autoPlay=true`;
        }
        else if (provider === 'vidsrc2') {
            endpoint = `https://vidsrc2.to/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'superembed') {
            endpoint = `https://multiembed.mov/?video_id=${seriesId}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;
        }
        else if (provider === 'vidsrcxyz') {
            endpoint = `https://vidsrc.xyz/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'embedsoap') {
            endpoint = `https://www.embedsoap.com/embed/series/?id=${seriesId}&s=${seasonNumber}&e=${episodeNumber}`;
        }
        else if (provider === 'autoembed') {
            endpoint = `https://player.autoembed.cc/embed/series/${seriesId}/${seasonNumber}-${episodeNumber}`;
        }
        else if (provider === 'smashystream') {
            endpoint = `https://player.smashy.stream/series/${seriesId}/${seasonNumber}-${episodeNumber}`;
        }
        else if (provider === 'anime') {
            endpoint = `https://anime.autoembed.cc/embed/${seriesId}-episode-${episodeNumber}`;
        }
        else if (provider === '2animesub') {
            endpoint = `https://2anime.xyz/embed/${seriesId}-episode-${episodeNumber}`;
        }
        else if (provider === '2embed') {
            endpoint = `https://www.2embed.cc/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'nontonGo') {
            endpoint = `https://www.NontonGo.win/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'vidsrcnl') {
            endpoint = `https://player.vidsrc.nl/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'vidsrc.rip') {
            endpoint = `https://vidsrc.rip/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'vidbinge') {
            endpoint = `https://vidbinge.dev/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'moviesapi') {
            endpoint = `https://moviesapi.club/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'moviee') {
            endpoint = `https://moviee.tv/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'multiembed') {
            endpoint = `https://multiembed.mov/?video_id=${seriesId}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;
        }
        else if (provider === 'embedsu') {
            endpoint = `https://embed.su/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
        else if (provider === 'multiembedvip') {
            endpoint = `https://multiembed.mov/directstream.php?video_id=${seriesId}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`;
        }
        else if (provider === 'vidsrcicu') {
            endpoint = `https://vidsrc.icu/embed/series/${seriesId}/season/${seasonNumber}/episode/${episodeNumber}`;
        }
    
    }
    

    playButton.addEventListener('click', function () {
        updateEndpoint();
        if (endpoint) {
            videoFrame.src = endpoint;
            videoFrame.style.display = 'block';
            videoFramelogo.style.display = 'block';
        }
    });

    // Call fetchSeriesData with your series ID
    fetchSeriesData(tvId);
});