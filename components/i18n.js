// Система переводов
const translations = {
  ru: {
    // Navbar
    "admin-panel": "Админ-панель",
    "profile": "Профиль",
    "auth": "Авторизация",
    
    // Index
    "hero-title": "О нас",
    "hero-desc": "Создаём лучший игровой клиент для максимального комфорта и новых впечатлений от игры.",
    "buy-now": "Купить сейчас",
    "learn-more": "Подробнее",
    "features-title": "Наши преимущества",
    
    "feature-1-title": "Красивый внешний вид",
    "feature-1-desc": "Наш клиент разработан с учётом современных стандартов дизайна. Каждый элемент интерфейса продуман до мелочей, чтобы обеспечить максимальный комфорт во время игры.",
    
    "feature-2-title": "Настраиваемость",
    "feature-2-desc": "Полный контроль над игровым процессом в ваших руках. Изменяйте интерфейс, создавайте собственные профили настроек, адаптируйте управление под свой стиль игры.",
    
    "feature-3-title": "Оптимизация",
    "feature-3-desc": "Высокая производительность на любом оборудовании — наш приоритет. Клиент использует минимум системных ресурсов, обеспечивая стабильную работу даже на устаревших ПК.",
    
    "feature-4-title": "Частые обновления",
    "feature-4-desc": "Постоянное развитие и улучшение — основа нашей работы. Мы выпускаем регулярные обновления, добавляя новые возможности и исправляя недочёты.",
    
    "feature-5-title": "Лучшая поддержка",
    "feature-5-desc": "Наша команда всегда готова прийти на помощь. Профессиональная служба поддержки работает круглосуточно, чтобы оперативно решать любые возникающие вопросы.",
    
    // Auth
    "auth-title": "Zenex",
    "auth-subtitle": "Твой персональный чит-клиент. Войди и начни.",
    "email-label": "Электронная почта",
    "password-label": "Пароль",
    "password-placeholder": "Введите пароль",
    "forgot-password": "Забыли пароль?",
    "login-btn": "Войти",
    "no-account": "Нет аккаунта?",
    "register-link": "Зарегистрироваться",
    "register-title": "Регистрация",
    "register-subtitle": "Создайте свой аккаунт",
    "username-label": "Никнейм",
    "username-placeholder": "your_nickname",
    "confirm-password-label": "Подтвердите пароль",
    "confirm-password-placeholder": "Повторите пароль",
    "register-btn": "Зарегистрироваться",
    "have-account": "Уже есть аккаунт?",
    "verify-subtitle": "Подтвердите почту",
    "verify-info": "Если письмо не пришло — проверьте папку «Спам»",
    "code-sent": "Код отправлен на",
    "resend-timer": "Отправить повторно через",
    "resend-btn": "Отправить снова",
    "back-btn": "← Назад",
    "confirm-btn": "Подтвердить",
    
    // Profile
    "profile-cabinet": "Личный кабинет",
    "profile-login": "Логин",
    "profile-email": "E-mail",
    "profile-role": "Роль",
    "profile-reg-date": "Дата регистрации",
    "profile-sub-type": "Тип подписки",
    "profile-sub-issued": "Дата выдачи подписки",
    "profile-sub-end": "Подписка до",
    "profile-hwid": "HWID",
    "profile-download": "Скачать клиент",
    "profile-activate-key": "Активировать ключ",
    "profile-change-pwd": "Изменить пароль",
    "profile-promo": "Промокоды",
    "profile-admin": "Admin Panel",
    "profile-logout": "Выйти",
    "profile-purchases": "История покупок",
    "profile-purchases-desc": "Детальная история ваших транзакций",
    "profile-no-purchases": "У вас пока нет покупок",
    "profile-activity": "История активности",
    "profile-activity-desc": "Лог ваших действий в системе",
    "profile-activity-empty": "История активности пуста",
    "modal-activate-key": "Активировать ключ",
    "modal-key-label": "Ключ активации",
    "modal-activate": "Активировать",
    "modal-change-pwd": "Сменить пароль",
    "modal-current-pwd": "Текущий пароль",
    "modal-new-pwd": "Новый пароль",
    "modal-confirm-pwd": "Повторите пароль",
    "modal-change": "Изменить пароль",
    "modal-my-promo": "Мои промокоды",
    "modal-create-promo": "Создать промокод (макс. 12 символов, латиница)",
    "modal-create": "Создать",
    "modal-your-promo": "Ваши промокоды",
    "modal-promo-note": "Обратитесь к администратору для активации.",
    
    // Shop
    "shop-title": "Магазин",
    "shop-month": "Zenex one month",
    "shop-month-desc": "Наш полнофункциональный клиент с множеством возможностей для игры на всех серверах.",
    "shop-lifetime": "Zenex lifetime",
    "shop-lifetime-desc": "Специальная версия клиента с улучшенными функциями обхода античитов.",
    "shop-beta": "Zenex Beta",
    "shop-beta-desc": "Эксклюзивный доступ к бета-версии с новейшими функциями и регулярными обновлениями.",
    "shop-year": "Zenex one year",
    "shop-year-desc": "Продлите вашу текущую подписку на 365 дней по выгодной цене.",
    "shop-hwid": "Сброс HWID",
    "shop-hwid-desc": "Сброс привязки к железу. Используй клиент на другом компьютере.",
    "shop-buy": "Купить",
    "shop-checkout": "Оформление заказа",
    "shop-select-method": "Выберите способ оплаты",
    "shop-payment-method": "СПОСОБ ОПЛАТЫ",
    "shop-promo-label": "ПРОМОКОД",
    "shop-promo-placeholder": "Введите промокод",
    "shop-apply": "Применить",
    "shop-pay": "Оплатить",
    "shop-security": "Безопасная оплата через защищённое соединение",
    
    // Navbar
    "lang-ru": "Русский",
    "lang-en": "English",
    "lang-ua": "Українська",
    
    // Footer
    "footer-about": "О нас",
    "footer-about-desc": "Zenex Client - лучший Minecraft чит-клиент с современными функциями и надежной защитой.",
    "footer-nav": "Навигация",
    "footer-home": "Главная",
    "footer-shop": "Купить",
    "footer-profile": "Профиль",
    "footer-legal": "Документы",
    "footer-privacy": "Обработка персональных данных",
    "footer-terms": "Пользовательское соглашение",
    "footer-rules": "Правила пользования",
    
    // Legal pages
    "terms-title": "Пользовательское соглашение",
    "terms-general": "Общие положения",
    "terms-subject": "Предмет договора",
    "terms-order": "Оформление заказа",
    "terms-payment": "Оплата Заказа",
    "privacy-title": "Обработка персональных данных",
    "rules-title": "Правила пользования",
  },
  en: {
    // Navbar
    "admin-panel": "Admin Panel",
    "profile": "Profile",
    "auth": "Authorization",
    
    // Index
    "hero-title": "About Us",
    "hero-desc": "Creating the best gaming client for maximum comfort and new gaming experiences.",
    "buy-now": "Buy Now",
    "learn-more": "Learn More",
    "features-title": "Our Advantages",
    
    "feature-1-title": "Beautiful Design",
    "feature-1-desc": "Our client is developed with modern design standards in mind. Every interface element is carefully thought out to ensure maximum comfort while gaming.",
    
    "feature-2-title": "Customization",
    "feature-2-desc": "Full control over the gaming process in your hands. Change the interface, create your own settings profiles, adapt controls to your gaming style.",
    
    "feature-3-title": "Optimization",
    "feature-3-desc": "High performance on any hardware is our priority. The client uses minimal system resources, ensuring stable operation even on older PCs.",
    
    "feature-4-title": "Frequent Updates",
    "feature-4-desc": "Constant development and improvement is the foundation of our work. We release regular updates, adding new features and fixing issues.",
    
    "feature-5-title": "Best Support",
    "feature-5-desc": "Our team is always ready to help. Professional support service works around the clock to quickly resolve any issues.",
    
    // Auth
    "auth-title": "Zenex",
    "auth-subtitle": "Your personal cheat client. Log in and start.",
    "email-label": "Email",
    "password-label": "Password",
    "password-placeholder": "Enter password",
    "forgot-password": "Forgot password?",
    "login-btn": "Login",
    "no-account": "No account?",
    "register-link": "Register",
    "register-title": "Registration",
    "register-subtitle": "Create your account",
    "username-label": "Username",
    "username-placeholder": "your_nickname",
    "confirm-password-label": "Confirm Password",
    "confirm-password-placeholder": "Repeat password",
    "register-btn": "Register",
    "have-account": "Already have an account?",
    "verify-subtitle": "Verify your email",
    "verify-info": "If you didn't receive the email — check your spam folder",
    "code-sent": "Code sent to",
    "resend-timer": "Resend in",
    "resend-btn": "Send again",
    "back-btn": "← Back",
    "confirm-btn": "Confirm",
    
    // Profile
    "profile-cabinet": "Personal Cabinet",
    "profile-login": "Login",
    "profile-email": "E-mail",
    "profile-role": "Role",
    "profile-reg-date": "Registration Date",
    "profile-sub-type": "Subscription Type",
    "profile-sub-issued": "Subscription Issued",
    "profile-sub-end": "Subscription Until",
    "profile-hwid": "HWID",
    "profile-download": "Download Client",
    "profile-activate-key": "Activate Key",
    "profile-change-pwd": "Change Password",
    "profile-promo": "Promo Codes",
    "profile-admin": "Admin Panel",
    "profile-logout": "Logout",
    "profile-purchases": "Purchase History",
    "profile-purchases-desc": "Detailed history of your transactions",
    "profile-no-purchases": "You have no purchases yet",
    "profile-activity": "Activity History",
    "profile-activity-desc": "Log of your actions in the system",
    "profile-activity-empty": "Activity history is empty",
    "modal-activate-key": "Activate Key",
    "modal-key-label": "Activation Key",
    "modal-activate": "Activate",
    "modal-change-pwd": "Change Password",
    "modal-current-pwd": "Current Password",
    "modal-new-pwd": "New Password",
    "modal-confirm-pwd": "Repeat Password",
    "modal-change": "Change Password",
    "modal-my-promo": "My Promo Codes",
    "modal-create-promo": "Create Promo Code (max 12 characters, Latin)",
    "modal-create": "Create",
    "modal-your-promo": "Your Promo Codes",
    "modal-promo-note": "Contact administrator to activate.",
    
    // Shop
    "shop-title": "Shop",
    "shop-month": "Zenex one month",
    "shop-month-desc": "Our fully functional client with many features for playing on all servers.",
    "shop-lifetime": "Zenex lifetime",
    "shop-lifetime-desc": "Special version of the client with enhanced anti-cheat bypass features.",
    "shop-beta": "Zenex Beta",
    "shop-beta-desc": "Exclusive access to beta version with latest features and regular updates.",
    "shop-year": "Zenex one year",
    "shop-year-desc": "Extend your current subscription for 365 days at a great price.",
    "shop-hwid": "HWID Reset",
    "shop-hwid-desc": "Reset hardware binding. Use the client on another computer.",
    "shop-buy": "Buy",
    "shop-checkout": "Checkout",
    "shop-select-method": "Select payment method",
    "shop-payment-method": "PAYMENT METHOD",
    "shop-promo-label": "PROMO CODE",
    "shop-promo-placeholder": "Enter promo code",
    "shop-apply": "Apply",
    "shop-pay": "Pay",
    "shop-security": "Secure payment through encrypted connection",
    
    // Navbar
    "lang-ru": "Russian",
    "lang-en": "English",
    "lang-ua": "Ukrainian",
    
    // Footer
    "footer-about": "About Us",
    "footer-about-desc": "Zenex Client - the best Minecraft cheat client with modern features and reliable protection.",
    "footer-nav": "Navigation",
    "footer-home": "Home",
    "footer-shop": "Shop",
    "footer-profile": "Profile",
    "footer-legal": "Documents",
    "footer-privacy": "Privacy Policy",
    "footer-terms": "Terms of Service",
    "footer-rules": "Rules of Use",
    
    // Legal pages
    "terms-title": "Terms of Service",
    "terms-general": "General Provisions",
    "terms-subject": "Subject of the Agreement",
    "terms-order": "Order Placement",
    "terms-payment": "Order Payment",
    "privacy-title": "Privacy Policy",
    "rules-title": "Rules of Use",
  },
  ua: {
    // Navbar
    "admin-panel": "Адмін-панель",
    "profile": "Профіль",
    "auth": "Авторизація",
    
    // Index
    "hero-title": "Про нас",
    "hero-desc": "Створюємо найкращий ігровий клієнт для максимального комфорту та нових враженнях від гри.",
    "buy-now": "Купити зараз",
    "learn-more": "Дізнатися більше",
    "features-title": "Наші переваги",
    
    "feature-1-title": "Красивий дизайн",
    "feature-1-desc": "Наш клієнт розроблений з урахуванням сучасних стандартів дизайну. Кожен елемент інтерфейсу продуманий до дрібниць, щоб забезпечити максимальний комфорт під час гри.",
    
    "feature-2-title": "Налаштування",
    "feature-2-desc": "Повний контроль над ігровим процесом у ваших руках. Змінюйте інтерфейс, створюйте власні профілі налаштувань, адаптуйте управління під свій стиль гри.",
    
    "feature-3-title": "Оптимізація",
    "feature-3-desc": "Висока продуктивність на будь-якому обладнанні — наш пріоритет. Клієнт використовує мінімум системних ресурсів, забезпечуючи стабільну роботу навіть на застарілих ПК.",
    
    "feature-4-title": "Часті оновлення",
    "feature-4-desc": "Постійний розвиток та вдосконалення — основа нашої роботи. Ми випускаємо регулярні оновлення, додаючи нові можливості та виправляючи недоліки.",
    
    "feature-5-title": "Найкраща підтримка",
    "feature-5-desc": "Наша команда завжди готова допомогти. Професійна служба підтримки працює цілодобово, щоб оперативно вирішувати будь-які проблеми.",
    
    // Auth
    "auth-title": "Zenex",
    "auth-subtitle": "Твій персональний чит-клієнт. Увійди і почни.",
    "email-label": "Електронна пошта",
    "password-label": "Пароль",
    "password-placeholder": "Введіть пароль",
    "forgot-password": "Забули пароль?",
    "login-btn": "Увійти",
    "no-account": "Немає облікового запису?",
    "register-link": "Зареєструватися",
    "register-title": "Реєстрація",
    "register-subtitle": "Створіть свій обліковий запис",
    "username-label": "Нікнейм",
    "username-placeholder": "your_nickname",
    "confirm-password-label": "Підтвердіть пароль",
    "confirm-password-placeholder": "Повторіть пароль",
    "register-btn": "Зареєструватися",
    "have-account": "Вже є обліковий запис?",
    "verify-subtitle": "Підтвердіть вашу пошту",
    "verify-info": "Якщо ви не отримали лист — перевірте папку спаму",
    "code-sent": "Код відправлено на",
    "resend-timer": "Відправити повторно через",
    "resend-btn": "Відправити ще раз",
    "back-btn": "← Назад",
    "confirm-btn": "Підтвердити",
    
    // Profile
    "profile-cabinet": "Особистий кабінет",
    "profile-login": "Логін",
    "profile-email": "E-mail",
    "profile-role": "Роль",
    "profile-reg-date": "Дата реєстрації",
    "profile-sub-type": "Тип підписки",
    "profile-sub-issued": "Дата видачі підписки",
    "profile-sub-end": "Підписка до",
    "profile-hwid": "HWID",
    "profile-download": "Завантажити клієнт",
    "profile-activate-key": "Активувати ключ",
    "profile-change-pwd": "Змінити пароль",
    "profile-promo": "Промокоди",
    "profile-admin": "Admin Panel",
    "profile-logout": "Вийти",
    "profile-purchases": "Історія покупок",
    "profile-purchases-desc": "Детальна історія ваших транзакцій",
    "profile-no-purchases": "У вас поки немає покупок",
    "profile-activity": "Історія активності",
    "profile-activity-desc": "Журнал ваших дій у системі",
    "profile-activity-empty": "Історія активності порожня",
    "modal-activate-key": "Активувати ключ",
    "modal-key-label": "Ключ активації",
    "modal-activate": "Активувати",
    "modal-change-pwd": "Змінити пароль",
    "modal-current-pwd": "Поточний пароль",
    "modal-new-pwd": "Новий пароль",
    "modal-confirm-pwd": "Повторіть пароль",
    "modal-change": "Змінити пароль",
    "modal-my-promo": "Мої промокоди",
    "modal-create-promo": "Створити промокод (макс. 12 символів, латиниця)",
    "modal-create": "Створити",
    "modal-your-promo": "Ваші промокоди",
    "modal-promo-note": "Зв'яжіться з адміністратором для активації.",
    
    // Shop
    "shop-title": "Магазин",
    "shop-month": "Zenex один місяць",
    "shop-month-desc": "Наш повнофункціональний клієнт з багатьма можливостями для гри на всіх серверах.",
    "shop-lifetime": "Zenex пожиттєво",
    "shop-lifetime-desc": "Спеціальна версія клієнта з покращеними функціями обходу античітів.",
    "shop-beta": "Zenex Beta",
    "shop-beta-desc": "Виключний доступ до бета-версії з новітніми функціями та регулярними оновленнями.",
    "shop-year": "Zenex один рік",
    "shop-year-desc": "Продовжте вашу поточну підписку на 365 днів за вигідною ціною.",
    "shop-hwid": "Скидання HWID",
    "shop-hwid-desc": "Скидання прив'язки до залізо. Використовуйте клієнт на іншому комп'ютері.",
    "shop-buy": "Купити",
    "shop-checkout": "Оформлення замовлення",
    "shop-select-method": "Виберіть спосіб оплати",
    "shop-payment-method": "СПОСІБ ОПЛАТИ",
    "shop-promo-label": "ПРОМОКОД",
    "shop-promo-placeholder": "Введіть промокод",
    "shop-apply": "Застосувати",
    "shop-pay": "Оплатити",
    "shop-security": "Безпечна оплата через зашифроване з'єднання",
    
    // Navbar
    "lang-ru": "Російська",
    "lang-en": "Англійська",
    "lang-ua": "Українська",
    
    // Footer
    "footer-about": "Про нас",
    "footer-about-desc": "Zenex Client - найкращий Minecraft чит-клієнт з сучасними функціями та надійним захистом.",
    "footer-nav": "Навігація",
    "footer-home": "Головна",
    "footer-shop": "Магазин",
    "footer-profile": "Профіль",
    "footer-legal": "Документи",
    "footer-privacy": "Політика конфіденційності",
    "footer-terms": "Умови використання",
    "footer-rules": "Правила користування",
    
    // Legal pages
    "terms-title": "Умови використання",
    "terms-general": "Загальні положення",
    "terms-subject": "Предмет договору",
    "terms-order": "Оформлення замовлення",
    "terms-payment": "Оплата замовлення",
    "privacy-title": "Політика конфіденційності",
    "rules-title": "Правила користування",
  }
};

