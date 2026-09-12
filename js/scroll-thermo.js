/* ===== Scroll Thermometer ===== */
export function initScrollThermo() {
  const fill = document.getElementById('scroll-fill');
  const bulb = document.getElementById('scroll-bulb');
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
    fill.style.height = (progress * 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}
