/* ============================================================
   MODAL.JS — Case Study Modal Logic
   ============================================================ */

(function() {
  'use strict';

  var currentCaseIndex = 0;
  var modalOpenTime = 0;
  var currentSlide = 0;

  function showSlide(modal, slideIndex) {
    var galleryEl = modal.querySelector('.modal-gallery');
    var dotsEl = modal.querySelector('.gallery-dots');
    if (!galleryEl) return;

    // Hide all images, show the target
    var images = galleryEl.querySelectorAll('img');
    images.forEach(function(img, i) {
      img.style.display = i === slideIndex ? 'block' : 'none';
    });

    // Update dots
    if (dotsEl) {
      dotsEl.querySelectorAll('.gallery-dot').forEach(function(dot, i) {
        dot.classList.toggle('active', i === slideIndex);
      });
    }

    currentSlide = slideIndex;
  }

  function openModal(caseIndex) {
    var modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    // Check if case studies data is available
    if (typeof window.caseStudies === 'undefined' || !window.caseStudies.length) {
      return;
    }

    currentCaseIndex = caseIndex;
    currentSlide = 0;
    modalOpenTime = Date.now();

    var study = window.caseStudies[caseIndex];
    if (!study) return;

    // Populate modal
    var titleEl = modal.querySelector('.modal-title');
    var industryEls = modal.querySelectorAll('.modal-industry');
    var galleryEl = modal.querySelector('.modal-gallery');
    var dotsEl = modal.querySelector('.gallery-dots');
    var challengeEl = modal.querySelector('.modal-challenge');
    var strategyEl = modal.querySelector('.modal-strategy');
    var resultsEl = modal.querySelector('.results-grid');

    if (titleEl) titleEl.textContent = study.title;
    industryEls.forEach(function(el) { el.textContent = study.industry; });

    // Gallery
    if (galleryEl && study.images && study.images.length > 0) {
      galleryEl.innerHTML = study.images.map(function(img, i) {
        return '<img src="' + img + '" alt="' + study.title + ' - Image ' + (i + 1) + '" loading="lazy" data-slide="' + i + '">';
      }).join('');
    } else if (galleryEl) {
      galleryEl.innerHTML = '';
    }

    // Dots
    if (dotsEl && study.images && study.images.length > 1) {
      dotsEl.innerHTML = study.images.map(function(_, i) {
        return '<button class="gallery-dot' + (i === 0 ? ' active' : '') + '" data-index="' + i + '"></button>';
      }).join('');
      dotsEl.style.display = '';
    } else if (dotsEl) {
      dotsEl.innerHTML = '';
      dotsEl.style.display = 'none';
    }

    // Show/hide gallery arrows
    var prevBtn = modal.querySelector('.gallery-prev');
    var nextBtn = modal.querySelector('.gallery-next');
    var hasMultiple = study.images && study.images.length > 1;
    if (prevBtn) prevBtn.style.display = hasMultiple ? '' : 'none';
    if (nextBtn) nextBtn.style.display = hasMultiple ? '' : 'none';

    // Show first slide
    showSlide(modal, 0);

    // Challenge
    if (challengeEl) challengeEl.textContent = study.challenge || '';

    // Strategy
    if (strategyEl && study.strategy) {
      strategyEl.innerHTML = study.strategy.map(function(s) {
        return '<li>' + s + '</li>';
      }).join('');
    }

    // Results — directly set the numbers
    if (resultsEl && study.results) {
      resultsEl.innerHTML = study.results.map(function(r) {
        var displayValue = (r.prefix || '') + r.value + (r.suffix || '');
        return '<div class="result-card"><div class="result-number">' + displayValue + '</div><div class="result-label">' + r.label + '</div></div>';
      }).join('');
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Scroll modal content to top
    var modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;

    // Tracking
    if (typeof trackEvent === 'function') {
      trackEvent('case_study_modal_open', {
        title: study.title,
        industry: study.industry
      });
    }
  }

  function closeModal() {
    var modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    var study = window.caseStudies ? window.caseStudies[currentCaseIndex] : null;

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

    var fromStudy = window.caseStudies[currentCaseIndex];
    var newIndex = currentCaseIndex + direction;

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

  // Gallery navigation
  function galleryNavigate(direction) {
    var modal = document.getElementById('caseStudyModal');
    if (!modal) return;

    var study = window.caseStudies ? window.caseStudies[currentCaseIndex] : null;
    if (!study || !study.images) return;

    var totalSlides = study.images.length;
    var newSlide = currentSlide + direction;

    if (newSlide < 0) newSlide = totalSlides - 1;
    if (newSlide >= totalSlides) newSlide = 0;

    showSlide(modal, newSlide);
  }

  // Expose functions globally
  window.openCaseStudyModal = openModal;
  window.closeCaseStudyModal = closeModal;
  window.navigateCaseStudy = navigateModal;
  window.galleryNavigate = galleryNavigate;

  // Close on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // Close on overlay click & gallery dot click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
    // Gallery dot click
    if (e.target.classList.contains('gallery-dot')) {
      var index = parseInt(e.target.getAttribute('data-index'), 10);
      var modal = document.getElementById('caseStudyModal');
      if (modal) showSlide(modal, index);
    }
  });

})();
