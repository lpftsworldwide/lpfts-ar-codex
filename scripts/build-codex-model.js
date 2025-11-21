#!/usr/bin/env node

/**
 * LPFTS Codex Model Builder
 * Generates a Max Power Edition 3D Codex book model using Three.js
 * Exports as GLB for use in WebAR
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const COLORS = {
  leather: '#2A1C12',
  chrome: '#C2C2C2',
  brass: '#B8860B',
  pages: '#F5F0E6',
  neonYellow: '#F7FF35',
  neonMagenta: '#FF34D6',
  neonTeal: '#32FFD9',
  neonBlue: '#00E5FF',
  cyan: '#32FFF5',
  fire: '#FF4500'
};

// Book dimensions (in Three.js units)
const BOOK_WIDTH = 0.5;
const BOOK_HEIGHT = 0.7;
const BOOK_DEPTH = 0.1;
const COVER_THICKNESS = 0.02;

/**
 * Create the main book body (back cover + spine)
 */
function createBookBody() {
  const bodyGeometry = new THREE.BoxGeometry(
    BOOK_WIDTH,
    BOOK_HEIGHT,
    COVER_THICKNESS
  );
  
  // Round the edges slightly by modifying vertices
  const position = bodyGeometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    
    // Slight rounding on corners
    const cornerRadius = 0.02;
    if (Math.abs(x) > BOOK_WIDTH * 0.4 && Math.abs(y) > BOOK_HEIGHT * 0.4) {
      const dist = Math.sqrt(
        Math.pow(Math.abs(x) - BOOK_WIDTH * 0.4, 2) +
        Math.pow(Math.abs(y) - BOOK_HEIGHT * 0.4, 2)
      );
      if (dist < cornerRadius) {
        const factor = dist / cornerRadius;
        position.setX(i, x * (0.9 + 0.1 * factor));
        position.setY(i, y * (0.9 + 0.1 * factor));
      }
    }
  }
  position.needsUpdate = true;
  
  const leatherMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.leather,
    metalness: 0.1,
    roughness: 0.8,
    emissive: new THREE.Color(COLORS.leather).multiplyScalar(0.05)
  });
  
  const body = new THREE.Mesh(bodyGeometry, leatherMaterial);
  body.position.set(0, 0, -BOOK_DEPTH / 2 - COVER_THICKNESS / 2);
  body.castShadow = true;
  body.receiveShadow = true;
  
  return body;
}

/**
 * Create the front cover (separate mesh for opening animation)
 */
function createFrontCover() {
  const coverGeometry = new THREE.BoxGeometry(
    BOOK_WIDTH,
    BOOK_HEIGHT,
    COVER_THICKNESS
  );
  
  const leatherMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.leather,
    metalness: 0.1,
    roughness: 0.8,
    emissive: new THREE.Color(COLORS.leather).multiplyScalar(0.05)
  });
  
  const cover = new THREE.Mesh(coverGeometry, leatherMaterial);
  cover.position.set(0, 0, BOOK_DEPTH / 2 + COVER_THICKNESS / 2);
  cover.castShadow = true;
  cover.receiveShadow = true;
  cover.name = 'FrontCover'; // For animation targeting
  
  return cover;
}

/**
 * Create individual flipable pages (for page-flip functionality)
 */
