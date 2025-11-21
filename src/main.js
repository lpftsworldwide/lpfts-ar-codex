// Main entry point for LPFTS Codex WebAR

import * as THREE from 'three';
import { ARScene } from './scene.js';
import { CodexAnimations } from './animations.js';
import { UI } from './ui.js';
import { CONFIG } from './config.js';
import './codex-api.js'; // Initialize CodexAPI
import { PageFlip } from './page-flip.js';
import { GestureDetector } from './gestures.js';
import { PageNavigation } from './page-navigation.js';
import { PageRenderer } from './page-renderer.js';
import { trackPageView } from './store-integration.js';
import { ARRaycaster } from './raycaster.js';

class LPFTCodexAR {
  constructor() {
    this.arSystem = null;
    this.arScene = null;
    this.arController = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.codexMesh = null;
    this.animations = null;
    this.ui = null;
    this.isTracking = false;
    this.clock = new THREE.Clock();
    this.rafId = null;
    // Page flip system
    this.pages = [];
    this.pageFlip = null;
    this.pageNav = null;
    this.gestureDetector = null;
    this.pageRenderer = null;
    this.isPageSystemActive = false;
    // Raycaster for interactions
    this.raycaster = null;
  }

  async init() {
    try {
      // Check for WebXR support
      if (!this.checkWebXRSupport()) {
        this.showError('WebXR not supported. Please use a compatible browser.');
        return;
      }

      // Initialize UI
      this.ui = new UI();

      // Initialize Three.js scene
      this.arScene = new ARScene(document.getElementById('ar-container'));
      const sceneData = await this.arScene.init();
      this.scene = sceneData.scene;
      this.camera = sceneData.camera;
      this.renderer = sceneData.renderer;
      this.codexMesh = sceneData.codexMesh;
      this.codexFx = sceneData.codexFx;
      this.pages = sceneData.pages || [];
      
      // Model loaded, but wait for MindAR before hiding loading
      console.log('Codex model loaded');
      console.log(`Codex has ${this.pages.length} pages`);

      // Initialize animations with FX
      if (this.codexMesh) {
        this.animations = new CodexAnimations(this.codexMesh, this.camera, null, this.codexFx);
      }
      
      // Initialize page flip system
      await this.initPageSystem();

      // Initialize MindAR
      await this.initMindAR();

      // Initialize raycaster for interactions
      this.initRaycaster();

      // Setup tap interaction
      this.setupTapInteraction();

      // Start render loop
      this.startRenderLoop();

      console.log('LPFTS Codex WebAR initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      this.showError('Failed to initialize AR. Please refresh and try again.');
    }
  }

  checkWebXRSupport() {
    return 'xr' in navigator || 'getUserMedia' in navigator.mediaDevices;
  }

  async initMindAR() {
    return new Promise((resolve, reject) => {
      // Wait for MindAR to load
      if (typeof MindARThree === 'undefined') {
        setTimeout(() => this.initMindAR().then(resolve).catch(reject), 100);
        return;
      }

      try {
        this.arController = new MindARThree.ImageTrackingController({
          imageTargetSrc: CONFIG.mindar.imageTargetSrc,
          maxTrack: CONFIG.mindar.maxTrack,
          warmupTolerance: CONFIG.mindar.warmupTolerance,
          missTolerance: CONFIG.mindar.missTolerance
        });

        const { renderer, scene, camera } = this.arController;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // Add codex to AR scene
        if (this.codexMesh) {
          this.scene.add(this.codexMesh);
        }

        // Start AR with timeout protection
        const startARPromise = this.arController.start().then(() => {
          console.log('MindAR started successfully');
          this.setupTrackingEvents();
          // Hide loading screen after everything is ready
          this.hideLoadingScreen();
          resolve();
        });

        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('MindAR initialization timeout (15s). Please check:\n' +
              '1. Camera permissions granted?\n' +
              '2. Target image (.mind file) exists?\n' +
              '3. Using HTTPS connection?\n' +
              '4. Network connection stable?'));
          }, 15000);
        });

