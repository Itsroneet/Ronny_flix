

// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ------------------------------------------------
// -------------- profile ------------------------
// ------------------------------------------------



   const mainView = document.getElementById('main-view');
    const updateProfileSection = document.getElementById('update-profile-section');
    const changeEmailSection = document.getElementById('change-email-section');
    const changePasswordSection = document.getElementById('change-password-section');

    function showSection(section) {
        mainView.style.display = 'none';
        updateProfileSection.style.display = 'none';
        changeEmailSection.style.display = 'none';
        changePasswordSection.style.display = 'none';
        section.style.display = 'block';
    }

    function backToMainView() {
        mainView.style.display = 'block';
        updateProfileSection.style.display = 'none';
        changeEmailSection.style.display = 'none';
        changePasswordSection.style.display = 'none';
    }

    auth.onAuthStateChanged((user) => {
        if (user) {
          
            document.getElementById('user-name').textContent = user.displayName || 'User';

            document.getElementById('user-email').textContent = user.email || 'user@example.com';
            if (user.photoURL) {
                document.getElementById('profile-pic').src = user.photoURL;
            }
        }
    });

    document.getElementById('update-profile-button').addEventListener('click', () => showSection(updateProfileSection));
    document.getElementById('change-email-button').addEventListener('click', () => showSection(changeEmailSection));
    document.getElementById('change-password-button').addEventListener('click', () => showSection(changePasswordSection));

    document.getElementById('back-from-update-profile').addEventListener('click', backToMainView);
    document.getElementById('back-from-change-email').addEventListener('click', backToMainView);
    document.getElementById('back-from-change-password').addEventListener('click', backToMainView);

    document.getElementById('logout-button').addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = '/auth/login.html';
        });
    });



    // ------------------------------------------------
// -------------- profile form ------------------------
// ------------------------------------------------

    const updateProfileForm = document.getElementById("update-profile-form");
    const newNameInput = document.getElementById("new-name");
    const profilePicInput = document.getElementById("profile-pic-input");

    // Initialize Firestore

    updateProfileForm.addEventListener("submit", async (event) => {
        event.preventDefault();
    
        const newName = newNameInput.value.trim();
        const profilePicFile = profilePicInput.files[0];
        const user = firebase.auth().currentUser;
    
        if (!user) {
            document.getElementById("error-message").textContent = "No user is logged in. Please log in to update your profile.";
            document.getElementById("error-message").style.display = "block";
            return;
        }
    
        try {
            // Show loading message
            document.getElementById("loading-message").style.display = "block";
    
            // Store updated details
            let profilePicURL = user.photoURL; // Retain the current photo URL if no new one is provided
    
            // Upload profile picture if a new one is provided
            if (profilePicFile) {
                const storageRef = firebase.storage().ref(`profilePictures/${user.uid}`);
                const uploadTask = storageRef.put(profilePicFile);
    
                // Wait for the upload to complete
                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        "state_changed",
                        null,
                        (error) => {
                            console.error("Error uploading profile picture:", error);
                            reject(error);
                        },
                        async () => {
                            profilePicURL = await uploadTask.snapshot.ref.getDownloadURL();
                            resolve();
                        }
                    );
                });
            }
    
            // Update Firebase Authentication profile
            await user.updateProfile({
                displayName: newName || user.displayName, // Retain old name if no new name is provided
                photoURL: profilePicURL,
            });
    
            // Update Firestore with the new name and photo URL
            await db.collection("users").doc(user.uid).set(
                {
                    name: newName || user.displayName,
                    photoURL: profilePicURL,
                },
                { merge: true } // Merge with existing data to avoid overwriting other fields
            );
    
            // Hide loading message and show success message
            document.getElementById("loading-message").style.display = "none";
            document.getElementById("success-message").style.display = "block";
    
            // Reset the form
            updateProfileForm.reset();
        } catch (error) {
            console.error("Error updating profile:", error);
            // Hide loading message and show error message
            document.getElementById("loading-message").style.display = "none";
            document.getElementById("error-message").style.display = "block";
        }
    });
    
    const previewBox = document.getElementById("profile-pic-preview");
    const previewImage = document.getElementById("preview-image");
    
    profilePicInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Set the selected image as the preview
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            // Optional: Reset to the default image if no file is selected
            previewImage.src = "path-to-default-image.jpg";
        }
    });
    


 
    // ------------------------------------------------
// -------------- Account delete btn ------------------------
// ------------------------------------------------
 
// Open the confirmation modal when the delete button is clicked
document.getElementById('delete-account-button').addEventListener('click', function () {
    document.getElementById('confirmation-modal').style.display = 'flex';
});

// Close the modal when "Cancel" is clicked
document.getElementById('cancel-delete').addEventListener('click', function () {
    document.getElementById('confirmation-modal').style.display = 'none';
});

