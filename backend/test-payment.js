// Скрипт для тестирования создания платежа
require('dotenv').config();

const testPayment = async () => {
  console.log('🧪 Тестирование создания платежа...\n');

  // Проверка переменных окружения
  console.log('📋 Проверка конфигурации:');
  console.log('✓ XSOLLA_MERCHANT_ID:', process.env.XSOLLA_MERCHANT_ID ? '✅ Установлен' : '❌ Не установлен');
  console.log('✓ XSOLLA_PROJECT_ID:', process.env.XSOLLA_PROJECT_ID ? '✅ Установлен' : '❌ Не установлен');
  console.log('✓ XSOLLA_API_KEY:', process.env.XSOLLA_API_KEY ? '✅ Установлен' : '❌ Не установлен');
  console.log('✓ XSOLLA_WEBHOOK_SECRET:', process.env.XSOLLA_WEBHOOK_SECRET ? '✅ Установлен' : '❌ Не установлен');
  console.log('✓ SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Установлен' : '❌ Не установлен');
  console.log('✓ SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Установлен' : '❌ Не установлен');

  if (!process.env.XSOLLA_MERCHANT_ID || !process.env.XSOLLA_PROJECT_ID || !process.env.XSOLLA_API_KEY) {
    console.log('\n❌ Ошибка: Не все переменные Xsolla установлены!');
    console.log('📝 Заполни файл backend/.env согласно инструкции в XSOLLA_SETUP.md');
    return;
  }

  console.log('\n🚀 Отправка тестового запроса к Xsolla API...');

  try {
    const paymentData = {
      user: {
        id: { value: 'test-user-123' },
        email: { value: 'test@example.com' }
      },
      settings: {
        project_id: parseInt(process.env.XSOLLA_PROJECT_ID),
        currency: 'RUB',
        language: 'ru'
      },
      purchase: {
        checkout: {
          amount: 100,
          currency: 'RUB'
        },
        description: {
          value: 'Test Product'
        }
      },
      custom_parameters: {
        order_id: 'TEST-' + Date.now()
      }
    };

    const response = await fetch(
      `https://store.xsolla.com/api/v2/project/${process.env.XSOLLA_PROJECT_ID}/payment/token`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            process.env.XSOLLA_MERCHANT_ID + ':' + process.env.XSOLLA_API_KEY
          ).toString('base64'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log('\n❌ Ошибка от Xsolla API:');
      console.log(errorText);
      console.log('\n💡 Проверь:');
      console.log('1. Правильность XSOLLA_MERCHANT_ID');
      console.log('2. Правильность XSOLLA_PROJECT_ID');
      console.log('3. Правильность XSOLLA_API_KEY');
      console.log('4. Что проект активен в Xsolla Publisher Account');
      return;
    }

    const data = await response.json();
    console.log('\n✅ Успешно! Токен получен:');
    console.log('Token:', data.token);
    console.log('\n🔗 URL для оплаты:');
    console.log(`https://secure.xsolla.com/paystation3/?token=${data.token}`);
    console.log('\n✅ Интеграция работает корректно!');
    console.log('📝 Теперь можешь тестировать через сайт');

  } catch (error) {
    console.log('\n❌ Ошибка при тестировании:');
    console.log(error.message);
  }
};

testPayment();
