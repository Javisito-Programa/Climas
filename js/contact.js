/* ===== Contact Form → WhatsApp ===== */
export function initContact() {
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
