// Three.js scene setup and Codex model loading

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CONFIG } from './config.js';
import { setupCodexFX } from './fx/codexFx.js';

export class ARScene {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.codexMesh = null;
    this.loader = new GLTFLoader();
    this.isModelLoaded = false;
  }

  async init() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.scene.backgroundColor);
    this.scene.fog = new THREE.Fog(
      CONFIG.scene.fogColor,
      CONFIG.scene.fogNear,
      CONFIG.scene.fogFar
    );

    // Create camera (will be controlled by MindAR)
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    // Add lighting
    this.setupLighting();

    // Load Codex model
    await this.loadCodex();

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    return {
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer,
      codexMesh: this.codexMesh,
      codexFx: this.codexFx,
      pages: this.pages
    };
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light (main) - LPFTS neon green
    const directionalLight = new THREE.DirectionalLight(0x05FF00, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point light (accent - neon green)
    const pointLight = new THREE.PointLight(0x05FF00, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    this.scene.add(pointLight);

    // Hemisphere light (fill)
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.4);
    this.scene.add(hemisphereLight);
  }

  async loadCodex() {
    return new Promise((resolve, reject) => {
      this.loader.load(
        CONFIG.codex.modelPath,
        (gltf) => {
          this.codexMesh = gltf.scene;
          this.codexMesh.scale.set(
            CONFIG.codex.scale,
            CONFIG.codex.scale,
            CONFIG.codex.scale
          );
          this.codexMesh.position.set(
            CONFIG.codex.position.x,
            CONFIG.codex.position.y,
            CONFIG.codex.position.z
          );
          this.codexMesh.rotation.set(
            CONFIG.codex.rotation.x,
            CONFIG.codex.rotation.y,
            CONFIG.codex.rotation.z
          );

          // Enable shadows
          this.codexMesh.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Extract individual page meshes for page-flip system
          this.pages = this.extractPages(this.codexMesh);
          console.log(`Extracted ${this.pages.length} pages from model`);

          // Setup Max Power FX (glowing veins, runes, light leaks, hologram aura)
          this.codexFx = setupCodexFX(this.codexMesh);
          console.log('Codex FX setup complete');

          this.scene.add(this.codexMesh);
          this.isModelLoaded = true;
          console.log('Codex model loaded successfully');
          resolve(this.codexMesh);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`Loading Codex: ${percent.toFixed(2)}%`);
        },
        (error) => {
          console.error('Error loading Codex model:', error);
          // Create placeholder cube if model fails to load
          this.createPlaceholderCodex();
          resolve(this.codexMesh);
        }
      );
    });
  }

  // Extract individual page meshes from loaded model
  extractPages(codexMesh) {
    const pages = [];
    
    // Find the Pages group in the model
    let pagesGroup = null;
    codexMesh.traverse((child) => {
      if (child.name === 'Pages' && child.isGroup) {
        pagesGroup = child;
      }
    });
    
    if (pagesGroup) {
      // Extract pages from the group
      pagesGroup.children.forEach((child) => {
        if (child.name.startsWith('Page_')) {
          pages.push(child);
        }
      });
      
      // Sort by page index
      pages.sort((a, b) => {
        const aIndex = parseInt(a.name.split('_')[1]);
        const bIndex = parseInt(b.name.split('_')[1]);
        return aIndex - bIndex;
      });
    } else {
      console.warn('Pages group not found in model');
    }
    
    return pages;
  }

  createPlaceholderCodex() {
    // Create a placeholder book if GLB fails to load
    const geometry = new THREE.BoxGeometry(0.5, 0.7, 0.1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      metalness: 0.3,
      roughness: 0.7
    });
    this.codexMesh = new THREE.Mesh(geometry, material);
    this.codexMesh.castShadow = true;
    this.codexMesh.receiveShadow = true;
    this.scene.add(this.codexMesh);
    this.pages = [];
    console.log('Placeholder Codex created');
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
  }
}

