#!/usr/bin/env node

/**
 * Prepare AR Release Package
 * 
 * Creates a complete release package with:
 * - Production build
 * - QR codes
 * - Documentation
 * - Deployment files
 * 
 * Usage: node scripts/prepare-release.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const RELEASE_PACKAGE_DIR = path.join(RELEASE_DIR, 'lpfts-codex-ar-release');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  ensureDir(destDir);
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

async function prepareRelease() {
  console.log('\n📦 Preparing LPFTS Codex AR Release Package...\n');

  try {
    // Clean and create release directory
    if (fs.existsSync(RELEASE_DIR)) {
      fs.rmSync(RELEASE_DIR, { recursive: true, force: true });
    }
    ensureDir(RELEASE_PACKAGE_DIR);

    console.log('✅ Created release directory\n');

    // 1. Build production bundle
    console.log('🔨 Building production bundle...');
    try {
      execSync('npm run build', { 
        cwd: ROOT_DIR, 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' }
      });
      console.log('✅ Build complete\n');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      throw error;
    }

    // 2. Copy production build
    console.log('📋 Copying production files...');
    const distDir = path.join(ROOT_DIR, 'dist');
    if (fs.existsSync(distDir)) {
      copyDir(distDir, path.join(RELEASE_PACKAGE_DIR, 'dist'));
      console.log('✅ Production files copied\n');
    } else {
      throw new Error('dist/ directory not found. Run npm run build first.');
    }

    // 3. Copy QR codes
    console.log('📱 Copying QR codes...');
    const qrDir = path.join(ROOT_DIR, 'public', 'qr');
    if (fs.existsSync(qrDir)) {
      ensureDir(path.join(RELEASE_PACKAGE_DIR, 'qr-codes'));
      const qrFiles = fs.readdirSync(qrDir);
      qrFiles.forEach(file => {
        if (file.endsWith('.png')) {
          copyFile(
            path.join(qrDir, file),
            path.join(RELEASE_PACKAGE_DIR, 'qr-codes', file)
          );
        }
      });
      console.log('✅ QR codes copied\n');
    }

    // 4. Copy poster files
    console.log('📄 Copying poster files...');
    if (fs.existsSync(path.join(ROOT_DIR, 'poster.html'))) {
      copyFile(
        path.join(ROOT_DIR, 'poster.html'),
        path.join(RELEASE_PACKAGE_DIR, 'poster.html')
      );
    }
    if (fs.existsSync(path.join(ROOT_DIR, 'poster.css'))) {
      copyFile(
        path.join(ROOT_DIR, 'poster.css'),
        path.join(RELEASE_PACKAGE_DIR, 'poster.css')
      );
    }
    console.log('✅ Poster files copied\n');

    // 5. Copy deployment URLs
    console.log('🔗 Copying deployment info...');
    const urlFiles = [
      'dist/8TH_WALL_URL.txt',
      'dist/DEPLOYED_URL.txt'
    ];
    urlFiles.forEach(file => {
      const srcPath = path.join(ROOT_DIR, file);
      if (fs.existsSync(srcPath)) {
        const fileName = path.basename(file);
        copyFile(srcPath, path.join(RELEASE_PACKAGE_DIR, 'deployment', fileName));
      }
    });
    console.log('✅ Deployment info copied\n');

    // 6. Create release documentation
    console.log('📝 Creating release documentation...');
    const readmeContent = `# LPFTS Codex AR Release Package

## Package Contents

- \`dist/\` - Production build ready for deployment
- \`qr-codes/\` - QR codes for 8th Wall and WebAR
- \`poster.html\` & \`poster.css\` - Print-ready poster design
- \`deployment/\` - Deployment URLs and configuration

## Quick Start

### Deploy to Vercel

\`\`\`bash
cd dist
vercel --prod
\`\`\`

### Deploy to Netlify

\`\`\`bash
cd dist
netlify deploy --prod --dir=.
\`\`\`

### Deploy to 8th Wall

1. Upload \`dist/\` contents to your 8th Wall project
2. Use QR code from \`qr-codes/8thwall-ar.png\` in your poster

## QR Codes

- \`8thwall-ar.png\` - Points to 8th Wall AR experience
- \`codex-live.png\` - Points to WebAR deployment (fallback)

## Poster Printing

1. Open \`poster.html\` in browser
2. Print to PDF (Cmd/Ctrl + P → Save as PDF)
3. Enable "Background graphics"
4. Use A4 or custom poster size (e.g., 11x17 inches)
5. Verify QR code is scannable before mass printing

## Testing Checklist

- [ ] QR codes scan correctly on multiple devices
- [ ] AR tracking works on iOS Safari
- [ ] AR tracking works on Android Chrome
- [ ] All assets load correctly
- [ ] Poster PDF renders correctly
- [ ] Deployment URLs are correct

## Support

For issues or questions, contact: lpfts.com

---
Generated: ${new Date().toISOString()}
`;

    fs.writeFileSync(
      path.join(RELEASE_PACKAGE_DIR, 'README.md'),
      readmeContent
    );
    console.log('✅ Documentation created\n');

    // 7. Create deployment checklist
    const checklistContent = `# LPFTS Codex AR Deployment Checklist

## Pre-Deployment

- [ ] All paths verified (no broken images/assets)
- [ ] QR codes generated and tested
- [ ] Poster PDF generated and verified
- [ ] 8th Wall URL is correct
- [ ] WebAR fallback URL is correct

## Deployment

- [ ] Build passes: \`npm run build\`
- [ ] No console errors in browser
- [ ] HTTPS enabled (required for camera)
- [ ] CORS configured if needed
- [ ] CDN/asset paths correct

## Post-Deployment

- [ ] QR codes scan correctly
- [ ] AR tracking works on iOS
- [ ] AR tracking works on Android
- [ ] All UI panels load correctly
- [ ] Masterclasses display properly
- [ ] Palettes load images
- [ ] Merch images load
- [ ] Legal walls display correctly

## Testing Devices

- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (for poster.html)

## Print Verification

- [ ] Poster PDF renders correctly
- [ ] QR code is scannable from PDF
- [ ] Colors match LPFTS brand
- [ ] Text is readable
- [ ] Layout is correct

---
Last Updated: ${new Date().toISOString()}
`;

    fs.writeFileSync(
      path.join(RELEASE_PACKAGE_DIR, 'DEPLOYMENT_CHECKLIST.md'),
      checklistContent
    );
    console.log('✅ Deployment checklist created\n');

    // Summary
    const packageSize = getDirSize(RELEASE_PACKAGE_DIR);
    const packageSizeMB = (packageSize / (1024 * 1024)).toFixed(2);

    console.log('🎉 Release Package Ready!\n');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`📦 Package Location: ${RELEASE_PACKAGE_DIR}`);
    console.log(`📊 Package Size: ${packageSizeMB} MB\n`);
    console.log('📋 Package Contents:');
    console.log('   ✓ Production build (dist/)');
    console.log('   ✓ QR codes (qr-codes/)');
    console.log('   ✓ Poster files (poster.html, poster.css)');
    console.log('   ✓ Deployment info (deployment/)');
    console.log('   ✓ Documentation (README.md)');
    console.log('   ✓ Deployment checklist\n');
    console.log('🚀 Next Steps:');
    console.log('   1. Review DEPLOYMENT_CHECKLIST.md');
    console.log('   2. Test QR codes on multiple devices');
    console.log('   3. Deploy dist/ to your hosting service');
    console.log('   4. Generate poster PDF for printing');
    console.log('   5. Print and distribute!\n');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Release preparation failed:', error.message);
    process.exit(1);
  }
}

function getDirSize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
}

prepareRelease();

