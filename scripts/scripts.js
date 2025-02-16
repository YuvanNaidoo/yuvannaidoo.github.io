document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        header.style.backgroundPositionY = `${scrollPosition * 0.5}px`; // Adjust the multiplier for desired parallax effect
    });
});




