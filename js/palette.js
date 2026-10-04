/**
 * Command Palette Controller (Cmd+K / Ctrl+K)
 * Accessible dialog with fuzzy search, keyboard navigation, and direct actions.
 */

import { getActiveFeatureFlags } from '../data/content.js';

export function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const searchInput = document.getElementById('palette-search-input');
  const resultsList = document.getElementById('palette-results-list');
  const toggleBtn = document.getElementById('palette-toggle');

  if (!palette || !searchInput || !resultsList) return;

  const flags = getActiveFeatureFlags();
  if (flags?.features && flags.features.commandPalette === false) {
    if (toggleBtn) toggleBtn.style.display = 'none';
    palette.style.display = 'none';
    return;
  }

  const rawActions = [
    { id: 'about', title: 'Go to About Me', category: 'Navigation', icon: 'user', action: () => scrollTo('#about'), section: 'about' },
    { id: 'experience', title: 'View Work Experience', category: 'Navigation', icon: 'briefcase', action: () => scrollTo('#experience'), section: 'experience' },
    { id: 'projects', title: 'View Featured Systems & Case Studies', category: 'Navigation', icon: 'folder', action: () => scrollTo('#projects'), section: 'projects' },
    { id: 'skills', title: 'View Technical Skills Matrix', category: 'Navigation', icon: 'code-2', action: () => scrollTo('#skills'), section: 'skills' },
    { id: 'lab', title: 'Open Developer Lab (Sandboxes & Simulators)', category: 'Lab', icon: 'flask-conical', section: 'lab', action: () => {
      scrollTo('#lab');
      if (window.loadLabModule) window.loadLabModule();
    }},
    { id: 'terminal', title: 'Open Interactive CLI Drawer', category: 'Tools', icon: 'terminal', shortcut: '`', action: () => {
      const btn = document.getElementById('terminal-toggle');
      btn?.click();
    }},
    { id: 'admin', title: 'Open Admin Dashboard (Content & Toggles)', category: 'Admin', icon: 'settings', shortcut: '⌘A', action: () => {
      window.location.href = 'admin.html';
    }},
    { id: 'resume', title: 'Download Resume (PDF)', category: 'Documents', icon: 'download', shortcut: '⌘D', action: () => {
      const link = document.createElement('a');
      link.href = 'assets/resume.pdf';
      link.download = 'Alex_Carter_Resume.pdf';
      link.click();
    }},
    { id: 'theme', title: 'Toggle Theme (Dark / Light)', category: 'Preferences', icon: 'sun-moon', action: () => {
      const btn = document.getElementById('theme-toggle');
      btn?.click();
    }},
    { id: 'contact', title: 'Get in Touch (Contact Form)', category: 'Navigation', icon: 'mail', action: () => scrollTo('#contact'), section: 'contact' },
    { id: 'github', title: 'Open GitHub Profile', category: 'External', icon: 'github', action: () => window.open('https://github.com', '_blank') }
  ];

  // Filter actions based on enabled sections
  const actions = rawActions.filter(a => {
    if (a.section && flags.sections && flags.sections[a.section] === false) {
      return false;
    }
    return true;
  });


  let selectedIndex = 0;
  let filteredActions = [...actions];
  let previousActiveElement = null;

  function scrollTo(selector) {
    const el = document.querySelector(selector);
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  function openPalette() {
    previousActiveElement = document.activeElement;
    palette.classList.add('open');
    palette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    searchInput.value = '';
    filteredActions = [...actions];
    selectedIndex = 0;
    renderResults();

    setTimeout(() => searchInput.focus(), 50);

    // Track achievement quietly
    if (window.unlockAchievement) {
      window.unlockAchievement('keyboard-ninja');
    }
  }

  function closePalette() {
    palette.classList.remove('open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  function renderResults() {
    resultsList.innerHTML = '';

    if (!filteredActions.length) {
      resultsList.innerHTML = `<div class="palette-empty-state">No commands matching "${searchInput.value}"</div>`;
      return;
    }

    filteredActions.forEach((item, idx) => {
      const isSelected = idx === selectedIndex;
      const el = document.createElement('div');
      el.className = `palette-item ${isSelected ? 'selected' : ''}`;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      el.id = `palette-opt-${item.id}`;

      el.innerHTML = `
        <div class="palette-item-left">
          <i data-lucide="${item.icon}" class="palette-item-icon"></i>
          <div>
            <div class="palette-item-title">${item.title}</div>
            <div class="palette-item-category">${item.category}</div>
          </div>
        </div>
        ${item.shortcut ? `<span class="palette-item-kbd">${item.shortcut}</span>` : ''}
      `;

      el.addEventListener('click', () => {
        closePalette();
        item.action();
      });

      resultsList.appendChild(el);
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Scroll active item into view
    const selectedEl = resultsList.querySelector('.palette-item.selected');
    selectedEl?.scrollIntoView({ block: 'nearest' });
  }

  // Keyboard navigation inside Palette
  palette.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePalette();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredActions.length;
      renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredActions.length) % filteredActions.length;
      renderResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        const actionToRun = filteredActions[selectedIndex].action;
        closePalette();
        actionToRun();
      }
    }
  });

  // Search input filter
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      filteredActions = [...actions];
    } else {
      filteredActions = actions.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.category.toLowerCase().includes(query)
      );
    }
    selectedIndex = 0;
    renderResults();
  });

  // Global shortcut (Cmd+K / Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  toggleBtn?.addEventListener('click', openPalette);

  // Close when clicking outside dialog
  palette.addEventListener('click', (e) => {
    if (e.target === palette) {
      closePalette();
    }
  });
}
