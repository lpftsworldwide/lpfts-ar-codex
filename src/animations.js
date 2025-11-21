// Animation utilities for the Codex book - Improved with smooth easing

import * as THREE from 'three';
import {
  updateVeinGlow,
  updateRunes,
  updateLightLeaks,
  updateHologramAura
} from './fx/codexFx.js';

export class CodexAnimations {
  constructor(codexMesh, camera, controls, codexFx = null) {
    this.codexMesh = codexMesh;
    this.camera = camera;
    this.controls = controls;
    this.codexFx = codexFx;
    this.originalScale = codexMesh.scale.clone();
    this.originalPosition = codexMesh.position.clone();
    this.originalRotation = codexMesh.rotation.clone();
    this.isZoomed = false;
    this.isOpen = false;
    this.hoverOffset = 0;
    this.rotationY = 0;
    this.animationFrame = null;
    this.time = 0;
    this.currentOpenAngle = 0;
    // Page flip system
    this.pages = [];
    this.currentPageIndex = -1;
    this.pageFlipHandler = null;
  }

  // Idle hover animation - gentle floating
  updateHover(deltaTime) {
    if (!this.isZoomed && !this.isOpen) {
      this.hoverOffset += deltaTime * 1.5;
      const hoverAmount = Math.sin(this.hoverOffset) * 0.1;
      this.codexMesh.position.y = this.originalPosition.y + hoverAmount;
    }
  }

  // Idle rotation - gentle spinning
  updateRotation(deltaTime) {
    if (!this.isZoomed && !this.isOpen) {
      this.rotationY += deltaTime * 0.5;
      this.codexMesh.rotation.y = this.rotationY;
    }
  }

  // Idle animation with FX updates
  idleAnimation(deltaTime) {
    this.time += deltaTime;
    
    // Update hover and rotation
    this.updateHover(deltaTime);
    this.updateRotation(deltaTime);
    
    // Update FX if available
    if (this.codexFx) {
      // Glyph veins pulsate
      const veinIntensity = 0.5 + Math.sin(this.time * 2.0) * 0.3;
      updateVeinGlow(this.codexFx.veins, veinIntensity);
      
      // Update floating runes
      updateRunes(this.codexFx.runes, deltaTime, this.time);
      
      // Hologram aura pulses when idle
      updateHologramAura(this.codexFx.hologram, true, false, this.time);
    }
  }

  // Zoom in animation with camera dolly
  async zoomIn() {
    if (this.isZoomed) return;

    const duration = 1000;
    const startTime = performance.now();
    const startScale = this.originalScale.clone();
    const targetScale = startScale.clone().multiplyScalar(2.5);
    const startPos = this.codexMesh.position.clone();
    const targetPos = new THREE.Vector3(0, 0.5, -0.5);

    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeOutCubic(progress);

        // Scale interpolation
        this.codexMesh.scale.lerpVectors(startScale, targetScale, easeProgress);
        
        // Position interpolation
        this.codexMesh.position.lerpVectors(startPos, targetPos, easeProgress);

        // Camera dolly (if camera is available)
        if (this.camera) {
          const cameraStart = new THREE.Vector3(0, 0, 0);
          const cameraTarget = new THREE.Vector3(0, 0.3, 0.8);
          this.camera.position.lerpVectors(cameraStart, cameraTarget, easeProgress);
        }

        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animate);
        } else {
          this.isZoomed = true;
          resolve();
        }
      };
      this.animationFrame = requestAnimationFrame(animate);
    });
  }

  // Open book animation - 110° rotation with FX
  async openBook() {
    if (this.isOpen) return;

    const duration = 1500;
    const startTime = performance.now();
    const startRotationX = this.codexMesh.rotation.x;
    // 110 degrees in radians = ~1.9199
    const targetRotationX = -(110 * Math.PI / 180);

    return new Promise((resolve) => {
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = this.easeOutCubic(progress);

        // Smooth rotation interpolation
        const currentRotationX = startRotationX + (targetRotationX - startRotationX) * easeProgress;
        this.codexMesh.rotation.x = currentRotationX;
        this.currentOpenAngle = currentRotationX;

        // Update FX during opening
        if (this.codexFx) {
          // Light leaks intensify as book opens
          updateLightLeaks(this.codexFx.lightLeaks, this.currentOpenAngle);
          
          // Hologram brightens briefly
          const isOpening = progress < 0.3; // Bright for first 30% of animation
          updateHologramAura(this.codexFx.hologram, false, isOpening, this.time);
          
          // Runes intensify briefly
          if (progress < 0.5) {
            const runeIntensity = 1.0 + (1.0 - progress * 2) * 0.5;
            this.codexFx.runes.children.forEach((rune) => {
              if (rune.material) {
                rune.material.opacity = Math.min(0.7 + runeIntensity * 0.3, 1.0);
              }
            });
          }
          
          // Veins glow brighter
          const veinIntensity = 0.8 + Math.sin(progress * Math.PI) * 0.2;
          updateVeinGlow(this.codexFx.veins, veinIntensity);
        }

        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animate);
        } else {
          this.isOpen = true;
          // Final FX state
          if (this.codexFx) {
            updateLightLeaks(this.codexFx.lightLeaks, this.currentOpenAngle);
            updateHologramAura(this.codexFx.hologram, false, false, this.time);
          }
          resolve();
        }
      };
      this.animationFrame = requestAnimationFrame(animate);
    });
  }

  // Reset to original state
  reset() {
    // Cancel any ongoing animations
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    this.isZoomed = false;
    this.isOpen = false;
    this.hoverOffset = 0;
    this.currentPageIndex = -1;
    
    // Reset transforms
    this.codexMesh.scale.copy(this.originalScale);
    this.codexMesh.position.copy(this.originalPosition);
    this.codexMesh.rotation.copy(this.originalRotation);
    
    // Reset camera if available
    if (this.camera) {
      this.camera.position.set(0, 0, 0);
    }
    
    // Reset page flip handler
    if (this.pageFlipHandler) {
      this.pageFlipHandler.reset();
    }
  }

  // Easing function - easeOutCubic for smooth deceleration
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Alternative easing - easeInOutCubic
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Page flip methods
  setPageFlipHandler(handler) {
    this.pageFlipHandler = handler;
  }
  
  async flipPage(direction) {
    if (!this.pageFlipHandler) return false;
    
    if (direction === 'next') {
      return await this.pageFlipHandler.flipNext();
    } else if (direction === 'previous') {
      return await this.pageFlipHandler.flipPrevious();
    }
    return false;
  }
  
  async goToPage(pageIndex) {
    if (!this.pageFlipHandler) return false;
    const direction = pageIndex > this.getCurrentPage() ? 'forward' : 'backward';
    return await this.pageFlipHandler.flipTo(pageIndex, direction);
  }
  
  getCurrentPage() {
    return this.pageFlipHandler ? this.pageFlipHandler.getCurrentPage() : -1;
  }
  
  canFlipNext() {
    return this.pageFlipHandler ? this.pageFlipHandler.canFlipNext() : false;
  }
  
  canFlipPrevious() {
    return this.pageFlipHandler ? this.pageFlipHandler.canFlipPrevious() : false;
  }

  // Cleanup
  dispose() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}