// Handle account deletion when "Yes, Delete Account" is clicked
document.getElementById('confirm-delete').addEventListener('click', async function () {
    const user = auth.currentUser;

    if (user) {
        // Show SweetAlert2 password prompt and hide the confirmation modal
        document.getElementById('confirmation-modal').style.display = 'none';  // Hide the confirmation modal immediately

        const { value: password } = await Swal.fire({
            title: 'Enter your password to confirm account deletion',
            input: 'password',
            inputPlaceholder: 'Password',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirm Deletion',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a password!';
                }
            }
        });

        // If no password is provided, cancel the deletion process
        if (!password) {
            return;
        }

        try {
            // Disable the button or show a loader here if needed
            document.getElementById('confirm-delete').disabled = true;

            // Re-authenticate the user with the entered password
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
            await user.reauthenticateWithCredential(credential);

            // Delete user data from Firestore
            await db.collection("users").doc(user.uid).delete();

            // Delete the user's account from Firebase Authentication
            await user.delete();

            // Close modal and redirect
            window.location.href = '/'; // Customize this URL

        } catch (error) {
            console.error("Error during account deletion:", error.message);
            // Show error message for incorrect password or any other issue
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Incorrect password or something went wrong. Please try again.'
            });
        } finally {
            // Reset button or hide loader
            document.getElementById('confirm-delete').disabled = false;
        }
    } else {
        document.getElementById('confirmation-modal').style.display = 'none';
        showMessage('.error-msg', "No user is currently logged in.");
    }
});




    // ------------------------------------------------
// -------------- email update form ------------------------
// ------------------------------------------------


const sendVerificationButton = document.getElementById('send-verification-button');
const newEmailInput = document.getElementById('new-email');
const feedbackDiv = document.getElementById('email-feedback');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackMessage = document.getElementById('feedback-message');
const pendingEmailWrapper = document.getElementById('pending-email-wrapper');
const pendingEmailElement = document.getElementById('pending-email');

let isVerificationRequestSent = false; // To prevent multiple verification requests
const resendTimeout = 60000; // 1 minute timeout

// Function to show feedback to user
function showFeedback(message, type) {
    feedbackDiv.style.display = 'block';
    feedbackMessage.textContent = message;
    feedbackIcon.className = type === 'success' ? 'fa fa-check-circle' : 'fa fa-exclamation-circle';
    feedbackDiv.style.color = type === 'success' ? 'green' : 'red';
    setTimeout(() => {
        feedbackDiv.style.display = 'none';
    }, 5000);
}

// Send verification email to the new email address
sendVerificationButton.addEventListener('click', async () => {
    const newEmail = newEmailInput.value.trim();

    if (!newEmail) {
        showFeedback("Please enter a valid email address.", "error");
        return;
    }

    // Prevent multiple verification requests within a short time
    if (isVerificationRequestSent) {
        showFeedback("You can only request verification once every minute. Please try again later.", "error");
        return;
    }

    try {
        // Check if the email is already in use in Firestore
        const userQuery = await db.collection("users").where("email", "==", newEmail).get();

        if (!userQuery.empty) {
            showFeedback("This email is already in use. Please use a different email.", "error");
            return;
        }

        const user = auth.currentUser;

        // Temporarily set the new email in Firebase Authentication (without saving it permanently)
        await user.updateEmail(newEmail);

        // Send verification email to the new email
        await user.sendEmailVerification();

        // Save the pending email to Firestore (pending state until email is verified)
        await db.collection("users").doc(user.uid).set({
            pendingEmail: newEmail
        }, { merge: true });

        showFeedback(`Verification link sent to ${newEmail}. Please verify before changing.`, "success");

        // Display the pending email message
        pendingEmailWrapper.style.display = "block";
        pendingEmailElement.textContent = newEmail;

        // Disable the button temporarily
        isVerificationRequestSent = true;

        // Set a timeout to re-enable the button after 1 minute
        setTimeout(() => {
            isVerificationRequestSent = false;
        }, resendTimeout);

    } catch (error) {
        console.error("Error sending verification link:", error);
        showFeedback("Failed to send verification link. Try again.", "error");
    }
});


// Handle email verification completion
auth.onAuthStateChanged((user) => {
    if (user) {
        // Display current email and verification status
        const currentEmailElement = document.getElementById('current-email');
        const emailStatusElement = document.getElementById('email-status');

        currentEmailElement.textContent = user.email;
        emailStatusElement.textContent = user.emailVerified ? " (Verified)" : " (Not Verified)";
        emailStatusElement.style.color = user.emailVerified ? "green" : "red";

        // Check if there is a pending email in Firestore
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists && doc.data().pendingEmail) {
                const pendingEmail = doc.data().pendingEmail;
                document.getElementById("pending-email-wrapper").style.display = "block";
                document.getElementById("pending-email").textContent = pendingEmail;
            } else {
                document.getElementById("pending-email-wrapper").style.display = "none";
            }
        });
    }
});


