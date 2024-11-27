const movieDetailsContainer = document.getElementById('movie-details');
const relatedImagesContainer = document.getElementById('related-images');
const trailerModal = document.getElementById('trailer-modal');
const closeTrailerBtn = document.getElementById('close-trailer');
const trailerVideo = document.getElementById('trailer-video');
const iderror = document.querySelector('.movie-id');
let loader = document.querySelector(".loading-spinner");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');

function showLoadingSpinner() {
    loader.style.display = "block";
}

function hideLoadingSpinner() {
    loader.style.display = "none";
}



// Fetch and display movie details
function fetchMovieDetails() {
    showLoadingSpinner();
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos,images`)
        .then(response => response.json())
        .then(data => {
            displayMovieDetails(data);
            hideLoadingSpinner();

        })
        .catch(() => {
            hideLoadingSpinner();
            iderror.style.display = "block";
            document.getElementById("superembed-player").style.display = "none";
        });
}


function displayMovieDetails(movie) {
    document.body.style.backgroundImage = movie.backdrop_path
        ? `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`
        : `url('default-background.jpg')`;

    const genres = movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A';
    const cast = movie.credits.cast ? movie.credits.cast.slice(0, 5).map(actor => actor.name).join(', ') : 'N/A';
    const trailer = movie.videos.results ? movie.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube') : null;







    const movieDetailsHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <div class="movie-info">
        <h2>${movie.title}</h2>
        <p><strong>Overview:</strong> ${movie.overview || 'No overview available'}</p>
        <div class="info">
            <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
            <p><strong>Rating:</strong> ${movie.vote_average || 'N/A'}</p>
            <p><strong>Genres:</strong> ${movie.genres && movie.genres.length > 0 ? movie.genres.map(genre => genre.name).join(', ') : 'N/A'}</p>
            <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + ' minutes' : 'N/A'}</p>
            <p><strong>Cast:</strong> ${movie.cast && movie.cast.length > 0 ? movie.cast.slice(0, 5).map(actor => actor.name).join(', ') : 'No cast available'}</p>
        </div>
        <a class="btn watch-now" href="#superembed-player" onclick="handleWatchNow('${movie.id}', '${movie.title.replace(/'/g, "\\'")}')"
>Watch Now</a>
        ${trailer ? `<button id="view-trailer" class="btn btn-1">View Trailer</button>` : '<p>No trailer available</p>'}
        
        <!-- Add to Favorites Button -->
<button class="btn favorite-btn" data-movie-id="${movie.id}" onclick="handleAddToFavorites('${movie.id}', '${movie.title}')">
    <i class="fa fa-heart"></i> Add to Favorites
</button>

    </div>
`;

    document.title = movie.title + " - Ronny Verse";
    movieDetailsContainer.innerHTML = movieDetailsHTML;
    movieDetailsContainer.classList.add('active');


    const providerSelect = document.getElementById('provider-select');
    const playButton = document.getElementById('play-button');
    const videoFrame = document.getElementById('video-frame');
    const videoFramelogo = document.querySelector('.video-watermark');
    let endpoint = '';

    // Function to set endpoint based on selected provider
    function updateEndpoint() {
        const provider = providerSelect.value;


        if (provider === 'vidsrc') {
            endpoint = `https://vidsrc.cc/v2/embed/movie/${movie.id}?autoPlay=true`;
        }
        else if (provider === 'vidsrc2') {
            endpoint = `https://vidsrc2.to/embed/movie/${movie.id}`;
        }
        else if (provider === 'superembed') {
            endpoint = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;
        }
        else if (provider === 'vidsrcxyz') {
            endpoint = `https://vidsrc.xyz/embed/movie/${movie.id}`;
        }
        else if (provider === 'embedsoap') {
            endpoint = `https://www.embedsoap.com/embed/movie/?id=${movie.id}`;
        }
        else if (provider === 'autoembed') {
            endpoint = `https://player.autoembed.cc/embed/movie/${movie.id}`;
        }
        else if (provider === 'smashystream') {
            endpoint = `https://player.smashy.stream/movie/${movie.id}`;
        }

        else if (provider === 'anime') {
            endpoint = `https://anime.autoembed.cc/embed/${movie.id}-episode-1`;
        }
        else if (provider === '2animesub') {
            endpoint = `https://2anime.xyz/embed/${movie.id}-episode-1`;
        }
        else if (provider === '2embed') {
            endpoint = `https://www.2embed.cc/embed/${movie.id}`;
        }

        else if (provider === 'nontonGo') {
            endpoint = `https://www.NontonGo.win/embed/movie/${movie.id}`;
        }
        else if (provider === 'vidsrcnl') {
            endpoint = `https://player.vidsrc.nl/embed/movie/${movie.id}`;
        }

        else if (provider === 'vidsrc.rip') {
            endpoint = `https://vidsrc.rip/embed/movie/${movie.id}`;
        }

        else if (provider === 'vidbinge') {
            endpoint = `https://vidbinge.dev/embed/movie/${movie.id}`;
        }

        else if (provider === 'moviesapi') {
            endpoint = `https://moviesapi.club/movie/${movie.id}`;
        }

        else if (provider === 'moviee') {
            endpoint = `https://moviee.tv/embed/movie/${movie.id}`;
        }

        else if (provider === 'multiembed') {
            endpoint = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;
        }

        else if (provider === 'embedsu') {
            endpoint = `https://embed.su/embed/movie/${movie.id}`;
        }

        else if (provider === 'multiembedvip') {
            endpoint = `https://multiembed.mov/directstream.php?video_id=${movie.id}&tmdb=1`;
        }

        else if (provider === 'vidsrcicu') {
            endpoint = `https://vidsrc.icu/embed/movie/${movie.id}`;
        }
        else if (provider === 'trailer') {
            endpoint = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }
    }

    // Triggered when "Play" button is clicked
    playButton.addEventListener('click', function () {
        updateEndpoint();
        if (endpoint) {
            videoFrame.src = endpoint;
            videoFrame.style.display = 'block';
            videoFramelogo.style.display = 'block';
        }
    });

    // // Clear video frame source when server is changed
    // providerSelect.addEventListener('change', function () {
    //     videoFrame.style.display = 'none';
    //     videoFramelogo.style.display = 'none';
    //     videoFrame.src = '';
    // });



    document.querySelector(".watch-now").addEventListener("click", function () {
        handleWatchNow(movieId);
        updateEndpoint();
        if (endpoint) {
            videoFrame.src = endpoint;
            videoFrame.style.display = 'block';
            videoFramelogo.style.display = 'block';
        }
    });








    if (trailer) {
        document.getElementById('view-trailer').addEventListener('click', () => {
            trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            trailerModal.style.display = 'flex';
        });
    }



    // Display related images
    if (movie.images.backdrops.length > 0) {
        displayRelatedImages(movie.images.backdrops);
    } else {
        relatedImagesContainer.innerHTML = '<p>No related images available</p>';
    }
}


