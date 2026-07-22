/* ============================================================
   CASE-STUDY.JS — Campaign Screenshots Gallery Engine
   ============================================================ */

(function () {
  'use strict';

  function esc(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderCampaigns() {
    var host = document.getElementById('caseStudyShowcase');
    var campaigns = window.campaignsData || (window.PORTFOLIO_CONFIG ? window.PORTFOLIO_CONFIG.campaigns : []);
    if (!host || !campaigns || !campaigns.length) return;

    // Collect unique categories for filter tabs
    var categories = ['all'];
    campaigns.forEach(function (c) {
      if (c.category && categories.indexOf(c.category) === -1) {
        categories.push(c.category);
      }
    });

    var filterTabsHTML = categories.map(function (cat) {
      var label = cat === 'all' ? 'جميع الحملات (All)' : cat;
      return `<button class="c-tab ${cat === 'all' ? 'active' : ''}" data-filter="${esc(cat)}">${esc(label)}</button>`;
    }).join('');

    var html = `
      <div class="campaigns-showcase">
        <!-- Campaign Filter Tabs -->
        <div class="campaign-filter-tabs">
          ${filterTabsHTML}
        </div>

        <!-- Campaigns List -->
        <div class="campaigns-list">
    `;

    campaigns.forEach(function (campaign) {
      var platformBadges = (campaign.platforms || []).map(function (p) {
        return '<span class="tag tag-platform">' + esc(p) + '</span>';
      }).join('');

      var imagesGrid = (campaign.images || []).map(function (imgObj, idx) {
        var src = typeof imgObj === 'string' ? imgObj : imgObj.src;
        var title = typeof imgObj === 'string' ? 'Campaign Result' : (imgObj.title || 'Campaign Result');
        return `
          <div class="campaign-img-card" data-campaign-id="${esc(campaign.id)}" data-img-index="${idx}">
            <div class="img-wrapper">
              <img src="${esc(src)}" alt="${esc(title)}" loading="lazy">
              <div class="img-overlay">
                <span class="zoom-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                  تكبير الصورة (View Full Screen)
                </span>
              </div>
            </div>
            <div class="img-caption">${esc(title)}</div>
          </div>
        `;
      }).join('');

      html += `
        <div class="campaign-group-card reveal" data-campaign="${esc(campaign.id)}" data-category="${esc(campaign.category)}">
          <div class="campaign-header">
            <div class="campaign-title-area">
              <span class="campaign-category-badge">${esc(campaign.category)}</span>
              <h3 class="campaign-main-title">${esc(campaign.title)}</h3>
              <p class="campaign-sub">${esc(campaign.subtitle)}</p>
            </div>
            <div class="campaign-metric-area">
              <div class="metric-pill">${esc(campaign.keyMetric)}</div>
              <div class="campaign-platforms">${platformBadges}</div>
            </div>
          </div>
          <div class="campaign-images-grid">
            ${imagesGrid}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    host.innerHTML = html;

    bindEvents(host, campaigns);
  }

  function bindEvents(host, campaigns) {
    // Filter Tabs
    var tabs = host.querySelectorAll('.c-tab');
    var groups = host.querySelectorAll('.campaign-group-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter');
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        groups.forEach(function (group) {
          var groupCat = group.getAttribute('data-category');
          if (filter === 'all' || groupCat === filter) {
            group.style.display = 'block';
            group.classList.add('revealed');
          } else {
            group.style.display = 'none';
          }
        });
      });
    });

    // Image Click -> Open Lightbox
    host.querySelectorAll('.campaign-img-card').forEach(function (card) {
      card.addEventListener('click', function () {
        var campaignId = card.getAttribute('data-campaign-id');
        var imgIdx = parseInt(card.getAttribute('data-img-index'), 10) || 0;

        var targetCampaign = campaigns.find(function (c) { return c.id === campaignId; });
        if (targetCampaign && targetCampaign.images && window.openLightbox) {
          window.openLightbox(targetCampaign.images, imgIdx);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCampaigns);
  } else {
    renderCampaigns();
  }

})();
