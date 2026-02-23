# 🎮 Zenex Client - Игровой клиент с интегрированной платежной системой

Современный веб-сайт для игрового клиента с полной интеграцией платежной системы Xsolla.

## ✨ Возможности

- 🎨 Современный дизайн с темной/светлой темой
- 💳 Интеграция платежной системы Xsolla
- 👤 Система авторизации через Supabase
- 🛒 Магазин с различными тарифами
- 💬 Чат поддержки с AI (Groq API)
- ⭐ Система отзывов
- 🎫 Промокоды со скидками
- 📱 Адаптивный дизайн

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
npm install
```

### 2. Настройка Xsolla

Следуй подробной инструкции в файле [XSOLLA_SETUP.md](XSOLLA_SETUP.md)

Кратко:
1. Зарегистрируйся на [Xsolla Publisher Account](https://publisher.xsolla.com/signup)
2. Создай проект
3. Получи API ключи
4. Заполни `backend/.env`

### 3. Настройка переменных окружения

Скопируй `.env.example` в `.env` и заполни:

```bash
cd backend
cp .env.example .env
# Отредактируй .env файл
```

### 4. Проверка настройки

```bash
cd backend
npm run check
```

### 5. Запуск backend

```bash
cd backend
npm start
```

Backend запустится на `http://localhost:3000`

### 6. Запуск frontend

Используй любой локальный сервер, например:
- VS Code Live Server
- `python -m http.server 5500`
- `npx serve`

## 📁 Структура проекта

```
zenex-client/
├── backend/                    # Backend сервер
│   ├── server.js              # Основной файл с API
│   ├── package.json           # Зависимости
│   ├── .env                   # Конфигурация (создай из .env.example)
│   ├── check-setup.js         # Проверка настройки
│   └── test-payment.js        # Тест создания платежа
├── components/                 # Компоненты UI
│   ├── navbar.js/html/css     # Навигация
│   ├── footer.js/html/css     # Подвал
│   ├── auth-modal.js/html/css # Модальное окно авторизации
│   ├── support-chat.js/html/css # Чат поддержки
│   └── ...                    # Другие компоненты
├── database/                   # SQL скрипты
│   └── orders_table.sql       # Таблица заказов
├── index.html                  # Главная страница
├── shop.html                   # Магазин
├── profile.html                # Профиль пользователя
├── payment-success.html        # Страница успешной оплаты
├── XSOLLA_SETUP.md            # Подробная инструкция по Xsolla
├── PAYMENT_INTEGRATION_README.md # Документация интеграции
└── README.md                   # Этот файл
```

## 🔧 Доступные команды

```bash
# Backend
cd backend

npm start           # Запуск сервера
npm run dev         # Запуск с автоперезагрузкой (nodemon)
npm run check       # Проверка настройки
npm run test-payment # Тест создания платежа
```

## 🌐 API Endpoints

### Платежи
- `POST /api/payment/create` - Создание платежа
- `POST /api/payment/webhook` - Webhook от Xsolla
- `GET /api/payment/status/:orderId` - Проверка статуса заказа

### AI Поддержка
- `POST /api/ai-support` - Получение ответа от AI

### Служебные
- `GET /health` - Проверка работоспособности

## 💳 Процесс оплаты

1. Пользователь выбирает товар в магазине
2. Нажимает "Купить" → открывается модальное окно
3. Выбирает способ оплаты (Xsolla)
4. Нажимает "Оплатить"
5. Перенаправляется на Xsolla Pay Station
6. Оплачивает удобным способом
7. Возвращается на `payment-success.html`
8. Видит подтверждение оплаты

## 🔐 Безопасность

- ✅ Проверка подписи webhook от Xsolla
- ✅ Использование HTTPS для webhook
- ✅ API ключи в переменных окружения
- ✅ Валидация всех входящих данных
- ✅ Защита от SQL инъекций (Supabase)

## 🧪 Тестирование

### Локальное тестирование с ngrok:

```bash
# Установи ngrok
npm install -g ngrok

# Запусти ngrok
ngrok http 3000

# Используй полученный URL для webhook в Xsolla
# Например: https://xxxx.ngrok.io/api/payment/webhook
```

### Тестовые карты Xsolla:
- Успешная оплата: `4111 1111 1111 1111`
- CVV: любой 3-значный код
- Срок: любая будущая дата

## 📊 База данных (Supabase)

### Таблицы:
- `users` - Пользователи
- `orders` - Заказы и платежи
- `reviews` - Отзывы
- `promo_codes` - Промокоды

### Просмотр заказов:
```sql
-- Все заказы
SELECT * FROM orders ORDER BY created_at DESC;

-- Успешные заказы
SELECT * FROM orders WHERE status = 'completed';
```

## 🐛 Решение проблем

### Backend не запускается
```bash
cd backend
npm install
npm run check
```

### Webhook не работает
1. Проверь, что ngrok запущен
2. Проверь URL webhook в Xsolla
3. Проверь `XSOLLA_WEBHOOK_SECRET` в `.env`
4. Посмотри логи в консоли backend

### Платеж не создается
1. Открой консоль браузера (F12)
2. Проверь Network → XHR
3. Найди запрос к `/api/payment/create`
4. Посмотри ответ сервера
5. Проверь логи backend

## 📚 Документация

- [Xsolla API](https://developers.xsolla.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js](https://expressjs.com/)

## 🎯 TODO

- [ ] Добавить логику выдачи товара после оплаты
- [ ] Настроить email уведомления
- [ ] Добавить историю покупок в профиль
- [ ] Настроить возвраты (refunds)
- [ ] Добавить аналитику платежей

## 📞 Поддержка

- Документация Xsolla: [developers.xsolla.com](https://developers.xsolla.com/)
- Поддержка Xsolla: support@xsolla.com

## 📄 Лицензия

Проект создан для Zenex Client

---

✅ Готово к использованию! Следуй инструкциям в [XSOLLA_SETUP.md](XSOLLA_SETUP.md) для настройки.
