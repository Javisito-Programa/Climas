/* ===== Service Accordions ===== */
export function initServices() {
  const cards = document.querySelectorAll('.services__card');

  cards.forEach(card => {
    const toggle = card.querySelector('.services__toggle');
    const detail = card.querySelector('.services__detail');
    if (!toggle || !detail) return;

    // Click on header area
    const header = card.querySelector('.services__card-head');
    header.addEventListener('click', () => toggleAccordion(toggle, detail));

    // Keyboard
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(toggle, detail);
      }
    });
  });

  function toggleAccordion(toggle, detail) {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    // Close all others
    cards.forEach(c => {
      const t = c.querySelector('.services__toggle');
      const d = c.querySelector('.services__detail');
      if (t && d && t !== toggle) {
        t.setAttribute('aria-expanded', 'false');
        d.setAttribute('aria-hidden', 'true');
      }
    });
    // Toggle current
    toggle.setAttribute('aria-expanded', !isOpen);
    detail.setAttribute('aria-hidden', isOpen);
  }
}
