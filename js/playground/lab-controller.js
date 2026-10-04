/**
 * Developer Lab Controller (Lazy-loaded ES Module)
 * Powers Bug Hunt, API Playground, Mini ERP sandbox, Git Career Log,
 * How I Debug flowchart, and Build Pipeline Simulator.
 */

// Safe Web Storage Wrappers
function safeStorageGet(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
}

function safeStorageSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // Gracefully handle quota or private mode restrictions
  }
}

/* ==========================================================================
   ACHIEVEMENTS SYSTEM (Demoted & Non-intrusive)
   ========================================================================== */
const ACHIEVEMENTS = {
  'terminal-explorer': { name: 'Terminal Explorer', desc: 'Execute commands in the interactive CLI.' },
  'bug-hunter': { name: 'Bug Hunter', desc: 'Identify and fix a bug in the code editor.' },
  'api-tester': { name: 'API Tester', desc: 'Send your first HTTP mock API request.' },
  'code-reviewer': { name: 'Master Debugger', desc: 'Resolve Easy, Medium, and Hard bugs.' },
  'erp-explorer': { name: 'ERP Explorer', desc: 'Create a custom Task in the Mini ERP workspace.' },
  'keyboard-ninja': { name: 'Keyboard Ninja', desc: 'Trigger the global command palette (Ctrl+K).' },
  'curious-developer': { name: 'Curious Developer', desc: 'Visit every section of the lab.' }
};

const visitedTabs = new Set(['bug-hunt']);

function initAchievements() {
  const unlocked = safeStorageGet('dev_achievements', []);
  updateAchievementsUI(unlocked);
}

// Global hook for terminal / palette
window.unlockAchievement = function(id) {
  if (!ACHIEVEMENTS[id]) return;
  const unlocked = safeStorageGet('dev_achievements', []);
  if (unlocked.includes(id)) return;

  unlocked.push(id);
  safeStorageSet('dev_achievements', unlocked);
  updateAchievementsUI(unlocked);
};