// Option to remove the pending email (before verification)
const removePendingEmailButton = document.getElementById('remove-pending-email-button');
removePendingEmailButton.addEventListener('click', async () => {
    try {
        await db.collection('users').doc(auth.currentUser.uid).update({
            pendingEmail: firebase.firestore.FieldValue.delete()
        });

        showFeedback("Pending email removed successfully.", "success");

        // Hide the pending email wrapper
        pendingEmailWrapper.style.display = "none";
    } catch (error) {
        console.error("Error removing pending email:", error);
        showFeedback("Failed to remove pending email. Try again.", "error");
    }
});



    // ------------------------------------------------
// -------------- password change ------------------------
// ------------------------------------------------

// Assuming Firebase is already initialized in your app

// Function to show messages in the UI
function showMessage(message, isSuccess = true) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message; // Set the message
    messageBox.className = 'message-box'; // Reset the class
    messageBox.classList.add(isSuccess ? 'success' : 'error'); // Add success or error class
    messageBox.style.display = 'block'; // Make the message box visible
    setTimeout(() => {
        messageBox.style.display = 'none'; // Hide the message after 5 seconds
    }, 5000);
}

document.getElementById('change-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get the input values
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate form
    if (!oldPassword || !newPassword || !confirmPassword) {
        showMessage('Please fill in all fields.', false);
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('New passwords do not match.', false);
        return;
    }

    if (newPassword.length < 6) {
        showMessage('New password must be at least 6 characters long.', false);
        return;
    }

    const user = auth.currentUser; // Get the current logged-in user

    if (user) {
        // Create credentials for reauthentication using old password
        const credentials = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);

        try {
            // Reauthenticate the user with the old password
            await user.reauthenticateWithCredential(credentials);

            // Update the password after successful reauthentication
            await user.updatePassword(newPassword);
            showMessage('Password changed successfully!', true); // Show success message
            document.getElementById('change-password-form').reset();
        } catch (error) {
            // Handle error specifically for incorrect password
            if (error.code === 'auth/wrong-password') {
                showMessage('The old password you entered is incorrect.', false); // Show error message
            } else {
                console.error('Error updating password:', error);
                showMessage('Failed to update password. Please try again later.', false); // Show error message
            }
        }
    } else {
        showMessage('No user is currently logged in.', false); // Show error message
    }
});

// Password visibility toggle function
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(iconId);

    toggleIcon.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Toggle the icon between "eye" and "eye-slash"
        toggleIcon.classList.toggle('fa-eye');
        toggleIcon.classList.toggle('fa-eye-slash');
    });
}

togglePasswordVisibility('old-password', 'toggleOldPassword');
togglePasswordVisibility('new-password', 'toggleNewPassword');
togglePasswordVisibility('confirm-password', 'toggleConfirmPassword');



document.getElementById("forget-pass").addEventListener("click", () => {
    const user = auth.currentUser; // Get the currently logged-in user
  
    if (user) {
      auth.sendPasswordResetEmail(user.email)
        .then(() => {
          showMessage(`Password reset email sent to ${user.email}. Check your inbox.`, true);
          startCooldown(); // Start the cooldown timer
        })
        .catch((error) => {
          showMessage(`Failed to send reset email: ${error.message}`, false);
        });
    } else {
      showMessage("No user is currently logged in.", false);
    }
  });
  
  function startCooldown() {
    const forgetPassBtn = document.getElementById("forget-pass");
  
    const cooldownTime = 60; // 60 seconds cooldown
    const cooldownEnd = Date.now() + cooldownTime * 1000; // Calculate when cooldown ends
  
    localStorage.setItem("cooldownEnd", cooldownEnd); // Save cooldown end time in localStorage
  
    forgetPassBtn.disabled = true; // Disable the button
    updateButtonTimer(forgetPassBtn, cooldownEnd);
  }
  
  function updateButtonTimer(forgetPassBtn, cooldownEnd) {
    const interval = setInterval(() => {
      const remainingTime = Math.max(0, Math.round((cooldownEnd - Date.now()) / 1000)); // Calculate remaining time
  
      if (remainingTime > 0) {
        forgetPassBtn.textContent = `Wait ${remainingTime}s to resend reset link`; // Update button text with the timer
      } else {
        clearInterval(interval); // Stop the countdown
        forgetPassBtn.disabled = false; // Re-enable the button
        forgetPassBtn.textContent = "Forgot Password?"; // Reset button text
        localStorage.removeItem("cooldownEnd"); // Clear cooldown state
      }
    }, 1000); // Update every second
  }
  
  // Check cooldown on page load
  window.addEventListener("load", () => {
    const forgetPassBtn = document.getElementById("forget-pass");
  
    const cooldownEnd = localStorage.getItem("cooldownEnd");
    if (cooldownEnd && Date.now() < cooldownEnd) {
      forgetPassBtn.disabled = true;
      updateButtonTimer(forgetPassBtn, cooldownEnd);
    }
  });
  
