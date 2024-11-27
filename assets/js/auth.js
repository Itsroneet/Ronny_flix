// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();


auth.onAuthStateChanged((user) => {
          if (user) {
            window.location.href = "../user/Dashboard/";        }
    } 
);

// Password visibility toggle function
function togglePasswordVisibility(inputId, toggleId) {
    var inputField = document.getElementById(inputId);
    var toggleIcon = document.getElementById(toggleId);

    if (inputField.type === "password") {
        inputField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        inputField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}

// Toggle password visibility event listeners
document.getElementById('togglePasswordLogin')?.addEventListener('click', function () {
    togglePasswordVisibility('login-password', 'togglePasswordLogin');
});

document.getElementById('togglePasswordSignup')?.addEventListener('click', function () {
    togglePasswordVisibility('reg-password', 'togglePasswordSignup');
});

document.getElementById('toggleCPassword')?.addEventListener('click', function () {
    togglePasswordVisibility('c-password', 'toggleCPassword');
});

// Login form event listener
try {
    var loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showloader();
            clearmsg();
            var email = document.getElementById('login-email').value;
            var password = document.getElementById('login-password').value;
            const button = loginForm.querySelector('.btn');

            auth.signInWithEmailAndPassword(email, password)
                .then(function (userCredential) {
                    const user = userCredential.user;

                    if (user.emailVerified) {
                        // Fetch user role from Firestore
                        db.collection("users").doc(user.uid).get()
                            .then(function (doc) {
                                if (doc.exists) {
                                    const userData = doc.data();
                                    const userRole = userData.role;

                                    Swal.fire({
                                        title: "Successfully logged in",
                                        text: "Redirecting to Dashboard...",
                                        icon: "success",
                                        timer: 3000,
                                        showConfirmButton: false,
                                    });
                                    setTimeout(() => {
                                        window.location.href = "../user/Dashboard/";
                                    }, 1500);

                                } else {
                                    hideloader();
                                    displayMessage('.error-msg', "No user data found!");
                                }
                            })
                            .catch(function (error) {
                                displayMessage('.error-msg', error.message);
                                hideloader();
                            });
                    } else {
                        hideloader();
                        displayMessage('.error-msg', "Please verify your email before logging in.");
                    }
                })
                .catch(function (error) {
                    hideloader();
                    const userFriendlyMessage = getFriendlyErrorMessage(error.code);
                    displayMessage('.error-msg', userFriendlyMessage);
                });
        });
    }
} catch (error) {
    // Handle form-related errors
}

// Signup form event listener
try {
    var signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showloader();
        clearmsg();
        var name = document.getElementById('fullname').value;
        var email = document.getElementById('reg-email').value;
        var password = document.getElementById('reg-password').value;
        var confirmPassword = document.getElementById('c-password').value;
        const button = signupForm.querySelector('.btn');

        if (password !== confirmPassword) {
            hideloader();
            displayMessage('.error-msg', "Passwords do not match!");
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(function (userCredential) {
                const user = userCredential.user;

                // Update user display name
                user.updateProfile({
                    displayName: name
                })
                    .then(function () {
                        // Send email verification
                        user.sendEmailVerification()
                            .then(function () {
                                hideloader();
                                displayMessage('.success-msg', "Account created! Please verify your email.");
                            })
                            .catch(function (error) {
                                hideloader();
                                displayMessage('.error-msg', "Error sending verification email.");
                            });

                        // Save user data to Firestore
                        db.collection("users").doc(user.uid).set({
                            name: name,
                            email: email,
                            role: "user"  // Default role for new users
                        })
                            .then(function () {
                                sessionStorage.setItem('userEmail', email);
                                signupForm.reset();
                            })
                            .catch(function (error) {
                                hideloader();
                                displayMessage('.error-msg', error.message);
                            });
                    })
                    .catch(function (error) {
                        hideloader();
                        displayMessage('.error-msg', "Error updating profile: " + error.message);
                    });
            })
            .catch(function (error) {
                hideloader();
                const userFriendlyMessage = getFriendlyErrorMessage(error.code);
                displayMessage('.error-msg', userFriendlyMessage);
            });
    });
} catch (error) {
    // Handle form-related errors
}

