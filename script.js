function toggleGuestCount(show) {
    const block = document.getElementById('guest-count-block');
    if (show) {
        block.style.display = 'block';
    } else {
        block.style.display = 'none';
        document.getElementById('guest_count').value = 0;
    }
}

const weddingDate = new Date("Aug 12, 2026 15:00:00").getTime();

const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown").innerHTML = "<h3>День свадьбы настал!</h3>";
    }
}, 1000);

const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-toggle');

musicBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play().catch(e => console.log("Музыка запустится после взаимодействия"));
        musicBtn.innerText = "Пауза";
    } else {
        music.pause();
        musicBtn.innerText = "Воспроизвести музыку";
    }
});

const fadeBlocks = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeBlocks.forEach(block => observer.observe(block));