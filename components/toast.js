// Toast Notification System
class ToastManager {
  constructor() {
    this.container = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Ждем загрузки DOM
    if (document.body) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
      this.initialized = true;
    } else {
      // Если body еще не готов, ждем
      document.addEventListener('DOMContentLoaded', () => this.init());
    }
  }

  show(message, type = 'info', duration = 4000) {
    // Инициализируем если еще не сделали
    if (!this.initialized) {
      this.init();
      // Если все еще не инициализирован, ждем немного
      if (!this.initialized) {
        setTimeout(() => this.show(message, type, duration), 100);
        return;
      }
    }
    if (!this.container) {
      console.error('Toast container not ready');
      return;
    }

    const icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    const titles = {
      success: 'Успешно',
      error: 'Ошибка',
      warning: 'Внимание',
      info: 'Информация'
    };

    // Шаг 1: Создаем начальный кружочек с восклицательным знаком
    const circle = document.createElement('div');
    circle.className = `toast-initial-circle ${type}`;
    circle.innerHTML = '!';
    document.body.appendChild(circle);

    // Добавляем пульсацию кружочка
    setTimeout(() => {
      circle.style.animation = 'circlePulse 0.6s ease-in-out';
    }, 400);

    // Шаг 2: Через 1 секунду убираем кружочек и показываем тост
    setTimeout(() => {
      circle.remove();
      
      // Создаем полноценный тост
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      toast.innerHTML = `
        <div class="toast-icon">
          <i class="fa-solid ${icons[type]}"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">${titles[type]}</div>
          <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">
          <i class="fa-solid fa-xmark"></i>
        </div>
        ${duration > 0 ? '<div class="toast-progress"></div>' : ''}
      `;

      this.container.appendChild(toast);

      // Закрытие по клику
      const closeBtn = toast.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.remove(toast));

      // Автоматическое удаление
      if (duration > 0) {
        setTimeout(() => this.remove(toast), duration + 1600);
      }

      return toast;
    }, 1000);

    return circle;
  }

  remove(toast) {
    const type = toast.className.split(' ')[1]; // Получаем тип (success, error и т.д.)
    
    // Добавляем класс для сворачивания тоста
    toast.classList.add('removing');
    
    // Ждем пока тост свернется в кружок
    setTimeout(() => {
      // Создаем кружочек на месте тоста
      const circle = document.createElement('div');
      circle.className = `toast-initial-circle ${type}`;
      circle.innerHTML = '!';
      circle.style.animation = 'none';
      circle.style.transform = 'translateX(-50%) scale(1)';
      circle.style.opacity = '1';
      document.body.appendChild(circle);

      // Удаляем тост
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }

      // Через 50ms начинаем анимацию исчезновения кружочка
      setTimeout(() => {
        circle.style.animation = 'circleDisappear 0.4s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards';
      }, 50);

      // Удаляем кружочек
      setTimeout(() => {
        if (circle.parentNode) {
          circle.parentNode.removeChild(circle);
        }
      }, 450);
    }, 600);
  }

  success(message, duration) {
    return this.show(message, 'success', duration);
  }

  error(message, duration) {
    return this.show(message, 'error', duration);
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  info(message, duration) {
    return this.show(message, 'info', duration);
  }

  confirm(message, onConfirm, onCancel) {
    console.log('🔔 Toast confirm called:', message);
    
    if (!this.initialized) {
      this.init();
      if (!this.initialized) {
        setTimeout(() => this.confirm(message, onConfirm, onCancel), 100);
        return;
      }
    }
    if (!this.container) {
      console.error('Toast container not ready');
      return;
    }

    const circle = document.createElement('div');
    circle.className = 'toast-initial-circle warning';
    circle.innerHTML = '?';
    document.body.appendChild(circle);

    setTimeout(() => {
      circle.style.animation = 'circlePulse 0.6s ease-in-out';
    }, 400);

    setTimeout(() => {
      circle.remove();
      
      const toast = document.createElement('div');
      toast.className = 'toast warning';

      toast.innerHTML = `
        <div class="toast-icon">
          <i class="fa-solid fa-circle-question"></i>
        </div>
        <div class="toast-content">
          <div class="toast-title">Подтверждение</div>
          <div class="toast-message">${message}</div>
        </div>
        <div style="display: flex; gap: 8px; margin-left: 10px;">
          <button class="toast-confirm-btn" style="background: #4CAF50; border: none; border-radius: 8px; padding: 8px 16px; color: white; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 600;">Да</button>
          <button class="toast-cancel-btn" style="background: #f44336; border: none; border-radius: 8px; padding: 8px 16px; color: white; cursor: pointer; font-family: 'Rajdhani', sans-serif; font-weight: 600;">Нет</button>
        </div>
      `;

      this.container.appendChild(toast);

      const confirmBtn = toast.querySelector('.toast-confirm-btn');
      const cancelBtn = toast.querySelector('.toast-cancel-btn');

      confirmBtn.addEventListener('click', () => {
        console.log('✅ Confirm clicked');
        this.remove(toast);
        if (onConfirm) {
          console.log('Calling onConfirm callback');
          onConfirm();
        }
      });

      cancelBtn.addEventListener('click', () => {
        console.log('❌ Cancel clicked');
        this.remove(toast);
        if (onCancel) onCancel();
      });
    }, 1000);
  }
}

// Глобальный экземпляр
const toast = new ToastManager();

// Инициализируем при загрузке
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => toast.init());
} else {
  toast.init();
}

// Переопределяем alert для совместимости
window.showToast = (message, type = 'info') => {
  toast.show(message, type);
};
