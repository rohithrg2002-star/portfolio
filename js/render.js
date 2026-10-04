/**
 * Content Hydration, Feature Flag Dispatcher, and Case Study Modal Controller
 * Renders dynamically from getActiveContent() and honors getActiveFeatureFlags()
 */

import { getActiveContent, getActiveFeatureFlags } from '../data/content.js';
import { openModal, closeModal, initModalListeners } from './modal.js';

export function initRender() {
  const content = getActiveContent();
  const flags = getActiveFeatureFlags();

  renderHero(content);
  renderAbout(content);
  renderExperience(content);
  renderProjects(content);
  renderSkills(content);
  renderWriting(content);
  renderOpenSource(content);
  renderContactInfo(content);
  renderGithubCalendar();

  applyFeatureFlags(flags);

  initModalListeners();
  setupCaseStudyModal();
}

/**
 * Apply Section and Feature Visibility Flags
 */
export function applyFeatureFlags(flags) {
  if (!flags) return;

  // 1. Section Level Toggles
  const sectionMap = {
    hero: document.getElementById('hero'),
    about: document.getElementById('about'),
    experience: document.getElementById('experience'),
    projects: document.getElementById('projects'),
    skills: document.getElementById('skills'),
    lab: document.getElementById('lab'),
    writing: document.getElementById('writing'),
    contact: document.getElementById('contact')
  };

  Object.entries(flags.sections || {}).forEach(([secId, isEnabled]) => {
    const el = sectionMap[secId];
    if (el) {
      el.style.display = isEnabled ? '' : 'none';
    }

    // Also update navigation links
    const desktopLinks = document.querySelectorAll(`.desktop-nav a[href="#${secId}"]`);
    const mobileLinks = document.querySelectorAll(`.mobile-nav-link[href="#${secId}"]`);
    desktopLinks.forEach(link => { link.style.display = isEnabled ? '' : 'none'; });
    mobileLinks.forEach(link => {
      const parentLi = link.closest('li');
      if (parentLi) parentLi.style.display = isEnabled ? '' : 'none';
    });
  });

  // 2. Feature Level Toggles
  if (flags.features) {
    // Three.js Background Canvas
    const canvas = document.getElementById('hero-three-canvas');
    if (canvas) canvas.style.display = flags.features.threeBackground ? '' : 'none';

    // Command Palette Trigger
    const palTrigger = document.getElementById('palette-toggle');
    if (palTrigger) palTrigger.style.display = flags.features.commandPalette ? '' : 'none';

    // Terminal Drawer Trigger
    const termTrigger = document.getElementById('terminal-toggle');
    if (termTrigger) termTrigger.style.display = flags.features.terminalDrawer ? '' : 'none';

    // Availability Badge Pill
    const availBadge = document.querySelector('.hero-status-pill');
    if (availBadge) availBadge.style.display = flags.features.availabilityBadge ? '' : 'none';

    // Theme Switcher Toggle
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.style.display = flags.features.themeToggle ? '' : 'none';

    // Resume Download Buttons
    const resumeLinks = document.querySelectorAll('a[download][href*="resume"]');
    resumeLinks.forEach(a => { a.style.display = flags.features.resumeDownload ? '' : 'none'; });

    // Case Study Buttons
    const caseStudyBtns = document.querySelectorAll('.case-study-btn');
    caseStudyBtns.forEach(btn => { btn.style.display = flags.features.caseStudyModal ? '' : 'none'; });
  }

  // 3. Lab Module Toggles
  if (flags.labModules) {
    const labModuleMap = {
      bugHunt: { tab: '.playground-tab[data-tab="bug-hunt"]', panel: '#panel-bug-hunt' },
      apiPlayground: { tab: '.playground-tab[data-tab="api-playground"]', panel: '#panel-api-playground' },
      erpSandbox: { tab: '.playground-tab[data-tab="erp-sandbox"]', panel: '#panel-erp-sandbox' },
      gitTimeline: { tab: '.playground-tab[data-tab="git-timeline"]', panel: '#panel-git-timeline' },
      howIDebug: { tab: '.playground-tab[data-tab="how-i-debug"]', panel: '#panel-how-i-debug' },
      pipelineSimulator: { tab: '.playground-tab[data-tab="pipeline-simulator"]', panel: '#panel-pipeline-simulator' }
    };

    let firstVisibleTab = null;
    let activeTabHidden = false;

    Object.entries(flags.labModules).forEach(([modKey, isEnabled]) => {
      const config = labModuleMap[modKey];
      if (!config) return;

      const tabEl = document.querySelector(config.tab);
      const panelEl = document.querySelector(config.panel);

      if (tabEl) {
        tabEl.style.display = isEnabled ? '' : 'none';
        if (isEnabled && !firstVisibleTab) firstVisibleTab = tabEl;
        if (!isEnabled && tabEl.classList.contains('active')) activeTabHidden = true;
      }
      if (panelEl) {
        if (!isEnabled) {
          panelEl.style.display = 'none';
          panelEl.classList.remove('active');
        }
      }
    });

    // If currently active tab was hidden, switch to first visible tab
    if (activeTabHidden && firstVisibleTab) {
      firstVisibleTab.click();
    }
  }
}