        Promise.race([startARPromise, timeoutPromise])
          .catch((error) => {
            console.error('MindAR start error:', error);
            this.hideLoadingScreen();
            
            // Show user-friendly error message
            const errorMsg = error.message || 'Failed to initialize AR experience';
            this.showError(errorMsg + '\n\nTips:\n' +
              '• Ensure you compiled your poster to a .mind file\n' +
              '• Run: node scripts/compile-mindar-target.js\n' +
              '• Or use: https://hiukim.github.io/mind-ar-js-doc/tools/compile\n' +
              '• Save as: public/assets/targets/poster-target.mind');
            
            reject(error);
          });
      } catch (error) {
        console.error('MindAR initialization error:', error);
        reject(error);
      }
    });
  }

  setupTrackingEvents() {
    this.arController.onTargetFound = () => {
      console.log('Target found');
      this.isTracking = true;
      if (this.codexMesh) {
        this.codexMesh.visible = true;
      }
      // Enable raycaster when tracking
      if (this.raycaster) {
        this.raycaster.enable();
      }
    };

    this.arController.onTargetLost = () => {
      console.log('Target lost');
      this.isTracking = false;
      if (this.codexMesh) {
        this.codexMesh.visible = false;
      }
      if (this.animations) {
        this.animations.reset();
      }
      this.ui.hideButtons();
      // Disable raycaster when not tracking
      if (this.raycaster) {
        this.raycaster.disable();
      }
    };
  }

  initRaycaster() {
    if (!this.camera || !this.renderer) {
      console.error('Cannot initialize raycaster: camera or renderer missing');
      return;
    }

    this.raycaster = new ARRaycaster(this.camera, this.renderer);
    this.raycaster.init();

    // Make the codex book interactable
    if (this.codexMesh) {
      this.raycaster.addInteractableObject(this.codexMesh, {
        onTap: (object) => {
          console.log('Codex tapped!');
          this.handleCodexTap();
        },
        onHover: (object) => {
          // Add subtle hover effect
          if (this.codexFx && this.codexFx.addOutlineGlow) {
            this.codexFx.addOutlineGlow(0.5);
          }
        },
        onHoverEnd: (object) => {
          // Remove hover effect
          if (this.codexFx && this.codexFx.removeOutlineGlow) {
            this.codexFx.removeOutlineGlow();
          }
        }
      });
    }

    console.log('Raycaster initialized - book is now interactable');
  }

  async handleCodexTap() {
    if (!this.isTracking || !this.animations) return;

    // If book is closed, zoom and open it
    if (!this.isPageSystemActive) {
      console.log('Opening book...');
      await this.animations.zoomIn();
      await this.animations.openBook();
      
      // Activate page system
      if (this.pageNav) {
        this.pageNav.show();
        this.isPageSystemActive = true;
      }
    }
  }

  async initPageSystem() {
    if (this.pages.length === 0) {
      console.warn('No pages found in model, page flip system disabled');
      return;
    }

    // Initialize page renderer
    this.pageRenderer = new PageRenderer();

    // Render textures for all pages
    console.log('Rendering page textures...');
    const pageIndices = [-1, 0, 1, 2, 3]; // Cover, BAEK, LURK, MAIM, Back Cover
    for (const pageIndex of pageIndices) {
      const pageArrayIndex = pageIndex + 1; // Map -1→0, 0→1, etc.
      if (this.pages[pageArrayIndex]) {
        const texture = await this.pageRenderer.renderPage(pageIndex);
        if (texture && this.pages[pageArrayIndex].material) {
          this.pages[pageArrayIndex].material.map = texture;
          this.pages[pageArrayIndex].material.needsUpdate = true;
        }
      }
    }
    console.log('Page textures rendered');

    // Initialize page flip handler
    this.pageFlip = new PageFlip(this.pages, (pageIndex) => {
      console.log(`Flipped to page: ${pageIndex}`);
      trackPageView(pageIndex, `Page ${pageIndex}`);
      if (this.pageNav) {
        this.pageNav.updatePage(pageIndex);
      }
    });

    // Connect page flip handler to animations
    if (this.animations) {
      this.animations.setPageFlipHandler(this.pageFlip);
    }

    // Initialize page navigation UI
    this.pageNav = new PageNavigation((direction) => {
      if (direction === 'next') {
        this.animations.flipPage('next');
      } else if (direction === 'previous') {
        this.animations.flipPage('previous');
      }
    });

    // Initialize gesture detector
    this.gestureDetector = new GestureDetector(this.renderer.domElement, {
      onSwipe: (direction) => {
        if (!this.isPageSystemActive) return;
        
        if (direction === 'left') {
          // Swipe left = next page
          this.animations.flipPage('next');
        } else if (direction === 'right') {
          // Swipe right = previous page
          this.animations.flipPage('previous');
        }
      }
    });

    console.log('Page system initialized');
  }

  setupTapInteraction() {
    let tapTimeout = null;
    let lastTapTime = 0;

    const handleTap = (event) => {
      const currentTime = Date.now();
      const tapLength = currentTime - lastTapTime;

      if (tapLength < 300 && tapLength > 0) {
        // Double tap - zoom and open
        clearTimeout(tapTimeout);
        this.handleDoubleTap();
      } else {
        // Single tap - might be double tap
        tapTimeout = setTimeout(() => {
          this.handleSingleTap();
        }, 300);
      }

      lastTapTime = currentTime;
    };

    // Mouse/touch events
    this.renderer.domElement.addEventListener('click', handleTap);
    this.renderer.domElement.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleTap(e);
    });
  }

  async handleSingleTap() {
    if (!this.isTracking || !this.animations) return;
    console.log('Single tap detected');
  }

  async handleDoubleTap() {
    if (!this.isTracking || !this.animations) return;
    console.log('Double tap - zooming and opening book');

    // Zoom in
    await this.animations.zoomIn();

    // Open book
    await this.animations.openBook();

    // Activate page system instead of old UI
    if (this.pageNav && !this.isPageSystemActive) {
      this.pageNav.show();
      this.isPageSystemActive = true;
    }
  }

  startRenderLoop() {
    const animate = () => {
      this.rafId = requestAnimationFrame(animate);

      if (this.arController && this.renderer && this.scene && this.camera) {
        // Update animations
        if (this.animations && this.isTracking) {
          const deltaTime = this.clock.getDelta();
          // Use idleAnimation which includes all FX updates
          this.animations.idleAnimation(deltaTime);
        }

        // Render
        this.renderer.render(this.scene, this.camera);
      }
    };

    animate();
  }

  hideLoadingScreen() {
    if (window.hideLoadingScreen) {
      window.hideLoadingScreen();
    } else {
      const loading = document.getElementById('loading-screen');
      if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
          loading.style.display = 'none';
        }, 500);
      }
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    this.hideLoadingScreen();
  }

  dispose() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.arController) {
      this.arController.stop();
    }
    if (this.arScene) {
      this.arScene.dispose();
    }
    if (this.gestureDetector) {
      this.gestureDetector.destroy();
    }
    if (this.pageNav) {
      this.pageNav.destroy();
    }
    if (this.pageRenderer) {
      this.pageRenderer.dispose();
    }
    if (this.raycaster) {
      this.raycaster.dispose();
    }
  }
}

