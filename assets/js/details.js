document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '5a41a4ff0e4bfcc5608165fe4ae559ed';
    const movieDetailsContainer = document.getElementById('movie-details');
    const relatedImagesContainer = document.getElementById('related-images');
    const trailerModal = document.getElementById('trailer-modal');
    const closeTrailerBtn = document.getElementById('close-trailer');
    const trailerVideo = document.getElementById('trailer-video');
    const iderror = document.querySelector('.movie-id');
    let loader = document.querySelector(".loading-spinner");

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');

    const firebaseConfig = {
        apiKey: "AIzaSyApELmEIGS-7qjseh3k6_ptVuyRGNTHCbc",
        authDomain: "rmdb-2081.firebaseapp.com",
        projectId: "rmdb-2081",
        storageBucket: "rmdb-2081.appspot.com",
        messagingSenderId: "469213743669",
        appId: "1:469213743669:web:cc977291cb822423717f7c",
        measurementId: "G-CH9EKJX64R"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Firebase authentication and Firestore references
    const auth = firebase.auth();
    const db = firebase.firestore();

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
                    <p><strong>Genres:</strong> ${genres}</p>
                    <p><strong>Runtime:</strong> ${movie.runtime ? movie.runtime + ' minutes' : 'N/A'}</p>
                    <p><strong>Cast:</strong> ${cast}</p>
                </div>
                <a class="btn watch-now"  href="#superembed-player">Watch Now</a>
                ${trailer ? `<button id="view-trailer" class="btn btn-1">View Trailer</button>` : '<p>No trailer available</p>'}
                <button id="add-favorite" class="btn btn-favorite"><i class="fa fa-heart"></i> Add to Favorites</button>
            </div>
        `;
        document.title = movie.title + " - RMDB";
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
            if (provider === 'superembed') {
                endpoint = `https://multiembed.mov/?video_id=${movie.id}&tmdb=1`;
            } else if (provider === 'autoembed') {
                endpoint = `https://player.autoembed.cc/embed/movie/${movie.id}`;
            } else if (provider === 'embedsoap') {
                endpoint = `https://www.embedsoap.com/embed/movie/${movie.id}`;
            } else if (provider === 'smashystream') {
                endpoint = `https://player.smashy.stream/movie/${movie.id}`;
            } else if (provider === 'trailer') {
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



        
        document.querySelector(".watch-now").addEventListener("click",function(){
            document.getElementById("superembed-player").style.display = "flex";
        })






        if (trailer) {
            document.getElementById('view-trailer').addEventListener('click', () => {
                trailerVideo.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
                trailerModal.style.display = 'flex';
            });
        }

        const favoriteButton = document.getElementById('add-favorite');

        // Show confirmation message for favorite actions
        function showConfirmation(message) {
            const confirmationMessage = document.createElement('div');
            confirmationMessage.className = 'confirmation-message';
            confirmationMessage.innerText = message;
            document.body.appendChild(confirmationMessage);
            setTimeout(() => {
                confirmationMessage.remove();
            }, 3000);
        }

        // Check if movie is already in favorites
        function checkIfFavorite(user) {
            db.collection('users').doc(user.uid).collection('favorites').doc(movie.id.toString())
                .get()
                .then(docSnapshot => {
                    if (docSnapshot.exists) {
                        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Remove from Favorites';
                    } else {
                        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favorites';
                    }
                });
        }

        // Custom login required popup
        function showLoginRequiredPopup() {
            // Log to check if function is called
            console.log("Login required popup triggered.");

            // Check if popup already exists to prevent duplicates
            if (!document.querySelector('.login-popup')) {
                const popup = document.createElement('div');
                popup.className = 'login-popup';

                popup.innerHTML = `
            <div class="login-popup-content">
                <span id="close-popup" class="close-popup">&times;</span>
                <div class="popup-header">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Login Required</h3>
                </div>
                <p>To add this movie to your favorites, please log in to your account.</p>
                <button id="login-now" class="btn login-btn">Login Now</button>
                <button id="close-popup-btn" class="btn secondary-btn">Cancel</button>
            </div>
        `;

                // Append to body and add active class after a short delay to trigger transitions
                document.body.appendChild(popup);
                setTimeout(() => popup.classList.add('active'), 10);  // Slight delay to ensure transition

                // Event listeners for popup buttons
                document.getElementById('login-now').onclick = () => {
                    window.location.href = 'auth/login.html';
                };

                document.getElementById('close-popup').onclick = closePopup;
                document.getElementById('close-popup-btn').onclick = closePopup;

                function closePopup() {
                    popup.classList.remove('active');
                    setTimeout(() => popup.remove(), 300); // Wait for the transition to complete before removing
                }
            }


        }

        // Handle favorite button click
        // Handle favorite button click
        favoriteButton.addEventListener('click', function () {
            auth.onAuthStateChanged(user => {
                if (user) {
                    db.collection('users').doc(user.uid).collection('favorites').doc(movie.id.toString())
                        .get()
                        .then(docSnapshot => {
                            if (docSnapshot.exists) {
                                // Remove from favorites if it already exists
                                docSnapshot.ref.delete().then(() => {
                                    showConfirmation('Removed from favorites!');
                                    favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Add to Favorites';
                                });
                            } else {
                                // Add to favorites if it does not exist
                                const movieData = {
                                    movieId: movie.id,
                                    title: movie.title,
                                    posterPath: movie.poster_path,
                                    addedAt: firebase.firestore.Timestamp.now(),
                                };
                                db.collection('users').doc(user.uid).collection('favorites').doc(movie.id.toString())
                                    .set(movieData)
                                    .then(() => {
                                        showConfirmation('Added to favorites!');
                                        favoriteButton.innerHTML = '<i class="fa fa-heart"></i> Remove from Favorites';
                                    });
                            }
                        });
                } else {
                    showLoginRequiredPopup(); // Show popup if not logged in
                }
            });
        });




        // Check if user is logged in and if the movie is already in favorites
        auth.onAuthStateChanged(user => {
            if (user) {
                checkIfFavorite(user);
            }
        });

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
});



