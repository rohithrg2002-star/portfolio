/**
 * Central Content Store
 * Single source of truth for portfolio profile, navigation, metrics, experience, projects, and skills.
 */

export const CONTENT = {
  profile: {
    name: "Alex Carter",
    title: "Lead Software Engineer & Systems Architect",
    roleTag: "Lead Systems Architect",
    location: "San Francisco, CA / Remote",
    availability: "Available for Staff / Lead Architecture Roles",
    email: "alex.carter.dev@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    resumeUrl: "assets/resume.pdf"
  },

  hero: {
    valueProp: "I design and ship scalable ERP, backend, and cloud infrastructure.",
    summary: "Lead Software Engineer specializing in Python, Go, custom Frappe/ERPNext business systems, high-throughput data pipelines, and cloud native architectures on Kubernetes.",
    ctas: [
      { text: "View Featured Projects", href: "#projects", variant: "primary" },
      { text: "Get in Touch", href: "#contact", variant: "secondary" }
    ]
  },

  navigation: [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "lab", label: "Lab" },
    { id: "contact", label: "Contact" }
  ],

  about: {
    paragraphs: [
      "Over the past 8+ years, I have architected and deployed production systems across enterprise resource planning, distributed databases, and cloud infrastructure. My work centers on building resilient backend architectures that remain predictable under heavy transactional load.",
      "Specializing in Frappe/ERPNext customization, high-performance Python/Go backends, and automated Kubernetes orchestration, I bridge product vision with rigorous systems engineering—ensuring clean abstractions, verifiable observability, and long-term maintainability."
    ],
    stats: [
      { label: "Years Experience", value: "8+", detail: "Enterprise & startup engineering" },
      { label: "Systems Shipped", value: "25+", detail: "Deployed to production" },
      { label: "Peak Throughput", value: "50k", unit: "req/min", detail: "Sustained with sub-10ms p99" },
      { label: "System Reliability", value: "99.99%", detail: "SLA across cloud clusters" }
    ]
  },

  experience: [
    {
      period: "2023 — Present",
      role: "Lead Systems Architect",
      company: "Apex Tech",
      location: "San Francisco, CA",
      bullets: [
        "Architected high-throughput Frappe/ERPNext sync engine, cutting MariaDB lock contention by 85% and saving $120k/yr in infrastructure costs.",
        "Built multi-cluster Kubernetes deployment pipelines on AWS EKS, reducing engineering release cycle time by 70%.",
        "Designed real-time event streaming middleware connecting 100+ retail branches with centralized accounting.",
        "Mentored a cross-functional engineering team of 12 engineers across backend, frontend, and DevOps."
      ],
      skills: ["Frappe / ERPNext", "Python", "MariaDB", "AWS EKS", "Redis", "Docker"]
    },
    {
      period: "2021 — 2023",
      role: "Senior Software Engineer",
      company: "CloudScale Systems",
      location: "Austin, TX (Remote)",
      bullets: [
        "Designed and deployed distributed Go microservices handling 50,000 requests/minute with sub-10ms p99 latency.",
        "Migrated legacy monolithic backend services to containerized Docker workflows managed by Helm and ArgoCD.",
        "Engineered automated database partitioning and caching strategies with Redis, decreasing average query times by 60%."
      ],
      skills: ["Go (Golang)", "Kubernetes", "PostgreSQL", "Redis", "gRPC", "ArgoCD"]
    },
    {
      period: "2018 — 2021",
      role: "Backend & Systems Developer",
      company: "DevCore Solutions",
      location: "Denver, CO",
      bullets: [
        "Developed custom Python/Django REST APIs integrating external payment gateways and third-party logistics APIs.",
        "Reduced API response latency from 320ms to 45ms by eliminating N+1 query patterns and offloading heavy tasks to Celery.",
        "Implemented automated CI/CD pipelines, unit/integration test suites, and Sentry error tracking."
      ],
      skills: ["Python", "Django / DRF", "Celery", "PostgreSQL", "Docker", "CI/CD"]
    }
  ],

  projects: [
    {
      id: "nexis-erp",
      title: "Nexis ERP Custom Integration",
      category: "ERP / Frappe",
      badge: "Featured System",
      summary: "High-throughput API sync engine for ERPNext that optimizes MariaDB query execution and reduces sync time by 85% for large-scale retail systems.",
      role: "Lead Systems Architect",
      outcome: "Cut sync time from 45s to 1.8s; saved $120k/year in cloud hosting",
      thumbnail: "assets/images/nexis_erp_thumbnail.png",
      github: "https://github.com",
      live: "#",
      tags: ["Frappe Framework", "ERPNext", "Python", "MariaDB", "Redis", "Docker"],
      caseStudy: {
        problem: "Over 100 retail outlets were syncing inventory to a centralized ERPNext instance. MariaDB lock contention and unindexed ORM lookups caused 45-second sync delays, request timeouts, and duplicate transactions.",
        solution: "Bypassed standard ORM loops for bulk writes using a custom PyPika query builder pipeline combined with Redis Queue (RQ) background workers and optimistic inventory locking.",
        architecture: "Vite/Tailwind frontend -> Frappe v15 Whitelisted API -> PyPika Bulk Query Builder -> MariaDB with Redis Cache -> Docker on AWS ECS.",
        results: [
          "Sync latency reduced by 85% (from 45s to 1.8s)",
          "MariaDB CPU utilization decreased from 94% to 22% under peak load",
          "Zero duplicate synchronization records over 12 months in production"
        ]
      }
    },
    {
      id: "aether-db",
      title: "AetherDB: Distributed Key-Value Store",
      category: "Distributed Systems",
      badge: "Open Source",
      summary: "Lightweight, highly available distributed key-value store utilizing the Raft consensus protocol for guaranteed state consistency across distributed clusters.",
      role: "Creator & Core Maintainer",
      outcome: "50,000 writes/sec with zero split-brain partition failures",
      thumbnail: "assets/images/aether_db_thumbnail.png",
      github: "https://github.com",
      live: "#",
      tags: ["Go (Golang)", "Raft Consensus", "gRPC", "Protobuf", "LSM-Tree", "Kubernetes"],
      caseStudy: {
        problem: "Distributed systems frequently suffer from split-brain scenarios or require heavyweight coordination daemons like ZooKeeper that increase operational overhead.",
        solution: "Built a zero-dependency Raft consensus engine in Go with asynchronous log compaction, copy-on-write snapshotting, and Protobuf TCP communication.",
        architecture: "Go Raft Core Engine -> Dynamic Quorum Election -> LSM-Tree Storage Engine -> Kubernetes StatefulSet deployment.",
        results: [
          "Sustained 50k write operations/sec on commodity nodes",
          "Quorum leader election established in < 150ms",
          "Zero data loss across simulated network partition chaos tests"
        ]
      }
    },
    {
      id: "opsflow",
      title: "OpsFlow: Kubernetes Automation Platform",
      category: "DevOps & Cloud",
      badge: "Infrastructure",
      summary: "Infrastructure-as-code automation platform orchestrating dynamic sandbox staging environments and ephemeral branch deployments.",
      role: "Senior Infrastructure Engineer",
      outcome: "Reduced staging setup from 4 hours to 90 seconds; cut cloud spend by 40%",
      thumbnail: "assets/images/opsflow_thumbnail.png",
      github: "https://github.com",
      live: "#",
      tags: ["Kubernetes Operator", "Go", "Terraform", "AWS EKS", "ArgoCD", "HashiCorp Vault"],
      caseStudy: {
        problem: "Engineers waited up to 4 hours for staging environments to be provisioned manually, while orphaned staging instances inflated AWS bills by 40%.",
        solution: "Developed a custom Kubernetes controller in Go that monitors git branch webhooks, provisions isolated k3s clusters via Terraform, and injects Vault secrets.",
        architecture: "Git Webhook -> Go K8s Controller -> Terraform Runner -> AWS EC2 / EKS Sandbox -> Automatic TTL Teardown.",
        results: [
          "Automated sandbox creation time reduced to < 90 seconds",
          "Automatic idle cleanup cut monthly AWS cloud spend by $8,500",
          "Adopted across 18 development teams with zero security leaks"
        ]
      }
    },
    {
      id: "synthanalyze",
      title: "SynthAnalytics SaaS Dashboard",
      category: "Web Applications",
      badge: "Real-time SaaS",
      summary: "Real-time analytics engine and dashboard visualizing user conversion funnels, event stream latency, and live server health metrics via WebSockets.",
      role: "Full Stack Engineer",
      outcome: "Sub-50ms live updates rendered at 60fps; 14% conversion lift",
      thumbnail: "assets/images/synthanalyze_thumbnail.png",
      github: "https://github.com",
      live: "#",
      tags: ["React", "TypeScript", "TimescaleDB", "WebSockets", "Node.js", "Docker"],
      caseStudy: {
        problem: "High-volume metric pipelines caused browser UI freezes when plotting over 100k data points, and standard polling delayed metrics by 5 minutes.",
        solution: "Built a hardware-accelerated canvas chart renderer with WebSockets using exponential backoff and TimescaleDB analytical rollups.",
        architecture: "React Canvas UI -> Socket.io Server -> TimescaleDB Time-Series Engine -> Google Cloud GKE.",
        results: [
          "Rendered 100k+ points at continuous 60fps without thread blocking",
          "Sub-50 millisecond event-to-screen emission latency",
          "Boosted SaaS user conversion rate by 14%"
        ]
      }
    }
  ],

  skills: {
    "ERP & Business Systems": [
      "Frappe Framework", "ERPNext Customization", "DocType Controllers",
      "PyPika Query Builder", "Bench CLI", "Server Scripts", "MariaDB Query Optimization"
    ],
    "Backend & Architecture": [
      "Python", "Go (Golang)", "Django / DRF", "FastAPI",
      "Node.js", "gRPC & Protobuf", "PostgreSQL", "Redis Caching"
    ],
    "Cloud & DevOps": [
      "Kubernetes (K8s)", "Docker", "Terraform", "AWS (ECS, EKS, RDS)",
      "CI/CD (GitHub Actions)", "Helm", "Prometheus & Grafana"
    ],
    "Frontend & UI": [
      "React", "TypeScript", "Next.js", "Tailwind CSS",
      "HTML5 / CSS3 Tokens", "WebGL / Canvas", "WebSockets"
    ],
    "Engineering Practices": [
      "Distributed Consensus (Raft)", "Microservices Architecture", "Performance Profiling",
      "Test-Driven Development (TDD)", "Zero-Downtime Deployments"
    ]
  },

  lab: {
    title: "Developer Lab",
    subtitle: "Interactive sandboxes, runtime tools, and architectural simulators built to demonstrate practical engineering patterns.",
    modules: [
      { id: "bug-hunt", title: "Bug Hunt", desc: "Interactive in-browser code editor with bug diagnosis and assertions." },
      { id: "api-client", title: "API Playground", desc: "Mock REST client inspecting payload size and response latency." },
      { id: "erp-sandbox", title: "Mini ERP Desk", desc: "Mock Frappe Desk interface simulating tasks and status workflows." },
      { id: "git-timeline", title: "Git Career Log", desc: "Simulated git log CLI displaying architectural milestones with visual diffs." },
      { id: "debug-flowchart", title: "How I Debug", desc: "Step-by-step diagnostic workflow from incident alert to production verification." },
      { id: "build-pipeline", title: "Pipeline Simulator", desc: "Interactive CI/CD build runner with step-by-step container logging." }
    ]
  },

  writing: [
    {
      id: "optimizing-frappe-queries",
      date: "March 12, 2026",
      title: "Optimizing MariaDB Query Execution in Frappe Framework & ERPNext",
      excerpt: "A deep dive into MariaDB composite indexes, batch query optimization, and bypassing the Frappe ORM safely using PyPika to scale record writes by 85%.",
      link: "#"
    },
    {
      id: "scaling-django-apis",
      date: "February 28, 2026",
      title: "Scaling High-Throughput APIs to 50k Requests Per Minute",
      excerpt: "Explore concrete architecture strategies: connection pooling, query batching, Redis-backed key invalidation, and decoupling transaction payloads to Celery background workers.",
      link: "#"
    }
  ],

  openSource: {
    metrics: {
      stars: 482,
      contributions: "820+",
      repos: 34
    },
    repos: [
      {
        name: "frappe-fast-sync",
        stars: 142,
        desc: "Whitelisted bulk sync controller plugin bypassing standard Frappe insert hooks for 15x write optimization.",
        tags: ["Python", "Frappe", "MariaDB"],
        link: "https://github.com"
      },
      {
        name: "raft-lite-go",
        stars: 284,
        desc: "Zero-dependency, clean educational implementation of the Raft distributed consensus protocol in Go with Protobuf RPCs.",
        tags: ["Go", "Protobuf", "Raft"],
        link: "https://github.com"
      },
      {
        name: "django-cache-bust",
        stars: 56,
        desc: "Simple middleware that auto-invalidates Redis cache keys based on database commit hooks.",
        tags: ["Python", "Django", "Redis"],
        link: "https://github.com"
      }
    ]
  },

  contact: {
    heading: "Start a Conversation",
    description: "I am open to systems architecture consulting, database query auditing, and Staff/Lead engineering roles. Drop a message or reach out directly.",
    email: "alex.carter.dev@example.com",
    location: "San Francisco, CA (US-Pacific / Remote)",
    responseTime: "Usually within 24 hours",
    preferredChannels: "Email, LinkedIn, GitHub"
  }
};

