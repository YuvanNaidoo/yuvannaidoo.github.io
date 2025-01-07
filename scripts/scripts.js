document.addEventListener("DOMContentLoaded", () => {
    const particleBlock = document.getElementById("particleBlock");

    const bottomRightOffset = Math.random() * 20 - 40;

    const clipPathValue = `polygon(0 0, 100% 0, calc(100% + ${bottomRightOffset}%) 100%, 0 100%)`;

    particleBlock.style.clipPath = clipPathValue;
    particleBlock.style.webkitClipPath = clipPathValue;
});




