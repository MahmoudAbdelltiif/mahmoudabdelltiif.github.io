/* ============================================================
   FORM.JS — Contact Form + Google Sheets Integration
   ============================================================
   
   HOW TO CONNECT TO GOOGLE SHEETS:
   ─────────────────────────────
   1. Create a new Google Sheet
   2. Add headers in row 1: Timestamp | Name | Email | Service | Budget | Message | Page
   3. Go to Extensions → Apps Script
   4. Paste this code:
   
      function doPost(e) {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);
        sheet.appendRow([
          new Date(),
          data.name,
          data.email,
          data.service,
          data.budget,
          data.message,
          data.page
        ]);
        return ContentService
          .createTextOutput(JSON.stringify({ result: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
   
   5. Click Deploy → New deployment → Web app
   6. Execute as: Me | Who has access: Anyone
   7. Copy the URL and paste it below in GOOGLE_SHEETS_URL
   
   ============================================================ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  // 🔗 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  // ═══════════════════════════════════════════════
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
  // ═══════════════════════════════════════════════

  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    let formStarted = false;

    // Track first field focus
    form.addEventListener('focusin', function() {
      if (!formStarted) {
        formStarted = true;
        if (typeof trackEvent === 'function') {
          trackEvent('contact_form_start', {});
        }
      }
    }, { once: true });

    // Track service/budget selects
    const serviceSelect = form.querySelector('[name="service"]');
    const budgetSelect = form.querySelector('[name="budget"]');

    if (serviceSelect) {
      serviceSelect.addEventListener('change', function() {
        if (typeof trackEvent === 'function') {
          trackEvent('contact_form_service_select', { service_type: serviceSelect.value });
        }
      });
    }

    if (budgetSelect) {
      budgetSelect.addEventListener('change', function() {
        if (typeof trackEvent === 'function') {
          trackEvent('contact_form_budget_select', { budget_range: budgetSelect.value });
        }
      });
    }

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.btn-primary');
      const btnContent = submitBtn.querySelector('.btn-content');

      // Validation
      const nameVal = form.querySelector('[name="name"]').value.trim();
      const emailVal = form.querySelector('[name="email"]').value.trim();
      const messageVal = form.querySelector('[name="message"]').value.trim();

      if (!nameVal || !emailVal || !messageVal) {
        form.classList.add('form-error');
        setTimeout(function() { form.classList.remove('form-error'); }, 500);
        return;
      }

      if (messageVal.length < 20) {
        form.classList.add('form-error');
        setTimeout(function() { form.classList.remove('form-error'); }, 500);
        return;
      }

      // Show loading state
      if (btnContent) {
        btnContent.innerHTML = '<span class="spinner"></span> Sending...';
      }
      submitBtn.disabled = true;

      if (typeof trackEvent === 'function') {
        trackEvent('contact_form_submit', {
          service_type: serviceSelect ? serviceSelect.value : '',
          budget_range: budgetSelect ? budgetSelect.value : ''
        });
      }

      // Build data object for Google Sheets
      const formData = {
        name: nameVal,
        email: emailVal,
        service: serviceSelect ? serviceSelect.value : '',
        budget: budgetSelect ? budgetSelect.value : '',
        message: messageVal,
        page: window.location.pathname
      };

      // Submit to Google Sheets via Apps Script Web App
      fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'text/plain' }
      })
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.result === 'success') {
          // Show success
          form.innerHTML = '<div class="form-success"><div class="success-icon">&#10003;</div><h3>Message Sent!</h3><p>Thanks for reaching out. I\'ll be in touch soon.</p></div>';

          if (typeof trackEvent === 'function') {
            trackEvent('contact_form_success', {
              service_type: formData.service,
              budget_range: formData.budget
            });
          }
        } else {
          throw new Error('Google Sheets returned error');
        }
      })
      .catch(function(error) {
        console.error('Form submission error:', error);
        
        // Show error state
        if (btnContent) {
          btnContent.innerHTML = 'Send Message &#8594;';
        }
        submitBtn.disabled = false;
        form.classList.add('form-error');
        setTimeout(function() { form.classList.remove('form-error'); }, 500);

        if (typeof trackEvent === 'function') {
          trackEvent('contact_form_error', { error_type: 'network_error' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }

})();
