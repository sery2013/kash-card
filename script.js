// --- ВАЖНО: Замените 'YOUR_IMGBB_API_KEY' на ваш реальный API Key от ImgBB ---
const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

document.getElementById('avatar-upload').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusElement = document.getElementById('upload-status');
    statusElement.textContent = 'Загрузка...';
    statusElement.className = ''; // Сброс классов

    // Проверка типа файла
    if (!file.type.match('image.*')) {
        statusElement.textContent = 'Пожалуйста, выберите изображение.';
        statusElement.className = 'error';
        return;
    }

    // Проверка размера файла (макс 16 МБ)
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

            // Обновляем изображение аватара
            document.getElementById('avatar-preview').src = imageUrl;

            // Сохраняем URL в localStorage
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

// --- Восстановление данных при загрузке страницы ---
document.addEventListener('DOMContentLoaded', function() {
    // Восстановление аватара
    const savedAvatarUrl = localStorage.getItem('userAvatarUrl');
    if (savedAvatarUrl) {
        document.getElementById('avatar-preview').src = savedAvatarUrl;
        console.log('Аватар восстановлен из localStorage:', savedAvatarUrl);
    }

    // Восстановление логина
    const savedUsername = localStorage.getItem('userUsername');
    if (savedUsername) {
        document.getElementById('username-input').value = savedUsername;
        document.getElementById('display-username').textContent = savedUsername;
        console.log('Логин восстановлен из localStorage:', savedUsername);
    }
});

// --- Обновление отображаемого логина и сохранение в localStorage ---
document.getElementById('username-input').addEventListener('input', function(event) {
    const username = event.target.value;
    document.getElementById('display-username').textContent = username || 'Ваш Логин';
    localStorage.setItem('userUsername', username);
});
