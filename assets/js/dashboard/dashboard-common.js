// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


try {
    let main_container = document.querySelector(".content")
let msg = document.querySelector(".msg")
let loader = document.querySelector(".loader")

// ----------------------------------------------
// ----------  NOt authorized   -----------------------
// ----------------------------------------------

function unauthorized(){
    let unauthorized = document.querySelector(".unauthorized")
    const unauthorizedcontainer = document.createElement("div");
    unauthorizedcontainer.classList.add("unauthorized-container");
  
    // Add the popup content
    unauthorizedcontainer.innerHTML = `
            <h2 id="Unauthorized-text">Unauthorized</h2>
      <p>You Dont have permission to view this page.</p>
<a href="/auth/login.html"><button>Login Now </button></a>
    `;
  
    // Append popup to body
    unauthorized.prepend(unauthorizedcontainer);
  
  }


  let mobilemenuicon = document.getElementById("mobile-nav-open");
let mobilemenu = document.querySelector(".nav-links");
let menuitem = document.querySelectorAll(".nav-links li");



mobilemenuicon.addEventListener("click", function () {
  mobilemenu.classList.toggle("active");
  mobilemenuicon.classList.toggle("fa-bars");
  mobilemenuicon.classList.toggle("fa-xmark");
});


menuitem.forEach(item => {
    item.addEventListener("click",function(){
        mobilemenu.classList.toggle("active");
        mobilemenuicon.classList.toggle("fa-bars");
        mobilemenuicon.classList.toggle("fa-xmark");
    } );
});




// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in, you can perform any actions you want here
        console.log("User is signed in:", user);
        main_container.style.display="block"
        loader.remove();
        msg.remove();
    } else {
        // User is signed out, perform actions for logged-out state
        console.log("User is not signed in.");
        loader.remove();
        main_container.remove()
        unauthorized();

    }
});




} catch (error) {
    console.error("Dashboard section err")
}


document.getElementById('logout-button').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = '/auth/login.html';
    });
});

try {
    document.querySelector('.logout-button').addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = '/auth/login.html';
        });
    });
    
    
} catch (error) {
    
}