// Forgot password form event listener
try {
    var forgotForm = document.getElementById('forgot-form');
    if (forgotForm) {
        forgotForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearmsg();
            showloader();
            var email = document.getElementById('forgot-email').value;
            const button = forgotForm.querySelector('.btn');

            auth.sendPasswordResetEmail(email)
                .then(function () {
                    hideloader();
                    displayMessage('.success-msg', "Password reset email sent!");
                    forgotForm.reset();
                })
                .catch(function (error) {
                    hideloader();
                    const userFriendlyMessage = getFriendlyErrorMessage(error.code);
                    displayMessage('.error-msg', userFriendlyMessage);
                });
        });
    }
} catch (error) {
    // Handle form-related errors
}

// Helper Functions
function displayMessage(selector, message) {
    const msgElement = document.querySelector(selector);
    msgElement.textContent = message;
}

function showloader() {
    document.querySelector(".spinner").style.display = "flex"
    document.querySelector(".loader .btn").disabled = "true"
}
function hideloader() {
    document.querySelector(".spinner").style.display = "none"
    document.querySelector(".loader .btn").disabled = ""
}

function clearmsg() {
    document.querySelector(".success-msg").innerHTML = ""
    document.querySelector(".error-msg").innerHTML = ""
}

// Function to map Firebase error codes to user-friendly messages
function getFriendlyErrorMessage(errorCode) {
    const errorMessages = {
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'This email is already in use.',
        'auth/weak-password': 'Password should be at least 6 characters long.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/requires-recent-login': 'Please log in again to perform this action.'
    };

    return errorMessages[errorCode] || 'Incorrect password. Please try again.';
}




// Google Sign-In button handler

// Google Sign-In Provider
var provider = new firebase.auth.GoogleAuthProvider();

// Google Sign-In Logic
try {
    document.getElementById("googleSignInBtn").addEventListener("click", function () {
        auth.signInWithPopup(provider)
            .then(function (result) {
                const user = result.user;
                console.log("User Info:", user);

                // Check if the user exists in Firestore
                db.collection("users").doc(user.uid).get()
                    .then(function (doc) {
                        if (doc.exists) {
                            // User exists, log them in
                            Swal.fire({
                                title: "Welcome Back!",
                                text: `Successfully signed in as ${user.displayName}.`,
                                icon: "success",
                            });

                            // Redirect based on user role or other logic
                            window.location.href = "../user/Dashboard/";  // Update as per your app
                        } else {
                            // User does not exist, prompt to create account
                            Swal.fire({
                                title: "Account Not Found",
                                text: `It seems you don't have an account yet. Would you like to create one using your Google profile?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Create Account",
                                cancelButtonText: "Cancel",
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // Create account using Google profile
                                    createAccount(user);
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.error("Error checking user existence:", error.message);
                        Swal.fire({
                            title: "Error",
                            text: error.message,
                            icon: "error",
                        });
                    });
            })
            .catch(function (error) {
                console.error("Error during Google Sign-In:", error.message);
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error",
                });
            });
    });

} catch (error) {

}
// Function to Create Account with Google Profile
function createAccount(user) {
    db.collection("users").doc(user.uid).set({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,  // User's profile picture
        role: "user",            // Default role
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            Swal.fire({
                title: "Account Created!",
                text: "Your account has been successfully created.",
                icon: "success",
            });

            // Redirect to user dashboard or another page
            window.location.href = "../user/Dashboard/";  // Update URL as needed
        })
        .catch(function (error) {
            console.error("Error creating user in Firestore:", error.message);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
        });
}

// Google Sign-Up Button Event
document.getElementById("googleSignUpBtn").addEventListener("click", function () {
    auth.signInWithPopup(provider)
        .then(function (result) {
            const user = result.user;
            console.log("User Info:", user);

            // Always create a new account in Firestore
            createAccount(user);
        })
        .catch(function (error) {
            console.error("Error during Google Sign-Up:", error.message);
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
            });
        });
});