function displayRelatedImages(images) {
    let currentIndex = 0;
    const totalImages = Math.min(images.length, 10);

    // Render small carousel
    let relatedImagesHTML = '<h3>Related Images</h3><div class="small-carousel-wrapper">';
    relatedImagesHTML += `
            <button class="carousel-control left small-carousel-control">&lsaquo;</button>
            <div class="small-carousel">
        `;

    images.slice(0, totalImages).forEach((image, index) => {
        relatedImagesHTML += `<img class="small-carousel-image" src="https://image.tmdb.org/t/p/w300${image.file_path}" alt="Related Image" data-index="${index}">`;
    });

    relatedImagesHTML += `
            </div>
            <button class="carousel-control right small-carousel-control">&rsaquo;</button>
        </div>`;

    relatedImagesContainer.innerHTML = relatedImagesHTML;

    // Render modal for big carousel
    const modalHTML = `
            <div id="imageModal" class="modal">
                <span class="close">&times;</span>
                <div class="modal-content-container">
                    <div class="image-wrapper">
                        <img id="modalImage" class="modal-content">
                    </div>
                    <div class="counter"><span id="currentImageIndex">1</span> / ${totalImages}</div>
                </div>
                <button id="leftControl" class="carousel-control left">&lsaquo;</button>
                <button id="rightControl" class="carousel-control right">&rsaquo;</button>
            </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");
    const leftControl = document.getElementById("leftControl");
    const rightControl = document.getElementById("rightControl");
    const currentImageIndexElem = document.getElementById('currentImageIndex');
    const smallCarousel = document.querySelector('.small-carousel');
    const smallLeftControl = document.querySelector('.small-carousel-control.left');
    const smallRightControl = document.querySelector('.small-carousel-control.right');
    const smallCarouselImages = document.querySelectorAll('.small-carousel-image');

    let scrollPosition = 0;

    // Small carousel scroll buttons
    smallRightControl.addEventListener('click', () => {
        scrollPosition += 150;
        smallCarousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    });

    smallLeftControl.addEventListener('click', () => {
        scrollPosition -= 150;
        smallCarousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    });

    // Show big carousel (modal) when clicking on small carousel image
    smallCarouselImages.forEach((imageElement) => {
        imageElement.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            showBigCarousel(parseInt(index, 10));
        });
    });

    // Function to show big carousel
    function showBigCarousel(index) {
        currentIndex = index;
        modal.style.display = "grid";
        updateBigCarouselImage();
        document.querySelector(".nav").style.display = "none"; // Hide nav bar
        disableScroll();
    }

    // Function to update the big carousel image
    function updateBigCarouselImage() {
        modalImage.src = `https://image.tmdb.org/t/p/original${images[currentIndex].file_path}`;
        currentImageIndexElem.textContent = currentIndex + 1;
    }

    // Close the modal
    closeModal.addEventListener('click', () => {
        modal.style.display = "none";
        document.querySelector(".nav").style.display = "flex"; // Show nav bar
        enableScroll();
    });

    // Left control (Previous image)
    leftControl.addEventListener('click', () => {
        if (currentIndex === 0) {
            currentIndex = totalImages - 1;
        } else {
            currentIndex -= 1;
        }
        updateBigCarouselImage();
    });

    // Right control (Next image)
    rightControl.addEventListener('click', () => {
        if (currentIndex === totalImages - 1) {
            currentIndex = 0;
        } else {
            currentIndex += 1;
        }
        updateBigCarouselImage();
    });

    // Disable page scroll when modal is open
    function disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    // Enable page scroll when modal is closed
    function enableScroll() {
        document.body.style.overflow = '';
    }
}



