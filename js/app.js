(function () {
  'use strict';

  /* ===== js/audio.js ===== */
/* ===== Audio Effects Synthesizer (Web Audio API) ===== */
// Generates soft tactile sounds with zero external audio assets

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function isSoundEnabled() {
  return soundEnabled;
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem('gh_sound_enabled', soundEnabled ? '1' : '0');
  } catch (e) {}
  return soundEnabled;
}

// Load persisted preference
try {
  const saved = localStorage.getItem('gh_sound_enabled');
  if (saved !== null) soundEnabled = saved === '1';
} catch (e) {}

/**
 * Tactile thermostat dial click
 */
function playTick(pitch = 1) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 420 * pitch;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

/**
 * Crystalline ice chime for minimum temperature (16°C) or success states
 */
function playFrostChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.035, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {}
}

/**
 * Soft cool breeze whoosh
 */
function playAirflow() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Generate pink/white noise buffer
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.3);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  } catch (e) {}
}


  /* ===== js/loader.js ===== */
/* ==========================================================================
   GH SERVICIOS TÉCNICOS — LUXURY POLAR LOADER & TAB TRANSITION ENGINE
   Full experience on Home (~2.6s) / Snappy fast transition on Secondary (~0.9s)
   ========================================================================== */

function initLoader(onComplete) {
  const loader = document.getElementById('loader');
  const canvas = document.getElementById('loader-canvas');
  const mercury = document.getElementById('loader-mercury');
  const bulb = document.getElementById('loader-bulb');
  const tubeFrost = document.getElementById('loader-tube-frost');
  const tempEl = document.getElementById('loader-temp');
  const statusEl = document.getElementById('loader-status');
  const brandEl = document.getElementById('loader-brand');
  const frostEl = document.getElementById('loader-frost');

  if (!loader || !canvas) {
    onComplete?.();
    return;
  }

  // Detect whether this is the main home page or a secondary section
  const path = window.location.pathname.toLowerCase();
  const isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/') || !path.includes('.html');

  // Animation parameters calibrated by page type
  const START_T = isHome ? 40 : 28;
  const END_T = 16;
  const COOL_DUR = isHome ? 2600 : 850; // Snappy fast transition on secondary pages

  const ctx = canvas.getContext('2d');
  let w, h, running = true;
  let coolingProgress = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ─── Snowflake System ───
  const snowflakes = [];
  const NUM_FLAKES = isHome ? 90 : 45;

  class Snowflake {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : -15 - Math.random() * 80;
      this.r = Math.random() * 4.5 + 1.5;
      this.vy = Math.random() * 1.8 + 0.5;
      this.vx = Math.random() * 1.0 - 0.2;
      this.alpha = Math.random() * 0.55 + 0.15;
      this.rot = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.04;
      this.type = Math.random();
      this.wobble = Math.random() * 100;
    }
    update(t) {
      this.y += this.vy;
      this.x += this.vx + Math.sin((this.y + this.wobble) * 0.012) * 0.4;
      this.rot += this.rotV;
      if (this.y > h + 15 || this.x < -30 || this.x > w + 30) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;

      if (this.type < 0.6) {
        ctx.beginPath();
        ctx.arc(0, 0, this.r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#D0EEFF';
        ctx.shadowColor = '#00D4FF';
        ctx.shadowBlur = this.r * 2;
        ctx.fill();
      } else if (this.type < 0.9) {
        ctx.strokeStyle = '#B8E8FF';
        ctx.lineWidth = this.r * 0.12;
        ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 4);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -this.r * 0.75);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = this.r * 0.1;
        ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI) / 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -this.r);
          ctx.moveTo(0, -this.r * 0.45);
          ctx.lineTo(this.r * 0.22, -this.r * 0.68);
          ctx.moveTo(0, -this.r * 0.45);
          ctx.lineTo(-this.r * 0.22, -this.r * 0.68);
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < NUM_FLAKES; i++) snowflakes.push(new Snowflake());

  // ─── Cold Air Waves ───
  let waveOffset = 0;
  function drawAirWaves() {
    waveOffset += 1.8;
    for (let i = 0; i < 5; i++) {
      const y = h * 0.18 + i * h * 0.16;
      ctx.save();
      ctx.globalAlpha = 0.025 + i * 0.005;
      ctx.strokeStyle = '#00D4FF';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const wave = Math.sin((x - waveOffset + i * 300) * 0.006) * 22
                   + Math.sin((x - waveOffset * 0.6 + i * 150) * 0.013) * 10;
        if (x === 0) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // ─── Center Ambient Polar Glow ───
  function drawCenterGlow(progress) {
    const cx = w / 2, cy = h / 2;
    const intensity = 0.04 + progress * 0.06;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 260);
    gradient.addColorStop(0, `rgba(0,210,255,${intensity})`);
    gradient.addColorStop(0.6, `rgba(0,98,204,${intensity * 0.4})`);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - 260, cy - 260, 520, 520);
  }

  // ─── Main Animation Loop ───
  let time = 0;
  function animate() {
    if (!running) return;
    time++;
    ctx.clearRect(0, 0, w, h);

    drawAirWaves();
    drawCenterGlow(coolingProgress);
    snowflakes.forEach(s => { s.update(time); s.draw(ctx); });

    requestAnimationFrame(animate);
  }
  animate();

  // ─── Mercury Cooling Mechanics ───
  const colorStops = [
    { t: 0,    r: 255, g: 61,  b: 61  },  // hot red
    { t: 0.3,  r: 255, g: 140, b: 50  },  // orange
    { t: 0.55, r: 50,  g: 210, b: 130 },  // emerald
    { t: 0.8,  r: 0,   g: 180, b: 255 },  // cyan
    { t: 1,    r: 0,   g: 212, b: 255 },  // electric polar cyan
  ];

  function getColor(progress) {
    for (let i = 0; i < colorStops.length - 1; i++) {
      const a = colorStops[i], b = colorStops[i + 1];
      if (progress >= a.t && progress <= b.t) {
        const local = (progress - a.t) / (b.t - a.t);
        return {
          r: Math.round(a.r + (b.r - a.r) * local),
          g: Math.round(a.g + (b.g - a.g) * local),
          b: Math.round(a.b + (b.b - a.b) * local),
        };
      }
    }
    return colorStops[colorStops.length - 1];
  }

  const coolStart = performance.now();

  function updateCooling(now) {
    const elapsed = now - coolStart;
    const progress = Math.min(1, elapsed / COOL_DUR);
    coolingProgress = progress;

    // Easing
    const eased = 1 - Math.pow(1 - progress, 3);
    const temp = Math.round(START_T - eased * (START_T - END_T));
    const mercuryH = 18 + (1 - eased) * 67; // 85% -> 18%
    const col = getColor(eased);
    const rgb = `rgb(${col.r},${col.g},${col.b})`;
    const rgba = `rgba(${col.r},${col.g},${col.b}`;

    // Update Mercury
    if (mercury) {
      mercury.style.height = mercuryH + '%';
      mercury.style.background = `linear-gradient(to top, ${rgb}, ${rgba},0.55))`;
    }

    // Update Bulb
    if (bulb) {
      bulb.style.background = rgb;
      bulb.style.boxShadow = `0 0 ${25 + eased * 15}px ${rgba},0.4)`;
    }

    // Update Readout
    if (tempEl) {
      tempEl.textContent = temp;
      tempEl.style.color = rgb;
      tempEl.style.textShadow = `0 0 28px ${rgba},0.45)`;
    }

    // Status message for Cárdenas, Tabasco
    if (statusEl) {
      if (isHome) {
        if (temp > 32) statusEl.textContent = 'Enfriando Cárdenas, Tab…';
        else if (temp > 24) statusEl.textContent = 'Bochorno controlado…';
        else if (temp > 18) statusEl.textContent = 'Temperatura Confort…';
        else statusEl.textContent = '¡Aire Ártico Polar!';
      } else {
        if (temp > 22) statusEl.textContent = 'Cargando sección…';
        else statusEl.textContent = '¡Listo!';
      }
    }

    // Tube Frost
    if (tubeFrost && eased > 0.4) {
      tubeFrost.style.opacity = (eased - 0.4) * 1.8;
    }

    if (progress < 1) {
      requestAnimationFrame(updateCooling);
    } else {
      finishLoading();
    }
  }

  // Start cooling immediately
  requestAnimationFrame(updateCooling);

  // ─── Finish Loading Transition ───
  function finishLoading() {
    if (tempEl) tempEl.style.textShadow = '0 0 50px rgba(0,210,255,0.8)';
    if (statusEl) {
      statusEl.textContent = isHome ? '¡16°C Listo! Bienvenido' : '¡Listo!';
      statusEl.style.color = '#00D4FF';
    }

    if (brandEl) brandEl.classList.add('is-visible');
    if (frostEl) frostEl.classList.add('is-spreading');

    const fadeWait = isHome ? 1200 : 350;
    const removeWait = isHome ? 700 : 350;

    setTimeout(() => {
      running = false;
      loader.classList.add('is-done');
      setTimeout(() => {
        loader.remove();
        onComplete?.();
      }, removeWait);
    }, fadeWait);
  }
}


  /* ===== js/nav.js ===== */
