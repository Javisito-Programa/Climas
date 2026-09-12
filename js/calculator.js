/* ===== Mérida AC BTU & Tonnage Calculator Engine ===== */
import { playTick } from './audio.js';

export function initCalculator() {
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
