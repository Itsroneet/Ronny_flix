

  
// ----------------------------------------------
// ----------  firebase stuffs   -----------------------
// ----------------------------------------------
  


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


document.addEventListener("DOMContentLoaded", function() {

  // Listen for authentication state changes
  auth.onAuthStateChanged((user) => {
    const loginLinks = document.querySelectorAll('a[href="auth/login.html"]');
    try {
      if (user) {
        // User is logged in, replace "Login" with "Dashboard"
        loginLinks.forEach(link => {
          link.href = "/user/Dashboard/";  // Absolute path might help here
          link.textContent = "Dashboard";
        });
      } else {
        // User is not logged in, keep "Login"
        loginLinks.forEach(link => {
          link.href = "/auth/login.html";  // Absolute path might help here
          link.textContent = "Login";
        });
      }
    } catch (error) {
      console.error("Error updating links:", error);
    }
  }); 
  }); 
  
 





// ----------------------------------------------
// ----------  search js   -----------------------
// ----------------------------------------------

try {
    const searchlabel= document.getElementById('slabel');
const searchInput = document.getElementById('search-input');

    // Handle Enter key press
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
          performSearch();
      }
  });

  // Handle button click
  document.getElementById('search-button').addEventListener('click', () => {
      performSearch();
  });

  // Function to perform the search
  function performSearch() {
      const query = searchInput.value.trim();
      if (query === "") {
          searchlabel.style.display = "block";
      } else {
          searchlabel.style.display = "none";
          window.location.href = `search.html?query=${encodeURIComponent(query)}`;
      }
  }

} catch (error) {
    
}





// ----------------------------------------------
// ----------  Footer html   -----------------------
// ----------------------------------------------

try {
  let footer = document.querySelector(".footer")


footer.innerHTML=`<div class="footer-content">
      <!-- Logo and About -->
      <div class="footer-about">
        <h3>Ronny Flix</h3>
        <p>
          Ronny Flix does not host any content. All videos are provided by third-party services. Legal issues 
          should be taken up with the file hosts and providers. Ronny Flix is not responsible for any media files 
          shown by the video providers.
        </p>
        <div class="social-icons">
          <a href="#" class="icon"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="icon"><i class="fab fa-twitter"></i></a>
          <a href="#" class="icon"><i class="fab fa-instagram"></i></a>
          <a href="#" class="icon"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
  
      <!-- Quick Links -->
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/movies.html">Movies</a></li>
          <li><a href="/tvshows.html">TV Shows</a></li>
          <li><a href="/contact.html">Contact Us</a></li>
          <li><a href="/about.html">About Us</a></li>
        </ul>
      </div>
  
      <!-- Newsletter -->
      <div class="footer-newsletter">
        <h4>Stay Updated</h4>
        <p>Subscribe to our newsletter for the latest updates!</p>
        <form class="newsletter-form">
          <input type="email" placeholder="Enter your email" required />
          <button id="sumbit-btn" type="submit">Subscribe</button>
          <button id="sumbit-btn-icon" type="submit"><i class="fa-regular fa-paper-plane"></i></button>
        </form>
      </div>
    </div>
  <div class="footer-separator"></div>
    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <p>&copy; 2024 Ronny Flix. All rights reserved.</p>
    </div>`
} catch (error) {
  
}

// ----------------------------------------------
// ----------  Newsletter   -----------------------
// ----------------------------------------------

try {
  const Newsletterform = document.querySelector('.newsletter-form');

    // Handle Enter key press
    Newsletterform.addEventListener('submit', (e) => {
    e.preventDefault();
    Swal.fire({
        position: "center",
        icon: "error",
        title: `Couldn't Subscribe `,
        showConfirmButton: false,
        timer: 1500,
        customClass:"newsletteralert",
      });
      Newsletterform.reset();
    });

} catch (error) {
  
}


    // ----------------------------------------------
    // ----------  NAvbar   -----------------------
    // ----------------------------------------------

try {
    let mobilemenuopen = document.getElementById("mobile-menu-open");
    let mobilemenuclose = document.getElementById("mobile-menu-close");
    let mobilemenu = document.querySelector(".nav .nav-items ul");
    let menuitem = document.querySelectorAll(".nav .nav-items ul li a");
    
    
    mobilemenuopen.addEventListener("click", function () {
      mobilemenu.classList.add("nav-active");
    });
    
    function menuhide() {
      mobilemenu.classList.remove("nav-active");
    }
    
    mobilemenuclose.addEventListener("click", menuhide);
    menuitem.forEach(item => {
        item.addEventListener("click", menuhide);
    });



    
} catch (error) {
}