/* ===== Navigation ===== */
function initNav() {
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


  /* ===== js/stats.js ===== */
/* ===== Animated Counters (GH Servicios Técnicos) ===== */
function initStats() {
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


  /* ===== js/services.js ===== */
/* ===== Service Accordions ===== */
function initServices() {
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


  /* ===== js/calculator.js ===== */
/* ===== Mérida AC BTU & Tonnage Calculator Engine ===== */

function initCalculator() {
  const slider = document.getElementById('calc-area-slider');
  const areaVal = document.getElementById('calc-area-val');
  const sunOptions = document.querySelectorAll('.calc__opt[data-sun]');
  const peopleOptions = document.querySelectorAll('.calc__opt[data-people]');

  const tonNum = document.getElementById('calc-ton-num');
  const btuLabel = document.getElementById('calc-btu-label');
  const voltVal = document.getElementById('calc-volt-val');
  const seerVal = document.getElementById('calc-seer-val');
  const savingsVal = document.getElementById('calc-savings-val');
  const waBtn = document.getElementById('calc-wa-btn');
  const showroomLink = document.getElementById('calc-showroom-link');

  if (!slider) return;

  let area = parseInt(slider.value) || 16;
  let isDirectSun = true;
  let peopleCount = 2;

  function calculate() {
    // Thermal load for Mérida extreme tropical climate
    let btuPerM2 = isDirectSun ? 1050 : 850;
    let totalBtu = area * btuPerM2;

    // Additional heat per person
    if (peopleCount > 2) {
      totalBtu += (peopleCount - 2) * 600;
    }

    // Determine standard tonnage
    let tons = '1.0 Ton';
    let btuName = '12,000 BTU';
    let btuNum = 12000;
    let seer = 'SEER 18 - 22';
    let savings = '$680 MXN';

    if (totalBtu <= 13500) {
      tons = '1.0 Ton';
      btuName = '12,000 BTU';
      btuNum = 12000;
      seer = 'SEER 18 - 22';
      savings = '$650 MXN';
    } else if (totalBtu <= 19500) {
      tons = '1.5 Ton';
      btuName = '18,000 BTU';
      btuNum = 18000;
      seer = 'SEER 19 - 22';
      savings = '$920 MXN';
    } else if (totalBtu <= 26500) {
      tons = '2.0 Ton';
      btuName = '24,000 BTU';
      btuNum = 24000;
      seer = 'SEER 20 - 22';
      savings = '$1,250 MXN';
    } else {
      tons = '3.0 Ton';
      btuName = '36,000 BTU';
      btuNum = 36000;
      seer = 'SEER 18 - 20';
      savings = '$1,800 MXN';
    }

    // Update DOM
    if (tonNum) tonNum.textContent = tons;
    if (btuLabel) btuLabel.textContent = `${btuName} · Inverter 220V`;
    if (voltVal) voltVal.textContent = '220V Bifásico';
    if (seerVal) seerVal.textContent = seer;
    if (savingsVal) savingsVal.textContent = savings;

    // Update WhatsApp link
    if (waBtn) {
      const sunText = isDirectSun ? 'Techo de losa/lámina expuesto al sol de Tabasco' : 'Planta baja / techado con sombra';
      const msg = encodeURIComponent(
        `Hola GH Servicios Técnicos, usé la calculadora de capacidad para mi espacio en Cárdenas / Tabasco:\n` +
        `• Superficie: *${area} m²*\n` +
        `• Exposición: ${sunText}\n` +
        `• Ocupantes: ${peopleCount} personas\n` +
        `• Capacidad recomendada: *${tons} (${btuName}) Inverter 220V*\n` +
        `¿Qué equipos tienen disponibles y qué costo tiene la entrega e instalación?`
      );
      waBtn.href = `https://wa.me/529371037277?text=${msg}`;
    }

    if (showroomLink) {
      showroomLink.href = '#productos';
    }
  }

  // Slider listener
  slider.addEventListener('input', () => {
    area = parseInt(slider.value);
    if (areaVal) areaVal.textContent = `${area} m²`;
    playTick(1.1);
    calculate();
  });

  // Sun options
  sunOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      sunOptions.forEach(o => o.classList.remove('is-active'));
      opt.classList.add('is-active');
      isDirectSun = opt.dataset.sun === 'direct';
      playTick(1.2);
      calculate();
    });
  });

  // People options
  peopleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      peopleOptions.forEach(o => o.classList.remove('is-active'));
      opt.classList.add('is-active');
      peopleCount = parseInt(opt.dataset.people) || 2;
      playTick(1.2);
      calculate();
    });
  });

  calculate();
}


  /* ===== js/timeline.js ===== */
