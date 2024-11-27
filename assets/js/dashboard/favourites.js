const auth = firebase.auth();
const db = firebase.firestore();
const userInfoContainer = document.getElementById("user-info"); // Where user info will display
const favoritesContainer = document.getElementById("favorite-movies"); // Where favorite movies will display

// Replace this with your actual TMDB API key

// Listen for auth state changes (when the user logs in or out)
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        showUserInfo(user);
        loadFavorites(user.uid);  // Load favorites for the logged-in user
    } else {
        // No user is signed in
        userInfoContainer.innerHTML = "<p>You are not logged in.</p>";
    }
});

// Show user info
function showUserInfo(user) {
    const userName = user.displayName || "User";
    const userEmail = user.email || "No email provided";

    // Render user info in HTML
    userInfoContainer.innerHTML = `
                <div class="content-header">
        <h1>Welcome, <span id="user-name">${userName}</span>!</h1>
                <p>Your Gateway to Favorite Movies & Series!</p>
                </div>
    `;
}

// Fetch and display favorite movies for the logged-in user
async function loadFavorites(userId) {
    try {
        // Display skeleton loader while data is being fetched
        favoritesContainer.innerHTML = `
            <div class="skeleton-container">
                ${Array(5).fill().map(() => `
                    <div class="skeleton-card">
                        <div class="skeleton-image"></div>
                        <div class="skeleton-text">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-meta"></div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `;

        // Get movie IDs from Firestore favorites collection, ordered by addedAt descending
        const favoritesSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("favorites")
            .orderBy("addedAt", "desc")
            .get();

        if (favoritesSnapshot.empty) {
            favoritesContainer.innerHTML = `<p class="not-found">No favorites found.</p>`;

            return;
        }

        // Collect movie data and ensure timestamps are processed correctly
        const moviePromises = favoritesSnapshot.docs.map((doc) => {
            const movieData = doc.data();
            const movieId = movieData.ID || movieData.Movie_ID; // Handle different key names
            const type = movieData.Type.toLowerCase(); // Ensure lowercase for type
            const addedAt = movieData.addedAt ? movieData.addedAt.toDate() : null; // Convert Firestore timestamp

            return fetchMovieDetails(movieId, type).then((details) => ({
                ...details,
                addedAt,
            }));
        });

        const movies = await Promise.all(moviePromises);

        renderMovies(movies); // Render sorted movie data
    } catch (error) {
        console.error("Error loading favorites:", error);
        favoritesContainer.innerHTML = `<p class="not-found">Failed to load favorites.</p>`;
    }
}



// Fetch movie or tv show details from TMDB based on type
// Fetch movie or TV show details from TMDB based on type
async function fetchMovieDetails(movieId, type) {
    const url = type === 'series' 
        ? `https://api.themoviedb.org/3/tv/${movieId}?api_key=${apiKey}`  // For TV shows
        : `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;  // For Movies

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status_code === 34) { // If not found (TMDB error code)
            throw new Error("Item not found");
        }

        const posterPath = data.poster_path 
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Image+Available';
        const releaseDate = data.release_date || data.first_air_date || "Unknown";
        const title = data.title || data.name || "No Title"; // Use 'title' for movies, 'name' for TV shows

        return {
            id: data.id, // Take the ID directly from TMDB
            type,
            title,
            poster_path: posterPath,
            release_date: releaseDate,
            name: data.name || title, // Ensure compatibility for TV shows
        };
    } catch (error) {
        console.error(`Error fetching details for ${movieId}:`, error);
        return {
            id: movieId, // Fallback to the passed movieId
            type,
            title: "Error Loading Data",
            poster_path: 'https://via.placeholder.com/500x750?text=No+Image+Available',
            release_date: "Unknown",
        };
    }
}

// Render movie or TV show cards
function renderMovies(movies) {
    favoritesContainer.innerHTML = movies
        .map((item) => {
            const { id, type, title, poster_path, release_date, name, addedAt } = item;

            // Create redirect URL based on type
            const redirectUrl = type === "series"
                ? `/tv-show-details.html?tvId=${id}`
                : `/details.html?movieId=${id}`;

            // Format the addedAt date (if it exists) to a readable string
            const formattedDate = addedAt
                ? new Date(addedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "Unknown";

            // Render the card
            return `
                <div class="card" onclick="window.location.href='${redirectUrl}'">
                    <img src="${poster_path}" alt="${title || name}" />
                    <h3>${title || name}</h3>
                    <p>Type: ${type === "series" ? "TV Show" : "Movie"}</p>
                    <p>Release Date: ${release_date}</p>
                    <p>Added On: ${formattedDate}</p> <!-- AddedAt timestamp -->
                </div>`;
        })
        .join("");
}

