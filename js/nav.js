/* ===== Navigation ===== */
export function initNav() {
  const nav = document.getElementById('main-nav');
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');
  const links = document.querySelectorAll('.nav__link, .nav__mob-link');
  const sections = document.querySelectorAll('main section[id]');

  // Scroll state
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
    lastScroll = y;
    updateActiveLink();
  }, { passive: true });

  // Burger toggle
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !open);
      mobile.classList.toggle('is-open', !open);
      mobile.setAttribute('aria-hidden', open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
  }

  // Close mobile on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (mobile?.classList.contains('is-open')) {
        burger?.setAttribute('aria-expanded', 'false');
        mobile.classList.remove('is-open');
        mobile.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  // Close mobile on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobile?.classList.contains('is-open')) {
      burger?.setAttribute('aria-expanded', 'false');
      mobile.classList.remove('is-open');
      mobile.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      burger?.focus();
    }
  });

  // Active link tracking
  function updateActiveLink() {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) currentId = sec.id;
    });
    document.querySelectorAll('.nav__link').forEach(l => {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + currentId);
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href === '#main-content') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {}
    });
  });
}