/**
 * Render Hero Section
 */
function renderHero(content) {
  const { profile, hero } = content;
  if (!hero) return;

  const titleEl = document.querySelector('.hero-title');
  if (titleEl && profile.name) titleEl.textContent = profile.name;

  const logoEls = document.querySelectorAll('.site-logo span:first-child');
  logoEls.forEach(el => { if (profile.name) el.textContent = profile.name; });

  const roleTag = document.querySelector('.logo-tag');
  if (roleTag && profile.roleTag) roleTag.textContent = profile.roleTag;

  const badgeText = document.querySelector('.hero-status-pill .badge');
  if (badgeText && profile.availability) {
    badgeText.innerHTML = `
      <span class="status-indicator"></span>
      ${profile.availability}
    `;
  }

  const valuePropEl = document.querySelector('.hero-value-prop');
  if (valuePropEl && hero.valueProp) valuePropEl.textContent = hero.valueProp;

  const summaryEl = document.querySelector('.hero-summary');
  if (summaryEl && hero.summary) summaryEl.textContent = hero.summary;

  // Social Links in Hero
  const githubLink = document.querySelector('.hero-socials a[href*="github"]');
  if (githubLink && profile.github) githubLink.href = profile.github;

  const linkedinLink = document.querySelector('.hero-socials a[href*="linkedin"]');
  if (linkedinLink && profile.linkedin) linkedinLink.href = profile.linkedin;

  const mailLink = document.querySelector('.hero-socials a[href^="mailto:"]');
  if (mailLink && profile.email) {
    mailLink.href = `mailto:${profile.email}`;
    const span = mailLink.querySelector('span');
    if (span) span.textContent = profile.email;
  }
}

/**
 * Render About Section
 */
