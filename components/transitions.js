(function () {
  "use strict";

  const overlay = document.createElement("div");
  overlay.id = "zenex-transition-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 99999;
    pointer-events: none;
    background: radial-gradient(ellipse at center, #1a1a20 0%, #0e0e10 100%);
    opacity: 0;
    transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  `;
  document.body.appendChild(overlay);

  function pageIn() {
    overlay.style.opacity = "1";
    overlay.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transition = "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        overlay.style.opacity = "0";
      });
    });
  }

  function animatePageElements() {
    const elements = document.querySelectorAll(
      ".feature-card, .product-card, .hero-content, .container, .shop-container, .shop-title, .features-title, .auth-card"
    );
    elements.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "none";
      setTimeout(() => {
        el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 80);
    });
  }

  function handleLinkClick(e) {
    const link = e.currentTarget;
    const href = link.getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("javascript") ||
      href.startsWith("http") ||
      href.startsWith("mailto") ||
      link.target === "_blank"
    ) return;

    e.preventDefault();
    overlay.style.transition = "opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "all";
    setTimeout(() => { window.location.href = href; }, 380);
  }

  function bindLinks() {
    document.querySelectorAll("a[href]").forEach(link => {
      link.removeEventListener("click", handleLinkClick);
      link.addEventListener("click", handleLinkClick);
    });
  }

  function init() {
    pageIn();
    animatePageElements();
    bindLinks();
    
    // Оптимизированный observer - игнорируем изменения в input/textarea
    const observer = new MutationObserver((mutations) => {
      let shouldRebind = false;
      
      for (const mutation of mutations) {
        // Игнорируем изменения внутри input, textarea, contenteditable
        if (mutation.target.tagName === 'INPUT' || 
            mutation.target.tagName === 'TEXTAREA' ||
            mutation.target.isContentEditable ||
            mutation.target.closest('input, textarea, [contenteditable]')) {
          continue;
        }
        
        // Проверяем только добавленные узлы с ссылками
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1 && (node.tagName === 'A' || node.querySelector('a'))) {
            shouldRebind = true;
            break;
          }
        }
        
        if (shouldRebind) break;
      }
      
      if (shouldRebind) {
        bindLinks();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: false, // Игнорируем изменения текста
      attributes: false // Игнорируем изменения атрибутов
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
