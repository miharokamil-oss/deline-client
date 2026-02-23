// ── Universal Theme Handler ──
(function() {
  'use strict';
  
  // Применяем сохраненную тему МГНОВЕННО при загрузке скрипта
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  // Слушаем изменения темы из других вкладок
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      if (e.newValue === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    }
  });
})();
