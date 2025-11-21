// LPFTS Codex Gesture Detection System

export class GestureDetector {
  constructor(element, callbacks = {}) {
    this.element = element;
    this.callbacks = callbacks;
    
    // Touch/mouse state
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.isTracking = false;
    
    // Thresholds
    this.swipeThreshold = 50; // minimum distance in pixels
    this.velocityThreshold = 0.3; // minimum velocity in px/ms
    this.tapTimeout = 300; // max time for tap in ms
    
    // Bind event handlers
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    
    this.attachListeners();
  }

  attachListeners() {
    // Touch events
    this.element.addEventListener('touchstart', this.handleStart, { passive: false });
    this.element.addEventListener('touchmove', this.handleMove, { passive: false });
    this.element.addEventListener('touchend', this.handleEnd, { passive: false });
    
    // Mouse events (for desktop testing)
    this.element.addEventListener('mousedown', this.handleStart);
    this.element.addEventListener('mousemove', this.handleMove);
    this.element.addEventListener('mouseup', this.handleEnd);
  }

  detachListeners() {
    // Touch events
    this.element.removeEventListener('touchstart', this.handleStart);
    this.element.removeEventListener('touchmove', this.handleMove);
    this.element.removeEventListener('touchend', this.handleEnd);
    
    // Mouse events
    this.element.removeEventListener('mousedown', this.handleStart);
    this.element.removeEventListener('mousemove', this.handleMove);
    this.element.removeEventListener('mouseup', this.handleEnd);
  }

  handleStart(event) {
    const point = this.getPoint(event);
    if (!point) return;
    
    this.startX = point.x;
    this.startY = point.y;
    this.startTime = Date.now();
    this.isTracking = true;
  }

  handleMove(event) {
    if (!this.isTracking) return;
    
    // Prevent default to avoid scrolling during swipe
    const point = this.getPoint(event);
    if (!point) return;
    
    const deltaX = Math.abs(point.x - this.startX);
    const deltaY = Math.abs(point.y - this.startY);
    
    // If horizontal movement is dominant, prevent scroll
    if (deltaX > deltaY && deltaX > 10) {
      event.preventDefault();
    }
  }

  handleEnd(event) {
    if (!this.isTracking) return;
    
    const point = this.getPoint(event);
    if (!point) return;
    
    const deltaX = point.x - this.startX;
    const deltaY = point.y - this.startY;
    const deltaTime = Date.now() - this.startTime;
    
    this.isTracking = false;
    
    // Calculate distance and velocity
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;
    
    // Determine gesture type
    if (distance < 10 && deltaTime < this.tapTimeout) {
      // Tap
      this.handleTap(point);
    } else if (Math.abs(deltaX) > this.swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (velocity >= this.velocityThreshold) {
        this.handleSwipe(deltaX > 0 ? 'right' : 'left', distance, velocity);
      }
    } else if (Math.abs(deltaY) > this.swipeThreshold && Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe (optional)
      if (velocity >= this.velocityThreshold) {
        this.handleSwipe(deltaY > 0 ? 'down' : 'up', distance, velocity);
      }
    }
  }

  getPoint(event) {
    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    } else if (event.clientX !== undefined) {
      return {
        x: event.clientX,
        y: event.clientY
      };
    }
    return null;
  }

  handleTap(point) {
    if (this.callbacks.onTap) {
      this.callbacks.onTap(point);
    }
  }

  handleSwipe(direction, distance, velocity) {
    if (this.callbacks.onSwipe) {
      this.callbacks.onSwipe(direction, distance, velocity);
    }
  }

  destroy() {
    this.detachListeners();
  }
}

