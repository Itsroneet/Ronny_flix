document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.getElementById('hero');
    const loadingSpinner = document.querySelectorAll('.loading-spinner');
    const contentgrid= document.querySelectorAll('.content-grid');
    
    
    let activeHoverInfo = null; // Variable to track the active hover info

    function fetchAndDisplayMovies(url, containerId) {
        showLoadingSpinner(); // Function to show a loading spinner
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
                            <p><b>Release :</b>${movie.release_date}</p>
                        </div>
                        <div class="hover-info">
                            <h3>${movie.title}</h3>
                            <p><b>Release :</b>${movie.release_date}</p>
                            <button class="details-button" data-movie-id="${movie.id}">Watch <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
                        </div>
                    `;
    
                    // Add event listener to the movieItem
                    movieItem.addEventListener('click', () => {
                        
                        // Reset the previous active hover info if there is one
                        if (activeHoverInfo) {
                            activeHoverInfo.style.transform = "translatex(100%)";
                        }
                        
                        // Set the new active hover info
                        const hoverInfo = movieItem.querySelector('.hover-info');
                        hoverInfo.style.transform = "translatex(-100%)";
                        activeHoverInfo = hoverInfo ;
                    });
    
                    container.appendChild(movieItem);
                });
    
    
    
                // Attach event listeners to all "Details" buttons
               
                document.querySelectorAll('.details-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const movieId = event.target.getAttribute('data-movie-id');
                        window.location.href = `details.html?movieId=${movieId}`;
                    });
                });
    
                hideLoadingSpinner(); // Function to hide the loading spinner
            })
            .catch(() => {
                hideLoadingSpinner(); // Function to hide the loading spinner
                        contentgrid.forEach(e=>{
e.innerHTML=` <h2 id="error">Unable to fetch data<span></span></h2>`
                        })
               
            });
    }
    

    

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