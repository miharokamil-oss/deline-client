const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Разрешаем запросы без origin (мобильные приложения, Postman)
    if (!origin) return callback(null, true);
    
    // Список разрешенных доменов
    const allowedOrigins = [
      'http://localhost:5500',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'https://zenex-backend.onrender.com',
      // Добавь свой домен после деплоя frontend:
      // 'https://твой-сайт.netlify.app',
      // 'https://твой-домен.com'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Временно разрешаем все для тестирования
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Groq API (для AI поддержки)
// ВАЖНО: Добавь свой ключ в переменные окружения на Render.com!
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'your_groq_api_key_here';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Supabase Client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xlruthqgapbgxfowavln.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic'
);

// Системный промпт
const SYSTEM_PROMPT = `Ты — сотрудник технической поддержки чита Zenex для Minecraft 1.21.4. Чит работает через кастомный лоадер.

Твоя задача — кратко, уверенно и по делу отвечать пользователям. Пиши простым и понятным языком, без лишней воды. Ответы должны выглядеть как живое общение поддержки.

ОСНОВНЫЕ ПРАВИЛА:

1. Ошибки запуска НЕ связаны с HWID и НЕ связаны с подпиской. Сообщай, что проблема может быть связана с:
   - необходимостью включить VPN
   - либо переустановить клиент

2. Если пользователь спрашивает, как купить чит из Украины — отвечай:
   "На сайте установлена универсальная платёжная система Xsolla, которая поддерживает все виды оплаты."

3. Если пишет «неправильный HWID» — отвечай:
   "Если пишет, что неправильный HWID, значит вы уже запускали чит на другом компьютере. Сброс HWID вы можете купить в разделе Shop за 249 рублей."

4. Если возникают похожие или любые другие типичные ошибки (не запускается, вылетает, не грузится, ошибка подключения и т.п.) — отвечай, что нужно:
   - полностью закрыть клиент
   - перезапустить ПК
   - запустить от имени администратора
   - переустановить клиент
   - включить VPN
   
   Если ошибка сохраняется — попросить отправить скриншот ошибки.

5. Отвечай уверенно, без сомнений.

6. Не обсуждай защиту, обходы и внутренние механики.

7. Не признавай вину продукта — всегда предлагай решение.

ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:
- Название: Zenex Client
- Платформа: Minecraft Java Edition 1.21.4 (кастомный лоадер)
- Функции: читы для PvP, визуальные улучшения, автоматизация
- Подписка: активируется через ключи в профиле
- HWID: привязка к компьютеру, сброс за 249₽ в Shop
- Установка: скачай лаунчер с сайта, запусти
- Активация: введи ключ в профиле на сайте

Отвечай максимум 2-3 предложения. Будь конкретным и полезным.`;

