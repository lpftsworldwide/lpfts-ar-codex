#!/usr/bin/env node

/**
 * Render Max Power Codex to PNG
 * Creates a poster-ready image of the codex for AR tracking
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { buildCodexModel } from './build-codex-model.js';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock browser APIs for Node.js
global.HTMLCanvasElement = createCanvas(1, 1).constructor;
global.Image = createCanvas(1, 1).Image;

// Mock addEventListener for Node.js canvas
if (typeof global.HTMLCanvasElement.prototype.addEventListener === 'undefined') {
  global.HTMLCanvasElement.prototype.addEventListener = function() {};
  global.HTMLCanvasElement.prototype.removeEventListener = function() {};
}

async function renderCodexPNG() {
  console.log('🎨 Rendering Max Power Codex to PNG...\n');
  console.log('⚠️  Note: Node.js rendering has limitations. For best results,');
  console.log('   render the codex in a browser or use Blender/other 3D tools.\n');

  try {
    // Create canvas for rendering
    const width = 1024;
    const height = 1024;
    const canvas = createCanvas(width, height);
    
    // Mock canvas methods that WebGLRenderer expects
    if (!canvas.addEventListener) {
      canvas.addEventListener = function() {};
    }
    if (!canvas.removeEventListener) {
      canvas.removeEventListener = function() {};
    }
    
    // Create Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Setup camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0.3, 1.2);
    camera.lookAt(0, 0, 0);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x05FF00, 1.2);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x05FF00, 0.8, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Build codex model
    console.log('Building codex model...');
    const codex = buildCodexModel();
    scene.add(codex);

    // Try to create renderer with Node.js compatible options
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } catch (renderError) {
      console.error('⚠️  WebGLRenderer not available in Node.js environment');
      console.error('   This is expected - use browser rendering or 3D software instead');
      throw renderError;
    }

    // Render
    console.log('Rendering image...');
    renderer.render(scene, camera);

    // Save PNG
    const outputPath = path.join(__dirname, '../public/assets/images/poster-target.jpg');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Convert canvas to buffer and save
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath.replace('.jpg', '.png'), buffer);
    
    // Also save as JPG for AR tracking
    const jpgBuffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    fs.writeFileSync(outputPath, jpgBuffer);

    console.log(`✅ Codex rendered successfully!`);
    console.log(`   PNG: ${outputPath.replace('.jpg', '.png')}`);
    console.log(`   JPG: ${outputPath}`);
    console.log(`   Size: ${width}x${height}px\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n⚠️  Render failed (this is expected in Node.js):', error.message);
    console.error('   WebGL rendering requires a browser environment.');
    console.error('   Options:');
    console.error('   1. Use the generated GLB model in Blender/other 3D tools');
    console.error('   2. Render in browser and screenshot');
    console.error('   3. Use a placeholder image for AR tracking\n');
    // Exit with 0 so deployment can continue (this is optional)
    process.exit(0);
  }
}

renderCodexPNG();

