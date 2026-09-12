/* ===== 3D Product Showroom — High Fidelity & Interactive ===== */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Realistic product catalog with real Mexican market models
const PRODUCTS = [
  {
    id: 'mirage-magnum-22',
    name: 'Mirage Magnum 22 Inverter 1 Ton',
    brand: 'Mirage',
    badge: 'Más Vendido en Mérida',
    type: 'Minisplit Inverter',
    price: 8950,
    specs: { btu: '12,000', seer: '22', voltage: '220V / 1F', refrigerant: 'R-410A', coverage: '15 - 20 m²', noise: '24 dB' },
    addons: [
      { id: 'inst', name: 'Instalación básica (hasta 3m cobre)', price: 1450, checked: true },
      { id: 'gar', name: 'Garantía extendida 2 años', price: 950, checked: false },
      { id: 'sop', name: 'Soporte de pared reforzado', price: 450, checked: false },
      { id: 'prot', name: 'Protector de voltaje digital', price: 380, checked: true },
      { id: 'mant', name: 'Mantenimiento preventivo 1er año', price: 650, checked: false },
    ],
    modelType: 'minisplit-sm'
  },
  {
    id: 'carrier-opticlean-18',
    name: 'Carrier OptiClean Inverter 1.5 Ton',
    brand: 'Carrier',
    badge: 'Máximo Silencio',
    type: 'Minisplit Inverter',
    price: 13890,
    specs: { btu: '18,000', seer: '19.5', voltage: '220V / 1F', refrigerant: 'R-410A', coverage: '24 - 32 m²', noise: '22 dB' },
    addons: [
      { id: 'inst', name: 'Instalación básica (hasta 3m cobre)', price: 1650, checked: true },
      { id: 'gar', name: 'Garantía extendida 3 años', price: 1350, checked: false },
      { id: 'sop', name: 'Soporte de pared reforzado', price: 450, checked: false },
      { id: 'prot', name: 'Protector de voltaje digital', price: 380, checked: true },
      { id: 'mant', name: 'Mantenimiento preventivo 1er año', price: 750, checked: false },
    ],
    modelType: 'minisplit-md'
  },
  {
    id: 'lg-artcool-24',
    name: 'LG Dual Inverter Artcool 2 Ton',
    brand: 'LG',
    badge: 'Gama Alta · Wi-Fi ThinQ',
    type: 'Minisplit Inverter',
    price: 18990,
    specs: { btu: '24,000', seer: '21.5', voltage: '220V / 1F', refrigerant: 'R-32 Ecológico', coverage: '35 - 48 m²', noise: '26 dB' },
    addons: [
      { id: 'inst', name: 'Instalación básica (hasta 4m cobre)', price: 1950, checked: true },
      { id: 'gar', name: 'Garantía extendida 3 años', price: 1650, checked: false },
      { id: 'sop', name: 'Soporte de pared reforzado', price: 550, checked: true },
      { id: 'prot', name: 'Protector de voltaje digital', price: 450, checked: true },
      { id: 'mant', name: 'Mantenimiento preventivo 1er año', price: 850, checked: false },
    ],
    modelType: 'minisplit-lg'
  },
  {
    id: 'mabe-serie-x',
    name: 'Mabe Inverter Serie X 1 Ton',
    brand: 'Mabe',
    badge: 'Protección Green Fin',
    type: 'Minisplit Inverter',
    price: 8490,
    specs: { btu: '12,000', seer: '18', voltage: '110V / 220V', refrigerant: 'R-410A', coverage: '14 - 18 m²', noise: '27 dB' },
    addons: [
      { id: 'inst', name: 'Instalación básica (hasta 3m cobre)', price: 1450, checked: true },
      { id: 'gar', name: 'Garantía extendida 2 años', price: 850, checked: false },
      { id: 'sop', name: 'Soporte de pared reforzado', price: 450, checked: false },
      { id: 'prot', name: 'Protector de voltaje digital', price: 380, checked: true },
    ],
    modelType: 'minisplit-sm'
  },
  {
    id: 'midea-all-easy-pro',
    name: 'Midea All Easy Pro Inverter 1.5 Ton',
    brand: 'Midea',
    badge: 'Fácil Limpieza Express',
    type: 'Minisplit Inverter',
    price: 12950,
    specs: { btu: '18,000', seer: '20', voltage: '220V / 1F', refrigerant: 'R-410A', coverage: '22 - 30 m²', noise: '25 dB' },
    addons: [
      { id: 'inst', name: 'Instalación básica (hasta 3m cobre)', price: 1650, checked: true },
      { id: 'gar', name: 'Garantía extendida 2 años', price: 1100, checked: false },
      { id: 'sop', name: 'Soporte de pared reforzado', price: 450, checked: true },
      { id: 'prot', name: 'Protector de voltaje digital', price: 380, checked: true },
    ],
    modelType: 'minisplit-md'
  }
];

