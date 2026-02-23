// ========================================
// FOOTER LOADER - Zenex Client
// ========================================
// Этот скрипт автоматически загружает footer на всех страницах

(function() {
  // Функция загрузки футера
  function loadFooter() {
    fetch('./components/footer.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Footer file not found');
        }
        return response.text();
      })
      .then(html => {
        // Создаем контейнер для футера если его нет
        let footerContainer = document.getElementById('footer-placeholder');
        
        if (!footerContainer) {
          // Если нет placeholder, добавляем footer в конец body
          footerContainer = document.createElement('div');
          footerContainer.id = 'footer-placeholder';
          document.body.appendChild(footerContainer);
        }
        
        // Вставляем HTML футера
        footerContainer.innerHTML = html;
        console.log('✅ Footer загружен');
      })
      .catch(error => {
        console.error('❌ Ошибка загрузки footer:', error);
      });
  }

  // Загружаем footer после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();