/**
 * Default Feature & Section Visibility Flags
 */
export const DEFAULT_FEATURE_FLAGS = {
  sections: {
    hero: true,
    about: true,
    experience: true,
    projects: true,
    skills: true,
    lab: true,
    writing: true,
    contact: true
  },
  features: {
    threeBackground: true,
    commandPalette: true,
    terminalDrawer: true,
    caseStudyModal: true,
    themeToggle: true,
    resumeDownload: true,
    availabilityBadge: true
  },
  labModules: {
    bugHunt: true,
    apiPlayground: true,
    erpSandbox: true,
    gitTimeline: true,
    howIDebug: true,
    pipelineSimulator: true
  }
};

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

/**
 * Get active content (localStorage custom overrides merged with base defaults)
 */
export function getActiveContent() {
  try {
    const raw = localStorage.getItem('portfolio_custom_content');
    if (!raw) return CONTENT;
    const custom = JSON.parse(raw);
    return deepMerge(CONTENT, custom);
  } catch (e) {
    console.warn('Failed to parse portfolio_custom_content from localStorage:', e);
    return CONTENT;
  }
}

/**
 * Get active feature flags (localStorage overrides merged with base defaults)
 */
export function getActiveFeatureFlags() {
  try {
    const raw = localStorage.getItem('portfolio_feature_flags');
    if (!raw) return DEFAULT_FEATURE_FLAGS;
    const custom = JSON.parse(raw);
    return deepMerge(DEFAULT_FEATURE_FLAGS, custom);
  } catch (e) {
    console.warn('Failed to parse portfolio_feature_flags from localStorage:', e);
    return DEFAULT_FEATURE_FLAGS;
  }
}

/**
 * Save custom content to localStorage
 */
export function saveActiveContent(content) {
  try {
    localStorage.setItem('portfolio_custom_content', JSON.stringify(content));
    return true;
  } catch (e) {
    console.error('Failed to save content to localStorage:', e);
    return false;
  }
}

/**
 * Save custom feature flags to localStorage
 */
export function saveActiveFeatureFlags(flags) {
  try {
    localStorage.setItem('portfolio_feature_flags', JSON.stringify(flags));
    return true;
  } catch (e) {
    console.error('Failed to save feature flags to localStorage:', e);
    return false;
  }
}

/**
 * Reset all customizations to factory defaults
 */
export function resetPortfolioStorage() {
  try {
    localStorage.removeItem('portfolio_custom_content');
    localStorage.removeItem('portfolio_feature_flags');
    return true;
  } catch (e) {
    return false;
  }
}

