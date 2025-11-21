#!/usr/bin/env node

/**
 * Generate QR Code for Vercel Deployment
 * Creates a QR code PNG pointing to the deployed AR experience
 */

import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateQRCode() {
  // Get URL from command line or use default
  const url = process.argv[2] || process.env.VERCEL_URL || 'https://your-app.vercel.app';
  
  console.log('📱 Generating QR Code for LPFTS Codex WebAR...\n');
  console.log(`   URL: ${url}\n`);

  try {
    const outputPath = path.join(__dirname, '../public/qrcode.png');
    const outputDir = path.dirname(outputPath);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate QR code with LPFTS styling
    await QRCode.toFile(outputPath, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',  // Black QR code
        light: '#FFFFFF'  // White background
      },
      errorCorrectionLevel: 'H' // High error correction for print
    });

    console.log(`✅ QR Code generated successfully!`);
    console.log(`   File: ${outputPath}`);
    console.log(`   Size: 512x512px`);
    console.log(`   Error Correction: High (H)\n`);
    console.log(`📋 Usage:`);
    console.log(`   1. Add this QR code to your LPFTS poster`);
    console.log(`   2. Users scan it to open the AR experience`);
    console.log(`   3. Ensure the URL points to your Vercel deployment\n`);

    // Also generate a version with LPFTS branding
    const brandedPath = path.join(__dirname, '../public/qrcode-branded.png');
    
    // For branded version, we'd need to overlay logo, but for now just create a note
    console.log(`💡 Tip: Use the QR code in your poster design with:`);
    console.log(`   - Minimum size: 2cm x 2cm`);
    console.log(`   - High contrast background`);
    console.log(`   - "Scan to unlock AR" text nearby\n`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ QR Code generation failed:', error);
    process.exit(1);
  }
}

generateQRCode();

