# 💳 Быстрая настройка Xsolla

## Что нужно сделать:

### 1️⃣ Установить зависимости
```bash
cd backend
npm install
```

### 2️⃣ Зарегистрироваться в Xsolla
1. Зайди на https://publisher.xsolla.com/
2. Создай аккаунт и новый проект
3. Получи эти данные:
   - **Merchant ID** (в Settings → Company)
   - **Project ID** (в настройках проекта)
   - **API Key** (в Settings → API Keys)
   - **Webhook Secret** (в Settings → Webhooks)

### 3️⃣ Настроить .env файл
```bash
cd backend
copy .env.example .env
```

Открой `.env` и вставь свои данные:
```env
XSOLLA_MERCHANT_ID=твой_merchant_id
XSOLLA_PROJECT_ID=твой_project_id
XSOLLA_API_KEY=твой_api_key
XSOLLA_WEBHOOK_SECRET=твой_webhook_secret
```

### 4️⃣ Создать таблицу в Supabase
1. Открой https://supabase.com/dashboard
2. Перейди в SQL Editor
3. Скопируй и выполни код из файла `database/orders_table.sql`

### 5️⃣ Настроить Webhook в Xsolla
1. В личном кабинете Xsolla → Settings → Webhooks
2. Добавь URL: `https://твой-домен.com/api/payment/webhook`
3. Включи уведомления: Payment, Refund, User validation

### 6️⃣ Настроить Return URL в Xsolla
1. Pay Station → Settings
2. Return URL: `https://твой-домен.com/payment-success.html`

### 7️⃣ Запустить сервер
```bash
cd backend
npm start
```

## 🎉 Готово!

Теперь:
- Пользователи могут покупать подписки через Xsolla
- После оплаты они видят красивую страницу с анимированной галочкой
- Подписка автоматически активируется в их профиле

## 🧪 Тестирование

Включи Test Mode в Xsolla и используй тестовую карту:
- Номер: `4111 1111 1111 1111`
- CVV: `123`
- Срок: любая будущая дата

## ❓ Проблемы?

Смотри подробную инструкцию в файле `XSOLLA_SETUP.md`
