const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Clear previous error messages
  clearErrors();

  // Validate inputs
  const errors = validateForm(name, emconst contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
  
    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
  
    // Clear previous error messages
    clearErrors();
  
    // Validate inputs
    const errors = validateForm(name, email, message);
    
    if (errors.length > 0) {
      // If there are validation errors, display them
      displayErrors(errors);
      return;
    }
  
    // Display a loading alert
    Swal.fire({
      title: 'Sending...',
      text: 'Please wait while we process your message.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    // Prepare the data to send
    const data = { name, email, message };
  
    // Send the data to the Netlify function (via a POST request)
    fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          // Handle server errors (e.g., 500, 404, etc.)
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Unknown server error');
          });
        }
        return response.json();
      })
      .then(result => {
        // Close the loading alert
        Swal.close();
  
        // Show success alert
        Swal.fire({
          title: 'Success!',
          text: 'Your message has been sent successfully.',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
      })
      .catch(error => {
        // Close the loading alert
        Swal.close();
  
        // Show error alert with detailed message from server or generic message
        Swal.fire({
          title: 'Error!',
          text: error.message || 'There was an issue sending your message. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Okay',
        });
      });
  });
  
  // Validate the form inputs
  function validateForm(name, email, message) {
    const errors = [];
  
    if (!name || name.trim() === "") {
      errors.push({ field: "name", message: "Name is required." });
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      errors.push({ field: "email", message: "Please enter a valid email address." });
    }
  
    if (!message || message.trim() === "") {
      errors.push({ field: "message", message: "Message cannot be empty." });
    }
  
    return errors;
  }
  
  // Display the error messages
  function displayErrors(errors) {
    errors.forEach(error => {
      const errorElement = document.querySelector(`#${error.field} + .error-message`);
      if (errorElement) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
      }
    });
  }
  
  // Clear any existing error messages
  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((errorMessage) => {
      errorMessage.textContent = "";
      errorMessage.style.display = 'none';
    });
  }
  ail, message);
  
  if (errors.length > 0) {
    // If there are validation errors, display them
    displayErrors(errors);
    return;
  }

  // Display a loading alert
  Swal.fire({
    title: 'Sending...',
    text: 'Please wait while we process your message.',
    icon: 'info',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  // Prepare the data to send
  const data = { name, email, message };

  // Send the data to the Netlify function (via a POST request)
  fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(result => {
      // Close the loading alert
      Swal.close();

      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Your message has been sent successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
      });
    })
    .catch(error => {
      // Close the loading alert
      Swal.close();

      // Show error alert
      Swal.fire({
        title: 'Error!',
        text: 'There was an issue sending your message. Please try again later.',
        icon: 'error',
        confirmButtonText: 'Okay',
      });
    });
});

// Validate the form inputs
function validateForm(name, email, message) {
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push({ field: "name", message: "Name is required." });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: "email", message: "Please enter a valid email address." });
  }

  if (!message || message.trim() === "") {
    errors.push({ field: "message", message: "Message cannot be empty." });
  }

  return errors;
}

// Display the error messages
function displayErrors(errors) {
  errors.forEach(error => {
    const errorElement = document.querySelector(`#${error.field} + .error-message`);
    if (errorElement) {
      errorElement.textContent = error.message;
      errorElement.style.display = 'block';
    }
  });
}

// Clear any existing error messages
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => {
    errorMessage.textContent = "";
    errorMessage.style.display = 'none';
  });
}
