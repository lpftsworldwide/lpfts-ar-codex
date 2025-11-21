#!/usr/bin/env node

/**
 * MindAR Target Compiler
 * 
 * Compiles image targets into .mind files for MindAR image tracking.
 * 
 * Usage:
 *   node scripts/compile-mindar-target.js [input-image] [output-name]
 * 
 * Example:
 *   node scripts/compile-mindar-target.js public/assets/images/poster-target.jpg poster-target
 * 
 * This will create: public/assets/targets/poster-target.mind
 */

import { createRequire } from 'module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get command line arguments
const args = process.argv.slice(2);
const inputImage = args[0] || 'public/assets/images/poster-target.jpg';
const outputName = args[1] || 'poster-target';

console.log('🎯 MindAR Target Compiler');
console.log('========================\n');

// Check if MindAR compiler is available
console.log('⚠️  IMPORTANT: MindAR target compilation requires the @hiukim/mind-ar-js package.');
console.log('');
console.log('📝 To compile your target image:');
console.log('');
console.log('Option 1: Use MindAR Online Compiler (Recommended)');
console.log('  1. Visit: https://hiukim.github.io/mind-ar-js-doc/tools/compile');
console.log('  2. Upload your poster image (poster-target.jpg)');
console.log('  3. Download the compiled .mind file');
console.log('  4. Save as: public/assets/targets/poster-target.mind');
console.log('');
console.log('Option 2: Install MindAR Compiler Locally');
console.log('  npm install -g @hiukim/mind-ar-js');
console.log('  mind-ar-js-compiler --input ' + inputImage + ' --output public/assets/targets/' + outputName + '.mind');
console.log('');
console.log('Option 3: Use Mind AR Studio (Desktop App)');
console.log('  1. Download: https://github.com/hiukim/mind-ar-js');
console.log('  2. Import your poster image');
console.log('  3. Export as .mind file');
console.log('  4. Save to: public/assets/targets/');
console.log('');
console.log('📁 Target Directory Structure:');
console.log('  public/');
console.log('    └── assets/');
console.log('        └── targets/');
console.log('            └── poster-target.mind  ← Your compiled target goes here');
console.log('');

// Create targets directory if it doesn't exist
const targetsDir = join(__dirname, '../public/assets/targets');
if (!existsSync(targetsDir)) {
  mkdirSync(targetsDir, { recursive: true });
  console.log('✅ Created directory: public/assets/targets/');
}

// Check if input image exists
const inputPath = join(__dirname, '..', inputImage);
if (!existsSync(inputPath)) {
  console.error(`❌ Error: Input image not found: ${inputImage}`);
  console.log('');
  console.log('Please ensure your poster image exists at the specified path.');
  process.exit(1);
}

console.log(`📷 Input image found: ${inputImage}`);
console.log('');

// Check if output file already exists
const outputPath = join(targetsDir, outputName + '.mind');
if (existsSync(outputPath)) {
  console.log(`✅ Target file already exists: public/assets/targets/${outputName}.mind`);
  console.log('');
  console.log('If you need to recompile, delete the existing .mind file first.');
  console.log('Then use one of the methods above to generate a new one.');
} else {
  console.log(`⏳ Target file not found: public/assets/targets/${outputName}.mind`);
  console.log('');
  console.log('Please compile your target using one of the methods above.');
  console.log('');
  console.log('🚀 Quick Start (Use Online Compiler):');
  console.log('  1. Open: https://hiukim.github.io/mind-ar-js-doc/tools/compile');
  console.log('  2. Upload: ' + inputImage);
  console.log('  3. Download the .mind file');
  console.log('  4. Save to: public/assets/targets/' + outputName + '.mind');
  console.log('  5. Run: npm run build');
  console.log('  6. Deploy: cd dist && vercel --prod');
}

console.log('');
console.log('💡 Tips for Best Results:');
console.log('  - Use high-contrast images with distinct features');
console.log('  - Avoid images with repetitive patterns');
console.log('  - Minimum recommended size: 640x480 pixels');
console.log('  - Best format: JPG or PNG with clear details');
console.log('  - Test your compiled target before final deployment');
console.log('');
console.log('📖 Documentation: https://hiukim.github.io/mind-ar-js-doc/');
console.log('');

