# 📝 Шпаргалка по платежной системе

## 🚀 Быстрые команды

```bash
# Установка
cd backend && npm install

# Проверка настройки
npm run check

# Тест создания платежа
npm run test-payment

# Запуск backend
npm start

# Запуск с автоперезагрузкой
npm run dev

# Запуск ngrok (для webhook)
ngrok http 3000
```

## 🔑 Переменные окружения (.env)

```env
# Xsolla
XSOLLA_MERCHANT_ID=123456
XSOLLA_PROJECT_ID=789012
XSOLLA_API_KEY=sk_live_xxxxx
XSOLLA_WEBHOOK_SECRET=whsec_xxxxx

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...

# Server
PORT=3000
FRONTEND_URL=http://localhost:5500
```

## 🌐 API Endpoints

### Создание платежа
```bash
POST http://localhost:3000/api/payment/create
Content-Type: application/json

{
  "userId": "uuid",
  "productName": "Deline one month",
  "amount": 300,
  "email": "user@example.com"
}
```

### Проверка статуса
```bash
GET http://localhost:3000/api/payment/status/ORDER-123
```

### Webhook (от Xsolla)
```bash
POST http://localhost:3000/api/payment/webhook
Authorization: Signature {signature}
Content-Type: application/json

{
  "notification_type": "payment",
  "purchase": { ... },
  "transaction": { ... }
}
```

## 💳 Тестовые карты

```
Успешная оплата:
Номер: 4111 1111 1111 1111
CVV: 123
Срок: 12/25
Имя: Test User

Отклоненная оплата:
Номер: 4000 0000 0000 0002
CVV: 123
Срок: 12/25
```

## 🔍 SQL запросы

```sql
-- Все заказы
SELECT * FROM orders ORDER BY created_at DESC;

-- Успешные заказы
SELECT * FROM orders WHERE status = 'completed';

-- Ожидающие оплаты
SELECT * FROM orders WHERE status = 'pending';

-- Заказы пользователя
SELECT * FROM orders WHERE user_id = 'uuid';

-- Статистика по статусам
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- Сумма успешных платежей
SELECT SUM(amount) FROM orders WHERE status = 'completed';
```

## 🐛 Отладка

### Проверка backend
```bash
curl http://localhost:3000/health
# Ответ: {"status":"ok","timestamp":"..."}
```

### Проверка Xsolla API
```bash
npm run test-payment
# Должен вернуть токен
```

### Логи backend
```javascript
// В server.js уже есть логирование:
console.log('Payment created:', { orderId, paymentUrl });
console.log('Webhook received:', JSON.stringify(req.body));
console.log('Order completed:', orderId);
```

### Логи frontend
```javascript
// В консоли браузера (F12):
console.log('Current user:', currentUser);
console.log('Payment data:', { userId, productName, amount });
console.log('Payment response:', data);
```

## 🔗 Полезные ссылки

```
Xsolla Publisher Account:
https://publisher.xsolla.com/

Xsolla API Docs:
https://developers.xsolla.com/

Supabase Dashboard:
https://app.supabase.com/

Ngrok Dashboard:
https://dashboard.ngrok.com/
```

## 📊 Статусы заказов

```
pending   - Создан, ожидает оплаты
completed - Оплачен успешно
failed    - Оплата не прошла
refunded  - Возврат средств
```

## 🔄 Процесс оплаты (кратко)

```
1. Пользователь → "Купить"
2. Frontend → POST /api/payment/create
3. Backend → Создает заказ в БД (pending)
4. Backend → Запрашивает токен у Xsolla
5. Backend → Возвращает paymentUrl
6. Пользователь → Перенаправление на Xsolla
7. Пользователь → Оплачивает
8. Xsolla → POST /api/payment/webhook
9. Backend → Обновляет заказ (completed)
10. Пользователь → Возврат на payment-success.html
```

## 🎯 Частые ошибки

### "Missing required fields"
```javascript
// Проверь, что передаешь все поля:
{ userId, productName, amount, email }
```

### "Failed to create payment token"
```bash
# Проверь API ключи в .env
npm run check
```

### "Webhook signature mismatch"
```bash
# Проверь XSOLLA_WEBHOOK_SECRET в .env
# Проверь, что webhook URL правильный
```

### "Order not found"
```javascript
// Проверь, что orderId сохранен в localStorage
localStorage.getItem('pendingOrder')
```

## 🔐 Безопасность

```javascript
// Проверка подписи webhook
const signature = req.headers['authorization'];
const expectedSignature = crypto
  .createHmac('sha1', WEBHOOK_SECRET)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

## 📱 Тестирование

### Локально
```bash
# Терминал 1
cd backend && npm start

# Терминал 2
ngrok http 3000

# Терминал 3
# Запусти Live Server или:
python -m http.server 5500
```

### Продакшен
```bash
# Деплой backend на Railway/Render/Heroku
# Деплой frontend на Netlify/Vercel
# Обнови webhook URL в Xsolla
```

## 🎨 Кастомизация

### Изменить товары
```javascript
// В shop.html найди:
<div class="product-card">
  <h3>Название товара</h3>
  <div class="product-price">300₽</div>
  <button onclick="buyProduct('Название', 300)">Купить</button>
</div>
```

### Изменить способы оплаты
```javascript
// В shop.html найди:
const paymentMethods = [
  { id: 'xsolla', name: 'Xsolla', icon: './xsolla.png' },
  // Добавь свои методы
];
```

### Добавить промокод
```sql
-- В Supabase:
INSERT INTO promo_codes (code, discount_percent, is_active)
VALUES ('SALE20', 20, true);
```

## 📞 Контакты

```
Xsolla Support: support@xsolla.com
Xsolla Docs: developers.xsolla.com
Telegram: @xsolla_support
```

---

💡 Сохрани эту шпаргалку для быстрого доступа к командам и примерам!
