// Developer Playground Features Logic
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    // Register playground modules
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
  });

  /* ==========================================================================
     ACHIEVEMENTS SYSTEM
     ========================================================================== */
  const ACHIEVEMENTS = {
    'terminal-explorer': { name: 'Terminal Explorer', desc: 'Execute 5 commands in the interactive CLI.' },
    'bug-hunter': { name: 'Bug Hunter', desc: 'Identify and fix a bug in the code editor.' },
    'api-tester': { name: 'API Tester', desc: 'Send your first HTTP mock API request.' },
    'code-reviewer': { name: 'Master Debugger', desc: 'Resolve Easy, Medium, and Hard bugs.' },
    'erp-explorer': { name: 'ERP Explorer', desc: 'Create a custom Task in the Mini ERP workspace.' },
    'keyboard-ninja': { name: 'Keyboard Ninja', desc: 'Trigger the global command palette (Ctrl+K).' },
    'curious-developer': { name: 'Curious Developer', desc: 'Visit every section of the playground.' }
  };

  const visitedTabs = new Set(['bug-hunt']);

  function initAchievements() {
    let unlocked = JSON.parse(localStorage.getItem('dev_achievements') || '[]');
    updateAchievementsUI(unlocked);
  }

  window.unlockAchievement = function(id) {
    if (!ACHIEVEMENTS[id]) return;
    let unlocked = JSON.parse(localStorage.getItem('dev_achievements') || '[]');
    if (unlocked.includes(id)) return;

    unlocked.push(id);
    localStorage.setItem('dev_achievements', JSON.stringify(unlocked));
    updateAchievementsUI(unlocked);
    showAchievementToast(ACHIEVEMENTS[id]);
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

    if (window.lucide) window.lucide.createIcons();
  }

  function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-trophy"><i data-lucide="trophy"></i></div>
      <div class="toast-details">
        <span class="toast-title">Achievement Unlocked!</span>
        <span class="toast-name">${achievement.name}</span>
      </div>
    `;
    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ==========================================================================
     PLAYGROUND TABS CONTROLLER
     ========================================================================== */
  function initPlaygroundTabs() {
    const tabs = document.querySelectorAll('.playground-tab');
    const panels = document.querySelectorAll('.playground-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePanel = document.getElementById(`panel-${target}`);
        if (activePanel) activePanel.classList.add('active');

        // Track tab exploration
        visitedTabs.add(target);
        if (visitedTabs.size === tabs.length) {
          window.unlockAchievement('curious-developer');
        }
      });
    });
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
      bugLine: 2, // 0-indexed index in code
      options: [
        { text: 'change to: for (let i = 0; i < arr.length; i++) {', correct: true },
        { text: 'change to: for (let i = 1; i <= arr.length; i++) {', correct: false },
        { text: 'change to: for (let i = 0; i < arr.length - 1; i++) {', correct: false }
      ],
      tests: [
        { input: '[1, 5, 3]', expected: '5' }
      ]
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
      tests: [
        { input: 'append_to_list("B")', expected: '["B"]' }
      ]
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
      tests: [
        { input: '[101]', expected: '[{id: 101, name: "User"}]' }
      ]
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
    selectedLineIndex = null;
    selectedOptionIndex = null;
    bugStartTime = Date.now();

    const descEl = document.getElementById('bughunt-desc');
    const editorEl = document.getElementById('bughunt-code-lines');
    const optionsEl = document.getElementById('bughunt-options-list');
    const outputEl = document.getElementById('bughunt-console-output');

    if (descEl) descEl.textContent = challenge.desc;
    if (outputEl) {
      outputEl.innerHTML = `<span class="console-placeholder">Waiting for execution... Select bug line and fix option.</span>`;
      outputEl.className = 'bughunt-console-output';
    }

    // Load editor lines
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
          checkInteractAchievement();
        });
        editorEl.appendChild(lineDiv);
      });
    }

    // Load multiple choice options
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

  function checkInteractAchievement() {
    window.unlockAchievement('code-reviewer');
  }

  function runBugHuntTest() {
    const outputEl = document.getElementById('bughunt-console-output');
    if (!outputEl) return;

    if (selectedLineIndex === null) {
      outputEl.innerHTML = `<span style="color:#f87171;">[ERR] No line selected. Please click on the line containing the bug.</span>`;
      return;
    }

    if (selectedOptionIndex === null) {
      outputEl.innerHTML = `<span style="color:#f87171;">[ERR] No fix solution chosen. Select a radio button fix option.</span>`;
      return;
    }

    attemptsCount++;
    document.getElementById('stat-attempts').textContent = attemptsCount;

    outputEl.innerHTML = `<span style="color:#60a5fa;">Running test suites...</span><br><span class="console-spinner"></span>`;
    outputEl.className = 'bughunt-console-output active';

    const challenge = CHALLENGES[activeDiff];
    const isCorrectLine = selectedLineIndex === challenge.bugLine;
    const isCorrectFix = challenge.options[selectedOptionIndex].correct;

    setTimeout(() => {
      if (isCorrectLine && isCorrectFix) {
        outputEl.innerHTML = `
          <span style="color:#10b981;">$ python test_suite.py</span><br>
          <span style="color:#38bdf8;">Running unit test: Test 1 (Input: ${challenge.tests[0].input})</span><br>
          <span style="color:#10b981;">✓ Assertion OK: Result matches expected output: ${challenge.tests[0].expected}</span><br><br>
          <span class="success-banner" style="color:#10b981; font-weight:bold;">Bug Fixed Successfully ✓</span>
        `;
        solvedChallenges.add(activeDiff);
        document.getElementById('stat-solved').textContent = solvedChallenges.size;

        const timeTaken = Math.round((Date.now() - bugStartTime) / 1000);
        const fastestEl = document.getElementById('stat-fastest');
        const currFastest = parseInt(fastestEl.textContent);
        if (currFastest === 0 || timeTaken < currFastest) {
          fastestEl.textContent = `${timeTaken}s`;
        }

        window.unlockAchievement('bug-hunter');

        if (solvedChallenges.size === 3) {
          window.unlockAchievement('code-reviewer');
        }
      } else {
        const errorMsg = !isCorrectLine 
          ? `[FAIL] Line ${selectedLineIndex + 1} does not seem to contain the primary bug. Tests failed.`
          : `[FAIL] Selected fix is incorrect. Code throws a syntax or logical error.`;
        outputEl.innerHTML = `
          <span style="color:#f87171;">$ run compiler</span><br>
          <span style="color:#f87171;">AssertionError: Test execution failed.</span><br>
          <span style="color:#ef4444;">${errorMsg}</span>
        `;
      }
    }, 1200);
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
        bio: "Full stack engineer specializing in Python/FastAPI/Django, ERP integrations, and cloud infrastructure.",
        github: "github.com/developer",
        status: "Available for technical advising and consulting contract roles"
      }
    },
    'GET /api/skills': {
      status: 200,
      statusText: 'OK',
      data: {
        languages: ["Python", "JavaScript", "TypeScript", "Go (Golang)", "SQL"],
        frameworks: ["Frappe Framework", "ERPNext", "Django", "FastAPI", "React", "Node.js"],
        infrastructure: ["Docker", "Kubernetes", "AWS EKS/RDS", "Terraform", "GitHub Actions CI/CD"]
      }
    },
    'GET /api/projects': {
      status: 200,
      statusText: 'OK',
      data: [
        { name: "Nexis ERP Sync", tech: "Frappe, Python, MariaDB, Redis", impact: "Reduced sync times by 85%" },
        { name: "Aether Key-Value DB", tech: "Golang, Raft Consensus", speed: "50k writes/sec" },
        { name: "Opsflow stage sandbox", tech: "Kubernetes, Go, Docker", deployTime: "90s provisioning" }
      ]
    },
    'GET /api/experience': {
      status: 200,
      statusText: 'OK',
      data: [
        { period: "2024-Present", role: "Lead Architect", company: "Apex Tech Systems" },
        { period: "2021-2023", role: "Senior Software Engineer", company: "CloudScale Labs" },
        { period: "2019-2021", role: "Software Developer", company: "DevCore Group" }
      ]
    },
    'GET /api/currently-learning': {
      status: 200,
      statusText: 'OK',
      data: {
        topics: ["Rust multi-threaded concurrency", "WebGPU shader programming", "Advanced vector embeddings db optimization"],
        est_competence: "Actively studying, code repository experiments underway"
      }
    },
    'POST /api/contact': {
      status: 201,
      statusText: 'Created',
      data: {
        message: "Message received successfully. Thank you for connecting!",
        timestamp: new Date().toISOString(),
        deliveryStatus: "Dispatched to developer slack/email inbox"
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
      
      methodTag.textContent = method;
      methodTag.className = `api-method ${method.toLowerCase()}`;

      if (method === 'POST') {
        reqBodyContainer.style.display = 'block';
      } else {
        reqBodyContainer.style.display = 'none';
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
    const response = ENDPOINTS[endpoint];

    // Reset details
    statusEl.textContent = '---';
    statusEl.className = 'res-status';
    timeEl.textContent = '---';
    sizeEl.textContent = '---';
    outputEl.innerHTML = `<span style="color:#60a5fa;">Awaiting server response... Connecting to endpoint proxy...</span><br><span class="console-spinner"></span>`;

    const start = Date.now();
    const mockLatency = 150 + Math.floor(Math.random() * 250);

    setTimeout(() => {
      const duration = Date.now() - start;
      
      // Compute size
      const jsonStr = JSON.stringify(response.data, null, 2);
      const byteSize = new Blob([jsonStr]).size;

      statusEl.textContent = `${response.status} ${response.statusText}`;
      statusEl.className = `res-status code-${response.status}`;
      timeEl.textContent = `${duration}ms`;
      sizeEl.textContent = `${(byteSize / 1024).toFixed(2)} KB`;

      // Render highlighted JSON
      outputEl.innerHTML = highlightJson(jsonStr);

      window.unlockAchievement('api-tester');
    }, mockLatency);
  }

  /* ==========================================================================
     MINI ERP / FRAPPE SANDBOX
     ========================================================================= */
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
    if (createBtn) {
      createBtn.addEventListener('click', openErpModal);
    }

    const modalClose = document.getElementById('erp-modal-close');
    if (modalClose) {
      modalClose.addEventListener('click', closeErpModal);
    }

    const form = document.getElementById('erp-task-form');
    if (form) {
      form.addEventListener('submit', createErpTask);
    }

    const filter = document.getElementById('erp-filter-select');
    if (filter) {
      filter.addEventListener('change', renderErpModule);
    }

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
        filtered = erpDb.tasks.filter(t => t.status === filterVal);
      }

      filtered.forEach(task => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="doc-link">${task.id}</span></td>
          <td><strong>${task.name}</strong></td>
          <td>${task.project}</td>
          <td>${task.assignee}</td>
          <td><span class="pri-badge ${task.priority.toLowerCase()}">${task.priority}</span></td>
          <td><span class="status-badge ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
        `;
        
        tr.addEventListener('click', () => {
          toggleTaskStatus(task.id);
          window.unlockAchievement('erp-explorer');
        });
        listBody.appendChild(tr);
      });
    } else if (currentErpModule === 'issues') {
      tableHeader.innerHTML = `
        <th>ID</th>
        <th>Issue Description</th>
        <th>Priority</th>
        <th>Logged By</th>
        <th>Status</th>
      `;
      let filtered = erpDb.issues;
      if (filterVal !== 'all') {
        filtered = erpDb.issues.filter(i => i.status === filterVal);
      }

      filtered.forEach(issue => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="doc-link">${issue.id}</span></td>
          <td><strong>${issue.title}</strong></td>
          <td><span class="pri-badge ${issue.priority.toLowerCase()}">${issue.priority}</span></td>
          <td>${issue.logged_by}</td>
          <td><span class="status-badge ${issue.status.toLowerCase()}">${issue.status}</span></td>
        `;
        tr.addEventListener('click', () => {
          toggleIssueStatus(issue.id);
          window.unlockAchievement('erp-explorer');
        });
        listBody.appendChild(tr);
      });
    } else if (currentErpModule === 'customers') {
      tableHeader.innerHTML = `
        <th>Name</th>
        <th>Active Contract</th>
        <th>Contact Address</th>
      `;
      erpDb.customers.forEach(cust => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${cust.name}</strong></td>
          <td><span class="doc-link">${cust.contract}</span></td>
          <td><a href="mailto:${cust.contact}" style="color:var(--accent-color);">${cust.contact}</a></td>
        `;
        listBody.appendChild(tr);
      });
    } else if (currentErpModule === 'reports') {
      tableHeader.innerHTML = `<th>Report Summary Metrics</th><th>Value</th>`;
      
      const openTasks = erpDb.tasks.filter(t => t.status !== 'Closed').length;
      const openIssues = erpDb.issues.filter(i => i.status !== 'Closed').length;

      listBody.innerHTML = `
        <tr><td><strong>Total active consulting projects</strong></td><td>3 ongoing</td></tr>
        <tr><td><strong>Pending open tasks</strong></td><td><span style="color:#ef4444;font-weight:bold;">${openTasks} tasks</span></td></tr>
        <tr><td><strong>Critical unresolved bugs in queue</strong></td><td><span style="color:#eab308;font-weight:bold;">${openIssues} bugs</span></td></tr>
        <tr><td><strong>Database server CPU load average (mock)</strong></td><td><span style="color:#10b981;font-weight:bold;">12.4%</span></td></tr>
      `;
    }
  }

  function toggleTaskStatus(id) {
    const task = erpDb.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === 'Open') task.status = 'In Progress';
    else if (task.status === 'In Progress') task.status = 'Closed';
    else task.status = 'Open';
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
    if (modal) modal.style.display = 'flex';
  }

  function closeErpModal() {
    const modal = document.getElementById('erp-task-modal');
    if (modal) modal.style.display = 'none';
  }

  function createErpTask(e) {
    e.preventDefault();
    const nameInput = document.getElementById('erp-task-name');
    const projInput = document.getElementById('erp-task-project');
    const priSelect = document.getElementById('erp-task-priority');

    if (!nameInput || !projInput || !priSelect) return;

    const count = erpDb.tasks.length + 1;
    const newTask = {
      id: `TSK-00${count}`,
      name: nameInput.value,
      project: projInput.value,
      assignee: "Alex Carter",
      priority: priSelect.value,
      status: "Open"
    };

    erpDb.tasks.unshift(newTask);
    nameInput.value = '';
    projInput.value = '';

    closeErpModal();
    renderErpModule();
    window.unlockAchievement('erp-explorer');
  }

  /* ==========================================================================
     GIT COMMIT TIMELINE
     ========================================================================== */
  const COMMITS = [
    {
      hash: 'a12b98d',
      type: 'feat',
      msg: 'started programming journey',
      date: 'Aug 2018',
      desc: 'Compiled first Hello World program. Deep dived into object-oriented concepts, algorithms, and fundamental computer architectures.'
    },
    {
      hash: 'c45e89a',
      type: 'feat',
      msg: 'learned Python and Django',
      date: 'Feb 2019',
      desc: 'Discovered python web environments. Built database-driven backends, integrated PostgreSQL models, and designed responsive web templates.'
    },
    {
      hash: 'f67d23b',
      type: 'feat',
      msg: 'explored REST API development',
      date: 'Dec 2020',
      desc: 'Engineered high-concurrency microservices, managed background task queue processing via Celery and Redis, and optimized API serialization structures.'
    },
    {
      hash: 'd89e56c',
      type: 'feat',
      msg: 'started working with Frappe Framework',
      date: 'May 2022',
      desc: 'Adopted the meta-data driven Frappe Framework. Mastered site multi-tenancy, custom DocType definitions, whitelisted server controllers, and site patches.'
    },
    {
      hash: 'b12c78f',
      type: 'feat',
      msg: 'built ERPNext customizations',
      date: 'Oct 2023',
      desc: 'Implemented custom logistics hooks, decoupled standard transactional processes to minimize locks, and built custom script reports for retail giants.'
    },
    {
      hash: 'e45d901',
      type: 'fix',
      msg: 'survived production bugs',
      date: 'Mar 2024',
      desc: 'Fought deadlocks under heavy write cycles, resolved N+1 ORM query loops, configured container orchestrators, and automated incident recovery runs.'
    },
    {
      hash: 'c89a123',
      type: 'refactor',
      msg: 'improved development practices',
      date: 'Nov 2024',
      desc: 'Adopted rigorous static analysis tools, integrated GitHub Actions CI/CD workflows, formatted lint hooks, and mentored junior coders.'
    },
    {
      hash: 'a56e789',
      type: 'perf',
      msg: 'optimized problem-solving skills',
      date: 'Jun 2025',
      desc: 'Transitioned towards systems architecture. Focused on high-velocity data pipelines, caching tiers, and optimal service layouts.'
    },
    {
      hash: 'f12b34c',
      type: 'chore',
      msg: 'still learning every day',
      date: 'Present',
      desc: 'Studying multi-threaded systems in Rust, shaders on WebGPU, and performance tunings in PostgreSQL/MariaDB structures.'
    }
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
        <span class="diff-line removed">- Junior Mindset / Restrictive Skills</span><br>
        <span class="diff-line added">+ ${commit.desc}</span>
      </div>
    `;
  }

  /* ==========================================================================
     HOW I DEBUG INTERACTIVE STORY
     ========================================================================== */
  const STAGES = {
    'stage-bug': {
      title: '1. Bug Report Logged',
      desc: 'An incident report is logged via Sentry, GitHub Issues, or custom ERP logs. It could range from a simple frontend syntax warning to a database timeout.',
      tools: ['Sentry', 'Error Log DocType', 'Client Browser Console', 'AWS CloudWatch']
    },
    'stage-repro': {
      title: '2. Reproduce Issue',
      desc: 'Isolating the environment. Setting up test cases, local sandbox runs, or testing with specific user configurations to confirm the bug is reproducible.',
      tools: ['Local docker-compose sandbox', 'Postman requests', 'Faker seeding tools']
    },
    'stage-logs': {
      title: '3. Inspect System Logs',
      desc: 'Sifting through server files and database tracking. Checking Frappe log files, Gunicorn error logs, Nginx access records, and Celery worker printouts.',
      tools: ['bench watch', 'tail -f logs/*.log', 'Redis CLI monitor', 'docker logs']
    },
    'stage-trace': {
      title: '4. Trace Code Flow',
      desc: 'Walking through execution step-by-step. Setting up debug breakpoints, inspecting frames, and assessing which conditional blocks are active.',
      tools: ['VS Code Debugger', 'python -m pdb', 'Chrome DevTools debugger']
    },
    'stage-db': {
      title: '5. Assess Database Load',
      desc: 'Auditing connection logs, locking hierarchies, and database indexes. Profiling slow queries or examining InnoDB lock statuses under transaction runs.',
      tools: ['MySQL Slow Query Log', 'EXPLAIN query;', 'SHOW ENGINE INNODB STATUS']
    },
    'stage-cause': {
      title: '6. Identify Root Cause',
      desc: 'Understanding the underlying failure, such as race conditions, race loops, division by zero, memory leakage, or mismatched API configurations.',
      tools: ['Git diff checks', 'Code flow charts', 'Technical specification docs']
    },
    'stage-fix': {
      title: '7. Implement Optimal Fix',
      desc: 'Writing a clean code correction. Ensuring structural efficiency, adding defensive checks, and optimizing database statements where appropriate.',
      tools: ['Monospace Editor', 'Optimistic Locking hooks', 'Atomic transaction wrappers']
    },
    'stage-test': {
      title: '8. Write Automated Tests',
      desc: 'Guaranteeing the bug does not reappear. Writing regression unit tests and system tests using standard frameworks to test boundaries.',
      tools: ['pytest', 'IntegrationTestCase (Frappe)', 'unittest (Python)']
    },
    'stage-checks': {
      title: '9. Pre-commit Analysis',
      desc: 'Running local check hooks. Formatting codebase variables, reviewing variables typing rules, and inspecting security sandboxes before committing.',
      tools: ['Ruff formatter', 'Pre-commit scripts', 'Semgrep analysis tools']
    },
    'stage-deploy': {
      title: '10. Build Integration Deploy',
      desc: 'Deploying the branch code changes via CI/CD test suites. Pushing configurations, upgrading assets, running server database migrations.',
      tools: ['GitHub Actions pipeline', 'Helm charts', 'bench migrate commands']
    },
    'stage-verify': {
      title: '11. Verify Production Health',
      desc: 'Confirming resolution. Re-evaluating error logging metrics, inspecting live execution statistics, and checking dashboard metrics.',
      tools: ['Sentry dashboard', 'Prometheus monitoring', 'Grafana charts']
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
    statusTextEl.innerHTML = `BUILD RUNNING...`;
    statusTextEl.className = 'pipeline-status running';

    const steps = [
      { text: 'Initializing workflow runtime node environment...', duration: 600, progress: 10 },
      { text: 'Installing package dependencies via npm...', duration: 800, progress: 25 },
      { text: 'Running code linting scans (eslint, ruff)... SUCCESS.', duration: 500, progress: 40 },
      { text: 'Evaluating pre-commit checks and sandbox variables... SUCCESS.', duration: 400, progress: 50 },
      { text: 'Executing suite integration tests (32 tests)... SUCCESS.', duration: 900, progress: 75 },
      { text: 'Compiling production assets & minifying bundles... SUCCESS.', duration: 600, progress: 90 },
      { text: 'Deploying docker containers to AWS EKS cluster...', duration: 700, progress: 100 }
    ];

    const failStepIdx = Math.random() < 0.25 ? 4 : -1;
    if (failStepIdx !== -1) {
      steps[4] = { text: 'Executing suite integration tests (32 tests)...', duration: 800, progress: 70, fail: true };
    }

    let currentStep = 0;

    function runNextStep() {
      if (currentStep >= steps.length) {
        statusTextEl.innerHTML = `<i data-lucide="check-circle" style="display:inline;width:16px;height:16px;"></i> Deployment Successful ✓`;
        statusTextEl.className = 'pipeline-status success';
        appendLogLine(`<span style="color:#10b981;">[SUCCESS] Portfolio successfully built and served live!</span>`);
        appendLogLine(`<span style="color:#38bdf8;">Production URL: <a href="https://alexcarter.dev" target="_blank" style="color:#e879f9;">https://alexcarter.dev</a></span>`);
        deployBtn.disabled = false;
        deployBtn.textContent = 'Trigger Deploy';
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const step = steps[currentStep];
      appendLogLine(`<span>$ ${step.text}</span>`);
      progressEl.style.width = `${step.progress}%`;

      setTimeout(() => {
        if (step.fail) {
          statusTextEl.innerHTML = `<i data-lucide="alert-circle" style="display:inline;width:16px;height:16px;"></i> Deployment Failed ✗`;
          statusTextEl.className = 'pipeline-status failed';
          appendLogLine(`<span style="color:#ef4444;">[ERROR] AssertionError: test_analytics.js failed. Expected status 200, received 500.</span>`);
          appendLogLine(`<span style="color:#f87171;">[ERROR] Build pipeline aborted. Exited with code 1.</span>`);
          deployBtn.disabled = false;
          deployBtn.textContent = 'Retry Build';
          if (window.lucide) window.lucide.createIcons();
          return;
        }

        currentStep++;
        runNextStep();
      }, step.duration);
    }

    function appendLogLine(html) {
      const div = document.createElement('div');
      div.className = 'log-line';
      div.innerHTML = html;
      logsEl.appendChild(div);
      logsEl.scrollTop = logsEl.scrollHeight;
    }

    runNextStep();
  }

  /* ==========================================================================
     DEVELOPER MODE SWITCH
     ========================================================================== */
  let devModeActive = false;

  function initDeveloperMode() {
    const toggle = document.getElementById('devmode-toggle-btn');
    if (!toggle) return;

    toggle.addEventListener('click', toggleDeveloperMode);
  }

  function toggleDeveloperMode() {
    devModeActive = !devModeActive;
    const body = document.body;
    const toggleBtn = document.getElementById('devmode-toggle-btn');
    
    if (devModeActive) {
      body.classList.add('dev-mode-enabled');
      if (toggleBtn) {
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = `&lt;/&gt; Developer Mode: ON`;
      }
      showDevModeStatsPanel();
      injectComponentTags();
    } else {
      body.classList.remove('dev-mode-enabled');
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        toggleBtn.innerHTML = `&lt;/&gt; Developer Mode`;
      }
      removeDevModeStatsPanel();
      removeComponentTags();
    }
  }

  function showDevModeStatsPanel() {
    let panel = document.getElementById('devmode-stats-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'devmode-stats-panel';
      panel.innerHTML = `
        <div class="devmode-panel-title">System Metrics</div>
        <div class="devmode-stat-row">DOM Load: <span>142ms</span></div>
        <div class="devmode-stat-row">WebGL Particles: <span>70 sprites</span></div>
        <div class="devmode-stat-row">FPS: <span style="color:#10b981;">60</span></div>
        <div class="devmode-stat-row">Images Optimized: <span>100%</span></div>
      `;
      document.body.appendChild(panel);
    }
  }

  function removeDevModeStatsPanel() {
    const panel = document.getElementById('devmode-stats-panel');
    if (panel) panel.remove();
  }

  function injectComponentTags() {
    const mappings = [
      { selector: '#hero', name: 'Component: HeroSection | SSR' },
      { selector: '#about', name: 'Component: AboutSection | CSR' },
      { selector: '#projects', name: 'Component: ProjectGallery | Hydrated' },
      { selector: '#experience', name: 'Component: WorkTimeline | Static' },
      { selector: '#skills', name: 'Component: SkillMatrix | Data-bind' },
      { selector: '#playground', name: 'Component: DeveloperPlayground | Interactive' }
    ];

    mappings.forEach(map => {
      const el = document.querySelector(map.selector);
      if (el) {
        el.style.position = 'relative';
        const badge = document.createElement('div');
        badge.className = 'dev-component-badge';
        badge.textContent = map.name;
        el.appendChild(badge);
      }
    });
  }

  function removeComponentTags() {
    document.querySelectorAll('.dev-component-badge').forEach(b => b.remove());
  }

  /* ==========================================================================
     EASTER EGGS & KONAMI CODE
     ========================================================================== */
  const konamiSeq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIdx = 0;

  function initKonamiCode() {
    window.addEventListener('keydown', (e) => {
      if (e.key === konamiSeq[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === konamiSeq.length) {
          triggerKonamiEgg();
          konamiIdx = 0;
        }
      } else {
        konamiIdx = 0;
      }
    });

    const logo = document.querySelector('.nav-logo');
    if (logo) {
      let clickCount = 0;
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        clickCount++;
        if (clickCount === 5) {
          triggerLogoEgg();
          clickCount = 0;
        }
      });
    }
  }

  function triggerKonamiEgg() {
    const overlay = document.createElement('div');
    overlay.className = 'matrix-easter-egg';
    overlay.innerHTML = `
      <div class="matrix-text">SYSTEM OVERRIDE DETECTED... WELCOME ARCHITECT.</div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 1000);
    }, 3000);

    window.unlockAchievement('keyboard-ninja');
  }

  function triggerLogoEgg() {
    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.style.transform = 'scale(1.3) rotate(360deg)';
      logo.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      setTimeout(() => {
        logo.style.transform = '';
      }, 1000);
    }
    alert("☕ Easter Egg Unlocked: Coffee loader loaded at 220°C! Developer log: Keep clicking.");
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
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

})();
