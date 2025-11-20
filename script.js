// --- ВАЖНО: Замените 'YOUR_IMGBB_API_KEY' на ваш реальный API Key от ImgBB ---
// Если вы не хотите использовать ImgBB, просто оставьте пустую строку.
const IMGBB_API_KEY = 'ad61a98d4f9c86037cadf72d08171c20'; // <-- ЗАМЕНИТЕ НА ВАШ КЛЮЧ ИЛИ ОСТАВЬТЕ ПУСТЫМ

// --- Маппинг бейджей на классы ---
const badgeClassMap = {
    "CONTENT CREATOR": "badge-primary",
    "SHREDDED": "badge-purple",
    "Rice": "badge-orange",
    "Noob": "badge-pink",
    "VIP": "badge-purple" // Пример: можно добавить другие
};

// --- Функция для получения выбранного аватара, логина и выбранных элементов ---
function getPassportData() {
    const avatarUrl = document.getElementById('avatar-preview').src;
    const username = document.getElementById('display-username').textContent;
    const selectedBadges = Array.from(document.querySelectorAll('.badge-checkbox:checked')).map(cb => cb.value);
    // --- НОВОЕ: Получаем выбранные страны ---
    const selectedCountries = Array.from(document.querySelectorAll('.country-checkbox:checked')).map(cb => cb.value);
    // --- /НОВОЕ ---
    return { avatarUrl, username, selectedBadges, selectedCountries }; // Возвращаем и страны тоже
}

// --- Функция генерации HTML для паспорта ---
function generatePassportHTML(avatarUrl, username, badges, countries) { // Принимаем и страны
    console.log("Генерация паспорта. Data URL аватара:", avatarUrl);
    let badgesHTML = '';
    badges.forEach(badgeText => {
        const className = badgeClassMap[badgeText] || "badge-primary";
        badgesHTML += `<div class="badge ${className}">${badgeText}</div>`;
    });

    // --- НОВОЕ: Генерируем HTML для флагов стран ---
    let countriesHTML = '';
    countries.forEach(countryName => {
        // Найдём SVG-иконку для страны (нужно будет сопоставить имя со страной)
        // Здесь нужно сопоставить имя страны (например, "Russia") с её SVG-кодом
        // Лучше всего это сделать через объект-маппер.
        // Определим маппер для стран (SVG-иконки можно хранить как строки)
        const countryFlagMap = {
            "Russia": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="8" fill="#ffffff"/><rect y="8" width="24" height="8" fill="#0039a6"/><rect y="16" width="24" height="8" fill="#d52b1e"/></svg>`,
            "United States": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#012169"/><path fill="#ffffff" d="M0 0l12 12L24 0h-6V24H6V0H0z"/><path fill="#ffffff" d="M0 12l12-12v24L0 12z"/><path fill="#c8102e" d="M0 8l8 4v4L0 16V8z"/><path fill="#c8102e" d="M16 8v8l8-4V8h-8z"/><path fill="#c8102e" d="M8 0h8v8H8V0z"/><path fill="#c8102e" d="M8 16h8v8H8v-8z"/></svg>`,
            "China": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" fill="#de2910"/><path fill="#ffde00" d="M2.25 4.5L3.75 6l-.75.75L2.25 6l-.75-.75L2.25 4.5zm1.5 0l.75 1.5h1.5l-.75-1.5h-1.5zm1.5 1.5l.75 1.5-.75.75-.75-.75.75-1.5z"/><path fill="#ffde00" d="M1.5 6.75l.75 1.5h1.5l-.75-1.5h-1.5zm1.5 1.5l.75 1.5-.75.75-.75-.75.75-1.5z"/></svg>`,
            "Indonesia": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="12" fill="#ce1126"/><rect y="12" width="24" height="12" fill="#ffffff"/></svg>`,
            "Ukraine": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="12" fill="#0057b7"/><rect y="12" width="24" height="12" fill="#ffd700"/></svg>`,
            "Nigeria": `<svg class="generated-flag-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="8" height="24" fill="#008751"/><rect x="8" width="8" height="24" fill="#ffffff"/><rect x="16" width="8" height="24" fill="#008751"/></svg>`
            // Добавьте другие страны по аналогии
        };

        const flagSVG = countryFlagMap[countryName];
        if (flagSVG) {
            // Создаём контейнер для флага и названия, аналогично бейджу
            countriesHTML += `<div class="generated-country-flag">${flagSVG} <span class="country-name">${countryName}</span></div>`;
        } else {
            // На случай, если SVG для страны не найден, можно вывести просто название
            console.warn(`SVG для флага страны "${countryName}" не найден.`);
            countriesHTML += `<div class="generated-country-flag">[Флаг ${countryName}]</div>`;
        }
    });
    // --- /НОВОЕ ---

    // Вставляем и badges, и countries в HTML
    return `
        <div class="card-background">
            <img src="${avatarUrl}" alt="Avatar Preview" class="avatar-img">
        </div>
        <div class="display-username">${username}</div>
        <div class="badges-row">
            ${badgesHTML}
        </div>
        <!-- Новый контейнер для флагов стран -->
        <div class="countries-row">
            ${countriesHTML}
        </div>
        <div class="activity-description">
            Crafting pixels, pumping vibes, farming retweets 🌀
        </div>
    `;
}