function createIndividualPages() {
  const pagesGroup = new THREE.Group();
  pagesGroup.name = 'Pages';
  
  const pageWidth = BOOK_WIDTH * 0.95;
  const pageHeight = BOOK_HEIGHT * 0.95;
  const pageThickness = 0.002; // Very thin for realistic page look
  const pageSpacing = 0.003; // Small gap between pages
  
  // Create 5 pages: cover(-1), BAEK(0), LURK(1), MAIM(2), back cover(3)
  const pageCount = 5;
  
  for (let i = 0; i < pageCount; i++) {
    // Create page geometry - thin plane
    const pageGeometry = new THREE.BoxGeometry(
      pageWidth,
      pageHeight,
      pageThickness
    );
    
    // Page material - will be textured later
    const pageMaterial = new THREE.MeshStandardMaterial({
      color: COLORS.pages,
      metalness: 0.0,
      roughness: 0.9,
      side: THREE.DoubleSide, // Both sides visible
      emissive: new THREE.Color(COLORS.pages).multiplyScalar(0.05)
    });
    
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    
    // Position pages with small spacing (stacked)
    const zOffset = (i - 2) * pageSpacing; // Center around 0
    page.position.set(0, 0, zOffset);
    
    // Set pivot point to left edge for flip animation
    page.geometry.translate(pageWidth / 2, 0, 0);
    page.position.x = -pageWidth / 2;
    
    page.castShadow = true;
    page.receiveShadow = true;
    
    // Name pages for easy access
    page.name = `Page_${i - 1}`; // -1, 0, 1, 2, 3
    page.userData.pageIndex = i - 1;
    
    pagesGroup.add(page);
  }
  
  return pagesGroup;
}

/**
 * Create corner plates (4 metal pieces)
 */
function createCornerPlates() {
  const plates = new THREE.Group();
  const plateSize = 0.08;
  const plateThickness = 0.01;
  
  const plateGeometry = new THREE.BoxGeometry(
    plateSize,
    plateSize,
    plateThickness
  );
  
  const brassMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.brass,
    metalness: 0.9,
    roughness: 0.4,
    emissive: new THREE.Color(COLORS.brass).multiplyScalar(0.1)
  });
  
  const positions = [
    [-BOOK_WIDTH / 2, BOOK_HEIGHT / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001], // Top-left
    [BOOK_WIDTH / 2, BOOK_HEIGHT / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001],  // Top-right
    [-BOOK_WIDTH / 2, -BOOK_HEIGHT / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001], // Bottom-left
    [BOOK_WIDTH / 2, -BOOK_HEIGHT / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001]  // Bottom-right
  ];
  
  positions.forEach((pos, i) => {
    const plate = new THREE.Mesh(plateGeometry, brassMaterial);
    plate.position.set(pos[0], pos[1], pos[2]);
    plate.castShadow = true;
    plate.receiveShadow = true;
    plate.name = `CornerPlate_${i}`;
    plates.add(plate);
  });
  
  return plates;
}

/**
 * Create chrome trim border
 */
function createChromeTrim() {
  const trim = new THREE.Group();
  const trimWidth = 0.01;
  const trimDepth = 0.005;
  
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.chrome,
    metalness: 1.0,
    roughness: 0.1,
    emissive: new THREE.Color(COLORS.neonBlue).multiplyScalar(0.2)
  });
  
  // Top and bottom borders
  const horizontalGeometry = new THREE.BoxGeometry(
    BOOK_WIDTH + trimWidth * 2,
    trimWidth,
    trimDepth
  );
  
  const topBorder = new THREE.Mesh(horizontalGeometry, chromeMaterial);
  topBorder.position.set(0, BOOK_HEIGHT / 2 + trimWidth / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.002);
  trim.add(topBorder);
  
  const bottomBorder = new THREE.Mesh(horizontalGeometry, chromeMaterial);
  bottomBorder.position.set(0, -BOOK_HEIGHT / 2 - trimWidth / 2, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.002);
  trim.add(bottomBorder);
  
  // Left and right borders
  const verticalGeometry = new THREE.BoxGeometry(
    trimWidth,
    BOOK_HEIGHT + trimWidth * 2,
    trimDepth
  );
  
  const leftBorder = new THREE.Mesh(verticalGeometry, chromeMaterial);
  leftBorder.position.set(-BOOK_WIDTH / 2 - trimWidth / 2, 0, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.002);
  trim.add(leftBorder);
  
  const rightBorder = new THREE.Mesh(verticalGeometry, chromeMaterial);
  rightBorder.position.set(BOOK_WIDTH / 2 + trimWidth / 2, 0, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.002);
  trim.add(rightBorder);
  
  return trim;
}