const labelMap = {
  btu: 'Capacidad',
  seer: 'Eficiencia SEER',
  voltage: 'Voltaje / Fases',
  refrigerant: 'Gas Ecológico',
  coverage: 'Área Recomendada',
  noise: 'Nivel de Ruido'
};

let scene, camera, renderer, controls;
let currentModel = null;
let currentIdx = 0;
let animationId;
let isUserInteracting = false;
let isAcOn = true;
let activeFinish = 'white'; // 'white', 'titanium', 'black'

// Animated parts
let swingLouver = null;
let ledDisplayMesh = null;
let particleSystem = null;
let fanBladesMesh = null;

// Target camera transitions
let targetCamPos = null;
let targetLookAt = null;

export function initProducts3D() {
  const canvas = document.getElementById('product-canvas');
  const viewer = document.getElementById('product-viewer');
  const panel = document.getElementById('product-panel');
  const dotsWrap = document.getElementById('prod-dots');
  const prevBtn = document.getElementById('prod-prev');
  const nextBtn = document.getElementById('prod-next');
  const hint = document.getElementById('product-hint');

  if (!canvas || !viewer) return;

  const w = viewer.clientWidth || 500;
  const h = viewer.clientHeight || 400;

  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100);
  camera.position.set(2.8, 1.6, 3.8);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // Controls
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.0;
  controls.maxDistance = 6.5;
  controls.maxPolarAngle = Math.PI / 2 + 0.15;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.8;
  controls.target.set(0.3, 0.35, 0);

  controls.addEventListener('start', () => {
    isUserInteracting = true;
    controls.autoRotate = false;
    if (hint) hint.classList.add('is-hidden');
  });
  controls.addEventListener('end', () => {
    isUserInteracting = false;
    setTimeout(() => { if (!isUserInteracting) controls.autoRotate = true; }, 3500);
  });

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambientLight);

  const mainDirLight = new THREE.DirectionalLight(0xffffff, 1.4);
  mainDirLight.position.set(5, 8, 6);
  scene.add(mainDirLight);

  // Cool Arctic cyan rim light matching GH brand
  const rimLight = new THREE.DirectionalLight(0x00d2ff, 0.75);
  rimLight.position.set(-4, 3, -3);
  scene.add(rimLight);

  // Warm subtle ground bounce
  const fillLight = new THREE.DirectionalLight(0x0f2b5c, 0.5);
  fillLight.position.set(0, -3, 2);
  scene.add(fillLight);

  // Ground reflective grid disc
  const groundGeo = new THREE.CircleGeometry(3.2, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x051326,
    roughness: 0.7,
    metalness: 0.3,
    transparent: true,
    opacity: 0.75
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  scene.add(ground);

  // Ground glowing halo ring
  const ringGeo = new THREE.RingGeometry(2.4, 2.45, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00d2ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.25
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.005;
  scene.add(ring);

  // Airflow particle system
  createAirflowParticles();

  // Create UI overlay controls for 3D viewer (Power, Colors, Camera Presets)
  createViewerToolbar(viewer);

  // Dots
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    PRODUCTS.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'products__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Producto ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  // Navigation
  prevBtn?.addEventListener('click', () => goTo((currentIdx - 1 + PRODUCTS.length) % PRODUCTS.length));
  nextBtn?.addEventListener('click', () => goTo((currentIdx + 1) % PRODUCTS.length));

  // Initial load
  loadProduct(0);
  renderPanel(0);

  // Animation loop
  let clock = new THREE.Clock();
  function animate() {
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Smooth camera transition if active
    if (targetCamPos) {
      camera.position.lerp(targetCamPos, 0.08);
      if (targetLookAt) controls.target.lerp(targetLookAt, 0.08);
      if (camera.position.distanceTo(targetCamPos) < 0.02) {
        targetCamPos = null;
        targetLookAt = null;
      }
    }

    controls.update();

    // Rotate condenser fan
    if (fanBladesMesh && isAcOn) {
      fanBladesMesh.rotation.z += delta * 12;
    }

    // Animate swing louver
    if (swingLouver) {
      const targetRot = isAcOn ? 0.55 + Math.sin(time * 1.5) * 0.15 : 0;
      swingLouver.rotation.x += (targetRot - swingLouver.rotation.x) * 0.1;
    }

    // Animate airflow particles
    updateAirflowParticles(delta);

    // Subtle breathing float
    if (currentModel) {
      currentModel.position.y = Math.sin(time * 1.2) * 0.02;
    }

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  const ro = new ResizeObserver(() => {
    const w = viewer.clientWidth;
    const h = viewer.clientHeight;
    if (w && h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  });
  ro.observe(viewer);

  // Functions accessible inside closure
  function goTo(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    dotsWrap?.querySelectorAll('.products__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
    });
    loadProduct(idx);
    renderPanel(idx);
  }

  function loadProduct(idx) {
    if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        }
      });
    }

    const p = PRODUCTS[idx];
    const created = createACModel(p.modelType, activeFinish);
    currentModel = created.group;
    swingLouver = created.louver;
    ledDisplayMesh = created.ledDisplay;
    fanBladesMesh = created.fanBlades;

    scene.add(currentModel);
    updateLedState();
  }

  function updateLedState() {
    if (!ledDisplayMesh) return;
    if (isAcOn) {
      ledDisplayMesh.material.emissive.setHex(0x00d2ff);
      ledDisplayMesh.material.emissiveIntensity = 0.9;
    } else {
      ledDisplayMesh.material.emissive.setHex(0x0a1c36);
      ledDisplayMesh.material.emissiveIntensity = 0.1;
    }
  }

  // Create UI overlay for 3D viewer
  function createViewerToolbar(parent) {
    let existing = parent.querySelector('.products__toolbar');
    if (existing) existing.remove();

    const bar = document.createElement('div');
    bar.className = 'products__toolbar';
    bar.innerHTML = `
      <div class="products__tool-group">
        <button class="products__tool-btn products__tool-btn--power ${isAcOn ? 'is-active' : ''}" id="tool-power" title="Encender/Apagar Clima">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0M12 2v10"/></svg>
          <span>${isAcOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div class="products__tool-group products__finishes" title="Color de carcasa">
        <button class="products__finish-dot products__finish-dot--white ${activeFinish === 'white' ? 'is-active' : ''}" data-finish="white" title="Blanco Ártico"></button>
        <button class="products__finish-dot products__finish-dot--titanium ${activeFinish === 'titanium' ? 'is-active' : ''}" data-finish="titanium" title="Gris Titanio"></button>
        <button class="products__finish-dot products__finish-dot--black ${activeFinish === 'black' ? 'is-active' : ''}" data-finish="black" title="Negro Ónix"></button>
      </div>

      <div class="products__tool-group products__cams" title="Ángulos de cámara">
        <button class="products__cam-btn is-active" data-cam="front">Frontal</button>
        <button class="products__cam-btn" data-cam="side">Lateral</button>
        <button class="products__cam-btn" data-cam="outdoor">Exterior</button>
        <button class="products__cam-btn" data-cam="free">3D</button>
      </div>
    `;

    parent.appendChild(bar);

    // Listeners
    const pwrBtn = bar.querySelector('#tool-power');
    pwrBtn?.addEventListener('click', () => {
      isAcOn = !isAcOn;
      pwrBtn.classList.toggle('is-active', isAcOn);
      pwrBtn.querySelector('span').textContent = isAcOn ? 'ON' : 'OFF';
      updateLedState();
    });

    bar.querySelectorAll('.products__finish-dot').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.products__finish-dot').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeFinish = btn.dataset.finish;
        loadProduct(currentIdx);
      });
    });

    bar.querySelectorAll('.products__cam-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.products__cam-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const view = btn.dataset.cam;
        if (view === 'front') {
          targetCamPos = new THREE.Vector3(0, 0.8, 3.2);
          targetLookAt = new THREE.Vector3(0, 0.7, 0);
        } else if (view === 'side') {
          targetCamPos = new THREE.Vector3(2.8, 0.8, 1.2);
          targetLookAt = new THREE.Vector3(0, 0.7, 0);
        } else if (view === 'outdoor') {
          targetCamPos = new THREE.Vector3(1.6, 0.3, 2.2);
          targetLookAt = new THREE.Vector3(1.1, 0, 0);
        } else {
          targetCamPos = new THREE.Vector3(2.8, 1.6, 3.8);
          targetLookAt = new THREE.Vector3(0.3, 0.35, 0);
        }
      });
    });
  }

  // Airflow particle system
  function createAirflowParticles() {
    const particleCount = 80;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      resetParticle(i, positions, alphas, speeds, true);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    // Particle material
    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, mat);
    particleSystem.userData = { positions, alphas, speeds, count: particleCount };
    scene.add(particleSystem);
  }

  function resetParticle(i, positions, alphas, speeds, init = false) {
    const i3 = i * 3;
    // Emit from front vent of indoor unit
    positions[i3] = (Math.random() - 0.5) * 1.5; // X
    positions[i3 + 1] = 0.65 + (Math.random() - 0.5) * 0.08; // Y
    positions[i3 + 2] = 0.16 + Math.random() * 0.05; // Z
    alphas[i] = Math.random() * 0.8 + 0.2;
    speeds[i] = Math.random() * 1.2 + 0.8;
  }

  function updateAirflowParticles(delta) {
    if (!particleSystem) return;
    const { positions, alphas, speeds, count } = particleSystem.userData;

    particleSystem.visible = isAcOn;
    if (!isAcOn) return;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Fly forward towards user and downward
      positions[i3 + 2] += speeds[i] * delta * 1.8;
      positions[i3 + 1] -= speeds[i] * delta * 0.35;
      // Slight wave wobble
      positions[i3] += Math.sin(positions[i3 + 2] * 4) * delta * 0.15;

      // Reset when traveled far
      if (positions[i3 + 2] > 2.8) {
        resetParticle(i, positions, alphas, speeds);
      }
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  // Render product details panel
  function renderPanel(idx) {
    if (!panel) return;
    const p = PRODUCTS[idx];
    const addonStates = p.addons.map(a => ({ ...a }));

    function calcTotal() {
      let total = p.price;
      addonStates.forEach(a => { if (a.checked) total += a.price; });
      return total;
    }

    function buildHTML() {
      const specEntries = Object.entries(p.specs);
      const specsHTML = specEntries.map(([k, v]) => `
        <div class="products__spec">
          <span class="products__spec-label">${labelMap[k] || k}</span>
          <span class="products__spec-val">${v}</span>
        </div>
      `).join('');

      const addonsHTML = addonStates.map((a, i) => `
        <label class="products__addon">
          <input type="checkbox" ${a.checked ? 'checked' : ''} data-addon-idx="${i}">
          <span class="products__addon-text">${a.name}</span>
          <span class="products__addon-price">+ $${a.price.toLocaleString('es-MX')}</span>
        </label>
      `).join('');

      const total = calcTotal();
      const extrasList = addonStates.filter(a => a.checked).map(a => a.name).join(', ') || 'Ninguno';
      const waMsg = encodeURIComponent(
        `Hola GH Servicios Técnicos, me interesa cotizar el equipo:\n` +
        `❄️ *${p.name}*\n` +
        `• Precio base: $${p.price.toLocaleString('es-MX')} MXN\n` +
        `• Extras: ${extrasList}\n` +
        `• Total estimado: *$${total.toLocaleString('es-MX')} MXN*\n` +
        `¿Tienen disponibilidad para instalación en Mérida?`
      );

      return `
        <div class="products__panel-inner">
          <div class="products__panel-head">
            <span class="products__badge">${p.badge}</span>
            <span class="products__type-tag">${p.type}</span>
          </div>
          <h3 class="products__name">${p.name}</h3>
          <p class="products__brand">Marca: <strong>${p.brand}</strong> · Distribuidor Certificado en Mérida</p>
          
          <div class="products__price-wrap">
            <div class="products__price">$${p.price.toLocaleString('es-MX')} <small>MXN</small></div>
            <p class="products__price-note">Precio base equipo nuevo en caja · Garantía directa</p>
          </div>

          <div class="products__specs">${specsHTML}</div>

          <div class="products__addons">
            <div class="products__addons-title-wrap">
              <span class="products__addons-title">Opciones de Venta e Instalación</span>
              <small class="products__addons-sub">Precios transparentes</small>
            </div>
            ${addonsHTML}
          </div>

          <div class="products__total">
            <div>
              <span class="products__total-label">Inversión Total Estimada</span>
              <small class="products__total-sub">Equipo + Servicios seleccionados</small>
            </div>
            <span class="products__total-val" id="product-total">$${total.toLocaleString('es-MX')}</span>
          </div>

          <a href="https://wa.me/529371037277?text=${waMsg}" class="btn btn--primary btn--full products__wa-btn" target="_blank" rel="noopener" id="product-wa-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span>Pedir Cotización por WhatsApp</span>
          </a>
        </div>
      `;
    }

    panel.innerHTML = buildHTML();

    // Checkbox listeners
    panel.querySelectorAll('input[data-addon-idx]').forEach(input => {
      input.addEventListener('change', () => {
        const i = parseInt(input.dataset.addonIdx);
        addonStates[i].checked = input.checked;
        const total = calcTotal();
        const totalEl = document.getElementById('product-total');
        if (totalEl) totalEl.textContent = '$' + total.toLocaleString('es-MX');

        const waBtn = document.getElementById('product-wa-btn');
        if (waBtn) {
          const extrasList = addonStates.filter(a => a.checked).map(a => a.name).join(', ') || 'Ninguno';
          const waMsg = encodeURIComponent(
            `Hola GH Servicios Técnicos, me interesa cotizar el equipo:\n` +
            `❄️ *${p.name}*\n` +
            `• Precio base: $${p.price.toLocaleString('es-MX')} MXN\n` +
            `• Extras: ${extrasList}\n` +
            `• Total estimado: *$${total.toLocaleString('es-MX')} MXN*\n` +
            `¿Tienen disponibilidad para instalación en Mérida?`
          );
          waBtn.href = `https://wa.me/529371037277?text=${waMsg}`;
        }
      });
    });
  }
}

