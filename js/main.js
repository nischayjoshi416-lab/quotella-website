// ===================================
// QuotesVault - Main JavaScript
// ===================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

// Initialize Application
function initializeApp() {
  setupMobileMenu();
  setupSearchOverlay();
  setupSmoothScroll();
  setupNewsletterForm();
  setupDropdowns();
  setupScrollReveal();
  loadQuoteOfDay();
  loadTrendingQuotes();
  loadLatestQuotes();
}

// Mobile Menu Toggle
function setupMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.classList.toggle('active');
      
      // Animate hamburger icon
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });
  }
}

// Search Overlay
function setupSearchOverlay() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const closeSearch = document.getElementById('closeSearch');
  const searchInput = document.getElementById('searchInput');
  
  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function() {
      searchOverlay.classList.add('active');
      searchInput.focus();
    });
  }
  
  if (closeSearch && searchOverlay) {
    closeSearch.addEventListener('click', function() {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
    });
  }
  
  // Close on Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && searchOverlay.classList.contains('active')) {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
    }
  });
}

// Smooth Scroll for Anchor Links
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// Newsletter Form
function setupNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]').value;
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      successMsg.textContent = 'Thank you for subscribing! Check your email for confirmation.';
      
      this.parentNode.insertBefore(successMsg, this.nextSibling);
      this.reset();
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
      
      // Track event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_subscribe', {
          'email': email
        });
      }
    });
  }
}

// Dropdown Menus
function setupDropdowns() {
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
}

// Scroll Reveal Animation
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length > 0) {
    const revealOnScroll = () => {
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load
  }
}

// Load Quote of the Day
async function loadQuoteOfDay() {
  try {
    const quotes = await fetchQuotes();
    if (quotes && quotes.length > 0) {
      // Get quote based on current day
      const today = new Date();
      const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
      const quoteIndex = dayOfYear % quotes.length;
      const quote = quotes[quoteIndex];
      
      displayQuoteOfDay(quote);
    }
  } catch (error) {
    console.error('Error loading quote of the day:', error);
  }
}

// Display Quote of the Day
function displayQuoteOfDay(quote) {
  const qodText = document.getElementById('qodText');
  const qodAuthor = document.getElementById('qodAuthor');
  const qodActions = document.querySelector('.qod-actions');
  
  if (qodText && qodAuthor) {
    qodText.textContent = `"${quote.text}"`;
    qodAuthor.textContent = `— ${quote.author}`;
    
    // Update button data attributes
    if (qodActions) {
      qodActions.querySelectorAll('button').forEach(btn => {
        btn.setAttribute('data-quote-id', quote.id);
      });
    }
  }
}

// Load Trending Quotes
async function loadTrendingQuotes() {
  try {
    const quotes = await fetchQuotes();
    if (quotes && quotes.length > 0) {
      const trending = quotes
        .filter(q => q.isTrending)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 6);
      
      displayQuotes(trending, 'trendingQuotes');
    }
  } catch (error) {
    console.error('Error loading trending quotes:', error);
  }
}

// Load Latest Quotes
async function loadLatestQuotes() {
  try {
    const quotes = await fetchQuotes();
    if (quotes && quotes.length > 0) {
      const latest = quotes
        .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
        .slice(0, 9);
      
      displayQuotes(latest, 'latestQuotes');
    }
  } catch (error) {
    console.error('Error loading latest quotes:', error);
  }
}

// Fetch Quotes from JSON
async function fetchQuotes() {
  try {
    const response = await fetch('/data/quotes.json');
    if (!response.ok) throw new Error('Failed to fetch quotes');
    const data = await response.json();
    return data.quotes;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
}

// Display Quotes in Grid
function displayQuotes(quotes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  const gradients = [
    'gradient-1', 'gradient-2', 'gradient-3', 
    'gradient-4', 'gradient-5', 'gradient-6'
  ];
  
  quotes.forEach((quote, index) => {
    const gradientClass = gradients[index % gradients.length];
    const card = createQuoteCard(quote, gradientClass);
    container.appendChild(card);
  });
  
  // Add stagger animation
  container.classList.add('stagger-children');
}

// Create Quote Card Element
function createQuoteCard(quote, gradientClass = 'gradient-1') {
  const card = document.createElement('div');
  card.className = `quote-card ${gradientClass}`;
  
  const truncatedText = quote.text.length > 150 
    ? quote.text.substring(0, 150) + '...' 
    : quote.text;
  
  card.innerHTML = `
    <div class="quote-meta">
      <span class="quote-category">${formatCategory(quote.category)}</span>
    </div>
    <blockquote class="quote-text">"${truncatedText}"</blockquote>
    <cite class="quote-author">— ${quote.author}</cite>
    <div class="quote-actions">
      <button class="btn-copy" data-quote-id="${quote.id}" onclick="copyQuote('${quote.id}')">
        Copy
      </button>
      <button class="btn-share" data-quote-id="${quote.id}" onclick="shareQuote('${quote.id}')">
        Share
      </button>
      <button class="btn-favorite" data-quote-id="${quote.id}" onclick="toggleFavorite('${quote.id}')">
        ${isFavorite(quote.id) ? '❤️' : '🤍'}
      </button>
    </div>
  `;
  
  return card;
}

// Format Category Name
function formatCategory(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Copy Quote to Clipboard
async function copyQuote(quoteId) {
  try {
    const quotes = await fetchQuotes();
    const quote = quotes.find(q => q.id === quoteId);
    
    if (quote) {
      const text = `"${quote.text}" — ${quote.author}`;
      await navigator.clipboard.writeText(text);
      
      showToast('Quote copied to clipboard!');
      
      // Track event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_quote', {
          'quote_id': quoteId,
          'category': quote.category
        });
      }
    }
  } catch (error) {
    console.error('Error copying quote:', error);
    showToast('Failed to copy quote', 'error');
  }
}

// Share Quote
async function shareQuote(quoteId) {
  try {
    const quotes = await fetchQuotes();
    const quote = quotes.find(q => q.id === quoteId);
    
    if (quote) {
      const shareData = {
        title: 'QuotesVault',
        text: `"${quote.text}" — ${quote.author}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        const text = `"${quote.text}" — ${quote.author}\n\n${window.location.href}`;
        await navigator.clipboard.writeText(text);
        showToast('Quote link copied! Share it with your friends.');
      }
      
      // Track event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share_quote', {
          'quote_id': quoteId,
          'category': quote.category
        });
      }
    }
  } catch (error) {
    console.error('Error sharing quote:', error);
  }
}

// Toggle Favorite
function toggleFavorite(quoteId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(quoteId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    showToast('Removed from favorites');
  } else {
    favorites.push(quoteId);
    showToast('Added to favorites ❤️');
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Update button
  const button = document.querySelector(`button[data-quote-id="${quoteId}"].btn-favorite`);
  if (button) {
    button.textContent = isFavorite(quoteId) ? '❤️' : '🤍';
  }
  
  // Track event
  if (typeof gtag !== 'undefined') {
    gtag('event', index > -1 ? 'remove_favorite' : 'add_favorite', {
      'quote_id': quoteId
    });
  }
}

// Get Favorites from LocalStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Check if Quote is Favorite
function isFavorite(quoteId) {
  const favorites = getFavorites();
  return favorites.includes(quoteId);
}

// Show Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-weight: 500;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideInUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Utility: Debounce Function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility: Throttle Function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export functions for use in other files
window.QuotesVault = {
  copyQuote,
  shareQuote,
  toggleFavorite,
  fetchQuotes,
  showToast
};
