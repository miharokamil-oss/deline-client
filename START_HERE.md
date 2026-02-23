# 🚀 НАЧНИ ЗДЕСЬ - Интеграция платежной системы

## 👋 Привет!

Платежная система Xsolla полностью интегрирована в твой сайт. Осталось только настроить!

---

## ⚡ Быстрый путь (5 минут)

### 1️⃣ Установка зависимостей ✅ ГОТОВО

```bash
✅ Зависимости уже установлены!
```

### 2️⃣ Регистрация в Xsolla (2 минуты)

👉 Открой: [https://publisher.xsolla.com/signup](https://publisher.xsolla.com/signup)

- Зарегистрируйся
- Подтверди email
- Создай проект "Zenex Client"

### 3️⃣ Получи API ключи (2 минуты)

В Xsolla Publisher Account:

**Merchant ID:**
- Company settings → Company → Скопируй Merchant ID

**Project ID:**
- Project settings → Скопируй Project ID

**API Key:**
- Company settings → API keys → Generate API key → Скопируй

**Webhook Secret:**
- Project settings → Webhooks → Включи → Скопируй Secret

### 4️⃣ Заполни .env (1 минута)

Открой файл `backend/.env` и вставь свои данные:

```env
XSOLLA_MERCHANT_ID=твой_merchant_id
XSOLLA_PROJECT_ID=твой_project_id
XSOLLA_API_KEY=твой_api_key
XSOLLA_WEBHOOK_SECRET=твой_webhook_secret
```

### 5️⃣ Проверь настройку (10 секунд)

```bash
cd backend
npm run check
```

Должно быть все ✅

### 6️⃣ Запусти (30 секунд)

**Терминал 1 - Backend:**
```bash
cd backend
npm start
```

**Терминал 2 - Ngrok (для webhook):**
```bash
ngrok http 3000
```

Скопируй URL (например: `https://xxxx.ngrok.io`)

**Терминал 3 - Frontend:**
Запусти Live Server или:
```bash
python -m http.server 5500
```

### 7️⃣ Настрой webhook (30 секунд)

В Xsolla → Project settings → Webhooks:
- Вставь URL: `https://xxxx.ngrok.io/api/payment/webhook`
- Сохрани

### 8️⃣ Тестируй! (1 минута)

1. Открой сайт
2. Войди в аккаунт
3. Магазин → Купить
4. Выбери Xsolla → Оплатить
5. Карта: `4111 1111 1111 1111`
6. CVV: `123`, Срок: `12/25`
7. Pay

✅ Должно перенаправить на payment-success.html!

---

## 📚 Подробная документация

Если нужны детали, читай:

1. **QUICK_START.md** - Пошаговая инструкция
2. **XSOLLA_SETUP.md** - Подробно про Xsolla
3. **CHECKLIST.md** - Чеклист настройки
4. **CHEATSHEET.md** - Шпаргалка с командами

---

## 🎯 Что уже готово

✅ Backend API с endpoints для платежей
✅ Интеграция с Xsolla API
✅ Обработка webhook уведомлений
✅ Страница успешной оплаты
✅ Сохранение заказов в БД
✅ Проверка безопасности
✅ Полная документация

---

## 🔧 Полезные команды

```bash
# Проверка настройки
npm run check

# Тест создания платежа
npm run test-payment

# Запуск backend
npm start

# Запуск с автоперезагрузкой
npm run dev
```

---

## 🐛 Проблемы?

### Backend не запускается:
```bash
cd backend
npm install
npm run check
```

### Webhook не работает:
1. Проверь, что ngrok запущен
2. Проверь URL в Xsolla
3. Посмотри логи backend

### Платеж не создается:
1. F12 → Console → ищи ошибки
2. Проверь, что backend запущен
3. Проверь .env файл

---

## 📞 Нужна помощь?

- **QUICK_START.md** - Подробная инструкция
- **XSOLLA_SETUP.md** - Настройка Xsolla
- **CHECKLIST.md** - Чеклист
- Xsolla Docs: [developers.xsolla.com](https://developers.xsolla.com/)

---

## 🎉 Готово!

После настройки у тебя будет:
- ✅ Работающая платежная система
- ✅ Интеграция с Xsolla
- ✅ Автоматическая обработка платежей
- ✅ Безопасные транзакции

---

## 🚀 Следующие шаги

После тестирования:
1. Добавь логику выдачи товара после оплаты
2. Настрой email уведомления
3. Добавь историю покупок в профиль
4. Задеплой на продакшен

---

⏱️ Время: 5-10 минут
🎯 Результат: Полностью рабочая платежная система

**Начни с регистрации в Xsolla:** [publisher.xsolla.com/signup](https://publisher.xsolla.com/signup)
