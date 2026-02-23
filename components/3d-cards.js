(function() {
  'use strict';

  // 3D эффект наклона карточек при наведении
  function init3DCards() {
    const cards = document.querySelectorAll(`
      .feature-card,
      .product-card,
      .info-row,
      .action-item,
      .client-item,
      .stat-card,
      .promo-card
    `);

    cards.forEach(card => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      card.style.transformStyle = 'preserve-3d';

      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateZ(10px)';
      });

      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Уменьшенный угол поворота (макс 6 градусов)
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        this.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateZ(10px)
          scale3d(1.02, 1.02, 1.02)
        `;
        
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
      });

      card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale3d(1, 1, 1)';
        this.style.boxShadow = '';
      });
    });
  }

  // Инициализация при загрузке и при изменении DOM
  function setup() {
    init3DCards();
    
    // Переинициализация при добавлении новых карточек
    const observer = new MutationObserver(() => {
      init3DCards();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
