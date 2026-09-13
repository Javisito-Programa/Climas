/* ===== GH Servicios Técnicos — Contact Form → WhatsApp ===== */
export function initContact() {
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
      // If within a form, let submit handle it, but fallback if not prevented
      if (form.checkValidity && !form.checkValidity()) {
        return; // Native HTML validation tooltip
      }
      handleSubmit(e);
    });
  }
}
