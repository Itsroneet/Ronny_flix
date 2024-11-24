document.addEventListener('DOMContentLoaded', function() {
    const moviesContainer = document.getElementById('movies-container');
    const paginationContainer = document.getElementById('pagination-container');
    let currentPage = 1;
    let totalPages = 1;

  
    function fetchMovies(page) {
        fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                totalPages = data.total_pages;
                displayMovies(data.results);
                renderPagination(page);
            })
            .catch(() => {
                window.location.href = `R/error.html`;
            });
          
    }
  

    function displayMovies(movies) {
       try {
        let moviesHTML = '';
        movies.forEach(movie => {
            moviesHTML += `
                <div class="movie-item">
                    <a href="details.html?movieId=${movie.id}">
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
                        <p>${movie.title}</p>
                    </a>
                </div>
            `;
        });
        moviesContainer.innerHTML = moviesHTML;
       } catch (error) {
        

       }
    }

    function renderPagination(page) {
        paginationContainer.innerHTML = '';

        const prevButton = document.createElement('button');
        prevButton.innerText = 'Prev';
        prevButton.classList='btn-page';
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchMovies(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);

        const currentPageButton = document.createElement('button');
        currentPageButton.innerText = page;
        currentPageButton.classList='btn-pagenum';
        currentPageButton.disabled = true;
        paginationContainer.appendChild(currentPageButton);

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.classList='btn-page';
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchMovies(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    fetchMovies(currentPage);
});

