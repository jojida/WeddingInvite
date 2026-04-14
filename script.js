/* ============================================
   SCRIPT.JS — Wedding Invitation Вадим & Дарья
   ============================================ */

// ─── Guest Personalisation ────────────────────
// Guest list is defined in guests.js (loaded before this file)

(function applyGuestName() {
  const params = new URLSearchParams(window.location.search);
  const key    = params.get('guest');
  const el     = document.getElementById('guestName');
  if (!el || !key) return;

  // Merge guests.js + guests added via admin panel (localStorage)
  let allGuests = typeof GUESTS !== 'undefined' ? [...GUESTS] : [];
  try {
    const saved = localStorage.getItem('weddingGuests');
    if (saved) {
      const local = JSON.parse(saved);
      local.forEach(g => { if (!allGuests.find(x => x.key === g.key)) allGuests.push(g); });
    }
  } catch(e) {}

  const found = allGuests.find(g => g.key === key);
  el.textContent = found ? found.name : decodeURIComponent(key);
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

// ─── Telegram Bot ───────────────────────────────
const TG_TOKEN   = '8684007979:AAFHu67Z3CkSxP_dInjE_PQy7WZNbmNyLGs';
const TG_CHAT_ID = '461212029';

function tgSend(text) {
  return fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT_ID, text, parse_mode: 'HTML' })
  });
}

function getGuestLabel() {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('guest');
  if (!key) return 'Аноним';

  // Merge guests from guests.js file + any added via admin panel (localStorage)
  let allGuests = typeof GUESTS !== 'undefined' ? [...GUESTS] : [];
  try {
    const saved = localStorage.getItem('weddingGuests');
    if (saved) {
      const local = JSON.parse(saved);
      // Add local guests that aren't already in the array
      local.forEach(g => { if (!allGuests.find(x => x.key === g.key)) allGuests.push(g); });
    }
  } catch(e) {}

  const found = allGuests.find(g => g.key === key);
  return found ? found.name : decodeURIComponent(key);
}

// ─── RSVP Form Submit ────────────────────────────
window.sendRsvp = function(form) {
  const btn = form.querySelector('button[type="submit"]');

  // Validate attendance
  const attendance = form.querySelector('input[name="attendance"]:checked');
  if (!attendance) {
    alert('Пожалуйста, выберите ответ о присутствии.');
    return;
  }

  const drinks = Array.from(form.querySelectorAll('input[name="drink"]:checked'))
    .map(el => el.value);

  const guest      = getGuestLabel();
  const attendTxt  = attendance.value === 'yes' ? '✅ Будет!' : '❌ Не сможет';
  const drinksTxt  = drinks.length ? drinks.join(', ') : 'Не указано';

  const message =
    `📋 <b>Новая анкета гостя</b>\n` +
    `👤 Гость: <b>${guest}</b>\n` +
    `🎉 Присутствие: ${attendTxt}\n` +
    `🥂 Напитки: ${drinksTxt}`;

  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  tgSend(message).then(() => {
    btn.textContent = '✓ Анкета отправлена!';
    btn.style.opacity = '0.6';
  }).catch(() => {
    btn.disabled = false;
    btn.textContent = 'Отправить';
    alert('Ошибка отправки. Попробуйте ещё раз.');
  });
};

// ─── Guest Message ────────────────────────────────
window.sendGuestMessage = function() {
  const input = document.getElementById('guestMessageInput');
  const btn   = document.querySelector('[onclick="sendGuestMessage()"]');

  if (!input || input.value.trim() === '') {
    alert('Пожалуйста, напишите сообщение перед отправкой.');
    if (input) input.focus();
    return;
  }

  const guest   = getGuestLabel();
  const message =
    `💌 <b>Сообщение от гостя</b>\n` +
    `👤 Гость: <b>${guest}</b>\n` +
    `📝 Текст: ${input.value.trim()}`;

  if (btn) { btn.disabled = true; btn.textContent = 'Отправляем...'; }

  tgSend(message).then(() => {
    input.value = '';
    if (btn) { btn.textContent = '✓ Отправлено!'; btn.style.opacity = '0.6'; }
  }).catch(() => {
    if (btn) { btn.disabled = false; btn.textContent = 'Отправить'; }
    alert('Ошибка отправки. Попробуйте ещё раз.');
  });
};
