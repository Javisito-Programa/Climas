/* ===== Main Orchestrator Multi-Page ===== */
import { initLoader } from './loader.js?v=25';
import { initDial } from './dial.js?v=25';
import { initNav } from './nav.js?v=25';
import { initStats } from './stats.js?v=25';
import { initServices } from './services.js?v=25';
import { initCalculator } from './calculator.js?v=25';
import { initTimeline } from './timeline.js?v=25';
import { initTestimonials } from './testimonials.js?v=25';
import { initFAQ } from './faq.js?v=25';
import { initContact } from './contact.js?v=25';
import { initScrollThermo } from './scroll-thermo.js?v=25';
import { initWidget } from './widget.js?v=25';
import { toggleSound, isSoundEnabled } from './audio.js?v=25';

// Setup sound toggle buttons
function setupSoundToggles() {
  const soundBtns = document.querySelectorAll('.sound-toggle-btn, #hero-sound-toggle');
  function updateState() {
    const enabled = isSoundEnabled();
    soundBtns.forEach((btn) => {
      btn.classList.toggle('is-muted', !enabled);
      btn.setAttribute(
        'title',
        enabled ? 'Sonido activado (clic para silenciar)' : 'Sonido silenciado (clic para activar)'
      );
    });
  }
  soundBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSound();
      updateState();
    });
  });
  updateState();
}

// Start with loader, then init modules if their elements exist on current page
initLoader(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll('.anim-hero').forEach((el) => {
      el.classList.add('is-visible');
    });
  });

  initNav();
  setupSoundToggles();

  // Initializers with safe guards
  if (document.getElementById('dialSvg')) initDial();
  if (document.getElementById('stats')) initStats();
  if (document.getElementById('servicios')) initServices();
  if (document.getElementById('calculator')) initCalculator();
  if (document.getElementById('proceso')) initTimeline();
  if (document.getElementById('testimonios')) initTestimonials();
  if (document.getElementById('faq')) initFAQ();
  if (document.getElementById('contactForm')) initContact();
  if (document.getElementById('scroll-thermo')) initScrollThermo();
  initWidget();
});
