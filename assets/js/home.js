document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('hero');
    const loadingSpinner = document.querySelectorAll('.loading-spinner');
    const contentgrid= document.querySelectorAll('.content-grid');
    
    
    let activeHoverInfo = null; // Variable to track the active hover info

     // Initialize Firebase
     firebase.initializeApp(firebaseConfig);
     var auth = firebase.auth();
     var db = firebase.firestore();

    
    
        // Ensure Firebase is initialized here...
    
        // Function to track recently watched movies
        function trackRecentlyWatched(movieId) {
            const user = firebase.auth().currentUser; // Get the current user
            
            if (user) {
                const userId = user.uid; // Get the current user's UID
                db.collection("users").doc(userId).update({
                    recentlyWatched: firebase.firestore.FieldValue.arrayUnion(movieId)
                }).catch(error => {
                    console.error("Error adding movie to recently watched:", error);
                });
            } 
        }
    
        // Move fetchAndDisplayMovies definition here
        function fetchAndDisplayMovies(url, containerId) {
            showLoadingSpinner(); // Show loading spinner
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const movies = data.results;
                    const container = document.getElementById(containerId);
                    container.innerHTML = ''; // Clear previous content
                    movies.forEach(movie => {
                        const movieItem = document.createElement('div');
                        movieItem.classList.add('content-item');
                        movieItem.innerHTML = `
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                            <div class="content-info">
                                <h3>${movie.title}</h3>
                                <p><b>Release :</b> ${movie.release_date}</p>
                            </div>
                            <div class="hover-info">
                                <h3>${movie.title}</h3>
                                <p><b>Release :</b> ${movie.release_date}</p>
                                <button class="details-button" data-media-id="${movie.id}" data-type="movie"">Watch <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                            </div>
                                                                                        <p class="content-type">Movies</p>

                        `;
        
                        // Event listener for movie item click
                        movieItem.addEventListener('click', () => {
                            if (activeHoverInfo) {
                                activeHoverInfo.style.transform = "translatex(100%)";
                            }
                            const hoverInfo = movieItem.querySelector('.hover-info');
                            hoverInfo.style.transform = "translatex(-100%)";
                            activeHoverInfo = hoverInfo;
                        });
        
                        // Event listener for details button
                        movieItem.querySelector('.details-button').addEventListener('click', (event) => {
                            const movieId = event.target.getAttribute('data-movie-id');
                            trackRecentlyWatched(movieId); // Track the movie when clicked
                            window.location.href = `details.html?movieId=${movieId}`;
                        });
        
                        container.appendChild(movieItem);
                    });
        
                    hideLoadingSpinner(); // Hide loading spinner
                })
                .catch(() => {
                    hideLoadingSpinner(); // Hide loading spinner
                    window.location.href = `R/maintenance.html`;
                });
        }
        
// Fetch and display TV shows
function fetchAndDisplayTVShows(url, containerId) {
    showLoadingSpinner(); // Show loading spinner
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const shows = data.results;
            const container = document.getElementById(containerId);
            container.innerHTML = ''; // Clear previous content
            shows.forEach(show => {
                const showItem = createMediaItem(show, 'tv');
                container.appendChild(showItem);
            });
            hideLoadingSpinner(); // Hide loading spinner
        })
        .catch(() => {
            hideLoadingSpinner(); // Hide loading spinner
            window.location.href = `R/maintenance.html`; 
        });
}


    // Function to create media item (movies and TV shows)
    function createMediaItem(media, type) {
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('content-item');
        mediaItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${media.poster_path}" alt="${media.title || media.name}">
            <div class="content-info">
                <h3>${media.title || media.name}</h3>
                <p><b>Release :</b> ${media.release_date || media.first_air_date}</p>
            </div>
            <div class="hover-info">
                <h3>${media.title || media.name}</h3>
                <p><b>Release :</b> ${media.release_date || media.first_air_date}</p>
                <button class="details-button series-details-button" data-media-id="${media.id}" data-type="${type}">Watch <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
            </div>
                                                            <p class="content-type">Series</p>

           `;

        // Add event listener to the media item
        mediaItem.addEventListener('click', () => {
            if (activeHoverInfo) {
                activeHoverInfo.style.transform = "translatex(100%)";
            }
            const hoverInfo = mediaItem.querySelector('.hover-info');
            hoverInfo.style.transform = "translatex(-100%)";
            activeHoverInfo = hoverInfo;
        });

        return mediaItem;
    }

    // Delegate click event for details buttons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('details-button')) {
            const mediaId = event.target.getAttribute('data-media-id');
            trackRecentlyWatched(mediaId); // Track the media when clicked
            const type = event.target.getAttribute('data-type');

            if (type === "movie") {
                window.location.href = `details.html?movieId=${mediaId}`;
            } else {
                window.location.href = `tv-show-details.html?tvId=${mediaId}`;                
            }
        }
    });


    
    function getUserCountry() {
        const user = firebase.auth().currentUser;
        if (user) {
            return db.collection("users").doc(user.uid).get()
                .then(doc => {
                    if (doc.exists) {
                        console.log(doc.data().country)
                        return doc.data().country; // Return country from Firestore
                    } else {
                        console.warn("No country found in Firestore.");
                        return null; // Return null if no country is found
                    }
                });
        } else {
            return Promise.resolve(localStorage.getItem('country')); // Return from localStorage if not logged in
        }
    }
    
    // Fetch and display content based on user's country
    getUserCountry().then(country => {
        const countryCode = country ? country.toUpperCase() : 'US'; // Default to US if no country found
        fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&region=${countryCode}`, 'featured-grid');
        fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&region=${countryCode}`, 'trending-grid');
        fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&region=${countryCode}`, 'new-releases-grid');
        fetchAndDisplayTVShows(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&region=${countryCode}`, 'featured-tv-grid');
        fetchAndDisplayTVShows(`https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&region=${countryCode}`, 'trending-tv-grid');
    }).catch(error => {
        console.error("Error fetching country:", error);
    });
    

    

    function fetchRandomHeroImage() {
        const urls = [
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`,
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
        ];

        const randomUrl = urls[Math.floor(Math.random() * urls.length)];

        fetch(randomUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                const heroImageUrl = `https://image.tmdb.org/t/p/w1280${randomMovie.backdrop_path}`;
                updateHeroImage(heroImageUrl);
            })
            .catch(() => {
                const heroImageUrl = `(../The\ Garfield\ Movie.jpg`;
                updateHeroImage(heroImageUrl);
            });
    }

    function updateHeroImage(imageUrl) {
        const currentImage = document.querySelector('.hero-image.active');
        const newImage = document.createElement('div');
        newImage.className = 'hero-image';
        newImage.style.backgroundImage = `url(${imageUrl})`;
        heroSection.appendChild(newImage);
        
        // Triggering the fade-in effect
        setTimeout(() => {
            newImage.classList.add('active');
            currentImage.classList.remove('active');
            
            // Remove the old image after the transition
            setTimeout(() => {
                heroSection.removeChild(currentImage);
            }, 1000); // Match the transition duration in CSS
        }, 50);
    }

    function showLoadingSpinner() {
        loadingSpinner.forEach(e=>{
            e.style.display="block"
        })
    }

    function hideLoadingSpinner() {
        loadingSpinner.forEach(e=>{
            e.style.display="none"
        })
    }
  






    


    fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`, 'featured-grid');
    fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`, 'trending-grid');
    fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`, 'new-releases-grid');
    
    fetchRandomHeroImage();
    setInterval(fetchRandomHeroImage, 10000); // Change hero image every 10 seconds
});