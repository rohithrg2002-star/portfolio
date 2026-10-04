/**
 * Admin Panel Application Controller (ES Module)
 * Manages dynamic content editing, master section toggles, feature switches,
 * live previewing, and zero-code content.js / JSON export.
 */

import {
  CONTENT,
  DEFAULT_FEATURE_FLAGS,
  getActiveContent,
  getActiveFeatureFlags,
  saveActiveContent,
  saveActiveFeatureFlags,
  resetPortfolioStorage
} from './data/content.js';

let currentContent = null;
let currentFlags = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Authentication Gate
  initAuth();

  // 2. Load active state from localStorage or defaults
  currentContent = getActiveContent();
  currentFlags = getActiveFeatureFlags();

  // 3. Setup Navigation Tabs
  initTabs();

  // 4. Populate All Tab Views
  renderTogglesTab();
  renderHeroTab();
  renderAboutTab();
  renderExperienceTab();
  renderProjectsTab();
  renderSkillsTab();
  renderWritingTab();
  renderContactTab();
  renderDeployTab();

  // 5. Global Save Button in Topbar
  const btnSaveAll = document.getElementById('btn-save-all');
  btnSaveAll?.addEventListener('click', () => {
    saveAllData();
  });

  // 6. Initialize Lucide Icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   AUTHENTICATION GATE
   ========================================================================== */
function initAuth() {
  const loginOverlay = document.getElementById('login-overlay');
  const adminPanel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('login-form');
  const passcodeInput = document.getElementById('passcode-input');
  const loginError = document.getElementById('login-error');
  const btnLogout = document.getElementById('btn-logout');

  // Check existing session
  const isAuthenticated = sessionStorage.getItem('portfolio_admin_auth') === 'true';
  if (isAuthenticated) {
    loginOverlay.style.display = 'none';
    adminPanel.style.display = 'flex';
  } else {
    loginOverlay.style.display = 'flex';
    adminPanel.style.display = 'none';
  }

  // Handle Login
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passcodeInput.value.trim();
    const storedPass = localStorage.getItem('portfolio_admin_passcode') || 'admin123';

    if (entered === storedPass || entered === 'admin123') {
      sessionStorage.setItem('portfolio_admin_auth', 'true');
      loginOverlay.style.display = 'none';
      adminPanel.style.display = 'flex';
      loginError.style.display = 'none';
      showToast('Authenticated successfully.');
    } else {
      loginError.style.display = 'block';
      passcodeInput.value = '';
      passcodeInput.focus();
    }
  });

  // Handle Logout
  btnLogout?.addEventListener('click', () => {
    sessionStorage.removeItem('portfolio_admin_auth');
    adminPanel.style.display = 'none';
    loginOverlay.style.display = 'flex';
    if (passcodeInput) {
      passcodeInput.value = '';
      passcodeInput.focus();
    }
    showToast('Logged out of Admin Panel.');
  });
}

/* ==========================================================================
   TABS NAVIGATION
   ========================================================================== */
function initTabs() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const tabViews = document.querySelectorAll('.admin-tab-view');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabKey = item.getAttribute('data-tab');

      sidebarItems.forEach(i => i.classList.remove('active'));
      tabViews.forEach(v => v.classList.remove('active'));

      item.classList.add('active');
      const targetView = document.getElementById(`view-${tabKey}`);
      if (targetView) targetView.classList.add('active');

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    });
  });
}

/* ==========================================================================
   TAB 1: TOGGLES & VISIBILITY
   ========================================================================== */