function updateAchievementsUI(unlocked) {
  const list = document.getElementById('achievements-list');
  const ratio = document.getElementById('achievement-ratio');
  if (!list || !ratio) return;

  list.innerHTML = '';
  ratio.textContent = `${unlocked.length}/${Object.keys(ACHIEVEMENTS).length}`;

  Object.entries(ACHIEVEMENTS).forEach(([id, data]) => {
    const isUnlocked = unlocked.includes(id);
    const item = document.createElement('div');
    item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
    item.innerHTML = `
      <div class="achievement-icon">
        <i data-lucide="${isUnlocked ? 'trophy' : 'lock'}" style="width:16px;height:16px;"></i>
      </div>
      <div class="achievement-info">
        <span class="achievement-name">${data.name}</span>
        <span class="achievement-desc">${data.desc}</span>
      </div>
    `;
    list.appendChild(item);
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ==========================================================================
   LAB TABS CONTROLLER (With Full Keyboard ARIA Support)
   ========================================================================== */
function initPlaygroundTabs() {
  const tabList = document.querySelector('.playground-tabs');
  const tabs = document.querySelectorAll('.playground-tab');
  const panels = document.querySelectorAll('.playground-panel');

  if (tabList) {
    tabList.setAttribute('role', 'tablist');
  }

  tabs.forEach((tab, index) => {
    const target = tab.getAttribute('data-tab');
    const panel = document.getElementById(`panel-${target}`);

    tab.setAttribute('role', 'tab');
    tab.setAttribute('id', `tab-${target}`);
    tab.setAttribute('aria-controls', `panel-${target}`);
    tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
    tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');

    if (panel) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${target}`);
    }

    tab.addEventListener('click', () => switchTab(target));

    // Keyboard Arrow navigation inside tablist
    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetTab = tabs[(index + 1) % tabs.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetTab = tabs[(index - 1 + tabs.length) % tabs.length];
      }

      if (targetTab) {
        targetTab.focus();
        targetTab.click();
      }
    });
  });

  function switchTab(target) {
    tabs.forEach(t => {
      const isCurrent = t.getAttribute('data-tab') === target;
      t.classList.toggle('active', isCurrent);
      t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      t.setAttribute('tabindex', isCurrent ? '0' : '-1');
    });

    panels.forEach(p => {
      p.classList.toggle('active', p.id === `panel-${target}`);
    });

    visitedTabs.add(target);
    if (visitedTabs.size === tabs.length) {
      window.unlockAchievement('curious-developer');
    }
  }
}

/* ==========================================================================
   BUG HUNT GAME
   ========================================================================== */
const CHALLENGES = {
  easy: {
    lang: 'javascript',
    difficulty: 'Easy',
    desc: 'Find the out-of-bounds array access that causes undefined elements to disrupt the max calculations.',
    code: [
      'function findMax(arr) {',
      '  let max = arr[0];',
      '  for (let i = 0; i <= arr.length; i++) {',
      '    if (arr[i] > max) {',
      '      max = arr[i];',
      '    }',
      '  }',
      '  return max;',
      '}'
    ],
    bugLine: 2,
    options: [
      { text: 'change to: for (let i = 0; i < arr.length; i++) {', correct: true },
      { text: 'change to: for (let i = 1; i <= arr.length; i++) {', correct: false },
      { text: 'change to: for (let i = 0; i < arr.length - 1; i++) {', correct: false }
    ],
    tests: [{ input: '[1, 5, 3]', expected: '5' }]
  },
  medium: {
    lang: 'python',
    difficulty: 'Medium',
    desc: 'Find the mutable default argument that causes list accumulations across multiple function calls.',
    code: [
      'def append_to_list(value, my_list=[]):',
      '    my_list.append(value)',
      '    return my_list',
      '',
      '# Calling this multiple times accumulates values',
      'r1 = append_to_list("A")',
      'r2 = append_to_list("B") # yields ["A", "B"]'
    ],
    bugLine: 0,
    options: [
      { text: 'change to: def append_to_list(value, my_list=None):', correct: true },
      { text: 'change to: def append_to_list(value, my_list=list()):', correct: false },
      { text: 'change to: def append_to_list(value, my_list=()):', correct: false }
    ],
    tests: [{ input: 'append_to_list("B")', expected: '["B"]' }]
  },
  hard: {
    lang: 'javascript',
    difficulty: 'Hard',
    desc: 'Find why calling getUserDetails returns an empty array instead of waiting for async callback actions.',
    code: [
      'async function getUserDetails(userIds) {',
      '  const details = [];',
      '  userIds.forEach(async (id) => {',
      '    const user = await fetchUser(id);',
      '    details.push(user);',
      '  });',
      '  return details;',
      '}'
    ],
    bugLine: 2,
    options: [
      { text: 'change to: for (const id of userIds) {', correct: true },
      { text: 'change to: userIds.map(async (id) => {', correct: false },
      { text: 'change to: userIds.forEach(id => {', correct: false }
    ],
    tests: [{ input: '[101]', expected: '[{id: 101, name: "User"}]' }]
  }
};

let activeDiff = 'easy';
let selectedLineIndex = null;
let selectedOptionIndex = null;
let bugStartTime = Date.now();
let solvedChallenges = new Set();
let attemptsCount = 0;

function initBugHunt() {
  const diffBtns = document.querySelectorAll('.diff-btn');
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeDiff = btn.getAttribute('data-diff');
      loadChallenge(activeDiff);
    });
  });

  const runBtn = document.getElementById('bughunt-run-btn');
  if (runBtn) {
    runBtn.addEventListener('click', runBugHuntTest);
  }

  loadChallenge('easy');
}

function loadChallenge(diff) {
  const challenge = CHALLENGES[diff];
  if (!challenge) return;

  selectedLineIndex = null;
  selectedOptionIndex = null;
  bugStartTime = Date.now();

  const descEl = document.getElementById('bughunt-desc');
  const editorEl = document.getElementById('bughunt-code-lines');
  const optionsEl = document.getElementById('bughunt-options-list');
  const outputEl = document.getElementById('bughunt-console-output');

  if (descEl) descEl.textContent = challenge.desc;
  if (outputEl) {
    outputEl.innerHTML = `<span class="console-placeholder">Select the buggy code line and the corresponding fix.</span>`;
    outputEl.className = 'bughunt-console-output';
  }

  if (editorEl) {
    editorEl.innerHTML = '';
    challenge.code.forEach((line, idx) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-line';
      lineDiv.innerHTML = `
        <span class="line-num">${idx + 1}</span>
        <span class="line-text">${escapeHtml(line)}</span>
      `;
      lineDiv.addEventListener('click', () => {
        document.querySelectorAll('.code-line').forEach(l => l.classList.remove('selected'));
        lineDiv.classList.add('selected');
        selectedLineIndex = idx;
      });
      editorEl.appendChild(lineDiv);
    });
  }

  if (optionsEl) {
    optionsEl.innerHTML = '';
    challenge.options.forEach((opt, idx) => {
      const optLi = document.createElement('li');
      optLi.className = 'option-item';
      optLi.innerHTML = `
        <input type="radio" name="bughunt-option" id="opt-${idx}" value="${idx}">
        <label for="opt-${idx}">${escapeHtml(opt.text)}</label>
      `;
      optLi.addEventListener('click', () => {
        document.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
        optLi.classList.add('selected');
        const radio = optLi.querySelector('input');
        if (radio) radio.checked = true;
        selectedOptionIndex = idx;
      });
      optionsEl.appendChild(optLi);
    });
  }
}

function runBugHuntTest() {
  const outputEl = document.getElementById('bughunt-console-output');
  if (!outputEl) return;

  if (selectedLineIndex === null) {
    outputEl.innerHTML = `<span style="color:var(--error);">[ERR] Please click on the code line containing the bug.</span>`;
    return;
  }

  if (selectedOptionIndex === null) {
    outputEl.innerHTML = `<span style="color:var(--error);">[ERR] Please select a solution option.</span>`;
    return;
  }

  attemptsCount++;
  const attemptsEl = document.getElementById('stat-attempts');
  if (attemptsEl) attemptsEl.textContent = attemptsCount;

  outputEl.innerHTML = `<span style="color:var(--accent);">Running test suite assertions...</span><br><span class="console-spinner"></span>`;
  outputEl.className = 'bughunt-console-output active';

  const challenge = CHALLENGES[activeDiff];
  const isCorrectLine = selectedLineIndex === challenge.bugLine;
  const isCorrectFix = challenge.options[selectedOptionIndex].correct;

  setTimeout(() => {
    if (isCorrectLine && isCorrectFix) {
      outputEl.innerHTML = `
        <span style="color:var(--success);">$ test_suite.py</span><br>
        <span style="color:var(--accent);">Running assertion: Input ${challenge.tests[0].input}</span><br>
        <span style="color:var(--success);">✓ Assertion OK: Result matches expected output: ${challenge.tests[0].expected}</span><br><br>
        <span class="success-banner" style="color:var(--success); font-weight:600;">Test Passed: Bug Fixed Successfully ✓</span>
      `;
      solvedChallenges.add(activeDiff);
      const solvedEl = document.getElementById('stat-solved');
      if (solvedEl) solvedEl.textContent = solvedChallenges.size;

      const timeTaken = Math.round((Date.now() - bugStartTime) / 1000);
      const fastestEl = document.getElementById('stat-fastest');
      if (fastestEl) {
        const currFastest = parseInt(fastestEl.textContent) || 0;
        if (currFastest === 0 || timeTaken < currFastest) {
          fastestEl.textContent = `${timeTaken}s`;
        }
      }

      window.unlockAchievement('bug-hunter');
      if (solvedChallenges.size === 3) {
        window.unlockAchievement('code-reviewer');
      }
    } else {
      const errorMsg = !isCorrectLine 
        ? `[FAIL] Line ${selectedLineIndex + 1} is not the cause of this bug.`
        : `[FAIL] The selected fix does not resolve the assertion failure.`;
      outputEl.innerHTML = `
        <span style="color:var(--error);">$ test_suite.py</span><br>
        <span style="color:var(--error);">AssertionError: Test failed.</span><br>
        <span style="color:var(--error);">${errorMsg}</span>
      `;
    }
  }, 750);
}

/* ==========================================================================
   API PLAYGROUND
   ========================================================================== */
const ENDPOINTS = {
  'GET /api/developer': {
    status: 200,
    statusText: 'OK',
    data: {
      name: "Alex Carter",
      role: "Lead Software Engineer & Systems Architect",
      skills: ["Python", "Go", "Frappe/ERPNext", "Kubernetes", "DevOps"],
      status: "Available for Staff / Lead Architecture Roles"
    }
  },
  'GET /api/skills': {
    status: 200,
    statusText: 'OK',
    data: {
      erp: ["Frappe Framework", "ERPNext", "DocType Controllers", "PyPika Query Builder"],
      backend: ["Python", "Go", "Django", "FastAPI", "PostgreSQL", "Redis"],
      cloud: ["Docker", "Kubernetes", "AWS EKS", "Terraform", "GitHub Actions"]
    }
  },
  'GET /api/projects': {
    status: 200,
    statusText: 'OK',
    data: [
      { id: "nexis-erp", title: "Nexis ERP Sync", latencyReduction: "85%" },
      { id: "aether-db", title: "AetherDB Raft Store", throughput: "50,000 writes/sec" },
      { id: "opsflow", title: "OpsFlow K8s Operator", sandboxTime: "< 90 seconds" }
    ]
  },
  'POST /api/contact': {
    status: 201,
    statusText: 'Created',
    data: {
      status: "received",
      message: "Message queued for delivery.",
      timestamp: new Date().toISOString()
    }
  }
};

function initApiPlayground() {
  const select = document.getElementById('api-endpoint-select');
  const sendBtn = document.getElementById('api-send-btn');
  const methodTag = document.getElementById('api-method-tag');
  const reqBodyContainer = document.getElementById('api-req-body-container');

  if (!select || !sendBtn) return;

  select.addEventListener('change', () => {
    const endpoint = select.value;
    const method = endpoint.split(' ')[0];
    if (methodTag) {
      methodTag.textContent = method;
      methodTag.className = `api-method ${method.toLowerCase()}`;
    }
    if (reqBodyContainer) {
      reqBodyContainer.style.display = method === 'POST' ? 'block' : 'none';
    }
  });

  sendBtn.addEventListener('click', sendMockRequest);
}

function sendMockRequest() {
  const select = document.getElementById('api-endpoint-select');
  const outputEl = document.getElementById('api-json-response');
  const statusEl = document.getElementById('api-res-status');
  const timeEl = document.getElementById('api-res-time');
  const sizeEl = document.getElementById('api-res-size');

  if (!select || !outputEl) return;

  const endpoint = select.value;
  const response = ENDPOINTS[endpoint] || { status: 404, statusText: 'Not Found', data: { error: "Unknown endpoint" } };

  if (statusEl) { statusEl.textContent = '---'; statusEl.className = 'res-status'; }
  if (timeEl) timeEl.textContent = '---';
  if (sizeEl) sizeEl.textContent = '---';

  outputEl.innerHTML = `<span style="color:var(--accent);">Sending request to mock proxy...</span><br><span class="console-spinner"></span>`;

  const start = Date.now();
  const mockLatency = 80 + Math.floor(Math.random() * 120);

  setTimeout(() => {
    const duration = Date.now() - start;
    const jsonStr = JSON.stringify(response.data, null, 2);
    const byteSize = new Blob([jsonStr]).size;

    if (statusEl) {
      statusEl.textContent = `${response.status} ${response.statusText}`;
      statusEl.className = `res-status code-${response.status}`;
    }
    if (timeEl) timeEl.textContent = `${duration}ms`;
    if (sizeEl) sizeEl.textContent = `${(byteSize / 1024).toFixed(2)} KB`;

    outputEl.innerHTML = highlightJson(jsonStr);
    window.unlockAchievement('api-tester');
  }, mockLatency);
}

/* ==========================================================================
   MINI ERP SANDBOX (Frappe Desk Mockup)
   ========================================================================== */
let erpDb = {
  tasks: [
    { id: "TSK-001", name: "Optimize MariaDB transaction locks", project: "Nexis ERP", status: "Open", assignee: "Alex Carter", priority: "High" },
    { id: "TSK-002", name: "Deploy Auth replica routes", project: "Infrastructure", status: "In Progress", assignee: "Dave Miller", priority: "Medium" },
    { id: "TSK-003", name: "Configure Redis caching pipelines", project: "Cloud Ingestion", status: "Closed", assignee: "Alex Carter", priority: "High" }
  ],
  issues: [
    { id: "ISS-001", title: "API checkout endpoint timeout (408)", priority: "Critical", status: "Open", logged_by: "Apex Store A" },
    { id: "ISS-002", title: "Docker memory limit container crash", priority: "High", status: "Closed", logged_by: "K8s Watchdog" }
  ],
  customers: [
    { name: "Apex Retail Group", contract: "Lead consulting", contact: "consult@apex.tech" },
    { name: "CloudScale Labs", contract: "Technical advisory", contact: "advisory@cloudscale.io" }
  ]
};

let currentErpModule = 'tasks';

function initMiniErpSandbox() {
  // Load tasks from safe storage if previously added
  const storedTasks = safeStorageGet('mini_erp_tasks');
  if (Array.isArray(storedTasks)) {
    erpDb.tasks = storedTasks;
  }

  const navItems = document.querySelectorAll('.erp-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      currentErpModule = item.getAttribute('data-module');
      renderErpModule();
    });
  });

  const createBtn = document.getElementById('erp-create-btn');
  if (createBtn) createBtn.addEventListener('click', openErpModal);

  const modalClose = document.getElementById('erp-modal-close');
  if (modalClose) modalClose.addEventListener('click', closeErpModal);

  const form = document.getElementById('erp-task-form');
  if (form) form.addEventListener('submit', createErpTask);

  const filter = document.getElementById('erp-filter-select');
  if (filter) filter.addEventListener('change', renderErpModule);

  renderErpModule();
}

function renderErpModule() {
  const listBody = document.getElementById('erp-table-body');
  const tableHeader = document.getElementById('erp-table-headers');
  const filter = document.getElementById('erp-filter-select');
  if (!listBody || !tableHeader || !filter) return;

  listBody.innerHTML = '';
  const filterVal = filter.value;

  if (currentErpModule === 'tasks') {
    tableHeader.innerHTML = `
      <th>ID</th>
      <th>Task Name</th>
      <th>Project</th>
      <th>Assignee</th>
      <th>Priority</th>
      <th>Status</th>
    `;
    let filtered = erpDb.tasks;
    if (filterVal !== 'all') {
      filtered = filtered.filter(t => t.status.toLowerCase().replace(' ', '-') === filterVal);
    }

    filtered.forEach(task => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono">${task.id}</td>
        <td><strong>${escapeHtml(task.name)}</strong></td>
        <td>${escapeHtml(task.project)}</td>
        <td>${escapeHtml(task.assignee)}</td>
        <td><span class="erp-priority-pill ${task.priority.toLowerCase()}">${task.priority}</span></td>
        <td>
          <button class="erp-status-toggle" data-task-id="${task.id}" title="Toggle Task Status">
            ${task.status}
          </button>
        </td>
      `;
      listBody.appendChild(tr);
    });

    listBody.querySelectorAll('.erp-status-toggle').forEach(btn => {
      btn.addEventListener('click', () => toggleTaskStatus(btn.getAttribute('data-task-id')));
    });

  } else if (currentErpModule === 'issues') {
    tableHeader.innerHTML = `
      <th>ID</th>
      <th>Issue Title</th>
      <th>Priority</th>
      <th>Reported By</th>
      <th>Status</th>
    `;
    erpDb.issues.forEach(issue => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-mono">${issue.id}</td>
        <td><strong>${escapeHtml(issue.title)}</strong></td>
        <td><span class="erp-priority-pill ${issue.priority.toLowerCase()}">${issue.priority}</span></td>
        <td>${escapeHtml(issue.logged_by)}</td>
        <td>
          <button class="erp-status-toggle" data-issue-id="${issue.id}">
            ${issue.status}
          </button>
        </td>
      `;
      listBody.appendChild(tr);
    });

    listBody.querySelectorAll('.erp-status-toggle').forEach(btn => {
      btn.addEventListener('click', () => toggleIssueStatus(btn.getAttribute('data-issue-id')));
    });

  } else if (currentErpModule === 'customers') {
    tableHeader.innerHTML = `
      <th>Client Name</th>
      <th>Engagement Type</th>
      <th>Primary Contact</th>
    `;
    erpDb.customers.forEach(cust => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHtml(cust.name)}</strong></td>
        <td>${escapeHtml(cust.contract)}</td>
        <td class="font-mono">${escapeHtml(cust.contact)}</td>
      `;
      listBody.appendChild(tr);
    });
  }
}

function toggleTaskStatus(id) {
  const task = erpDb.tasks.find(t => t.id === id);
  if (!task) return;
  const statuses = ['Open', 'In Progress', 'Closed'];
  const nextIdx = (statuses.indexOf(task.status) + 1) % statuses.length;
  task.status = statuses[nextIdx];
  safeStorageSet('mini_erp_tasks', erpDb.tasks);
  renderErpModule();
}

function toggleIssueStatus(id) {
  const issue = erpDb.issues.find(i => i.id === id);
  if (!issue) return;
  issue.status = issue.status === 'Open' ? 'Closed' : 'Open';
  renderErpModule();
}

function openErpModal() {
  const modal = document.getElementById('erp-task-modal');
  if (modal) modal.classList.add('open');
}

function closeErpModal() {
  const modal = document.getElementById('erp-task-modal');
  if (modal) modal.classList.remove('open');
}

function createErpTask(e) {
  e.preventDefault();
  const nameInput = document.getElementById('task-name');
  const projectInput = document.getElementById('task-project');
  const priorityInput = document.getElementById('task-priority');

  if (!nameInput || !nameInput.value.trim()) return;

  const newTask = {
    id: `TSK-${String(erpDb.tasks.length + 1).padStart(3, '0')}`,
    name: nameInput.value.trim(),
    project: projectInput ? projectInput.value : 'Custom App',
    assignee: 'Alex Carter',
    priority: priorityInput ? priorityInput.value : 'Medium',
    status: 'Open'
  };

  erpDb.tasks.unshift(newTask);
  safeStorageSet('mini_erp_tasks', erpDb.tasks);

  nameInput.value = '';
  closeErpModal();
  renderErpModule();
  window.unlockAchievement('erp-explorer');
}

/* ==========================================================================
   GIT TIMELINE & HOW I DEBUG
   ========================================================================== */
const COMMITS = [
  { hash: '8e4f1a0', date: '2019-04', type: 'feat', msg: 'Implement base Django REST Framework auth serializers', desc: 'Added JWT session authentication, unit tests, and relational schemas.' },
  { hash: '2a1b9c4', date: '2021-08', type: 'perf', msg: 'Offload report generation to async Celery workers', desc: 'Resolved Gunicorn worker timeouts by handling long-running exports asynchronously.' },
  { hash: '5c7e3d1', date: '2023-02', type: 'arch', msg: 'Introduce distributed Raft consensus state machine in Go', desc: 'Zero external dependencies; built custom LSM-tree storage engine.' },
  { hash: '9b2c8e0', date: '2024-06', type: 'refactor', msg: 'Bypass standard Frappe ORM for bulk ledger entries via PyPika', desc: 'Constructed parameterized bulk queries cutting MariaDB lock contention by 85%.' },
  { hash: 'f1a4e72', date: '2026-01', type: 'infra', msg: 'Deploy automated Kubernetes sandbox controller on AWS EKS', desc: 'Spins up ephemeral staging environments on branch pull request in < 90 seconds.' }
];

function initGitTimeline() {
  const list = document.getElementById('git-commits-list');
  const detailBox = document.getElementById('git-commit-detail');
  if (!list || !detailBox) return;

  list.innerHTML = '';
  COMMITS.forEach((commit, idx) => {
    const el = document.createElement('div');
    el.className = `git-commit-line ${idx === COMMITS.length - 1 ? 'active' : ''}`;
    el.innerHTML = `
      <span class="commit-hash">${commit.hash}</span>
      <span class="commit-msg"><span class="commit-prefix">${commit.type}:</span> ${commit.msg}</span>
      <span class="commit-date">${commit.date}</span>
    `;
    el.addEventListener('click', () => {
      document.querySelectorAll('.git-commit-line').forEach(line => line.classList.remove('active'));
      el.classList.add('active');
      showCommitDetail(commit);
    });
    list.appendChild(el);
  });

  showCommitDetail(COMMITS[COMMITS.length - 1]);
}

function showCommitDetail(commit) {
  const detailBox = document.getElementById('git-commit-detail');
  if (!detailBox) return;

  detailBox.innerHTML = `
    <div class="commit-detail-header">
      <span class="detail-hash">COMMIT: ${commit.hash}</span>
      <span class="detail-date">${commit.date}</span>
    </div>
    <div class="commit-detail-msg">${commit.type}: ${commit.msg}</div>
    <div class="commit-detail-diff">
      <span class="diff-line removed">- [LEGACY] Synchronous bottleneck</span><br>
      <span class="diff-line added">+ ${commit.desc}</span>
    </div>
  `;
}

const STAGES = {
  'stage-bug': {
    title: '1. Incident Reported',
    desc: 'Incident logged via Sentry, CloudWatch, or user error ticket. The issue is tagged with telemetry stack traces.',
    tools: ['Sentry', 'CloudWatch', 'Frappe Error Log']
  },
  'stage-repro': {
    title: '2. Isolated Reproduction',
    desc: 'Setting up deterministic sandbox environment and seed fixtures to consistently reproduce the issue.',
    tools: ['Docker sandbox', 'pytest', 'HTTP replay']
  },
  'stage-logs': {
    title: '3. Log & Lock Analysis',
    desc: 'Inspecting server traces, MariaDB lock wait states, and Redis queue delays.',
    tools: ['InnoDB Lock Monitor', 'Redis CLI', 'tail -f logs/*.log']
  },
  'stage-fix': {
    title: '4. Architectural Remediation',
    desc: 'Writing defensive code fix with optimistic concurrency, indexed queries, and atomic rollbacks.',
    tools: ['PyPika query builder', 'Go mutexes', 'Transaction contexts']
  },
  'stage-verify': {
    title: '5. Production Health Verification',
    desc: 'Monitoring post-deploy metric dashboards, p99 latency graphs, and zero-error thresholds.',
    tools: ['Prometheus', 'Grafana', 'Datadog']
  }
};

function initHowIDebug() {
  const stageNodes = document.querySelectorAll('.debug-pipeline-stage');
  const textTitle = document.getElementById('debug-details-title');
  const textDesc = document.getElementById('debug-details-desc');
  const toolsContainer = document.getElementById('debug-details-tools');

  if (!textTitle || !textDesc || !toolsContainer) return;

  stageNodes.forEach(node => {
    node.addEventListener('click', () => {
      stageNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const stageId = node.getAttribute('data-stage');
      const data = STAGES[stageId];
      if (data) {
        textTitle.textContent = data.title;
        textDesc.textContent = data.desc;
        toolsContainer.innerHTML = '';
        data.tools.forEach(tool => {
          const span = document.createElement('span');
          span.className = 'debug-tool-tag';
          span.textContent = tool;
          toolsContainer.appendChild(span);
        });
      }
    });
  });

  const firstNode = document.querySelector('.debug-pipeline-stage');
  if (firstNode) firstNode.click();
}

/* ==========================================================================
   BUILD PIPELINE SIMULATOR
   ========================================================================== */
function initPipelineSimulator() {
  const deployBtn = document.getElementById('pipeline-deploy-btn');
  if (deployBtn) {
    deployBtn.addEventListener('click', runPipelineSimulation);
  }
}

function runPipelineSimulation() {
  const logsEl = document.getElementById('pipeline-console-logs');
  const progressEl = document.getElementById('pipeline-progress-bar');
  const statusTextEl = document.getElementById('pipeline-status-text');
  const deployBtn = document.getElementById('pipeline-deploy-btn');

  if (!logsEl || !progressEl || !statusTextEl || !deployBtn) return;

  deployBtn.disabled = true;
  logsEl.innerHTML = '';
  progressEl.style.width = '0%';
  statusTextEl.textContent = 'BUILD IN PROGRESS...';
  statusTextEl.className = 'pipeline-status running';

  const steps = [
    { text: 'Initializing workflow runner node environment...', duration: 400, progress: 15 },
    { text: 'Running code linting scans (ruff, eslint)... PASSED.', duration: 350, progress: 35 },
    { text: 'Evaluating security sandboxes and dependencies... PASSED.', duration: 300, progress: 55 },
    { text: 'Executing suite integration tests (32 tests)... PASSED.', duration: 500, progress: 75 },
    { text: 'Building container images and pushing to registry... PASSED.', duration: 450, progress: 90 },
    { text: 'Deploying container workloads to AWS EKS cluster...', duration: 400, progress: 100 }
  ];

  let currentStep = 0;

  function runNextStep() {
    if (currentStep >= steps.length) {
      statusTextEl.textContent = 'DEPLOYMENT SUCCESSFUL ✓';
      statusTextEl.className = 'pipeline-status success';
      appendLogLine(`<span style="color:var(--success);">[SUCCESS] Production cluster verified healthy.</span>`);
      deployBtn.disabled = false;
      return;
    }

    const step = steps[currentStep];
    appendLogLine(`<span>$ ${step.text}</span>`);
    progressEl.style.width = `${step.progress}%`;

    setTimeout(() => {
      currentStep++;
      runNextStep();
    }, step.duration);
  }

  function appendLogLine(html) {
    const line = document.createElement('div');
    line.className = 'pipeline-log-line';
    line.innerHTML = html;
    logsEl.appendChild(line);
    logsEl.scrollTop = logsEl.scrollHeight;
  }

  runNextStep();
}

/* ==========================================================================
   DEMOTED DEVELOPER MODE & KONAMI CODE
   ========================================================================== */
function initDeveloperMode() {
  const toggleBtn = document.getElementById('devmode-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.body.classList.toggle('dev-mode-active');
      toggleBtn.classList.toggle('active', active);
    });
  }
}

function initKonamiCode() {
  const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let idx = 0;

  window.addEventListener('keydown', (e) => {
    if (e.key === seq[idx]) {
      idx++;
      if (idx === seq.length) {
        console.log('%c[Konami Code Activated] Retro Developer Mode Unlocked.', 'color:#3b82f6; font-size:14px; font-weight:bold;');
        idx = 0;
      }
    } else {
      idx = 0;
    }
  });

  // Quiet logo easter egg (no blocking alert)
  const logo = document.querySelector('.site-logo');
  if (logo) {
    let clickCount = 0;
    logo.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount === 5) {
        console.log('☕ Easter Egg: Coffee roaster initialized at 220°C. Systems nominal.');
        clickCount = 0;
      }
    });
  }
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function highlightJson(jsonStr) {
  return jsonStr.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? 'json-key' : 'json-string';
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return '<span class="' + cls + '">' + match + '</span>';
  });
}

/**
 * Main Entry Point for Lab
 */
export function initLab() {
  initPlaygroundTabs();
  initAchievements();
  initBugHunt();
  initApiPlayground();
  initMiniErpSandbox();
  initGitTimeline();
  initHowIDebug();
  initPipelineSimulator();
  initDeveloperMode();
  initKonamiCode();
}
