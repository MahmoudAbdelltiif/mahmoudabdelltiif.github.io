/* ============================================================
   TRANSITION.JS — Page Fade Transitions Between Pages
   ============================================================ */

(function() {
  'use strict';

  // On page load — fade in
  window.addEventListener('load', function() {
    document.body.classList.add('page-enter');
  });

  // On nav link click — fade out then navigate
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    // Only internal links
    if (link.hostname !== window.location.hostname) return;

    // Skip if modifier keys pressed (open in new tab)
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    // Skip anchor links on same page
    if (link.hash && link.pathname === window.location.pathname) return;

    // Skip links that don't navigate (javascript: etc.)
    if (!link.getAttribute('href') || link.getAttribute('href').startsWith('#')) return;

    e.preventDefault();
    const href = link.href;

    document.body.classList.add('page-exit');

    setTimeout(function() {
      window.location.href = href;
    }, 300);
  });

})();
