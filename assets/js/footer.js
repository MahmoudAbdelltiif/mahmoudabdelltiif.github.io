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
        sheet.appendRow([
          new Date(),
          e.parameter.name,
          e.parameter.email,
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
   7. Copy the URL and paste it below in GOOGLE_SHEETS_URL
   
   IMPORTANT: If you update the script, you MUST create a NEW deployment
   (not just update the existing one) for changes to take effect.

   ============================================================ */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
  // ═══════════════════════════════════════════════
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxVpyjqelpr2VdX7dpriQYGVVn1R2Gx5LTf0WiwTzHfxXZLt6QQjYhlw3lSj1ik9fZG6Q/exec';
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

      if (messageVal.length < 10) {
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

      // Build data for Google Sheets
      var formData = {
        name: nameVal,
        email: emailVal,
        service: serviceSelect ? serviceSelect.value : '',
        budget: budgetSelect ? budgetSelect.value : '',
        message: messageVal,
        page: window.location.pathname
      };

      // Submit using hidden iframe method (avoids CORS issues completely)
      submitViaHiddenIframe(formData, function(success) {
        if (success) {
          form.innerHTML = '<div class="form-success"><div class="success-icon">&#10003;</div><h3>Message Sent!</h3><p>Thanks for reaching out. I\'ll be in touch soon.</p></div>';

          if (typeof trackEvent === 'function') {
            trackEvent('contact_form_success', {
              service_type: formData.service,
              budget_range: formData.budget
            });
          }
        } else {
          // Show error state
          if (btnContent) {
            btnContent.innerHTML = 'Send Message &#8594;';
          }
          submitBtn.disabled = false;
          form.classList.add('form-error');
          setTimeout(function() { form.classList.remove('form-error'); }, 500);

          if (typeof trackEvent === 'function') {
            trackEvent('contact_form_error', { error_type: 'submission_failed' });
          }
        }
      });
    });
  }

  /**
   * Submit form data to Google Apps Script using a hidden iframe.
   * This method completely avoids CORS issues because it's a standard
   * form submission, not a fetch/XHR request.
   */
  function submitViaHiddenIframe(data, callback) {
    // Create or reuse hidden iframe
    var iframeId = 'google-form-iframe';
    var iframe = document.getElementById(iframeId);
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    // Create a hidden form
    var hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = GOOGLE_SHEETS_URL;
    hiddenForm.target = iframeId;

    // Add each field as a hidden input
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        hiddenForm.appendChild(input);
      }
    }

    // Append form to body, submit it, then remove it
    document.body.appendChild(hiddenForm);

    // Set a timeout to detect if the submission went through
    var submitted = false;

    iframe.onload = function() {
      submitted = true;
      // Clean up
      document.body.removeChild(hiddenForm);
      callback(true);
    };

    iframe.onerror = function() {
      submitted = true;
      document.body.removeChild(hiddenForm);
      callback(false);
    };

    hiddenForm.submit();

    // Fallback: if iframe doesn't fire onload within 5 seconds,
    // assume success (Google Apps Script redirects which may not trigger iframe onload)
    setTimeout(function() {
      if (!submitted) {
        if (document.body.contains(hiddenForm)) {
          document.body.removeChild(hiddenForm);
        }
        callback(true);
      }
    }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm);
  } else {
    initForm();
  }

})();
