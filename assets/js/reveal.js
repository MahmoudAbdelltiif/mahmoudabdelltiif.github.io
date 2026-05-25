/* ============================================================
   REVEAL.JS — Intersection Observer Scroll Reveals
   ============================================================ */

(function() {
  'use strict';

  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .timeline-entry');

    if (!revealElements.length) return;

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function(el, index) {
      // Add stagger delay based on position
      el.style.transitionDelay = (index % 4) * 0.1 + 's';
      observer.observe(el);
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }

})();