function renderTogglesTab() {
  const secContainer = document.getElementById('sections-toggles-grid');
  const featContainer = document.getElementById('features-toggles-grid');
  const labContainer = document.getElementById('lab-toggles-grid');

  if (!secContainer || !featContainer || !labContainer) return;

  // 1. Sections Configuration
  const sectionsConfig = [
    { id: 'hero', name: 'Hero Section', desc: 'Main headline, bio summary, CTAs, and background.' },
    { id: 'about', name: 'About Section', desc: 'Narrative bio and 4 key metric cards.' },
    { id: 'experience', name: 'Experience Section', desc: 'Vertical career timeline with metric impact bullets.' },
    { id: 'projects', name: 'Projects Section', desc: 'Production systems cards and case studies.' },
    { id: 'skills', name: 'Skills Section', desc: 'Grouped technical competency chips.' },
    { id: 'lab', name: 'Developer Lab Section', desc: 'Interactive sandboxes, runtime tools, and simulators.' },
    { id: 'writing', name: 'Writing & Open Source', desc: 'Technical publications and GitHub packages.' },
    { id: 'contact', name: 'Contact Section', desc: 'Contact inquiry form and direct communication channels.' }
  ];

  secContainer.innerHTML = sectionsConfig.map(s => {
    const isChecked = currentFlags.sections?.[s.id] !== false;
    return `
      <div class="toggle-card">
        <div class="toggle-card-info">
          <span class="toggle-card-title">${s.name}</span>
          <span class="toggle-card-desc">${s.desc}</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" data-toggle-type="sections" data-toggle-key="${s.id}" ${isChecked ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }).join('');

  // 2. Features Configuration
  const featuresConfig = [
    { id: 'threeBackground', name: 'Three.js Animated Canvas', desc: 'Subtle floating code particles in hero background.' },
    { id: 'commandPalette', name: 'Command Palette (⌘K / Ctrl+K)', desc: 'Instant keyboard shortcut navigation dialog.' },
    { id: 'terminalDrawer', name: 'Interactive CLI Drawer ( ` )', desc: 'Bottom terminal drawer with full command suite.' },
    { id: 'caseStudyModal', name: 'Case Study Modals', desc: 'Deep-dive architectural problem/solution dialogs.' },
    { id: 'themeToggle', name: 'Theme Switcher', desc: 'Dark and light mode toggle button in header.' },
    { id: 'resumeDownload', name: 'Resume Download Buttons', desc: 'Quick resume download links in nav and hero.' },
    { id: 'availabilityBadge', name: 'Live Availability Pill', desc: 'Pulsing green status indicator in hero section.' }
  ];

  featContainer.innerHTML = featuresConfig.map(f => {
    const isChecked = currentFlags.features?.[f.id] !== false;
    return `
      <div class="toggle-card">
        <div class="toggle-card-info">
          <span class="toggle-card-title">${f.name}</span>
          <span class="toggle-card-desc">${f.desc}</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" data-toggle-type="features" data-toggle-key="${f.id}" ${isChecked ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }).join('');

  // 3. Lab Modules Configuration
  const labConfig = [
    { id: 'bugHunt', name: 'Bug Hunt Simulator', desc: 'Interactive code diagnosis and assertion suite.' },
    { id: 'apiPlayground', name: 'API Latency Inspector', desc: 'Simulated endpoint test client with JSON response viewer.' },
    { id: 'erpSandbox', name: 'Mini ERP Sandbox', desc: 'Mock Frappe desk simulating document status transitions.' },
    { id: 'gitTimeline', name: 'Git Career Log', desc: 'Simulated git log CLI displaying commit history with diffs.' },
    { id: 'howIDebug', name: 'How I Debug Flowchart', desc: 'Diagnostic steps from incident triage to post-mortem.' },
    { id: 'pipelineSimulator', name: 'CI/CD Build Pipeline', desc: 'Simulated multi-stage container deployment runner.' }
  ];

  labContainer.innerHTML = labConfig.map(m => {
    const isChecked = currentFlags.labModules?.[m.id] !== false;
    return `
      <div class="toggle-card">
        <div class="toggle-card-info">
          <span class="toggle-card-title">${m.name}</span>
          <span class="toggle-card-desc">${m.desc}</span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" data-toggle-type="labModules" data-toggle-key="${m.id}" ${isChecked ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `;
  }).join('');

  // Attach change listener to all toggles
  document.querySelectorAll('input[data-toggle-type]').forEach(input => {
    input.addEventListener('change', () => {
      const type = input.getAttribute('data-toggle-type');
      const key = input.getAttribute('data-toggle-key');
      const isEnabled = input.checked;

      if (!currentFlags[type]) currentFlags[type] = {};
      currentFlags[type][key] = isEnabled;

      saveActiveFeatureFlags(currentFlags);
      showToast(`${key} toggle ${isEnabled ? 'enabled' : 'disabled'}.`);
    });
  });
}

/* ==========================================================================
   TAB 2: PROFILE & HERO
   ========================================================================== */