// Endpoint для AI ответов
app.post('/api/ai-support', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    console.log('Received request for AI response');
    console.log('Messages count:', messages.length);

    // Вызов Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Groq API error');
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;
    
    console.log('AI Response:', aiMessage);

    res.json({ message: aiMessage });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ══════════════════════════════════════════════════════════
// XSOLLA PAYMENT INTEGRATION
// ══════════════════════════════════════════════════════════

// Создание платежа через Xsolla
app.post('/api/payment/create', async (req, res) => {
  try {
    const { userId, productName, amount, email } = req.body;

    if (!userId || !productName || !amount || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Генерируем уникальный ID заказа
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Создаем запись в БД
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        user_id: userId,
        product_name: productName,
        amount: amount,
        status: 'pending',
        metadata: { email }
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Database error:', orderError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create order' 
      });
    }

    // Создаем токен платежа для Xsolla
    const paymentData = {
      user: {
        id: { value: userId },
        email: { value: email }
      },
      settings: {
        project_id: parseInt(process.env.XSOLLA_PROJECT_ID),
        currency: 'RUB',
        language: 'ru'
      },
      purchase: {
        checkout: {
          amount: parseFloat(amount),
          currency: 'RUB'
        },
        description: {
          value: productName
        }
      },
      custom_parameters: {
        order_id: orderId
      }
    };

    // Вызов Xsolla API для создания токена
    const xsollaResponse = await fetch('https://store.xsolla.com/api/v2/paystation/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.XSOLLA_MERCHANT_ID + ':' + process.env.XSOLLA_API_KEY).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!xsollaResponse.ok) {
      const errorText = await xsollaResponse.text();
      console.error('Xsolla API error:', errorText);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create payment token' 
      });
    }

    const xsollaData = await xsollaResponse.json();
    const paymentToken = xsollaData.token;

    // Обновляем заказ с токеном
    await supabase
      .from('orders')
      .update({ payment_token: paymentToken })
      .eq('order_id', orderId);

    // Формируем URL для оплаты
    const paymentUrl = `https://secure.xsolla.com/paystation3/?token=${paymentToken}`;

    console.log('Payment created:', { orderId, paymentUrl });

    res.json({
      success: true,
      orderId: orderId,
      paymentUrl: paymentUrl,
      token: paymentToken
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Webhook для получения уведомлений от Xsolla
app.post('/api/payment/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    // Проверка подписи Xsolla
    const signature = req.headers['authorization'];
    if (!signature) {
      console.error('Missing signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Извлекаем подпись
    const signatureParts = signature.split(' ');
    if (signatureParts[0] !== 'Signature' || !signatureParts[1]) {
      console.error('Invalid signature format');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const receivedSignature = signatureParts[1];
    
    // Вычисляем ожидаемую подпись
    const requestBody = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha1', process.env.XSOLLA_WEBHOOK_SECRET)
      .update(requestBody)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      console.error('Signature mismatch');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Обрабатываем уведомление
    const notification = req.body;
    const notificationType = notification.notification_type;

    if (notificationType === 'payment') {
      const orderId = notification.purchase?.checkout?.custom_parameters?.order_id;
      const transactionId = notification.transaction?.id;
      const paymentAmount = notification.purchase?.checkout?.amount;

      if (!orderId) {
        console.error('Missing order_id in webhook');
        return res.status(400).json({ error: 'Missing order_id' });
      }

      // Обновляем статус заказа
      const { data: order, error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          completed_at: new Date().toISOString()
        })
        .eq('order_id', orderId)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Order completed:', orderId);

      // TODO: Здесь добавить логику выдачи товара пользователю
      // Например, активация подписки, добавление ключа и т.д.

      res.status(204).send();
    } else if (notificationType === 'refund') {
      const orderId = notification.purchase?.checkout?.custom_parameters?.order_id;

      if (orderId) {
        await supabase
          .from('orders')
          .update({ status: 'refunded' })
          .eq('order_id', orderId);

        console.log('Order refunded:', orderId);
      }

      res.status(204).send();
    } else {
      console.log('Unknown notification type:', notificationType);
      res.status(204).send();
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Проверка статуса заказа
app.get('/api/payment/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order: {
        orderId: order.order_id,
        status: order.status,
        productName: order.product_name,
        amount: order.amount,
        createdAt: order.created_at,
        completedAt: order.completed_at
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});

// ═══════════════════════════════════════════════════════════
// XSOLLA PAYMENT INTEGRATION
// ═══════════════════════════════════════════════════════════

// Создание платежного токена Xsolla
app.post('/api/payment/create', async (req, res) => {
  try {
    const { userId, productName, amount, email } = req.body;

    if (!userId || !productName || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Генерируем уникальный ID заказа
    const orderId = `order_${Date.now()}_${userId}`;

    // Создаем токен для Xsolla Pay Station
    const paymentData = {
      user: {
        id: { value: userId },
        email: { value: email || `user${userId}@zenex.local` }
      },
      settings: {
        project_id: parseInt(XSOLLA_PROJECT_ID),
        currency: 'RUB',
        language: 'ru',
        return_url: `${req.headers.origin || 'http://localhost:3000'}/payment-success.html?order_id=${orderId}&product=${encodeURIComponent(productName)}&amount=${amount}`,
        ui: {
          theme: 'default'
        }
      },
      purchase: {
        checkout: {
          amount: parseFloat(amount),
          currency: 'RUB'
        },
        description: {
          value: productName
        }
      },
      custom_parameters: {
        order_id: orderId,
        product_name: productName
      }
    };

    // Отправляем запрос к Xsolla API
    const response = await fetch('https://store.xsolla.com/api/v2/paystation3/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${XSOLLA_MERCHANT_ID}:${XSOLLA_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Xsolla API error');
    }

    const data = await response.json();

    // Сохраняем информацию о заказе в БД
    await supabase.from('orders').insert({
      order_id: orderId,
      user_id: userId,
      product_name: productName,
      amount: amount,
      status: 'pending',
      payment_token: data.token,
      created_at: new Date().toISOString()
    });

    console.log('Payment token created:', { orderId, token: data.token });

    res.json({
      success: true,
      token: data.token,
      orderId: orderId,
      paymentUrl: `https://secure.xsolla.com/paystation3/?token=${data.token}`
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      error: 'Failed to create payment',
      details: error.message
    });
  }
});

// Webhook для получения уведомлений от Xsolla
app.post('/api/payment/webhook', async (req, res) => {
  try {
    // Проверяем подпись webhook
    const signature = req.headers['authorization'];
    
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha1', XSOLLA_WEBHOOK_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');
      
      if (signature !== `Signature ${expectedSignature}`) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const notification = req.body;
    console.log('Webhook received:', notification);

    // Обрабатываем уведомление о платеже
    if (notification.notification_type === 'payment') {
      const { user, purchase, transaction } = notification;
      const orderId = purchase?.custom_parameters?.order_id;
      const userId = user?.id;

      if (!orderId || !userId) {
        console.error('Missing order_id or user_id in webhook');
        return res.status(400).json({ error: 'Invalid webhook data' });
      }

      // Обновляем статус заказа
      await supabase
        .from('orders')
        .update({
          status: 'completed',
          transaction_id: transaction?.id,
          completed_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      // Активируем подписку пользователя
      const productName = purchase?.description?.value || '';
      let subscriptionDays = 0;

      // Определяем длительность подписки
      if (productName.includes('month')) subscriptionDays = 30;
      else if (productName.includes('year')) subscriptionDays = 365;
      else if (productName.includes('lifetime')) subscriptionDays = 36500; // 100 лет
      else if (productName.includes('Beta')) subscriptionDays = 30;

      if (subscriptionDays > 0) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + subscriptionDays);

        await supabase
          .from('users')
          .update({
            subscription_active: true,
            subscription_expires: expiresAt.toISOString()
          })
          .eq('id', userId);

        console.log(`Subscription activated for user ${userId} until ${expiresAt}`);
      }

      // Если это сброс HWID
      if (productName.includes('HWID')) {
        await supabase
          .from('users')
          .update({ hwid: null })
          .eq('id', userId);

        console.log(`HWID reset for user ${userId}`);
      }

      console.log('Payment processed successfully:', orderId);
    }

    res.status(204).send();

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Проверка статуса заказа
app.get('/api/payment/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      orderId: data.order_id,
      status: data.status,
      productName: data.product_name,
      amount: data.amount,
      createdAt: data.created_at,
      completedAt: data.completed_at
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 AI Support Backend running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/ai-support`);
  console.log(`🤖 Using Groq API (llama-3.3-70b-versatile)`);
});
