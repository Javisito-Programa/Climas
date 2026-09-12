/* ==========================================================================
   GH SERVICIOS TÉCNICOS — LUXURY POLAR LOADER & TAB TRANSITION ENGINE
   Full experience on Home (~2.6s) / Snappy fast transition on Secondary (~0.9s)
   ========================================================================== */

export function initLoader(onComplete) {
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
