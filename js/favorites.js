// ===================================
// Favorites Management (localStorage)
// ===================================

(function() {
  'use strict';

  const FAVORITES_KEY = 'quotesvault_favorites';

  // Get all favorites
  window.getFavorites = function() {
    try {
      const favorites = localStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  };

  // Add to favorites
  window.addToFavorites = function(quoteId) {
    try {
      const favorites = getFavorites();
      
      if (!favorites.includes(quoteId)) {
        favorites.push(quoteId);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        
        if (window.QuotesVault && window.QuotesVault.showToast) {
          window.QuotesVault.showToast('Added to favorites ❤️');
        }
        
        // Track event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'add_to_favorites', {
            'quote_id': quoteId
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  // Remove from favorites
  window.removeFromFavorites = function(quoteId) {
    try {
      let favorites = getFavorites();
      const index = favorites.indexOf(quoteId);
      
      if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        
        if (window.QuotesVault && window.QuotesVault.showToast) {
          window.QuotesVault.showToast('Removed from favorites');
        }
        
        // Track event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'remove_from_favorites', {
            'quote_id': quoteId
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  // Toggle favorite
  window.toggleFavorite = function(quoteId) {
    const favorites = getFavorites();
    
    if (favorites.includes(quoteId)) {
      return removeFromFavorites(quoteId);
    } else {
      return addToFavorites(quoteId);
    }
  };

  // Check if quote is favorite
  window.isFavorite = function(quoteId) {
    const favorites = getFavorites();
    return favorites.includes(quoteId);
  };

  // Get favorites count
  window.getFavoritesCount = function() {
    const favorites = getFavorites();
    return favorites.length;
  };

  // Clear all favorites
  window.clearAllFavorites = function() {
    if (confirm('Are you sure you want to clear all favorites?')) {
      try {
        localStorage.removeItem(FAVORITES_KEY);
        
        if (window.QuotesVault && window.QuotesVault.showToast) {
          window.QuotesVault.showToast('All favorites cleared');
        }
        
        return true;
      } catch (error) {
        console.error('Error clearing favorites:', error);
        return false;
      }
    }
    return false;
  };

  // Export favorites (download as JSON)
  window.exportFavorites = function() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
      alert('No favorites to export');
      return;
    }
    
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotesvault-favorites.json';
    link.click();
    URL.revokeObjectURL(url);
    
    if (window.QuotesVault && window.QuotesVault.showToast) {
      window.QuotesVault.showToast('Favorites exported!');
    }
  };

  // Import favorites (upload JSON file)
  window.importFavorites = function(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        const importedFavorites = JSON.parse(e.target.result);
        
        if (Array.isArray(importedFavorites)) {
          const currentFavorites = getFavorites();
          const mergedFavorites = [...new Set([...currentFavorites, ...importedFavorites])];
          
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(mergedFavorites));
          
          if (window.QuotesVault && window.QuotesVault.showToast) {
            window.QuotesVault.showToast(`Imported ${importedFavorites.length} favorites!`);
          }
        } else {
          alert('Invalid favorites file format');
        }
      } catch (error) {
        console.error('Error importing favorites:', error);
        alert('Error importing favorites file');
      }
    };
    
    reader.readAsText(file);
  };

})();