// Initialize on page load
let app = null;

async function requestCameraPermission() {
  try {
    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    // iOS Safari requires specific constraints
    const constraints = isIOS ? {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    } : {
      video: {
        facingMode: 'environment'
      }
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Camera permission granted');
    stream.getTracks().forEach(track => track.stop()); // Stop immediately, MindAR will handle it
    return true;
  } catch (error) {
    console.error('Camera permission error:', error);
    
    // Show user-friendly error
    const permissionMessage = document.getElementById('permission-message');
    if (permissionMessage) {
      permissionMessage.style.display = 'flex';
      
      // Customize message based on error
      const errorText = permissionMessage.querySelector('p');
      if (error.name === 'NotAllowedError') {
        errorText.textContent = 'Camera access was denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorText.textContent = 'No camera found on your device.';
      } else if (error.name === 'NotReadableError') {
        errorText.textContent = 'Camera is already in use by another app.';
      } else {
        errorText.textContent = 'Camera access is required to view the AR Codex.';
      }
    }
    return false;
  }
}

window.addEventListener('load', async () => {
  // Request camera permission with iOS-specific handling
  const cameraGranted = await requestCameraPermission();
  
  if (!cameraGranted) {
    return; // Don't initialize if camera not available
  }

  // Initialize AR app
  app = new LPFTCodexAR();
  await app.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (app) {
    app.dispose();
  }
});

