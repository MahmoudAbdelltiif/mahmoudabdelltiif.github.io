/* ============================================================
   FILTER.JS — Filter Tabs (Skills + Work Pages)
   ============================================================ */

(function() {
  'use strict';

  function initFilters() {
    const filterContainers = document.querySelectorAll('.filter-tabs');

    filterContainers.forEach(function(container) {
      const tabs = container.querySelectorAll('.filter-tab');
      const targetSelector = container.getAttribute('data-filter-target');
      const target = targetSelector ? document.querySelector(targetSelector) : container.nextElementSibling;

      if (!target) return;

      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          const filterValue = tab.getAttribute('data-filter');

          // Update active tab
          tabs.forEach(function(t) { t.classList.remove('active'); });
          tab.classList.add('active');

          // Filter items
          const items = target.querySelectorAll('.filter-item');
          items.forEach(function(item) {
            const itemCategory = item.getAttribute('data-category');
            if (filterValue === 'all' || itemCategory === filterValue) {
              item.classList.remove('hidden');
              item.style.display = '';
            } else {
              item.classList.add('hidden');
              // Delay display:none for animation
              setTimeout(function() {
                if (item.classList.contains('hidden')) {
                  item.style.display = 'none';
                }
              }, 300);
            }
          });

          // Tracking
          if (typeof trackEvent === 'function') {
            const pageType = document.querySelector('[data-page].active');
            const pageName = pageType ? pageType.getAttribute('data-page') : 'unknown';
            trackEvent(pageName === 'skills' ? 'skills_filter_click' : 'case_study_filter_click', {
              filter_label: filterValue
            });
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFilters);
  } else {
    initFilters();
  }

})();
