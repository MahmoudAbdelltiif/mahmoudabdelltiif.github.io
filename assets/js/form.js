/* ============================================================
   FORM.JS — Contact Form + Formspree Integration
   ============================================================ */

(function() {
  'use strict';

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
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message) {
        form.classList.add('form-error');
        setTimeout(function() { form.classList.remove('form-error'); }, 500);
        return;
      }

      if (message.length < 20) {
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

      // Submit to Formspree (replace YOUR_FORM_ID)
      const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxVpyjqelpr2VdX7dpriQYGVVn1R2Gx5LTf0WiwTzHfxXZLt6QQjYhlw3lSj1ik9fZG6Q/exec';

      fetch(formAction, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function(response) {
        if (response.ok) {
          // Show success
          form.innerHTML = '<div class="form-success"><div class="success-icon">&#10003;</div><h3>Message Sent!</h3><p>Thanks for reaching out. I\'ll be in touch soon.</p></div>';

          if (typeof trackEvent === 'function') {
            trackEvent('contact_form_success', {
              service_type: serviceSelect ? serviceSelect.value : '',
              budget_range: budgetSelect ? budgetSelect.value : ''
            });
          }
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function() {
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
