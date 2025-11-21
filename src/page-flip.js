// LPFTS Codex Page Flip Animation System

import * as THREE from 'three';

export class PageFlip {
  constructor(pages, onFlipComplete = null) {
    this.pages = pages; // Array of page meshes
    this.currentPage = -1; // Start at cover
    this.isFlipping = false;
    this.flipDuration = 800; // milliseconds
    this.onFlipComplete = onFlipComplete;
  }

  // Flip to next page
  async flipNext() {
    if (this.isFlipping) return false;
    
    const nextIndex = this.currentPage + 1;
    if (nextIndex >= this.pages.length) return false;
    
    return this.flipTo(nextIndex, 'forward');
  }

  // Flip to previous page
  async flipPrevious() {
    if (this.isFlipping) return false;
    
    const prevIndex = this.currentPage - 1;
    if (prevIndex < -1) return false;
    
    return this.flipTo(prevIndex, 'backward');
  }

  // Flip to specific page
  async flipTo(targetPageIndex, direction = 'forward') {
    if (this.isFlipping) return false;
    if (targetPageIndex === this.currentPage) return false;
    
    this.isFlipping = true;
    
    try {
      // Determine which pages to flip
      const pagesToFlip = this.getPagesToFlip(this.currentPage, targetPageIndex);
      
      // Flip pages sequentially or in batch
      for (const pageIndex of pagesToFlip) {
        await this.flipSinglePage(pageIndex, direction);
      }
      
      this.currentPage = targetPageIndex;
      
      if (this.onFlipComplete) {
        this.onFlipComplete(this.currentPage);
      }
      
      return true;
    } finally {
      this.isFlipping = false;
    }
  }

  // Get pages that need to flip between current and target
  getPagesToFlip(currentIndex, targetIndex) {
    const pages = [];
    if (targetIndex > currentIndex) {
      // Flipping forward
      for (let i = currentIndex + 1; i <= targetIndex; i++) {
        pages.push(i);
      }
    } else {
      // Flipping backward
      for (let i = currentIndex; i > targetIndex; i--) {
        pages.push(i);
      }
    }
    return pages;
  }

  // Flip a single page
  async flipSinglePage(pageIndex, direction) {
    const page = this.pages[pageIndex];
    if (!page) return;
    
    const startRotation = page.rotation.y;
    const targetRotation = direction === 'forward' ? Math.PI : 0;
    
    const startTime = performance.now();
    
    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / this.flipDuration, 1);
        const easeProgress = this.easeOutCubic(progress);
        
        // Interpolate rotation
        page.rotation.y = startRotation + (targetRotation - startRotation) * easeProgress;
        
        // Update visibility/culling if needed
        if (progress < 0.5) {
          // First half of flip - showing original side
          page.material.side = THREE.FrontSide;
        } else {
          // Second half - showing back side
          page.material.side = THREE.BackSide;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Ensure final state
          page.rotation.y = targetRotation;
          page.material.side = THREE.DoubleSide;
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  // Easing function
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Get current page index
  getCurrentPage() {
    return this.currentPage;
  }

  // Check if can flip next
  canFlipNext() {
    return !this.isFlipping && this.currentPage < this.pages.length - 1;
  }

  // Check if can flip previous
  canFlipPrevious() {
    return !this.isFlipping && this.currentPage > -1;
  }

  // Reset to cover
  reset() {
    this.currentPage = -1;
    this.isFlipping = false;
    
    // Reset all pages to initial position
    this.pages.forEach((page, index) => {
      if (page) {
        page.rotation.y = 0;
        page.material.side = THREE.FrontSide;
      }
    });
  }
}

