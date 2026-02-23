/**
 * Ban Checker Component
 * Проверяет статус бана пользователя на каждой странице
 */

class BanChecker {
  constructor() {
    this.checkInterval = null;
  }

  /**
   * Инициализирует проверку бана
   */
  init() {
    // Проверяем при загрузке
    this.checkBan();
    
    // Проверяем каждые 5 секунд
    this.checkInterval = setInterval(() => {
      this.checkBan();
    }, 5000);
  }

  /**
   * Проверяет статус бана пользователя
   */
  checkBan() {
    const saved = localStorage.getItem('currentUser');
    if (!saved) return;

    try {
      const user = JSON.parse(saved);
      
      // Если нет данных о бане, пропускаем
      if (!user.ban || !user.ban_until) return;

      const banUntil = new Date(user.ban_until).getTime();
      const now = new Date().getTime();

      // Если бан активен
      if (user.ban && banUntil > now) {
        // Показываем окно бана если оно ещё не показано
        if (window.banModal && !document.getElementById('banOverlay')) {
          console.log('🚫 Ban detected, showing ban modal');
          window.banModal.show(user);
        }
      }
    } catch (e) {
      console.error('Error checking ban:', e);
    }
  }

  /**
   * Останавливает проверку бана
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// Создаём глобальный экземпляр
window.banChecker = new BanChecker();

// Инициализируем при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.banChecker.init();
  });
} else {
  window.banChecker.init();
}
