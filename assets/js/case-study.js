/* ============================================================
   CASE-STUDY.JS — Standalone 3D Project Cards Engine
   Shows Category, Key Metric, Platforms & Screenshot Gallery
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

    var html = `
      <div class="campaigns-showcase-standalone">
        <div class="campaigns-list">
    `;

    campaigns.forEach(function (campaign) {
      var platformBadges = (campaign.platforms || []).map(function (p) {
        return '<span class="tag tag-platform">' + esc(p) + '</span>';
      }).join('');

      var categoryBadge = campaign.category ? '<span class="campaign-category-badge">' + esc(campaign.category) + '</span>' : '';
      var metricPill = campaign.keyMetric ? '<div class="metric-pill">' + esc(campaign.keyMetric) + '</div>' : '';

      var imagesGrid = (campaign.images || []).map(function (imgObj, idx) {
        var src = typeof imgObj === 'string' ? imgObj : imgObj.src;
        return `
          <div class="campaign-img-card" data-campaign-id="${esc(campaign.id)}" data-img-index="${idx}">
            <div class="img-wrapper">
              <img src="${esc(src)}" alt="Campaign Result Screenshot" loading="lazy">
              <div class="img-overlay">
                <span class="zoom-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6M8 11h6"/></svg>
                  تكبير الصورة (View Full Screen)
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      html += `
        <div class="campaign-group-card revealed" data-campaign="${esc(campaign.id)}">
          <div class="campaign-header">
            <div class="campaign-title-area">
              ${categoryBadge}
            </div>
            <div class="campaign-metric-area">
              ${metricPill}
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
