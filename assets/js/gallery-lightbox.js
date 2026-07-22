/* ============================================================
   GALLERY-LIGHTBOX.JS — High-Resolution Fullscreen Image Viewer
   ============================================================ */

(function () {
  'use strict';

  var currentGallery = [];
  var currentIndex = 0;
  var lightboxEl = null;

  function createLightboxHTML() {
    if (document.getElementById('galleryLightbox')) return;

    var html = `
      <div id="galleryLightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Image View">
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <div class="lightbox-header">
            <span class="lightbox-title" id="lightboxTitle"></span>
            <span class="lightbox-counter" id="lightboxCounter"></span>
            <button class="lightbox-close" id="lightboxClose" aria-label="Close Lightbox">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="lightbox-body">
            <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Previous Image">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="lightbox-image-wrapper">
              <img id="lightboxImg" src="" alt="" loading="eager">
            </div>
            <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Next Image">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    lightboxEl = document.getElementById('galleryLightbox');

    // Bind events
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(-1);
    });
    document.getElementById('lightboxNext').addEventListener('click', function (e) {
      e.stopPropagation();
      navigate(1);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  function openLightbox(imagesArray, startIndex) {
    if (!imagesArray || !imagesArray.length) return;
    createLightboxHTML();

    currentGallery = imagesArray;
    currentIndex = startIndex || 0;

    updateView();
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateView() {
    if (!currentGallery[currentIndex]) return;
    var item = currentGallery[currentIndex];

    var img = document.getElementById('lightboxImg');
    var title = document.getElementById('lightboxTitle');
    var counter = document.getElementById('lightboxCounter');

    img.src = typeof item === 'string' ? item : item.src;
    img.alt = typeof item === 'string' ? 'Campaign Result' : (item.title || 'Campaign Result');
    title.textContent = typeof item === 'string' ? 'Campaign Result' : (item.title || '');
    counter.textContent = (currentIndex + 1) + ' / ' + currentGallery.length;

    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    if (prevBtn) prevBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentGallery.length) % currentGallery.length;
    updateView();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;

})();
