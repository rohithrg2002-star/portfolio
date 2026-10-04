/**
 * Accessible Modal Controller
 * Handles Case Study dialog with focus trapping, ESC key listener, and focus restoration.
 */

let activeModal = null;
let previousActiveElement = null;

export function openModal(modalElement, triggerElement = null) {
  if (!modalElement) return;

  previousActiveElement = triggerElement || document.activeElement;
  activeModal = modalElement;

  modalElement.classList.add('open');
  modalElement.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Find first focusable element inside modal
  const focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) {
    focusable[0].focus();
  }

  document.addEventListener('keydown', handleModalKeyDown);
}

export function closeModal() {
  if (!activeModal) return;

  activeModal.classList.remove('open');
  activeModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  document.removeEventListener('keydown', handleModalKeyDown);

  // Return focus to trigger element for accessibility
  if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
    previousActiveElement.focus();
  }

  activeModal = null;
  previousActiveElement = null;
}

function handleModalKeyDown(e) {
  if (!activeModal) return;

  if (e.key === 'Escape') {
    closeModal();
    return;
  }

  // Focus trap
  if (e.key === 'Tab') {
    const focusable = activeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

/**
 * Initialize global modal close listeners
 */
export function initModalListeners() {
  document.addEventListener('click', (e) => {
    // Backdrop click
    if (e.target.classList.contains('modal-backdrop')) {
      closeModal();
    }
    // Close button click
    if (e.target.closest('[data-modal-close]')) {
      closeModal();
    }
  });
}