function renderAbout(content) {
  const container = document.getElementById('about-content');
  if (!container || !content.about) return;

  const { paragraphs, stats } = content.about;
  const bioHtml = (paragraphs || []).map(p => `<p>${p}</p>`).join('');

  const statsHtml = (stats || []).map(s => `
    <div class="stat-card">
      <div class="stat-value">
        ${s.value}${s.unit ? `<span class="stat-unit">${s.unit}</span>` : ''}
      </div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-detail">${s.detail}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="about-grid">
      <div class="about-bio">
        ${bioHtml}
        <div style="margin-top: var(--space-4); display: flex; flex-wrap: wrap; gap: var(--space-4); font-size: var(--text-sm); color: var(--text-muted);">
          <span><strong>Location:</strong> ${content.profile?.location || ''}</span>
          <span><strong>Availability:</strong> ${content.profile?.availability || ''}</span>
        </div>
      </div>
      <div class="about-stats-grid">
        ${statsHtml}
      </div>
    </div>
  `;
}

/**
 * Render Experience Section
 */
function renderExperience(content) {
  const container = document.getElementById('experience-list');
  if (!container || !content.experience) return;

  const itemsHtml = content.experience.map(exp => `
    <div class="timeline-item">
      <div class="timeline-period">${exp.period}</div>
      <div class="timeline-content">
        <header class="timeline-header">
          <div>
            <h3 class="timeline-role">${exp.role} <span class="timeline-company">@ ${exp.company}</span></h3>
          </div>
          <span class="timeline-location">${exp.location}</span>
        </header>
        <ul class="timeline-bullets">
          ${(exp.bullets || []).map(b => `<li class="timeline-bullet">${b}</li>`).join('')}
        </ul>
        <div class="timeline-skills">
          ${(exp.skills || []).map(s => `<span class="tech-chip">${s}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="timeline-container">
      ${itemsHtml}
    </div>
  `;
}

/**
 * Render Featured Projects
 */
function renderProjects(content) {
  const container = document.getElementById('projects-grid');
  if (!container || !content.projects) return;

  const cardsHtml = content.projects.map(proj => `
    <article class="project-card" data-project-id="${proj.id}">
      <div class="project-thumb-box">
        <img src="${proj.thumbnail}" alt="${proj.title}" class="project-thumb-img" loading="lazy" width="600" height="338" onerror="this.src='assets/images/profile.jpg'">
        ${proj.badge ? `<span class="badge badge-accent project-badge-tag">${proj.badge}</span>` : ''}
      </div>
      <div class="project-card-body">
        <div class="project-meta-line">
          <span class="project-category">${proj.category}</span>
          <span class="project-role-chip">${proj.role}</span>
        </div>
        <h3 class="project-card-title">${proj.title}</h3>
        <p class="project-card-summary">${proj.summary}</p>
        <div class="project-outcome-box">
          <i data-lucide="check-circle-2"></i>
          <span>${proj.outcome}</span>
        </div>
        <div class="project-card-tags">
          ${(proj.tags || []).map(t => `<span class="tech-chip">${t}</span>`).join('')}
        </div>
        <footer class="project-card-footer">
          <button class="btn btn-sm btn-primary case-study-btn" data-project="${proj.id}" aria-haspopup="dialog">
            <span>Case Study</span>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </button>
          <a href="${proj.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-ghost btn-icon" aria-label="View ${proj.title} on GitHub" title="View Source on GitHub">
            <i data-lucide="github"></i>
          </a>
        </footer>
      </div>
    </article>
  `).join('');

  container.innerHTML = cardsHtml;
}

/**
 * Render Skills Section
 */
function renderSkills(content) {
  const container = document.getElementById('skills-container');
  if (!container || !content.skills) return;

  const categoryIcons = {
    "ERP & Business Systems": "layers",
    "Backend & Architecture": "server",
    "Cloud & DevOps": "cloud",
    "Frontend & UI": "layout",
    "Engineering Practices": "cpu"
  };

  const categoriesHtml = Object.entries(content.skills).map(([category, skills]) => `
    <div class="skills-category-card">
      <h3 class="skills-category-title">
        <i data-lucide="${categoryIcons[category] || 'code-2'}"></i>
        <span>${category}</span>
      </h3>
      <div class="skills-chips-wrap">
        ${(skills || []).map(s => `<span class="tech-chip">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="skills-categories-grid">
      ${categoriesHtml}
    </div>
  `;
}

/**
 * Render Writing Section
 */
function renderWriting(content) {
  const blogGrid = document.querySelector('#writing .blog-grid');
  if (!blogGrid || !content.writing) return;

  const articlesHtml = content.writing.map(art => `
    <article class="blog-card" tabindex="0">
      <span class="blog-date">${art.date}</span>
      <h3 class="blog-card-title">${art.title}</h3>
      <p class="blog-card-excerpt">${art.excerpt}</p>
      <a href="${art.link || '#'}" class="blog-read-more">Read Architecture Notes <i data-lucide="arrow-right"></i></a>
    </article>
  `).join('');

  blogGrid.innerHTML = articlesHtml;
}

/**
 * Render Open Source Section
 */
function renderOpenSource(content) {
  if (!content.openSource) return;

  // Metrics
  const { metrics, repos } = content.openSource;
  if (metrics) {
    const starEl = document.querySelector('.os-metric:nth-child(1) .os-metric-num');
    if (starEl && metrics.stars) starEl.textContent = metrics.stars;

    const contribEl = document.querySelector('.os-metric:nth-child(2) .os-metric-num');
    if (contribEl && metrics.contributions) contribEl.textContent = metrics.contributions;

    const repoEl = document.querySelector('.os-metric:nth-child(3) .os-metric-num');
    if (repoEl && metrics.repos) repoEl.textContent = metrics.repos;
  }

  // Repositories List
  const repoList = document.querySelector('.os-repos-list');
  if (repoList && repos) {
    const reposHtml = repos.map(r => `
      <div class="os-repo-item">
        <div class="os-repo-header">
          <h4>${r.name}</h4>
          <span class="os-stars-badge"><i data-lucide="star"></i> ${r.stars}</span>
        </div>
        <p style="font-size: var(--text-sm); color: var(--text-muted); line-height: var(--leading-normal);">
          ${r.desc}
        </p>
        <div class="os-repo-tags">
          ${(r.tags || []).map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
    repoList.innerHTML = reposHtml;
  }
}

/**
 * Render Contact Details
 */
function renderContactInfo(content) {
  const contact = content.contact || {};
  const email = contact.email || content.profile?.email;
  const location = contact.location || content.profile?.location;

  const emailLink = document.querySelector('.contact-direct-link');
  if (emailLink && email) {
    emailLink.href = `mailto:${email}`;
    const span = emailLink.querySelector('span');
    if (span) span.textContent = email;
  }

  const locEl = document.querySelector('.contact-detail-item:nth-child(1) .contact-detail-val');
  if (locEl && location) locEl.textContent = location;

  const respEl = document.querySelector('.contact-detail-item:nth-child(2) .contact-detail-val');
  if (respEl && contact.responseTime) respEl.textContent = contact.responseTime;

  const prefEl = document.querySelector('.contact-detail-item:nth-child(3) .contact-detail-val');
  if (prefEl && contact.preferredChannels) prefEl.textContent = contact.preferredChannels;
}

/**
 * Setup Case Study Modal Triggering
 */
function setupCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-case-study-body');
  if (!modal || !modalBody) return;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.case-study-btn');
    if (!btn) return;

    const content = getActiveContent();
    const projectId = btn.getAttribute('data-project');
    const project = (content.projects || []).find(p => p.id === projectId);
    if (!project) return;

    const { caseStudy } = project;
    if (!caseStudy) return;

    modalBody.innerHTML = `
      <div class="case-study-hero">
        <div style="margin-bottom: var(--space-2); display: flex; align-items: center; gap: var(--space-2);">
          <span class="badge badge-accent">${project.category}</span>
          <span class="badge badge-neutral">${project.role}</span>
        </div>
        <h2 id="modal-title" class="case-study-title">${project.title}</h2>
        <p class="case-study-lead">${project.summary}</p>
      </div>

      <div class="case-study-section">
        <h3 class="case-study-h3">1. The Problem</h3>
        <p>${caseStudy.problem}</p>
      </div>

      <div class="case-study-section">
        <h3 class="case-study-h3">2. Approach & Engineering Solution</h3>
        <p>${caseStudy.solution}</p>
      </div>

      <div class="case-study-section">
        <h3 class="case-study-h3">3. Systems Architecture</h3>
        <div class="case-study-arch-box">
          <code>${caseStudy.architecture}</code>
        </div>
      </div>

      <div class="case-study-section">
        <h3 class="case-study-h3">4. Measurable Results</h3>
        <ul class="case-study-results-list">
          ${(caseStudy.results || []).map(r => `<li class="case-study-result-item">${r}</li>`).join('')}
        </ul>
      </div>

      <div style="display: flex; gap: var(--space-3); padding-top: var(--space-4); border-top: 1px solid var(--border-subtle);">
        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          <i data-lucide="github"></i> View GitHub Repository
        </a>
        <button class="btn btn-ghost btn-sm" data-modal-close>Close</button>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    openModal(modal, btn);
  });
}

/**
 * Render GitHub Activity Calendar Grid
 */
function renderGithubCalendar() {
  const calendar = document.getElementById('github-calendar-grid');
  if (!calendar) return;

  calendar.innerHTML = '';
  // 26 columns * 7 days
  for (let i = 0; i < 182; i++) {
    const day = document.createElement('div');
    const rand = Math.random();
    let level = 0;
    if (rand > 0.85) level = 4;
    else if (rand > 0.68) level = 3;
    else if (rand > 0.48) level = 2;
    else if (rand > 0.22) level = 1;

    day.className = `cal-day level-${level}`;
    calendar.appendChild(day);
  }
}
