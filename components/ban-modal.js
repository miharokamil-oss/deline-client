/**
 * Ban Modal Component
 * Отображает полноэкранное окно бана с отсчётом времени
 */

class BanModal {
  constructor() {
    this.overlay = null;
    this.timerInterval = null;
    this.banData = null;
  }

  /**
   * Создаёт HTML структуру окна бана
   */
  createBanHTML(banData) {
    return `
      <div class="ban-overlay" id="banOverlay">
        <div class="ban-container">
          <div class="ban-icon">
            <i class="fa-solid fa-ban"></i>
          </div>
          
          <h1 class="ban-title">ВЫ ЗАБАНЕНЫ</h1>
          <p class="ban-subtitle">Доступ к аккаунту ограничен</p>
          
          <div class="ban-info">
            <div class="ban-info-row">
              <span class="ban-info-label">Причина бана:</span>
              <span class="ban-info-value">${this.escapeHtml(banData.ban_reason || 'Не указана')}</span>
            </div>
            <div class="ban-info-row">
              <span class="ban-info-label">Дата бана:</span>
              <span class="ban-info-value">${this.formatDate(new Date())}</span>
            </div>
            <div class="ban-info-row">
              <span class="ban-info-label">Бан до:</span>
              <span class="ban-info-value">${this.formatDate(new Date(banData.ban_until))}</span>
            </div>
          </div>
          
          <div class="ban-timer">
            <span class="ban-timer-label">Осталось времени:</span>
            <div class="ban-timer-boxes">
              <div class="timer-box">
                <div class="timer-digit" id="timerDays">00</div>
                <span class="timer-label">Дней</span>
              </div>
              <div class="timer-box">
                <div class="timer-digit" id="timerHours">00</div>
                <span class="timer-label">Часов</span>
              </div>
              <div class="timer-box">
                <div class="timer-digit" id="timerMinutes">00</div>
                <span class="timer-label">Минут</span>
              </div>
              <div class="timer-box">
                <div class="timer-digit" id="timerSeconds">00</div>
                <span class="timer-label">Секунд</span>
              </div>
            </div>
          </div>
          
          <div class="ban-message">
            <i class="fa-solid fa-circle-info"></i>
            Если вы считаете, что это ошибка, обратитесь в поддержку через форму обратной связи.
          </div>
          
          <div class="ban-footer">
            Администрация Zenex Client
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Показывает окно бана
   */
  show(banData) {
    this.banData = banData;

    // Удаляем старое окно если оно есть
    const existing = document.getElementById('banOverlay');
    if (existing) existing.remove();

    // Создаём новое окно
    const html = this.createBanHTML(banData);
    document.body.insertAdjacentHTML('beforeend', html);
    this.overlay = document.getElementById('banOverlay');

    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Запускаем таймер
    this.startTimer(banData.ban_until);

    // Предотвращаем закрытие окна
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Блокируем клавиши для выхода
    this.blockKeys();
  }

  /**
   * Запускает отсчёт времени
   */
  startTimer(banUntilDate) {
    const updateTimer = () => {
      const now = new Date().getTime();
      const banEnd = new Date(banUntilDate).getTime();
      const diff = banEnd - now;

      if (diff <= 0) {
        // Бан закончился
        clearInterval(this.timerInterval);
        this.updateTimerDisplay(0, 0, 0, 0);
        
        // Очищаем данные бана в Supabase
        this.clearBanFromDatabase();
        
        // Перезагружаем страницу через 2 секунды
        setTimeout(() => {
          location.reload();
        }, 2000);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.updateTimerDisplay(days, hours, minutes, seconds);
    };

    // Первый вызов сразу
    updateTimer();

    // Обновляем каждую секунду
    this.timerInterval = setInterval(updateTimer, 1000);
  }

  /**
   * Обновляет отображение таймера
   */
  updateTimerDisplay(days, hours, minutes, seconds) {
    const pad = (n) => String(n).padStart(2, '0');

    const daysEl = document.getElementById('timerDays');
    const hoursEl = document.getElementById('timerHours');
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minutesEl) minutesEl.textContent = pad(minutes);
    if (secondsEl) secondsEl.textContent = pad(seconds);
  }

  /**
   * Блокирует клавиши для выхода
   */
  blockKeys() {
    const blockKeyHandler = (e) => {
      // Блокируем F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'Escape')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', blockKeyHandler);
  }

  /**
   * Форматирует дату
   */
  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Moscow'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
  }

  /**
   * Экранирует HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Скрывает окно бана
   */
  hide() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    if (this.overlay) {
      this.overlay.remove();
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  /**
   * Очищает данные бана в Supabase
   */
  async clearBanFromDatabase() {
    try {
      // Получаем Supabase клиент если он доступен
      if (window.supabase && this.banData && this.banData.username) {
        const sb = window.supabase.createClient(
          'https://xlruthqgapbgxfowavln.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic'
        );

        // Очищаем данные бана
        const { error } = await sb.from('users').update({
          ban: false,
          ban_reason: null,
          ban_until: null
        }).eq('username', this.banData.username);

        if (error) {
          console.error('❌ Ошибка при очистке бана:', error);
        } else {
          console.log('✅ Данные бана очищены в Supabase');
        }
      }
    } catch (e) {
      console.error('❌ Ошибка при очистке бана:', e);
    }
  }
}

// Создаём глобальный экземпляр
window.banModal = new BanModal();
