// form change login /signup / forgot

let login_area = document.querySelector(".login-area")
let signup_area = document.querySelector(".signup-area")
let forgot_area = document.querySelector(".forgot-area")
let signupform = document.querySelector("#signup-form")
let loginform = document.querySelector("#login-form")
let forgotfrom = document.querySelector("#forgot-from")
let toptitlepc = document.querySelector("#top-title-pc")
let error_msg = document.querySelector(".error-msg")
let success_msg = document.querySelector(".success-msg")

document.addEventListener("DOMContentLoaded", () => {
    const currentView = localStorage.getItem("currentView") || "login";
    if (currentView === "signup") {
        showsignup();
    } else if (currentView === "forgot") {
        showforgot();
    } else {
        showlogin();
    }
});

function showsignup() {
    document.title = "RMDB - Signup";
    login_area.style.display = "none";
    signup_area.style.display = "block";
    loginform.reset();
    error_msg.innerHTML = ``;
    success_msg.innerHTML = ``;
    toptitlepc.innerHTML = `Signup`;
    localStorage.setItem("currentView", "signup");
}

function showlogin() {
    document.title = "RMDB - Login";
    login_area.style.display = "block";
    signup_area.style.display = "none";
    error_msg.innerHTML = ``;
    success_msg.innerHTML = ``;
    signupform.reset();
    toptitlepc.innerHTML = `Login`;
    localStorage.setItem("currentView", "login");
}

function showforgot() {
    document.title = "RMDB - Forgot password";
    login_area.style.display = "none";
    forgot_area.style.display = "block";
    error_msg.innerHTML = ``;
    success_msg.innerHTML = ``;
    loginform.reset();
    toptitlepc.innerHTML = `Forgot password`;
    localStorage.setItem("currentView", "forgot");
}

function backtologin() {
    document.title = "RMDB - Login";
    login_area.style.display = "block";
    forgot_area.style.display = "none";
    error_msg.innerHTML = ``;
    success_msg.innerHTML = ``;
    forgotfrom.reset();
    toptitlepc.innerHTML = `Login`;
    localStorage.setItem("currentView", "login");
}


//---------------form submit----------------

loginform.addEventListener('submit', e => {
    e.preventDefault();

    error_msg.innerHTML = ``
    success_msg.innerHTML = ``

    let login_email = document.getElementById("login-email")
    let login_password = document.getElementById("login-password")

    if (login_email.value == "") {
        error_msg.innerHTML = `email cannot be empty`
    }
    else if (login_password.value == "") {
        error_msg.innerHTML = `password cannot be empty`

    }
    else {
        showloading();
        setTimeout(() => {
            hideloading();
            error_msg.innerHTML = `Invalid Email or password`
            login_password.value=""
        }, 1200);
    }
})



signupform.addEventListener('submit', e => {
    let fullname = document.getElementById("fullname")
    let reg_email = document.getElementById("reg-email")
    let reg_password = document.getElementById("reg-password")
    let c_password = document.getElementById("c-password")
    e.preventDefault();
    error_msg.innerHTML = ``
    success_msg.innerHTML = ``

    if (fullname.value.length < 6) {
        error_msg.innerHTML = ` Name is too short`
    }
    else if (reg_password.value.length < 5) {
        error_msg.innerHTML = `password must have more than 5 characters`

    } else if (c_password.value !== reg_password.value) {
        error_msg.innerHTML = `password doesn't match`

    }
    else {
        showloading();
        setTimeout(() => {
            hideloading();
            error_msg.innerHTML = `something wents wrong !!`
        }, 1200);
    }
});


forgotfrom.addEventListener("submit", e => {
    e.preventDefault();

    error_msg.innerHTML = ``
    success_msg.innerHTML = ``

    let forgotemail = document.getElementById("forgot-email")
    if (forgotemail.value == "") {
        error_msg.innerHTML = `email cannot be empty`
    }
    else {
        showloading();
        error_msg.innerHTML = ``
        setTimeout(() => {
            hideloading();
            error_msg.innerHTML = `Account not found`
            forgotfrom.reset();
        }, 800);
    }


})

// ---------loading----------
let loading = document.querySelector(".loading-spinner")

function showloading() {
    loading.style.display = "block"
}
function hideloading() {
    loading.style.display = "none"
}


//---------password toggle----------

function togglePasswordVisibility(passwordFieldId, toggleIconId) {
    const passwordField = document.getElementById(passwordFieldId);
    const toggleIcon = document.getElementById(toggleIconId);
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;

    // Toggle the eye / eye-slash icon
    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
  }