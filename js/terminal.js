import { getActiveFeatureFlags } from '../data/content.js';

export function initTerminal() {
  const drawer = document.getElementById('terminal-drawer');
  const toggleBtn = document.getElementById('terminal-toggle');
  const closeBtn = document.getElementById('terminal-drawer-close');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!drawer || !input || !output) return;

  const flags = getActiveFeatureFlags();
  if (flags?.features && flags.features.terminalDrawer === false) {
    if (toggleBtn) toggleBtn.style.display = 'none';
    drawer.style.display = 'none';
    return;
  }

  const cmdHistory = [];
  let historyIndex = -1;

  const COMMANDS = [
    'help', 'whoami', 'skills', 'experience', 'projects', 'project',
    'stack', 'github', 'contact', 'theme', 'clear', 'sudo hire-me',
    'admin', 'coffee --status'
  ];


  const PROJECT_NAMES = ['nexis-erp', 'aether-db', 'opsflow', 'synthanalyze'];

  function toggleTerminal() {
    const isOpen = drawer.classList.toggle('open');
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => input.focus(), 100);
      if (window.unlockAchievement) {
        window.unlockAchievement('terminal-explorer');
      }
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleBtn?.addEventListener('click', toggleTerminal);
  closeBtn?.addEventListener('click', toggleTerminal);

  // Safe global keyboard listener for backtick
  window.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      const activeTag = document.activeElement ? document.activeElement.tagName : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement.isContentEditable) {
        return; // Allow typing backticks in forms or code editors
      }
      e.preventDefault();
      toggleTerminal();
    }

    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleTerminal();
    }
  });

  // Terminal Input Key handling
  input.addEventListener('keydown', (e) => {
    // Autocomplete via Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
      return;
    }

    // Command History UP
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = cmdHistory[historyIndex];
      }
      return;
    }

    // Command History DOWN
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        historyIndex++;
        input.value = cmdHistory[historyIndex];
      } else {
        historyIndex = cmdHistory.length;
        input.value = '';
      }
      return;
    }

    // Execute Command on Enter
    if (e.key === 'Enter') {
      const rawCmd = input.value.trim();
      input.value = '';

      if (rawCmd) {
        cmdHistory.push(rawCmd);
        historyIndex = cmdHistory.length;
        executeCommand(rawCmd);
      }
    }
  });

  function handleAutocomplete() {
    const currentVal = input.value.trim().toLowerCase();
    if (!currentVal) return;

    if (currentVal.startsWith('project ')) {
      const projPrefix = currentVal.replace('project ', '').trim();
      const match = PROJECT_NAMES.find(p => p.startsWith(projPrefix));
      if (match) input.value = `project ${match}`;
      return;
    }

    const match = COMMANDS.find(c => c.startsWith(currentVal));
    if (match) input.value = match;
  }

  function appendOutput(html) {
    const line = document.createElement('div');
    line.className = 'terminal-log-line';
    line.innerHTML = html;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function executeCommand(raw) {
    appendOutput(`<div class="terminal-cmd-echo"><span class="terminal-prompt">guest@alex-carter:~$</span> ${escapeHtml(raw)}</div>`);

    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim().toLowerCase();

    switch (cmd) {
      case 'help':
        appendOutput(`
          <div class="terminal-table">
            <div><span class="term-cyan">whoami</span> - Developer overview and value proposition</div>
            <div><span class="term-cyan">stack</span> - Core technical competencies and tooling</div>
            <div><span class="term-cyan">experience</span> - Recent engineering leadership history</div>
            <div><span class="term-cyan">projects</span> - Production systems and architectures</div>
            <div><span class="term-cyan">project &lt;name&gt;</span> - Deep dive (nexis-erp, aether-db, opsflow)</div>
            <div><span class="term-cyan">theme</span> - Toggle between dark and light UI modes</div>
            <div><span class="term-cyan">sudo hire-me</span> - Route to priority contact form</div>
            <div><span class="term-cyan">clear</span> - Clear terminal session output</div>
          </div>
        `);
        break;

      case 'whoami':
        appendOutput(`
          <p><strong>Alex Carter</strong> — Lead Software Engineer & Systems Architect</p>
          <p>8+ years building enterprise ERP, high-throughput Python/Go backends, and Kubernetes platforms.</p>
          <p>Availability: Available for Staff / Lead Architecture Roles</p>
        `);
        break;

      case 'stack':
      case 'skills':
        appendOutput(`
          <p><strong>Languages:</strong> Python, Go (Golang), SQL, TypeScript, HTML5/CSS3</p>
          <p><strong>ERP & Business:</strong> Frappe Framework, ERPNext Customization, DocType Controllers, PyPika</p>
          <p><strong>Cloud & Ops:</strong> Kubernetes (EKS/GKE), Docker, Terraform, Helm, ArgoCD, Prometheus</p>
          <p><strong>Storage:</strong> MariaDB, PostgreSQL, Redis, TimescaleDB, LSM-Tree</p>
        `);
        break;

      case 'experience':
        appendOutput(`
          <p><strong>2023 - Present:</strong> Lead Systems Architect @ Apex Tech (Cut lock contention 85%)</p>
          <p><strong>2021 - 2023:</strong> Senior Software Engineer @ CloudScale Labs (Go microservices @ 50k req/min)</p>
          <p><strong>2018 - 2021:</strong> Systems Developer @ DevCore (Django REST & Celery task pipelines)</p>
        `);
        break;

      case 'projects':
        appendOutput(`
          <p>Featured Production Architectures:</p>
          <div>• <strong>nexis-erp</strong>: High-throughput Frappe sync engine (MariaDB & PyPika)</div>
          <div>• <strong>aether-db</strong>: Distributed Raft key-value store in Go</div>
          <div>• <strong>opsflow</strong>: Automated Kubernetes staging environment operator</div>
          <div>• <strong>synthanalyze</strong>: Real-time WebSocket analytical dashboard</div>
          <p style="margin-top:4px;">Type <code>project &lt;id&gt;</code> for details.</p>
        `);
        break;

      case 'project':
        if (!arg) {
          appendOutput(`<span class="term-red">Error: Specify a project ID (e.g. project nexis-erp).</span>`);
        } else if (arg === 'nexis-erp') {
          appendOutput(`
            <p><strong>Nexis ERP Custom Integration</strong></p>
            <p>Frappe Framework v15, MariaDB, PyPika, Redis Queue.</p>
            <p>Outcome: Reduced inventory synchronization latency from 45s to 1.8s; eliminated lock contention.</p>
          `);
        } else if (arg === 'aether-db') {
          appendOutput(`
            <p><strong>AetherDB Distributed Key-Value Store</strong></p>
            <p>Go, Raft Consensus, Protobuf, LSM-Tree.</p>
            <p>Outcome: Sustained 50k write operations/sec with guaranteed linearizable state consistency.</p>
          `);
        } else {
          appendOutput(`<span class="term-red">Unknown project: ${escapeHtml(arg)}. Try 'projects' to list valid IDs.</span>`);
        }
        break;

      case 'admin':
        appendOutput(`<span class="term-green">Redirecting to Admin Dashboard...</span>`);
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 500);
        break;

      case 'sudo':
        if (arg === 'hire-me') {
          appendOutput(`<span class="term-green">Permission granted. Redirecting to contact desk...</span>`);
          setTimeout(() => {
            toggleTerminal();
            const contactSection = document.getElementById('contact');
            contactSection?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        } else {
          appendOutput(`<span class="term-red">sudo: user is not in sudoers file. Incident reported.</span>`);
        }
        break;

      case 'theme':
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn?.click();
        appendOutput(`<span class="term-cyan">Theme switched successfully.</span>`);
        break;

      case 'coffee':
        appendOutput(`☕ Roasting specialty Ethiopian beans at 220°C. Batch pressure optimal.`);
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      default:
        appendOutput(`<span class="term-red">Command not found: "${escapeHtml(raw)}". Type "help" for valid commands.</span>`);
        break;
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
