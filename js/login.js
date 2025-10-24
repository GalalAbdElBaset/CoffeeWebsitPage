"use strict";

// Change Mood
(function(){
const btn = document.getElementById('theme-toggle');
const body = document.body;
const icon = btn.querySelector('i');
const saved = localStorage.getItem('theme');


if (!saved || saved === 'light') {
    body.classList.add('light-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
    localStorage.setItem('theme', 'light');
} else {
    body.classList.remove('light-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
}

btn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');

    btn.classList.add('glow');
    setTimeout(() => btn.classList.remove('glow'), 420);

    icon.classList.remove(isLight ? 'fa-moon' : 'fa-sun');
    icon.classList.add(isLight ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
})();



// ====== Page elements = =====
const loginBtn = document.querySelector("#login-btn");
const signUpBtn = document.querySelector("#sign-up-btn");
const usernameIn = document.querySelector("#userid");
const emailIn = document.querySelector("#emailid");
const passwordIn = document.querySelector("#pswrd");

// ====== Create a popup window ======
const popupBox = document.createElement("div");
popupBox.id = "popup-box";
popupBox.innerHTML = `
<div class="popup-content">
    <div id="popup-icon"></div>
    <p id="popup-message"></p>
    <button id="popup-close">OK</button>
</div>
`;
document.body.appendChild(popupBox);

const popupMessage = document.querySelector("#popup-message");
const popupClose = document.querySelector("#popup-close");
const popupIcon = document.querySelector("#popup-icon");

// ====== Message Display Function ======
function showPopup(message, type = "success", callback = null) {
popupMessage.textContent = message;
popupBox.className = "active";
popupIcon.className = ""; 

if (type === "success") {
    popupIcon.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #4CAF50;"></i>';
} else if (type === "error") {
    popupIcon.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color: #f44336;"></i>';
} else if (type === "warning") {
    popupIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color: #ff9800;"></i>';
}

popupBox.classList.add("active");

const autoClose = setTimeout(() => {
    popupBox.classList.remove("active");
    if (callback) callback();
}, 3000);

popupClose.onclick = () => {
    clearTimeout(autoClose);
    popupBox.classList.remove("active");
    if (callback) callback();
};
}

// ====== Sign In ======
if (loginBtn) {
loginBtn.addEventListener("click", function () {
    const username = usernameIn.value.trim();
    const password = passwordIn.value.trim();

    if (username === "" || password === "") {
    showPopup("Please enter your username and password!", "warning");
    return;
    }

    let users = [];
    try {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (Array.isArray(storedUsers)) {
        users = storedUsers.filter(u => u && u.username && u.password);
    }
    } catch {}

    const foundUser = users.find(
    (user) => user.username === username && user.password === password
    );

    if (foundUser) {
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    showPopup(`Welcome back, ${foundUser.username}!`, "success", () => {
        window.location.href = "index.html";
    });
    } else {
    showPopup("Invalid username or password!", "error");
    }
});
}

// ====== Create a new account (Sign Up) ======
if (signUpBtn) {
signUpBtn.addEventListener("click", function () {
    const email = emailIn.value.trim();
    const username = usernameIn.value.trim();
    const password = passwordIn.value.trim();

    if (email === "" || username === "" || password === "") {
    showPopup("Please fill in all fields!", "warning");
    return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
    showPopup("Please enter a valid email address!", "warning");
    return;
    }

    let users = [];
    try {
    const storedUsers = JSON.parse(localStorage.getItem("users"));
    if (Array.isArray(storedUsers)) {
        users = storedUsers.filter(u => u && u.username && u.email && u.password);
    }
    } catch {}

    const userExists = users.some(
    (user) => user.username === username || user.email === email
    );

    if (userExists) {
    showPopup("This account already exists. Please log in.", "warning", () => {
        window.location.href = "sign-in.html";
    });
    return;
    }

    const newUser = { email, username, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    showPopup(`Account created successfully! Welcome, ${username}.`, "success", () => {
    window.location.href = "sign-in.html";
    });
});
}

// ====== Protection from reversing without registration ======
window.addEventListener("pageshow", (e) => {
if (
    e.persisted ||
    performance.getEntriesByType("navigation")[0].type === "back_forward"
) {
    if (!localStorage.getItem("currentUser")) {
    window.location.replace("sign-in.html");
    }
}
});

// ====== Show/Hide Password ======

const togglePassword = document.querySelector("#togglePassword");
const passwordField = document.querySelector("#pswrd");
if (togglePassword && passwordField) {
togglePassword.addEventListener("click", () => {
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
});
}
