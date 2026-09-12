const burgerBtn = document.querySelector("#burger-btn");
const nav = document.querySelector("header nav");

if (burgerBtn && nav) {
  burgerBtn.addEventListener("click", function () {
    nav.classList.toggle("active");
    burgerBtn.classList.toggle("active");
  });
}

const dropdownBtn = document.querySelector("#dropdown-btn");
const dropdownMenu = document.querySelector("#dropdown-menu");

if (dropdownBtn && dropdownMenu) {
  dropdownBtn.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });
}