// --- Обработчик кнопки "Создать" ---
document.getElementById('generate-btn').addEventListener('click', function() {
    const { avatarUrl, username, selectedBadges, selectedCountries } = getPassportData(); // Получаем и страны
    if (selectedBadges.length === 0) {
        alert('Please select at least one badge.');
        return;
    }
    // Передаём selectedCountries в generatePassportHTML
    const generatedHTML = generatePassportHTML(avatarUrl, username, selectedBadges, selectedCountries);
    const generatedPassportElement = document.getElementById('generated-passport');
    generatedPassportElement.innerHTML = generatedHTML;
    // Показать сгенерированную секцию, скрыть редактор
    document.getElementById('editor-section').style.display = 'none';
    document.getElementById('generated-section').style.display = 'block';
});

// --- Обработчик кнопки "Назад" ---
document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('generated-section').style.display = 'none';
    document.getElementById('editor-section').style.display = 'block';
});

// --- Обработчик кнопки "Скачать как PNG" ---
document.getElementById('download-btn').addEventListener('click', function() {
    const generatedPassportElement = document.getElementById('generated-passport');
    // Получаем Data URL из сгенерированного элемента (для уверенности)
    const generatedAvatarImg = generatedPassportElement.querySelector('.avatar-img');
    const generatedAvatarSrc = generatedAvatarImg ? generatedAvatarImg.src : null;
    console.log("Скачивание. Data URL аватара в сгенерированном элементе:", generatedAvatarSrc); // Добавим лог
    // Проверяем, что src - это Data URL
    if (generatedAvatarSrc && generatedAvatarSrc.startsWith('image')) {
        console.log("html2canvas: src аватара является Data URL, всё ок.");
    } else {
        console.error("html2canvas: src аватара НЕ является Data URL! Это может быть проблемой.", generatedAvatarSrc);
    }
    html2canvas(generatedPassportElement, {
        backgroundColor: '#121212', // Установить фон для холста
        scale: 2, // Повысить качество (по умолчанию 1)
        // Попробуем отключить z-index в превью, если он мешает
        // logging: true, // Включить логгирование html2canvas (для отладки)
        // allowTaint: true, // Позволить "загрязнение" (может помочь с изображениями)
        // useCORS: true,   // Использовать CORS (не поможет с Data URL, но на всякий случай)
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-discord-passport.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error("Ошибка при создании canvas:", err);
    });
});

