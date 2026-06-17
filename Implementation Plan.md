# NSDA Web Design Level 3 — Complete Guidebook Website

A premium, interactive web-based guidebook covering all 9 units of the NSDA Web Design Level 3 Competency Standard (CS-ICT-WD-L3-EN-V2), with full answers, code examples, guidance, and visual aids.

## Proposed Changes

### Architecture: Single-Page Application (Vanilla HTML/CSS/JS)

The guidebook will be a multi-page static website with:
- **Home page** (`index.html`) — Hero section, course overview, unit cards, author info
- **9 Unit pages** — One dedicated page per competency unit with full content
- **Shared CSS** (`styles.css`) — Premium design system with dark mode, gradients, animations
- **Shared JS** (`script.js`) — Navigation, sidebar, search, dark mode toggle, code highlighting

---

### Pages & Content Structure

#### [NEW] `index.html` — Home / Landing Page
- Hero section with course title, NSDA branding, your name & links
- Course structure overview (360 hours, 9 units)
- Interactive unit cards linking to each unit page
- BNQF Level 3 descriptor
- Footer with N.I. Nazmul credit & GitHub link

#### [NEW] `unit1-negotiation.html` — GU-09: Practice Negotiation Skills (20 hrs)
- Planning negotiations (information gathering, non-verbal environments, active listening, questioning techniques)
- Participating in negotiations (criteria, outcomes, language, documentation)
- Range of variables with full explanations & examples
- Evidence guide, assessment methods

#### [NEW] `unit2-osh.html` — SU-ICT-10: Practice OSH Standard in ICT (15 hrs)
- Identifying hazards & risks in ICT environments
- Personal health & safety practices (ergonomics, PPE)
- Managing & reporting hazards
- Emergency response procedures
- Full examples of workplace safety scenarios

#### [NEW] `unit3-documents.html` — SU-ICT-11: Prepare Documents & Presentations (45 hrs)
- MS Word document creation & formatting guide
- Page layout, styles, tables, references
- PowerPoint presentations & slide design
- Storytelling techniques with examples
- Print & transfer procedures
- Delivering presentations & gathering feedback

#### [NEW] `unit4-visual-design.html` — OU-ICT-WD-01: Visual Design Principles & Color (35 hrs)
- Web design principles (grid, balance, contrast, emphasis, proximity, hierarchy, etc.)
- Visual elements in UI design
- Color theory (color wheel, harmony, HSV, temperature)
- Color modes (RGB, HEX, HSL, HSLA, RGBA, Named, Lab, LCH)
- Color psychology & schemes
- Interactive color examples & palettes

#### [NEW] `unit5-environment.html` — OU-ICT-WD-02: Setup Web Design Environment (40 hrs)
- Code editors comparison (VS Code, Sublime, Atom, Brackets, Notepad++)
- Essential extensions (Emmet, Live Server, Prettier, ESLint)
- Browser DevTools guide
- File/folder structure best practices
- Local server setup (Live Server, XAMPP, Node.js)
- Live hosting, domain, SSL configuration
- Data layer concepts (JSON, APIs)
- Git version control commands & workflow

#### [NEW] `unit6-html.html` — OU-ICT-WD-03: Work with HTML (60 hrs)
- HTML5 document structure & semantic elements
- Meta tags, SEO, viewport
- Text formatting, lists, links, tables
- Multimedia embedding (images, video, audio)
- Forms (all input types, validation, fieldsets, labels)
- Accessibility (ARIA roles, alt text, tab index, keyboard nav)
- W3C validation
- **Lots of code examples with syntax highlighting**

#### [NEW] `unit7-css.html` — OU-ICT-WD-04: Work with CSS & Frameworks (45 hrs)
- CSS types (inline, internal, external)
- Selectors (universal, class, ID, pseudo-class, group, descendant)
- Box model & positioning (static, relative, absolute, fixed, sticky)
- Transitions, gradients, animations, 2D/3D transforms
- Responsive design with media queries & breakpoints
- CSS Grid system
- CSS Frameworks (Bootstrap, Tailwind, Foundation, Material UI)
- Framework components (navbar, modals, cards, carousels, etc.)
- Testing & optimization (Lighthouse, lazy loading, minification)
- **Interactive code examples**

#### [NEW] `unit8-design-to-web.html` — OU-ICT-WD-05: Design to Web (40 hrs)
- Working with Figma, XD, Photoshop
- Exporting & optimizing assets
- Building web pages from design mockups
- Design consistency & cross-browser testing
- Performance optimization

#### [NEW] `unit9-javascript.html` — OU-ICT-WD-06: Core JavaScript (40 hrs)
- Data types (string, number, bigint, boolean, undefined, null, symbol, array, object)
- Variables (var, let, const) & operators
- Data structures (arrays, objects, maps, sets, stacks, queues, etc.)
- Control structures (if/else, switch, loops)
- Functions (named, anonymous, arrow, scope, hoisting)
- DOM manipulation (getElementById, querySelector)
- Event handling & listeners
- Form validation
- **Interactive code examples with live output**

---

### Design System (`styles.css`)

- **Color Palette**: Deep navy/slate dark theme with vibrant cyan/teal accents and amber highlights
- **Typography**: Google Fonts — Inter for body, JetBrains Mono for code
- **Glassmorphism**: Frosted glass cards and navigation
- **Micro-animations**: Hover effects, scroll reveals, code block transitions
- **Responsive**: Mobile-first with breakpoints at 576px, 768px, 992px
- **Code blocks**: Syntax-highlighted with copy button
- **Sidebar navigation**: Sticky table of contents per unit page
- **Progress tracking**: Visual progress indicator

### JavaScript (`script.js`)

- Smooth scroll navigation
- Dark/light mode toggle
- Sidebar table of contents generation
- Code block copy functionality
- Mobile hamburger menu
- Search functionality across units
- Scroll progress bar

---

## Verification Plan

### Manual Verification
- Open `index.html` in browser via Live Server
- Navigate through all 9 unit pages
- Test responsive design on mobile/tablet/desktop viewports
- Verify all code examples render correctly
- Test dark/light mode toggle
- Verify all internal links work
- Check author name and GitHub link appear on home page and all footers
