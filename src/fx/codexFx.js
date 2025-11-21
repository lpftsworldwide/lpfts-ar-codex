// Codex FX - Glowing veins, runes, light leaks, hologram aura

import * as THREE from 'three';
import { CONFIG } from '../config.js';

/**
 * Setup all visual effects for the Codex
 */
export function setupCodexFX(codexMesh) {
  const fxGroup = new THREE.Group();
  fxGroup.name = 'CodexFX';
  
  // Add glowing glyph veins
  const veins = createGlyphVeins();
  fxGroup.add(veins);
  
  // Add floating runes
  const runes = createFloatingRunes();
  fxGroup.add(runes);
  
  // Add light leaks (only visible when book opens)
  const lightLeaks = createLightLeaks();
  lightLeaks.visible = true; // Will be animated via opacity
  fxGroup.add(lightLeaks);
  
  // Add hologram aura
  const hologram = createHologramAura();
  fxGroup.add(hologram);
  
  // Attach to codex
  codexMesh.add(fxGroup);
  
  return {
    veins,
    runes,
    lightLeaks,
    hologram,
    fxGroup
  };
}

/**
 * Create glowing glyph veins on cover and spine
 */
function createGlyphVeins() {
  const veinsGroup = new THREE.Group();
  veinsGroup.name = 'GlyphVeins';
  
  const veinMaterial = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.LPFTS_CYAN,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  
  // Create curved vein paths on the cover
  const veinPaths = [
    // Top-left curve
    [
      new THREE.Vector3(-0.15, 0.25, 0.26),
      new THREE.Vector3(-0.1, 0.3, 0.26),
      new THREE.Vector3(0, 0.28, 0.26)
    ],
    // Middle horizontal
    [
      new THREE.Vector3(-0.2, 0, 0.26),
      new THREE.Vector3(0, 0.05, 0.26),
      new THREE.Vector3(0.2, 0, 0.26)
    ],
    // Bottom-right curve
    [
      new THREE.Vector3(0, -0.28, 0.26),
      new THREE.Vector3(0.1, -0.3, 0.26),
      new THREE.Vector3(0.15, -0.25, 0.26)
    ],
    // Spine vertical
    [
      new THREE.Vector3(-0.26, 0.2, 0.1),
      new THREE.Vector3(-0.26, 0, 0.1),
      new THREE.Vector3(-0.26, -0.2, 0.1)
    ]
  ];
  
  veinPaths.forEach((path, i) => {
    const curve = new THREE.CatmullRomCurve3(path);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create tube along the curve
    const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.003, 8, false);
    const vein = new THREE.Mesh(tubeGeometry, veinMaterial);
    vein.name = `Vein_${i}`;
    veinsGroup.add(vein);
  });
  
  return veinsGroup;
}

/**
 * Create floating runes that orbit around the book
 */
function createFloatingRunes() {
  const runeGroup = new THREE.Group();
  runeGroup.name = 'FloatingRunes';
  
  const runeCount = 8;
  const orbitRadius = 0.4;
  const runeSize = 0.03;
  
  const runeMaterial = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.LPFTS_NEON_BLUE,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  for (let i = 0; i < runeCount; i++) {
    // Create rune shape (simple triangle/sigil)
    const runeShape = new THREE.Shape();
    const angle = (i / runeCount) * Math.PI * 2;
    
    // Create a simple sigil shape (triangle with inner lines)
    runeShape.moveTo(0, runeSize);
    runeShape.lineTo(-runeSize * 0.5, -runeSize * 0.5);
    runeShape.lineTo(runeSize * 0.5, -runeSize * 0.5);
    runeShape.lineTo(0, runeSize);
    
    const runeGeometry = new THREE.ShapeGeometry(runeShape);
    const rune = new THREE.Mesh(runeGeometry, runeMaterial);
    
    // Position in orbit
    const height = (i % 2 === 0 ? 0.2 : -0.2) + (Math.sin(i) * 0.1);
    rune.position.set(
      Math.cos(angle) * orbitRadius,
      height,
      Math.sin(angle) * orbitRadius
    );
    
    rune.name = `Rune_${i}`;
    rune.userData = {
      baseAngle: angle,
      baseHeight: height,
      orbitRadius: orbitRadius
    };
    
    runeGroup.add(rune);
  }
  
  return runeGroup;
}

/**
 * Create light leaks at page edges
 */
