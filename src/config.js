// LPFTS Codex WebAR Configuration

export const CONFIG = {
  // MindAR settings - Optimized for retail display
  mindar: {
    container: '#ar-container',
    // MindAR requires a compiled .mind file, not a JPG
    // To create: Use https://hiukim.github.io/mind-ar-js-doc/tools/compile
    // Or run: node scripts/compile-mindar-target.js
    imageTargetSrc: '/assets/targets/poster-target.mind',
    maxTrack: 1, // Single poster tracking
    warmupTolerance: 3, // Frames to confirm tracking start (stability)
    missTolerance: 5, // Frames before losing tracking (prevents flickering)
    filterMinCF: 0.0001, // Minimum cutoff frequency for smoothing
    filterBeta: 1000 // Speed of response to tracking changes
  },

  // Three.js scene settings
  scene: {
    backgroundColor: 0x000000,
    fogColor: 0x000000,
    fogNear: 1,
    fogFar: 100
  },

  // Codex model settings
  codex: {
    modelPath: '/assets/models/codex.glb',
    scale: 1.0,
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 }
  },

  // Animation settings
  animations: {
    hoverAmplitude: 0.1,
    hoverSpeed: 1.5,
    rotationSpeed: 0.5,
    zoomDuration: 1000,
    openDuration: 1500
  },

  // UI settings
  ui: {
    buttonColors: {
      masterclass: '#63FF7D',
      gallery: '#63FF7D',
      palettes: '#63FF7D',
      legalwalls: '#63FF7D',
      missions: '#63FF7D'
    },
    panelTransition: 300
  },

  // Color constants
  colors: {
    LPFTS_CHROME: '#C2C2C2',
    LPFTS_NEON_GREEN: '#63FF7D',
    LPFTS_FIRE_ORANGE: '#FF4500',
    LPFTS_NEON_BLUE: '#00E5FF',
    LPFTS_CYAN: '#32FFF5',
    LPFTS_NEON_YELLOW: '#F7FF35',
    LPFTS_NEON_MAGENTA: '#FF34D6',
    LPFTS_NEON_TEAL: '#32FFD9'
  }
};

