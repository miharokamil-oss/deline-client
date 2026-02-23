# 💳 Интеграция платежной системы Xsolla - Готово!

## ✅ Что было сделано

### 1. Backend (Node.js + Express)
- ✅ Создан endpoint `/api/payment/create` для создания платежей
- ✅ Создан endpoint `/api/payment/webhook` для обработки уведомлений от Xsolla
- ✅ Создан endpoint `/api/payment/status/:orderId` для проверки статуса заказа
- ✅ Интегрирован Supabase для хранения заказов
- ✅ Добавлена проверка подписи webhook для безопасности

### 2. Frontend
- ✅ Обновлена функция `processPayment()` в `shop.html`
- ✅ Создана страница `payment-success.html` для обработки возврата после оплаты
- ✅ Добавлено сохранение информации о заказе в localStorage

### 3. База данных
- ✅ Таблица `orders` уже создана в Supabase
- ✅ Структура поддерживает все необходимые поля

### 4. Документация
- ✅ Создан `XSOLLA_SETUP.md` с подробной инструкцией по настройке
- ✅ Создан `.env.example` с примером конфигурации

## 🚀 Быстрый старт

### Шаг 1: Установка зависимостей
```bash
cd backend
npm install
```

### Шаг 2: Настройка Xsolla
Следуй инструкциям в файле `XSOLLA_SETUP.md`

Кратко:
1. Зарегистрируйся на [Xsolla Publisher Account](https://publisher.xsolla.com/signup)
2. Создай проект
3. Получи API ключи
4. Заполни `backend/.env`

### Шаг 3: Настройка .env
Открой `backend/.env` и заполни:
```env
XSOLLA_MERCHANT_ID=твой_merchant_id
XSOLLA_PROJECT_ID=твой_project_id
XSOLLA_API_KEY=твой_api_key
XSOLLA_WEBHOOK_SECRET=твой_webhook_secret
```

### Шаг 4: Запуск backend
```bash
cd backend
npm start
```

Backend запустится на `http://localhost:3000`

### Шаг 5: Настройка webhook (для локальной разработки)
```bash
# Установи ngrok
npm install -g ngrok

# Запусти ngrok
ngrok http 3000

# Скопируй URL (например: https://xxxx.ngrok.io)
# Добавь в Xsolla: https://xxxx.ngrok.io/api/payment/webhook
```

### Шаг 6: Тестирование
1. Открой сайт (например, через Live Server)
2. Войди в аккаунт
3. Перейди в магазин
4. Нажми "Купить" на любом товаре
5. Выбери способ оплаты (Xsolla)
6. Нажми "Оплатить"
7. Откроется Xsolla Pay Station
8. Используй тестовую карту: `4111 1111 1111 1111`
9. После оплаты вернешься на `payment-success.html`

## 📁 Структура файлов

```
zenex-client/
├── backend/
│   ├── server.js           # Основной файл backend с API
│   ├── package.json        # Зависимости (обновлен)
│   ├── .env               # Конфигурация (создан)
│   └── .env.example       # Пример конфигурации
├── database/
│   └── orders_table.sql   # SQL для создания таблицы заказов
├── shop.html              # Страница магазина (обновлена)
├── payment-success.html   # Страница успешной оплаты (создана)
├── XSOLLA_SETUP.md       # Подробная инструкция по настройке
└── PAYMENT_INTEGRATION_README.md  # Этот файл
```

## 🔄 Как работает процесс оплаты

```
1. Пользователь нажимает "Купить"
   ↓
2. Frontend отправляет запрос на /api/payment/create
   ↓
3. Backend создает заказ в БД (статус: pending)
   ↓
4. Backend запрашивает токен у Xsolla API
   ↓
5. Backend возвращает URL для оплаты
   ↓
6. Пользователь перенаправляется на Xsolla Pay Station
   ↓
7. Пользователь оплачивает
   ↓
8. Xsolla отправляет webhook на /api/payment/webhook
   ↓
9. Backend обновляет статус заказа (статус: completed)
   ↓
10. Пользователь возвращается на payment-success.html
    ↓
11. Frontend проверяет статус через /api/payment/status/:orderId
    ↓
12. Показывается сообщение об успешной оплате
```

## 🔐 Безопасность

- ✅ Проверка подписи webhook от Xsolla
- ✅ Использование HTTPS для webhook (через ngrok или продакшен)
- ✅ API ключи хранятся в .env (не в коде)
- ✅ Валидация всех входящих данных

## 📊 Мониторинг заказов

### В Supabase:
```sql
-- Все заказы
SELECT * FROM orders ORDER BY created_at DESC;

-- Успешные заказы
SELECT * FROM orders WHERE status = 'completed';

-- Ожидающие оплаты
SELECT * FROM orders WHERE status = 'pending';
```

### В Xsolla Publisher Account:
- Transactions → История всех платежей
- Webhooks → Логи webhook запросов

## 🐛 Отладка

### Backend не запускается:
```bash
# Проверь зависимости
cd backend
npm install

# Проверь .env файл
cat .env
```

### Webhook не работает:
```bash
# Проверь ngrok
ngrok http 3000

# Проверь логи backend
# В консоли должно быть: "Webhook received: ..."
```

### Платеж не создается:
1. Открой консоль браузера (F12)
2. Проверь Network → XHR
3. Найди запрос к `/api/payment/create`
4. Посмотри ответ сервера

## 🎯 Следующие шаги

### Обязательно:
- [ ] Зарегистрируйся в Xsolla
- [ ] Заполни `.env` файл
- [ ] Настрой webhook URL
- [ ] Протестируй оплату

### Опционально:
- [ ] Добавь логику выдачи товара после оплаты
- [ ] Настрой email уведомления
- [ ] Добавь историю покупок в профиль
- [ ] Настрой возвраты (refunds)

## 💡 Полезные ссылки

- [Документация Xsolla API](https://developers.xsolla.com/)
- [Xsolla Pay Station](https://developers.xsolla.com/doc/pay-station/)
- [Webhook уведомления](https://developers.xsolla.com/api/v2/getting-started/#api_webhooks)
- [Тестовые карты](https://developers.xsolla.com/doc/pay-station/#guides_testing)

## ❓ FAQ

**Q: Нужно ли платить за Xsolla?**
A: Xsolla берет комиссию с каждой транзакции (обычно 5-7%). Регистрация бесплатная.

**Q: Можно ли использовать другую платежную систему?**
A: Да, но нужно будет переписать backend. Xsolla удобна тем, что поддерживает много способов оплаты.

**Q: Как работает тестовый режим?**
A: В тестовом режиме реальные деньги не списываются. Используй тестовые карты.

**Q: Что делать после успешной оплаты?**
A: Добавь логику в webhook для выдачи товара пользователю (активация подписки, добавление ключа и т.д.)

---

✅ Интеграция готова! Следуй инструкциям в `XSOLLA_SETUP.md` для настройки.
