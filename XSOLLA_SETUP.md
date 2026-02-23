# 🎮 Настройка Xsolla для Zenex Client

## 📋 Шаг 1: Регистрация в Xsolla

1. Перейди на [https://publisher.xsolla.com/signup](https://publisher.xsolla.com/signup)
2. Зарегистрируй аккаунт
3. Подтверди email

## 🔧 Шаг 2: Создание проекта

1. Войди в [Publisher Account](https://publisher.xsolla.com/)
2. Нажми "Create new project"
3. Выбери тип проекта: **Game**
4. Заполни информацию о проекте:
   - Название: Zenex Client
   - Платформа: PC
   - Жанр: по желанию

## 🔑 Шаг 3: Получение API ключей

### Merchant ID и Project ID:
1. Открой свой проект в Publisher Account
2. Перейди в **Company settings** → **Company**
3. Скопируй **Merchant ID**
4. Вернись в проект → **Project settings**
5. Скопируй **Project ID**

### API Key:
1. Перейди в **Company settings** → **API keys**
2. Нажми **Generate API key**
3. Скопируй ключ (он показывается только один раз!)

### Webhook Secret:
1. Перейди в **Project settings** → **Webhooks**
2. Включи webhooks
3. Добавь URL: `https://твой-домен.com/api/payment/webhook`
   - Для локальной разработки используй [ngrok](https://ngrok.com/):
     ```bash
     ngrok http 3000
     ```
   - Используй полученный URL: `https://xxxx.ngrok.io/api/payment/webhook`
4. Скопируй **Webhook secret key**

## 📝 Шаг 4: Настройка backend/.env

Открой файл `backend/.env` и заполни данные:

```env
# Xsolla Configuration
XSOLLA_MERCHANT_ID=123456          # Твой Merchant ID
XSOLLA_PROJECT_ID=789012           # Твой Project ID
XSOLLA_API_KEY=sk_live_xxxxx       # Твой API Key
XSOLLA_WEBHOOK_SECRET=whsec_xxxxx  # Твой Webhook Secret
```

## 🌐 Шаг 5: Настройка Return URL

1. В Xsolla Publisher Account → **Project settings** → **Pay Station**
2. Найди **Return URL**
3. Укажи URL для возврата после оплаты:
   - Локально: `http://localhost:5500/payment-success.html`
   - На продакшене: `https://твой-домен.com/payment-success.html`

## 💳 Шаг 6: Настройка способов оплаты

1. Перейди в **Project settings** → **Payment methods**
2. Включи нужные способы оплаты:
   - Банковские карты (Visa, Mastercard, МИР)
   - Электронные кошельки (ЮMoney, QIWI)
   - Мобильные платежи
   - Криптовалюты (опционально)

## 🧪 Шаг 7: Тестирование

### Тестовый режим:
1. В **Project settings** включи **Test mode**
2. Используй тестовые карты:
   - Успешная оплата: `4111 1111 1111 1111`
   - CVV: любой 3-значный код
   - Срок: любая будущая дата

### Запуск backend:
```bash
cd backend
npm install
npm start
```

### Проверка:
1. Открой сайт
2. Перейди в магазин
3. Нажми "Купить" на любом товаре
4. Выбери способ оплаты
5. Нажми "Оплатить"
6. Должна открыться страница Xsolla Pay Station

## 🚀 Шаг 8: Продакшен

### Перед запуском:
1. Отключи **Test mode** в Xsolla
2. Настрой реальный домен для webhook
3. Обнови `FRONTEND_URL` в `.env`
4. Проверь все API ключи

### Деплой backend:
Можешь использовать:
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Heroku](https://heroku.com/)
- VPS (DigitalOcean, AWS, etc.)

## 📊 Мониторинг платежей

1. Все платежи видны в **Xsolla Publisher Account** → **Transactions**
2. В твоей БД Supabase → таблица `orders`
3. Логи webhook в консоли backend

## ❓ Частые проблемы

### Webhook не работает:
- Проверь, что URL доступен извне (используй ngrok для локальной разработки)
- Проверь правильность Webhook Secret
- Посмотри логи в Xsolla Publisher Account → Webhooks → Logs

### Платеж не создается:
- Проверь API ключи в `.env`
- Убедись, что backend запущен
- Проверь консоль браузера на ошибки

### Статус заказа не обновляется:
- Проверь webhook URL
- Убедись, что webhook включен в Xsolla
- Проверь логи backend

## 📞 Поддержка

- Документация Xsolla: [https://developers.xsolla.com/](https://developers.xsolla.com/)
- Поддержка Xsolla: support@xsolla.com
- Telegram: @xsolla_support

---

✅ После настройки твоя платежная система готова к работе!
