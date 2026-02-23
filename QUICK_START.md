# ⚡ Быстрый старт - 5 минут до первого платежа

## 🎯 Цель
Запустить платежную систему и протестировать первый платеж за 5 минут.

## 📋 Шаг 1: Установка (30 секунд)

```bash
cd backend
npm install
```

## 🔑 Шаг 2: Регистрация в Xsolla (2 минуты)

1. Открой [https://publisher.xsolla.com/signup](https://publisher.xsolla.com/signup)
2. Зарегистрируйся (email + пароль)
3. Подтверди email
4. Войди в аккаунт

## 🎮 Шаг 3: Создание проекта (1 минута)

1. Нажми **"Create new project"**
2. Выбери тип: **Game**
3. Название: **Zenex Client**
4. Платформа: **PC**
5. Нажми **Create**

## 🔐 Шаг 4: Получение ключей (1 минута)

### Merchant ID:
1. **Company settings** → **Company**
2. Скопируй **Merchant ID**

### Project ID:
1. Вернись в проект
2. **Project settings** → скопируй **Project ID** (в URL или в настройках)

### API Key:
1. **Company settings** → **API keys**
2. **Generate API key**
3. Скопируй ключ (показывается один раз!)

### Webhook Secret:
1. **Project settings** → **Webhooks**
2. Включи webhooks
3. Скопируй **Webhook secret key**

## ⚙️ Шаг 5: Настройка .env (30 секунд)

Открой `backend/.env` и вставь свои данные:

```env
XSOLLA_MERCHANT_ID=123456
XSOLLA_PROJECT_ID=789012
XSOLLA_API_KEY=sk_live_xxxxxxxxxxxxx
XSOLLA_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## ✅ Шаг 6: Проверка (10 секунд)

```bash
cd backend
npm run check
```

Должно быть все ✅

## 🚀 Шаг 7: Запуск (10 секунд)

### Терминал 1 - Backend:
```bash
cd backend
npm start
```

### Терминал 2 - Ngrok (для webhook):
```bash
ngrok http 3000
```

Скопируй URL (например: `https://xxxx.ngrok.io`)

## 🔗 Шаг 8: Настройка webhook (30 секунд)

1. Вернись в Xsolla → **Project settings** → **Webhooks**
2. Вставь URL: `https://xxxx.ngrok.io/api/payment/webhook`
3. Сохрани

## 🧪 Шаг 9: Тестирование (30 секунд)

1. Открой сайт (Live Server или `python -m http.server 5500`)
2. Войди в аккаунт (или зарегистрируйся)
3. Перейди в **Магазин**
4. Нажми **Купить** на любом товаре
5. Выбери **Xsolla**
6. Нажми **Оплатить**

## 💳 Шаг 10: Тестовая оплата (30 секунд)

На странице Xsolla Pay Station:
- Карта: `4111 1111 1111 1111`
- CVV: `123`
- Срок: `12/25`
- Имя: любое

Нажми **Pay**

## ✅ Готово!

Ты должен увидеть:
1. Перенаправление на `payment-success.html`
2. Сообщение "Оплата успешна!"
3. Информацию о заказе

## 🔍 Проверка в БД

Открой Supabase → таблица `orders`:
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
```

Должен быть заказ со статусом `completed`

## 🎉 Поздравляю!

Платежная система работает! Теперь можешь:
- Добавить логику выдачи товара
- Настроить продакшен
- Отключить тестовый режим

## 🐛 Что-то не работает?

### Backend не запускается:
```bash
cd backend
npm install
npm run check
```

### Webhook не получает данные:
1. Проверь, что ngrok запущен
2. Проверь URL в Xsolla
3. Посмотри логи backend

### Платеж не создается:
1. F12 → Console → ищи ошибки
2. Проверь, что backend запущен
3. Проверь `.env` файл

## 📚 Дальше

- Читай [XSOLLA_SETUP.md](XSOLLA_SETUP.md) для подробностей
- Читай [PAYMENT_INTEGRATION_README.md](PAYMENT_INTEGRATION_README.md) для понимания архитектуры
- Настрой продакшен по инструкции

---

⏱️ Время: ~5 минут | Сложность: Легко | Результат: Работающая платежная система
