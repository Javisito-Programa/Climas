/* ===== Floating WhatsApp Smart Widget Logic ===== */
import { playTick } from './audio.js';

export function initWidget() {
  const triggerBtn = document.getElementById('wa-widget-btn');
  const card = document.getElementById('wa-widget-card');
  const closeBtn = document.getElementById('wa-widget-close');

  if (!triggerBtn || !card) return;

  function toggleCard() {
    const isOpen = card.classList.contains('is-open');
    card.classList.toggle('is-open', !isOpen);
    playTick(!isOpen ? 1.2 : 0.8);
  }

  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCard();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    card.classList.remove('is-open');
    playTick(0.8);
  });

  document.addEventListener('click', (e) => {
    if (!card.contains(e.target) && !triggerBtn.contains(e.target) && card.classList.contains('is-open')) {
      card.classList.remove('is-open');
    }
  });
}
