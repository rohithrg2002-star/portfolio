# Alex Carter — Lead Software Engineer & Systems Architect Portfolio

A modern, high-performance, accessible portfolio built with semantic HTML5, CSS design tokens, and modular ES JavaScript. Designed following clean engineering principles inspired by Linear, Vercel, and Brittany Chiang—prioritizing systems proof, measurable outcomes, and recruiter clarity in the first 30 seconds.

---

## 🏗️ Architecture & Tech Stack

- **Core**: Semantic HTML5, CSS Custom Properties (Tokens), Vanilla ES Modules.
- **Visuals**: Three.js background canvas (~16 floating tags, auto-paused when blurred or under `prefers-reduced-motion`).
- **Icons**: [Lucide Icons](https://lucide.dev/).
- **Data Architecture**: Single source of truth in `data/content.js`. Profile, work experience, featured projects, and skill matrices update dynamically without manual HTML changes.
- **Zero Build Step Required**: Runs instantly via any static file server (`python3 -m http.server 8000` or `npx serve`).

---

## 📁 File Structure

```text
portfolio/
├── css/
│   ├── tokens.css          # Design system: colors, typography, 4/8px spacing grid, radii, shadows
│   ├── base.css            # Modern reset, skip-to-content link, focus visible rings, reduced motion
│   ├── components.css      # Buttons, badges, chips, status pills, cards, section headers
│   └── sections.css        # Layouts: header, hero, about, experience, projects, skills, lab, writing, contact, footer
├── js/
│   ├── main.js             # Bootstrap entrypoint & lazy-loading coordinator
│   ├── theme.js            # Dark/light theme switcher with system preference detection and try/catch storage
│   ├── nav.js              # Sticky glass header, mobile drawer with focus trap, and IntersectionObserver scrollspy
│   ├── three-bg.js         # Lightweight Three.js hero background (reduced tag density, auto-pause on blur)
│   ├── render.js           # Hydrates DOM from data/content.js (About, Experience, Projects, Skills, Case Studies)
│   ├── modal.js            # Accessible modal dialog controller (focus trapping, Esc dismissal, trigger focus restore)
│   ├── palette.js          # Accessible Command Palette (Cmd+K / Ctrl+K) with fuzzy filter and keyboard navigation
│   ├── terminal.js         # Interactive CLI drawer (safe backtick handling that never hijacks form inputs)
│   ├── contact.js          # Accessible form validation with live inline errors, loading spinner, and success state
│   └── playground/
│       └── lab-controller.js # Lazy-loaded developer lab sandboxes (Bug Hunt, API Client, Mini ERP, Git Log, Flowchart, Pipeline)
├── data/
│   └── content.js          # Central structured data store for all portfolio copy, metrics, and case studies
├── assets/                 # Profile images, project thumbnails, and resume PDF
├── admin.html              # Frontend Admin Dashboard for zero-code content & feature management
├── admin.css               # Admin panel design tokens and toggle switch styles
├── admin.js                # Admin controller module (local sync, backup & export)
├── robots.txt              # Web crawler directives and sitemap reference
├── sitemap.xml             # XML sitemap with lastmod timestamps and priority scores
├── index.html              # Clean semantic HTML5 structure with complete SEO & JSON-LD schema
└── README.md               # Documentation and deployment guide
```

---

## 🎨 Design System & Philosophy

- **Color Tokens**: Dark theme by default with clean light mode toggle. Built around a single primary accent (`#3b82f6` in dark / `#2563eb` in light) without loud neon glows or low-contrast backgrounds.
- **Typography**: Inter (UI / body copy) + IBM Plex Mono (code chips, metrics, and terminal drawer only). Strictly limited to 2 font families and 3 weights (400, 500, 600).
- **Spacing Grid**: Mathematical 4px / 8px scale (`--space-1` = 4px up to `--space-20` = 80px).
- **Motion**: Subtle 150–250ms ease-out transitions. Completely disabled when `prefers-reduced-motion: reduce` is detected.
- **Accessibility (WCAG 2.1 AA)**:
  - Contrast ratios >= 4.5:1 across all surfaces.
  - Visible `:focus-visible` outline rings for keyboard users.
  - Skip-to-content bypass link (`.skip-link`).
  - Strict ARIA attributes (`aria-modal`, `aria-hidden`, `aria-describedby`, `role="alert"`).
  - Modal focus trap and auto-restore of focus to the triggering element upon closing.

---

## ⚡ Features & Modules

1. **Recruiter 30-Second Rule**:
   - Availability status pill with pulsing indicator.
   - Clear value proposition: *"I design and ship scalable ERP, backend, and cloud infrastructure."*
   - Immediate CTAs: View Projects, Contact, Resume download, and external LinkedIn/GitHub links.
2. **Featured Systems & Deep Case Studies**:
   - 4 production-grade systems prominently highlighting Frappe/ERPNext, Go distributed consensus, and Kubernetes infrastructure.
   - Interactive *"Case Study"* modal showcasing **Problem &rarr; Engineering Solution &rarr; Architecture Diagram &rarr; Measurable Results**.
3. **Developer Lab (Lazy-Loaded)**:
   - Formerly the playground; now neatly sequestered in a dedicated, lazy-loaded section via `IntersectionObserver` with a 300px root margin.
   - 6 sandboxes: Interactive Bug Hunt, API Latency Inspector, Mini ERP Desk, Git Career Log, Diagnostic Debug Flowchart, and CI/CD Pipeline Simulator.
   - Gamification and easter eggs demoted to quiet background tracking with zero disruptive blocking `alert()` popups.
4. **Command Palette (`Cmd+K` / `Ctrl+K`)**:
   - Instant search across navigation, external repositories, theme switching, and tools.
   - Accessible keyboard up/down arrow cycling, Enter activation, and Escape dismissal.
5. **Interactive Terminal Drawer (`` ` `` key or button)**:
   - Full CLI simulation (`whoami`, `skills`, `projects`, `experience`, `stack`, `theme`, `clear`).
   - Command history navigation (Up/Down arrows) and Tab autocompletion.
   - **Safe Backtick Handling**: Checks active element before toggling; typing `` ` `` inside inputs or textareas never intercepts keyboard events.
6. **Accessible Contact Form**:
   - Inline real-time field validation with `aria-invalid` and `aria-describedby` error bindings.
   - Simulated submit with loading spinner and focus-trapped success confirmation screen.
7. **Complete SEO & Structured Data**:
   - Canonical URL, Open Graph metadata, and Twitter Large Image cards.
   - JSON-LD `Person` schema for rich Google search indexing.

---

## ⚙️ Admin Dashboard & Zero-Code Content Management

The portfolio includes an **interactive Admin Dashboard** (`admin.html`) enabling complete content updates and granular feature toggles directly in the browser—with zero need to touch code.

### Accessing the Admin Panel
- **Direct URL**: Navigate to `/admin.html` (e.g. `http://localhost:8000/admin.html`).
- **Command Palette (`Cmd+K` / `Ctrl+K`)**: Search `"Open Admin Dashboard"` or press shortcut `⌘A`.
- **Interactive Terminal ( ` )**: Type command `admin`.
- **Footer**: Click the subtle **"Admin"** link in the site footer.
- **Passcode**: Enter `admin123` to authenticate.

### Admin Capabilities
1. **Granular Section & Feature Toggles**:
   - **Master Section Toggles**: Turn entire sections on or off with a switch: Hero, About, Experience, Projects, Skills, Developer Lab, Writing & Open Source, Contact.
   - **Core Feature Toggles**: Enable/disable Three.js background canvas, Command Palette, CLI Terminal Drawer, Case Study Modals, Theme Switcher, Resume download button, or Availability badge.
   - **Individual Lab Sandboxes**: Toggle Bug Hunt, API Playground, Mini ERP Sandbox, Git Career Log, How I Debug, or Pipeline Simulator individually.
2. **Dynamic Content Editing**:
   - **Profile & Hero**: Update name, headline title, role tag, value proposition, bio summary, availability statement, and social links.
   - **About & Key Stats**: Edit narrative biography paragraphs and calibrate the 4 performance metric cards.
   - **Experience Timeline**: Add, edit, or remove career positions, period, company, impact bullets, and tech chips.
   - **Projects & Case Studies**: Add or delete projects, update summaries, thumbnails, outcomes, and full case study breakdowns (Problem &rarr; Solution &rarr; Architecture &rarr; Measurable Results).
   - **Skills Matrix**: Customize skill categories and comma-separated chip lists.
   - **Writing & Open Source**: Manage technical publications, open-source repositories, and GitHub statistics.
   - **Contact Preferences**: Update direct email, location, response time expectations, and communication channels.
3. **Zero-Code Permanent Deployment**:
   - **Live Browser Sync**: Any edits made in the admin panel are immediately reflected across `index.html` via browser storage.
   - **1-Click `content.js` Download**: Download a formatted `data/content.js` file with your customizations baked in for permanent zero-code Git commits.
   - **JSON Backup & Restore**: Export full configuration snapshots or restore from previously saved JSON backups.
   - **Factory Reset**: Revert back to original defaults at any time.

---

## 🚀 Running Locally

### Option 1: Python HTTP Server (Built-in)
```bash
# Navigate to the project root directory
cd portfolio

# Start the server on port 8000
python3 -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js `serve` / `npx`
```bash
npx serve -l 8000 .
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deployment Instructions

Because the portfolio is a zero-dependency static application, it can be deployed to any modern web hosting service in seconds.

### 1. GitHub Pages
1. Push your repository to GitHub.
2. Go to **Repository Settings** &rarr; **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: `main` / Folder: `/ (root)`
4. Click **Save**. GitHub Pages will deploy your site at `https://<username>.github.io/<repo>/`.

*Optional GitHub Action workflow (`.github/workflows/deploy.yml`):*
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel` or connect via the [Vercel Dashboard](https://vercel.com).
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Deploy to production:
   ```bash
   vercel --prod
   ```

*Optional `vercel.json` for caching and security headers:*
```json
{
  "cleanUrls": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

### 3. Netlify
1. Drag and drop the `portfolio` folder directly into [Netlify Drop](https://app.netlify.com/drop), or link your Git repository.
2. Configure build settings:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.`

*Optional `netlify.toml`:*
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🧪 Quality & Verification Checklist

- [x] **Semantic Structure**: Proper `header`, `nav`, `main`, `section`, `article`, and `footer` elements. Single `h1` heading.
- [x] **Modular Architecture**: Separate `/css` tokens/base/components/sections and `/js` ES modules.
- [x] **Content Decoupling**: All profile, experience, projects, and skills stored in `data/content.js`.
- [x] **Keyboard Navigation**: Complete tab indexing, Escape key handlers for all dialogs, focus trapping in modal/drawers.
- [x] **Safe Storage**: All `localStorage` interactions wrapped in `try/catch` blocks.
- [x] **Contrast & Dark/Light Mode**: Meets WCAG 2.1 AA (contrast >= 4.5:1), respects `prefers-color-scheme`, choice persisted.
- [x] **Performance**: Three.js background reduced to 16 particles with automatic pause on blur; Lab loaded on viewport approach via `IntersectionObserver`.
- [x] **SEO**: Canonical link, Open Graph, Twitter Large Cards, `sitemap.xml`, `robots.txt`, and JSON-LD Person schema.