// Функция для получения перевода
function t(key) {
  const lang = localStorage.getItem('language') || 'ru';
  const result = translations[lang]?.[key] || translations.ru[key] || key;
  console.log(`[i18n] t("${key}") lang=${lang} => "${result}"`);
  return result;
}

// Функция для обновления всех текстов на странице
function updatePageLanguage() {
  console.log('[i18n] updatePageLanguage() called');
  const elements = document.querySelectorAll('[data-i18n]');
  console.log(`[i18n] Found ${elements.length} elements with data-i18n`);
  
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    el.textContent = translated;
    console.log(`[i18n] Updated element: ${key} => ${translated}`);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

// Обновляем язык при загрузке
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[i18n] DOMContentLoaded event fired');
    updatePageLanguage();
  });
} else {
  console.log('[i18n] Document already loaded, calling updatePageLanguage');
  updatePageLanguage();
}

// Слушаем изменения языка
window.addEventListener('storage', (e) => {
  if (e.key === 'language') {
    console.log(`[i18n] storage event: language changed to ${e.newValue}`);
    updatePageLanguage();
  }
});

// Также слушаем пользовательское событие
window.addEventListener('languageChanged', () => {
  console.log('[i18n] languageChanged event fired');
  updatePageLanguage();
  // Вызываем функцию перевода если она есть на странице
  if (typeof translateElements === 'function') {
    console.log('[i18n] Calling translateElements()');
    translateElements();
  }
});
