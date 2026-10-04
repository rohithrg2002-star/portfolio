/**
 * Main Application Bootstrap (ES Module)
 */

import { initTheme } from './theme.js';
import { initNavigation } from './nav.js';
import { initThreeBackground } from './three-bg.js';
import { initRender } from './render.js';
import { initCommandPalette } from './palette.js';
import { initTerminal } from './terminal.js';
import { initContactForm } from './contact.js';

let labLoaded = false;

// Safe achievement tracker stub if Lab hasn't loaded yet
if (!window.unlockAchievement) {
  window.unlockAchievement = (id) => {
    try {
      const stored = JSON.parse(localStorage.getItem('alex_carter_achievements') || '[]');
      const set = new Set(stored);
      set.add(id);
      localStorage.setItem('alex_carter_achievements', JSON.stringify([...set]));
    } catch (e) {
      // Safe storage access
    }
  };
}

/**
 * Lazy load Developer Lab controller
 */
export function loadLabModule() {
  if (labLoaded) return Promise.resolve();
  labLoaded = true;
  return import('./playground/lab-controller.js').then(module => {
    module.initLab();
  }).catch(err => {
    console.warn('Failed to lazy load Lab module:', err);
  });
}

// Expose on window so Command Palette and quick links can trigger it
window.loadLabModule = loadLabModule;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme (runs immediately to prevent flash of unstyled content)
  initTheme();

  // 2. Initialize Navigation and Scrollspy
  initNavigation();

  // 3. Render About, Experience, Projects, Skills, and Case Study Modal
  initRender();

  // 4. Initialize Command Palette (Cmd+K / Ctrl+K)
  initCommandPalette();

  // 5. Initialize Interactive Terminal Drawer
  initTerminal();

  // 6. Initialize Contact Form Validation and Submission
  initContactForm();

  // 7. Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 8. Lazy-load Lab module when section approaches viewport
  const labSection = document.getElementById('lab') || document.getElementById('playground');
  if (labSection && 'IntersectionObserver' in window) {
    const labObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadLabModule();
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '300px 0px' });
    labObserver.observe(labSection);
  } else {
    setTimeout(loadLabModule, 2000);
  }

  // 9. Initialize Subtle Background (deferred slightly to prioritize main DOM)
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => initThreeBackground());
  } else {
    setTimeout(initThreeBackground, 100);
  }

  // 10. Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

