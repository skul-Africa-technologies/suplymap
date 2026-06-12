// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuIconOpen = document.getElementById('menuIconOpen');
const menuIconClose = document.getElementById('menuIconClose');
let menuOpen = false;

menuBtn.addEventListener('click', function () {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('hidden');
  menuIconOpen.classList.toggle('hidden');
  menuIconClose.classList.toggle('hidden');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Close mobile menu if open
    if (menuOpen) {
      menuOpen = false;
      mobileMenu.classList.add('hidden');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    }
  });
});

// Navbar background on scroll
const nav = document.getElementById('navbar');
window.addEventListener('scroll', function () {
  if (window.scrollY > 20) {
    nav.classList.add('bg-white/90', 'backdrop-blur-lg', 'shadow-sm');
    nav.classList.remove('bg-transparent');
  } else {
    nav.classList.remove('bg-white/90', 'backdrop-blur-lg', 'shadow-sm');
    nav.classList.add('bg-transparent');
  }
});

// Intersection Observer for fade-in-on-scroll
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(function (el) {
  observer.observe(el);
});

// Stat counter animation
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  function tick() {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      return;
    }
    el.textContent = Math.floor(start).toLocaleString();
    requestAnimationFrame(tick);
  }
  tick();
}

const statsObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(function (c) {
        animateCounter(c, parseInt(c.getAttribute('data-count')), 1800);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);
