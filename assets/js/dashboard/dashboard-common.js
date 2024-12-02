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

    function unauthorized() {
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
    function notverified() {
        let unauthorized = document.querySelector(".unauthorized")
        const unauthorizedcontainer = document.createElement("div");
        unauthorizedcontainer.classList.add("unauthorized-container");

        // Add the popup content
        unauthorizedcontainer.innerHTML = `
        <h2 id="Unauthorized-text">Not Verified</h2>
        <p>Please verify your Email</p>
        <a><button id="verify-btn">Verify</button></a>
    `;
        // Append popup to body
        unauthorized.prepend(unauthorizedcontainer);

            // Add event listener to the "Verify" button
    document.getElementById("verify-btn").addEventListener("click", function () {
        const user = auth.currentUser; // Get the current user
    
        if (user) {
            user.sendEmailVerification()
                .then(() => {
                    Swal.fire({
                        title: "Email Sent",
                        text: "Verification email sent. Please check your inbox!",
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                })
                .catch((error) => {
                    console.error("Error sending verification email: ", error.message);
                    Swal.fire({
                        title: "Error",
                        text: "Failed to send verification email. Please try again..",
                        icon: "error",
                        timer: 3000,
                        showConfirmButton: false,
                    });
                });
        }
    });
    

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
        item.addEventListener("click", function () {
            mobilemenu.classList.toggle("active");
            mobilemenuicon.classList.toggle("fa-bars");
            mobilemenuicon.classList.toggle("fa-xmark");
        });
    });




// Listen for authentication state changes
auth.onAuthStateChanged(user => {
    if (user) {
        if (user.emailVerified) { // Check if the user's email is verified
            console.log("User is signed in:", user.displayName);
            main_container.style.display = "block";
            loader.remove();
            msg.remove();
        } else {
            loader.remove();
            main_container.style.display = "none";
            notverified();
        }
    } else {
        // User is signed out
        loader.remove();
        main_container.remove();
        unauthorized();
    }
});





} catch (error) {
    console.error("Dashboard section err")
}




function logout() {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out of your account.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with logout if confirmed
            auth.signOut().then(() => {
                window.location.href = '/auth/login.html';
            }).catch((error) => {
                // Handle any sign-out errors here
                console.error("Sign out error:", error);
            });
        }
    });
}

// Add logout listener for the first button
document.getElementById('logout-button').addEventListener('click', logout);

// Add logout listener for the second button
try {
    document.querySelector('.logout-button').addEventListener('click', logout);
} catch (error) {
    console.error("Error in logout button event:", error);
}


document.getElementById("backtologin-dash").addEventListener("click", e=>{
    window.location.href = '/auth/login.html';

})