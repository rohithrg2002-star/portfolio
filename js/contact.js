/**
 * Contact Form Controller (Accessible Validation & Feedback States)
 */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const successState = document.getElementById('contact-success-state');
  const resetBtn = document.getElementById('contact-reset-btn');

  if (!form) return;

  const fields = {
    name: {
      input: document.getElementById('contact-name'),
      error: document.getElementById('error-name'),
      validate: (val) => val.trim().length >= 2 ? null : 'Please enter your name (at least 2 characters).'
    },
    email: {
      input: document.getElementById('contact-email'),
      error: document.getElementById('error-email'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim()) return 'Email address is required.';
        if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
        return null;
      }
    },
    subject: {
      input: document.getElementById('contact-subject'),
      error: document.getElementById('error-subject'),
      validate: (val) => val.trim() ? null : 'Please select an inquiry topic.'
    },
    message: {
      input: document.getElementById('contact-message'),
      error: document.getElementById('error-message'),
      validate: (val) => val.trim().length >= 10 ? null : 'Message must be at least 10 characters long.'
    }
  };

  // Real-time blur validation
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (!field.input) return;

    field.input.addEventListener('blur', () => {
      validateField(field);
    });

    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true') {
        validateField(field);
      }
    });
  });

  function validateField(field) {
    if (!field.input || !field.error) return true;
    const errorMsg = field.validate(field.input.value);

    if (errorMsg) {
      field.input.setAttribute('aria-invalid', 'true');
      field.error.textContent = errorMsg;
      field.error.style.display = 'block';
      return false;
    } else {
      field.input.removeAttribute('aria-invalid');
      field.error.textContent = '';
      field.error.style.display = 'none';
      return true;
    }
  }

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let firstInvalidField = null;

    Object.keys(fields).forEach(key => {
      const field = fields[key];
      const valid = validateField(field);
      if (!valid) {
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field.input;
      }
    });

    if (!isValid) {
      firstInvalidField?.focus();
      return;
    }

    // Submit state: loading indicator
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML || 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Sending Message...</span>
      `;
    }

    // Simulate reliable dispatch
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      form.style.display = 'none';
      if (successState) {
        successState.style.display = 'block';
        successState.setAttribute('tabindex', '-1');
        successState.focus();
      }

      // Track achievement quietly if available
      if (window.unlockAchievement) {
        window.unlockAchievement('terminal-explorer');
      }
    }, 800);
  });

  // Reset Form for New Message
  resetBtn?.addEventListener('click', () => {
    form.reset();
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) field.input.removeAttribute('aria-invalid');
      if (field.error) {
        field.error.textContent = '';
        field.error.style.display = 'none';
      }
    });

    if (successState) successState.style.display = 'none';
    form.style.display = 'block';
    fields.name.input?.focus();
  });
}
