# 🚀 Деплой за 3 минуты - Render.com (БЕСПЛАТНО)

## ✅ Что уже готово:
- Backend код готов
- Конфигурационные файлы созданы
- Frontend автоматически переключается между локальным и продакшен

---

## 📋 Шаг 1: Создай GitHub репозиторий (1 минута)

Если еще не создал:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/твой-username/zenex-client.git
git push -u origin main
```

---

## 🌐 Шаг 2: Деплой на Render.com (2 минуты)

### 1. Регистрация
👉 Открой [https://render.com/](https://render.com/)
- Нажми **Get Started for Free**
- Войди через GitHub

### 2. Создание Web Service
- Нажми **New +** → **Web Service**
- Выбери свой репозиторий `zenex-client`
- Настройки:
  - **Name:** `zenex-backend`
  - **Root Directory:** `backend`
  - **Environment:** `Node`
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Plan:** `Free`

### 3. Добавь переменные окружения

Нажми **Advanced** → **Add Environment Variable**:

```
XSOLLA_MERCHANT_ID = твой_merchant_id
XSOLLA_PROJECT_ID = твой_project_id
XSOLLA_API_KEY = твой_api_key
XSOLLA_WEBHOOK_SECRET = твой_webhook_secret
SUPABASE_URL = https://xlruthqgapbgxfowavln.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic
PORT = 10000
```

### 4. Деплой
- Нажми **Create Web Service**
- Подожди 2-3 минуты
- Получишь URL: `https://zenex-backend.onrender.com`

---

## 🔧 Шаг 3: Обнови config.js (30 секунд)

Открой файл `config.js` и замени URL:

```javascript
const CONFIG = {
  BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://zenex-backend.onrender.com', // ← Вставь свой URL
  
  ENVIRONMENT: window.location.hostname === 'localhost' ? 'development' : 'production'
};
```

---

## 🔗 Шаг 4: Настрой webhook в Xsolla (30 секунд)

1. Открой [Xsolla Publisher Account](https://publisher.xsolla.com/)
2. Перейди в **Project settings** → **Webhooks**
3. Вставь URL:
```
https://zenex-backend.onrender.com/api/payment/webhook
```
4. Сохрани

---

## ✅ Шаг 5: Проверка (30 секунд)

### Проверь health endpoint:
Открой в браузере:
```
https://zenex-backend.onrender.com/health
```

Должен вернуть:
```json
{"status":"ok","timestamp":"..."}
```

### Протестируй платеж:
1. Открой свой сайт
2. Магазин → Купить
3. Xsolla → Оплатить
4. Тестовая карта: `4111 1111 1111 1111`

---

## 🎉 Готово!

Backend теперь работает 24/7 на продакшене!

### Что дальше:

1. **Деплой frontend на Netlify** (опционально):
   - Перетащи папку проекта на [netlify.com/drop](https://app.netlify.com/drop)
   - Получишь URL: `https://твой-сайт.netlify.app`

2. **Автоматический деплой**:
   - Каждый `git push` автоматически обновит backend
   - Не нужно ничего делать вручную

3. **Мониторинг**:
   - Логи: Render Dashboard → Logs
   - Метрики: Render Dashboard → Metrics

---

## 🐛 Проблемы?

### Backend не запускается:
1. Проверь логи в Render Dashboard
2. Проверь переменные окружения
3. Убедись, что все ключи правильные

### Webhook не работает:
1. Проверь URL в Xsolla
2. Проверь логи в Render
3. Убедись, что WEBHOOK_SECRET правильный

### Платеж не создается:
1. F12 → Console → ищи ошибки
2. Проверь, что backend доступен
3. Проверь CORS настройки

---

## 💰 Бесплатный план Render:

- ✅ 750 часов/месяц бесплатно
- ✅ Автоматический сон после 15 минут неактивности
- ✅ Пробуждение при запросе (~30 секунд первый запрос)
- ✅ HTTPS из коробки
- ✅ Автоматический деплой из GitHub

---

## 📊 Альтернативы:

Если Render не подходит:
- **Railway.app** - $5/месяц, без автосна
- **Vercel** - бесплатно, serverless
- **Heroku** - $5/месяц, стабильно

Инструкции в файле `DEPLOY_GUIDE.md`

---

⏱️ Время: 3-5 минут
💰 Стоимость: БЕСПЛАТНО
🎯 Результат: Backend работает 24/7

**Начни сейчас:** [render.com](https://render.com/)
