const svg = document.querySelector("svg.curved-line");

if (svg) {
  const path = svg.querySelector("path");

  const pathLength = path.getTotalLength();

  path.style.strokeDasharray = pathLength;
  path.style.strokeDashoffset = pathLength;

  const setSvgHeight = () => {
    svg.style.height = document.body.scrollHeight + "px";
  };

  const scroll = () => {
    setSvgHeight();

    const distance = window.scrollY;
    const totalDistance = document.documentElement.scrollHeight - window.innerHeight;

    const percentage = distance / totalDistance;

    path.style.strokeDashoffset = pathLength * (1 - percentage);
  };

  setSvgHeight();
  scroll();

  window.addEventListener("scroll", scroll);
  window.addEventListener("resize", scroll);
}
