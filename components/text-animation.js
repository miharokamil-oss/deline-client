(function() {
  'use strict';

  // Плавная анимация появления текста при печати
  function animateText(element) {
    if (!element || element.dataset.animated) return;
    
    const text = element.value || element.textContent;
    if (!text) return;
    
    // Добавляем CSS для анимации
    if (!document.getElementById('text-animation-style')) {
      const style = document.createElement('style');
      style.id = 'text-animation-style';
      style.textContent = `
        @keyframes letterSlideUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .text-animating {
          animation: letterSlideUp 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Добавляем класс анимации
    element.classList.add('text-animating');
    
    // Убираем класс после анимации
    setTimeout(() => {
      element.classList.remove('text-animating');
    }, 200);
  }

  // Отслеживаем ввод текста
  function setupTextAnimation() {
    let timeout;
    
    document.addEventListener('input', (e) => {
      const target = e.target;
      
      // Проверяем что это input или textarea
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        clearTimeout(timeout);
        
        // Добавляем небольшую задержку для плавности
        timeout = setTimeout(() => {
          animateText(target);
        }, 10);
      }
    }, true);
  }

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTextAnimation);
  } else {
    setupTextAnimation();
  }
})();
