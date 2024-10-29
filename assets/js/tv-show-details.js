document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '5a41a4ff0e4bfcc5608165fe4ae559ed';
    const loadingSpinner = document.getElementById('loading-spinner');
    const tvShowDetailsContainer = document.getElementById('tv-show-details');
    const relatedImagesContainer = document.getElementById('related-images');
    const trailerModal = document.getElementById('trailer-modal');
    const closeTrailerBtn = document.getElementById('close-trailer');
    const trailerVideo = document.getElementById('trailer-video');
    const error = document.querySelector('.error');
    const iderror = document.querySelector('.movie-id');


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
        document.body.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${show.backdrop_path}')`;

        const genres = show.genres.map(genre => genre.name).join(', ');
        const cast = show.credits.cast.slice(0, 5).map(actor => actor.name).join(', ');
        const trailer = show.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');

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
                    ${trailer ? `<button id="view-trailer" class="btn-1">View Trailer</button>` : ''}
                </div>
            </div>
        `;
        tvShowDetailsContainer.innerHTML = tvShowDetailsHTML;
        tvShowDetailsContainer.classList.add('active');

        if (trailer) {
            document.getElementById('view-trailer').addEventListener('click', () => {
                trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                trailerModal.style.display = 'flex';
            });
        }

        displayRelatedImages(show.images.backdrops);
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
});
