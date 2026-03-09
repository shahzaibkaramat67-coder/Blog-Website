const toggle = document.querySelector(".toggle-password");
const password = document.getElementById("password");

toggle.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        toggle.src = "/assets/icons/eye-solid-full.svg";   // open eye
    } 
    else {
        password.type = "password";
        toggle.src = "/assets/icons/eye-slash-solid-full.svg"; // closed eye
    }

});