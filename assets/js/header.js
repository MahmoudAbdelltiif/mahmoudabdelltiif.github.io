/* ============================================================
   HEADER.JS — Inject Header + Smooth Scroll + Scrollspy
   Single-page: nav links scroll to in-page sections
   ============================================================ */

(function() {
  'use strict';

  const headerHTML = `
  <header class="site-header" id="site-header">
    <nav class="nav-container">
      <a href="#hero" class="nav-logo" data-gtm-event="nav_logo_click">
        <span class="logo-name">Mahmoud</span>
        <span class="logo-dot">.</span>
      </a>

      <button class="nav-toggle" aria-label="Toggle menu" data-gtm-event="nav_hamburger_click">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-links" role="list">
        <li><a href="#hero"           data-page="home"           data-gtm-event="nav_click" data-gtm-label="Home">Home</a></li>
        <li><a href="#about"          data-page="about"          data-gtm-event="nav_click" data-gtm-label="About">About</a></li>
        <li><a href="#skills"         data-page="skills"         data-gtm-event="nav_click" data-gtm-label="Skills">Skills</a></li>
        <li><a href="#experience"     data-page="experience"     data-gtm-event="nav_click" data-gtm-label="Experience">Experience</a></li>
        <li><a href="#case-study"     data-page="case-study"     data-gtm-event="nav_click" data-gtm-label="Case Study">Case Study</a></li>
        <li><a href="#certifications" data-page="certifications" data-gtm-event="nav_click" data-gtm-label="Certifications">Certifications</a></li>
        <li><a href="#contact"        data-page="contact"        data-gtm-event="nav_click" data-gtm-label="Contact" class="nav-cta">Contact</a></li>
      </ul>
    </nav>
  </header>`;

  // Insert header at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));

  // Mobile hamburger toggle
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');

      const isOpen = navLinks.classList.contains('open');
      if (typeof trackEvent === 'function') {
        trackEvent(isOpen ? 'nav_hamburger_open' : 'nav_hamburger_close', {});
      }
    });
  }

  // Smooth-scroll for all in-page anchor links (nav, logo, hero CTAs, scroll indicator)
  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerH = 72;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
  }

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2) return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(hash);
    history.replaceState(null, '', hash);
    // Close mobile menu after navigating
    if (navToggle) navToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('open');
  });

  // Sticky header scroll effect
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Scrollspy — highlight the nav link of the section currently in view
  const sections = links
    .map(function(l) {
      const sel = l.getAttribute('href');
      return sel === '#hero' ? document.getElementById('hero') : document.querySelector(sel);
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach(function(l) {
      l.classList.toggle('active', l.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function(s) { spy.observe(s); });
  }

})();
