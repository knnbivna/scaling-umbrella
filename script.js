document.addEventListener("DOMContentLoaded", function () {
    // 1. ТАЙМЕР ОТСЧЕТА
    const targetDate = new Date("August 12, 2026 15:30:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            document.getElementById("countdown").innerHTML = "<h3>Торжество началось! / Той башталды!</h3>";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 2. ГЕНЕРАЦИЯ ЛЕПЕСТКОВ
    const petalsContainer = document.getElementById("petals-container");
    if (petalsContainer) {
        for (let i = 0; i < 25; i++) {
            const petal = document.createElement("div");
            petal.classList.add("petal");
            petal.style.left = Math.random() * 100 + "vw";
            petal.style.animationDelay = Math.random() * 8 + "s";
            petal.style.animationDuration = Math.random() * 6 + 6 + "s";
            petalsContainer.appendChild(petal);
        }
    }

    // 3. ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ
    const fadeElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 4. МУЗЫКАЛЬНЫЙ ПЛЕЕР
    const music = document.getElementById("bg-music");
    const musicToggle = document.getElementById("music-toggle");

    if (musicToggle && music) {
        musicToggle.addEventListener("click", function () {
            if (music.paused) {
                music.play().then(() => {
                    musicToggle.innerText = "⏸ Pause Music";
                    musicToggle.classList.add("playing");
                }).catch(error => {
                    console.log("Ошибка воспроизведения аудио:", error);
                });
            } else {
                music.pause();
                musicToggle.innerText = "🎵 Play Music";
                musicToggle.classList.remove("playing");
            }
        });
    }
});
