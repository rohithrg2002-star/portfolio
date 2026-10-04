/**
 * Theme Manager: Dark/Light Mode with System Preference & Safe Web Storage
 */

const STORAGE_KEY = 'alex_carter_theme';
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

/**
 * Safely read theme from localStorage
 */
function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

/**
 * Safely store theme to localStorage
 */
function setStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {
    // Ignore storage quota or security errors in private browsing
  }
}

/**
 * Determine the initial theme preference
 */
export function getInitialTheme() {
  const stored = getStoredTheme();
  if (stored === THEME_DARK || stored === THEME_LIGHT) {
    return stored;
  }
  // Default to system preference, fallback to dark
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return THEME_LIGHT;
  }
  return THEME_DARK;
}

/**
 * Apply the theme to document and update meta theme-color
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);

  // Update theme-color meta tag for mobile browser address bars
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', theme === THEME_DARK ? '#090d16' : '#f8fafc');

  // Update toggle button aria label if present
  const toggleBtn = document.querySelector('.theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === THEME_DARK ? 'light' : 'dark'} mode`);
  }
}

/**
 * Initialize theme listeners
 */
export function initTheme() {
  const currentTheme = getInitialTheme();
  applyTheme(currentTheme);

  // Bind click listener to theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') || THEME_DARK;
      const nextTheme = active === THEME_DARK ? THEME_LIGHT : THEME_DARK;
      applyTheme(nextTheme);
      setStoredTheme(nextTheme);
    });
  });

  // Listen to OS theme changes if user has not set an explicit override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT);
      }
    });
  }
}
