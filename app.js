(function () {
  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var header = document.querySelector('.site-header');
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.getElementById('mobile-nav');

  var SUN =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  var MOON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  var theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  function applyTheme(next) {
    theme = next;
    root.setAttribute('data-theme', theme);
    if (!toggle) return;
    toggle.innerHTML = theme === 'dark' ? SUN : MOON;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }

  applyTheme(theme);

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
    });
  }

  // Header border on scroll
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  // Active nav state
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  var sections = [];
  Array.prototype.forEach.call(navLinks, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
    if (el) sections.push({ el: el, link: a });
  });
  var activeLink = null;
  var navTick = false;
  function updateNav() {
    navTick = false;
    if (!sections.length) return;
    var line = window.scrollY + window.innerHeight * 0.35;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].el.getBoundingClientRect().top + window.scrollY;
      if (top <= line) current = sections[i].link;
    }
    if (atBottom) current = sections[sections.length - 1].link;
    if (current === activeLink) return;
    if (activeLink) activeLink.classList.remove('is-active');
    activeLink = current;
    if (activeLink) activeLink.classList.add('is-active');
  }
  window.addEventListener('scroll', function () {
    if (navTick) return;
    navTick = true;
    requestAnimationFrame(updateNav);
  }, { passive: true });
  updateNav();

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    Array.prototype.forEach.call(reveals, function (el) {
      io.observe(el);
    });
  } else {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add('is-visible');
    });
  }
})();
