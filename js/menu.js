// ========================================
// ELEMENTS
// ========================================

const header = document.querySelector(".site-header");
const burgerBtn = document.getElementById("burger-btn");
const mainNav = document.getElementById("main-nav");


// ========================================
// HEADER SCROLL EFFECT
// ========================================

function updateHeader() {

    // If the user has scrolled more than 40px,
    // add the "scrolled" class to the header.

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);

updateHeader();


// ========================================
// MOBILE BURGER MENU
// ========================================

burgerBtn.addEventListener("click", () => {

    mainNav.classList.toggle("open");

    const isOpen = mainNav.classList.contains("open");

    burgerBtn.setAttribute("aria-expanded", isOpen);
});