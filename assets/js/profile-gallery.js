/* ============================================================
   PROFILE-GALLERY.JS — 3D Interactive Personal Photos Showcase
   ============================================================ */

(function () {
  'use strict';

  var currentIndex = 0;
  var timer = null;

  function initProfileGallery() {
    var config = window.PORTFOLIO_CONFIG;
    if (!config || !config.profileImages || !config.profileImages.length) return;

    var images = config.profileImages;

    // Build 3D Photo Stack in Hero Frame
    var heroFrame = document.querySelector('.hero-portrait-frame');
    if (heroFrame && images.length > 1) {
      setupFrameGallery(heroFrame, images, 'hero');
    }

    // Build 3D Photo Stack in About Photo
    var aboutPhoto = document.querySelector('.about-photo-placeholder');
    if (aboutPhoto && images.length > 1) {
      setupFrameGallery(aboutPhoto, images, 'about');
    }

    startAutoRotate(images.length);
  }

  function setupFrameGallery(container, images, type) {
    container.innerHTML = '';

    // Create Slides
    images.forEach(function (src, i) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Mahmoud Abdellatif — Photo ' + (i + 1);
      img.className = 'profile-3d-slide' + (i === 0 ? ' active' : '');
      img.setAttribute('data-index', i);
      container.appendChild(img);
    });

    // Create Overlay
    var overlay = document.createElement('div');
    overlay.className = 'hero-portrait-overlay';
    container.appendChild(overlay);

    // Create 3D Navigation Controls
    var controls = document.createElement('div');
    controls.className = 'profile-3d-controls';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'p3d-btn p3d-prev';
    prevBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>';
    prevBtn.setAttribute('aria-label', 'Previous Photo');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'p3d-btn p3d-next';
    nextBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
    nextBtn.setAttribute('aria-label', 'Next Photo');

    var dots = document.createElement('div');
    dots.className = 'p3d-dots';
    images.forEach(function (_, i) {
      var dot = document.createElement('span');
      dot.className = 'p3d-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        goToSlide(i, images.length);
      });
      dots.appendChild(dot);
    });

    controls.appendChild(prevBtn);
    controls.appendChild(dots);
    controls.appendChild(nextBtn);
    container.appendChild(controls);

    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      goToSlide((currentIndex - 1 + images.length) % images.length, images.length);
    });

    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      goToSlide((currentIndex + 1) % images.length, images.length);
    });
  }

  function goToSlide(index, total) {
    currentIndex = index;

    document.querySelectorAll('.profile-3d-slide').forEach(function (slide) {
      var slideIdx = parseInt(slide.getAttribute('data-index'), 10);
      slide.classList.toggle('active', slideIdx === currentIndex);
    });

    document.querySelectorAll('.p3d-dot').forEach(function (dot) {
      var dotIdx = parseInt(dot.getAttribute('data-index'), 10);
      dot.classList.toggle('active', dotIdx === currentIndex);
    });
  }

  function startAutoRotate(total) {
    stopAutoRotate();
    timer = setInterval(function () {
      goToSlide((currentIndex + 1) % total, total);
    }, 4500);
  }

  function stopAutoRotate() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProfileGallery);
  } else {
    initProfileGallery();
  }

})();
