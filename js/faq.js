/* ===== Interactive FAQ Accordion ===== */
import { playTick } from './audio.js';

export function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    question?.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items for clean accordion experience
      items.forEach(other => {
        if (other !== item && other.classList.contains('is-open')) {
          other.classList.remove('is-open');
          other.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__answer')?.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle clicked item
      item.classList.toggle('is-open', !isOpen);
      question.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      answer?.setAttribute('aria-hidden', !isOpen ? 'false' : 'true');

      playTick(!isOpen ? 1.2 : 0.9);
    });
  });
}
