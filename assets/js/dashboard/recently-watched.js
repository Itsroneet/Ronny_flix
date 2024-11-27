const auth = firebase.auth();
const db = firebase.firestore();
const recentlyWatchedContainer = document.getElementById("recently-watched-list");

// Firebase Authentication listener
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userId = user.uid;
        
        try {
            // Fetch the user data from Firestore
            const userDoc = await db.collection("users").doc(userId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                document.getElementById("user-info").innerHTML = `  <div class="content-header">
        <h1>Welcome, <span id="user-name">${userData.name}</span>!</h1>
                <p>Catch Up on What You’ve Seen</p>
                </div>`;
                fetchRecentlyWatchedDetails(userId);
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error fetching Firestore data:", error);
        }
    } else {
        console.log("No user is signed in.");
    }
});

// Fetch and display recently watched movies/series
async function fetchRecentlyWatchedDetails(userId) {
    const userRef = db.collection("users").doc(userId);
    const recentlyWatchedList = document.getElementById("recently-watched-list");

    try {
        // Display skeleton loader before data is fetched
        recentlyWatchedList.innerHTML = `
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

        // Fetch recently watched items ordered by watchedAt descending
        const snapshot = await userRef
            .collection("recentlyWatched")
            .orderBy("watchedAt", "desc")
            .get();

        if (snapshot.empty) {
            recentlyWatchedList.innerHTML = `<p class="not-found">No movies or shows watched recently.</p>`;
            return;
        }

        const items = [];
        snapshot.forEach((doc) => {
            const data = doc.data();

            // Check if watchedAt is a Firestore Timestamp
            let watchedAt;
            if (data.watchedAt && typeof data.watchedAt.toDate === "function") {
                watchedAt = data.watchedAt.toDate(); // Convert Firestore Timestamp to JS Date
            } else {
                watchedAt = new Date(data.watchedAt); // Fallback if it's a plain date or string
            }

            items.push({
                ...data,
                watchedAt,
            });
        });

        // Clear skeleton loader
        recentlyWatchedList.innerHTML = "";

        // Fetch details for each item from TMDB
        for (const item of items) {
            const details = await fetchDetailsFromTMDb(item.id, item.type);
            if (details) {
                displayItem(details, item.type, item.watchedAt);
            }
        }
    } catch (error) {
        console.error("Error fetching recently watched details:", error.message);
    }
}




// Fetch details from TMDB for movie or TV show
async function fetchDetailsFromTMDb(id, type) {
    const url = type === "Series"
        ? `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch TMDb details for ${type} with ID ${id}.`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching TMDb details:", error.message);
        return null;
    }
}

// Display the fetched item with its details
// Updated display function to show watchedAt
function displayItem(details, type, watchedAt) {
    const list = document.getElementById("recently-watched-list");
    const div = document.createElement("div");
    div.className = "recently-watched-item";

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(watchedAt);

    div.innerHTML = `
        <div class="card" onclick="window.location.href='${type === "Series" ? `/tv-show-details.html?tvId=${details.id}` : `/details.html?movieId=${details.id}`}'">
            <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name}">
            <h3>${details.title || details.name}</h3>
            <p>Type: ${type === "Series" ? "TV Show" : "Movie"}</p>
            <p>Watched On: ${formattedDate}</p>
        </div>
    `;

    list.appendChild(div);
}