function renderHeroTab() {
  const form = document.getElementById('form-hero');
  if (!form) return;

  const { profile = {}, hero = {} } = currentContent;

  setValue('hero-name', profile.name || '');
  setValue('hero-role-tag', profile.roleTag || '');
  setValue('hero-title', profile.title || '');
  setValue('hero-value-prop', hero.valueProp || '');
  setValue('hero-summary', hero.summary || '');
  setValue('hero-availability', profile.availability || '');
  setValue('hero-location', profile.location || '');
  setValue('hero-email', profile.email || '');
  setValue('hero-resume-url', profile.resumeUrl || 'assets/resume.pdf');
  setValue('hero-github', profile.github || '');
  setValue('hero-linkedin', profile.linkedin || '');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentContent.profile = currentContent.profile || {};
    currentContent.profile.name = getValue('hero-name');
    currentContent.profile.roleTag = getValue('hero-role-tag');
    currentContent.profile.title = getValue('hero-title');
    currentContent.profile.availability = getValue('hero-availability');
    currentContent.profile.location = getValue('hero-location');
    currentContent.profile.email = getValue('hero-email');
    currentContent.profile.resumeUrl = getValue('hero-resume-url');
    currentContent.profile.github = getValue('hero-github');
    currentContent.profile.linkedin = getValue('hero-linkedin');

    currentContent.hero = currentContent.hero || {};
    currentContent.hero.valueProp = getValue('hero-value-prop');
    currentContent.hero.summary = getValue('hero-summary');

    saveActiveContent(currentContent);
    showToast('Profile & Hero settings saved.');
  });
}

/* ==========================================================================
   TAB 3: ABOUT & KEY STATS
   ========================================================================== */
function renderAboutTab() {
  const form = document.getElementById('form-about');
  const statsGrid = document.getElementById('stats-editor-grid');
  if (!form || !statsGrid) return;

  const about = currentContent.about || { paragraphs: [], stats: [] };
  setValue('about-paragraphs', (about.paragraphs || []).join('\n\n'));

  // Render 4 Stat Editors
  const stats = about.stats || [];
  statsGrid.innerHTML = stats.map((s, idx) => `
    <div class="item-row" style="margin-bottom: 0;">
      <div style="font-weight: var(--font-semibold); font-size: var(--text-xs); color: var(--accent); margin-bottom: var(--space-3); text-transform: uppercase;">
        Stat Card #${idx + 1}
      </div>
      <div class="form-2col" style="grid-template-columns: 1fr 1fr 1fr;">
        <div>
          <label class="admin-label">Metric Value</label>
          <input type="text" class="admin-input stat-val-input" data-stat-idx="${idx}" value="${s.value || ''}">
        </div>
        <div>
          <label class="admin-label">Unit (Optional)</label>
          <input type="text" class="admin-input stat-unit-input" data-stat-idx="${idx}" value="${s.unit || ''}" placeholder="e.g. req/min">
        </div>
        <div>
          <label class="admin-label">Label</label>
          <input type="text" class="admin-input stat-label-input" data-stat-idx="${idx}" value="${s.label || ''}">
        </div>
      </div>
      <div style="margin-top: var(--space-3);">
        <label class="admin-label">Detail Description</label>
        <input type="text" class="admin-input stat-detail-input" data-stat-idx="${idx}" value="${s.detail || ''}">
      </div>
    </div>
  `).join('');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawParagraphs = getValue('about-paragraphs');
    const paragraphs = rawParagraphs.split('\n\n').map(p => p.trim()).filter(Boolean);

    const updatedStats = [];
    document.querySelectorAll('.stat-val-input').forEach((input, idx) => {
      const unitInput = document.querySelector(`.stat-unit-input[data-stat-idx="${idx}"]`);
      const labelInput = document.querySelector(`.stat-label-input[data-stat-idx="${idx}"]`);
      const detailInput = document.querySelector(`.stat-detail-input[data-stat-idx="${idx}"]`);

      updatedStats.push({
        value: input.value.trim(),
        unit: unitInput ? unitInput.value.trim() : '',
        label: labelInput ? labelInput.value.trim() : '',
        detail: detailInput ? detailInput.value.trim() : ''
      });
    });

    currentContent.about = {
      paragraphs,
      stats: updatedStats
    };

    saveActiveContent(currentContent);
    showToast('About & Performance Stats saved.');
  });
}

/* ==========================================================================
   TAB 4: EXPERIENCE TIMELINE
   ========================================================================== */
