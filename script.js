// --- ВАЖНО: Замените 'YOUR_IMGBB_API_KEY' на ваш реальный API Key от ImgBB ---
// Если вы не хотите использовать ImgBB, просто оставьте пустую строку.
const IMGBB_API_KEY = '6126df32bf922494dc6458dbecfd25df'; // <-- ЗАМЕНИТЕ НА ВАШ КЛЮЧ ИЛИ ОСТАВЬТЕ ПУСТЫМ

// --- Маппинг бейджей на классы ---
const badgeClassMap = {
    "kashed in": "badge-primary", // Обновите маппинг под ваши бейджи
    "kashmigo": "badge-purple",
    "kasher": "badge-orange",
    "kashmaxer": "badge-pink",
    "OG kasher": "badge-purple",
    "kashmaster": "badge-primary",
    "kashlord": "badge-purple",
    "kashking": "badge-primary"
    // Добавьте другие, если нужно
};

// --- Функция для получения выбранного аватара и логина ---
function getPassportData() {
    const avatarUrl = document.getElementById('avatar-preview').src;
    const username = document.getElementById('display-username').textContent;
    const selectedBadges = Array.from(document.querySelectorAll('.badge-checkbox:checked')).map(cb => cb.value);
    // Добавим получение выбранных стран
    const selectedCountries = Array.from(document.querySelectorAll('.country-checkbox:checked')).map(cb => cb.value);
    return { avatarUrl, username, selectedBadges, selectedCountries };
}

