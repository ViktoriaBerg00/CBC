const countdownDate = new Date("2027-02-05T10:00:00+01:00").getTime();

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance <= 0) {
        daysElement.textContent = "0";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return false;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );
    const seconds = Math.floor(
        (distance % (1000 * 60)) /
        1000
    );

    daysElement.textContent = days;
    hoursElement.textContent = String(hours).padStart(2, "0");
    minutesElement.textContent = String(minutes).padStart(2, "0");
    secondsElement.textContent = String(seconds).padStart(2, "0");

    return true;
}

updateCountdown();

const countdownInterval = setInterval(() => {
    const isRunning = updateCountdown();

    if (!isRunning) {
        clearInterval(countdownInterval);
    }
}, 1000);