closeTrailerBtn.onclick = function () {
    trailerModal.style.display = 'none';
    trailerVideo.src = '';
};





fetchMovieDetails();


// ---------------------------------------------------
// ------------- Firebase stuffs ------------------------------
// ---------------------------------------------------


// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ----------- recentlyWatched----------

function handleWatchNow(movieId, movieTitle) {
    // Validate movieId and movieTitle
    if (!movieId || !movieTitle) {
    }

    // Check user's authentication state
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            // Display the player for unauthenticated users
            document.getElementById("superembed-player").style.display = "flex";
            console.log("User not logged in");
            return;
        }

        const userId = user.uid;
        const userRef = db.collection("users").doc(userId);
        const movieRef = userRef.collection("recentlyWatched").doc(movieTitle);

        try {
            // Add the movie to Recently Watched
            const newMovie = {
                id: movieId,
                title: movieTitle, // Ensure movieTitle is passed here
                type:`Movie`,
                watchedAt: new Date().toISOString(),
            };

            await movieRef.set(newMovie); // Use .set() to overwrite or create the document
            console.log("Movie added to Recently Watched:", newMovie);

            // Display the player
            document.getElementById("superembed-player").style.display = "flex";
        } catch (error) {
            console.error("Error handling Recently Watched:", error);
        }
    });
}






// ----------- Add to fav ----------