/* ===== Timeline Scroll Fill ===== */
function initTimeline() {
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


  /* ===== js/testimonials.js ===== */
/* ===== Testimonials Carousel ===== */
function initTestimonials() {
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


  /* ===== js/faq.js ===== */
/* ===== Interactive FAQ Accordion ===== */

function initFAQ() {
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


  /* ===== js/contact.js ===== */
/* ===== Contact Form → WhatsApp ===== */
function initContact() {
  const form = document.getElementById('contact-form');
  const successEl = document.getElementById('contact-ok');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const name = form.querySelector('#c-name').value.trim();
    const phone = form.querySelector('#c-phone').value.trim();
    const service = form.querySelector('#c-service').value;
    const msg = form.querySelector('#c-msg').value.trim();

    // Build WhatsApp message
    let waText = `Hola, soy ${name}.\n`;
    waText += `📱 Tel: ${phone}\n`;
    waText += `🔧 Servicio: ${service}\n`;
    if (msg) waText += `💬 ${msg}`;

    const waUrl = `https://wa.me/529371037277?text=${encodeURIComponent(waText)}`;

    // Show success animation
    if (successEl) {
      successEl.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        window.open(waUrl, '_blank');
        // Reset after a moment
        setTimeout(() => {
          successEl.setAttribute('aria-hidden', 'true');
          form.reset();
          clearErrors();
        }, 2000);
      }, 1200);
    } else {
      window.open(waUrl, '_blank');
    }
  });

  function validate() {
    let valid = true;
    clearErrors();

    const name = form.querySelector('#c-name');
    const phone = form.querySelector('#c-phone');
    const service = form.querySelector('#c-service');

    if (!name.value.trim()) {
      showError('err-name', 'Ingresa tu nombre', name);
      valid = false;
    }

    if (!phone.value.trim() || phone.value.trim().length < 7) {
      showError('err-phone', 'Ingresa un teléfono válido', phone);
      valid = false;
    }

    if (!service.value) {
      showError('err-service', 'Selecciona un servicio', service);
      valid = false;
    }

    return valid;
  }

  function showError(id, msg, field) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
    field?.closest('.contact__field')?.classList.add('has-error');
  }

  function clearErrors() {
    form.querySelectorAll('.contact__err').forEach(el => el.textContent = '');
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
  }

  const previewEl = document.getElementById('contact-bubble-preview');

  function updatePreview() {
    if (!previewEl) return;
    const name = form.querySelector('#c-name')?.value.trim() || 'Tu nombre';
    const phone = form.querySelector('#c-phone')?.value.trim() || 'Tu teléfono';
    const service = form.querySelector('#c-service')?.value || 'Servicio a elegir';
    const msg = form.querySelector('#c-msg')?.value.trim();

    let html = `Hola GH Servicios Técnicos 👋<br>`;
    html += `• Nombre: <strong>${escapeHtml(name)}</strong><br>`;
    html += `• Teléfono: <strong>${escapeHtml(phone)}</strong><br>`;
    html += `• Servicio: <strong>${escapeHtml(service)}</strong>`;
    if (msg) {
      html += `<br>• Detalle: <em>"${escapeHtml(msg)}"</em>`;
    }
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    html += `<small>${timeStr} · Listo para enviar ✓✓</small>`;
    previewEl.innerHTML = html;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Clear field error and update preview on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.contact__field')?.classList.remove('has-error');
      const errEl = field.closest('.contact__field')?.querySelector('.contact__err');
      if (errEl) errEl.textContent = '';
      updatePreview();
    });
    field.addEventListener('change', updatePreview);
  });

  updatePreview();
}


  /* ===== js/scroll-thermo.js ===== */
