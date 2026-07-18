// Upgraded CLI Terminal Drawer Logic
(function() {
  const drawer = document.getElementById('terminal-drawer');
  const toggleBtn = document.getElementById('terminal-toggle');
  const closeBtn = document.getElementById('terminal-drawer-close');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!drawer || !input || !output) return;

  // Command History Cache
  const cmdHistory = [];
  let historyIndex = -1;

  // Track run count for achievements
  let commandRunCount = 0;

  // Available commands for autocomplete
  const COMMANDS = [
    'help', 'whoami', 'skills', 'experience', 'projects', 'project', 
    'stack', 'github', 'contact', 'theme', 'clear', 'sudo hire-me', 
    'rm -rf portfolio', 'coffee --status'
  ];

  const PROJECT_NAMES = ['nexis-erp', 'aether-db', 'synthanalyze', 'opsflow'];

  // Toggle terminal drawer
  function toggleTerminal() {
    const isOpen = drawer.classList.toggle('open');
    if (isOpen) {
      setTimeout(() => input.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleTerminal);
  if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);

  // Toggle terminal via backtick (`) keyboard shortcut
  window.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      e.preventDefault();
      toggleTerminal();
    }
    
    // Close terminal on ESC if open
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleTerminal();
    }
  });

  // Handle command execution, history, and autocomplete tab routing
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmdText = input.value.trim();
      input.value = '';

      if (cmdText) {
        // Cache history
        if (cmdHistory.length === 0 || cmdHistory[cmdHistory.length - 1] !== cmdText) {
          cmdHistory.push(cmdText);
        }
        historyIndex = -1;
        executeCommand(cmdText);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      if (historyIndex < cmdHistory.length - 1) {
        historyIndex++;
        input.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = cmdHistory[cmdHistory.length - 1 - historyIndex];
      } else if (historyIndex === 0) {
        historyIndex = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    }
  });

  function handleAutocomplete() {
    const rawVal = input.value;
    const val = rawVal.trim().toLowerCase();
    if (!val) return;

    // Check project subcommands
    if (val.startsWith('project ')) {
      const arg = val.substring(8);
      const matches = PROJECT_NAMES.filter(p => p.startsWith(arg));
      if (matches.length === 1) {
        input.value = `project ${matches[0]}`;
      } else if (matches.length > 1) {
        printLine(`Matching projects: ${matches.join(', ')}`);
      }
      return;
    }

    const matches = COMMANDS.filter(c => c.startsWith(val));
    if (matches.length === 1) {
      input.value = matches[0] + (matches[0] === 'project' ? ' ' : '');
    } else if (matches.length > 1) {
      printLine(`Autocomplete hints: ${matches.join('   ')}`);
    }
  }

  function printLine(text, isError = false, isHighlight = false) {
    const line = document.createElement('div');
    line.className = 'term-line';
    if (isError) line.classList.add('term-error');
    if (isHighlight) line.classList.add('term-highlight');
    line.innerHTML = text;
    
    // Insert line before the active command prompt line
    const promptLine = output.querySelector('.terminal-command-line');
    output.insertBefore(line, promptLine);
    
    // Scroll output container to bottom
    output.scrollTop = output.scrollHeight;
  }

  // Stagger prints lines to simulate network latency
  function printLinesStaggered(lines, delay = 50) {
    let index = 0;
    function printNext() {
      if (index >= lines.length) return;
      printLine(lines[index].text, lines[index].isError, lines[index].isHighlight);
      index++;
      setTimeout(printNext, delay);
    }
    printNext();
  }

  function executeCommand(cmd) {
    // Print echo of prompt command
    printLine(`<span class="terminal-prompt">guest@alex-carter:~$</span> ${cmd}`);

    // Track command achievements
    commandRunCount++;
    if (commandRunCount >= 5) {
      if (window.unlockAchievement) window.unlockAchievement('terminal-explorer');
    }

    const trimmedCmd = cmd.trim();
    const parts = trimmedCmd.split(' ');
    const baseCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    // Check specific sudo command interceptor
    if (trimmedCmd.toLowerCase() === 'sudo hire-me') {
      printLine('Password for guest: ******', false, true);
      setTimeout(() => {
        printLine('<span style="color:#10b981;">✓ Permission granted. Opening hiring portal...</span>');
        setTimeout(() => {
          toggleTerminal();
          const contactSec = document.getElementById('contact');
          if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
          }
          if (window.unlockAchievement) window.unlockAchievement('terminal-explorer');
        }, 1200);
      }, 800);
      return;
    }

    switch (baseCmd) {
      case 'help':
        printLinesStaggered([
          { text: 'Available Commands:', isHighlight: true },
          { text: '  <span class="term-highlight">whoami</span>       - Display developer summary profile' },
          { text: '  <span class="term-highlight">skills</span>       - List professional skillset' },
          { text: '  <span class="term-highlight">experience</span>   - Outline career milestones' },
          { text: '  <span class="term-highlight">projects</span>     - List key case studies' },
          { text: '  <span class="term-highlight">project &lt;id&gt;</span> - Open specific case study detail (e.g. project nexis-erp)' },
          { text: '  <span class="term-highlight">stack</span>        - Show development technology stack' },
          { text: '  <span class="term-highlight">github</span>       - Load Github profile in new tab' },
          { text: '  <span class="term-highlight">contact</span>      - Open direct contact form' },
          { text: '  <span class="term-highlight">theme</span>        - Toggle dashboard theme colors' },
          { text: '  <span class="term-highlight">clear</span>        - Clear terminal logs' },
          { text: '  <span class="term-highlight">sudo hire-me</span> - Hire the developer' }
        ], 30);
        break;

      case 'whoami':
        printLinesStaggered([
          { text: '<pre style="color:#a855f7;line-height:1.2;font-weight:bold;">' +
                  '  ___   _      ____ __  __\n' +
                  ' / _ \\ | |    |  __|\\ \\/ /\n' +
                  '|  _  || |__  |  __| >  < \n' +
                  '|_| |_||____| |____|/_/\\_\\</pre>' },
          { text: '<strong>Alex Carter</strong> — Lead Software Engineer & Systems Architect.' },
          { text: 'Driven by high-performance backend pipelines, decoupled microservices, and database tuning.' },
          { text: 'Specializes in constructing custom integrations on top of Frappe/ERPNext clusters.' }
        ], 40);
        break;

      case 'skills':
        printLinesStaggered([
          { text: 'Technical Skills Matrix:', isHighlight: true },
          { text: '  Languages: Python, Go (Golang), JavaScript/TypeScript, SQL' },
          { text: '  Backends:  Frappe, ERPNext, Django, FastAPI, Express' },
          { text: '  Cloud:     Kubernetes, Docker, AWS (EKS/RDS), Terraform, CI/CD' }
        ], 40);
        break;

      case 'experience':
        printLinesStaggered([
          { text: 'Professional Milestones:', isHighlight: true },
          { text: '  [2024-Present] Lead Systems Architect - Apex Tech Systems' },
          { text: '  [2021-2023]    Senior Software Engineer - CloudScale Labs' },
          { text: '  [2019-2021]    Software Developer - DevCore Integration Group' }
        ], 40);
        break;

      case 'projects':
        printLinesStaggered([
          { text: 'Key Projects:', isHighlight: true },
          { text: '  1. <span class="term-highlight">nexis-erp</span>    - Bulk synchronization system for ERPNext (85% reduction in latency)' },
          { text: '  2. <span class="term-highlight">aether-db</span>    - Distributed Key-Value store in Go using Raft consensus (50k writes/sec)' },
          { text: '  3. <span class="term-highlight">synthanalyze</span> - Real-time conversion funnel metrics charts via WebSockets' },
          { text: '  4. <span class="term-highlight">opsflow</span>      - Dynamic Kubernetes sandbox builder for branch staging (90s env spinup)' },
          { text: 'Tip: Use command <span class="term-highlight">project &lt;name&gt;</span> to open any project detail.' }
        ], 40);
        break;

      case 'project':
        if (!arg) {
          printLine('Error: Please specify a project name. Usage: project nexis-erp', true);
        } else if (!PROJECT_NAMES.includes(arg)) {
          printLine(`Error: Project "${arg}" not found. Available names: ${PROJECT_NAMES.join(', ')}`, true);
        } else {
          printLine(`Opening case study for ${arg}...`);
          setTimeout(() => {
            toggleTerminal();
            if (typeof window.openCaseStudy === 'function') {
              window.openCaseStudy(arg);
            } else {
              printLine('Error: Case study viewer failed to load.', true);
            }
          }, 600);
        }
        break;

      case 'stack':
        printLinesStaggered([
          { text: 'Core Stack Configuration:', isHighlight: true },
          { text: '  - Web Framework: Python (Django/FastAPI), Node.js' },
          { text: '  - ERP System:    Frappe v15/v16 Custom Apps, ERPNext Custom Hooks' },
          { text: '  - Cache/Queue:  Redis, RQ queues, Celery worker layers' },
          { text: '  - Datastore:    MariaDB Cluster (Galera), PostgreSQL, Raft KV Store' },
          { text: '  - Operations:   Kubernetes (EKS), Terraform configurations, GitHub Actions CI' }
        ], 30);
        break;

      case 'github':
        printLine('Redirecting to developer GitHub profile in a new tab...');
        window.open('https://github.com', '_blank');
        break;

      case 'contact':
        printLine('Scrolling down to contact form...');
        toggleTerminal();
        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'theme':
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
          toggle.click();
          const currentTheme = document.documentElement.getAttribute('data-theme');
          printLine(`Theme switched successfully to: <span class="term-highlight">${currentTheme.toUpperCase()}</span> mode.`);
        } else {
          printLine('Error: Theme manager not loaded.', true);
        }
        break;

      case 'clear':
        const lines = output.querySelectorAll('.term-line');
        lines.forEach(line => line.remove());
        break;

      // Easter Eggs
      case 'rm':
        if (arg === '-rf portfolio' || arg === '-rf') {
          printLine('<span style="color:#ef4444;font-weight:bold;">Access Denied. Nice try. Production protection enabled.</span>');
        } else {
          printLine('rm: command not permitted.', true);
        }
        break;

      case 'coffee':
        if (arg === '--status') {
          printLinesStaggered([
            { text: 'Brew status: Completed.' },
            { text: 'Vessel load: 85% full (Arabica Medium Roast)' },
            { text: 'Temperature: 220°C' },
            { text: '<span style="color:#e879f9;">HTTP Code: 418 I\'m a teapot</span>' }
          ], 40);
        } else {
          printLine('Usage: coffee --status');
        }
        break;

      default:
        printLine(`bash: command not found: ${baseCmd}. Type <span class="term-highlight">help</span> for a list of available commands.`, true);
        break;
    }
  }
})();
