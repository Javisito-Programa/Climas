/* ===== Timeline Scroll Fill ===== */
export function initTimeline() {
  const section = document.getElementById('proceso');
  const fill = document.getElementById('timeline-fill');
  const steps = document.querySelectorAll('.timeline__step');
  if (!section || !fill || !steps.length) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionH = rect.height;
    const viewH = window.innerHeight;

    // Calculate fill progress based on scroll through section
    const scrolledInto = viewH - sectionTop;
    const totalTravel = sectionH + viewH * 0.5;
    const progress = Math.max(0, Math.min(1, scrolledInto / totalTravel));

    fill.style.height = (progress * 100) + '%';

    // Activate steps
    steps.forEach((step, i) => {
      const stepFrac = (i + 0.5) / steps.length;
      step.classList.toggle('is-active', progress >= stepFrac * 0.85);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // Initial
}
