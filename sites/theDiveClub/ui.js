document.getElementById("show-signup").addEventListener("click", function() {
    document.getElementById("login-card").style.display = "none";
    document.getElementById("signup-card").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("signup-card").style.display = "none";
    document.getElementById("login-card").style.display = "block";
});