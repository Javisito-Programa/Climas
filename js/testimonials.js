/* ===== Testimonials Carousel ===== */
export function initTestimonials() {
  const track = document.getElementById('test-track');
  const dotsWrap = document.getElementById('test-dots');
  if (!track || !dotsWrap) return;

  const cards = track.querySelectorAll('.testimonials__card');
  const total = cards.length;
  let currentIdx = 0;
  let autoPlayTimer = null;
  let isDragging = false;
  let startX = 0;
  let dragDelta = 0;

  // Determine visible cards count based on viewport
  function getVisibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const maxIdx = Math.max(0, total - getVisibleCount());
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === currentIdx ? ' is-active' : '');
      dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    const visible = getVisibleCount();
    const maxIdx = Math.max(0, total - visible);
    currentIdx = Math.max(0, Math.min(idx, maxIdx));

    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // matches CSS gap
    const offset = currentIdx * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.testimonials__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === currentIdx);
    });

    // Update active card styling
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i >= currentIdx && i < currentIdx + visible);
    });
  }

  // Auto-play
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      const visible = getVisibleCount();
      const maxIdx = total - visible;
      goTo(currentIdx >= maxIdx ? 0 : currentIdx + 1);
    }, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  // Touch/mouse drag
  function onDragStart(e) {
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    track.style.transition = 'none';
    stopAutoPlay();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    dragDelta = x - startX;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';

    if (Math.abs(dragDelta) > 60) {
      if (dragDelta < 0) goTo(currentIdx + 1);
      else goTo(currentIdx - 1);
    } else {
      goTo(currentIdx);
    }
    dragDelta = 0;
    startAutoPlay();
  }

  track.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  track.addEventListener('touchstart', onDragStart, { passive: true });
  window.addEventListener('touchmove', onDragMove, { passive: true });
  window.addEventListener('touchend', onDragEnd);

  // Init
  buildDots();
  goTo(0);
  startAutoPlay();

  // Rebuild on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(Math.min(currentIdx, Math.max(0, total - getVisibleCount())));
  });

  // Pause autoplay on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);
}
