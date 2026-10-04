/**
 * Navigation Manager: Sticky Header, Mobile Drawer, Focus Trap, and Scrollspy
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileClose = document.querySelector('.mobile-drawer-close');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.querySelector('.back-to-top');

  // Sticky header border on scroll
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  function openDrawer() {
    if (!mobileOverlay || !mobileDrawer) return;
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    mobileClose?.focus();
    document.addEventListener('keydown', handleDrawerKeyDown);
  }

  function closeDrawer() {
    if (!mobileOverlay || !mobileDrawer) return;
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
    mobileToggle?.focus();
    document.removeEventListener('keydown', handleDrawerKeyDown);
  }

  function handleDrawerKeyDown(e) {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }

    // Accessible Focus Trap within mobile drawer
    if (e.key === 'Tab') {
      const focusable = mobileDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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

  mobileToggle?.addEventListener('click', openDrawer);
  mobileClose?.addEventListener('click', closeDrawer);
  mobileOverlay?.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) closeDrawer();
  });

  // Close drawer when clicking mobile nav links
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Back to top button
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ScrollSpy: highlight active section in navbar
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }
}