// --- Обработчик кнопки "Поделиться в Twitter" ---
document.getElementById('twitter-btn').addEventListener('click', function() {
    // Для простоты, отправляем текстовый твит.
    // Загрузка изображения в твит требует серверного кода или сложных клиентских API.
    const { username } = getPassportData();
    const tweetText = encodeURIComponent(`Check out my new Discord Passport! @${username} #Discord #Passport`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
});

// --- Обработчик загрузки аватара (обновлённый) ---
document.getElementById('avatar-upload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const statusElement = document.getElementById('upload-status');
    statusElement.textContent = 'Uploading...';
    statusElement.className = ''; // Сброс классов
    if (!file.type.match('image.*')) {
        statusElement.textContent = 'Please select an image.';
        statusElement.className = 'error';
        return;
    }
    if (file.size > 16 * 1024 * 1024) {
        statusElement.textContent = 'File is too large. Maximum 16 MB.';
        statusElement.className = 'error';
        return;
    }
    // --- НОВАЯ ЛОГИКА: Преобразование в Data URL ---
    const reader = new FileReader();
    reader.onload = async function(readerEvent) {
        // 1. Устанавливаем Data URL в src аватара для немедленного отображения и html2canvas
        const dataUrl = readerEvent.target.result;
        console.log("Загрузка аватара. Получен Data URL:", dataUrl.substring(0, 50) + "..."); // Лог первых 50 символов
        document.getElementById('avatar-preview').src = dataUrl;
        // 2. Сохраняем Data URL в localStorage
        localStorage.setItem('userAvatarDataUrl', dataUrl);
        // 3. Пытаемся загрузить файл на ImgBB (только если API Key задан)
        if (IMGBB_API_KEY) {
            const formData = new FormData();
            formData.append('image', file); // Отправляем оригинальный файл
            formData.append('key', IMGBB_API_KEY);
            try {
                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                if (result.success && result.data && result.data.url) {
                    const imageUrl = result.data.url;
                    console.log('Image successfully uploaded to ImgBB:', imageUrl);
                    // Заменяем Data URL на URL от ImgBB (опционально, но позволяет использовать постоянную ссылку)
                    document.getElementById('avatar-preview').src = imageUrl;
                    // Сохраняем URL от ImgBB в localStorage
                    localStorage.setItem('userAvatarUrl', imageUrl);
                    statusElement.textContent = 'Uploaded to ImgBB!';
                    statusElement.className = 'success';
                } else {
                    console.error('ImgBB API Error:', result);
                    statusElement.textContent = `Upload to ImgBB failed: ${result.error?.message || 'Unknown error'}`;
                    statusElement.className = 'error';
                    // Если загрузка на ImgBB не удалась, остаёмся с Data URL
                    // (который уже установлен и сохранён в localStorage)
                }
            } catch (error) {
                console.error('Network error during ImgBB upload:', error);
                statusElement.textContent = `Network error during ImgBB upload: ${error.message}`;
                statusElement.className = 'error';
                // Если загрузка на ImgBB не удалась, остаёмся с Data URL
                // (который уже установлен и сохранён в localStorage)
            }
        } else {
            // Если API Key не задан, просто используем Data URL
            statusElement.textContent = 'Avatar loaded locally (Data URL).';
            statusElement.className = 'success';
        }
    };
    reader.onerror = function() {
        console.error('Error reading file.');
        statusElement.textContent = 'Error reading file.';
        statusElement.className = 'error';
    };
    reader.readAsDataURL(file); // Начинаем чтение файла как Data URL
});

// --- Обработчик ввода логина ---
document.getElementById('username-input').addEventListener('input', function(event) {
    const username = event.target.value;
    document.getElementById('display-username').textContent = username || 'Your Username';
    localStorage.setItem('userUsername', username);
});

// --- УДАЛЕНО: Восстановление данных при загрузке страницы ---
// document.addEventListener('DOMContentLoaded', function() {
//     const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
//     const savedAvatarDataUrl = localStorage.getItem('userAvatarDataUrl');
//
//     if (savedAvatarUrl) {
//         document.getElementById('avatar-preview').src = savedAvatarUrl;
//         console.log('Avatar restored from ImgBB URL.');
//     } else if (savedAvatarDataUrl) {
//         document.getElementById('avatar-preview').src = savedAvatarDataUrl;
//         console.log('Avatar restored from Data URL.');
//     }
//
//     const savedUsername = localStorage.getItem('userUsername');
//     if (savedUsername) {
//         document.getElementById('username-input').value = savedUsername;
//         document.getElementById('display-username').textContent = savedUsername;
//     }
// });

// --- УДАЛЕНО: Обработчик выбора языка ---
// document.querySelectorAll('.lang-option').forEach(option => {
//     option.addEventListener('click', function() {
//         const lang = this.getAttribute('data-lang');
//         console.log(`Language selected: ${lang}`);
//         // Здесь можно добавить логику переключения языка интерфейса
//         // Пока просто выводим в консоль
//     });
// });
