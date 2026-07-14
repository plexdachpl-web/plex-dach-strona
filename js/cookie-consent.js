/* ============================================================
   Belka zgody na pliki cookies — Plex-Dach
   Wstrzykuje własny HTML/CSS, zapamiętuje wybór w localStorage.
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'plexdach-cookie-consent';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var style = document.createElement('style');
  style.textContent =
    '.cookie-bar{position:fixed;left:0;right:0;bottom:0;z-index:2000;' +
    'background:rgba(20,36,29,.97);backdrop-filter:blur(10px);' +
    'border-top:1px solid rgba(245,237,216,.18);' +
    'padding:20px var(--gutter,clamp(20px,5vw,64px));' +
    'display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:18px;' +
    'font-family:"Lato",system-ui,sans-serif;' +
    'transform:translateY(100%);opacity:0;transition:transform .5s cubic-bezier(.2,.7,.2,1),opacity .5s ease;}' +
    '.cookie-bar.show{transform:translateY(0);opacity:1;}' +
    '.cookie-bar__text{color:#F5EDD8;font-size:.92rem;line-height:1.6;max-width:62ch;flex:1 1 320px;}' +
    '.cookie-bar__text a{color:#BE8A4B;text-decoration:underline;text-underline-offset:2px;}' +
    '.cookie-bar__actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}' +
    '.cookie-bar__btn{display:inline-flex;align-items:center;font-family:"Lato",sans-serif;' +
    'font-weight:700;font-size:.9rem;letter-spacing:.01em;padding:.8em 1.6em;border-radius:100px;' +
    'border:1.5px solid currentColor;background:transparent;cursor:pointer;white-space:nowrap;' +
    'transition:all .3s cubic-bezier(.2,.7,.2,1);}' +
    '.cookie-bar__btn--accept{background:#BE8A4B;border-color:#BE8A4B;color:#14241D;}' +
    '.cookie-bar__btn--accept:hover{background:#D6A964;border-color:#D6A964;transform:translateY(-2px);}' +
    '.cookie-bar__btn--reject{color:#F5EDD8;}' +
    '.cookie-bar__btn--reject:hover{background:#F5EDD8;color:#1F352C;transform:translateY(-2px);}' +
    '@media (max-width:640px){.cookie-bar{padding:18px 20px;}.cookie-bar__actions{width:100%;}' +
    '.cookie-bar__btn{flex:1 1 auto;justify-content:center;}}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Zgoda na pliki cookies');
  bar.innerHTML =
    '<p class="cookie-bar__text">Ta strona używa plików cookies, aby zapewnić prawidłowe działanie i analizować ruch.</p>' +
    '<div class="cookie-bar__actions">' +
    '<button type="button" class="cookie-bar__btn cookie-bar__btn--reject" data-choice="rejected">Odrzuć</button>' +
    '<button type="button" class="cookie-bar__btn cookie-bar__btn--accept" data-choice="accepted">Akceptuję</button>' +
    '</div>';

  document.body.appendChild(bar);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { bar.classList.add('show'); });
  });

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-choice]');
    if (!btn) return;
    localStorage.setItem(STORAGE_KEY, btn.dataset.choice);
    bar.classList.remove('show');
    setTimeout(function () { bar.remove(); }, 500);
  });
})();