// Procedural 3D AC Model with Realistic Finishes and Dynamic Louver
function createACModel(type, finish = 'white') {
  const group = new THREE.Group();

  // Color & Finish materials
  let bodyColor = 0xf5f7fa;
  let roughness = 0.25;
  let metalness = 0.15;

  if (finish === 'titanium') {
    bodyColor = 0x334155;
    roughness = 0.3;
    metalness = 0.7;
  } else if (finish === 'black') {
    bodyColor = 0x0a0f1d;
    roughness = 0.15;
    metalness = 0.5;
  }

  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness, metalness });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 });
  const grilleMat = new THREE.MeshStandardMaterial({ color: finish === 'black' ? 0x111827 : 0xe2e8f0, roughness: 0.4, metalness: 0.2 });

  const scale = type === 'minisplit-sm' ? 0.9 : type === 'minisplit-md' ? 1.05 : 1.2;

  // --- INDOOR UNIT ---
  const indoor = new THREE.Group();

  // Main casing
  const casingGeo = new THREE.BoxGeometry(2.1 * scale, 0.42, 0.28);
  const casing = new THREE.Mesh(casingGeo, bodyMat);
  indoor.add(casing);

  // Curved front cover
  const frontGeo = new THREE.BoxGeometry(2.05 * scale, 0.38, 0.03);
  const front = new THREE.Mesh(frontGeo, bodyMat);
  front.position.z = 0.15;
  indoor.add(front);

  // Chrome accent strip
  const stripGeo = new THREE.BoxGeometry(2.05 * scale, 0.012, 0.035);
  const stripMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.1 });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(0, 0.05, 0.152);
  indoor.add(strip);

  // Animated Swing Louver (Air Flap)
  const louverGeo = new THREE.BoxGeometry(1.85 * scale, 0.015, 0.09);
  const louverMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.2 });
  const louver = new THREE.Mesh(louverGeo, louverMat);
  louver.position.set(0, -0.16, 0.12);
  indoor.add(louver);

  // Intake grille (top)
  for (let i = 0; i < 6; i++) {
    const ventSlot = new THREE.Mesh(
      new THREE.BoxGeometry(1.9 * scale, 0.008, 0.015),
      darkMat
    );
    ventSlot.position.set(0, 0.21, -0.06 + i * 0.025);
    indoor.add(ventSlot);
  }

  // Glowing LED Temperature Display
  const ledCanvas = document.createElement('canvas');
  ledCanvas.width = 128;
  ledCanvas.height = 64;
  const ctx = ledCanvas.getContext('2d');
  ctx.fillStyle = '#051020';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#00d2ff';
  ctx.font = 'bold 36px monospace';
  ctx.fillText('16°', 20, 44);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(92, 22, 6, 22);
  ctx.fillRect(102, 16, 6, 28);
  ctx.fillRect(112, 10, 6, 34);

  const ledTex = new THREE.CanvasTexture(ledCanvas);
  const ledDisplayMat = new THREE.MeshStandardMaterial({
    map: ledTex,
    color: 0x00d2ff,
    emissive: 0x00d2ff,
    emissiveIntensity: 0.85,
    roughness: 0.2
  });

  const ledDisplay = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.09), ledDisplayMat);
  ledDisplay.position.set(0.65 * scale, 0.08, 0.166);
  indoor.add(ledDisplay);

  indoor.position.set(0, 0.85, 0);
  group.add(indoor);

  // --- OUTDOOR CONDENSER UNIT ---
  const outdoor = new THREE.Group();
  const outScale = scale * 0.95;

  // Condenser cabinet
  const outBodyGeo = new THREE.BoxGeometry(0.9 * outScale, 0.78, 0.42);
  const outBodyMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4, metalness: 0.2 });
  const outBody = new THREE.Mesh(outBodyGeo, outBodyMat);
  outdoor.add(outBody);

  // Fan protective circular guard
  const guardGeo = new THREE.TorusGeometry(0.24, 0.015, 12, 48);
  const guard = new THREE.Mesh(guardGeo, darkMat);
  guard.position.z = 0.215;
  outdoor.add(guard);

  // Fan blades group
  const fanBlades = new THREE.Group();
  fanBlades.position.z = 0.2;
  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.06, 0.008),
      darkMat
    );
    blade.rotation.z = (i * Math.PI * 2) / 3;
    fanBlades.add(blade);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), darkMat);
  hub.rotation.x = Math.PI / 2;
  fanBlades.add(hub);
  outdoor.add(fanBlades);

  // Brand emblem plate on condenser
  const plateGeo = new THREE.BoxGeometry(0.24, 0.08, 0.01);
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x0b2545, metalness: 0.5, roughness: 0.3 });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.set(0.22 * outScale, 0.28, 0.215);
  outdoor.add(plate);

  outdoor.position.set(1.25 * scale, 0, 0);
  group.add(outdoor);

  // Copper connecting pipe
  const pipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2 * scale, 0.7, 0.12),
    new THREE.Vector3(0.55 * scale, 0.52, 0.1),
    new THREE.Vector3(0.9 * scale, 0.35, 0.08),
    new THREE.Vector3(1.2 * scale, 0.22, 0.06),
  ]);
  const pipeGeo = new THREE.TubeGeometry(pipeCurve, 24, 0.016, 8, false);
  const pipeMat = new THREE.MeshStandardMaterial({ color: 0xc27838, roughness: 0.35, metalness: 0.85 });
  const pipe = new THREE.Mesh(pipeGeo, pipeMat);
  group.add(pipe);

  return { group, louver, ledDisplay, fanBlades };
}
