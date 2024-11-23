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





//=====================================
//=====================================
//=====================================

 // Custom Console alert required popup
//  function showConsolealertPopup() {
    
//         const popup = document.createElement('div');
//         popup.className = 'Console alert-popup';

//         popup.innerHTML = `
//     <div class="popupcontainer">
//     <div class="Console-alert-popup-content">
//         <div class="popup-header">
//             <i class="fas fa-exclamation-circle console-alert-icon"></i>
//             <h2>Developer mode not allowed</h2>
//         </div>
//         <p>Quiting the page ...</p>
    
//     </div>
//     </div>
// `;

//         // Append to body and add active class after a short delay to trigger transitions
//         document.body.appendChild(popup);
//         setTimeout(() => popup.classList.add('active'), 10);  // Slight delay to ensure transition

      

    


// }


// let devtoolsOpen = false;

// setInterval(() => {
//     const before = new Date();
//     if (new Date() - before > 100) {
//         devtoolsOpen = true;
//         console.log("Developer tools are open!");
//     }
// }, 1000);



// // ----------------------------------------------
// // ----------  country sel popup   -----------------------
// // ----------------------------------------------
// document.addEventListener('DOMContentLoaded', function() {


// // Initialize Firebase if it hasn't been initialized yet
// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }




// const auth = firebase.auth();
// const db = firebase.firestore();

// // Create popup elements
// const popupOverlay = document.createElement('div');
// popupOverlay.id = 'countryPopup';
// popupOverlay.style.display = 'none'; // Initially hidden

// const popupContent = document.createElement('div');
// popupContent.className = 'popup-content';

// popupContent.innerHTML = `
//   <img src="assets/img/logo.png" alt="" srcset="">
//     <h2>Welcome to Ronnyflix</h2>
//     <p>This is only for showing content related to your country. Please select your country below:</p>
//     <select id="countrySelect">
//         <option value="">Select your country</option>
//     </select>
//     <button id="saveCountryButton"  >Save</button>
// `;

// popupOverlay.appendChild(popupContent);
// document.body.appendChild(popupOverlay);

// const countrySelect = document.getElementById('countrySelect');
// const saveCountryButton = document.getElementById('saveCountryButton');

// // Fetch country data from JSON and populate the dropdown
// fetch('/assets/countries.json') // Make sure this path is correct
//     .then(response => response.json())
//     .then(countries => {
//         countries.forEach(country => {
//             const option = document.createElement('option');
//             option.value = country.name;
//             option.textContent = country.name;
//             countrySelect.appendChild(option);
//         });
//     })
//     .catch(error => console.error('Error fetching countries:', error));

//     // Save the user's country preference
//     function saveCountryPreference(country) {
//         const user = firebase.auth().currentUser;
//         if (user) {
//             const userId = user.uid;
//             console.log("Saving country for user ID:", userId);
            
//             db.collection("users").doc(userId).set({
//                 country: country
//             }, { merge: true })
//             .then(() => {
//                 console.log("Country saved to Firestore.");
//                 closePopup();
//             })
//             .catch(error => {
//                 console.error("Error saving country to Firestore:", error);
//             });
//         } else {
//             localStorage.setItem('country', country);
//             console.log("Country saved to localStorage.");
//             closePopup();
//         }
//     }
    
//     // Call this after authenticating the user
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             console.log("User is logged in:", user.uid);
//             checkAndShowPopup(); // Check for popup if user is logged in
//         } else {
//             console.log("No user logged in.");
//         }
//     });
    
    

// // Function to close the popup
// function closePopup() {
//     popupOverlay.style.display = 'none';
// }


// try {
// // Check if the popup needs to be displayed
// function checkAndShowPopup() {
//     const user = firebase.auth().currentUser;
//     if (user) {
//         const userId = user.uid;
//         db.collection("users").doc(userId).get()
//         .then(doc => {
//             if (!doc.exists || !doc.data().country) {
//                 popupOverlay.style.display = 'flex'; // Show popup if no country
//             } else {
//                 console.log("User country found:", doc.data().country);
//                 console.log("User Name:", doc.data().name);
//                 document.querySelector(".popup-content").remove()
//             }
//         })
//         .catch(error => {
//             console.error("Error checking country in Firestore:", error);
//         });
//     } else {
//         if (!localStorage.getItem('country')) {
//             popupOverlay.style.display = 'flex'; // Show popup if no country
//         }
//     }
// }
// } catch (error) {
//     console.error("Firestore error:", error);
// }


// // Event listener for saving the selected country
// saveCountryButton.addEventListener('click', () => {
//     const selectedCountry = countrySelect.value;
//     if (selectedCountry) {
//         saveCountryPreference(selectedCountry);
//     } else {
//         alert("Please select a country.");
//     }
// });

// // Check and show popup on page load
// setTimeout(() => {
//     checkAndShowPopup();
// }, 2000);




// function getUserCountry() {
//     const user = firebase.auth().currentUser;
//     if (user) {
//         return db.collection("users").doc(user.uid).get()
//             .then(doc => {
//                 if (doc.exists) {
//                     console.log(doc.data().country)
//                     return doc.data().country; // Return country from Firestore
//                 } else {
//                     console.warn("No country found in Firestore.");
//                     return null; // Return null if no country is found
//                 }
//             });
//     } else {
//         return Promise.resolve(localStorage.getItem('country')); // Return from localStorage if not logged in
//     }
// }


// });





// ----------------------------------------------
// ----------  search js   -----------------------
// ----------------------------------------------

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




// ----------------------------------------------
// ----------  Newsletter   -----------------------
// ----------------------------------------------

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