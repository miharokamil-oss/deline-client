// Быстрая проверка настройки
require('dotenv').config();

console.log('🔍 Проверка настройки Xsolla интеграции\n');

const checks = [
  {
    name: 'XSOLLA_MERCHANT_ID',
    value: process.env.XSOLLA_MERCHANT_ID,
    required: true
  },
  {
    name: 'XSOLLA_PROJECT_ID',
    value: process.env.XSOLLA_PROJECT_ID,
    required: true
  },
  {
    name: 'XSOLLA_API_KEY',
    value: process.env.XSOLLA_API_KEY,
    required: true
  },
  {
    name: 'XSOLLA_WEBHOOK_SECRET',
    value: process.env.XSOLLA_WEBHOOK_SECRET,
    required: true
  },
  {
    name: 'SUPABASE_URL',
    value: process.env.SUPABASE_URL,
    required: true
  },
  {
    name: 'SUPABASE_KEY',
    value: process.env.SUPABASE_KEY,
    required: true
  }
];

let allGood = true;

checks.forEach(check => {
  const status = check.value && check.value !== `your_${check.name.toLowerCase()}_here` ? '✅' : '❌';
  const isSet = check.value && check.value !== `your_${check.name.toLowerCase()}_here`;
  
  if (check.required && !isSet) {
    allGood = false;
  }

  console.log(`${status} ${check.name}: ${isSet ? 'Установлен' : 'НЕ УСТАНОВЛЕН'}`);
});

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('✅ Все переменные окружения настроены!');
  console.log('\n📝 Следующие шаги:');
  console.log('1. Запусти backend: npm start');
  console.log('2. Запусти ngrok: ngrok http 3000');
  console.log('3. Настрой webhook URL в Xsolla');
  console.log('4. Протестируй оплату через сайт');
  console.log('\n💡 Для тестирования API запусти: node test-payment.js');
} else {
  console.log('❌ Не все переменные настроены!');
  console.log('\n📝 Что нужно сделать:');
  console.log('1. Открой файл backend/.env');
  console.log('2. Заполни все переменные XSOLLA_*');
  console.log('3. Следуй инструкциям в XSOLLA_SETUP.md');
  console.log('4. Запусти эту проверку снова: node check-setup.js');
}

console.log('='.repeat(50) + '\n');
