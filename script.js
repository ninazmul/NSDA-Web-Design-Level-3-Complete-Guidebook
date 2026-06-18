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

  // --- AI/Machine Translation (English/Bengali) ---
  const LANGUAGE_STORAGE_KEY = 'guidebook-language';
  const DEFAULT_LANGUAGE = 'en';
  const TRANSLATED_LANGUAGE = 'bn';
  let translateLoader = null;

  document.querySelectorAll('pre, code, .code-block, .code-block-copy, .header-logo, .header-logo-icon').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  const headerActions = themeToggle ? themeToggle.parentElement : document.querySelector('.header > div:last-child');
  const languageTools = document.createElement('div');
  languageTools.className = 'language-tools notranslate';
  languageTools.setAttribute('translate', 'no');
  languageTools.innerHTML = `
    <span class="language-tools-label">AI Translate</span>
    <button type="button" class="language-btn active" data-language="en" aria-label="Show English" aria-pressed="true">EN</button>
    <button type="button" class="language-btn" data-language="bn" aria-label="Translate to Bengali" aria-pressed="false">বাংলা</button>
    <span class="language-status" role="status" aria-live="polite"></span>
    <div id="google_translate_element" aria-hidden="true"></div>
  `;

  if (headerActions) {
    headerActions.insertBefore(languageTools, themeToggle || headerActions.firstChild);
  }

  const languageButtons = languageTools.querySelectorAll('.language-btn');
  const languageStatus = languageTools.querySelector('.language-status');
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) === TRANSLATED_LANGUAGE ? TRANSLATED_LANGUAGE : DEFAULT_LANGUAGE;

  function setLanguageButtonState(language, state = 'idle') {
    languageTools.dataset.state = state;
    languageButtons.forEach(btn => {
      const isActive = btn.dataset.language === language;
      btn.classList.toggle('active', isActive);
      btn.disabled = state === 'loading';
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (!languageStatus) return;
    languageStatus.textContent = state === 'loading'
      ? 'Loading translation'
      : state === 'error'
        ? 'Translation unavailable'
        : '';
  }

  function setDocumentLanguage(language) {
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
  }

  function clearTranslateCookie() {
    const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    const domains = [location.hostname, `.${location.hostname}`].filter(Boolean);
    document.cookie = `googtrans=; ${expires}; path=/`;
    domains.forEach(domain => {
      document.cookie = `googtrans=; ${expires}; path=/; domain=${domain}`;
    });
  }

  function setTranslateCookie(language) {
    document.cookie = `googtrans=/en/${language}; path=/`;
    if (location.hostname) {
      document.cookie = `googtrans=/en/${language}; path=/; domain=${location.hostname}`;
    }
  }

  function applyGoogleLanguage(language) {
    const combo = document.querySelector('.goog-te-combo');
    if (!combo) return false;
    combo.value = language === DEFAULT_LANGUAGE ? '' : language;
    combo.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function loadGoogleTranslate() {
    if (translateLoader) return translateLoader;

    translateLoader = new Promise((resolve, reject) => {
      const translateElement = document.getElementById('google_translate_element');
      if (!translateElement) {
        reject(new Error('Google Translate target is missing.'));
        return;
      }

      window.googleTranslateElementInit = () => {
        if (!window.google?.translate?.TranslateElement) {
          reject(new Error('Google Translate did not initialize.'));
          return;
        }

        new window.google.translate.TranslateElement({
          pageLanguage: DEFAULT_LANGUAGE,
          includedLanguages: TRANSLATED_LANGUAGE,
          autoDisplay: false
        }, 'google_translate_element');

        resolve();
      };

      if (window.google?.translate?.TranslateElement) {
        window.googleTranslateElementInit();
        return;
      }

      const existingScript = document.querySelector('script[data-google-translate]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Google Translate script failed to load.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.dataset.googleTranslate = 'true';
      script.onerror = () => reject(new Error('Google Translate script failed to load.'));
      document.head.appendChild(script);
    });

    return translateLoader;
  }

  function waitForTranslatedLanguage(language) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (applyGoogleLanguage(language)) {
          window.clearInterval(timer);
          resolve();
        }

        if (attempts > 40) {
          window.clearInterval(timer);
          reject(new Error('Google Translate language selector was not ready.'));
        }
      }, 250);
    });
  }

  async function changeLanguage(language) {
    setLanguageButtonState(language, 'loading');
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    setDocumentLanguage(language);

    if (language === DEFAULT_LANGUAGE) {
      clearTranslateCookie();
      setLanguageButtonState(language);
      window.location.reload();
      return;
    }

    try {
      setTranslateCookie(language);
      await loadGoogleTranslate();
      await waitForTranslatedLanguage(language);
      setLanguageButtonState(language);
    } catch (error) {
      console.warn(error);
      translateLoader = null;
      setLanguageButtonState(language, 'error');
    }
  }

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const language = button.dataset.language;
      if (!language || button.disabled) return;
      if (language === document.documentElement.dataset.language && languageTools.dataset.state !== 'error') {
        return;
      }
      changeLanguage(language);
    });
  });

  setLanguageButtonState(savedLanguage);
  setDocumentLanguage(savedLanguage);
  if (savedLanguage === TRANSLATED_LANGUAGE) {
    setTranslateCookie(TRANSLATED_LANGUAGE);
    changeLanguage(TRANSLATED_LANGUAGE);
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
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-controls', 'mobile-nav');

    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- Sidebar Toggle (mobile) ---
  const sidebar = document.getElementById('sidebar');
  let sidebarToggle = document.getElementById('sidebar-toggle');
  let sidebarBackdrop = document.querySelector('.sidebar-backdrop');

  if (sidebar && !sidebarToggle) {
    sidebarToggle = document.createElement('button');
    sidebarToggle.id = 'sidebar-toggle';
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.type = 'button';
    sidebarToggle.setAttribute('aria-label', 'Open page contents');
    sidebarToggle.setAttribute('aria-controls', 'sidebar');
    sidebarToggle.setAttribute('aria-expanded', 'false');
    sidebarToggle.innerHTML = '<span aria-hidden="true">☰</span><span>Contents</span>';
    document.body.appendChild(sidebarToggle);
  }

  if (sidebar && !sidebarBackdrop) {
    sidebarBackdrop = document.createElement('div');
    sidebarBackdrop.className = 'sidebar-backdrop';
    sidebarBackdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(sidebarBackdrop);
  }

  if (sidebarToggle && sidebar) {
    const closeSidebar = () => {
      sidebar.classList.remove('open');
      document.body.classList.remove('sidebar-open');
      sidebarToggle.setAttribute('aria-expanded', 'false');
    };

    sidebarToggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      document.body.classList.toggle('sidebar-open', isOpen);
      sidebarToggle.setAttribute('aria-expanded', String(isOpen));
    });

    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', closeSidebar);
    }

    sidebar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeSidebar);
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !sidebarToggle.contains(e.target)) {
        closeSidebar();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeSidebar();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeSidebar();
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
