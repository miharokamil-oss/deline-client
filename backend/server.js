const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Xsolla credentials
const XSOLLA_PROJECT_ID = process.env.XSOLLA_PROJECT_ID;
const XSOLLA_MERCHANT_ID = process.env.XSOLLA_MERCHANT_ID;
const XSOLLA_API_KEY = process.env.XSOLLA_API_KEY;
const XSOLLA_WEBHOOK_SECRET = process.env.XSOLLA_WEBHOOK_SECRET;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5500',
      'http://localhost:3000',
      'http://127.0.0.1:5500',
      'https://deline-backend.onrender.com',
      'https://zenexdls.fun'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app') || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Groq API
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Supabase Client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://xlruthqgapbgxfowavln.supabase.co',
  process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic'
);

// Системный промпт
const SYSTEM_PROMPT = `Ты — сотрудник технической поддержки чита Deline для Minecraft 1.21.4. Чит работает через кастомный лоадер.

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
- Название: Deline Client
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

    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // Создаем запись в БД
    const { error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_id: orderId,
        user_id: userId,
        product_name: productName,
        amount: amount,
        status: 'pending',
        metadata: { email }
      }]);

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
        id: { value: String(userId) },
        email: { value: email }
      },
      settings: {
        project_id: parseInt(XSOLLA_PROJECT_ID),
        currency: 'RUB',
        language: 'ru',
        return_url: `https://zenexdls.fun/payment-success.html?order_id=${orderId}`
      },
      purchase: {
        items: [
          {
            sku: `product_${Date.now()}`,
            name: productName,
            quantity: 1,
            price: {
              amount: parseFloat(amount),
              currency: 'RUB'
            }
          }
        ]
      },
      custom_parameters: {
        order_id: orderId
      }
    };

    // Правильный endpoint для создания токена
    const xsollaResponse = await fetch(`https://store.xsolla.com/api/v2/project/${XSOLLA_PROJECT_ID}/admin/payment/token`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${XSOLLA_MERCHANT_ID}:${XSOLLA_API_KEY}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!xsollaResponse.ok) {
      const errorText = await xsollaResponse.text();
      console.error('Xsolla API error:', errorText);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to create payment token',
        details: errorText
      });
    }

    const xsollaData = await xsollaResponse.json();
    const paymentToken = xsollaData.token;

    // Обновляем заказ с токеном
    await supabase
      .from('orders')
      .update({ payment_token: paymentToken })
      .eq('order_id', orderId);

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

    const signature = req.headers['authorization'];
    if (!signature) {
      console.error('Missing signature');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const signatureParts = signature.split(' ');
    if (signatureParts[0] !== 'Signature' || !signatureParts[1]) {
      console.error('Invalid signature format');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const receivedSignature = signatureParts[1];
    
    const requestBody = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha1', XSOLLA_WEBHOOK_SECRET)
      .update(requestBody)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      console.error('Signature mismatch');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const notification = req.body;
    const notificationType = notification.notification_type;

    if (notificationType === 'payment') {
      const orderId = notification.purchase?.checkout?.custom_parameters?.order_id;
      const transactionId = notification.transaction?.id;

      if (!orderId) {
        console.error('Missing order_id in webhook');
        return res.status(400).json({ error: 'Missing order_id' });
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          completed_at: new Date().toISOString()
        })
        .eq('order_id', orderId);

      if (updateError) {
        console.error('Failed to update order:', updateError);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Order completed:', orderId);

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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Deline Backend running on http://localhost:${PORT}`);
  console.log(`📡 AI Support: http://localhost:${PORT}/api/ai-support`);
  console.log(`💳 Payment: http://localhost:${PORT}/api/payment/create`);
  console.log(`🤖 Using Groq API (llama-3.3-70b-versatile)`);
});
