const sliders = document.querySelectorAll("[data-slider]");

sliders.forEach((slider) => {
  const slides = slider.querySelectorAll(".slide");
  const title = slider.querySelector(".slide-title");
  const nextBtn = slider.querySelector(".next-slide");
  const prevBtn = slider.querySelector(".prev-slide");

  const titles = ["LØSNING", "PROCES", "LÆRING"];
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
    title.textContent = titles[index];
  }

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
});