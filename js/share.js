// ===================================
// Social Sharing Functions
// ===================================

(function() {
  'use strict';

  // Share on Facebook
  window.shareOnFacebook = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    openShareWindow(shareUrl, 'Share on Facebook');
    trackShare('facebook', quoteId);
  };

  // Share on Twitter
  window.shareOnTwitter = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const text = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
    const url = encodeURIComponent(window.location.href);
    const hashtags = encodeURIComponent('quotes,motivation,inspiration');
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    
    openShareWindow(shareUrl, 'Share on Twitter');
    trackShare('twitter', quoteId);
  };

  // Share on WhatsApp
  window.shareOnWhatsApp = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const text = encodeURIComponent(`"${quote.text}" — ${quote.author}\n\n${window.location.href}`);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const shareUrl = isMobile 
      ? `whatsapp://send?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;
    
    window.open(shareUrl, '_blank');
    trackShare('whatsapp', quoteId);
  };

  // Share on Pinterest
  window.shareOnPinterest = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const url = encodeURIComponent(window.location.href);
    const description = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
    const media = encodeURIComponent(window.location.origin + '/images/og-image.jpg');
    const shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${description}&media=${media}`;
    
    openShareWindow(shareUrl, 'Share on Pinterest');
    trackShare('pinterest', quoteId);
  };

  // Share on LinkedIn
  window.shareOnLinkedIn = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    
    openShareWindow(shareUrl, 'Share on LinkedIn');
    trackShare('linkedin', quoteId);
  };

  // Share via Email
  window.shareViaEmail = function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const subject = encodeURIComponent('Check out this amazing quote!');
    const body = encodeURIComponent(`"${quote.text}" — ${quote.author}\n\nFound on: ${window.location.href}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    trackShare('email', quoteId);
  };

  // Native Web Share API (if available)
  window.shareNative = async function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuotesVault',
          text: `"${quote.text}" — ${quote.author}`,
          url: window.location.href
        });
        trackShare('native', quoteId);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copy link
      copyShareLink(quoteId);
    }
  };

  // Copy Share Link
  window.copyShareLink = async function(quoteId) {
    const quote = getQuoteById(quoteId);
    if (!quote) return;
    
    const shareText = `"${quote.text}" — ${quote.author}\n\n${window.location.href}`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      if (window.QuotesVault && window.QuotesVault.showToast) {
        window.QuotesVault.showToast('Share link copied to clipboard!');
      } else {
        alert('Share link copied to clipboard!');
      }
      trackShare('copy_link', quoteId);
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  // Helper: Get quote by ID
  function getQuoteById(quoteId) {
    // This would need to fetch from quotes.json or use cached data
    // For now, return null - implement based on your data structure
    return null;
  }

  // Helper: Open share window
  function openShareWindow(url, title) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0`;
    
    window.open(url, title, features);
  }

  // Helper: Track share event
  function trackShare(platform, quoteId) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        'method': platform,
        'content_type': 'quote',
        'content_id': quoteId
      });
    }
  }

})();
