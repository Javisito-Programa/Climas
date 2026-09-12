/**
 * SISTEMA DE NIEVE Y ESCARCHA POLAR CONTINUA (ALWAYS ACTIVE)
 * GH Servicios Técnicos — Mérida, Yucatán
 */

(function () {
  'use strict';

  let canvas = document.getElementById('snowCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'snowCanvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 55 : 100;
  const particles = [];

  let mouse = { x: -1000, y: -1000, radius: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Snowflake {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -25;
      this.layer = Math.random(); // 0 a 1
      
      // Tamaño y velocidad calibrados para alta visibilidad
      this.size = 1.8 + this.layer * 4.2;
      this.speedY = 0.65 + this.layer * 1.8;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.018 + Math.random() * 0.03;
      this.swayRadius = 1.0 + this.layer * 2.0;
      this.opacity = 0.55 + this.layer * 0.45; // Alto contraste sobre fondo gris
      this.isCrystal = Math.random() > 0.6;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.025;
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.rotation += this.rotSpeed;

      this.x += this.speedX + Math.sin(this.swayAngle) * this.swayRadius;
      this.y += this.speedY;

      // Desvío suave con cursor
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius && dist > 0) {
        const force = (1 - dist / mouse.radius) * 3.5;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force * 0.5;
      }

      if (this.y > height + 25) {
        this.reset(false);
      }
      if (this.x < -25) this.x = width + 20;
      if (this.x > width + 25) this.x = -20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.isCrystal && this.size > 2.8) {
        // Cristal geométrico hexagonal de hielo con brillo
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(0, 184, 255, 0.6)';
        ctx.shadowBlur = 6;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          ctx.rotate(Math.PI / 3);
          ctx.moveTo(0, 0);
          ctx.lineTo(0, this.size * 2);
          // Ramas laterales
          ctx.moveTo(0, this.size * 1.0);
          ctx.lineTo(this.size * 0.55, this.size * 1.35);
          ctx.moveTo(0, this.size * 1.0);
          ctx.lineTo(-this.size * 0.55, this.size * 1.35);
        }
        ctx.stroke();

        // Núcleo brillante
        ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.45, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Copo nítido blanco con resplandor sutil
        ctx.shadowColor = 'rgba(0, 184, 255, 0.5)';
        ctx.shadowBlur = 4;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.65, `rgba(240, 250, 255, ${this.opacity * 0.85})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Snowflake());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
})();
