// CodexAPI - 8th Wall Integration
// Exposes page-flip and palette-change events for AR synchronization

// Initialize CodexAPI if not exists
if (typeof window.CodexAPI === 'undefined') {
  window.CodexAPI = {
    // Page change listeners
    _pageChangeListeners: [],
    
    // Palette change listeners
    _paletteChangeListeners: [],
    
    // Register page change callback
    onPageChange: function(callback) {
      if (typeof callback === 'function') {
        this._pageChangeListeners.push(callback);
      }
    },
    
    // Register palette change callback
    onPaletteChange: function(callback) {
      if (typeof callback === 'function') {
        this._paletteChangeListeners.push(callback);
      }
    },
    
    // Notify page change (called by UI)
    notifyPageChange: function(pageIndex, pageData) {
      this._pageChangeListeners.forEach((fn) => {
        try {
          fn(pageIndex, pageData);
        } catch (e) {
          console.warn('CodexAPI onPageChange listener error:', e);
        }
      });
    },
    
    // Notify palette change (called by UI)
    notifyPaletteChange: function(paletteData) {
      this._paletteChangeListeners.forEach((fn) => {
        try {
          fn(paletteData);
        } catch (e) {
          console.warn('CodexAPI onPaletteChange listener error:', e);
        }
      });
    },
    
    // Trigger page flip animation (called by 8th Wall)
    triggerPageFlip: function(pageIndex) {
      // This would be implemented by the UI layer
      const event = new CustomEvent('codex-page-flip', {
        detail: { pageIndex }
      });
      window.dispatchEvent(event);
    }
  };
}

export default window.CodexAPI;

