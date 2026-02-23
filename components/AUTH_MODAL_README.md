# Модальное окно авторизации

## Подключение на страницы

Добавьте в `<head>` страницы:

```html
<link rel="stylesheet" href="./components/auth-modal.css">
```

Добавьте перед закрывающим `</body>`:

```html
<script src="./components/auth-modal.js"></script>
```

## Использование

### 1. Открыть модалку программно

```javascript
// Открыть форму входа
openAuthModal();

// Открыть форму регистрации
openAuthModal('register');
```

### 2. Кнопка авторизации в navbar

```html
<button onclick="openAuthModal()">Авторизация</button>
```

### 3. Автоматическая проверка авторизации

Добавьте атрибут `data-auth-required` к любой кнопке:

```html
<button data-auth-required>Купить</button>
<button data-auth-required>Оставить отзыв</button>
```

Или используйте классы (автоматически):
- `.buy-btn`
- `.review-btn`
- `.purchase-btn`

При клике на эти кнопки, если пользователь не авторизован, откроется модальное окно.

## Пример интеграции в navbar

```javascript
// В navbar.js добавьте проверку авторизации
const currentUser = localStorage.getItem('currentUser');

if (currentUser) {
  // Показать кнопку профиля
  navbarHTML += `<a href="profile.html">Профиль</a>`;
} else {
  // Показать кнопку авторизации
  navbarHTML += `<button onclick="openAuthModal()">Войти</button>`;
}
```

## Закрытие модалки

Модалка закрывается:
- По клику на крестик
- По клику вне модального окна
- По нажатию ESC
- Программно: `closeAuthModal()`

## Стилизация

Модалка поддерживает светлую и темную темы автоматически через класс `body.light-theme`.
