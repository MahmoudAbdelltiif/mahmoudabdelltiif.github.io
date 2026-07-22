/* ============================================================
   DATA-LOADER.JS — Automatic Asset & Dynamic Configuration Loader
   ============================================================ */

(function () {
  'use strict';

  function initDataLoader() {
    var config = window.PORTFOLIO_CONFIG;
    if (!config) return;

    // 1. Expose campaignsData globally for case-study.js engine
    window.campaignsData = config.campaigns || [];

    // 2. Dynamic CV link updates
    if (config.cvDocument) {
      document.querySelectorAll('a[download], a.btn-cv, a[href$=".pdf"]').forEach(function (link) {
        link.href = config.cvDocument;
      });
    }

    // 3. Dynamic Profile Images updates
    if (config.profileImages && config.profileImages.length) {
      var primaryPhoto = config.profileImages[0];
      document.querySelectorAll('.hero-portrait-frame img, .about-photo img, img[alt*="Mahmoud"]').forEach(function (img) {
        img.src = primaryPhoto;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataLoader);
  } else {
    initDataLoader();
  }

})();
