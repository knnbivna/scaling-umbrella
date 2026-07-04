// НАСТРОЙКА БАЗЫ ДАННЫХ SUPABASE
const SUPABASE_URL = "https://niludkworsvfssahlqdf.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_xOQG8jYYWPOtpfqFRqVh5Q_ySFL3nW_";

// 1. ПЕРЕКЛЮЧЕНИЕ КОЛИЧЕСТВА ГОСТЕЙ
function toggleGuestCount(show) {
    const block = document.getElementById('guest-count-block');
    if (block) {
        if (show) {
            block.style.display = 'block';
            document.getElementById('guest_count').value = 1;
        } else {
            block.style.display = 'none';
            document.getElementById('guest_count').value = 0;
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    
    // Привязываем функцию toggleGuestCount к радиокнопкам
    const rsvpForm = document.getElementById("rsvp-wedding-form");
    if (rsvpForm) {
        const radYes = rsvpForm.querySelector('input[value="Да"]');
        const radNo = rsvpForm.querySelector('input[value="Нет"]');
        if (radYes) radYes.addEventListener("click", () => toggleGuestCount(true));
        if (radNo) radNo.addEventListener("click", () => toggleGuestCount(false));
    }

    // 2. ТАЙМЕР ОТСЧЕТА
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

    // 3. МУЗЫКАЛЬНЫЙ БЛОК
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');

    if (musicBtn && music) {
        musicBtn.addEventListener('click', () => {
            if (music.paused) {
                music.play().catch(e => console.log("Музыка запустится после взаимодействия"));
                musicBtn.innerText = "⏸ Пауза";
            } else {
                music.pause();
                musicBtn.innerText = "🎵 Воспроизвести музыку";
            }
        });
    }

    // 4. ПЛАВНОЕ ПОЯВЛЕНИЕ БЛОКОВ ПРИ СКРОЛЛЕ
    const fadeBlocks = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeBlocks.forEach(block => observer.observe(block));

    // 5. ЛОГИКА ОТКРЫТИЯ КОНВЕРТА
    const openBtn = document.getElementById("open-envelope-btn");
    const envelope = document.querySelector(".envelope");
    const overlay = document.getElementById("envelope-overlay");

    if (openBtn && envelope && overlay) {
        openBtn.addEventListener("click", function () {
            envelope.classList.add("open");
            openBtn.style.opacity = "0";
            openBtn.style.pointerEvents = "none";

            if (music) {
                music.play().catch(err => console.log("Автоплей заблокирован браузером:", err));
                if (musicBtn) musicBtn.innerText = "⏸ Пауза";
            }

            setTimeout(() => {
                overlay.classList.add("hidden");
            }, 1500);
        });
    }

    // 6. ОТПРАВКА ФОРМЫ АНКЕТЫ В БАЗУ ДАННЫХ SUPABASE
    if (rsvpForm) {
        rsvpForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Запрещаем перезагрузку страницы

            const submitBtn = rsvpForm.querySelector(".btn-submit");
            const alertContainer = document.getElementById("form-alert-container");

            // Собираем данные из полей (убедись, что id в HTML совпадают)
            const formData = {
                name: document.getElementById("name").value.trim(),
                side: rsvpForm.querySelector('input[name="side"]:checked').value,
                attending: rsvpForm.querySelector('input[name="attending"]:checked').value,
                guest_count: parseInt(document.getElementById("guest_count").value) || 0,
                wishes: document.getElementById("wishes").value.trim()
            };

            // Визуальный отклик отправки
            submitBtn.innerText = "ОТПРАВКА...";
            submitBtn.disabled = true;

            // Делаем POST запрос к API Supabase
            fetch(`${SUPABASE_URL}/rest/v1/guests`, {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": `Bearer ${SUPABASE_KEY}`,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    if (alertContainer) {
                        alertContainer.innerHTML = "<div style='color: green; background: #e6f4ea; padding: 15px; margin-bottom: 20px; border-radius: 4px;'>✨ Ваша анкета успешно отправлена! Ждем вас!</div>";
                    } else {
                        alert('✨ Ваша анкета успешно отправлена! Ждем вас!');
                    }
                    rsvpForm.reset(); // Очищаем форму
                    toggleGuestCount(true); // Возвращаем блок гостей по умолчанию
                } else {
                    throw new Error("Ошибка сервера");
                }
            })
            .catch(error => {
                console.error("Ошибка отправки:", error);
                if (alertContainer) {
                    alertContainer.innerHTML = "<div style='color: red; background: #fce8e6; padding: 15px; margin-bottom: 20px; border-radius: 4px;'>❌ Не удалось отправить. Проверьте настройки БД.</div>";
                } else {
                    alert('❌ Не удалось отправить. Проверьте настройки БД.');
                }
            })
            .finally(() => {
                submitBtn.innerText = "ОТПРАВИТЬ / ЖӨНӨТҮҮ";
                submitBtn.disabled = false;
            });
        });
    }

    // 7. ЭФФЕКТ ОБЪЁМНЫХ ЖИВЫХ ЛЕПЕСТКОВ С ГРАДИЕНТОМ
    const leavesContainer = document.getElementById('leaves-container');

    function createLeaf() {
        if (!leavesContainer) return;
        
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        // Размер лепестков (от 15px до 28px)
        const size = Math.random() * 13 + 15; 
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.left = `${Math.random() * 100}%`;
        
        // Скорость падения (от 6 до 12 секунд) и покачивания
        const fallDuration = Math.random() * 6 + 6;
        leaf.style.animationDuration = `${fallDuration}s, ${Math.random() * 2 + 2}s`;
        
        // Задержка анимации
        leaf.style.animationDelay = `${Math.random() * 2}s`;

        // Случайный уникальный ID для градиента
        const gradId = `leafGrad-${Math.floor(Math.random() * 100000)}`;

        // Красивый SVG-лепесток с переливом цветов темы
        leaf.innerHTML = `
            <svg viewBox="0 0 24 24" style="width:100%; height:100%;">
                <defs>
                    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#1d3557" />
                        <stop offset="50%" stop-color="#457b9d" />
                        <stop offset="100%" stop-color="#a8dadc" />
                    </linearGradient>
                </defs>
                <path d="M12,2 C12,2 4,8 4,14 C4,19 8,22 12,22 C16,22 20,19 20,14 C20,8 12,2 12,2 Z" fill="url(#${gradId})"/>
            </svg>
        `;
        
        leavesContainer.appendChild(leaf);
        
        setTimeout(() => {
            leaf.remove();
        }, fallDuration * 1000);
    }

    // Создаем новые листочки
    setInterval(createLeaf, 800);
});
