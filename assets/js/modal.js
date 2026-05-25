/* ============================================================
   MODAL.JS — Case Study Modal Logic
   ============================================================ */

(function() {
  'use strict';

  let currentCaseIndex = 0;
  let modalOpenTime = 0;

  function openModal(caseIndex) {
    const modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    // Check if case studies data is available
    if (typeof window.caseStudies === 'undefined' || !window.caseStudies.length) {
      return;
    }

    currentCaseIndex = caseIndex;
    modalOpenTime = Date.now();

    const study = window.caseStudies[caseIndex];
    if (!study) return;

    // Populate modal
    const titleEl = modal.querySelector('.modal-title');
    const industryEl = modal.querySelector('.modal-industry');
    const galleryEl = modal.querySelector('.modal-gallery');
    const dotsEl = modal.querySelector('.gallery-dots');
    const challengeEl = modal.querySelector('.modal-challenge');
    const strategyEl = modal.querySelector('.modal-strategy');
    const resultsEl = modal.querySelector('.results-grid');
    const platformsEl = modal.querySelector('.ticker-track');

    if (titleEl) titleEl.textContent = study.title;
    if (industryEl) industryEl.textContent = study.industry;

    // Gallery
    if (galleryEl && study.images) {
      galleryEl.innerHTML = study.images.map(function(img) {
        return '<img src="' + img + '" alt="' + study.title + '" loading="lazy">';
      }).join('');
    }

    // Dots
    if (dotsEl && study.images) {
      dotsEl.innerHTML = study.images.map(function(_, i) {
        return '<button class="gallery-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></button>';
      }).join('');
    }

    // Challenge
    if (challengeEl) challengeEl.textContent = study.challenge || '';

    // Strategy
    if (strategyEl && study.strategy) {
      strategyEl.innerHTML = study.strategy.map(function(s) {
        return '<li>' + s + '</li>';
      }).join('');
    }

    // Results
    if (resultsEl && study.results) {
      resultsEl.innerHTML = study.results.map(function(r) {
        return '<div class="result-card"><div class="result-number" data-counter data-target="' + r.value + '" data-suffix="' + (r.suffix || '') + '" data-prefix="' + (r.prefix || '') + '">' + (r.prefix || '') + '0' + (r.suffix || '') + '</div><div class="result-label">' + r.label + '</div></div>';
      }).join('');

      // Re-init counters for modal
      if (typeof initCounters === 'function') initCounters();
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Tracking
    if (typeof trackEvent === 'function') {
      trackEvent('case_study_modal_open', {
        title: study.title,
        industry: study.industry
      });
    }
  }

  function closeModal() {
    const modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    const study = window.caseStudies ? window.caseStudies[currentCaseIndex] : null;

    modal.classList.remove('active');
    document.body.style.overflow = '';

    if (typeof trackEvent === 'function' && study) {
      trackEvent('case_study_modal_close', {
        title: study.title,
        time_spent_seconds: Math.round((Date.now() - modalOpenTime) / 1000)
      });
    }
  }

  function navigateModal(direction) {
    if (typeof window.caseStudies === 'undefined' || !window.caseStudies.length) return;

    const fromStudy = window.caseStudies[currentCaseIndex];
    let newIndex = currentCaseIndex + direction;

    if (newIndex < 0) newIndex = window.caseStudies.length - 1;
    if (newIndex >= window.caseStudies.length) newIndex = 0;

    openModal(newIndex);

    if (typeof trackEvent === 'function') {
      trackEvent('case_study_navigate', {
        direction: direction > 0 ? 'next' : 'prev',
        from: fromStudy ? fromStudy.title : '',
        to: window.caseStudies[newIndex] ? window.caseStudies[newIndex].title : ''
      });
    }
  }

  // Expose functions globally
  window.openCaseStudyModal = openModal;
  window.closeCaseStudyModal = closeModal;
  window.navigateCaseStudy = navigateModal;

  // Close on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateModal(-1);
    if (e.key === 'ArrowRight') navigateModal(1);
  });

  // Close on overlay click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  });

  // Gallery scroll — update dots
  document.addEventListener('scroll', function(e) {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;

    const dots = gallery.parentElement.querySelector('.gallery-dots');
    if (!dots) return;

    const scrollLeft = gallery.scrollLeft;
    const itemWidth = gallery.querySelector('img') ? gallery.querySelector('img').offsetWidth + 12 : 1;
    const activeIndex = Math.round(scrollLeft / itemWidth);

    dots.querySelectorAll('.gallery-dot').forEach(function(dot, i) {
      dot.classList.toggle('active', i === activeIndex);
    });

    if (typeof trackEvent === 'function') {
      trackEvent('case_study_image_scroll', {
        image_index: activeIndex
      });
    }
  }, true);

})();
