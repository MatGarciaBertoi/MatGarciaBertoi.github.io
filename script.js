/* ========================
   CANVAS PARTICLES
======================== */
(function () {
  const canvas = document.getElementById('canvas-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 70;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.4 + 0.1;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 212, 255, ${this.alpha})`;
    ctx.fill();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
    window.addEventListener('resize', resize);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }

  init();
  loop();
})();

/* ========================
   NAVBAR SCROLL
======================== */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ========================
   MOBILE MENU
======================== */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* ========================
   TYPING ANIMATION
======================== */
(function () {
  const words = [
    'Desenvolvedor Full-Stack',
    'Consultor SAP B1',
  ];
  const el = document.getElementById('typed-text');
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const w = words[wi];
    el.textContent = deleting ? w.substring(0, ci--) : w.substring(0, ci++);
    let delay = deleting ? 50 : 90;
    if (!deleting && ci > w.length) { delay = 1800; deleting = true; }
    else if (deleting && ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; delay = 300; }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
})();

/* ========================
   COUNTER ANIMATION
======================== */
function animateCounter(el, target) {
  const dur = 2000;
  const step = dur / target;
  let count = 0;
  const timer = setInterval(() => {
    count++;
    el.textContent = count + (el.dataset.suffix || '');
    if (count >= target) clearInterval(timer);
  }, step > 16 ? step : 16);
}

/* ========================
   REVEAL ON SCROLL
======================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');

    // counter
    if (e.target.classList.contains('stat-number')) {
      const target = parseInt(e.target.dataset.target);
      if (!isNaN(target)) animateCounter(e.target, target);
    }

    // progress bars
    e.target.querySelectorAll('.timeline-bar[data-width]').forEach(bar => {
      setTimeout(() => bar.style.width = bar.dataset.width, 200);
    });

    observer.unobserve(e.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .stat-number').forEach(el => observer.observe(el));

/* ========================
   PROJECT FILTER
======================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.category === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

/* ========================
   CONTACT FORM
======================== */
document.getElementById('contact-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn   = this.querySelector('.form-submit');
  const form  = this;
  const data  = new FormData(form);

  // Loading
  btn.disabled    = true;
  btn.textContent = 'Enviando...';
  btn.style.opacity = '0.7';

  try {
    const res = await fetch(form.action, {
      method:  'POST',
      body:    data,
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      // Sucesso
      btn.textContent    = '✓ Mensagem enviada!';
      btn.style.opacity  = '1';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      form.reset();
      setTimeout(() => {
        btn.textContent      = 'Enviar Mensagem';
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    } else {
      throw new Error('Erro no envio');
    }
  } catch {
    btn.textContent      = '✗ Erro ao enviar. Tente novamente.';
    btn.style.opacity    = '1';
    btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    setTimeout(() => {
      btn.textContent      = 'Enviar Mensagem';
      btn.style.background = '';
      btn.disabled         = false;
    }, 4000);
  }
});

/* ========================
   SMOOTH ACTIVE NAV
======================== */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--primary)' : '';
  });
});
