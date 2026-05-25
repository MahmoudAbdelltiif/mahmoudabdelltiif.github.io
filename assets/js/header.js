/* ============================================================
   HEADER.JS — Inject Header + Set Active Nav Link
   ============================================================ */

(function() {
  'use strict';

  // Detect if running on GitHub Pages (subdirectory)
  const isGitHubPages = window.location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '' : '';

  const headerHTML = `
  <header class="site-header" id="site-header">
    <nav class="nav-container">
      <a href="${basePath}index.html" class="nav-logo" data-gtm-event="nav_logo_click">
        <span class="logo-name">Mahmoud</span>
        <span class="logo-dot">.</span>
      </a>

      <button class="nav-toggle" aria-label="Toggle menu" data-gtm-event="nav_hamburger_click">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-links" role="list">
        <li><a href="${basePath}index.html"           data-page="home"           data-gtm-event="nav_click" data-gtm-label="Home">Home</a></li>
        <li><a href="${basePath}about.html"           data-page="about"          data-gtm-event="nav_click" data-gtm-label="About">About</a></li>
        <li><a href="${basePath}skills.html"          data-page="skills"         data-gtm-event="nav_click" data-gtm-label="Skills">Skills</a></li>
        <li><a href="${basePath}case-study.html"            data-page="case-study"           data-gtm-event="nav_click" data-gtm-label="case-study">case-study</a></li>
        <li><a href="${basePath}experience.html"      data-page="experience"     data-gtm-event="nav_click" data-gtm-label="Experience">Experience</a></li>
        <li><a href="${basePath}certifications.html"  data-page="certifications" data-gtm-event="nav_click" data-gtm-label="Certifications">Certifications</a></li>
        <li><a href="${basePath}contact.html"         data-page="contact"        data-gtm-event="nav_click" data-gtm-label="Contact" class="nav-cta">Contact</a></li>
      </ul>
    </nav>
  </header>`;

  // Insert header at the beginning of body
  document.body.insertAdjacentHTML('afterbegin', headerHTML);

  // Set active nav link
  const currentPage = window.location.pathname
    .replace('/', '')
    .replace('.html', '') || 'home';

  const activeLink = document.querySelector(`nav a[data-page="${currentPage}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }

  // Mobile hamburger toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');

      const isOpen = navLinks.classList.contains('open');
      if (typeof trackEvent === 'function') {
        trackEvent(isOpen ? 'nav_hamburger_open' : 'nav_hamburger_close', {
          from_page: currentPage
        });
      }
    });

    // Close nav when clicking a link on mobile
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Sticky header scroll effect
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

})();
