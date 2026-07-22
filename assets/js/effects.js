/* ============================================================
   EFFECTS.JS — Premium Visual Effects
   Custom Cursor · 3D Card Tilt · Scroll Progress · Parallax
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDesktop = window.innerWidth >= 1024;

  /* ── Scroll Progress Bar ── */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    function update() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = pct + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Custom Cursor (desktop only) ── */
  function initCursor() {
    if (!isDesktop) return;

    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mouseX = -100, mouseY = -100;
    var ringX = -100, ringY = -100;
    var raf;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    /* Expand ring on interactive elements */
    function bindHover(selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
      });
    }
    bindHover('a, button, .card, .platform-card, .filter-tab, .social-link, .social-icon, .nav-cta');

    /* Hide when pointer leaves window */
    document.documentElement.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.documentElement.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });
  }

  /* ── 3D Card Tilt + Glare (desktop, no reduced-motion) ── */
  function initCardTilt() {
    if (!isDesktop || prefersReduced) return;

    var MAX = 11; // max tilt in degrees — stronger 3D

    function tiltCard(card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      /* Inject a glare layer that follows the pointer */
      var glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);

      card.addEventListener('mouseenter', function () {
        card.classList.remove('tilt-reset');
        card.classList.add('is-tilting');
      });

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var rotX = ((y - cy) / cy) * -MAX;
        var rotY = ((x - cx) / cx) * MAX;
        card.style.transform =
          'perspective(900px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-10px) scale(1.015)';
        /* radial inner-glow (::before) and glare track the pointer */
        var px = (x / rect.width) * 100;
        var py = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', px + '%');
        card.style.setProperty('--mouse-y', py + '%');
        card.style.setProperty('--glare-x', px + '%');
        card.style.setProperty('--glare-y', py + '%');
      });

      card.addEventListener('mouseleave', function () {
        card.classList.add('tilt-reset');
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    }

    /* Apply tilt to all cards — re-run after components render late */
    function attachTilt() {
      document.querySelectorAll('.card, .platform-card, .cert-card').forEach(tiltCard);
    }

    attachTilt();
    setTimeout(attachTilt, 600);
  }

  /* ── Hero 3D Scene — mouse-driven parallax + tilt ── */
  function initHero3D() {
    if (prefersReduced) return;
    var hero = document.querySelector('.hero');
    var scene = document.querySelector('.hero-content[data-tilt-scene]');
    var orbs = document.querySelectorAll('.hero-bg .glow-orb, .hero-bg .hero-grid');
    if (!hero) return;

    var targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
    var pointerX = 0, pointerY = 0;
    var active = false;
    var raf;

    hero.addEventListener('mousemove', function (e) {
      if (!isDesktop) return;
      var rect = hero.getBoundingClientRect();
      var nx = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
      var ny = (e.clientY - rect.top) / rect.height - 0.5;
      pointerX = nx;
      pointerY = ny;
      targetRY = nx * 10;   // rotateY follows horizontal
      targetRX = -ny * 10;  // rotateX follows vertical
      if (!active) { active = true; loop(); }
    });

    hero.addEventListener('mouseleave', function () {
      targetRX = 0; targetRY = 0; pointerX = 0; pointerY = 0;
    });

    function loop() {
      curRX += (targetRX - curRX) * 0.08;
      curRY += (targetRY - curRY) * 0.08;

      if (scene) {
        scene.style.transform =
          'perspective(1100px) rotateX(' + curRX + 'deg) rotateY(' + curRY + 'deg)';
      }
      /* orbs drift opposite to the pointer for depth (kept additive with scroll) */
      orbs.forEach(function (orb, i) {
        var depth = parseFloat(orb.getAttribute('data-depth')) || (i + 1);
        var sx = -pointerX * depth * 18;
        var sy = -pointerY * depth * 18;
        orb.style.setProperty('--px', sx + 'px');
        orb.style.setProperty('--py', sy + 'px');
        orb.style.transform = 'translate3d(' + sx + 'px,' + (sy + (orb._scrollY || 0)) + 'px, 0)';
      });

      if (Math.abs(targetRX - curRX) < 0.01 && Math.abs(targetRY - curRY) < 0.01 &&
          pointerX === 0 && pointerY === 0) {
        if (scene) scene.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
        active = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    }
  }

  /* ── Mouse-tracked Inner Glow on Cards ── */
  function initCardMouseGlow() {
    document.addEventListener('mousemove', function (e) {
      document.querySelectorAll('.card').forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    }, { passive: true });
  }

  /* ── Hero Orb Scroll Parallax ── */
  /* Stores the scroll offset on each orb; the hero-3D loop combines it with
     pointer offset. When the 3D loop is idle, we apply scroll-only here. */
  function initParallax() {
    if (prefersReduced) return;
    var orbs = document.querySelectorAll('.hero-bg .glow-orb');
    if (!orbs.length) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var y = window.scrollY;
          orbs.forEach(function (orb, i) {
            var speed = (i + 1) * 0.25;
            orb._scrollY = y * speed;
            var px = parseFloat(orb.style.getPropertyValue('--px')) || 0;
            orb.style.transform = 'translate3d(' + px + 'px,' + (orb._scrollY) + 'px,0)';
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Page Hero Grid — add if missing ── */
  function ensurePageHeroGrid() {
    var hero = document.querySelector('.page-hero');
    if (hero && !hero.querySelector('.page-hero-grid')) {
      var grid = document.createElement('div');
      grid.className = 'page-hero-grid';
      hero.insertBefore(grid, hero.firstChild);
    }
  }

  /* ── Hero Name Gradient — applied after stagger animations complete ── */
  function initHeroNameGradient() {
    var heroName = document.querySelector('.hero-name');
    if (!heroName) return;
    var letters = heroName.querySelectorAll('.stagger-letter');
    if (!letters.length) return;

    function applyGradient() {
      letters.forEach(function (l) {
        l.style.animation = 'none';
        l.style.opacity = '1';
        l.style.transform = 'none';
      });
      heroName.querySelectorAll('.word-group').forEach(function (w) {
        w.style.animation = 'none';
      });
      /* background-clip:text only renders when no child animation is running */
      heroName.style.background =
        'linear-gradient(135deg, #93C5FD 0%, #06B6D4 50%, #60A5FA 100%)';
      heroName.style.webkitBackgroundClip = 'text';
      heroName.style.backgroundClip = 'text';
      heroName.style.webkitTextFillColor = 'transparent';
      heroName.style.animation = 'none';
      heroName.style.textShadow = '';
      heroName.style.color = '';
    }

    /* Listen for the last letter's animation to end (most reliable trigger) */
    var lastLetter = letters[letters.length - 1];
    var applied = false;
    function onDone() {
      if (applied) return;
      applied = true;
      applyGradient();
    }
    lastLetter.addEventListener('animationend', onDone, { once: true });

    /* Fallback: compute max delay + duration and use setTimeout */
    var maxDelay = 0;
    letters.forEach(function (l) {
      var d = parseFloat(l.style.animationDelay) || 0;
      if (d > maxDelay) maxDelay = d;
    });
    setTimeout(onDone, (maxDelay + 0.55) * 1000);
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initCursor();
    initCardTilt();
    initCardMouseGlow();
    initParallax();
    initHero3D();
    ensurePageHeroGrid();
    initHeroNameGradient();
  });

})();
