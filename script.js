// --- ВАЖНО: Замените 'YOUR_IMGBB_API_KEY' на ваш реальный API Key от ImgBB ---
const IMGBB_API_KEY = 'ad61a98d4f9c86037cadf72d08171c20'; // <-- ЗАМЕНИТЕ НА ВАШ КЛЮЧ ИЛИ ОСТАВЬТЕ ПУСТЫМ

// --- Маппинг бейджей на классы ---
const badgeClassMap = {
    "CONTENT CREATOR": "badge-primary",
    "SHREDDED": "badge-purple",
    "Rice": "badge-orange",
    "Noob": "badge-pink",
    "VIP": "badge-purple"
};

// --- Функция для получения выбранного аватара и логина ---
function getPassportData() {
    const avatarUrl = document.getElementById('avatar-preview').src;
    const username = document.getElementById('display-username').textContent;
    const selectedBadges = Array.from(document.querySelectorAll('.badge-checkbox:checked')).map(cb => cb.value);
    return { avatarUrl, username, selectedBadges };
}

// --- Функция генерации HTML для паспорта ---
function generatePassportHTML(avatarUrl, username, badges) {
    let badgesHTML = '';
    badges.forEach(badgeText => {
        const className = badgeClassMap[badgeText] || "badge-primary";
        badgesHTML += `<div class="badge ${className}">${badgeText}</div>`;
    });

    return `
        <div class="card-background-simple"> <!-- Используем простой фон -->
            <img src="${avatarUrl}" alt="Avatar Preview" class="avatar-img-simple"> <!-- Используем простой стиль -->
        </div>
        <div class="display-username">${username}</div>
        <div class="badges-row">
            ${badgesHTML}
        </div>
        <div class="activity-description">
            Crafting pixels, pumping vibes, farming retweets 🌀
        </div>
    `;
}

// --- Обработчик кнопки "Создать" ---
document.getElementById('generate-btn').addEventListener('click', function() {
    const { avatarUrl, username, selectedBadges } = getPassportData();

    if (selectedBadges.length === 0) {
        alert('Пожалуйста, выберите хотя бы один бейдж.');
        return;
    }

    const generatedHTML = generatePassportHTML(avatarUrl, username, selectedBadges);
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

    // Временно заменяем сложные стили на простые для html2canvas
    const originalCardBackground = generatedPassportElement.querySelector('.card-background-simple');
    const originalAvatarImg = generatedPassportElement.querySelector('.avatar-img-simple');

    if (originalCardBackground && originalAvatarImg) {
        // Сохраняем оригинальные стили
        const originalBackgroundStyle = originalCardBackground.style.cssText;
        const originalAvatarStyle = originalAvatarImg.style.cssText;

        // Применяем простые стили
        originalCardBackground.style.cssText = `
            width: 180px;
            height: 180px;
            margin: 0 auto 20px;
            background: #555; /* Простой серый фон */
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 0;
            overflow: hidden;
        `;

        originalAvatarImg.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 0;
            object-fit: cover;
            border: 0; /* Без рамки */
            box-shadow: none; /* Без тени */
        `;

        // Генерируем canvas
        html2canvas(generatedPassportElement, {
            backgroundColor: '#121212',
            scale: 2,
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'my-discord-passport.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Восстанавливаем оригинальные стили
            originalCardBackground.style.cssText = originalBackgroundStyle;
            originalAvatarImg.style.cssText = originalAvatarStyle;

        }).catch(err => {
            console.error("Ошибка при создании canvas:", err);

            // Восстанавливаем стили даже в случае ошибки
            originalCardBackground.style.cssText = originalBackgroundStyle;
            originalAvatarImg.style.cssText = originalAvatarStyle;
        });
    }
});

// --- Обработчик кнопки "Поделиться в Twitter" ---
document.getElementById('twitter-btn').addEventListener('click', function() {
    const { username } = getPassportData();
    const tweetText = encodeURIComponent(`Проверь мой новый Discord Passport! @${username} #Discord #Passport`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
});

// --- Обработчик загрузки аватара (обновлённый) ---
document.getElementById('avatar-upload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusElement = document.getElementById('upload-status');
    statusElement.textContent = 'Загрузка...';
    statusElement.className = '';

    if (!file.type.match('image.*')) {
        statusElement.textContent = 'Пожалуйста, выберите изображение.';
        statusElement.className = 'error';
        return;
    }

    if (file.size > 16 * 1024 * 1024) {
        statusElement.textContent = 'Файл слишком большой. Максимум 16 МБ.';
        statusElement.className = 'error';
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(readerEvent) {
        const dataUrl = readerEvent.target.result;
        document.getElementById('avatar-preview').src = dataUrl;
        localStorage.setItem('userAvatarDataUrl', dataUrl);

        if (IMGBB_API_KEY) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', IMGBB_API_KEY);

            try {
                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.success && result.data && result.data.url) {
                    const imageUrl = result.data.url;
                    document.getElementById('avatar-preview').src = imageUrl;
                    localStorage.setItem('userAvatarUrl', imageUrl);
                    statusElement.textContent = 'Загружено на ImgBB!';
                    statusElement.className = 'success';
                } else {
                    console.error('Ошибка от ImgBB API:', result);
                    statusElement.textContent = `Ошибка загрузки на ImgBB: ${result.error?.message || 'Неизвестная ошибка'}`;
                    statusElement.className = 'error';
                }
            } catch (error) {
                console.error('Ошибка при запросе к ImgBB API:', error);
                statusElement.textContent = `Ошибка сети при загрузке на ImgBB: ${error.message}`;
                statusElement.className = 'error';
            }
        } else {
            statusElement.textContent = 'Аватар загружен локально (Data URL).';
            statusElement.className = 'success';
        }
    };
    reader.onerror = function() {
        console.error('Ошибка при чтении файла.');
        statusElement.textContent = 'Ошибка при чтении файла.';
        statusElement.className = 'error';
    };
    reader.readAsDataURL(file);
});

// --- Восстановление данных при загрузке страницы ---
document.addEventListener('DOMContentLoaded', function() {
    const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
    const savedAvatarDataUrl = localStorage.getItem('userAvatarDataUrl');

    if (savedAvatarUrl) {
        document.getElementById('avatar-preview').src = savedAvatarUrl;
    } else if (savedAvatarDataUrl) {
        document.getElementById('avatar-preview').src = savedAvatarDataUrl;
    }

    const savedUsername = localStorage.getItem('userUsername');
    if (savedUsername) {
        document.getElementById('username-input').value = savedUsername;
        document.getElementById('display-username').textContent = savedUsername;
    }
});

// --- Обработчик ввода логина ---
document.getElementById('username-input').addEventListener('input', function(event) {
    const username = event.target.value;
    document.getElementById('display-username').textContent = username || 'Ваш Логин';
    localStorage.setItem('userUsername', username);
});
