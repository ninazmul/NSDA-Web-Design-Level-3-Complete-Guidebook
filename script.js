/* ============================================
   NSDA Web Design Level 3 — Guidebook
   Shared JavaScript
   Author: N.I. Nazmul
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('guidebook-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('guidebook-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  // --- Scroll Progress Bar ---
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    });
  }

  // --- Mobile Hamburger Menu ---
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // --- Sidebar Toggle (mobile) ---
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // --- Sidebar Active Link (scroll spy) ---
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  if (sidebarLinks.length > 0) {
    const sections = [];
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const section = document.querySelector(href);
        if (section) sections.push({ el: section, link: link });
      }
    });

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      let currentSection = null;
      sections.forEach(({ el, link }) => {
        if (el.offsetTop <= scrollPos) {
          currentSection = link;
        }
      });
      sidebarLinks.forEach(l => l.classList.remove('active'));
      if (currentSection) currentSection.classList.add('active');
    });
  }

  // --- Code Block Copy ---
  document.querySelectorAll('.code-block-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-block');
      const code = codeBlock.querySelector('code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        btn.classList.add('copied');
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.textContent = '📋 Copy';
        }, 2000);
      });
    });
  });

  // --- Accordion ---
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close all items in the same accordion
      const accordion = item.closest('.accordion');
      if (accordion) {
        accordion.querySelectorAll('.accordion-item').forEach(i => {
          i.classList.remove('open');
        });
      }
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // --- Back to Top Button ---
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Reveal Animation ---
  const fadeElements = document.querySelectorAll('.fade-up');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    fadeElements.forEach(el => observer.observe(el));
  }

  // --- Search Functionality ---
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (searchInput && searchResults) {
    const unitData = [
      { title: 'Practice Negotiation Skills', url: 'unit1-negotiation.html', code: 'GU-09-L2-V1', keywords: 'negotiation planning participation communication' },
      { title: 'Practice OSH Standard in ICT', url: 'unit2-osh.html', code: 'SU-ICT-10-L2-V1', keywords: 'safety health hazard osh ppe ergonomics' },
      { title: 'Prepare Documents & Create Presentations', url: 'unit3-documents.html', code: 'SU-ICT-11-L2-V1', keywords: 'document word powerpoint presentation slide storytelling' },
      { title: 'Visual Design Principles & Color', url: 'unit4-visual-design.html', code: 'OU-ICT-WD-01-L3-V2', keywords: 'design color visual principles ui ux color theory palette' },
      { title: 'Setup Web Design Environment', url: 'unit5-environment.html', code: 'OU-ICT-WD-02-L3-V2', keywords: 'vscode editor environment git server hosting domain' },
      { title: 'Work with HTML', url: 'unit6-html.html', code: 'OU-ICT-WD-03-L3-V2', keywords: 'html tags semantic form table accessibility' },
      { title: 'Work with CSS & CSS Frameworks', url: 'unit7-css.html', code: 'OU-ICT-WD-04-L3-V2', keywords: 'css selectors box model grid flexbox responsive bootstrap tailwind' },
      { title: 'Perform Design to Web', url: 'unit8-design-to-web.html', code: 'OU-ICT-WD-05-L3-V2', keywords: 'figma xd photoshop psd mockup design conversion' },
      { title: 'Work with Core JavaScript', url: 'unit9-javascript.html', code: 'OU-ICT-WD-06-L3-V2', keywords: 'javascript variables functions dom events loops arrays' },
    ];

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      searchResults.innerHTML = '';
      if (query.length < 2) {
        searchResults.style.display = 'none';
        return;
      }
      const results = unitData.filter(u =>
        u.title.toLowerCase().includes(query) ||
        u.code.toLowerCase().includes(query) ||
        u.keywords.includes(query)
      );
      if (results.length > 0) {
        searchResults.style.display = 'block';
        results.forEach(r => {
          const item = document.createElement('a');
          item.href = r.url;
          item.className = 'search-result-item';
          item.innerHTML = `<span class="search-result-code">${r.code}</span><span class="search-result-title">${r.title}</span>`;
          searchResults.appendChild(item);
        });
      } else {
        searchResults.style.display = 'block';
        searchResults.innerHTML = '<div class="search-no-result">No units found</div>';
      }
    });

    // Close search on click outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }

});