function renderExperienceTab() {
  const container = document.getElementById('experience-items-container');
  const btnAdd = document.getElementById('btn-add-experience');
  const btnSave = document.getElementById('btn-save-experience');
  if (!container) return;

  function renderList() {
    const list = currentContent.experience || [];
    container.innerHTML = list.map((exp, idx) => `
      <div class="item-row exp-item" data-idx="${idx}">
        <div class="item-row-header">
          <span class="item-row-title">${exp.role || 'New Position'} @ ${exp.company || 'Company'}</span>
          <button type="button" class="btn-remove-item btn-del-exp" data-idx="${idx}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">Role Title</label>
            <input type="text" class="admin-input exp-role" value="${exp.role || ''}">
          </div>
          <div>
            <label class="admin-label">Company Name</label>
            <input type="text" class="admin-input exp-company" value="${exp.company || ''}">
          </div>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">Period (e.g. 2023 — Present)</label>
            <input type="text" class="admin-input exp-period" value="${exp.period || ''}">
          </div>
          <div>
            <label class="admin-label">Location</label>
            <input type="text" class="admin-input exp-location" value="${exp.location || ''}">
          </div>
        </div>

        <div style="margin-bottom: var(--space-4);">
          <label class="admin-label">Impact Bullets (One achievement bullet per line)</label>
          <textarea class="admin-textarea exp-bullets" rows="4">${(exp.bullets || []).join('\n')}</textarea>
        </div>

        <div>
          <label class="admin-label">Tech Chips (Comma Separated)</label>
          <input type="text" class="admin-input exp-skills" value="${(exp.skills || []).join(', ')}">
        </div>
      </div>
    `).join('');

    // Attach Delete handlers
    container.querySelectorAll('.btn-del-exp').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        currentContent.experience.splice(idx, 1);
        renderList();
        showToast('Experience position removed.');
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renderList();

  btnAdd?.addEventListener('click', () => {
    currentContent.experience = currentContent.experience || [];
    currentContent.experience.unshift({
      role: "Staff Systems Engineer",
      company: "Acme Corp",
      period: "2026 — Present",
      location: "San Francisco, CA",
      bullets: ["Architected scalable microservices, cutting response latency by 50%."],
      skills: ["Python", "Go", "Kubernetes", "Docker"]
    });
    renderList();
    showToast('New position added to top.');
  });

  btnSave?.addEventListener('click', () => {
    const updated = [];
    container.querySelectorAll('.exp-item').forEach(card => {
      const role = card.querySelector('.exp-role').value.trim();
      const company = card.querySelector('.exp-company').value.trim();
      const period = card.querySelector('.exp-period').value.trim();
      const location = card.querySelector('.exp-location').value.trim();
      const rawBullets = card.querySelector('.exp-bullets').value;
      const bullets = rawBullets.split('\n').map(b => b.trim()).filter(Boolean);
      const rawSkills = card.querySelector('.exp-skills').value;
      const skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

      updated.push({ role, company, period, location, bullets, skills });
    });

    currentContent.experience = updated;
    saveActiveContent(currentContent);
    showToast('All experience timeline entries saved.');
  });
}

/* ==========================================================================
   TAB 5: FEATURED PROJECTS & CASE STUDIES
   ========================================================================== */
function renderProjectsTab() {
  const container = document.getElementById('projects-items-container');
  const btnAdd = document.getElementById('btn-add-project');
  const btnSave = document.getElementById('btn-save-projects');
  if (!container) return;

  function renderList() {
    const list = currentContent.projects || [];
    container.innerHTML = list.map((proj, idx) => `
      <div class="item-row proj-item" data-idx="${idx}">
        <div class="item-row-header">
          <span class="item-row-title">${proj.title || 'Untitled Project'} (${proj.category || 'General'})</span>
          <button type="button" class="btn-remove-item btn-del-proj" data-idx="${idx}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">Project Title</label>
            <input type="text" class="admin-input proj-title" value="${proj.title || ''}">
          </div>
          <div>
            <label class="admin-label">Category</label>
            <input type="text" class="admin-input proj-category" value="${proj.category || 'ERP / Systems'}">
          </div>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">Badge Tag (e.g. Featured System)</label>
            <input type="text" class="admin-input proj-badge" value="${proj.badge || ''}">
          </div>
          <div>
            <label class="admin-label">My Role</label>
            <input type="text" class="admin-input proj-role" value="${proj.role || 'Lead Systems Architect'}">
          </div>
        </div>

        <div style="margin-bottom: var(--space-4);">
          <label class="admin-label">Card Summary Description</label>
          <textarea class="admin-textarea proj-summary" rows="2">${proj.summary || ''}</textarea>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">Measurable Outcome</label>
            <input type="text" class="admin-input proj-outcome" value="${proj.outcome || ''}">
          </div>
          <div>
            <label class="admin-label">Thumbnail URL</label>
            <input type="text" class="admin-input proj-thumbnail" value="${proj.thumbnail || 'assets/images/nexis_erp_thumbnail.png'}">
          </div>
        </div>

        <div class="form-2col" style="margin-bottom: var(--space-4);">
          <div>
            <label class="admin-label">GitHub Repository URL</label>
            <input type="url" class="admin-input proj-github" value="${proj.github || 'https://github.com'}">
          </div>
          <div>
            <label class="admin-label">Tech Tags (Comma Separated)</label>
            <input type="text" class="admin-input proj-tags" value="${(proj.tags || []).join(', ')}">
          </div>
        </div>

        <!-- Case Study Sub-Section -->
        <div style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); margin-top: var(--space-4);">
          <h4 style="font-size: var(--text-xs); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); margin-bottom: var(--space-3);">
            Case Study Modal Content
          </h4>

          <div style="margin-bottom: var(--space-3);">
            <label class="admin-label">1. Problem Statement</label>
            <textarea class="admin-textarea cs-problem" rows="2">${proj.caseStudy?.problem || ''}</textarea>
          </div>

          <div style="margin-bottom: var(--space-3);">
            <label class="admin-label">2. Approach &amp; Engineering Solution</label>
            <textarea class="admin-textarea cs-solution" rows="2">${proj.caseStudy?.solution || ''}</textarea>
          </div>

          <div style="margin-bottom: var(--space-3);">
            <label class="admin-label">3. Systems Architecture String</label>
            <input type="text" class="admin-input cs-architecture" value="${proj.caseStudy?.architecture || ''}">
          </div>

          <div>
            <label class="admin-label">4. Results Bullets (One metric result per line)</label>
            <textarea class="admin-textarea cs-results" rows="3">${(proj.caseStudy?.results || []).join('\n')}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-del-proj').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        currentContent.projects.splice(idx, 1);
        renderList();
        showToast('Project removed.');
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renderList();

  btnAdd?.addEventListener('click', () => {
    currentContent.projects = currentContent.projects || [];
    currentContent.projects.push({
      id: `project-${Date.now()}`,
      title: "New Cloud System",
      category: "Backend & Cloud",
      badge: "Production System",
      summary: "High-performance distributed system architecture handling high throughput.",
      role: "Lead Systems Architect",
      outcome: "Reduced latency by 75%; saved $50k/yr in compute costs",
      thumbnail: "assets/images/opsflow_thumbnail.png",
      github: "https://github.com",
      tags: ["Go", "Kubernetes", "Redis", "Docker"],
      caseStudy: {
        problem: "Bottlenecks during heavy transaction volume.",
        solution: "Decoupled transaction handling via Redis Queue workers.",
        architecture: "Client -> Go API -> Redis -> Database",
        results: ["Sub-20ms response time", "99.99% uptime"]
      }
    });
    renderList();
    showToast('New project created.');
  });

  btnSave?.addEventListener('click', () => {
    const updated = [];
    container.querySelectorAll('.proj-item').forEach((card, idx) => {
      const orig = currentContent.projects[idx] || {};
      const title = card.querySelector('.proj-title').value.trim();
      const category = card.querySelector('.proj-category').value.trim();
      const badge = card.querySelector('.proj-badge').value.trim();
      const role = card.querySelector('.proj-role').value.trim();
      const summary = card.querySelector('.proj-summary').value.trim();
      const outcome = card.querySelector('.proj-outcome').value.trim();
      const thumbnail = card.querySelector('.proj-thumbnail').value.trim();
      const github = card.querySelector('.proj-github').value.trim();
      const rawTags = card.querySelector('.proj-tags').value;
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);

      const csProblem = card.querySelector('.cs-problem').value.trim();
      const csSolution = card.querySelector('.cs-solution').value.trim();
      const csArchitecture = card.querySelector('.cs-architecture').value.trim();
      const rawResults = card.querySelector('.cs-results').value;
      const csResults = rawResults.split('\n').map(r => r.trim()).filter(Boolean);

      updated.push({
        id: orig.id || `proj-${idx}`,
        title,
        category,
        badge,
        role,
        summary,
        outcome,
        thumbnail,
        github,
        tags,
        caseStudy: {
          problem: csProblem,
          solution: csSolution,
          architecture: csArchitecture,
          results: csResults
        }
      });
    });

    currentContent.projects = updated;
    saveActiveContent(currentContent);
    showToast('All projects and case studies saved.');
  });
}

/* ==========================================================================
   TAB 6: SKILLS MATRIX
   ========================================================================== */
function renderSkillsTab() {
  const container = document.getElementById('skills-items-container');
  const btnAdd = document.getElementById('btn-add-skill-category');
  const btnSave = document.getElementById('btn-save-skills');
  if (!container) return;

  function renderList() {
    const skillsObj = currentContent.skills || {};
    container.innerHTML = Object.entries(skillsObj).map(([cat, skills], idx) => `
      <div class="item-row skill-cat-row" data-idx="${idx}">
        <div class="item-row-header">
          <input type="text" class="admin-input skill-cat-name" value="${cat}" style="max-width: 320px; font-weight: var(--font-semibold);">
          <button type="button" class="btn-remove-item btn-del-skill-cat" data-cat="${cat}">
            <i data-lucide="trash-2"></i> Remove Category
          </button>
        </div>
        <div>
          <label class="admin-label">Skills (Comma-separated tags)</label>
          <textarea class="admin-textarea skill-cat-tags" rows="2">${(skills || []).join(', ')}</textarea>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-del-skill-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-cat');
        delete currentContent.skills[cat];
        renderList();
        showToast(`Category "${cat}" removed.`);
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renderList();

  btnAdd?.addEventListener('click', () => {
    currentContent.skills = currentContent.skills || {};
    const newName = `New Category ${Object.keys(currentContent.skills).length + 1}`;
    currentContent.skills[newName] = ["Technology 1", "Technology 2"];
    renderList();
    showToast('New skill category added.');
  });

  btnSave?.addEventListener('click', () => {
    const updated = {};
    container.querySelectorAll('.skill-cat-row').forEach(card => {
      const catName = card.querySelector('.skill-cat-name').value.trim();
      const rawTags = card.querySelector('.skill-cat-tags').value;
      const tags = rawTags.split(',').map(t => t.trim()).filter(Boolean);
      if (catName) {
        updated[catName] = tags;
      }
    });

    currentContent.skills = updated;
    saveActiveContent(currentContent);
    showToast('Skills matrix saved.');
  });
}

/* ==========================================================================
   TAB 7: WRITING & OPEN SOURCE
   ========================================================================== */
function renderWritingTab() {
  const articlesContainer = document.getElementById('articles-items-container');
  const reposContainer = document.getElementById('repos-items-container');
  const btnAddArt = document.getElementById('btn-add-article');
  const btnAddRepo = document.getElementById('btn-add-repo');
  const btnSave = document.getElementById('btn-save-writing');

  // Pre-fill GitHub stats
  const metrics = currentContent.openSource?.metrics || { stars: 482, contributions: "820+", repos: 34 };
  setValue('os-stars-input', metrics.stars || 0);
  setValue('os-contribs-input', metrics.contributions || '0');
  setValue('os-repos-input', metrics.repos || 0);

  // Render Articles
  function renderArticles() {
    const articles = currentContent.writing || [];
    articlesContainer.innerHTML = articles.map((art, idx) => `
      <div class="item-row art-item" data-idx="${idx}" style="margin-bottom: var(--space-3);">
        <div class="item-row-header">
          <span class="item-row-title">${art.title || 'Untitled Article'}</span>
          <button type="button" class="btn-remove-item btn-del-art" data-idx="${idx}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>
        <div class="form-2col" style="margin-bottom: var(--space-3);">
          <div>
            <label class="admin-label">Article Title</label>
            <input type="text" class="admin-input art-title" value="${art.title || ''}">
          </div>
          <div>
            <label class="admin-label">Date Published</label>
            <input type="text" class="admin-input art-date" value="${art.date || ''}">
          </div>
        </div>
        <div style="margin-bottom: var(--space-3);">
          <label class="admin-label">Excerpt Summary</label>
          <textarea class="admin-textarea art-excerpt" rows="2">${art.excerpt || ''}</textarea>
        </div>
        <div>
          <label class="admin-label">Link URL</label>
          <input type="text" class="admin-input art-link" value="${art.link || '#'}">
        </div>
      </div>
    `).join('');

    articlesContainer.querySelectorAll('.btn-del-art').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        currentContent.writing.splice(idx, 1);
        renderArticles();
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Render Repos
  function renderRepos() {
    const repos = currentContent.openSource?.repos || [];
    reposContainer.innerHTML = repos.map((r, idx) => `
      <div class="item-row repo-item" data-idx="${idx}" style="margin-bottom: var(--space-3);">
        <div class="item-row-header">
          <span class="item-row-title">${r.name || 'repository'}</span>
          <button type="button" class="btn-remove-item btn-del-repo" data-idx="${idx}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>
        <div class="form-2col" style="margin-bottom: var(--space-3);">
          <div>
            <label class="admin-label">Repository Name</label>
            <input type="text" class="admin-input repo-name" value="${r.name || ''}">
          </div>
          <div>
            <label class="admin-label">Stars Count</label>
            <input type="number" class="admin-input repo-stars" value="${r.stars || 0}">
          </div>
        </div>
        <div style="margin-bottom: var(--space-3);">
          <label class="admin-label">Description</label>
          <input type="text" class="admin-input repo-desc" value="${r.desc || ''}">
        </div>
        <div>
          <label class="admin-label">Tech Tags (Comma-separated)</label>
          <input type="text" class="admin-input repo-tags" value="${(r.tags || []).join(', ')}">
        </div>
      </div>
    `).join('');

    reposContainer.querySelectorAll('.btn-del-repo').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        currentContent.openSource.repos.splice(idx, 1);
        renderRepos();
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  renderArticles();
  renderRepos();

  btnAddArt?.addEventListener('click', () => {
    currentContent.writing = currentContent.writing || [];
    currentContent.writing.push({
      id: `art-${Date.now()}`,
      title: "New Systems Architecture Breakdown",
      date: "October 2026",
      excerpt: "Deep architectural notes exploring performance scaling and concurrency.",
      link: "#"
    });
    renderArticles();
  });

  btnAddRepo?.addEventListener('click', () => {
    currentContent.openSource = currentContent.openSource || {};
    currentContent.openSource.repos = currentContent.openSource.repos || [];
    currentContent.openSource.repos.push({
      name: "new-distributed-package",
      stars: 100,
      desc: "High-performance systems utility in Go / Python.",
      tags: ["Go", "Distributed"],
      link: "https://github.com"
    });
    renderRepos();
  });

  btnSave?.addEventListener('click', () => {
    // Save Articles
    const updatedArticles = [];
    articlesContainer.querySelectorAll('.art-item').forEach(card => {
      updatedArticles.push({
        title: card.querySelector('.art-title').value.trim(),
        date: card.querySelector('.art-date').value.trim(),
        excerpt: card.querySelector('.art-excerpt').value.trim(),
        link: card.querySelector('.art-link').value.trim()
      });
    });
    currentContent.writing = updatedArticles;

    // Save Repos
    const updatedRepos = [];
    reposContainer.querySelectorAll('.repo-item').forEach(card => {
      const rawTags = card.querySelector('.repo-tags').value;
      updatedRepos.push({
        name: card.querySelector('.repo-name').value.trim(),
        stars: parseInt(card.querySelector('.repo-stars').value, 10) || 0,
        desc: card.querySelector('.repo-desc').value.trim(),
        tags: rawTags.split(',').map(t => t.trim()).filter(Boolean),
        link: "https://github.com"
      });
    });

    currentContent.openSource = {
      metrics: {
        stars: parseInt(getValue('os-stars-input'), 10) || 0,
        contributions: getValue('os-contribs-input'),
        repos: parseInt(getValue('os-repos-input'), 10) || 0
      },
      repos: updatedRepos
    };

    saveActiveContent(currentContent);
    showToast('Writing & Open Source settings saved.');
  });
}

/* ==========================================================================
   TAB 8: CONTACT SETTINGS
   ========================================================================== */
function renderContactTab() {
  const form = document.getElementById('form-contact');
  if (!form) return;

  const contact = currentContent.contact || {};
  setValue('contact-heading', contact.heading || 'Start a Conversation');
  setValue('contact-desc', contact.description || '');
  setValue('contact-email-input', contact.email || currentContent.profile?.email || '');
  setValue('contact-loc-input', contact.location || currentContent.profile?.location || '');
  setValue('contact-resp-input', contact.responseTime || 'Usually within 24 hours');
  setValue('contact-pref-input', contact.preferredChannels || 'Email, LinkedIn, GitHub');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    currentContent.contact = {
      heading: getValue('contact-heading'),
      description: getValue('contact-desc'),
      email: getValue('contact-email-input'),
      location: getValue('contact-loc-input'),
      responseTime: getValue('contact-resp-input'),
      preferredChannels: getValue('contact-pref-input')
    };

    saveActiveContent(currentContent);
    showToast('Contact preferences saved.');
  });
}

/* ==========================================================================
   TAB 9: DEPLOY, EXPORT & BACKUP
   ========================================================================== */
function renderDeployTab() {
  const btnDownloadContent = document.getElementById('btn-download-content-js');
  const btnExportJson = document.getElementById('btn-export-json');
  const inputImportJson = document.getElementById('input-import-json');
  const btnFactoryReset = document.getElementById('btn-factory-reset');

  // 1. Download updated content.js
  btnDownloadContent?.addEventListener('click', () => {
    const fileContent = generateContentJsFileString(currentContent, currentFlags);
    triggerDownload('content.js', fileContent, 'text/javascript');
    showToast('Downloaded content.js. Replace data/content.js for zero-code deploy.');
  });

  // 2. Export JSON Config
  btnExportJson?.addEventListener('click', () => {
    const backupData = {
      version: "2.0.0",
      exportedAt: new Date().toISOString(),
      content: currentContent,
      featureFlags: currentFlags
    };
    triggerDownload('portfolio-config-backup.json', JSON.stringify(backupData, null, 2), 'application/json');
    showToast('Exported portfolio-config-backup.json.');
  });

  // 3. Import JSON Config
  inputImportJson?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.content) {
          currentContent = imported.content;
          saveActiveContent(currentContent);
        }
        if (imported.featureFlags) {
          currentFlags = imported.featureFlags;
          saveActiveFeatureFlags(currentFlags);
        }
        showToast('Configuration imported successfully! Refreshing view...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        showToast('Failed to parse JSON backup file.', 'error');
      }
    };
    reader.readAsText(file);
  });

  // 4. Factory Reset
  btnFactoryReset?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data and feature toggles to original defaults? This will erase your custom changes.')) {
      resetPortfolioStorage();
      showToast('All settings reset to defaults. Refreshing...');
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}

