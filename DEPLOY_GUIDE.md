# 🚀 Деплой Backend на продакшен (бесплатно)

## 🎯 Цель
Развернуть backend на бесплатном хостинге, чтобы он работал 24/7 без локального сервера.

---

## ⚡ Вариант 1: Render.com (Рекомендуется) - 5 минут

### Почему Render?
- ✅ Бесплатный план
- ✅ Автоматический деплой из GitHub
- ✅ HTTPS из коробки
- ✅ Простая настройка

### Шаг 1: Подготовка проекта (2 минуты)

Создай файл `backend/render.yaml`:

```yaml
services:
  - type: web
    name: zenex-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### Шаг 2: Регистрация на Render (1 минута)

1. Открой [https://render.com/](https://render.com/)
2. Нажми **Get Started for Free**
3. Войди через GitHub

### Шаг 3: Создание Web Service (2 минуты)

1. Нажми **New +** → **Web Service**
2. Подключи свой GitHub репозиторий
3. Настройки:
   - **Name:** zenex-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Шаг 4: Добавление переменных окружения

В разделе **Environment**:

```
XSOLLA_MERCHANT_ID=твой_merchant_id
XSOLLA_PROJECT_ID=твой_project_id
XSOLLA_API_KEY=твой_api_key
XSOLLA_WEBHOOK_SECRET=твой_webhook_secret
SUPABASE_URL=https://xlruthqgapbgxfowavln.supabase.co
SUPABASE_KEY=твой_supabase_key
PORT=10000
```

### Шаг 5: Деплой

1. Нажми **Create Web Service**
2. Подожди 2-3 минуты
3. Получишь URL: `https://zenex-backend.onrender.com`

### Шаг 6: Обновление frontend

В `shop.html` замени:
```javascript
// Было:
const response = await fetch('http://localhost:3000/api/payment/create', {

// Стало:
const response = await fetch('https://zenex-backend.onrender.com/api/payment/create', {
```

В `payment-success.html` замени:
```javascript
// Было:
const BACKEND_URL = 'http://localhost:3000';

// Стало:
const BACKEND_URL = 'https://zenex-backend.onrender.com';
```

### Шаг 7: Настройка webhook в Xsolla

В Xsolla Publisher Account → Webhooks:
```
https://zenex-backend.onrender.com/api/payment/webhook
```

✅ Готово! Backend работает 24/7!

---

## ⚡ Вариант 2: Railway.app - 5 минут

### Почему Railway?
- ✅ $5 бесплатно каждый месяц
- ✅ Очень быстрый деплой
- ✅ Автоматический HTTPS

### Шаг 1: Регистрация

1. Открой [https://railway.app/](https://railway.app/)
2. Войди через GitHub

### Шаг 2: Создание проекта

1. Нажми **New Project**
2. Выбери **Deploy from GitHub repo**
3. Выбери свой репозиторий

### Шаг 3: Настройка

1. Railway автоматически определит Node.js
2. Перейди в **Variables**
3. Добавь переменные:

```
XSOLLA_MERCHANT_ID=твой_merchant_id
XSOLLA_PROJECT_ID=твой_project_id
XSOLLA_API_KEY=твой_api_key
XSOLLA_WEBHOOK_SECRET=твой_webhook_secret
SUPABASE_URL=https://xlruthqgapbgxfowavln.supabase.co
SUPABASE_KEY=твой_supabase_key
PORT=3000
```

### Шаг 4: Получение URL

1. Перейди в **Settings** → **Networking**
2. Нажми **Generate Domain**
3. Получишь URL: `https://zenex-backend.up.railway.app`

### Шаг 5: Обновление frontend

Замени URL в `shop.html` и `payment-success.html` на:
```
https://zenex-backend.up.railway.app
```

✅ Готово!

---

## ⚡ Вариант 3: Vercel - 3 минуты (Самый простой)

### Почему Vercel?
- ✅ Полностью бесплатный
- ✅ Мгновенный деплой
- ✅ Отличная производительность

### Шаг 1: Подготовка

Создай файл `vercel.json` в корне проекта:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/health",
      "dest": "backend/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Шаг 2: Деплой

```bash
# Установи Vercel CLI
npm install -g vercel

# Войди
vercel login

# Деплой
vercel

# Добавь переменные окружения
vercel env add XSOLLA_MERCHANT_ID
vercel env add XSOLLA_PROJECT_ID
vercel env add XSOLLA_API_KEY
vercel env add XSOLLA_WEBHOOK_SECRET
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY

# Продакшен деплой
vercel --prod
```

Получишь URL: `https://zenex-client.vercel.app`

✅ Готово!

---

## 📝 Обновление frontend для продакшена

### Создай файл `config.js`:

```javascript
// config.js
const CONFIG = {
  BACKEND_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://zenex-backend.onrender.com' // Твой продакшен URL
};
```

### Обнови `shop.html`:

```html
<!-- Добавь перед закрывающим </body> -->
<script src="./config.js"></script>

<script>
  // В функции processPayment замени:
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/payment/create`, {
    // ...
  });
