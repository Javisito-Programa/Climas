/**
 * CATÁLOGO Y TIENDA PROFESIONAL MULTIPRODUCTO
 * GH Servicios Técnicos — Cárdenas, Tabasco
 * Minisplits, Lavadoras, Refrigeración y Protectores
 */

(function () {
  'use strict';

  const PRODUCTS = [
    // === CATEGORÍA 1: MINISPLITS & CLIMAS ===
    {
      id: 'mirage-x',
      brand: '',
      brandLogo: 'Logos/mirage.png',
      title: 'Mirage Inverter X Magna R32',
      sub: 'Máxima eficiencia térmica con recubrimiento Gold Fin para el calor y humedad de Cárdenas y la Chontalpa.',
      category: 'climas',
      seer: 'SEER 22 · 65% Ahorro CFE',
      image: 'assets/products/mirage-inverter.jpg',
      capType: 'Capacidad de Enfriamiento:',
      capacities: {
        '1.0': { label: '1.0 Ton (12k)', price: 7890, detail: 'Ideal para recámaras de hasta 16m²' },
        '1.5': { label: '1.5 Ton (18k)', price: 10490, detail: 'Para recámaras principales y oficinas' },
        '2.0': { label: '2.0 Ton (24k)', price: 13990, detail: 'Para salas y áreas amplias de hasta 32m²' }
      },
      specs: {
        'Alimentación': '220V / 1F (Bifásico recomendado en Tabasco)',
        'Refrigerante': 'Ecológico R32 de alta presión y menor consumo',
        'Protección Tropical': 'Gold Fin Anticorrosión contra humedad y lluvia',
        'Conectividad': 'WiFi Integrado con app para iOS/Android',
        'Garantía Oficial': '5 años compresor / 1 año piezas originales'
      }
    },
    {
      id: 'carrier-infinity',
      brand: '',
      brandLogo: 'Logos/carrier.png',
      title: 'Carrier Infinity Inverter WiFi',
      sub: 'Ingeniería americana de flujo silencioso ultra potente para casas, comercios y consultorios en Tabasco.',
      category: 'climas',
      seer: 'SEER 21 · Ultra Silencio 19dB',
      image: 'assets/products/carrier-infinity.jpg',
      capType: 'Capacidad de Enfriamiento:',
      capacities: {
        '1.0': { label: '1.0 Ton (12k)', price: 9290, detail: '12,000 BTU / Máximo confort' },
        '1.5': { label: '1.5 Ton (18k)', price: 12490, detail: '18,000 BTU / Enfriamiento veloz' },
        '2.0': { label: '2.0 Ton (24k)', price: 15890, detail: '24,000 BTU / Heavy Duty para calor extremo' }
      },
      specs: {
        'Alimentación': '220V Bifásico',
        'Refrigerante': 'R410A Puron ecológico de alta densidad',
        'Protección Tropical': 'Condensadora Heavy Duty con recubrimiento para clima húmedo',
        'Conectividad': 'Control inalámbrico y compatibilidad con Alexa / Google Home',
        'Garantía Oficial': '10 años en compresor Carrier oficial'
      }
    },
    {
      id: 'lg-artcool',
      brand: '',
      brandLogo: 'Logos/lg.png',
      title: 'LG Dual Inverter Artcool Mirror',
      sub: 'Elegante diseño en cristal espejo negro con compresor Dual Inverter de enfriamiento 40% más rápido.',
      category: 'climas',
      seer: 'SEER 23 · Dual Inverter Premium',
      image: 'assets/products/lg-artcool.jpg',
      capType: 'Capacidad de Enfriamiento:',
      capacities: {
        '1.0': { label: '1.0 Ton (12k)', price: 11990, detail: 'Gama Alta Cristal Espejo' },
        '1.5': { label: '1.5 Ton (18k)', price: 14890, detail: 'Confort de Lujo para Recámara Principal' },
        '2.0': { label: '2.0 Ton (24k)', price: 18990, detail: 'Máxima Potencia de Enfriamiento' }
      },
      specs: {
        'Alimentación': '220V / 60Hz',
        'Refrigerante': 'R410A ecológico certificado',
        'Protección Tropical': 'Black Fin resistente a salitre y vapores cálidos',
        'Conectividad': 'LG ThinQ con autodiagnóstico inteligente por celular',
        'Garantía Oficial': '10 años de garantía escrita en compresor LG'
      }
    },
    {
      id: 'mabe-eco',
      brand: '',
      brandLogo: 'Logos/mabe.png',
      title: 'Mabe Inverter Eco Pro R32',
      sub: 'Tubería 100% de cobre puro y filtros bio-silver para aire puro libre de polvo y hongos en la Chontalpa.',
      category: 'climas',
      seer: 'SEER 18 · Tubería Cobre Puro',
      image: 'assets/products/mabe-inverter.jpg',
      capType: 'Capacidad de Enfriamiento:',
      capacities: {
        '1.0': { label: '1.0 Ton (12k)', price: 7190, detail: 'Excelente para habitaciones estándar' },
        '1.5': { label: '1.5 Ton (18k)', price: 9690, detail: 'Rendimiento probado en calor continuo' },
        '2.0': { label: '2.0 Ton (24k)', price: 12890, detail: 'Para áreas comerciales y salas' }
      },
      specs: {
        'Alimentación': '220V / 110V disponible',
        'Refrigerante': 'R32 Ultra Eficiente',
        'Protección Tropical': 'Blue Fin en serpentín evaporador y condensador',
        'Conectividad': 'WiFi Ready para control a distancia',
        'Garantía Oficial': '5 años compresor / 1 año en partes'
      }
    },
    {
      id: 'prime-smart',
      brand: '',
      brandLogo: 'Logos/prime.png',
      title: 'Prime Inverter Confort R32',
      sub: 'La alternativa más económica y confiable para climatizar con bajo consumo eléctrico de CFE.',
      category: 'climas',
      seer: 'SEER 17 · Económico & Confiable',
      image: 'assets/products/mirage-inverter.jpg',
      capType: 'Capacidad de Enfriamiento:',
      capacities: {
        '1.0': { label: '1.0 Ton (12k)', price: 6490, detail: 'Precio accesible con tecnología Inverter' },
        '1.5': { label: '1.5 Ton (18k)', price: 8890, detail: 'Ahorro sustancial frente a convencionales' },
        '2.0': { label: '2.0 Ton (24k)', price: 11690, detail: 'Gran capacidad para presupuesto moderado' }
      },
      specs: {
        'Alimentación': '220V / 60Hz',
        'Refrigerante': 'R32 Ecológico',
        'Protección Tropical': 'Recubrimiento anticorrosivo básico',
        'Conectividad': 'Preparado para control inteligente',
        'Garantía Oficial': '5 años en compresor / 1 año general'
      }
    },

    // === CATEGORÍA 2: LAVADORAS & CENTROS DE LAVADO ===
    {
      id: 'mabe-lavadora',
      brand: '',
      brandLogo: 'Logos/mabe.png',
      title: 'Lavadora Mabe Aqua Saver Green 22 kg',
      sub: 'Ahorra hasta 76% de agua por lavada. Tina de acero inoxidable, agitador de triple acción para edredones y ropa de trabajo pesada.',
      category: 'lavadoras',
      seer: 'Ahorro 76% Agua · 22 Kg',
      image: 'assets/products/mabe-lavadora.svg',
      capType: 'Capacidad de Carga:',
      capacities: {
        '19kg': { label: '19 Kilogramos', price: 9890, detail: 'Para familias de 3 a 4 personas' },
        '22kg': { label: '22 Kilogramos', price: 11990, detail: 'Capacidad para edredón King Size y cobijas' },
        '24kg': { label: '24 Kilogramos', price: 13490, detail: 'Máxima capacidad familiar y trabajo rudo' }
      },
      specs: {
        'Alimentación': '110V - 127V / 60Hz estándar residencial',
        'Tecnología': 'Aqua Saver Green con sensor infusor inteligente',
        'Tina': 'Acero inoxidable de alta durabilidad Spherical Drum',
        'Programas': '11 ciclos automáticos + lavado exprés de 20 min',
        'Garantía Oficial': '10 años en motor Mabe / 1 año componentes'
      }
    },
    {
      id: 'lg-lavadora',
      brand: '',
      brandLogo: 'Logos/lg.png',
      title: 'Lavadora LG TurboWash AI DD Inverter 22 kg',
      sub: 'Inteligencia artificial que detecta el peso y suavidad de las telas. Motor Inverter Direct Drive sin bandas, ultra silencioso y sin vibraciones.',
      category: 'lavadoras',
      seer: 'AI DD Inverter · TurboWash',
      image: 'assets/products/lg-lavadora.svg',
      capType: 'Capacidad de Carga:',
      capacities: {
        '20kg': { label: '20 Kilogramos', price: 13990, detail: 'Motor Direct Drive sin bandas' },
        '22kg': { label: '22 Kilogramos', price: 16490, detail: 'Acabado grafito metálico con WiFi ThinQ' }
      },
      specs: {
        'Alimentación': '120V / 60Hz',
        'Motor': 'Inverter Direct Drive (Conexión directa al tambor)',
        'Lavado Exprés': 'TurboWash lavado completo en 29 minutos',
        'Conectividad': 'WiFi ThinQ para inicio remoto y diagnóstico',
        'Garantía Oficial': '10 años de garantía en motor Direct Drive'
      }
    },

    // === CATEGORÍA 3: REFRIGERACIÓN & CONGELADORES ===
    {
      id: 'mabe-refrigerador',
      brand: '',
      brandLogo: 'Logos/mabe.png',
      title: 'Refrigerador Mabe No Frost 14 Pies con Despachador',
      sub: 'Tecnología Home Energy Saver con enfriamiento envolvente No Frost sin escarcha. Despachador exterior de agua fría de 3 litros.',
      category: 'refrigeracion',
      seer: 'No Frost · Ahorro de Energía',
      image: 'assets/products/mabe-refrigerador.svg',
      capType: 'Tamaño y Capacidad:',
      capacities: {
        '14pie': { label: '14 Pies (360L)', price: 9490, detail: 'Despachador de agua + parrillas de cristal templado' },
        '19pie': { label: '19 Pies (480L)', price: 13290, detail: 'Espacio ampliado con anaqueles de galón' }
      },
      specs: {
        'Alimentación': '115V / 60Hz',
        'Sistema de Frío': 'Total No Frost (Cero formación de escarcha)',
        'Despachador': 'Despachador de agua fría de 3L con filtro',
        'Interiores': 'Parrillas de cristal templado ajustables y luz LED',
        'Garantía Oficial': '3 años en compresor / 1 año general Mabe'
      }
    },
    {
      id: 'mirage-congelador',
      brand: '',
      brandLogo: 'Logos/mirage.png',
      title: 'Congelador Horizontal Mirage Dual Freeze 7 Pies',
      sub: 'Función dual regulable (enfriador o congelador a -18°C). Esencial para comercios, tiendas, paleterías, carnicerías y hogares en Tabasco.',
      category: 'refrigeracion',
      seer: 'Dual Freeze · Hasta -18°C',
      image: 'assets/products/mirage-congelador.svg',
      capType: 'Capacidad de Almacenamiento:',
      capacities: {
        '5pie': { label: '5 Pies (142L)', price: 5890, detail: 'Compacto para negocios pequeños y hogares' },
        '7pie': { label: '7 Pies (198L)', price: 7490, detail: 'El más vendido en Cárdenas / Con canastilla' },
        '11pie': { label: '11 Pies (300L)', price: 10990, detail: 'Uso comercial rudo para carnicerías y mariscos' }
      },
      specs: {
        'Alimentación': '115V / 60Hz',
        'Rango de Frío': 'Modo Enfriador (+1°C a +10°C) o Congelador (-18°C)',
        'Seguridad': 'Cerradura frontal con llave y jaladera ergonómica',
        'Interior': 'Aluminio gofrado con drenaje de deshielo rápido',
        'Garantía Oficial': '2 años en compresor Mirage oficial'
      }
    },

    // === CATEGORÍA 4: PROTECTORES & REFACCIONES ===
    {
      id: 'protector-voltaje',
      brand: '',
      brandLogo: 'Logos/hisense.png',
      title: 'Protector de Voltaje Digital CFE Uso Rudo',
      sub: 'Protege tus minisplits, refrigeradores y lavadoras de las constantes variaciones, picos y apagones de CFE en Cárdenas y la Chontalpa.',
      category: 'refacciones',
      seer: 'Grado Técnico · Pantalla LED',
      image: 'assets/products/protector-voltaje.svg',
      capType: 'Voltaje y Uso:',
      capacities: {
        '110V': { label: '110V Monofásico (15A)', price: 650, detail: 'Para Lavadoras, Refrigeradores y Secadoras' },
        '220V': { label: '220V Bifásico (30A)', price: 850, detail: 'Para Minisplits Inverter de 1 a 3 Toneladas' }
      },
      specs: {
        'Desconexión': 'Automática por sobrevoltaje (>265V) o bajo voltaje (<175V)',
        'Reconexión Segura': 'Temporizador inteligente de 3 minutos tras apagón',
        'Voltímetro': 'Pantalla digital LED que muestra voltaje real de CFE',
        'Instalación': 'Montaje directo en pared junto al interruptor',
        'Garantía Oficial': '1 año con reemplazo inmediato'
      }
    }
  ];

  const ADDON_PRICES = {
    install: 1200,   // Instalación certificada en Cárdenas y municipios
    warranty: 650,   // Garantía extendida GH 2 años
    protector: 450   // Protector o kit de mantenimiento
  };

  function initCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;

    grid.innerHTML = PRODUCTS.map((prod) => createProductCardHtml(prod)).join('');
    setupCardInteractions();
    setupFilters();
    setupSearch();
    setupModal();
  }

  function createProductCardHtml(prod) {
    const defaultCapKey = Object.keys(prod.capacities)[0];
    const capData = prod.capacities[defaultCapKey];
    const isClima = prod.category === 'climas';
    const initialTotal = capData.price + (isClima ? ADDON_PRICES.install : 0);

    const capacityButtonsHtml = Object.keys(prod.capacities)
      .map((key, index) => {
        const item = prod.capacities[key];
        const activeClass = index === 0 ? 'is-active' : '';
        return `<button type="button" class="capacity-btn ${activeClass}" data-cap="${key}">${item.label}</button>`;
      })
      .join('');

    return `
      <article class="product-card" data-id="${prod.id}" data-category="${prod.category}" data-brand="${prod.brand.toLowerCase()}">
        <div class="product-card__badges">
          <div class="product-card__brand-badge" title="Marca Oficial ${prod.brand}">
            <img src="${prod.brandLogo}" alt="${prod.brand}" class="product-card__brand-logo" onerror="this.style.display='none'">
            <span>${prod.brand}</span>
          </div>
          <span class="product-card__seer-pill">${prod.seer}</span>
        </div>
        
        <div class="product-card__media">
          <img src="${prod.image}" alt="${prod.title}" class="product-card__img" loading="lazy">
          <div class="product-card__vapor-glow"></div>
        </div>

        <div class="product-card__body">
          <h3 class="product-card__title">${prod.title}</h3>
          <p class="product-card__sub">${prod.sub}</p>

          <div class="product-card__capacity-label">${prod.capType}</div>
          <div class="product-card__capacity-pills">
            ${capacityButtonsHtml}
          </div>

          <div class="product-card__price-box">
            <div>
              <div class="product-card__price-label">Precio del equipo:</div>
              <small style="color: #64748B; font-size: 0.7rem;">Garantía directa de fábrica · IVA incluido</small>
            </div>
            <div class="product-card__price-val" data-base-price="${capData.price}">$${capData.price.toLocaleString('es-MX')}</div>
          </div>

          <div class="product-card__addons">
            <label class="addon-checkbox">
              <input type="checkbox" class="addon-input" data-addon="install" ${isClima ? 'checked' : ''}>
              <span>Instalación Certificada en Cárdenas</span>
              <strong>+$${ADDON_PRICES.install.toLocaleString()}</strong>
            </label>
            <label class="addon-checkbox">
              <input type="checkbox" class="addon-input" data-addon="warranty">
              <span>Garantía Extendida GH 2 Años</span>
              <strong>+$${ADDON_PRICES.warranty.toLocaleString()}</strong>
            </label>
            <label class="addon-checkbox">
              <input type="checkbox" class="addon-input" data-addon="protector">
              <span>Protector CFE contra picos</span>
              <strong>+$${ADDON_PRICES.protector.toLocaleString()}</strong>
            </label>
          </div>

          <div class="product-card__total-row">
            <span class="product-card__total-tag">Inversión Estimada:</span>
            <span class="product-card__total-amt">$${initialTotal.toLocaleString('es-MX')}</span>
          </div>

          <div class="product-card__actions">
            <a href="#" class="btn-buy-wa" target="_blank" rel="noopener">
              <span>💬 Cotizar por WhatsApp</span>
            </a>
            <button type="button" class="btn-quick-spec" data-id="${prod.id}" title="Ver Ficha Técnica">
              📋 Ficha
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function setupCardInteractions() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const prodId = card.dataset.id;
      const product = PRODUCTS.find((p) => p.id === prodId);
      if (!product) return;

      let currentCap = Object.keys(product.capacities)[0];

      function updateTotal() {
        const basePrice = product.capacities[currentCap].price;
        card.querySelector('.product-card__price-val').textContent = `$${basePrice.toLocaleString('es-MX')}`;

        let extrasTotal = 0;
        const selectedAddons = [];

        card.querySelectorAll('.addon-input').forEach((input) => {
          if (input.checked) {
            const addonKey = input.dataset.addon;
            extrasTotal += ADDON_PRICES[addonKey] || 0;
            if (addonKey === 'install') selectedAddons.push('Instalación en Cárdenas');
            if (addonKey === 'warranty') selectedAddons.push('Garantía Extendida 2 Años');
            if (addonKey === 'protector') selectedAddons.push('Protector de Voltaje CFE');
          }
        });

        const finalTotal = basePrice + extrasTotal;
        card.querySelector('.product-card__total-amt').textContent = `$${finalTotal.toLocaleString('es-MX')}`;

        // Mensaje de WhatsApp personalizado
        const capLabel = product.capacities[currentCap].label;
        const addonsText = selectedAddons.length > 0 ? ` con ${selectedAddons.join(' + ')}` : ' (Solo equipo)';
        const waMsg = encodeURIComponent(
          `¡Hola GH Servicios Técnicos! 👋 Me interesa cotizar: ${product.title} en modelo ${capLabel}${addonsText}. Total estimado: $${finalTotal.toLocaleString('es-MX')} MXN. ¿Tienen disponibilidad y fecha de entrega/instalación en Cárdenas, Tabasco o municipios conurbados?`
        );

        const waBtn = card.querySelector('.btn-buy-wa');
        if (waBtn) {
          waBtn.href = `https://wa.me/529371037277?text=${waMsg}`;
        }
      }

      // Cambio de capacidad
      card.querySelectorAll('.capacity-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          card.querySelectorAll('.capacity-btn').forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          currentCap = btn.dataset.cap;
          updateTotal();
        });
      });

      // Checkboxes de extras
      card.querySelectorAll('.addon-input').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          updateTotal();
        });
      });

      updateTotal();
    });
  }

  function setupFilters() {
    const tabs = document.querySelectorAll('.catalog-tab');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const category = tab.dataset.filter;
        const cards = document.querySelectorAll('.product-card');

        cards.forEach((card) => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function setupSearch() {
    const input = document.getElementById('catalogSearch');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.product-card');

      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(term)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  function setupModal() {
    let backdrop = document.getElementById('specModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'specModalBackdrop';
      backdrop.className = 'spec-modal-backdrop';
      backdrop.innerHTML = `
        <div class="spec-modal" role="dialog">
          <button class="spec-modal__close" aria-label="Cerrar modal">&times;</button>
          <div id="specModalContent"></div>
        </div>
      `;
      document.body.appendChild(backdrop);

      backdrop.querySelector('.spec-modal__close').addEventListener('click', () => {
        backdrop.classList.remove('is-open');
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.classList.remove('is-open');
      });
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-quick-spec');
      if (!btn) return;

      const prodId = btn.dataset.id;
      const prod = PRODUCTS.find((p) => p.id === prodId);
      if (!prod) return;

      const specsRowsHtml = Object.keys(prod.specs)
        .map((specKey) => `<tr><th>${specKey}</th><td>${prod.specs[specKey]}</td></tr>`)
        .join('');

      const modalContent = document.getElementById('specModalContent');
      modalContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
          <img src="${prod.image}" alt="${prod.title}" style="width: 110px; height: 85px; object-fit: contain; border-radius: 12px; background: #F1F5F9; padding: 0.4rem;">
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: #FFFFFF; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid rgba(0,98,204,0.2); margin-bottom: 0.3rem;">
              <img src="${prod.brandLogo}" alt="${prod.brand}" style="height: 14px; max-width: 50px; object-fit: contain;" onerror="this.style.display='none'">
              <span style="font-size: 0.72rem; font-weight: 800; color: #0062CC; text-transform: uppercase;">${prod.brand} Oficial</span>
            </div>
            <h2 style="font-size: 1.25rem; font-weight: 800; color: #091124; margin: 0.2rem 0;">${prod.title}</h2>
            <span style="font-size: 0.82rem; font-weight: 700; color: #059669;">${prod.seer}</span>
          </div>
        </div>

        <p style="font-size: 0.88rem; color: #475569; line-height: 1.55; margin-bottom: 1.25rem;">
          ${prod.sub}
        </p>

        <h3 style="font-size: 0.95rem; font-weight: 800; color: #091124; margin-bottom: 0.6rem;">Especificaciones Técnicas para Cárdenas y Tabasco</h3>
        <table class="spec-modal__table">
          <tbody>
            ${specsRowsHtml}
            <tr><th>Entrega y Cobertura</th><td>Disponible en Heroica Cárdenas, Comalcalco, Huimanguillo, Cunduacán, Paraíso y Villahermosa</td></tr>
          </tbody>
        </table>

        <div style="margin-top: 1.5rem; text-align: right;">
          <a href="https://wa.me/529371037277?text=${encodeURIComponent('Hola GH Servicios Técnicos, me interesa solicitar disponibilidad y ficha técnica de ' + prod.title + ' en Cárdenas, Tabasco.')}" 
             target="_blank" class="btn-buy-wa" style="width: 100%;">
            💬 Preguntar Disponibilidad por WhatsApp (937-103-7277)
          </a>
        </div>
      `;

      backdrop.classList.add('is-open');
    });
  }

  document.addEventListener('DOMContentLoaded', initCatalog);

  window.GHStore = {
    products: PRODUCTS,
    init: initCatalog
  };
})();