/* ==========================================================================
   GLOBAL SAVE HELPER
   ========================================================================== */
function saveAllData() {
  saveActiveContent(currentContent);
  saveActiveFeatureFlags(currentFlags);
  showToast('All portfolio modifications saved to browser storage.');
}

/* ==========================================================================
   CONTENT.JS CODE GENERATOR (FOR ONE-CLICK PERMANENT DEPLOYMENT)
   ========================================================================== */
function generateContentJsFileString(content, flags) {
  return `/**
 * Central Content Store & Feature Configuration
 * Generated via Portfolio Admin Dashboard on ${new Date().toISOString()}
 * Single source of truth for portfolio profile, navigation, metrics, experience, projects, and skills.
 */

export const CONTENT = ${JSON.stringify(content, null, 2)};

/**
 * Default Feature & Section Visibility Flags
 */
export const DEFAULT_FEATURE_FLAGS = ${JSON.stringify(flags, null, 2)};

/**
 * Safe deep merge helper for JSON structures
 */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  const result = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function getActiveContent() {
  try {
    const raw = localStorage.getItem('portfolio_custom_content');
    if (!raw) return CONTENT;
    const custom = JSON.parse(raw);
    return deepMerge(CONTENT, custom);
  } catch (e) {
    return CONTENT;
  }
}

export function getActiveFeatureFlags() {
  try {
    const raw = localStorage.getItem('portfolio_feature_flags');
    if (!raw) return DEFAULT_FEATURE_FLAGS;
    const custom = JSON.parse(raw);
    return deepMerge(DEFAULT_FEATURE_FLAGS, custom);
  } catch (e) {
    return DEFAULT_FEATURE_FLAGS;
  }
}

export function saveActiveContent(content) {
  try {
    localStorage.setItem('portfolio_custom_content', JSON.stringify(content));
    return true;
  } catch (e) {
    return false;
  }
}

export function saveActiveFeatureFlags(flags) {
  try {
    localStorage.setItem('portfolio_feature_flags', JSON.stringify(flags));
    return true;
  } catch (e) {
    return false;
  }
}

export function resetPortfolioStorage() {
  try {
    localStorage.removeItem('portfolio_custom_content');
    localStorage.removeItem('portfolio_feature_flags');
    return true;
  } catch (e) {
    return false;
  }
}
`;
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function triggerDownload(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('admin-toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.className = `admin-toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
