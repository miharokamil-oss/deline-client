// Конфигурация для автоматического переключения между локальным и продакшен backend
const CONFIG = {
  // Автоматически определяет окружение
  BACKEND_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://deline-backend.onrender.com',
  
  // Другие настройки
  ENVIRONMENT: window.location.hostname === 'localhost' ? 'development' : 'production'
};

// Логирование для отладки
console.log('🔧 CONFIG:', CONFIG);