// Ensure that when the page loads, the favorite button is correctly updated
window.onload = () => {
    const movieId = new URLSearchParams(window.location.search).get("movieId");
    if (movieId) {
        // Get the current user (logged-in user)
        auth.onAuthStateChanged(user => {
            if (user) {
                checkIfFavorite(user, movieId); // Check if movie is in the user's favorites
            }
        });
    }
};


// Function to show the login popup
function showLoginPopup() {
    // Avoid duplicate popups
    if (document.querySelector(".login-popup-container")) return;

    // Create popup container
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("login-popup-container");

    // Add the popup content
    popupContainer.innerHTML = `
        <div class="login-popup">
            <div class="login-popup-header">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Login Required</h3>
            </div>
            <p>To add this movie to your favorites, please log in to your account.</p>
            <div class="login-popup-actions">
                <button id="login-now" class="btn primary-btn">Login Now</button>
                <button id="close-popup" class="btn secondary-btn">Cancel</button>
            </div>
        </div>
    `;

    // Append popup to body
    document.body.appendChild(popupContainer);

    // Smooth fade-in animation
    setTimeout(() => {
        popupContainer.style.opacity = "1";
        popupContainer.style.transform = "scale(1)";
    }, 100);

    // Add event listeners for buttons
    document.getElementById("close-popup").onclick = () => closeLoginPopup(popupContainer);
    document.getElementById("login-now").onclick = () => {
        window.location.href = `/auth/login.html`;
    };
}

// Function to close the popup
function closeLoginPopup(popupContainer) {
    popupContainer.style.opacity = "0";
    popupContainer.style.transform = "scale(0.9)";
    setTimeout(() => {
        popupContainer.remove();
    }, 300); // Match transition duration
}




//sweetalert
const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

// Function to handle adding/removing from favorites
function handleAddToFavorites(movieId, movieTitle) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            // Show a login popup if the user is not logged in
            showLoginPopup();
            return;
        }

        // Reference to the user's document in Firestore
        const userRef = db.collection("users").doc(user.uid);
        const movieRef = userRef.collection("favorites").doc(movieId.toString());

        // Check if the movie already exists in the user's favorites
        movieRef.get()
            .then(docSnapshot => {
                if (docSnapshot.exists) {
                    // Movie exists in favorites, so remove it
                    movieRef.delete()
                        .then(() => {
                            // Show a success notification
                            Toast.fire({
                                icon: "success",
                                title: "Removed from Favorites"
                              });
                            // Update the UI for the favorite button
                            updateFavoriteButton(movieId, false);
                        })
                        .catch(error => {
                            console.error("Error removing from favorites:", error);
                        });
                } else {
                    // Movie does not exist in favorites, so add it
                    const favoriteData = {
                        title: movieTitle,
                        ID: movieId,
                        Type: `Movie`,
                        addedAt: new Date(), // Timestamp of when the movie was added
                    };

                    movieRef.set(favoriteData)
                        .then(() => {
                            // Show a success notification
                            Toast.fire({
                                icon: "success",
                                title: "Added to Favorites"
                              });
                            // Update the UI for the favorite button
                            updateFavoriteButton(movieId, true);
                        })
                        .catch(error => {
                            console.error("Error adding to favorites:", error);
                        });
                }
            })
            .catch(error => {
                console.error("Error checking favorite status:", error);
            });
    });
}


// Function to update the favorite button state
function updateFavoriteButton(movieId, isFavorite) {
    const favoriteButton = document.querySelector(`[data-movie-id="${movieId}"]`);
    if (!favoriteButton) return;

    if (isFavorite) {
        favoriteButton.classList.add('favorited');
        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Remove from Favorites';
    } else {
        favoriteButton.classList.remove('favorited');
        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favorites';
    }
}

function checkIfFavorite(user, movieId) {
    const userRef = db.collection("users").doc(user.uid);
    const movieRef = userRef.collection("favorites").doc(movieId.toString());

    movieRef.get()
        .then(docSnapshot => {
            if (docSnapshot.exists) {
                updateFavoriteButton(movieId, true);
            } else {
                updateFavoriteButton(movieId, false);
            }
        })
        .catch(error => {
            console.error("Error checking favorite status:", error);
        });
}
