// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Event Listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userId = user.uid;

            try {
                // Fetch user data
                const userDoc = await db.collection("users").doc(userId).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    document.getElementById("user-name").textContent = userData.name || "User";
                }

                // Fetch movie counts
                const watchedMoviesCount = await getCollectionCount(userId, "recentlyWatched");
                document.getElementById("watched-movies").textContent = watchedMoviesCount;

                const favoritesCount = await getCollectionCount(userId, "favorites");
                document.getElementById("fav-movies").textContent = favoritesCount;

                // Load recently watched items
                fetchRecentlyWatchedDetails(userId);
            } catch (error) {
                console.error("Error fetching user data or counts:", error);
            }
        } else {
            console.log("No user signed in.");
        }
    });
});

// Function to fetch collection count
async function getCollectionCount(userId, collectionName) {
    try {
        const snapshot = await db.collection("users").doc(userId).collection(collectionName).get();
        return snapshot.size;
    } catch (error) {
        console.error(`Error fetching ${collectionName} count:`, error);
        return 0;
    }
}

// Fetch recently watched items
async function fetchRecentlyWatchedDetails(userId) {
    const recentlyWatchedContainer = document.getElementById("recently-watched-list");

    // Show skeleton loader
    showSkeletonLoader(recentlyWatchedContainer, 5); // Display 5 skeleton placeholders

    try {
        const snapshot = await db
            .collection("users")
            .doc(userId)
            .collection("recentlyWatched")
            .orderBy("watchedAt", "desc")
            .limit(7)
            .get();

        if (snapshot.empty) {
            recentlyWatchedContainer.innerHTML = "<li>No movies or shows watched recently.</li>";
            return;
        }

        const items = snapshot.docs.map(doc => doc.data());

        // Clear skeleton loader once data is ready
        recentlyWatchedContainer.innerHTML = "";

        for (const item of items) {
            const details = await fetchDetailsFromTMDb(item.id, item.type);
            displayItem(details, item.type);
        }
    } catch (error) {
        console.error("Error fetching recently watched items:", error);
        recentlyWatchedContainer.innerHTML = "<li>Failed to load recently watched items. Please try again later.</li>";
    }
}

function showSkeletonLoader(container, count) {
    const skeletons = Array.from({ length: count })
        .map(
            () => `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"><div class="skeleton-title"></div>
                <div class="skeleton-meta"></div></div>
                
            </div>`
        )
        .join("");
    container.innerHTML = skeletons;
}



// Fetch details from TMDb
async function fetchDetailsFromTMDb(id, type) {
    const url = type === "Series"
        ? `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch TMDb details for ${type} with ID ${id}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching TMDb details:", error.message);
        return null;
    }
}

// Display fetched items
function displayItem(details, type) {
    if (!details) return;

    const list = document.getElementById("recently-watched-list");
    const div = document.createElement("div");
    div.className = "recently-watched-item";

    div.innerHTML = `
        <div class="recent-card">
            <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name}">
            <div>
                <h3>${details.title || details.name}</h3>
                <p>${type === "Series" ? "TV Show" : "Movie"}</p>
            </div>
        </div>
    `;

    div.querySelector(".recent-card").addEventListener("click", () => {
        const itemId = details.id;
        const redirectUrl = type === "Series"
            ? `/tv-show-details.html?tvId=${itemId}`
            : `/details.html?movieId=${itemId}`;
        window.location.href = redirectUrl;
    });

    list.appendChild(div);
}