/**
 * Create spine band with "LEGENDARY" text
 */
function createSpineBand() {
  const spine = new THREE.Group();
  
  // Spine background
  const spineGeometry = new THREE.BoxGeometry(
    COVER_THICKNESS,
    BOOK_HEIGHT * 0.3,
    BOOK_DEPTH + COVER_THICKNESS * 2
  );
  
  const spineMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.brass,
    metalness: 0.8,
    roughness: 0.3
  });
  
  const spineMesh = new THREE.Mesh(spineGeometry, spineMaterial);
  spineMesh.position.set(-BOOK_WIDTH / 2 - COVER_THICKNESS / 2, BOOK_HEIGHT * 0.15, 0);
  spine.add(spineMesh);
  
  // Create simple "LEGENDARY" text using planes with emissive material
  // For simplicity, we'll use a plane with a texture-like appearance
  const textPlane = new THREE.PlaneGeometry(COVER_THICKNESS * 0.8, BOOK_HEIGHT * 0.25);
  const textMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.neonYellow,
    emissive: COLORS.neonYellow,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.7
  });
  
  const textMesh = new THREE.Mesh(textPlane, textMaterial);
  textMesh.position.set(-BOOK_WIDTH / 2 - COVER_THICKNESS / 2, BOOK_HEIGHT * 0.15, BOOK_DEPTH / 2 + 0.001);
  textMesh.rotation.y = Math.PI / 2;
  textMesh.name = 'LegendaryText';
  spine.add(textMesh);
  
  return spine;
}

/**
 * Create graffiti tag meshes (simple extruded planes)
 */
function createGraffitiTags() {
  const tags = new THREE.Group();
  
  // BAEK tag (neon yellow, top)
  const baekGeometry = new THREE.PlaneGeometry(0.15, 0.05);
  const baekMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.neonYellow,
    emissive: COLORS.neonYellow,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.5
  });
  const baekTag = new THREE.Mesh(baekGeometry, baekMaterial);
  baekTag.position.set(0, BOOK_HEIGHT * 0.3, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  baekTag.name = 'BAEKTag';
  tags.add(baekTag);
  
  // LURK tag (neon magenta, middle)
  const lurkGeometry = new THREE.PlaneGeometry(0.12, 0.04);
  const lurkMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.neonMagenta,
    emissive: COLORS.neonMagenta,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.5
  });
  const lurkTag = new THREE.Mesh(lurkGeometry, lurkMaterial);
  lurkTag.position.set(0, 0, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  lurkTag.name = 'LURKTag';
  tags.add(lurkTag);
  
  // MAIM tag (neon teal, bottom)
  const maimGeometry = new THREE.PlaneGeometry(0.13, 0.05);
  const maimMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.neonTeal,
    emissive: COLORS.neonTeal,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.5
  });
  const maimTag = new THREE.Mesh(maimGeometry, maimMaterial);
  maimTag.position.set(0, -BOOK_HEIGHT * 0.3, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  maimTag.name = 'MAIMTag';
  tags.add(maimTag);
  
  return tags;
}

/**
 * Create cover text meshes
 */
