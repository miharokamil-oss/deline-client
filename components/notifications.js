c(function() {
  'use strict';

  const SB_URL = 'https://xlruthqgapbgxfowavln.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic';
  let db = null;
  try { db = window.supabase.createClient(SB_URL, SB_KEY); } catch(e) {}

  let currentUser = null;
  let notificationContainer = null;

  // Создаем контейнер для уведомлений
  function createNotificationContainer() {
    if (notificationContainer) return;
    
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
  }

  // Показать уведомление
  function showNotification(options) {
    const {
      title = 'Уведомление',
      message = '',
      type = 'info', // info, success, warning, error, confirm
      duration = 5000,
      icon = null,
      onConfirm = null,
      onCancel = null,
      confirmText = 'Подтвердить',
      cancelText = 'Отмена'
    } = options;

    createNotificationContainer();

    const notification = document.createElement('div');
    notification.className = 'notification-item';
    notification.style.cssText = `
      background: rgba(18, 18, 24, 0.98);
      backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      pointer-events: all;
      transition: all 0.3s ease;
      animation: slideInRight 0.3s ease;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 320px;
    `;

    // Цвета по типу
    const colors = {
      info: '#4A9EFF',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#f44336',
      confirm: '#FF9800'
    };

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      confirm: '❓'
    };

    const isConfirm = type === 'confirm';

    notification.innerHTML = `
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="font-size: 24px; flex-shrink: 0;">
          ${icon || icons[type]}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: ${colors[type]}; margin-bottom: 4px; font-size: 15px;">
            ${title}
          </div>
          <div style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.5;">
            ${message}
          </div>
        </div>
        ${!isConfirm ? `
          <button class="notif-close-btn" style="
            background: none;
            border: none;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            font-size: 20px;
            padding: 0;
            width: 24px;
            height: 24px;
            flex-shrink: 0;
          ">×</button>
        ` : ''}
      </div>
      ${isConfirm ? `
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="notif-confirm-btn" style="
            flex: 1;
            background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.5));
            border: 1px solid rgba(76, 175, 80, 0.5);
            border-radius: 10px;
            padding: 10px 16px;
            color: #fff;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">${confirmText}</button>
          <button class="notif-cancel-btn" style="
            flex: 1;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 10px 16px;
            color: rgba(255,255,255,0.8);
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">${cancelText}</button>
        </div>
      ` : ''}
    `;

    // Hover эффект
    notification.addEventListener('mouseenter', () => {
      notification.style.transform = 'translateX(-5px) scale(1.02)';
      notification.style.boxShadow = '0 12px 48px rgba(0,0,0,0.6)';
    });

    notification.addEventListener('mouseleave', () => {
      notification.style.transform = 'translateX(0) scale(1)';
      notification.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4)';
    });

    // Обработчики кнопок
    const closeBtn = notification.querySelector('.notif-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        removeNotification(notification);
      });
    }

    const confirmBtn = notification.querySelector('.notif-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (onConfirm) onConfirm();
        removeNotification(notification);
      });
      
      confirmBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.5), rgba(76, 175, 80, 0.7))';
        this.style.transform = 'translateY(-1px)';
      });
      
      confirmBtn.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.5))';
        this.style.transform = 'translateY(0)';
      });
    }

    const cancelBtn = notification.querySelector('.notif-cancel-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (onCancel) onCancel();
        removeNotification(notification);
      });
      
      cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.08)';
        this.style.transform = 'translateY(-1px)';
      });
      
      cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.05)';
        this.style.transform = 'translateY(0)';
      });
    }

    notificationContainer.appendChild(notification);

    // Автоудаление (только для не-confirm)
    if (duration > 0 && !isConfirm) {
      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    }

    return notification;
  }

  function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }

  // Добавляем CSS анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100px);
      }
    }

    /* Светлая тема */
    body.light-theme .notification-item {
      background: rgba(255, 255, 255, 0.96) !important;
      border-color: rgba(0, 0, 0, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important;
    }

    body.light-theme .notification-item div {
      color: #1a1a1a !important;
    }

    body.light-theme .notification-item button {
      color: rgba(0, 0, 0, 0.5) !important;
    }
  `;
  document.head.appendChild(style);

  // Глобальная функция для показа уведомлений
  window.showNotification = showNotification;

  // Инициализация
  async function init() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson || !db) return;

    try {
      const userFromStorage = JSON.parse(userJson);
      
      const { data: fullUser } = await db
        .from('users')
        .select('*')
        .eq('uid', userFromStorage.uid)
        .single();

      if (fullUser) {
        currentUser = fullUser;
        subscribeToNotifications();
      }
    } catch(e) {
      console.error('Notification init error:', e);
    }
  }

  // Подписка на уведомления (можно расширить)
  function subscribeToNotifications() {
    if (!db || !currentUser) return;

    // Для модераторов - уведомления о новых запросах
    if (currentUser.is_moder || currentUser.is_admin) {
      db.channel('moderator_new_chats')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_chats'
        }, (payload) => {
          console.log('New support chat:', payload.new);
          
          // Получаем данные пользователя
          db.from('users')
            .select('username')
            .eq('id', payload.new.user_id)
            .single()
            .then(({ data: user }) => {
              showNotification({
                title: 'Новое обращение',
                message: `Пользователь ${user?.username || 'Неизвестный'} создал запрос в поддержку`,
                type: 'info',
                icon: '💬',
                duration: 8000
              });
            });
        })
        .subscribe();

      // Уведомления о новых сообщениях в чатах модератора
      db.channel('moderator_messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages'
        }, (payload) => {
          // Показываем только если это сообщение от пользователя (не от нас)
          if (payload.new.role === 'user' && payload.new.user_id !== currentUser.id) {
            db.from('support_chats')
              .select('*, users!support_chats_user_id_fkey(username)')
              .eq('id', payload.new.chat_id)
              .eq('moderator_id', currentUser.id)
              .single()
              .then(({ data: chat }) => {
                if (chat) {
                  showNotification({
                    title: 'Новое сообщение',
                    message: `${chat.users.username}: ${payload.new.content.substring(0, 50)}${payload.new.content.length > 50 ? '...' : ''}`,
                    type: 'info',
                    icon: '💬',
                    duration: 6000
                  });
                }
              });
          }
        })
        .subscribe();
    }

    // Для обычных пользователей - уведомления о новых сообщениях от поддержки
    if (!currentUser.is_moder && !currentUser.is_admin) {
      db.channel('user_support_messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages'
        }, (payload) => {
          // Показываем только если это ответ от поддержки
          if (payload.new.role === 'support' && payload.new.user_id !== currentUser.id) {
            // Проверяем что это наш чат
            db.from('support_chats')
              .select('id')
              .eq('id', payload.new.chat_id)
              .eq('user_id', currentUser.id)
              .single()
              .then(({ data: chat }) => {
                if (chat) {
                  showNotification({
                    title: 'Ответ от поддержки',
                    message: payload.new.content.substring(0, 60) + (payload.new.content.length > 60 ? '...' : ''),
                    type: 'success',
                    icon: '👨‍💼',
                    duration: 7000
                  });
                }
              });
          }
        })
        .subscribe();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 100);
  }
})();
