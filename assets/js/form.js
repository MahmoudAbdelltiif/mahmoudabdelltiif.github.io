/* ============================================================
   FORM.JS — Contact Form + Google Sheets Integration
   ============================================================
   
   HOW TO CONNECT TO GOOGLE SHEETS:
   ─────────────────────────────
   1. Create a new Google Sheet
   2. Add headers in row 1: Timestamp | Name | Email | Phone | Service | Budget | Message | Page
   3. Go to Extensions → Apps Script
   4. Paste this code:

      function doPost(e) {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        sheet.appendRow([
          new Date(),
          e.parameter.name,
          e.parameter.email,
          e.parameter.phone,
          e.parameter.service,
          e.parameter.budget,
          e.parameter.message,
          e.parameter.page
        ]);
        return ContentService
          .createTextOutput(JSON.stringify({ result: "success" }))
          .setMimeType(ContentService.MimeType.JSON);
      }

   5. Click Deploy → New deployment → Web app
   6. Execute as: Me | Who has access: Anyone
   7. Click Deploy and copy the URL
   8. Paste the URL below in GOOGLE_SHEETS_URL

   IMPORTANT: 
   - If you update the script, you MUST create a NEW deployment
   - You CANNOT test doPost by clicking "Run" in the editor
   - To test, open this URL in browser with ?name=Test&email=test@test.com&message=hello
   
   ============================================================ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  // ═══════════════════════════════════════════════
  var GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwHShHzSX4NbTsZMD53U084DG6ySvzjpo84Cce_fXjy_OYOPu6GvHc5JoOnW3c_jhEExw/exec';
  // ═══════════════════════════════════════════════

  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var formStarted = false;

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
    var serviceSelect = form.querySelector('[name="service"]');
    var budgetSelect = form.querySelector('[name="budget"]');

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

    // Create hidden iframe for form submission
    var iframe = document.createElement('iframe');
    iframe.name = 'hidden-form-iframe';
    iframe.id = 'hidden-form-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var submitBtn = form.querySelector('.btn-primary');
      var btnContent = submitBtn.querySelector('.btn-content');

      // Validation
      var nameVal = form.querySelector('[name="name"]').value.trim();
      var emailVal = form.querySelector('[name="email"]').value.trim();
      var phoneVal = form.querySelector('[name="phone"]').value.trim();
      var messageVal = form.querySelector('[name="message"]').value.trim();

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

      // Add hidden page field
      var pageInput = form.querySelector('[name="page"]');
      if (!pageInput) {
        pageInput = document.createElement('input');
        pageInput.type = 'hidden';
        pageInput.name = 'page';
        form.appendChild(pageInput);
      }
      pageInput.value = window.location.pathname;

      // Set form to submit to Google Sheets via hidden iframe
      form.action = GOOGLE_SHEETS_URL;
      form.target = 'hidden-form-iframe';
      form.method = 'POST';

      // Show success after delay (iframe submission doesn't give reliable callbacks)
      setTimeout(function() {
        form.innerHTML = '<div class="form-success"><div class="success-icon">&#10003;</div><h3>Message Sent!</h3><p>Thanks for reaching out. I\'ll be in touch soon.</p></div>';

        if (typeof trackEvent === 'function') {
          trackEvent('contact_form_success', {
            service_type: serviceSelect ? serviceSelect.value : '',
            budget_range: budgetSelect ? budgetSelect.value : ''
          });
        }
      }, 2000);

      // Submit the form natively
      form.submit();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }

})();