</script>
```

### Обнови `payment-success.html`:

```html
<script src="./config.js"></script>

<script>
  const BACKEND_URL = CONFIG.BACKEND_URL;
  // Остальной код без изменений
</script>
```

---

## 🔄 Автоматический деплой

### Для Render/Railway:

1. Пуш в GitHub автоматически деплоит
2. Не нужно ничего делать вручную

```bash
git add .
git commit -m "Update backend"
git push
```

Через 2-3 минуты изменения будут на продакшене!

---

## 🧪 Проверка деплоя

### Проверь health endpoint:

```bash
curl https://твой-backend-url.com/health
```

Должен вернуть:
```json
{"status":"ok","timestamp":"..."}
```

### Проверь создание платежа:

```bash
curl -X POST https://твой-backend-url.com/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test",
    "productName": "Test",
    "amount": 100,
    "email": "test@test.com"
  }'
```

---

## 🔐 Настройка CORS для продакшена

Обнови `backend/server.js`:

```javascript
// Вместо:
app.use(cors());

// Используй:
app.use(cors({
  origin: [
    'http://localhost:5500',
    'https://твой-домен.com',
    'https://твой-домен.netlify.app'
  ],
  credentials: true
}));
```

---

## 📊 Мониторинг

### Render:
- Логи: Dashboard → Logs
- Метрики: Dashboard → Metrics

### Railway:
- Логи: Project → Deployments → View Logs
- Метрики: Project → Metrics

### Vercel:
- Логи: Dashboard → Functions → Logs
- Аналитика: Dashboard → Analytics

---

## 💰 Стоимость

### Render (Free):
- ✅ 750 часов/месяц бесплатно
- ✅ Автоматический сон после 15 минут неактивности
- ✅ Пробуждение при запросе (~30 секунд)

### Railway:
- ✅ $5 бесплатно каждый месяц
- ✅ ~500 часов работы
- ✅ Без автосна

### Vercel:
- ✅ Полностью бесплатно
- ✅ Serverless функции
- ✅ Без ограничений

---

## 🎯 Рекомендация

**Для начала:** Render.com (бесплатно, просто)
**Для роста:** Railway.app ($5/месяц, стабильно)
**Для масштаба:** Vercel (бесплатно, быстро)

---

## ✅ Чеклист деплоя

- [ ] Выбрал хостинг (Render/Railway/Vercel)
- [ ] Зарегистрировался
- [ ] Создал проект
- [ ] Добавил переменные окружения
- [ ] Задеплоил backend
- [ ] Получил URL
- [ ] Обновил frontend (shop.html, payment-success.html)
- [ ] Обновил webhook URL в Xsolla
- [ ] Протестировал health endpoint
- [ ] Протестировал создание платежа
- [ ] Протестировал webhook

---

## 🚀 Готово!

Backend теперь работает 24/7 на продакшене!

Следующий шаг: Обнови URL в frontend и протестируй платеж.
