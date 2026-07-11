(() => {
  const menuToggle = document.getElementById('menu-toggle-mobile');
  const mobileMenu = document.getElementById('menu-mobile');

  if (menuToggle && mobileMenu) {
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const menuIsOpen = () => mobileMenu.classList.contains('active');

    const syncMenuState = () => {
      const isOpen = menuIsOpen();
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    };

    menuToggle.addEventListener('click', () => {
      window.requestAnimationFrame(() => {
        syncMenuState();
        if (menuIsOpen() && document.activeElement === menuToggle) {
          mobileMenu.querySelector(focusableSelector)?.focus();
        }
      });
    });

    document.getElementById('mask')?.addEventListener('click', () => {
      window.requestAnimationFrame(syncMenuState);
    });

    document.addEventListener('keydown', (event) => {
      if (!menuIsOpen()) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        menuToggle.click();
        menuToggle.focus();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = [menuToggle, ...mobileMenu.querySelectorAll(focusableSelector)]
        .filter((element) => element.getClientRects().length > 0);

      if (!focusable.length) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    new MutationObserver(syncMenuState).observe(mobileMenu, {
      attributeFilter: ['class'],
    });

    syncMenuState();
  }

  const themeSwitches = [...document.querySelectorAll('button.theme-switch')];

  if (themeSwitches.length) {
    const syncThemeState = () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

      themeSwitches.forEach((button) => {
        button.setAttribute('aria-pressed', String(isDark));
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
      });
    };

    themeSwitches.forEach((button) => {
      button.addEventListener('click', () => window.requestAnimationFrame(syncThemeState));
    });

    new MutationObserver(syncThemeState).observe(document.documentElement, {
      attributeFilter: ['data-theme'],
    });

    syncThemeState();
  }
})();
