/* ============================================
   SCRIPT.JS — Wedding Invitation Вадим & Дарья
   ============================================ */

// ─── Guest Personalisation ────────────────────
// Guest list: add new guests here as { key, name }
const GUESTS = [
  { key: 'korostinskie',   name: 'Семья Коростинских' },
  { key: 'alexandr_julia', name: 'Александр & Юлия Коростинские' },
];

(function applyGuestName() {
  const params = new URLSearchParams(window.location.search);
  const key    = params.get('guest');
  const el     = document.getElementById('guestName');
  if (!el) return;

  if (key) {
    const found = GUESTS.find(g => g.key === key);
    el.textContent = found ? found.name : decodeURIComponent(key);
  }
  // If no param — keep default "Дорогие гости"
})();

// ─── Particles ───────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width  = (Math.random() * 2.5 + 1) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration  = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay     = (Math.random() * 8) + 's';
    p.style.opacity = '0';
    container.appendChild(p);
  }
})();

// ─── Envelope Logic ───────────────────────────
const envelopeScreen = document.getElementById('envelope-screen');
const envelope       = document.getElementById('envelope');
const invitation     = document.getElementById('invitation');

let opened = false;

function openEnvelope() {
  if (opened) return;
  opened = true;

  // Animate: open flap
  envelope.classList.add('open');

  // After flap opens — fade out envelope, show invitation
  setTimeout(() => {
    envelopeScreen.classList.add('fade-out');

    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      invitation.classList.remove('hidden');
      initScrollReveal();
    }, 800);
  }, 900);
}

document.getElementById('envelope-wrapper').addEventListener('click', openEnvelope);
document.getElementById('envelope-wrapper').addEventListener('touchend', (e) => {
  e.preventDefault();
  openEnvelope();
}, { passive: false });

// ─── Scroll Reveal ────────────────────────────
function initScrollReveal() {
  // Add reveal class to target sections dynamically
  const targets = [
    '#invite-text .invite-card',
    '#program',
    '#rsvp .rsvp-card',
    '.timeline-item',
    '.divider-section',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
        if (el.revealTimeout) clearTimeout(el.revealTimeout);
        el.revealTimeout = setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  // Observe ALL .reveal elements (both dynamic and static from HTML like hero text)
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Also handle timeline specifically
  document.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('reveal'); // already has its own transition
    observer.observe(el);
  });
}

// ─── Countdown Timer ─────────────────────
(function startCountdown() {
  const weddingDate = new Date('2026-07-18T15:00:00');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent    = '00';
      document.getElementById('cd-hours').textContent   = '00';
      document.getElementById('cd-minutes').textContent = '00';
      document.getElementById('cd-seconds').textContent = '00';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent    = pad(days);
    document.getElementById('cd-hours').textContent   = pad(hours);
    document.getElementById('cd-minutes').textContent = pad(minutes);
    document.getElementById('cd-seconds').textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const scrolled = window.pageYOffset;
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
}, { passive: true });

// ─── Couple photo: graceful fallback ──────────────
window.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('heroImg');
  const fallback = document.getElementById('heroFallback');

  if (img) {
    const handleImageState = () => {
      // If naturalWidth is 0, image failed to load
      if (img.naturalWidth === 0) {
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
      } else {
        // Image loaded successfully!
        if (fallback) fallback.style.display = 'none';
      }
    };

    if (img.complete) {
      handleImageState();
    } else {
      img.addEventListener('load', handleImageState);
      img.addEventListener('error', handleImageState);
    }
  }
});

// ─── Dresscode Tabs ───────────────────────────────
window.switchDresscode = function(tabId) {
  // Reset all tabs
  document.querySelectorAll('.dresscode-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dresscode-content').forEach(c => c.classList.remove('active'));

  // Activate clicked (exact match in onclick attribute)
  const targetBtn = document.querySelector(`.dresscode-tab[onclick="switchDresscode('${tabId}')"]`);
  const targetContent = document.getElementById(`dresscode-${tabId}`);
  
  if (targetBtn) targetBtn.classList.add('active');
  if (targetContent) targetContent.classList.add('active');
};

// ─── Guest Message ────────────────────────────────
window.sendGuestMessage = function() {
  const input = document.getElementById('guestMessageInput');
  if (input && input.value.trim() !== '') {
    alert('Спасибо, ваше сообщение отправлено!');
    input.value = '';
  } else {
    alert('Пожалуйста, напишите сообщение перед отправкой.');
    if (input) input.focus();
  }
};