// --- Функция генерации HTML для паспорта ---
function generatePassportHTML(avatarUrl, username, badges, countries) { // Принимаем и страны
    console.log("Генерация паспорта. Data URL аватара:", avatarUrl); // Добавим лог
    let badgesHTML = '';
    badges.forEach(badgeText => {
        const className = badgeClassMap[badgeText] || "badge-primary"; // Если нет в мапе, используем primary
        // Создаём SVG-иконку (квадратик) с цветом #f6c847
        const svgIcon = `<svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#f6c847"/></svg>`;
        // Добавляем SVG-иконку перед текстом бейджа
        badgesHTML += `<div class="badge ${className}">${svgIcon} ${badgeText}</div>`;
    });

    // --- Генерируем HTML для флагов стран ---
    let countriesHTML = '';
    countries.forEach(countryName => {
        // Найдём SVG-иконку для страны (нужно сопоставить имя со страной)
        // Лучше всего это сделать через объект-маппер.
        // Определим маппер для стран (SVG-иконки можно хранить как строки)
        // ВАЖНО: Все SVG теперь имеют width="19", height="19", viewBox="0 0 19 19"
        // Внутренние элементы масштабированы пропорционально от исходного размера 24x24
        const countryFlagMap = {
            "Russia": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="19" height="6.33" fill="#ffffff"/><rect y="6.33" width="19" height="6.33" fill="#0039a6"/><rect y="12.66" width="19" height="6.33" fill="#d52b1e"/></svg>`,
            "United States": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="19" height="19" fill="#b22234"/><rect width="19" height="10.56" y="4.22" fill="#ffffff"/><rect width="19" height="1.41" y="4.22" fill="#3c3b6e"/><rect width="19" height="1.41" y="7.04" fill="#ffffff"/><rect width="19" height="1.41" y="9.86" fill="#3c3b6e"/><rect width="19" height="1.41" y="12.68" fill="#ffffff"/><rect width="19" height="1.41" y="15.5" fill="#3c3b6e"/><rect width="7.12" height="5.64" fill="#3c3b6e"/></svg>`, // Исправленный флаг США
            "China": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="19" height="19" fill="#de2910"/><path fill="#ffde00" d="M1.78 3.56L2.97 4.75l-.59.59L1.78 4.75l-.59-.59.59-.59zm1.19 0l.59 1.19h1.19l-.59-1.19h-1.19zm1.19 1.19l.59 1.19-.59.59-.59-.59.59-1.19zm1.19-1.19l.59 1.19h1.19l-.59-1.19h-1.19zm1.19 1.19l.59 1.19-.59.59-.59-.59.59-1.19z"/><path fill="#ffde00" d="M1.33 5.33l.59 1.19h1.19l-.59-1.19H1.33zm1.19 1.19l.59 1.19-.59.59-.59-.59.59-1.19z"/></svg>`,
            "Indonesia": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="19" height="9.5" fill="#ce1126"/><rect y="9.5" width="19" height="9.5" fill="#ffffff"/></svg>`,
            "Ukraine": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="19" height="9.5" fill="#0057b7"/><rect y="9.5" width="19" height="9.5" fill="#ffd700"/></svg>`,
            "Nigeria": `<svg class="generated-flag-icon" width="19" height="19" viewBox="0 0 19 19" xmlns="http://www.w3.org/2000/svg"><rect width="6.33" height="19" fill="#008751"/><rect x="6.33" width="6.33" height="19" fill="#ffffff"/><rect x="12.66" width="6.33" height="19" fill="#008751"/></svg>`
            // Добавьте другие страны по аналогии, убедившись, что width=19, height=19, viewBox="0 0 19 19", и внутренние элементы масштабированы
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
    // --- /Генерируем HTML для флагов стран ---

    // --- Возвращаем НОВУЮ HTML-структуру ---
    return `
        <!-- Новый контейнер для двух аватаров -->
        <div class="avatars-container">
            <!-- Первый аватар (область 1) -->
            <div class="avatar-wrapper">
                <div class="card-background">
                    <img src="${avatarUrl}" alt="Avatar Preview" class="avatar-img">
                </div>
            </div>
            <!-- Второй аватар (область 2) -->
            <div class="avatar-wrapper">
                <div class="card-background">
                    <img src="second-avatar.png" alt="Second Avatar" class="avatar-img">
                </div>
            </div>
        </div>
        <!-- /avatars-container -->

        <!-- Правая часть: Текст и логотип -->
        <div class="text-content">
         
            <div class="display-username">${username} <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#4CAF50"><path d="M14 5.5L6 13.5L2 9.5l1.414-1.414L6 10.67l7.586-7.586L14 5.5z"/></svg></div>
            <div class="badges-row">
                ${badgesHTML}
            </div>
            <div class="countries-row">
                ${countriesHTML}
            </div>
            <!-- Перемещаем .activity-description в самый низ .text-content -->
            <div class="activity-description">
                Achievement card on the Kash Bot server 🌀
            </div>
        </div>
    `;
    // --- /Возвращаем НОВУЮ HTML-структуру ---
}

// --- Обработчик кнопки "Создать" ---
document.getElementById('generate-btn').addEventListener('click', function() {
    const { avatarUrl, username, selectedBadges, selectedCountries } = getPassportData(); // Получаем и страны
    if (selectedBadges.length === 0) {
        alert('Please select at least one badge.');
        return;
    }
    // Передаём selectedCountries в generatePassportHTML
    const generatedHTML = generatePassportHTML(avatarUrl, username, selectedBadges, selectedCountries); // Передаём и страны
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

// --- Обработчик кнопки "Скачать как PNG" (ОБНОВЛЁННЫЙ) ---
document.getElementById('download-btn').addEventListener('click', async function() { // Добавлен async
    const generatedPassportElement = document.getElementById('generated-passport');
    const generatedAvatarImg = generatedPassportElement.querySelector('.avatar-img');

    if (!generatedAvatarImg) {
        console.error("html2canvas: Не найден элемент аватара (.avatar-img) в #generated-passport.");
        return;
    }

    // Проверяем, что src - это Data URL или локальный путь
    const generatedAvatarSrc = generatedAvatarImg.src;
    console.log("Скачивание. Data URL аватара в сгенерированном элементе:", generatedAvatarSrc);

    if (generatedAvatarSrc.startsWith('image')) { // Проверяем Data URL
        console.log("html2canvas: src аватара является Data URL, ожидаем его загрузку.");
        // Создаём промис, который разрешится, когда изображение загрузится
        const imageLoadPromise = new Promise((resolve, reject) => {
            generatedAvatarImg.onload = resolve;
            generatedAvatarImg.onerror = () => reject(new Error('Failed to load avatar image for canvas'));
            // Если изображение уже загружено, onload не сработает. Проверим.
            if (generatedAvatarImg.complete && generatedAvatarImg.naturalHeight !== 0) {
                 // Уже загружено, разрешаем промис
                 resolve();
            }
        });

        try {
            // Ждём загрузки изображения
            await imageLoadPromise;
            console.log("html2canvas: Изображение аватара загружено, запускаем html2canvas.");
        } catch (error) {
            console.error("html2canvas: Ошибка загрузки аватара:", error);
            return; // Не продолжаем, если аватар не загрузился
        }
    } else {
        console.warn("html2canvas: src аватара не является Data URL. Это может повлиять на отображение в PNG в зависимости от политики CORS.", generatedAvatarSrc);
        // В этом случае мы полагаемся на html2canvas, но ошибка CORS может всё равно возникнуть.
    }

    // Теперь вызываем html2canvas, зная, что изображение загружено (если это Data URL)
    html2canvas(generatedPassportElement, {
        backgroundColor: '#121212', // Установить фон для холста (ваш фоновый цвет)
        scale: 2, // Повысить качество (по умолчанию 1)
        allowTaint: true, // Позволить "загрязнение" (может помочь с изображениями)
        useCORS: true,   // Использовать CORS (не поможет с Data URL, но на всякий случай)
        logging: true, // Включить логгирование html2canvas (для отладки)
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