function createCoverText() {
  const textGroup = new THREE.Group();
  
  // "LEGACY CODEX" text (top)
  const legacyGeometry = new THREE.PlaneGeometry(0.3, 0.06);
  const legacyMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.neonBlue,
    emissive: COLORS.neonBlue,
    emissiveIntensity: 0.6,
    metalness: 0.3,
    roughness: 0.6
  });
  const legacyText = new THREE.Mesh(legacyGeometry, legacyMaterial);
  legacyText.position.set(0, BOOK_HEIGHT * 0.15, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  legacyText.name = 'LegacyCodexText';
  textGroup.add(legacyText);
  
  // "Ancient Knowledge" text (bottom)
  const knowledgeGeometry = new THREE.PlaneGeometry(0.25, 0.04);
  const knowledgeMaterial = new THREE.MeshStandardMaterial({
    color: COLORS.chrome,
    emissive: new THREE.Color(COLORS.chrome).multiplyScalar(0.3),
    metalness: 0.5,
    roughness: 0.4
  });
  const knowledgeText = new THREE.Mesh(knowledgeGeometry, knowledgeMaterial);
  knowledgeText.position.set(0, -BOOK_HEIGHT * 0.15, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  knowledgeText.name = 'AncientKnowledgeText';
  textGroup.add(knowledgeText);
  
  // Ribbon area (small decorative element)
  const ribbonGeometry = new THREE.PlaneGeometry(0.2, 0.02);
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color: '#FF4500',
    emissive: new THREE.Color('#FF4500').multiplyScalar(0.4),
    metalness: 0.2,
    roughness: 0.7
  });
  const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
  ribbon.position.set(0, -BOOK_HEIGHT * 0.25, BOOK_DEPTH / 2 + COVER_THICKNESS / 2 + 0.001);
  ribbon.name = 'RibbonArea';
  textGroup.add(ribbon);
  
  return textGroup;
}

/**
 * Build the complete codex model
 */
function buildCodexModel() {
  const codex = new THREE.Group();
  codex.name = 'LPFTSCodex';
  
  // Add all components
  codex.add(createBookBody());
  codex.add(createFrontCover());
  codex.add(createIndividualPages()); // Changed from createPageBlock
  codex.add(createCornerPlates());
  codex.add(createChromeTrim());
  codex.add(createSpineBand());
  codex.add(createGraffitiTags());
  codex.add(createCoverText());
  
  // Center the model
  codex.position.set(0, 0, 0);
  
  return codex;
}

/**
 * Export model as GLB
 */
async function exportModel(scene) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    
    // Mock FileReader for Node.js environment
    if (typeof FileReader === 'undefined') {
      global.FileReader = class {
        readAsArrayBuffer(blob) {
          // Not used in our case, but needed for GLTFExporter
        }
      };
    }
    
    const exportOptions = {
      binary: true,
      includeCustomExtensions: false
    };
    
    exporter.parse(
      scene,
      (result) => {
        try {
          const outputPath = path.join(__dirname, '../public/assets/models/codex.glb');
          const outputDir = path.dirname(outputPath);
          
          // Ensure directory exists
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }
          
          // Handle both ArrayBuffer and Uint8Array
          let buffer;
          if (result instanceof ArrayBuffer) {
            buffer = Buffer.from(result);
          } else if (result instanceof Uint8Array) {
            buffer = Buffer.from(result);
          } else if (typeof result === 'string') {
            // If it's a data URL, extract the binary part
            const base64 = result.split(',')[1] || result;
            buffer = Buffer.from(base64, 'base64');
          } else {
            // Try to convert to buffer
            buffer = Buffer.from(result);
          }
          
          fs.writeFileSync(outputPath, buffer);
          
          console.log(`✅ Codex model exported successfully to: ${outputPath}`);
          console.log(`   File size: ${(buffer.length / 1024).toFixed(2)} KB`);
          resolve();
        } catch (err) {
          console.error('❌ Error writing file:', err);
          reject(err);
        }
      },
      (error) => {
        console.error('❌ Export error:', error);
        reject(error);
      },
      exportOptions
    );
  });
}

/**
 * Main execution
 */
async function main() {
  console.log('📚 Building LPFTS Max Power Codex Model...\n');
  
  try {
    // Build codex model
    console.log('Building codex geometry...');
    const codex = buildCodexModel();
    console.log('Codex model built, exporting...');
    
    // Export as GLB (export the group directly, not a scene)
    await exportModel(codex);
    
    console.log('\n✨ Model build complete!');
    console.log('   Run "npm run dev" to test in AR.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Build failed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
main();

export { buildCodexModel, COLORS };

