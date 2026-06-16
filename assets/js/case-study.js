/* ============================================================
   CASE-STUDY.JS — Renders the featured case study as a
   cinematic, scroll-driven story section (single-page).
   Reads from the global `caseStudies` array (data/case-studies.js).
   Self-contained: decimal counters, scroll reveals, gallery carousel.
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function decimalsOf(n) {
    var s = String(n);
    return s.indexOf('.') >= 0 ? s.split('.')[1].length : 0;
  }

  function formatNumber(value, dec) {
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });
  }

  function render(study) {
    var host = document.getElementById('caseStudyShowcase');
    if (!host || !study) return;

    var platforms = (study.platforms || []).map(function (p) {
      return '<span class="tag tag-platform">' + esc(p) + '</span>';
    }).join('');

    var strategy = (study.strategy || []).map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join('');

    var results = (study.results || []).map(function (r) {
      var dec = decimalsOf(r.value);
      return '' +
        '<div class="cs-result">' +
          '<div class="cs-result-num">' +
            '<span class="cs-count" data-to="' + r.value + '" data-dec="' + dec + '" ' +
              'data-prefix="' + esc(r.prefix || '') + '" data-suffix="' + esc(r.suffix || '') + '">' +
              esc(r.prefix || '') + '0' + esc(r.suffix || '') +
            '</span>' +
          '</div>' +
          '<div class="cs-result-label">' + esc(r.label) + '</div>' +
        '</div>';
    }).join('');

    var slides = (study.images || []).map(function (src, i) {
      return '<img src="' + src + '" alt="' + esc(study.title) + ' — slide ' + (i + 1) + '" loading="lazy">';
    }).join('');

    var dots = (study.images || []).map(function (_, i) {
      return '<button class="cs-dot' + (i === 0 ? ' active' : '') + '" data-idx="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>';
    }).join('');

    var headlineDec = decimalsOf(study.results && study.results[0] ? study.results[0].value : 0);
    var headlineVal = study.results && study.results[0] ? study.results[0].value : 0;
    var headlineLabel = study.results && study.results[0] ? study.results[0].label : 'Key Result';

    host.innerHTML = '' +
      '<div class="cs-showcase">' +
        '<div class="cs-hero cs-reveal">' +
          '<div class="cs-hero-left">' +
            '<span class="cs-industry">' + esc(study.industry) + '</span>' +
            '<h3 class="cs-title">' + esc(study.title.split('—')[0].trim()) + '</h3>' +
            '<p class="cs-subtitle">' + esc((study.title.split('—')[1] || study.keyMetric || '').trim()) + '</p>' +
            '<div class="cs-platforms">' + platforms + '</div>' +
          '</div>' +
          '<div class="cs-hero-metric">' +
            '<div class="cs-bigmetric">' +
              '<span class="cs-count" data-to="' + headlineVal + '" data-dec="' + headlineDec + '">0</span><i>×</i>' +
            '</div>' +
            '<div class="cs-bigmetric-label">' + esc(headlineLabel) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="cs-story">' +
          '<div class="cs-step cs-reveal">' +
            '<div class="cs-step-index">01</div>' +
            '<div class="cs-step-body">' +
              '<h4>The Challenge</h4>' +
              '<p>' + esc(study.challenge) + '</p>' +
            '</div>' +
          '</div>' +
          '<div class="cs-step cs-reveal">' +
            '<div class="cs-step-index">02</div>' +
            '<div class="cs-step-body">' +
              '<h4>The Strategy</h4>' +
              '<ul class="cs-strategy">' + strategy + '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="cs-step cs-reveal">' +
            '<div class="cs-step-index">03</div>' +
            '<div class="cs-step-body">' +
              '<h4>The Results</h4>' +
              '<div class="cs-results">' + results + '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="cs-gallery cs-reveal">' +
          '<div class="cs-gallery-head">' +
            '<h4>Campaign Dashboard</h4>' +
            '<div class="cs-gallery-controls">' +
              '<button class="cs-gallery-btn cs-prev" aria-label="Previous slide"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>' +
              '<button class="cs-gallery-btn cs-next" aria-label="Next slide"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>' +
            '</div>' +
          '</div>' +
          '<div class="cs-window">' +
            '<div class="cs-window-bar"><i></i><i></i><i></i><span>Salla · Store Analytics</span></div>' +
            '<div class="cs-gallery-viewport">' +
              '<div class="cs-gallery-track">' + slides + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="cs-gallery-dots">' + dots + '</div>' +
        '</div>' +
      '</div>';

    initReveals(host);
    initGallery(host);
  }

  /* Scroll reveal + trigger counters when a block enters view */
  function initReveals(host) {
    var reveals = host.querySelectorAll('.cs-reveal');
    if (!('IntersectionObserver' in window) || prefersReduced) {
      reveals.forEach(function (el) { el.classList.add('in-view'); });
      host.querySelectorAll('.cs-count').forEach(function (c) { runCounter(c); });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          entry.target.querySelectorAll('.cs-count').forEach(runCounter);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { obs.observe(el); });
  }

  function runCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = '1';
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = parseInt(el.getAttribute('data-dec'), 10) || 0;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = performance.now();

    function frame(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = to * eased;
      el.textContent = prefix + formatNumber(current, dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + formatNumber(to, dec) + suffix;
    }
    requestAnimationFrame(frame);
  }

  /* Gallery carousel — dots, arrows, autoplay, pause on hover */
  function initGallery(host) {
    var track = host.querySelector('.cs-gallery-track');
    var slides = host.querySelectorAll('.cs-gallery-track img');
    var dots = host.querySelectorAll('.cs-dot');
    var prev = host.querySelector('.cs-prev');
    var next = host.querySelector('.cs-next');
    if (!track || !slides.length) return;

    var index = 0;
    var total = slides.length;
    var timer = null;

    function go(i) {
      index = (i + total) % total;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, di) { d.classList.toggle('active', di === index); });
    }

    function start() {
      if (prefersReduced) return;
      stop();
      timer = setInterval(function () { go(index + 1); }, 4500);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (prev) prev.addEventListener('click', function () { go(index - 1); start(); });
    if (next) next.addEventListener('click', function () { go(index + 1); start(); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { go(parseInt(d.getAttribute('data-idx'), 10)); start(); });
    });

    var gallery = host.querySelector('.cs-gallery');
    if (gallery) {
      gallery.addEventListener('mouseenter', stop);
      gallery.addEventListener('mouseleave', start);
    }

    go(0);
    start();
  }

  function boot() {
    if (typeof caseStudies !== 'undefined' && caseStudies.length) {
      render(caseStudies[0]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
