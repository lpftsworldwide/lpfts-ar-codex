#!/usr/bin/env node

/**
 * Generate QR code for live Vercel deployment
 */

import QRCode from 'qrcode';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your live Vercel URL
const LIVE_URL = 'https://lpfts-codex-8anbh9gpi-lpftss-projects.vercel.app';

console.log('🎯 Generating QR Code for Live AR Experience\n');
console.log('URL:', LIVE_URL);
console.log('');

// Ensure qr directory exists
const qrDir = join(__dirname, '../public/qr');
if (!existsSync(qrDir)) {
  mkdirSync(qrDir, { recursive: true });
}

// Generate QR code
const outputPath = join(qrDir, 'live-ar.png');

QRCode.toFile(outputPath, LIVE_URL, {
  width: 1024,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'H'
}, (err) => {
  if (err) {
    console.error('❌ Error generating QR code:', err);
    process.exit(1);
  }
  
  console.log('✅ QR code generated successfully!');
  console.log('📁 Saved to:', outputPath);
  console.log('');
  console.log('📱 How to use:');
  console.log('  1. Open this QR code image');
  console.log('  2. Scan with your phone camera');
  console.log('  3. Test the new turquoise theme!');
  console.log('');
  console.log('🎨 New theme features:');
  console.log('  • Turquoise/cyan colors (not green)');
  console.log('  • Transparent backgrounds with blur');
  console.log('  • Calm error messages (not red)');
  console.log('  • Professional, polished look');
  console.log('');
  console.log('🔗 Live URL:', LIVE_URL);
  console.log('');
});