function createLightLeaks() {
  const leaksGroup = new THREE.Group();
  leaksGroup.name = 'LightLeaks';
  
  const leakMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFA500, // Orange/yellow
    transparent: true,
    opacity: 0.0, // Start invisible, animate when book opens
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  
  // Create light leak planes at page edges
  const leakPositions = [
    { pos: [0, 0.35, 0], rot: [0, 0, 0], size: [0.1, 0.15] }, // Top
    { pos: [0, -0.35, 0], rot: [0, 0, 0], size: [0.1, 0.15] }, // Bottom
    { pos: [0.25, 0, 0], rot: [0, 0, Math.PI / 2], size: [0.1, 0.15] }, // Right
    { pos: [-0.25, 0, 0], rot: [0, 0, Math.PI / 2], size: [0.1, 0.15] } // Left
  ];
  
  leakPositions.forEach((leak, i) => {
    const geometry = new THREE.PlaneGeometry(leak.size[0], leak.size[1]);
    const leakMesh = new THREE.Mesh(geometry, leakMaterial.clone());
    leakMesh.position.set(...leak.pos);
    leakMesh.rotation.set(...leak.rot);
    leakMesh.name = `LightLeak_${i}`;
    leakMesh.userData.baseOpacity = 0.0;
    leaksGroup.add(leakMesh);
  });
  
  return leaksGroup;
}

/**
 * Create hologram aura shell around the book
 */
function createHologramAura() {
  const auraGroup = new THREE.Group();
  auraGroup.name = 'HologramAura';
  
  // Create a slightly larger transparent shell
  const auraGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.15);
  const auraMaterial = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.LPFTS_NEON_BLUE,
    transparent: true,
    opacity: 0.15,
    wireframe: true,
    side: THREE.DoubleSide
  });
  
  const auraMesh = new THREE.Mesh(auraGeometry, auraMaterial);
  auraMesh.name = 'AuraShell';
  auraGroup.add(auraMesh);
  
  // Add inner grid lines for hologram effect
  const gridHelper = new THREE.GridHelper(0.6, 10, CONFIG.colors.LPFTS_NEON_BLUE, CONFIG.colors.LPFTS_NEON_BLUE);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.2;
  gridHelper.rotation.x = Math.PI / 2;
  gridHelper.position.z = 0.05;
  gridHelper.name = 'AuraGrid';
  auraGroup.add(gridHelper);
  
  return auraGroup;
}

/**
 * Update vein glow intensity based on animation state
 */
export function updateVeinGlow(veins, intensity) {
  if (!veins) return;
  
  veins.traverse((child) => {
    if (child.isMesh && child.material) {
      const baseOpacity = 0.6;
      child.material.opacity = baseOpacity + (intensity * 0.4);
      child.material.emissiveIntensity = intensity;
    }
  });
}

/**
 * Update rune animations (orbit, bob, fade)
 */
export function updateRunes(runes, deltaTime, time) {
  if (!runes) return;
  
  runes.children.forEach((rune, i) => {
    if (rune.userData) {
      const { baseAngle, baseHeight, orbitRadius } = rune.userData;
      
      // Orbit around Y-axis
      const orbitSpeed = 0.5;
      const angle = baseAngle + (time * orbitSpeed);
      rune.position.x = Math.cos(angle) * orbitRadius;
      rune.position.z = Math.sin(angle) * orbitRadius;
      
      // Bob up and down
      const bobSpeed = 2.0;
      const bobAmount = 0.05;
      rune.position.y = baseHeight + Math.sin(time * bobSpeed + i) * bobAmount;
      
      // Fade in/out
      const fadeSpeed = 1.5;
      const fadePhase = (time * fadeSpeed) + (i * 0.5);
      if (rune.material) {
        rune.material.opacity = 0.3 + Math.sin(fadePhase) * 0.4;
      }
      
      // Rotate slowly
      rune.rotation.z += deltaTime * 0.5;
    }
  });
}

/**
 * Update light leaks intensity (based on book opening angle)
 */
export function updateLightLeaks(lightLeaks, openAngle) {
  if (!lightLeaks) return;
  
  // Intensity increases as book opens (openAngle is negative when opening)
  const normalizedAngle = Math.abs(openAngle) / (110 * Math.PI / 180);
  const intensity = Math.min(normalizedAngle * 1.5, 1.0);
  
  lightLeaks.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material.opacity = intensity * 0.6;
    }
  });
}

/**
 * Update hologram aura (pulse when idle, brighten when opening)
 */
export function updateHologramAura(hologram, isIdle, isOpening, time) {
  if (!hologram) return;
  
  let opacity = 0.15;
  let intensity = 1.0;
  
  if (isOpening) {
    // Brighten briefly when opening
    opacity = 0.4;
    intensity = 1.5;
  } else if (isIdle) {
    // Pulse slowly when idle
    opacity = 0.15 + Math.sin(time * 1.0) * 0.1;
  }
  
  hologram.traverse((child) => {
    if (child.material) {
      child.material.opacity = opacity;
      if (child.material.emissive) {
        child.material.emissiveIntensity = intensity;
      }
    }
  });
}

