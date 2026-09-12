import { playTick, playFrostChime, playAirflow } from './audio.js';

/* ===== Thermostat Dial ===== */
export function initDial() {
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
