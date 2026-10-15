const header = document.querySelector(".site-header");
const burgerBtn = document.getElementById("burger-btn");
const mainNav = document.getElementById("main-nav");

function updateHeader() {

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader);

updateHeader();

burgerBtn.addEventListener("click", () => {

    mainNav.classList.toggle("open");

    const isOpen = mainNav.classList.contains("open");

    burgerBtn.setAttribute("aria-expanded", isOpen);
});