/* ===== Scroll Thermometer ===== */
function initScrollThermo() {
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


  /* ===== js/widget.js ===== */
/* ===== Floating WhatsApp Smart Widget Logic ===== */

function initWidget() {
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


  /* ===== js/dial.js ===== */

/* ===== Thermostat Dial ===== */
function initDial() {
  const dialEl = document.getElementById('dial');
  const svgEl = document.getElementById('dial-svg');
  const tempEl = document.getElementById('dial-temp');
  const modeEl = document.getElementById('dial-mode');
  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  const heroBg = document.getElementById('hero-bg');
  const presets = document.querySelectorAll('.hero__preset');
  if (!dialEl || !svgEl) return;

  const MIN = 16, MAX = 30;
  const CX = 150, CY = 150, R = 120;
  const START_ANGLE = 135, END_ANGLE = 405, ARC_DEG = 270;

  // Premium vivid colors matching GH logo
  // Clean Luxury Tech Palette matching GH logo and business card
  const COLD = { r: 0, g: 98, b: 204 };    // Royal Sapphire Blue
  const WARM = { r: 255, g: 90, b: 35 };   // Fiery orange/amber for high heat without AC

  let currentTemp = 22;
  let lastPlayedTemp = 22;
  let isDragging = false;
  let animTimer = null;

  buildDial();
  updateDial(currentTemp);

  function buildDial() {
    svgEl.innerHTML = '';

    // Outer ring glow
    const outerGlow = createSVG('circle', {
      cx: CX, cy: CY, r: R + 8,
      fill: 'none', stroke: 'rgba(0,98,204,0.06)', 'stroke-width': 16
    });

    // Background track
    const trackPath = describeArc(CX, CY, R, START_ANGLE, END_ANGLE);
    const track = createSVG('path', {
      d: trackPath, fill: 'none', stroke: 'rgba(0,98,204,0.1)',
      'stroke-width': 10, 'stroke-linecap': 'round'
    });

    // Secondary subtle track
    const trackInner = createSVG('path', {
      d: describeArc(CX, CY, R - 1, START_ANGLE, END_ANGLE),
      fill: 'none', stroke: 'rgba(0,98,204,0.04)',
      'stroke-width': 6, 'stroke-linecap': 'round'
    });

    // Tick marks
    const tickGroup = createSVG('g', {});
    for (let t = MIN; t <= MAX; t++) {
      const frac = (t - MIN) / (MAX - MIN);
      const angle = START_ANGLE + frac * ARC_DEG;
      const rad = angle * Math.PI / 180;
      const isMajor = t % 2 === 0;
      const innerR = isMajor ? R - 18 : R - 13;
      const outerR = R - 5;
      const x1 = CX + innerR * Math.cos(rad);
      const y1 = CY + innerR * Math.sin(rad);
      const x2 = CX + outerR * Math.cos(rad);
      const y2 = CY + outerR * Math.sin(rad);
      const tick = createSVG('line', {
        x1, y1, x2, y2,
        stroke: isMajor ? 'rgba(0,98,204,0.35)' : 'rgba(0,98,204,0.15)',
        'stroke-width': isMajor ? 2 : 1,
        'stroke-linecap': 'round'
      });
      tickGroup.appendChild(tick);

      // Number labels for major ticks
      if (isMajor) {
        const labelR = R - 26;
        const lx = CX + labelR * Math.cos(rad);
        const ly = CY + labelR * Math.sin(rad);
        const label = createSVG('text', {
          x: lx, y: ly + 3,
          'text-anchor': 'middle',
          'font-family': "'IBM Plex Mono', monospace",
          'font-size': '8.5',
          'font-weight': '600',
          fill: 'rgba(9,17,36,0.55)'
        });
        label.textContent = t;
        tickGroup.appendChild(label);
      }
    }

    // Active arc (gradient via defs)
    const defs = createSVG('defs', {});
    const gradId = 'dial-grad';
    const linearGrad = createSVG('linearGradient', { id: gradId, x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    const stop1 = createSVG('stop', { offset: '0%', 'stop-color': 'rgb(0,98,204)' });
    const stop2 = createSVG('stop', { offset: '100%', 'stop-color': 'rgb(0,184,255)' });
    linearGrad.append(stop1, stop2);
    defs.appendChild(linearGrad);

    const activeArc = createSVG('path', {
      id: 'dial-active', d: trackPath, fill: 'none',
      stroke: `url(#${gradId})`, 'stroke-width': 10, 'stroke-linecap': 'round'
    });

    // Glow filter for knob
    const glowFilter = createSVG('filter', { id: 'knob-glow' });
    const feGauss = createSVG('feGaussianBlur', { stdDeviation: '4', result: 'blur' });
    const feMerge = createSVG('feMerge', {});
    const feMNode1 = createSVG('feMergeNode', { in: 'blur' });
    const feMNode2 = createSVG('feMergeNode', { in: 'SourceGraphic' });
    feMerge.append(feMNode1, feMNode2);
    glowFilter.append(feGauss, feMerge);
    defs.appendChild(glowFilter);

    // Knob
    const knobGroup = createSVG('g', { id: 'dial-knob', style: 'cursor:grab', filter: 'url(#knob-glow)' });
    const knobGlow = createSVG('circle', {
      id: 'dial-knob-glow', cx: 0, cy: 0, r: 22,
      fill: 'rgba(0,98,204,0.12)'
    });
    const knobOuter = createSVG('circle', {
      id: 'dial-knob-outer', cx: 0, cy: 0, r: 15,
      fill: '#FFFFFF', stroke: 'rgb(0,98,204)', 'stroke-width': 3
    });
    const knobInner = createSVG('circle', {
      id: 'dial-knob-inner', cx: 0, cy: 0, r: 5, fill: 'rgb(0,98,204)'
    });
    knobGroup.append(knobGlow, knobOuter, knobInner);

    svgEl.append(defs, outerGlow, track, trackInner, tickGroup, activeArc, knobGroup);
  }

  function updateDial(temp, playSound = true) {
    currentTemp = Math.round(Math.min(MAX, Math.max(MIN, temp)));
    const frac = (currentTemp - MIN) / (MAX - MIN);
    const angle = START_ANGLE + frac * ARC_DEG;

    const color = lerpColor(COLD, WARM, frac);
    const rgb = `rgb(${color.r},${color.g},${color.b})`;
    const rgba = `rgba(${color.r},${color.g},${color.b}`;

    // Play tactile sound when value changes
    if (playSound && currentTemp !== lastPlayedTemp) {
      const pitch = 1.3 - frac * 0.6;
      playTick(pitch);
      if (currentTemp === MIN) {
        playFrostChime();
        playAirflow();
      }
      lastPlayedTemp = currentTemp;
    }

    // Update CSS variables
    const root = document.documentElement.style;
    root.setProperty('--accent', rgb);
    root.setProperty('--accent-r', color.r);
    root.setProperty('--accent-g', color.g);
    root.setProperty('--accent-b', color.b);
    root.setProperty('--accent-glow', `${rgba},0.25)`);
    root.setProperty('--accent-deep', `${rgba},0.08)`);

    // Update gradient stops
    const stop1 = svgEl.querySelector('#dial-grad stop:first-child');
    const stop2 = svgEl.querySelector('#dial-grad stop:last-child');
    if (stop1) stop1.setAttribute('stop-color', rgb);
    if (stop2) {
      const midColor = lerpColor(color, { r: 0, g: 102, b: 255 }, 0.5);
      stop2.setAttribute('stop-color', `rgb(${midColor.r},${midColor.g},${midColor.b})`);
    }

    // Active arc
    const activeArc = svgEl.querySelector('#dial-active');
    if (activeArc) {
      const arcEnd = START_ANGLE + frac * ARC_DEG;
      activeArc.setAttribute('d', describeArc(CX, CY, R, START_ANGLE, Math.max(START_ANGLE + 1, arcEnd)));
    }

    // Knob position
    const knob = svgEl.querySelector('#dial-knob');
    if (knob) {
      const rad = angle * Math.PI / 180;
      const kx = CX + R * Math.cos(rad);
      const ky = CY + R * Math.sin(rad);
      knob.setAttribute('transform', `translate(${kx},${ky})`);
      svgEl.querySelector('#dial-knob-glow')?.setAttribute('fill', `${rgba},0.15)`);
      svgEl.querySelector('#dial-knob-outer')?.setAttribute('stroke', rgb);
      svgEl.querySelector('#dial-knob-inner')?.setAttribute('fill', rgb);
    }

    if (tempEl) tempEl.textContent = currentTemp;

    // Presets active state sync
    presets.forEach(btn => {
      const pTemp = parseInt(btn.dataset.temp);
      btn.classList.toggle('is-active', pTemp === currentTemp);
    });

    // Dynamic copy
    if (currentTemp <= 19) {
      if (modeEl) modeEl.textContent = 'Enfriamiento máximo';
      if (titleEl) titleEl.textContent = 'Con GH, tú controlas el calor';
      if (subtitleEl) subtitleEl.textContent = 'Refrescante como necesitas en Cárdenas, Tabasco';
    } else if (currentTemp <= 24) {
      if (modeEl) modeEl.textContent = 'Confort ideal';
      if (titleEl) titleEl.textContent = 'Encuentra tu punto de confort';
      if (subtitleEl) subtitleEl.textContent = 'Temperatura ideal para tu hogar u oficina en Tabasco';
    } else {
      if (modeEl) modeEl.textContent = 'Modo eco';
      if (titleEl) titleEl.textContent = 'Así se siente sin el clima adecuado';
      if (subtitleEl) subtitleEl.textContent = '¿Ya sentiste el bochorno de Tabasco? Nosotros lo resolvemos';
    }

    // Hero background
    if (heroBg) {
      const i = 0.04 + frac * 0.05;
      heroBg.style.background = `
        radial-gradient(ellipse 80% 60% at 25% 35%, ${rgba},${i}), transparent 70%),
        radial-gradient(ellipse 60% 50% at 75% 65%, ${rgba},${i * 0.5}), transparent 60%),
        var(--bg)
      `;
    }

    dialEl.setAttribute('aria-valuenow', currentTemp);
  }

  // Animated preset transition
  function setTempAnimated(target) {
    if (animTimer) cancelAnimationFrame(animTimer);
    const start = currentTemp;
    const diff = target - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = start + diff * ease;
      updateDial(val, true);

      if (progress < 1) {
        animTimer = requestAnimationFrame(step);
      } else {
        updateDial(target, true);
      }
    }
    animTimer = requestAnimationFrame(step);
  }

  // Preset button listeners
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = parseInt(btn.dataset.temp);
      if (!isNaN(t)) setTempAnimated(t);
    });
  });

  // ─── Interaction ───
  function getAngleFromEvent(e) {
    const rect = svgEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = e.touches ? e.touches[0].clientX : e.clientX;
    const py = e.touches ? e.touches[0].clientY : e.clientY;
    let a = Math.atan2(py - cy, px - cx) * 180 / Math.PI;
    if (a < 0) a += 360;
    return a;
  }

  function angleToTemp(a) {
    let norm = a - START_ANGLE;
    if (norm < 0) norm += 360;
    if (norm > ARC_DEG) return norm - ARC_DEG < (360 - ARC_DEG) / 2 ? MAX : MIN;
    return Math.round(MIN + (norm / ARC_DEG) * (MAX - MIN));
  }

  function onStart(e) { isDragging = true; dialEl.style.cursor = 'grabbing'; onMove(e); }
  function onMove(e) { if (!isDragging) return; e.preventDefault(); updateDial(angleToTemp(getAngleFromEvent(e))); }
  function onEnd() { isDragging = false; dialEl.style.cursor = 'grab'; }

  dialEl.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  dialEl.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);

  dialEl.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); updateDial(currentTemp + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); updateDial(currentTemp - 1); }
  });

  // ─── Helpers ───
  function describeArc(cx, cy, r, sa, ea) {
    const sr = sa * Math.PI / 180, er = ea * Math.PI / 180;
    const x1 = cx + r * Math.cos(sr), y1 = cy + r * Math.sin(sr);
    const x2 = cx + r * Math.cos(er), y2 = cy + r * Math.sin(er);
    return `M ${x1} ${y1} A ${r} ${r} 0 ${ea - sa > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  }
  function createSVG(tag, attrs) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }
  function lerpColor(a, b, t) {
    return { r: Math.round(a.r + (b.r - a.r) * t), g: Math.round(a.g + (b.g - a.g) * t), b: Math.round(a.b + (b.b - a.b) * t) };
  }
}


  /* ===== js/main.js ===== */
/* ===== Main Orchestrator Multi-Page ===== */













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

/* ===== GH Servicios Técnicos — Contact Form → WhatsApp ===== */
function initContact() {
  const form = document.getElementById('contactForm') || document.getElementById('contact-form');
  if (!form) return;

  const nameInput = form.querySelector('#c-name');
  const colInput = form.querySelector('#c-colonia') || form.querySelector('#c-phone');
  const servSelect = form.querySelector('#c-service');
  const notesInput = form.querySelector('#c-notes') || form.querySelector('#c-msg');
  const previewText = document.getElementById('waPreviewText') || document.getElementById('contact-bubble-preview');
  const btnSend = form.querySelector('#btnSendWa') || form.querySelector('button[type="submit"]');

  function updatePreview() {
    if (!previewText) return;
    const name = nameInput?.value.trim() || '';
    const colonia = colInput?.value.trim() || '';
    const serviceText = servSelect && servSelect.selectedIndex >= 0 ? servSelect.options[servSelect.selectedIndex].text : 'Servicio general';
    const notes = notesInput?.value.trim() || '';

    if (!name && !colonia) {
      previewText.textContent = 'Hola GH Servicios Técnicos, me gustaría cotizar un servicio...';
      return;
    }

    let text = `Hola GH Servicios Técnicos 👋 Me gustaría cotizar:\n`;
    if (name) text += `• Nombre: ${name}\n`;
    if (colonia) text += `• Ubicación: ${colonia}\n`;
    text += `• Servicio: ${serviceText}\n`;
    if (notes) text += `• Detalles: ${notes}\n`;
    text += `¿Tienen disponibilidad para visita técnica en Cárdenas / Tabasco?`;

    previewText.textContent = text;
  }

  // Real-time preview updates
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', updatePreview);
    field.addEventListener('change', updatePreview);
  });
  updatePreview();

  function handleSubmit(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const name = nameInput?.value.trim() || '';
    const colonia = colInput?.value.trim() || '';
    const serviceText = servSelect && servSelect.selectedIndex >= 0 ? servSelect.options[servSelect.selectedIndex].text : 'Servicio a domicilio';
    const notes = notesInput?.value.trim() || '';

    if (!name) {
      alert('Por favor, ingresa tu nombre completo.');
      nameInput?.focus();
      return;
    }

    if (!colonia) {
      alert('Por favor, indica tu colonia o municipio en Tabasco.');
      colInput?.focus();
      return;
    }

    let waMsg = `¡Hola GH Servicios Técnicos! 👋 Deseo solicitar una cotización:\n\n`;
    waMsg += `👤 *Nombre:* ${name}\n`;
    waMsg += `📍 *Ubicación / Colonia:* ${colonia}\n`;
    waMsg += `🛠️ *Servicio requerido:* ${serviceText}\n`;
    if (notes) {
      waMsg += `📝 *Detalles:* ${notes}\n`;
    }
    waMsg += `\n¿Me podrían dar presupuesto y disponibilidad para una visita técnica? Muchas gracias.`;

    const waUrl = `https://wa.me/529371037277?text=${encodeURIComponent(waMsg)}`;

    if (btnSend) {
      const originalHtml = btnSend.innerHTML;
      btnSend.innerHTML = '<span>✓ ¡Abriendo WhatsApp con tus datos...!</span>';
      btnSend.style.background = '#128C7E';
      setTimeout(() => {
        btnSend.innerHTML = originalHtml;
        btnSend.style.background = '';
      }, 4000);
    }

    // Direct redirect to WhatsApp
    const win = window.open(waUrl, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = waUrl;
    }
  }

  form.addEventListener('submit', handleSubmit);
  if (btnSend) {
    btnSend.addEventListener('click', (e) => {
      if (form.checkValidity && !form.checkValidity()) {
        return;
      }
      handleSubmit(e);
    });
  }
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


})();