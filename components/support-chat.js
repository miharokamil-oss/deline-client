(function() {
  'use strict';

  const SB_URL = 'https://xlruthqgapbgxfowavln.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic';
  let db = null;
  try { db = window.supabase.createClient(SB_URL, SB_KEY); } catch(e) { console.error('Supabase error:', e); }

  let currentUser = null;
  let currentChatId = null;
  let messagesSubscription = null;
  let currentAttachment = null;
  let aiEnabled = true; // AI активен пока модератор не взял чат

  // Элементы
  const chatButton = document.getElementById('chatButton');
  const chatWindow = document.getElementById('chatWindow');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatBackBtn = document.getElementById('chatBackBtn');
  const chatTitle = document.getElementById('chatTitle');
  const chatSubtitle = document.getElementById('chatSubtitle');
  const chatMessages = document.getElementById('chatMessages');
  const chatClients = document.getElementById('chatClients');
  const chatInputWrapper = document.getElementById('chatInputWrapper');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatAttachment = document.getElementById('chatAttachment');
  const chatCloseTicketBtn = document.getElementById('chatCloseTicketBtn');
  const chatUserActions = document.getElementById('chatUserActions');
  const callModeratorBtn = document.getElementById('callModeratorBtn');
  const userCloseTicketBtn = document.getElementById('userCloseTicketBtn');

  // Инициализация
  async function init() {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      console.warn('No currentUser in localStorage');
      return;
    }
    
    try {
      const userFromStorage = JSON.parse(userJson);
      console.log('=== USER LOADING ===');
      console.log('User from localStorage:', userFromStorage);
      
      // ВСЕГДА получаем свежие данные из БД, игнорируем ID из localStorage
      if (!db) {
        console.error('Database not initialized');
        return;
      }
      
      if (!userFromStorage.uid) {
        console.error('No UID in localStorage');
        return;
      }
      
      console.log('Fetching user from DB by uid:', userFromStorage.uid);
      
      const { data: fullUser, error } = await db
        .from('users')
        .select('*')
        .eq('uid', userFromStorage.uid)
        .single();
      
      console.log('DB query result:', { fullUser, error });
      
      if (error) {
        console.error('Error loading user from DB:', error);
        toast.error('Ошибка загрузки пользователя из БД: ' + error.message);
        return;
      }
      
      if (!fullUser) {
        console.error('User not found in DB by uid:', userFromStorage.uid);
        toast.error('Пользователь не найден в БД');
        return;
      }
      
      // Используем ТОЛЬКО данные из БД
      currentUser = fullUser;
      console.log('=== CURRENT USER SET ===');
      console.log('Full user object:', currentUser);
      console.log('User ID from DB:', currentUser.id);
      console.log('User UID:', currentUser.uid);
      console.log('Username:', currentUser.username);
      console.log('Is moderator:', currentUser.is_moder);
      console.log('Is admin:', currentUser.is_admin);
      
      setupEventListeners();
      
      if (currentUser.is_moder || currentUser.is_admin) {
        console.log('Initializing moderator mode');
        initModeratorMode();
      } else {
        console.log('Initializing user mode');
        initUserMode();
      }
    } catch(e) {
      console.error('Init error:', e);
    }
  }

  // События
  function setupEventListeners() {
    chatButton.addEventListener('click', toggleChat);
    chatCloseBtn.addEventListener('click', closeChat);
    chatBackBtn.addEventListener('click', goBackToClients);
    chatForm.addEventListener('submit', sendMessage);
    chatAttachment.addEventListener('change', handleAttachment);
    if (chatCloseTicketBtn) {
      chatCloseTicketBtn.addEventListener('click', closeTicket);
    }
    if (callModeratorBtn) {
      callModeratorBtn.addEventListener('click', callModerator);
    }
    if (userCloseTicketBtn) {
      userCloseTicketBtn.addEventListener('click', userCloseTicket);
    }
    
    // Авторазмер textarea
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = chatInput.scrollHeight + 'px';
    });
  }

  function toggleChat() {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  }

  function closeChat() {
    chatWindow.classList.remove('open');
  }

  function goBackToClients() {
    currentChatId = null;
    chatBackBtn.classList.remove('visible');
    chatClients.classList.remove('hidden');
    chatMessages.classList.add('hidden');
    chatInputWrapper.classList.add('hidden');
    chatTitle.textContent = 'Клиенты';
    chatSubtitle.textContent = 'Активные обращения';
  }

  // ═══ РЕЖИМ ПОЛЬЗОВАТЕЛЯ ═══
  async function initUserMode() {
    chatTitle.textContent = 'Поддержка Zenex';
    chatSubtitle.textContent = 'Обычно отвечаем в течение минуты';
    
    // Показываем кнопки действий
    if (chatUserActions) {
      chatUserActions.classList.remove('hidden');
    }
    
    // Проверяем есть ли уже чат
    const { data: existingChat } = await db
      .from('support_chats')
      .select(`
        *,
        moderator:users!support_chats_moderator_id_fkey(username)
      `)
      .eq('user_id', currentUser.id)
      .in('status', ['ai', 'waiting', 'open'])
      .single();

    if (existingChat) {
      currentChatId = existingChat.id;
      
      // Обновляем UI в зависимости от статуса
      if (existingChat.status === 'waiting') {
        aiEnabled = false;
        chatSubtitle.textContent = 'Ожидаем модератора...';
      } else if (existingChat.status === 'open' && existingChat.moderator) {
        aiEnabled = false;
        chatTitle.textContent = `${existingChat.moderator.username} - Поддержка`;
      }
      
      loadMessages();
    } else {
      // Приветственное сообщение от AI
      addMessage({
        role: 'support',
        content: 'Здравствуйте! Чем могу сегодня вам помочь?',
        created_at: new Date().toISOString()
      });
    }

    subscribeToMessages();
    subscribeToChatsForUser();
  }
  
  // Подписка на изменения чата для пользователя (чтобы видеть когда модератор взял обращение)
  function subscribeToChatsForUser() {
    if (!db || !currentUser) return;
    
    db.channel('user_chat_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'support_chats',
        filter: `user_id=eq.${currentUser.id}`
      }, async (payload) => {
        console.log('Chat updated:', payload.new);
        
        // Если назначен модератор - обновляем заголовок
        if (payload.new.moderator_id) {
          const { data: moderator } = await db
            .from('users')
            .select('username')
            .eq('id', payload.new.moderator_id)
            .single();
          
          if (moderator) {
            chatTitle.textContent = `${moderator.username} • Поддержка`;
          }
        }
      })
      .subscribe();
  }

  // ═══ РЕЖИМ МОДЕРАТОРА ═══
  async function initModeratorMode() {
    chatTitle.textContent = 'Клиенты';
    chatSubtitle.textContent = 'Активные обращения';
    chatMessages.classList.add('hidden');
    chatInputWrapper.classList.add('hidden');
    chatClients.classList.remove('hidden');
    
    loadClients();
    subscribeToChats();
  }

  async function loadClients() {
    if (!db) return;
    
    console.log('Loading clients...');
    
    // Админы видят все чаты, модераторы только активные
    const statusFilter = currentUser.is_admin ? ['ai', 'waiting', 'open', 'closed'] : ['ai', 'waiting', 'open'];
    
    const { data: chats, error } = await db
      .from('support_chats')
      .select(`
        *,
        users!support_chats_user_id_fkey(id, uid, username, avatar),
        moderator:users!support_chats_moderator_id_fkey(username)
      `)
      .in('status', statusFilter)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Load clients error:', error);
      return;
    }

    console.log('Loaded chats:', chats);

    chatClients.innerHTML = '';
    
    if (!chats || chats.length === 0) {
      chatClients.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.4);">Нет активных обращений</div>';
      return;
    }

    chats.forEach((chat, index) => {
      const clientEl = document.createElement('div');
      clientEl.className = 'client-item';
      if (chat.status === 'closed') {
        clientEl.classList.add('closed');
      }
      clientEl.onclick = () => openClientChat(chat);
      
      const isTaken = chat.moderator_id && chat.moderator_id !== currentUser.id;
      let statusClass, statusText;
      
      if (chat.status === 'closed') {
        statusClass = 'closed';
        statusText = 'Обращение Закрыто';
      } else if (chat.moderator_id) {
        // Если есть модератор
        if (chat.moderator_id === currentUser.id) {
          statusClass = 'taken';
          statusText = 'Вы взяли';
        } else {
          statusClass = 'taken';
          statusText = 'Обращение Забрано';
        }
      } else {
        statusClass = 'free';
        statusText = 'Обращение Свободно';
      }
      
      const moderatorInfo = chat.status === 'closed' && chat.moderator ? 
        `<div class="client-moderator-info">Модер: ${chat.moderator.username} • Клиент: ${chat.users.username}</div>` : '';
      
      clientEl.innerHTML = `
        <div class="client-avatar">
          ${chat.users.avatar ? `<img src="${chat.users.avatar}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">` : '👤'}
          <div class="client-online-status ${chat.status === 'closed' ? 'offline' : 'online'}"></div>
        </div>
        <div class="client-info">
          <div class="client-name">${chat.users.username}</div>
          <div class="client-request">Запрос №${chat.id}</div>
          ${moderatorInfo}
        </div>
        <div class="client-status ${statusClass}">${statusText}</div>
      `;
      
      chatClients.appendChild(clientEl);
    });
  }

  async function openClientChat(chat) {
    currentChatId = chat.id;
    aiEnabled = false; // Отключаем AI когда модератор берет чат
    
    console.log('Opening chat:', chat);
    console.log('Chat status:', chat.status);
    console.log('Close button element:', chatCloseTicketBtn);
    
    // Назначаем модератора и меняем статус на 'open' если чат в статусе 'ai' или 'waiting'
    if (!chat.moderator_id && (chat.status === 'ai' || chat.status === 'waiting')) {
      await db
        .from('support_chats')
        .update({ 
          moderator_id: currentUser.id,
          status: 'open'
        })
        .eq('id', chat.id);
      
      chat.status = 'open'; // Обновляем локально
    }
    
    chatBackBtn.classList.add('visible');
    chatClients.classList.add('hidden');
    chatMessages.classList.remove('hidden');
    chatInputWrapper.classList.remove('hidden');
    chatTitle.textContent = `${currentUser.username} • Служба поддержки`;
    chatSubtitle.textContent = `Чат с ${chat.users.username}`;
    
    // Показываем кнопку закрытия только для открытых чатов
    if (chat.status === 'open' && chatCloseTicketBtn) {
      console.log('Showing close button');
      chatCloseTicketBtn.classList.remove('hidden');
      chatCloseTicketBtn.style.display = 'block';
    } else if (chatCloseTicketBtn) {
      console.log('Hiding close button');
      chatCloseTicketBtn.classList.add('hidden');
      chatCloseTicketBtn.style.display = 'none';
    }
    
    // Блокируем ввод для закрытых чатов
    if (chat.status === 'closed') {
      chatInput.disabled = true;
      chatInput.placeholder = 'Обращение закрыто';
      chatAttachment.disabled = true;
    } else {
      chatInput.disabled = false;
      chatInput.placeholder = 'Введите сообщение...';
      chatAttachment.disabled = false;
    }
    
    loadMessages();
    subscribeToMessages();
  }

  // ═══ СООБЩЕНИЯ ═══
  async function loadMessages() {
    if (!db || !currentChatId) {
      console.warn('Cannot load messages: db or chatId missing');
      return;
    }
    
    console.log('Loading messages for chat:', currentChatId);
    
    const { data: messages, error } = await db
      .from('support_messages')
      .select('*')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Load messages error:', error);
      return;
    }

    console.log('Loaded messages:', messages);
    
    chatMessages.innerHTML = '';
    if (messages && messages.length > 0) {
      messages.forEach(msg => addMessage(msg));
    }
    scrollToBottom();
  }

  function addMessage(msg) {
    // Проверяем что сообщение еще не добавлено (только если есть ID)
    if (msg.id) {
      const existingMessage = chatMessages.querySelector(`[data-message-id="${msg.id}"]`);
      if (existingMessage) {
        console.log('Message already exists:', msg.id);
        return;
      }
    }
    
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${msg.role}`;
    if (msg.id) {
      messageEl.setAttribute('data-message-id', msg.id);
    }
    
    const time = new Date(msg.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    // Рендерим вложение если есть
    const attachmentHtml = msg.attachment_url ? renderAttachment(msg.attachment_url, msg.attachment_name, msg.attachment_type) : '';
    
    messageEl.innerHTML = `
      <div class="message-avatar">${msg.role === 'support' ? '👨‍💼' : '👤'}</div>
      <div class="message-content">
        <div class="message-bubble">${escapeHtml(msg.content)}${attachmentHtml}</div>
        <div class="message-time">${time}</div>
      </div>
    `;
    
    chatMessages.appendChild(messageEl);
    scrollToBottom();
    console.log('Message added to UI:', msg);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!db) {
      console.error('Database not initialized');
      toast.error('База данных не инициализирована');
      return;
    }
    
    const content = chatInput.value.trim();
    if (!content && !currentAttachment) {
      console.log('No content and no attachment');
      return;
    }
    
    console.log('=== SENDING MESSAGE ===');
    console.log('Content:', content);
    console.log('Current chat ID:', currentChatId);
    console.log('Current user:', currentUser);
    console.log('User ID:', currentUser.id);
    console.log('Is moderator:', currentUser.is_moder);
    console.log('Is admin:', currentUser.is_admin);
    console.log('Has attachment:', !!currentAttachment);
    
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.disabled = true;

    try {
      // Загружаем вложение если есть
      let attachmentData = null;
      if (currentAttachment) {
        console.log('Uploading attachment...');
        attachmentData = await uploadAttachment(currentAttachment);
        if (!attachmentData) {
          throw new Error('Ошибка загрузки файла');
        }
        console.log('Attachment uploaded:', attachmentData);
      }

      // Создаем чат если его нет
      if (!currentChatId) {
        console.log('Creating new chat...');
        const { data: newChat, error: chatError } = await db
          .from('support_chats')
          .insert([{
            user_id: currentUser.id,
            status: 'ai'
          }])
          .select()
          .single();

        if (chatError) {
          console.error('Chat creation error:', chatError);
          throw chatError;
        }
        
        console.log('New chat created:', newChat);
        currentChatId = newChat.id;
        
        // Подписываемся на сообщения
        subscribeToMessages();
      }

      // Отправляем сообщение
      const role = (currentUser.is_moder || currentUser.is_admin) ? 'support' : 'user';
      console.log('Inserting message with role:', role);
      console.log('User ID:', currentUser.id);
      
      const messageData = {
        chat_id: currentChatId,
        user_id: currentUser.id,
        role: role,
        content: content || '(вложение)'
      };
      
      if (attachmentData) {
        messageData.attachment_url = attachmentData.url;
        messageData.attachment_name = attachmentData.name;
        messageData.attachment_type = attachmentData.type;
      }
      
      const { data: newMessage, error: msgError } = await db
        .from('support_messages')
        .insert([messageData])
        .select()
        .single();

      if (msgError) {
        console.error('Message insert error:', msgError);
        throw msgError;
      }
      
      console.log('Message inserted:', newMessage);
      
      // Добавляем сообщение в UI если подписка еще не сработала
      if (newMessage) {
        addMessage(newMessage);
      }
      
      // Очищаем вложение
      removeAttachment();
      
      // Если это пользователь и чат без модератора - вызываем AI
      if (!currentUser.is_moder && !currentUser.is_admin && aiEnabled && content) {
        console.log('Requesting AI response...');
        
        // Показываем индикатор печати с SVG анимацией
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message support-message typing-indicator';
        typingIndicator.innerHTML = `
          <div class="message-avatar">
            <i class="fa-solid fa-headset"></i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-author">Поддержка</span>
              <span class="message-time">${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="message-text">
              <svg width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="4" fill="currentColor">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0s"/>
                </circle>
                <circle cx="30" cy="10" r="4" fill="currentColor">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.2s"/>
                </circle>
                <circle cx="50" cy="10" r="4" fill="currentColor">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" begin="0.4s"/>
                </circle>
              </svg>
            </div>
          </div>
        `;
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();
        
        // Получаем ответ от AI
        const aiResponse = await getAIResponse(content);
        
        // Убираем индикатор
        if (typingIndicator && typingIndicator.parentElement) {
          typingIndicator.parentElement.removeChild(typingIndicator);
        }
        
        if (aiResponse) {
          // Сохраняем ответ AI в БД
          const { data: aiMessage, error: aiError } = await db
            .from('support_messages')
            .insert([{
              chat_id: currentChatId,
              user_id: currentUser.id, // От имени пользователя но роль support
              role: 'support',
              content: aiResponse
            }])
            .select()
            .single();
          
          if (!aiError && aiMessage) {
            addMessage(aiMessage);
          }
        }
      }

    } catch(error) {
      console.error('Send message error:', error);
      
      if (error.code === '23503' && error.message.includes('user_id')) {
        toast.error(`Ошибка: Ваш ID (${currentUser.id}) не найден в таблице users. Проверьте что вы зарегистрированы в системе.`);
      } else {
        toast.error('Ошибка отправки сообщения: ' + error.message);
      }
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  // ═══ ПОДПИСКИ ═══
  function subscribeToMessages() {
    if (!db || !currentChatId) {
      console.warn('Cannot subscribe: db or chatId missing');
      return;
    }
    
    console.log('Subscribing to messages for chat:', currentChatId);
    
    // Отписываемся от предыдущей подписки
    if (messagesSubscription) {
      messagesSubscription.unsubscribe();
    }

    messagesSubscription = db
      .channel('support_messages_' + currentChatId)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `chat_id=eq.${currentChatId}`
      }, (payload) => {
        console.log('New message received:', payload.new);
        addMessage(payload.new);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
  }

  function subscribeToChats() {
    if (!db) return;
    
    console.log('Subscribing to chats...');
    
    chatsSubscription = db
      .channel('support_chats_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'support_chats'
      }, (payload) => {
        console.log('Chat update:', payload);
        loadClients();
      })
      .subscribe((status) => {
        console.log('Chats subscription status:', status);
      });
  }

  // ═══ УТИЛИТЫ ═══
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ═══ ВЛОЖЕНИЯ ═══
  function handleAttachment(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Файл слишком большой! Максимум 10MB');
      e.target.value = '';
      return;
    }
    
    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Тип файла не поддерживается');
      e.target.value = '';
      return;
    }
    
    currentAttachment = file;
    console.log('Attachment selected:', file.name, file.type, file.size);
    toast.success('Файл выбран: ' + file.name);
  }

  function removeAttachment() {
    currentAttachment = null;
    chatAttachment.value = '';
  }

  async function uploadAttachment(file) {
    if (!db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `support-attachments/${fileName}`;
      
      console.log('Starting upload:', { fileName, filePath, fileSize: file.size, fileType: file.type });
      
      // Загружаем файл в bucket
      const { data, error } = await db.storage
        .from('support-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      console.log('File uploaded successfully:', data);
      
      // Получаем публичный URL
      const { data: { publicUrl } } = db.storage
        .from('support-files')
        .getPublicUrl(filePath);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      console.log('Public URL:', publicUrl);
      
      return {
        url: publicUrl,
        name: file.name,
        type: file.type
      };
      
    } catch(error) {
      console.error('Upload error:', error);
      toast.error('Ошибка загрузки: ' + error.message);
      return null;
    }
  }

  function renderAttachment(attachmentUrl, attachmentName, attachmentType) {
    if (!attachmentUrl) return '';
    
    const isImage = attachmentType && attachmentType.startsWith('image/');
    
    if (isImage) {
      return `
        <div class="message-attachment">
          <img src="${attachmentUrl}" alt="${attachmentName}" onclick="window.open('${attachmentUrl}', '_blank')">
        </div>
      `;
    }
    
    const icon = getFileIcon(attachmentType);
    
    return `
      <div class="message-attachment" onclick="window.open('${attachmentUrl}', '_blank')">
        <div class="message-attachment-icon">${icon}</div>
        <div class="message-attachment-info">
          <div class="message-attachment-name">${attachmentName}</div>
        </div>
      </div>
    `;
  }

  function getFileIcon(type) {
    if (!type) return '📄';
    if (type.includes('pdf')) return '📕';
    if (type.includes('word') || type.includes('document')) return '📘';
    if (type.includes('text')) return '📝';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  }

  // ═══ ЗАКРЫТИЕ ОБРАЩЕНИЯ ═══
  async function closeTicket() {
    if (!db || !currentChatId) return;
    
    toast.confirm(
      'Вы уверены что хотите закрыть это обращение?',
      async () => {
        try {
          const { error } = await db
            .from('support_chats')
            .update({ status: 'closed' })
            .eq('id', currentChatId);
          
          if (error) throw error;
          
          toast.success('Обращение закрыто');
          
          goBackToClients();
        } catch(error) {
          console.error('Close ticket error:', error);
          toast.error('Не удалось закрыть обращение');
        }
      }
    );
  }

  // Пользователь закрывает обращение
  async function userCloseTicket() {
    if (!db || !currentChatId) return;
    
    toast.confirm(
      'Вы уверены что хотите закрыть обращение?',
      async () => {
        try {
          const { error } = await db
            .from('support_chats')
            .update({ status: 'closed' })
            .eq('id', currentChatId);
          
          if (error) throw error;
          
          toast.success('Обращение закрыто');
          
          closeChat();
          currentChatId = null;
        } catch(error) {
          console.error('Close ticket error:', error);
          toast.error('Не удалось закрыть обращение');
        }
      }
    );
  }

  // Позвать модератора
  async function callModerator() {
    if (!db || !currentChatId) return;
    
    try {
      // Обновляем статус на "waiting"
      const { error } = await db
        .from('support_chats')
        .update({ status: 'waiting' })
        .eq('id', currentChatId);
      
      if (error) throw error;
      
      aiEnabled = false;
      chatSubtitle.textContent = 'Ожидаем модератора...';
      
      // Добавляем системное сообщение
      addMessage({
        role: 'support',
        content: 'Дожидайтесь модератора!',
        created_at: new Date().toISOString()
      });
      
      showNotification({
        title: 'Модератор вызван',
        message: 'Ожидайте ответа модератора',
        type: 'success',
        duration: 3000
      });
      
    } catch(error) {
      console.error('Call moderator error:', error);
    }
  }

  // ═══ AI ПОДДЕРЖКА ═══
  async function getAIResponse(userMessage) {
    if (!currentChatId) return null;
    
    try {
      // Получаем историю сообщений для контекста
      const { data: messages } = await db
        .from('support_messages')
        .select('role, content')
        .eq('chat_id', currentChatId)
        .order('created_at', { ascending: true })
        .limit(10);
      
      // Форматируем для OpenAI
      const formattedMessages = messages.map(m => ({
        role: m.role === 'support' ? 'assistant' : 'user',
        content: m.content
      }));
      
      // Добавляем текущее сообщение
      formattedMessages.push({
        role: 'user',
        content: userMessage
      });
      
      // Вызываем Supabase Edge Function
      const response = await fetch('https://xlruthqgapbgxfowavln.supabase.co/functions/v1/quick-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: formattedMessages
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI response error:', errorText);
        return null;
      }
      
      const data = await response.json();
      return data.message;
      
    } catch (error) {
      console.error('AI error:', error);
      return null;
    }
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Небольшая задержка чтобы дать время Supabase загрузиться
    setTimeout(init, 100);
  }
})();
