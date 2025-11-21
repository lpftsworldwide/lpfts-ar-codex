#!/usr/bin/env node

/**
 * Generate QR Code for 8th Wall AR Experience
 * Usage: node scripts/generate-8thwall-qr.js <8th-wall-url>
 * Or set EIGHTH_WALL_URL environment variable
 */

import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');

async function generate8thWallQR() {
  // Get URL from command line or environment
  const url = process.argv[2] || process.env.EIGHTH_WALL_URL;
  
  if (!url) {
    console.error('\n❌ Error: No 8th Wall URL provided!\n');
    console.log('Usage:');
    console.log('  node scripts/generate-8thwall-qr.js <8th-wall-url>');
    console.log('  or');
    console.log('  EIGHTH_WALL_URL="https://creator.8thwall.app/your-project/" node scripts/generate-8thwall-qr.js\n');
    console.log('Example 8th Wall URLs:');
    console.log('  https://creator.8thwall.app/lpfts-codex/');
    console.log('  https://lpfts-codex.8thwall.app/\n');
    process.exit(1);
  }

  // Validate URL format
  if (!url.includes('8thwall.app') && !url.includes('8thwall.com')) {
    console.warn('⚠️  Warning: URL does not appear to be an 8th Wall URL');
    console.warn('   Expected format: https://creator.8thwall.app/... or https://*.8thwall.app/');
  }

  try {
    console.log('\n📱 Generating QR Code for 8th Wall AR Experience...\n');
    console.log(`   URL: ${url}\n`);

    // Ensure output directory exists
    const outputDir = path.join(ROOT_DIR, 'public', 'qr');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate QR code - high error correction for poster printing
    const qrPath = path.join(outputDir, '8thwall-ar.png');
    await QRCode.toFile(qrPath, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H' // High error correction for print
    });

    console.log(`✅ QR Code generated successfully!`);
    console.log(`   File: ${qrPath}`);
    console.log(`   Size: 512x512px (print-ready)`);
    console.log(`   Error Correction: High (H) - safe for poster printing\n`);

    // Also save URL to file for reference
    const urlPath = path.join(ROOT_DIR, 'dist', '8TH_WALL_URL.txt');
    const distDir = path.dirname(urlPath);
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    fs.writeFileSync(urlPath, url);
    console.log(`✅ 8th Wall URL saved to: ${urlPath}\n`);

    console.log('💡 Next Steps:');
    console.log('   1. Add QR code to your LPFTS Codex poster design');
    console.log('   2. Ensure minimum size: 2cm x 2cm for mobile scanning');
    console.log('   3. Use high contrast (black QR on white/light background)');
    console.log('   4. Test with multiple devices before mass printing\n');

  } catch (error) {
    console.error('\n❌ Error generating QR code:', error.message);
    process.exit(1);
  }
}

generate8thWallQR();

