
document.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // Prevent the context menu from appearing
});


// // Create a new script element
// var script = document.createElement('script');

// // Set the script attributes
// script.src = 'https://cdn.jsdelivr.net/npm/disable-devtool';
// script.setAttribute('disable-devtool-auto', '');

// // Append the script to the document head or body
// document.head.appendChild(script); // or document.body.appendChild(script);

  
// ----------------------------------------------
// ----------  firebase stuffs   -----------------------
// ----------------------------------------------
  


// Initialize Firebase
try {
  const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();




  // Listen for authentication state changes
  auth.onAuthStateChanged((user) => {
    try {
      const loginLinks = document.querySelectorAll('a[href="/auth/login"]');
      
      if (user) {
        // User is logged in, replace "Login" with "Dashboard"
        loginLinks.forEach(link => {
          link.href = "/user/Dashboard/"; // Adjusted for absolute paths
          link.textContent = "Dashboard";
        });
       
      } else {
        // User is not logged in, keep "Login"
        loginLinks.forEach(link => {
          link.href = "/auth/login.html"; // Adjusted for absolute paths
          link.textContent = "Login";
        });
      }
    } catch (error) {
      console.error("Error updating links:", error);
    }
  });


 

} catch (error) {
  
}



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
          <li><a href="/contact.html">Contact Us</a></li>
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/Download.html">Download App</a></li>
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



// Display a loading alert
Swal.fire({
  title: 'Subscribing',
  text: 'Please wait while we process your Request.',
  icon: 'info',
  showConfirmButton: false,
  allowOutsideClick: false,
  didOpen: () => {
    Swal.showLoading();
  }
});


setTimeout(() => {
  Swal.fire({
    position: "center",
    icon: "info",
    title: `internal server Error `,
    showConfirmButton: false,
    timer: 1500,
    customClass:"newsletteralert",
  });
  Newsletterform.reset();
}, 2000);

   
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


/* ---------------------------------------
-----------App download popup ------------
--------------------------------------- */

  
// Function to check if the site is running on an Android device (not WebView)
function isAndroidBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();

  // Check if the user agent includes 'android'
  const isAndroid = userAgent.indexOf('android') > -1;

  // Exclude WebView (detect 'wv' or 'version/x.y.z' pattern in the user agent)
  const isWebView = userAgent.indexOf('wv') > -1 || /version\/\d+\.\d+/i.test(userAgent);

  return isAndroid && !isWebView;
}

// Function to create and append the popup HTML to the document
function createPopup() {
  const popupHTML = `
    <div id="appCoolPopup" class="appPopup" style="display: none;">
      <div class="appPopupContent">
        <span class="appCloseBtn">&times;</span>
        <h2 class="appHeading">Get Our App</h2>
        <p class="appDescription">Enjoy exclusive features and a seamless experience. Download the app now!</p>
           <a href="/assets/Android App/Ronny FLix (1.0.3).apk" class="popupdownloadbtn" download="Ronny_Flix_App.apk">
              <i class="fab fa-android"></i> Download for Android
            </a>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  // Add event listener to the close button after creating the popup
  document.querySelector(".appCloseBtn").addEventListener("click", () => {
    const popup = document.getElementById('appCoolPopup');
    if (popup) popup.remove();
  });
}

// Function to show the popup
function showPopup() {
  // Check if the device is an Android browser (not WebView) and the popup has not been shown in this session
  if (isAndroidBrowser() && !sessionStorage.getItem('popupShown')) {
    const popup = document.getElementById('appCoolPopup');
    if (popup) {
      // Set the popup to be visible
      popup.style.display = 'flex';

      // Start with opacity 0 for fade-in effect
      popup.style.opacity = '0';
      popup.style.transition = 'opacity 0.3s ease'; // Smooth transition

      // Fade-in effect after a short delay
      setTimeout(() => {
        popup.style.opacity = '1'; // Fade in the popup
      }, 100);

      // Set a flag in sessionStorage to indicate the popup has been shown
      sessionStorage.setItem('popupShown', 'true');
    }
  }
}

// Delay the popup initialization to avoid interrupting the user's experience
setTimeout(() => {
  createPopup(); // Create the popup
  showPopup(); // Show the popup if conditions are met
}, 3000);

