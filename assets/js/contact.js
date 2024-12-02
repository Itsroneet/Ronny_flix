const form = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    let isValid = true;

    // Validate Name
    const name = document.getElementById('name');
    const nameError = name.nextElementSibling;
    if (name.value.trim() === '') {
        nameError.textContent = 'Name is required.';
        nameError.style.display = 'block';
        isValid = false;
    } else {
        nameError.style.display = 'none';
    }

    // Validate Email
    const email = document.getElementById('email');
    const emailError = email.nextElementSibling;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email.';
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Validate Message
    const message = document.getElementById('message');
    const messageError = message.nextElementSibling;
    if (message.value.trim() === '') {
        messageError.textContent = 'Message is required.';
        messageError.style.display = 'block';
        isValid = false;
    } else {
        messageError.style.display = 'none';
    }

    // If all fields are valid
    if (isValid) {
        // Collect data
        const toEmail = "recipient@example.com"; // Replace with recipient's email
        const subject = `New message from ${name.value}`;
        const body = `
            <p><strong>Name:</strong> ${name.value}</p>
            <p><strong>Email:</strong> ${email.value}</p>
            <p><strong>Message:</strong></p>
            <p>${message.value}</p>
        `;

        // Show loading alert
        Swal.fire({
            title: 'Under Maintaince',
            text: 'Please try again later.',
            icon: 'info',
            showConfirmButton: true,
        });

      }
});
