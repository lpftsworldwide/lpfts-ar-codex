// Raycaster module for AR interactions
// Handles tap, touch, and pointer interactions with 3D objects

import * as THREE from 'three';

export class ARRaycaster {
  constructor(camera, renderer) {
    this.camera = camera;
    this.renderer = renderer;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.interactableObjects = [];
    this.hoveredObject = null;
    this.onTapCallbacks = new Map();
    this.onHoverCallbacks = new Map();
    this.enabled = false;
    
    // Bind methods
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  init() {
    // Add event listeners
    const canvas = this.renderer.domElement;
    
    // Mouse events (for desktop testing)
    canvas.addEventListener('pointermove', this.handlePointerMove, false);
    canvas.addEventListener('pointerdown', this.handlePointerDown, false);
    
    // Touch events (for mobile)
    canvas.addEventListener('touchstart', this.handleTouchStart, {passive: false});
    canvas.addEventListener('touchend', this.handleTouchEnd, {passive: false});
    
    this.enabled = true;
    console.log('ARRaycaster initialized');
  }

  addInteractableObject(object, { onTap, onHover, onHoverEnd } = {}) {
    if (!this.interactableObjects.includes(object)) {
      this.interactableObjects.push(object);
      
      if (onTap) {
        this.onTapCallbacks.set(object, onTap);
      }
      if (onHover || onHoverEnd) {
        this.onHoverCallbacks.set(object, { onHover, onHoverEnd });
      }
    }
  }

  removeInteractableObject(object) {
    const index = this.interactableObjects.indexOf(object);
    if (index > -1) {
      this.interactableObjects.splice(index, 1);
      this.onTapCallbacks.delete(object);
      this.onHoverCallbacks.delete(object);
    }
  }

  clearInteractableObjects() {
    this.interactableObjects = [];
    this.onTapCallbacks.clear();
    this.onHoverCallbacks.clear();
    this.hoveredObject = null;
  }

  updatePointer(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    let clientX, clientY;

    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  handlePointerMove(event) {
    if (!this.enabled) return;
    
    this.updatePointer(event);
    this.checkHover();
  }

  handlePointerDown(event) {
    if (!this.enabled) return;
    
    this.updatePointer(event);
    this.checkTap();
  }

  handleTouchStart(event) {
    if (!this.enabled || event.touches.length === 0) return;
    
    event.preventDefault();
    this.updatePointer(event);
  }

  handleTouchEnd(event) {
    if (!this.enabled) return;
    
    event.preventDefault();
    // Use changedTouches for touchend
    if (event.changedTouches && event.changedTouches.length > 0) {
      const touch = event.changedTouches[0];
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.pointer.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
    }
    
    this.checkTap();
  }

  checkHover() {
    if (this.interactableObjects.length === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      
      // Find the root interactable object (might be a child)
      let targetObject = null;
      for (const obj of this.interactableObjects) {
        if (obj === intersectedObject || obj === intersectedObject.parent || this.isDescendant(obj, intersectedObject)) {
          targetObject = obj;
          break;
        }
      }

      if (targetObject && targetObject !== this.hoveredObject) {
        // Call hover end for previous object
        if (this.hoveredObject) {
          const callbacks = this.onHoverCallbacks.get(this.hoveredObject);
          if (callbacks && callbacks.onHoverEnd) {
            callbacks.onHoverEnd(this.hoveredObject);
          }
        }

        // Call hover start for new object
        this.hoveredObject = targetObject;
        const callbacks = this.onHoverCallbacks.get(targetObject);
        if (callbacks && callbacks.onHover) {
          callbacks.onHover(targetObject, intersects[0]);
        }

        // Change cursor
        this.renderer.domElement.style.cursor = 'pointer';
      }
    } else if (this.hoveredObject) {
      // No hover
      const callbacks = this.onHoverCallbacks.get(this.hoveredObject);
      if (callbacks && callbacks.onHoverEnd) {
        callbacks.onHoverEnd(this.hoveredObject);
      }
      this.hoveredObject = null;
      this.renderer.domElement.style.cursor = 'default';
    }
  }

  checkTap() {
    if (this.interactableObjects.length === 0) return;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactableObjects, true);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      
      // Find the root interactable object
      let targetObject = null;
      for (const obj of this.interactableObjects) {
        if (obj === intersectedObject || obj === intersectedObject.parent || this.isDescendant(obj, intersectedObject)) {
          targetObject = obj;
          break;
        }
      }

      if (targetObject) {
        const callback = this.onTapCallbacks.get(targetObject);
        if (callback) {
          callback(targetObject, intersects[0]);
        }

        // Haptic feedback on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    }
  }

  isDescendant(parent, child) {
    let node = child.parent;
    while (node) {
      if (node === parent) {
        return true;
      }
      node = node.parent;
    }
    return false;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  dispose() {
    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointermove', this.handlePointerMove);
    canvas.removeEventListener('pointerdown', this.handlePointerDown);
    canvas.removeEventListener('touchstart', this.handleTouchStart);
    canvas.removeEventListener('touchend', this.handleTouchEnd);
    
    this.clearInteractableObjects();
    this.hoveredObject = null;
    console.log('ARRaycaster disposed');
  }
}

