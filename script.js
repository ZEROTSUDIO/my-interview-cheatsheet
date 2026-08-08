// Tailwind Configuration
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['"JetBrains Mono"', 'monospace'],
        }
      }
    }
  };
} else {
  window.tailwind = {
    config: {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace'],
          }
        }
      }
    }
  };
}

// ── Highlight.js init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof hljs !== 'undefined') {
    document.querySelectorAll('pre code').forEach(el => {
      hljs.highlightElement(el);
    });
  }
  updateActiveNav();
});

// ── Reading progress bar ──────────────────────────────────────
window.addEventListener('scroll', () => {
  const bar = document.getElementById('reading-bar');
  if (bar) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.transform = `scaleX(${Math.min(pct, 1)})`;
  }
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (s.getBoundingClientRect().top <= 120) current = s.id;
  });
  document.querySelectorAll('.nav-link[id]').forEach(lnk => {
    const matches = lnk.id === 'nl-' + current;
    lnk.classList.toggle('active', matches);
  });
}

// ── Copy to clipboard ─────────────────────────────────────────
function doCopy(btn) {
  const pre = btn.closest('.code-wrap').querySelector('pre');
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText || pre.textContent).then(() => {
    btn.textContent = '✓ Copied';
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 2000);
  });
}

// ── Toggle card body ──────────────────────────────────────────
function toggleCard(header) {
  const body    = header.nextElementSibling;
  const chevron = header.querySelector('.chevron');
  if (!body) return;
  const isOpen  = !body.classList.contains('hidden');
  body.classList.toggle('hidden', isOpen);
  if (chevron) chevron.classList.toggle('open', !isOpen);
}

// ── Toggle "how it works" sub-panel ──────────────────────────
function toggleHow(btn) {
  const panel = btn.nextElementSibling;
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
}

// ── Search / filter ───────────────────────────────────────────
function doSearch(q) {
  q = q.toLowerCase().trim();
  document.querySelectorAll('.card').forEach(card => {
    const kw   = (card.dataset.kw || '').toLowerCase();
    const text = card.textContent.toLowerCase();
    const show = !q || kw.includes(q) || text.includes(q);
    card.style.display = show ? '' : 'none';
    if (show && q) {
      const body    = card.querySelector('.card-body');
      const chevron = card.querySelector('.chevron');
      if (body)    body.classList.remove('hidden');
      if (chevron) chevron.classList.add('open');
    }
  });
  document.querySelectorAll('section[id]').forEach(sec => {
    const visible = Array.from(sec.querySelectorAll('.card'))
                         .some(c => c.style.display !== 'none');
    sec.style.display = (!q || visible) ? '' : 'none';
  });
}
