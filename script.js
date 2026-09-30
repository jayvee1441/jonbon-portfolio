document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('.theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionLinks = document.querySelectorAll('a[href^="#"]');
  const projectCards = document.querySelectorAll('.project-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const revealItems = document.querySelectorAll('.reveal');
  const backToTopBtn = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const shouldUseDark = () => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const applyTheme = (isDark) => {
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    themeButtons.forEach((button) => {
      const icon = button.querySelector('svg, i');
      if (!icon) return;
      icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  };

  applyTheme(shouldUseDark());

  themeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(!root.classList.contains('dark'));
    });
  });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const willOpen = !mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', willOpen);
      mobileMenu.classList.toggle('hidden', !willOpen);
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      const icon = menuToggle.querySelector('svg, i');
      if (icon) {
        icon.setAttribute('data-lucide', willOpen ? 'x' : 'menu');
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        const icon = menuToggle.querySelector('svg, i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }
      });
    });
  }

  const handleSmoothScroll = (event) => {
    const anchor = event.currentTarget;
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 88,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  };

  sectionLinks.forEach((link) => {
    link.addEventListener('click', handleSmoothScroll);
  });

  const setActiveNav = () => {
    const sections = [...document.querySelectorAll('main section[id]')];
    let currentSectionId = 'home';

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${currentSectionId}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav();

  const filterProjects = (selectedCategory) => {
    projectCards.forEach((card) => {
      const matches = selectedCategory === 'all' || card.dataset.category === selectedCategory;
      card.classList.toggle('is-hidden', !matches);
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.dataset.filter;
      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      filterProjects(selectedCategory);
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const toggleBackToTop = () => {
    const visible = window.scrollY > 300;
    backToTopBtn.classList.toggle('visible', visible);
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
  });

  const validateField = (input) => {
    const value = input.value.trim();
    const fieldName = input.name;
    let valid = true;

    if (fieldName === 'name' && value.length < 2) valid = false;
    if (fieldName === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailPattern.test(value);
    }
    if (fieldName === 'subject' && value.length < 3) valid = false;
    if (fieldName === 'message' && value.length < 10) valid = false;

    input.classList.toggle('invalid', !valid);
    return valid;
  };

  const fields = ['name', 'email', 'subject', 'message'];

  fields.forEach((fieldName) => {
    const field = document.getElementById(fieldName);
    if (!field) return;

    field.addEventListener('input', () => {
      validateField(field);
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const allValid = fields.every((fieldName) => {
      const field = document.getElementById(fieldName);
      return field ? validateField(field) : false;
    });

    formStatus.classList.add('hidden');

    if (!allValid) {
      formStatus.textContent = 'Please complete all fields correctly before submitting.';
      formStatus.classList.remove('hidden');
      formStatus.classList.remove('border-emerald-200', 'bg-emerald-50', 'text-emerald-700');
      formStatus.classList.add('border-red-200', 'bg-red-50', 'text-red-700');
      return;
    }

    formStatus.textContent = 'Thank you! This is a frontend-only form. Connect a backend or email service later to send messages.';
    formStatus.classList.remove('hidden', 'border-red-200', 'bg-red-50', 'text-red-700');
    formStatus.classList.add('border-emerald-200', 'bg-emerald-50', 'text-emerald-700');
    contactForm.reset();
    fields.forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      field.classList.remove('invalid');
    });
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
