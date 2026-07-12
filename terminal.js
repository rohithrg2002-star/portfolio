// Interactive Retro CLI Terminal Drawer Logic
(function() {
  const drawer = document.getElementById('terminal-drawer');
  const toggleBtn = document.getElementById('terminal-toggle');
  const closeBtn = document.getElementById('terminal-drawer-close');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!drawer || !input || !output) return;

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

  // Handle command execution on Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmdText = input.value.trim();
      input.value = '';

      if (cmdText) {
        executeCommand(cmdText);
      }
    }
  });

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

  function executeCommand(cmd) {
    // Print echo of prompt command
    printLine(`<span class="terminal-prompt">guest@alex-carter:~$</span> ${cmd}`);

    const parts = cmd.toLowerCase().split(' ');
    const baseCmd = parts[0];

    switch (baseCmd) {
      case 'help':
        printLine('Available Commands:');
        printLine('  <span class="term-highlight">about</span>      - Personal summary & professional profile');
        printLine('  <span class="term-highlight">skills</span>     - Technical stack specialization matrix');
        printLine('  <span class="term-highlight">projects</span>   - Highlighted engineering case studies');
        printLine('  <span class="term-highlight">contact</span>    - Available networks and communication links');
        printLine('  <span class="term-highlight">theme</span>      - Switch UI theme preference (dark/light)');
        printLine('  <span class="term-highlight">clear</span>      - Clear terminal console screen');
        break;

      case 'about':
        printLine('Alex Carter - Lead Software Engineer & Systems Architect.');
        printLine('Specializes in python web frameworks (Django/FastAPI), backend integration design (Frappe/ERPNext),');
        printLine('database profiling, and container scheduling in high-performance cloud environments.');
        printLine('Current availability: Open for architectural consulting and technical advisory.');
        break;

      case 'skills':
        printLine('Language stack: Python, JavaScript, TypeScript, Go (Golang), SQL (PostgreSQL, MariaDB)');
        printLine('Frameworks:     Frappe Framework, ERPNext, Django, FastAPI, React, Next.js, Node.js (Express)');
        printLine('Infrastructure: Docker, Kubernetes (EKS/GKE), AWS (ECS/RDS/S3), Terraform, Helm, GitHub Actions');
        break;

      case 'projects':
        printLine('Highlighted Engineering Projects:');
        printLine('  1. <span class="term-highlight">nexis-erp</span>    - Bulk synchronization system for ERPNext (85% reduction in latency)');
        printLine('  2. <span class="term-highlight">aether-db</span>    - Distributed Key-Value store in Go using Raft consensus (50k writes/sec)');
        printLine('  3. <span class="term-highlight">synthanalyze</span> - Real-time conversion funnel metrics charts via WebSockets');
        printLine('  4. <span class="term-highlight">opsflow</span>      - Dynamic Kubernetes sandbox builder for branch staging (90s env spinup)');
        printLine('Tip: View full details directly in the Projects section of the website.');
        break;

      case 'contact':
        printLine('Preferred channel: Email (<a href="mailto:alex@carter.dev" style="color:#e879f9;">alex@carter.dev</a>)');
        printLine('Professional profiles:');
        printLine('  GitHub:   <a href="https://github.com" target="_blank" style="color:#38bdf8;">github.com/developer</a>');
        printLine('  LinkedIn: <a href="https://linkedin.com" target="_blank" style="color:#38bdf8;">linkedin.com/in/developer</a>');
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
        // Remove all previous output lines except the active command input line
        const lines = output.querySelectorAll('.term-line');
        lines.forEach(line => line.remove());
        break;

      default:
        printLine(`bash: command not found: ${baseCmd}. Type <span class="term-highlight">help</span> for a list of available commands.`, true);
        break;
    }
  }
})();
