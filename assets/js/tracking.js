/* ============================================================
   TRACKING.JS — GTM dataLayer Helpers + All Events
   ============================================================ */

(function() {
  'use strict';

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // GTM Container ID — REPLACE WITH YOUR GTM ID
  const GTM_ID = 'GTM-XXXXXXX';

  // Inject GTM snippets
  // Head snippet
  const gtmHead = document.createElement('script');
  gtmHead.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');
  `;
  document.head.prepend(gtmHead);

  // Body noscript snippet
  const gtmBody = document.createElement('noscript');
  gtmBody.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.prepend(gtmBody);

  // ── Track Event Helper ──
  window.trackEvent = function(eventName, params) {
    params = params || {};
    window.dataLayer.push({
      event: eventName,
      page_path: window.location.pathname,
      page_name: document.title,
      timestamp: new Date().toISOString(),
      ...params
    });
  };

  // ── Auto Page View ──
  window.dataLayer.push({
    event: 'page_data',
    page_path: window.location.pathname,
    page_title: document.title
  });

  // ── Auto-track GTM event attributes ──
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-gtm-event]');
    if (!target) return;

    const eventName = target.getAttribute('data-gtm-event');
    const params = {};

    // Gather all data-gtm-* attributes
    Array.from(target.attributes).forEach(function(attr) {
      if (attr.name.startsWith('data-gtm-') && attr.name !== 'data-gtm-event') {
        const key = attr.name.replace('data-gtm-', '');
        params[key] = attr.value;
      }
    });

    params.from_page = window.location.pathname.replace('/', '').replace('.html', '') || 'home';

    trackEvent(eventName, params);
  });

  // ── Scroll Depth Tracking ──
  const scrollMilestones = [25, 50, 75, 90];
  const firedMilestones = {};

  window.addEventListener('scroll', function() {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    scrollMilestones.forEach(function(milestone) {
      if (scrollPercent >= milestone && !firedMilestones[milestone]) {
        firedMilestones[milestone] = true;
        trackEvent('scroll_depth', {
          percent: milestone,
          page: window.location.pathname.replace('/', '').replace('.html', '') || 'home'
        });
      }
    });
  }, { passive: true });

})();
