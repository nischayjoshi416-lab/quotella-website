// ===================================
// Theme Toggle (Dark/Light Mode)
// ===================================

(function() {
  'use strict';
  
  // Initialize theme on page load
  initTheme();
  
  function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle button event
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }
  
  function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Track theme change
    if (typeof gtag !== 'undefined') {
      gtag('event', 'theme_change', {
        'theme': newTheme
      });
    }
  }
  
  function setTheme(theme) {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      body.classList.remove('dark-mode');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color
    updateMetaThemeColor(theme);
  }
  
  function updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#6366f1');
    }
  }
  
  function handleSystemThemeChange(e) {
    // Only change if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  }
  
  // Expose functions globally if needed
  window.ThemeManager = {
    setTheme,
    toggleTheme
  };
})();
