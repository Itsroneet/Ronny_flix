document.addEventListener('DOMContentLoaded', function() {
    const featuredCarousel = document.getElementById('featured-carousel');
    const trendingShowsContainer = document.getElementById('trending-tv-shows-list');
    const upcomingShowsContainer = document.getElementById('upcoming-tv-shows-list');
    const youMayLikeContainer = document.getElementById('you-may-like-list');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    let currentPage = 1;
    let totalPages = 1;

    // Fetch random movie posters for the background
    function fetchRandomBackgroundImages() {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${Math.floor(Math.random() * 10) + 1}`)
            .then(response => response.json())
            .then(data => {
                const posters = data.results.map(movie => `https://image.tmdb.org/t/p/original${movie.backdrop_path}`);
                const backgroundImages = `
                    url('${posters[0]}'),
                    url('${posters[1]}'),
                    url('${posters[2]}'),
                    url('${posters[3]}'),
                    url('${posters[4]}')
                `;
                document.querySelector('.background-image').style.backgroundImage = backgroundImages;
            })
            .catch(() => {
                console.error('Failed to fetch background images.');
            });
    }

    function fetchTVShows() {
        fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayFeaturedTVShows(data.results);
                displayTrendingTVShows(data.results);
                displayUpcomingTVShows(data.results);
                fetchYouMayLikeTVShows();
            })
            .catch(() => {
                alert('Failed to fetch data. Please try again later.');
            });
    }

    function displayFeaturedTVShows(shows) {
        let featuredHTML = '';
        shows.forEach(show => {
            featuredHTML += `
                <div class="carousel-item">
                    <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}">
                </div>
            `;
        });
        featuredCarousel.querySelector('.carousel-wrapper').innerHTML = featuredHTML;

        const items = document.querySelectorAll('.carousel-item');

        let index = 0;

        function showSlide() {
            items.forEach((item, i) => {
                item.style.transform = `translateX(${-index * 100}%)`;
                item.style.transition = 'transform 0.5s ease';
            });
        }

        document.querySelector('.carousel-control.left').addEventListener('click', () => {
            index = (index > 0) ? index - 1 : items.length - 1;
            showSlide();
        });

        document.querySelector('.carousel-control.right').addEventListener('click', () => {
            index = (index < items.length - 1) ? index + 1 : 0;
            showSlide();
        });

        showSlide();
    }

    function displayTrendingTVShows(shows) {
        let trendingTVShowsHTML = '';
        shows.forEach(show => {
            trendingTVShowsHTML += `
                <div class="tv-show-item">
                    <a href="tv-show-details.html?tvId=${show.id}">
                        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}">
                        <p>${show.name}</p>
                    </a>
                </div>
            `;
        });
        trendingShowsContainer.innerHTML = trendingTVShowsHTML;
    }

    function displayUpcomingTVShows(shows) {
        let upcomingTVShowsHTML = '';
        shows.forEach(show => {
            upcomingTVShowsHTML += `
                <div class="tv-show-item">
                    <a href="tv-show-details.html?tvId=${show.id}">
                        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}">
                        <p>${show.name}</p>
                    </a>
                </div>
            `;
        });
        upcomingShowsContainer.innerHTML = upcomingTVShowsHTML;
    }

    function fetchYouMayLikeTVShows() {
        fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                totalPages = data.total_pages;
                displayYouMayLikeTVShows(data.results);
                updatePageNumbers();
            })
            .catch(() => {
                alert('Failed to fetch data. Please try again later.');
            });
    }

    function displayYouMayLikeTVShows(shows) {
        let youMayLikeHTML = '';
        shows.forEach(show => {
            youMayLikeHTML += `
                <div class="tv-show-item">
                    <a href="tv-show-details.html?tvId=${show.id}">
                        <img src="https://image.tmdb.org/t/p/w300${show.poster_path}" alt="${show.name}">
                        <p>${show.name}</p>
                    </a>
                </div>
            `;
        });
        youMayLikeContainer.innerHTML = youMayLikeHTML;
    }

    function updatePageNumbers() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchYouMayLikeTVShows();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchYouMayLikeTVShows();
        }
    });

    fetchTVShows();
    fetchRandomBackgroundImages();
});


