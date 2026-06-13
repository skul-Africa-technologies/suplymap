/* ── SuplyMap Page Loader & Auth Guard ──────────────────────────
 *
 *  HOW TO USE:
 *  Add this ONE script tag as the FIRST child of <body> on every
 *  protected page:
 *
 *    <script src="/js/loader.js"></script>
 *
 *  Config (optional) — set before the <script> tag or via data attrs:
 *    window.SM_LOADER_CONFIG = {
 *      requireAuth: true,          // default: true  — redirect to /login if not signed in
 *      redirectTo: '/login',       // default: '/login'
 *      logoSrc: '/assets/logo.png',// default: '/assets/logo.png'
 *    };
 *
 *  Auth pages (login.html / register.html) set requireAuth: false so
 *  logged-in users get bounced to / instead of seeing the form again.
 * ────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────── */
  const cfg = Object.assign(
    {
      requireAuth: true,
      redirectTo: '/login',
      logoSrc: '/assets/logo.png',
    },
    window.SM_LOADER_CONFIG || {}
  );

  /* ── Auth check ──────────────────────────────────────────── */
  function isAuthenticated() {
    const token = localStorage.getItem('sm_token');
    return token && token.length > 0;
  }

  /* ── Inject overlay HTML + CSS immediately (before DOM ready) */
  const style = document.createElement('style');
  style.textContent = `
    #sm-loader-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #F5F7FA;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }

    #sm-loader-overlay.sm-fade-out {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .sm-loader-logo {
      height: 36px;
      width: auto;
      opacity: 0;
      transform: translateY(6px);
      animation: smLogoIn 0.5s ease 0.1s forwards;
    }

    .sm-loader-logo-fallback {
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #000101;
      opacity: 0;
      transform: translateY(6px);
      animation: smLogoIn 0.5s ease 0.1s forwards;
      display: none;
    }

    /* Track — the thin bar */
    .sm-loader-track {
      width: 160px;
      height: 2px;
      background: #e5e7eb;
      border-radius: 99px;
      overflow: hidden;
      opacity: 0;
      animation: smLogoIn 0.5s ease 0.25s forwards;
    }

    /* Fill — animated progress */
    .sm-loader-fill {
      height: 100%;
      width: 0%;
      border-radius: 99px;
      background: #0672B5;
      transition: width 0.35s ease;
    }

    /* Pulsing dot indicator beneath the bar */
    .sm-loader-dots {
      display: flex;
      gap: 5px;
      opacity: 0;
      animation: smLogoIn 0.5s ease 0.4s forwards;
    }

    .sm-loader-dots span {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #8DB6AD;
      animation: smDotPulse 1.2s ease-in-out infinite;
    }

    .sm-loader-dots span:nth-child(2) { animation-delay: 0.2s; }
    .sm-loader-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes smLogoIn {
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes smDotPulse {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.85); }
      40%            { opacity: 1;   transform: scale(1);    }
    }

    /* Body lock while loading */
    body.sm-loading {
      overflow: hidden;
    }

    @media (prefers-reduced-motion: reduce) {
      .sm-loader-logo,
      .sm-loader-logo-fallback,
      .sm-loader-track,
      .sm-loader-dots,
      .sm-loader-fill,
      .sm-loader-dots span,
      #sm-loader-overlay {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  /* Build overlay DOM */
  const overlay = document.createElement('div');
  overlay.id = 'sm-loader-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-label', 'Loading SuplyMap');

  const logo = document.createElement('img');
  logo.src = cfg.logoSrc;
  logo.alt = 'SuplyMap';
  logo.className = 'sm-loader-logo';
  logo.onerror = function () {
    this.style.display = 'none';
    fallback.style.display = 'block';
  };

  const fallback = document.createElement('span');
  fallback.className = 'sm-loader-logo-fallback';
  fallback.textContent = 'SuplyMap';

  const track = document.createElement('div');
  track.className = 'sm-loader-track';
  const fill = document.createElement('div');
  fill.className = 'sm-loader-fill';
  track.appendChild(fill);

  const dots = document.createElement('div');
  dots.className = 'sm-loader-dots';
  dots.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 3; i++) {
    dots.appendChild(document.createElement('span'));
  }

  overlay.appendChild(logo);
  overlay.appendChild(fallback);
  overlay.appendChild(track);
  overlay.appendChild(dots);

  /* Insert as first child of body (body may not exist yet) */
  function mountOverlay() {
    document.body.classList.add('sm-loading');
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  if (document.body) {
    mountOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', mountOverlay);
  }

  /* ── Progress simulation ──────────────────────────────────── */
  let progress = 0;
  let rafId    = null;
  let resolved = false;

  function setProgress(pct) {
    progress = Math.min(pct, 100);
    fill.style.width = progress + '%';
  }

  /* Simulate steady progress while resources load */
  const increments = [
    { target: 30,  delay: 80  },
    { target: 55,  delay: 200 },
    { target: 75,  delay: 400 },
    { target: 88,  delay: 700 },
  ];

  increments.forEach(({ target, delay }) => {
    setTimeout(() => {
      if (!resolved) setProgress(target);
    }, delay);
  });

  /* ── Dismiss overlay ─────────────────────────────────────── */
  function dismiss() {
    if (resolved) return;
    resolved = true;
    setProgress(100);

    setTimeout(() => {
      overlay.classList.add('sm-fade-out');
      document.body.classList.remove('sm-loading');

      overlay.addEventListener('transitionend', () => {
        overlay.remove();
        style.remove();
      }, { once: true });

      /* Safety removal */
      setTimeout(() => {
        overlay.remove();
        style.remove();
      }, 600);
    }, 280); /* brief pause at 100% so it reads as complete */
  }

  /* ── Auth guard + dismiss on load ───────────────────────── */
  function handleLoad() {
    const authed = isAuthenticated();

    if (cfg.requireAuth && !authed) {
      /* Protected page, not signed in → redirect */
      window.location.replace(cfg.redirectTo);
      return;
    }

    if (!cfg.requireAuth && authed) {
      /* Auth page (login/register), already signed in → home */
      window.location.replace('/');
      return;
    }

    /* All good — dismiss loader */
    dismiss();
  }

  /* Wait for full page load (resources included) */
  if (document.readyState === 'complete') {
    /* Already loaded (cached navigation) */
    setTimeout(handleLoad, 120);
  } else {
    window.addEventListener('load', handleLoad);

    /* Hard cap: never block the user beyond 8 seconds */
    setTimeout(() => {
      if (!resolved) handleLoad();
    }, 8000);
  }

})();