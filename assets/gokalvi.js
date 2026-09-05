/* ============================================================
   Gokalvi — shared behaviour: theme, language, reveal, tilt.
   English lives in the markup and is the source of truth.
   Tamil lives in data-ta and is swapped in on demand.
   ============================================================ */
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- theme ---------- */
  var SUN  = 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z';
  var MOON = 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z';
  var mqDark = window.matchMedia('(prefers-color-scheme: dark)');

  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : mqDark.matches;
  }
  function paintTheme() {
    var ico = document.getElementById('themeIcon');
    if (ico) ico.setAttribute('d', isDark() ? SUN : MOON);
  }
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      store.set('gk-theme', next);
      paintTheme();
    });
    paintTheme();
    if (mqDark.addEventListener) mqDark.addEventListener('change', paintTheme);
  }

  /* ---------- language ---------- */
  var nodes = document.querySelectorAll('[data-ta]');
  function applyLang(lang) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.hasAttribute('data-en')) n.setAttribute('data-en', n.innerHTML);
      n.innerHTML = (lang === 'ta') ? n.getAttribute('data-ta') : n.getAttribute('data-en');
      if (lang === 'ta') { n.setAttribute('lang', 'ta'); } else { n.removeAttribute('lang'); }
    }
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang === 'ta' ? 'ta' : 'en');
    var lbl = document.getElementById('langLabel');
    if (lbl) lbl.textContent = (lang === 'ta') ? 'English' : 'தமிழ்';
  }
  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      var next = (root.getAttribute('data-lang') === 'ta') ? 'en' : 'ta';
      applyLang(next);
      store.set('gk-lang', next);
    });
  }
  if (root.getAttribute('data-lang') === 'ta') applyLang('ta');

  /* ---------- sticky nav hairline ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- pointer tilt on the phone (fine pointers only) ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stage = document.querySelector('.stage');
  var phone = document.querySelector('.phone');
  if (stage && phone && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transition = 'transform .18s ease-out';
      phone.style.transform = 'rotateY(' + (-13 + x * 16) + 'deg) rotateX(' + (5 - y * 12) + 'deg) rotateZ(-1.2deg)';
    });
    stage.addEventListener('pointerleave', function () {
      phone.style.transition = 'transform .7s cubic-bezier(.22,.75,.28,1)';
      phone.style.transform = '';
    });
  }
})();
