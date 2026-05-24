// Hero — node network
(function () {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let nodes = [], edges = [];

  const POS = [
    [0.14, 0.20], [0.62, 0.09], [0.87, 0.22],
    [0.05, 0.58], [0.50, 0.43], [0.76, 0.48], [0.92, 0.70],
    [0.20, 0.82], [0.58, 0.86],
  ];
  const TYPES = ['code','database','shield','wifi','cloud','lock','monitor','cloud2','server'];

  function drawIcon(type, x, y, r) {
    const s = r;
    ctx.save();
    ctx.translate(x, y);
    ctx.lineCap   = 'round';
    ctx.lineJoin  = 'round';
    ctx.lineWidth = 1.1;

    switch (type) {
      case 'cloud': {
        ctx.beginPath();
        ctx.arc(-s*0.22, s*0.10, s*0.27, Math.PI/2, Math.PI*1.5);
        ctx.arc( 0,     -s*0.08, s*0.31, Math.PI,   0);
        ctx.arc( s*0.27, s*0.10, s*0.22, Math.PI*1.5, Math.PI/2);
        ctx.lineTo(-s*0.22, s*0.37);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'server': {
        ctx.strokeRect(-s*0.38, -s*0.40, s*0.76, s*0.32);
        ctx.strokeRect(-s*0.38, -s*0.02, s*0.76, s*0.32);
        ctx.beginPath(); ctx.arc(s*0.20, -s*0.24, s*0.055, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(s*0.20,  s*0.14, s*0.055, 0, Math.PI*2); ctx.fill();
        break;
      }
      case 'database': {
        const rx = s*0.36, ry = s*0.10;
        ctx.beginPath(); ctx.ellipse(0, -s*0.26, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-rx, -s*0.26); ctx.lineTo(-rx, s*0.26); ctx.stroke();
        ctx.beginPath(); ctx.moveTo( rx, -s*0.26); ctx.lineTo( rx, s*0.26); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0,  s*0.26, rx, ry, 0, 0, Math.PI*2); ctx.stroke();
        break;
      }
      case 'shield': {
        ctx.beginPath();
        ctx.moveTo(-s*0.38, -s*0.44);
        ctx.lineTo( s*0.38, -s*0.44);
        ctx.lineTo( s*0.38,  s*0.06);
        ctx.quadraticCurveTo( s*0.38, s*0.34, 0, s*0.52);
        ctx.quadraticCurveTo(-s*0.38, s*0.34, -s*0.38, s*0.06);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case 'wifi': {
        const dy = s*0.28;
        ctx.beginPath(); ctx.arc(0, dy, s*0.07, 0, Math.PI*2); ctx.fill();
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(0, dy, s*0.18*i, 5*Math.PI/4, 7*Math.PI/4);
          ctx.stroke();
        }
        break;
      }
      case 'code': {
        ctx.beginPath();
        ctx.moveTo(-s*0.12, -s*0.28); ctx.lineTo(-s*0.36, 0); ctx.lineTo(-s*0.12, s*0.28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo( s*0.12, -s*0.28); ctx.lineTo( s*0.36, 0); ctx.lineTo( s*0.12, s*0.28);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo( s*0.08, -s*0.34); ctx.lineTo(-s*0.08, s*0.34);
        ctx.stroke();
        break;
      }
      case 'lock': {
        ctx.beginPath();
        ctx.arc(0, -s*0.10, s*0.25, Math.PI, 0);
        ctx.stroke();
        ctx.strokeRect(-s*0.32, -s*0.06, s*0.64, s*0.46);
        ctx.beginPath(); ctx.arc(0, s*0.17, s*0.08, 0, Math.PI*2); ctx.stroke();
        break;
      }
      case 'cloud2': {
        // bac / conteneur bas
        ctx.beginPath();
        ctx.moveTo(-s*0.38,  s*0.08);
        ctx.lineTo(-s*0.38,  s*0.44);
        ctx.lineTo( s*0.38,  s*0.44);
        ctx.lineTo( s*0.38,  s*0.08);
        ctx.stroke();
        // tige flèche vers le haut
        ctx.beginPath();
        ctx.moveTo(0,  s*0.08);
        ctx.lineTo(0, -s*0.34);
        ctx.stroke();
        // tête de flèche
        ctx.beginPath();
        ctx.moveTo(-s*0.24, -s*0.16);
        ctx.lineTo( 0,      -s*0.40);
        ctx.lineTo( s*0.24, -s*0.16);
        ctx.stroke();
        break;
      }
      case 'monitor': {
        ctx.strokeRect(-s*0.42, -s*0.32, s*0.84, s*0.56);
        ctx.beginPath();
        ctx.moveTo(-s*0.18, s*0.24); ctx.lineTo(-s*0.18, s*0.44);
        ctx.moveTo( s*0.18, s*0.24); ctx.lineTo( s*0.18, s*0.44);
        ctx.moveTo(-s*0.28, s*0.44); ctx.lineTo( s*0.28, s*0.44);
        ctx.stroke();
        break;
      }
    }
    ctx.restore();
  }

  function bezPt(ax, ay, cpx, cpy, bx, by, t) {
    const u = 1 - t;
    return {
      x: u*u*ax + 2*u*t*cpx + t*t*bx,
      y: u*u*ay + 2*u*t*cpy + t*t*by,
    };
  }


  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function init() {
    const W = canvas.width, H = canvas.height;
    const navH = 80;

    nodes = POS.map((p, i) => ({
      bx: p[0] * W,
      by: navH + p[1] * (H - navH),
      x: 0, y: 0,
      icon:  TYPES[i],
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '90,190,255' : '60,140,230',
    }));

    edges = [];
    const used = new Set();
    for (let i = 0; i < nodes.length; i++) {
      const sorted = nodes
        .map((_, j) => ({ j, d: Math.hypot(nodes[j].bx - nodes[i].bx, nodes[j].by - nodes[i].by) }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d);

      for (let k = 0; k < 4; k++) {
        const j   = sorted[k].j;
        const key = Math.min(i, j) + '-' + Math.max(i, j);
        if (!used.has(key)) {
          used.add(key);
          const mx = (nodes[i].bx + nodes[j].bx) / 2;
          const my = (nodes[i].by + nodes[j].by) / 2;
          edges.push({
            a: i, b: j,
            cpx:   mx + (Math.random() - 0.5) * W * 0.09,
            cpy:   my + (Math.random() - 0.5) * H * 0.09,
            parts: [
              { t: Math.random(), speed: 0.0011 + Math.random() * 0.0009 },
            ],
            alpha: Math.random() * 0.07 + 0.04,
          });
        }
      }
    }
  }

  function tick(ts) {
    const t = ts / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const n of nodes) {
      n.x = n.bx + Math.sin(t * 0.35 + n.phase) * 5;
      n.y = n.by + Math.cos(t * 0.28 + n.phase) * 4;
    }

    for (const e of edges) {
      const na = nodes[e.a], nb = nodes[e.b];

      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.quadraticCurveTo(e.cpx, e.cpy, nb.x, nb.y);
      ctx.strokeStyle = `rgba(80,165,255,${e.alpha})`;
      ctx.lineWidth   = 0.75;
      ctx.stroke();

      for (const p of e.parts) {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const pos = bezPt(na.x, na.y, e.cpx, e.cpy, nb.x, nb.y, p.t);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(252,158,85,0.85)';
        ctx.fill();
      }
    }

    for (const n of nodes) {
      const R = 20;

      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, R * 2);
      g.addColorStop(0, `rgba(${n.color},0.16)`);
      g.addColorStop(1, `rgba(${n.color},0)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, R * 2, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.fillStyle = '#091e38';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${n.color},0.4)`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();

      ctx.strokeStyle = `rgba(${n.color},0.70)`;
      ctx.fillStyle   = `rgba(${n.color},0.70)`;
      drawIcon(n.icon, n.x, n.y, R * 0.70);
    }

    requestAnimationFrame(tick);
  }

  resize(); init(); requestAnimationFrame(tick);
  window.addEventListener('resize', () => { resize(); init(); });
})();

// Navbar scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Tabs (compétences)
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const tabEl = document.getElementById('tab-' + btn.dataset.tab);
    if (tabEl) tabEl.classList.add('active');
  });
});

// Fade-in on scroll
const fadeEls = document.querySelectorAll(
  '.info-card, .skill-category, .timeline-card, .project-card, .dossier-card, .contact-pill, .aside-block'
);
const style = document.createElement('style');
style.textContent = `
  .fade-hidden { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .fade-visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);

fadeEls.forEach(el => el.classList.add('fade-hidden'));
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    const isActive = link.getAttribute('href') === '#' + current;
    link.style.color = isActive ? '#ffffff' : '';
    link.style.background = isActive ? 'rgba(255,255,255,.15)' : '';
  });
});
