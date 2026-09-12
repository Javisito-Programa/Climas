/* ===== Animated Counters (GH Servicios Técnicos) ===== */
export function initStats() {
  const section = document.getElementById('stats');
  const nums = document.querySelectorAll('.stats__num, .stat-card__num');
  if (!section || !nums.length) return;

  let animated = false;

  function runAnimation() {
    if (animated) return;
    animated = true;
    nums.forEach((el) => animateCounter(el));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAnimation();
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(section);

  // Fallback seguro: si ya está visible, animar tras 500ms
  setTimeout(() => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      runAnimation();
    }
  }, 600);

  function animateCounter(el) {
    const rawTarget = el.dataset.target;
    if (!rawTarget) return;

    const isFloat = rawTarget.includes('.');
    const target = parseFloat(rawTarget);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isFloat) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.round(current).toLocaleString('es-MX');
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('es-MX');
      }
    }

    requestAnimationFrame(tick);
  }
}
