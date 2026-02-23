// Модальное окно авторизации
(function() {
  // Загружаем HTML модального окна
  fetch('./components/auth-modal.html')
    .then(r => r.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      initAuthModal();
    });

  function initAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAuthModal();
      }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeAuthModal();
      }
    });
  }

  // Глобальные функции
  window.openAuthModal = function(view = 'login') {
    const overlay = document.getElementById('authModalOverlay');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (view === 'register') {
      modalGoTo('reg1');
    } else {
      modalGoTo('login');
    }
  };

  window.closeAuthModal = function() {
    const overlay = document.getElementById('authModalOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сброс формы
    setTimeout(() => {
      modalGoTo('login');
      document.querySelectorAll('#authModal input').forEach(inp => inp.value = '');
      document.querySelectorAll('#authModal .msg').forEach(msg => msg.classList.add('hidden'));
    }, 300);
  };

  // Переключение видов
  const MODAL_VIEWS = { login: 'modalVLogin', reg1: 'modalVReg1', reg2: 'modalVReg2' };
  const MODAL_META = {
    login: { icon: '🔐', title: 'Zenex', sub: 'Твой персональный чит-клиент. Войди и начни.', bars: false, narrow: false },
    reg1: { icon: '📧', title: 'Регистрация', sub: 'Создайте свой аккаунт', bars: true, narrow: true },
    reg2: { icon: '🔑', title: 'Регистрация', sub: 'Подтвердите почту', bars: true, narrow: true },
  };
  let modalCurView = 'login';

  window.modalGoTo = function(name) {
    if (name === modalCurView) return;
    
    const oldEl = document.getElementById(MODAL_VIEWS[modalCurView]);
    const newEl = document.getElementById(MODAL_VIEWS[name]);
    const meta = MODAL_META[name];

    oldEl.classList.add('hidden');
    newEl.classList.remove('hidden');

    document.getElementById('modalCardIcon').textContent = meta.icon;
    document.getElementById('modalCardTitle').textContent = meta.title;
    document.getElementById('modalCardSub').textContent = meta.sub;

    const modal = document.getElementById('authModal');
    if (meta.narrow) {
      modal.classList.add('narrow');
    } else {
      modal.classList.remove('narrow');
    }

    const pbarsEl = document.getElementById('modalPbars');
    if (meta.bars) {
      pbarsEl.classList.remove('hidden');
      if (name === 'reg1') {
        document.getElementById('modalPb1').classList.add('lit');
        document.getElementById('modalPb2').classList.remove('lit');
      } else if (name === 'reg2') {
        document.getElementById('modalPb1').classList.add('lit');
        document.getElementById('modalPb2').classList.add('lit');
      }
    } else {
      pbarsEl.classList.add('hidden');
    }

    modalCurView = name;
  };

  window.modalGoBack = function() {
    modalGoTo('reg1');
  };

  // Вспомогательные функции
  window.eyeToggle = function(id, btn) {
    const i = document.getElementById(id);
    i.type = i.type === 'password' ? 'text' : 'password';
    btn.textContent = i.type === 'password' ? '👁' : '🙈';
  };

  function showModalMsg(id, txt, isErr = true) {
    const el = document.getElementById(id);
    el.textContent = txt;
    el.className = 'msg ' + (isErr ? 'err' : 'ok');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
  }

  function setModalBtn(id, txt, dis) {
    const b = document.getElementById(id);
    b.textContent = txt;
    b.disabled = dis;
  }

  async function sha256(s) {
    const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Turnstile
  let tsModalLogin = null, tsModalReg = null;
  window.onModalLoginTS = t => { tsModalLogin = t; };
  window.onModalRegTS = t => { tsModalReg = t; };

  // Supabase и EmailJS
  const EJS_PK = '6KkqFapKX2_cg00Og';
  const EJS_SVC = 'service_vpw7xye';
  const EJS_VERIFY = 'template_ncbjni9';
  const EJS_WELCOME = 'template_ueykvki';

  const SB_URL = 'https://xlruthqgapbgxfowavln.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnV0aHFnYXBiZ3hmb3dhdmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTY2MjMsImV4cCI6MjA4NTI3MjYyM30.dwBTGOPGgEb2Qg3ZaK8Q8XJjx64gdHQy48r_pnLxPic';
  let db = null;
  try { db = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { }

  // LOGIN
  window.doModalLogin = async function() {
    if (!db) { showModalMsg('modalLoginMsg', 'База данных недоступна'); return; }
    if (!tsModalLogin) { showModalMsg('modalLoginMsg', 'Пройдите проверку Cloudflare'); return; }

    const emailOrUsername = document.getElementById('modalLoginEmail').value.trim();
    const pw = document.getElementById('modalLoginPw').value;
    if (!emailOrUsername || !pw) { showModalMsg('modalLoginMsg', 'Заполните все поля'); return; }

    setModalBtn('modalLoginBtn', 'Вход...', true);
    try {
      if (emailOrUsername === 'admin@zenex.com' && pw === 'bro_plat') {
        localStorage.setItem('currentUser', JSON.stringify({
          uid: 1, username: 'admin', email: 'admin@zenex.com', is_admin: true, subscription: 'lifetime'
        }));
        if (window.toast) window.toast.success('Добро пожаловать, Администратор!');
        setTimeout(() => {
          closeAuthModal();
          if (window.location.pathname.includes('profile.html')) {
            location.reload();
          } else {
            location.href = 'profile.html';
          }
        }, 1000);
        return;
      }

      let query = db.from('users').select('*');
      if (emailOrUsername.includes('@')) {
        query = query.eq('email', emailOrUsername);
      } else {
        query = query.eq('username', emailOrUsername);
      }

      const { data, error } = await query.single();
      if (error || !data) {
        showModalMsg('modalLoginMsg', 'Пользователь не найден');
        tsModalLogin = null;
        if (window.turnstile) window.turnstile.reset('#tsModalLoginWidget');
        return;
      }

      if (await sha256(pw) === data.password) {
        if (data.ban && data.ban_until) {
          const banUntil = new Date(data.ban_until).getTime();
          const now = new Date().getTime();
          if (banUntil > now) {
            showModalMsg('modalLoginMsg', 'Ваш аккаунт забанен');
            tsModalLogin = null;
            if (window.turnstile) window.turnstile.reset('#tsModalLoginWidget');
            setModalBtn('modalLoginBtn', 'Войти', false);
            return;
          }
        }

        localStorage.setItem('currentUser', JSON.stringify(data));

        try {
          await db.from('activity_log').insert({
            username: data.username,
            action_type: 'login',
            title: 'Вход в систему',
            description: 'Успешная авторизация',
            icon: 'right-to-bracket'
          });
        } catch (e) { }

        if (window.toast) window.toast.success('Добро пожаловать, ' + data.username + '!');
        setTimeout(() => {
          closeAuthModal();
          if (window.location.pathname.includes('profile.html')) {
            location.reload();
          } else {
            location.href = 'profile.html';
          }
        }, 1000);
      } else {
        if (window.toast) window.toast.error('Неверный пароль');
        tsModalLogin = null;
        if (window.turnstile) window.turnstile.reset('#tsModalLoginWidget');
      }
    } catch (e) {
      showModalMsg('modalLoginMsg', 'Ошибка: ' + e.message);
    } finally {
      setModalBtn('modalLoginBtn', 'Войти', false);
    }
  };

  // REGISTER
  let modalRegEmail = null, modalRegUsername = null, modalRegPwSaved = null, modalPendingCode = null;

  window.doModalReg1 = async function() {
    if (!db) { showModalMsg('modalReg1Msg', 'База данных недоступна'); return; }
    if (!tsModalReg) { showModalMsg('modalReg1Msg', 'Пройдите проверку Cloudflare'); return; }

    const username = document.getElementById('modalRegUsername').value.trim();
    const email = document.getElementById('modalRegEmail').value.trim();
    const pw = document.getElementById('modalRegPw').value;
    const pw2 = document.getElementById('modalRegPw2').value;

    if (!username) { showModalMsg('modalReg1Msg', 'Введите никнейм'); return; }
    if (username.length < 3) { showModalMsg('modalReg1Msg', 'Никнейм должен быть не менее 3 символов'); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { showModalMsg('modalReg1Msg', 'Никнейм: только буквы, цифры и _'); return; }
    if (!email) { showModalMsg('modalReg1Msg', 'Введите электронную почту'); return; }
    if (!pw || pw.length < 6) { showModalMsg('modalReg1Msg', 'Пароль должен быть не менее 6 символов'); return; }
    if (pw !== pw2) { showModalMsg('modalReg1Msg', 'Пароли не совпадают'); return; }

    setModalBtn('modalReg1Btn', 'Проверка...', true);
    try {
      const { data: exEmail } = await db.from('users').select('email').eq('email', email).maybeSingle();
      if (exEmail) {
        showModalMsg('modalReg1Msg', '⚠️ Эта почта уже зарегистрирована');
        tsModalReg = null;
        if (window.turnstile) window.turnstile.reset('#tsModalRegWidget');
        return;
      }

      const { data: exUser } = await db.from('users').select('username').eq('username', username).maybeSingle();
      if (exUser) {
        showModalMsg('modalReg1Msg', '⚠️ Этот никнейм уже занят');
        tsModalReg = null;
        if (window.turnstile) window.turnstile.reset('#tsModalRegWidget');
        return;
      }

      modalRegEmail = email;
      modalRegUsername = username;
      modalRegPwSaved = pw;
      modalPendingCode = String(Math.floor(100000 + Math.random() * 900000));
      console.log('[DEV] Код:', modalPendingCode);

      setModalBtn('modalReg1Btn', 'Отправка...', true);
      const _r1 = await emailjs.send(EJS_SVC, EJS_VERIFY, {
        to_email: email,
        verification_code: modalPendingCode,
        user_email: email,
        username: username
      }, EJS_PK);

      document.getElementById('modalSentTo').textContent = email;
      showModalMsg('modalReg1Msg', 'Код отправлен на ' + email, false);
      setTimeout(() => {
        modalGoTo('reg2');
        modalStartTimer();
        document.getElementById('modalC1').focus();
      }, 700);

    } catch (e) {
      console.error(e);
      showModalMsg('modalReg1Msg', 'Ошибка отправки: ' + (e.text || e.message || JSON.stringify(e)));
      tsModalReg = null;
      if (window.turnstile) window.turnstile.reset('#tsModalRegWidget');
    } finally {
      setModalBtn('modalReg1Btn', 'Зарегистрироваться', false);
    }
  };

  window.doModalReg2 = async function() {
    if (!db) { showModalMsg('modalReg2Msg', 'База данных недоступна'); return; }

    const code = ['modalC1', 'modalC2', 'modalC3', 'modalC4', 'modalC5', 'modalC6']
      .map(i => document.getElementById(i).value).join('');
    if (code.length < 6) { showModalMsg('modalReg2Msg', 'Введите все 6 цифр'); return; }
    if (code !== modalPendingCode) {
      showModalMsg('modalReg2Msg', 'Неверный код');
      modalClearCode();
      document.getElementById('modalC1').focus();
      return;
    }

    setModalBtn('modalReg2Btn', 'Создаём аккаунт...', true);
    try {
      const { data: maxRow } = await db.from('users').select('uid').order('uid', { ascending: false }).limit(1);
      const maxUid = maxRow?.length ? maxRow[0].uid : 0;

      const { data: newUser, error } = await db.from('users').insert([{
        uid: maxUid + 1,
        username: modalRegUsername,
        email: modalRegEmail,
        password: await sha256(modalRegPwSaved),
        subscription: 'free',
        is_admin: false,
        ban: false,
        ban_until: null,
        created_at: new Date().toISOString()
      }]).select();

      if (error) throw error;

      try {
        await emailjs.send(EJS_SVC, EJS_WELCOME, {
          to_email: modalRegEmail,
          username: modalRegUsername,
          user_email: modalRegEmail
        }, EJS_PK);
      } catch (e) { }

      showModalMsg('modalReg2Msg', '✅ Аккаунт создан! Войдите в систему.', false);
      setTimeout(() => {
        modalGoTo('login');
        document.getElementById('modalLoginEmail').value = modalRegEmail;
      }, 2000);

    } catch (e) {
      console.error(e);
      showModalMsg('modalReg2Msg', 'Ошибка создания: ' + e.message);
    } finally {
      setModalBtn('modalReg2Btn', 'Подтвердить', false);
    }
  };

  // Код - навигация
  window.cn = function(el, nextId) {
    if (el.value.length === 1) {
      el.classList.add('has');
      if (nextId) document.getElementById(nextId).focus();
    } else {
      el.classList.remove('has');
    }
  };

  window.cb = function(e, curId, prevId) {
    if (e.key === 'Backspace' && !document.getElementById(curId).value && prevId) {
      document.getElementById(prevId).focus();
    }
  };

  function modalClearCode() {
    ['modalC1', 'modalC2', 'modalC3', 'modalC4', 'modalC5', 'modalC6'].forEach(id => {
      const el = document.getElementById(id);
      el.value = '';
      el.classList.remove('has');
    });
  }

  // Таймер
  let modalTimerInterval = null;
  function modalStartTimer() {
    let sec = 60;
    document.getElementById('modalTimerSec').textContent = sec;
    document.getElementById('modalResendBtn').style.display = 'none';

    modalTimerInterval = setInterval(() => {
      sec--;
      document.getElementById('modalTimerSec').textContent = sec;
      if (sec <= 0) {
        clearInterval(modalTimerInterval);
        document.getElementById('modalResendBtn').style.display = 'inline';
      }
    }, 1000);
  }

  window.modalResendCode = async function() {
    modalPendingCode = String(Math.floor(100000 + Math.random() * 900000));
    console.log('[DEV] Новый код:', modalPendingCode);

    try {
      await emailjs.send(EJS_SVC, EJS_VERIFY, {
        to_email: modalRegEmail,
        verification_code: modalPendingCode,
        user_email: modalRegEmail,
        username: modalRegUsername
      }, EJS_PK);
      showModalMsg('modalReg2Msg', 'Код отправлен повторно', false);
      modalStartTimer();
    } catch (e) {
      showModalMsg('modalReg2Msg', 'Ошибка отправки');
    }
  };

})();

// Функция для открытия модалки при клике на кнопки
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем авторизацию
  const currentUser = localStorage.getItem('currentUser');
  
  // Добавляем обработчики на кнопки "Купить", "Оставить отзыв" и т.д.
  document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Если клик по кнопке которая требует авторизации
    if (target.matches('[data-auth-required]') || 
        target.closest('[data-auth-required]') ||
        target.matches('.buy-btn, .review-btn, .purchase-btn') ||
        target.closest('.buy-btn, .review-btn, .purchase-btn')) {
      
      if (!currentUser) {
        e.preventDefault();
        e.stopPropagation();
        openAuthModal();
        return false;
      }
    }
  });
});
