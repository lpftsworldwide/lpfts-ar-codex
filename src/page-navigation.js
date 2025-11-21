// LPFTS Codex Page Navigation UI

import { BRAND } from './store-integration.js';

export class PageNavigation {
  constructor(onNavigate = null) {
    this.onNavigate = onNavigate;
    this.currentPage = -1;
    this.totalPages = 5; // Cover + 3 masterclasses + back cover
    this.isVisible = false;
    
    this.container = null;
    this.prevButton = null;
    this.nextButton = null;
    this.indicator = null;
    this.galleryButton = null;
    
    this.createUI();
  }

  createUI() {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'page-navigation';
    this.container.className = 'page-navigation hidden';
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 100;
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid ${BRAND.colors.neonGreen};
      border-radius: 30px;
      backdrop-filter: blur(10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    // Previous button
    this.prevButton = document.createElement('button');
    this.prevButton.className = 'nav-button prev-button';
    this.prevButton.innerHTML = '◄';
    this.prevButton.style.cssText = `
      width: 44px;
      height: 44px;
      border: 2px solid ${BRAND.colors.chrome};
      background: rgba(255, 255, 255, 0.1);
      color: ${BRAND.colors.neonGreen};
      font-size: 20px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: Arial, sans-serif;
    `;
    this.prevButton.addEventListener('click', () => this.handlePrevious());
    
    // Page indicator
    this.indicator = document.createElement('div');
    this.indicator.className = 'page-indicator';
    this.indicator.style.cssText = `
      color: ${BRAND.colors.chrome};
      font-size: 16px;
      font-weight: bold;
      min-width: 60px;
      text-align: center;
      font-family: Arial, sans-serif;
      user-select: none;
    `;
    this.updateIndicator();
    
    // Next button
    this.nextButton = document.createElement('button');
    this.nextButton.className = 'nav-button next-button';
    this.nextButton.innerHTML = '►';
    this.nextButton.style.cssText = `
      width: 44px;
      height: 44px;
      border: 2px solid ${BRAND.colors.chrome};
      background: rgba(255, 255, 255, 0.1);
      color: ${BRAND.colors.neonGreen};
      font-size: 20px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      font-family: Arial, sans-serif;
    `;
    this.nextButton.addEventListener('click', () => this.handleNext());
    
    // Gallery button
    this.galleryButton = document.createElement('button');
    this.galleryButton.className = 'gallery-button';
    this.galleryButton.innerHTML = '🎨 Gallery';
    this.galleryButton.style.cssText = `
      height: 44px;
      padding: 0 20px;
      border: 2px solid ${BRAND.colors.neonGreen};
      background: linear-gradient(135deg, rgba(0, 229, 255, 0.2), rgba(50, 255, 245, 0.2));
      color: ${BRAND.colors.neonGreen};
      font-size: 14px;
      font-weight: bold;
      border-radius: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      font-family: Arial, sans-serif;
      text-shadow: 0 0 10px rgba(99, 255, 125, 0.5);
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
      margin-left: 15px;
    `;
    this.galleryButton.addEventListener('click', () => this.handleGallery());
    
    // Assemble
    this.container.appendChild(this.prevButton);
    this.container.appendChild(this.indicator);
    this.container.appendChild(this.nextButton);
    this.container.appendChild(this.galleryButton);
    
    // Add to DOM
    document.body.appendChild(this.container);
    
    // Add hover effects via style
    const style = document.createElement('style');
    style.textContent = `
      .nav-button:hover {
        background: rgba(99, 255, 125, 0.2) !important;
        border-color: ${BRAND.colors.neonGreen} !important;
        transform: scale(1.1);
      }
      .nav-button:active {
        transform: scale(0.95);
      }
      .nav-button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .nav-button:disabled:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        transform: scale(1);
      }
      .gallery-button:hover {
        background: linear-gradient(135deg, rgba(0, 229, 255, 0.4), rgba(50, 255, 245, 0.4)) !important;
        transform: scale(1.05);
        box-shadow: 0 0 25px rgba(0, 229, 255, 0.6) !important;
      }
      .gallery-button:active {
        transform: scale(0.98);
      }
    `;
    document.head.appendChild(style);
  }

  show() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.container.classList.remove('hidden');
    this.container.style.opacity = '1';
    this.container.style.transform = 'translateX(-50%) translateY(0)';
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.container.style.opacity = '0';
    this.container.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => {
      this.container.classList.add('hidden');
    }, 300);
  }

  updatePage(pageIndex) {
    this.currentPage = pageIndex;
    this.updateIndicator();
    this.updateButtons();
  }

  updateIndicator() {
    // Map page index to display number
    const displayNumber = this.currentPage + 2; // -1 becomes 1 (cover), 0 becomes 2, etc.
    this.indicator.textContent = `${displayNumber} / ${this.totalPages}`;
  }

  updateButtons() {
    // Update button states
    this.prevButton.disabled = this.currentPage <= -1;
    this.nextButton.disabled = this.currentPage >= this.totalPages - 2; // -2 because indices are -1 to 3
  }

  handlePrevious() {
    if (this.currentPage <= -1) return;
    if (this.onNavigate) {
      this.onNavigate('previous');
    }
  }

  handleNext() {
    if (this.currentPage >= this.totalPages - 2) return;
    if (this.onNavigate) {
      this.onNavigate('next');
    }
  }

  handleGallery() {
    console.log('Opening LPFTS Gallery...');
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
    }
    
    // Open gallery in new tab
    window.open('https://lpfts.com/gallery', '_blank');
    
    // Track event
    if (window.gtag) {
      window.gtag('event', 'gallery_open', {
        event_category: 'ar_interaction',
        event_label: 'codex_gallery_button'
      });
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

