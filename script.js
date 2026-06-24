/* ============================================
   LOCKET PHOTO SHOWCASE — SCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const locketWrapper = document.querySelector('.locket-wrapper');
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  // ---- Locket open/close toggle ----
  function toggleLocket() {
    locketWrapper.classList.toggle('is-open');
  }

  locketWrapper.addEventListener('click', toggleLocket);
  locketWrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleLocket();
    }
  });

  // ---- Ambient gold dust particle system ----
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.speedY = -(Math.random() * 0.25 + 0.05);
      this.opacity = Math.random() * 0.3 + 0.05;
      this.maxOpacity = this.opacity;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.015 + 0.005;

      // Silver/White variations
      const hues = [
        [255, 255, 255],
        [240, 240, 245],
        [220, 220, 225],
        [200, 200, 205],
      ];
      const hue = hues[Math.floor(Math.random() * hues.length)];
      this.r = hue[0];
      this.g = hue[1];
      this.b = hue[2];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      this.opacity = this.maxOpacity * (0.5 + 0.5 * Math.sin(this.pulse));

      if (this.y < -10) {
        this.y = canvas.height + 10;
        this.x = Math.random() * canvas.width;
      }
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
      ctx.fill();

      // Soft glow
      if (this.size > 1.2) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.12})`;
        ctx.fill();
      }
    }
  }

  // Initialize
  const count = Math.min(45, Math.floor((canvas.width * canvas.height) / 25000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    animationId = requestAnimationFrame(animate);
  }

  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
});
