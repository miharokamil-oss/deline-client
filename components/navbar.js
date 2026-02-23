(function () {
  "use strict";

  const LANGS = {
    ru: { flag: "🇷🇺", name: "Русский" },
    en: { flag: "🇬🇧", name: "English" },
    ua: { flag: "🇺🇦", name: "Українська" },
  };

  const trigger     = document.getElementById("langTrigger");
  const dropdown    = document.getElementById("langDropdown");
  const currentFlag = document.getElementById("currentFlag");

  if (trigger && dropdown) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains("open");
      closeDropdown();
      if (!isOpen) openDropdown();
    });
  }

  function openDropdown()  { if (!trigger || !dropdown) return; trigger.classList.add("open");    dropdown.classList.add("open"); }
  function closeDropdown() { if (!trigger || !dropdown) return; trigger.classList.remove("open"); dropdown.classList.remove("open"); }

  document.addEventListener("click", function (e) {
    const opt = e.target.closest(".lang-option");
    if (opt) { setLanguage(opt.dataset.lang); closeDropdown(); return; }
    if (!e.target.closest(".lang-wrap")) closeDropdown();
  });

  function setLanguage(lang) {
    const data = LANGS[lang];
    if (!data) return;
    console.log(`[navbar] setLanguage("${lang}")`);
    if (currentFlag) currentFlag.textContent = data.flag;
    Object.keys(LANGS).forEach(l => {
      const check = document.getElementById("check-" + l);
      if (check) { if (l === lang) check.classList.remove("hidden"); else check.classList.add("hidden"); }
    });
    localStorage.setItem("language", lang);
    console.log(`[navbar] localStorage.language set to "${lang}"`);
    
    // Обновляем язык на странице
    if (typeof updatePageLanguage === 'function') {
      console.log('[navbar] Calling updatePageLanguage()');
      updatePageLanguage();
    }
    
    // Отправляем событие
    console.log('[navbar] Dispatching languageChanged event');
    window.dispatchEvent(new Event('languageChanged'));
  }

  function restoreLanguage() { setLanguage(localStorage.getItem("language") || "ru"); }

  function updateNavbarAuth() {
    const profileBtn = document.getElementById("profileNavBtn");
    const authBtn    = document.getElementById("authNavBtn");
    const adminBtn   = document.getElementById("adminPanelBtn");
    if (!profileBtn || !authBtn || !adminBtn) return;

    const userJson = localStorage.getItem("currentUser");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        profileBtn.classList.remove("hidden");
        authBtn.classList.add("hidden");
        if (user.is_admin === true || user.is_admin === "true") adminBtn.classList.remove("hidden");
        else adminBtn.classList.add("hidden");
      } catch {
        profileBtn.classList.add("hidden");
        authBtn.classList.remove("hidden");
        adminBtn.classList.add("hidden");
      }
    } else {
      profileBtn.classList.add("hidden");
      authBtn.classList.remove("hidden");
      adminBtn.classList.add("hidden");
    }
  }

  function init() { 
    restoreLanguage(); 
    updateNavbarAuth(); 
    // Небольшая задержка чтобы убедиться что DOM готов
    setTimeout(initThemeToggle, 100);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.addEventListener("storage", e => { if (e.key === "currentUser") updateNavbarAuth(); });
  window.updateNavbarAuth = updateNavbarAuth;

  // ── Theme Toggle ──
  function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    
    if (!themeToggle || !themeIcon) {
      console.warn("Theme toggle elements not found!");
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  function applyTheme(theme) {
    const themeIcon = document.getElementById("themeIcon");
    
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeIcon) {
        themeIcon.src = "sun.png";
        themeIcon.classList.add("spin-animation");
        setTimeout(() => themeIcon.classList.remove("spin-animation"), 600);
      }
    } else {
      document.body.classList.remove("light-theme");
      if (themeIcon) {
        themeIcon.src = "moon.png";
        themeIcon.classList.add("shake-animation");
        setTimeout(() => themeIcon.classList.remove("shake-animation"), 400);
      }
    }
  }
})();
