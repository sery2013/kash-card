// --- ВАЖНО: Замените 'YOUR_IMGBB_API_KEY' на ваш реальный API Key от ImgBB ---
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

// --- Маппинг бейджей на классы ---
const badgeClassMap = {
    "CONTENT CREATOR": "badge-primary",
    "SHREDDED": "badge-purple",
    "Rice": "badge-orange",
    "Noob": "badge-pink",
    "VIP": "badge-purple" // Пример: можно добавить другие
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
        const className = badgeClassMap[badgeText] || "badge-primary"; // Если нет в мапе, используем primary
        badgesHTML += `<div class="badge ${className}">${badgeText}</div>`;
    });

    return `
        <div class="card-background">
            <img src="${avatarUrl}" alt="Avatar Preview" class="avatar-img">
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

    html2canvas(generatedPassportElement, {
        backgroundColor: '#121212', // Установить фон для холста
        scale: 2 // Повысить качество (по умолчанию 1)
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'my-discord-passport.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// --- Обработчик кнопки "Поделиться в Twitter" ---
document.getElementById('twitter-btn').addEventListener('click', function() {
    // const generatedPassportElement = document.getElementById('generated-passport');
    // html2canvas(generatedPassportElement, { backgroundColor: '#121212', scale: 1 }).then(canvas => {
    //     canvas.toBlob(blob => {
    //         const file = new File([blob], "passport.png", { type: "image/png" });
    //         const formData = new FormData();
    //         formData.append('file', file);
    //         // Загрузка на ImgBB для получения URL...
    //         // Слишком сложно для клиентского шара.
    //     });
    // });

    // --- Проще: просто текстовый твит ---
    const { username } = getPassportData();
    const tweetText = encodeURIComponent(`Проверь мой новый Discord Passport! @${username} #Discord #Passport`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterUrl, '_blank');
});

// --- Код загрузки аватара и восстановления данных (остается без изменений) ---

document.getElementById('avatar-upload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusElement = document.getElementById('upload-status');
    statusElement.textContent = 'Загрузка...';
    statusElement.className = ''; // Сброс классов

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
            console.log('Изображение успешно загружено на ImgBB:', imageUrl);

            document.getElementById('avatar-preview').src = imageUrl;
            localStorage.setItem('userAvatarUrl', imageUrl);

            statusElement.textContent = 'Загружено!';
            statusElement.className = 'success';
        } else {
            console.error('Ошибка от ImgBB API:', result);
            statusElement.textContent = `Ошибка загрузки: ${result.error?.message || 'Неизвестная ошибка'}`;
            statusElement.className = 'error';
        }
    } catch (error) {
        console.error('Ошибка при запросе к API:', error);
        statusElement.textContent = `Ошибка сети: ${error.message}`;
        statusElement.className = 'error';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
    if (savedAvatarUrl) {
        document.getElementById('avatar-preview').src = savedAvatarUrl;
    }

    const savedUsername = localStorage.getItem('userUsername');
    if (savedUsername) {
        document.getElementById('username-input').value = savedUsername;
        document.getElementById('display-username').textContent = savedUsername;
    }
});

document.getElementById('username-input').addEventListener('input', function(event) {
    const username = event.target.value;
    document.getElementById('display-username').textContent = username || 'Ваш Логин';
    localStorage.setItem('userUsername', username);
});
