#!/usr/bin/env node

/**
 * Generate Print-Ready PDF from poster.html
 * 
 * This script uses Puppeteer to render poster.html and export as PDF.
 * Install puppeteer: npm install --save-dev puppeteer
 * 
 * Usage: node scripts/generate-poster-pdf.js [output-path]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

async function generatePosterPDF() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (error) {
    console.error('\n❌ Puppeteer not found!\n');
    console.log('Install it with:');
    console.log('  npm install --save-dev puppeteer\n');
    console.log('Or use manual PDF generation:');
    console.log('  1. Open poster.html in Chrome/Edge');
    console.log('  2. Press Cmd/Ctrl + P');
    console.log('  3. Select "Save as PDF"');
    console.log('  4. Set paper size to A4 or custom (e.g., 11x17 for poster)');
    console.log('  5. Enable "Background graphics"\n');
    process.exit(1);
  }

  const outputPath = process.argv[2] || path.join(ROOT_DIR, 'dist', 'lpfts-poster-print-ready.pdf');
  const posterPath = path.join(ROOT_DIR, 'poster.html');
  const posterUrl = `file://${posterPath}`;

  console.log('\n📄 Generating Print-Ready PDF from poster.html...\n');
  console.log(`   Input: ${posterPath}`);
  console.log(`   Output: ${outputPath}\n`);

  try {
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport for poster size (adjust as needed)
    await page.setViewport({
      width: 1920,
      height: 2880, // 11x17 poster ratio
      deviceScaleFactor: 2 // High DPI for print quality
    });

    // Load poster.html
    await page.goto(posterUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for fonts and images to load
    await page.waitForTimeout(2000);

    // Generate PDF with print settings
    await page.pdf({
      path: outputPath,
      format: 'A4', // Change to 'Letter' or custom dimensions if needed
      printBackground: true, // Include CSS backgrounds
      preferCSSPageSize: false,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      scale: 1.0
    });

    await browser.close();

    // Verify file was created
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ PDF generated successfully!`);
      console.log(`   File: ${outputPath}`);
      console.log(`   Size: ${fileSizeMB} MB\n`);
      console.log('💡 Print Settings:');
      console.log('   - Paper: A4 (or custom for poster size)');
      console.log('   - Scale: 100%');
      console.log('   - Background graphics: Enabled');
      console.log('   - Margins: None\n');
      console.log('📋 Next Steps:');
      console.log('   1. Open PDF in Adobe Acrobat or print software');
      console.log('   2. Verify QR code is scannable');
      console.log('   3. Check colors match LPFTS brand');
      console.log('   4. Test print on sample paper before mass printing\n');
    } else {
      throw new Error('PDF file was not created');
    }

  } catch (error) {
    console.error('\n❌ PDF generation failed:', error.message);
    console.log('\n💡 Alternative: Manual PDF Generation');
    console.log('   1. Open poster.html in Chrome/Edge');
    console.log('   2. Press Cmd/Ctrl + P');
    console.log('   3. Select "Save as PDF"');
    console.log('   4. Enable "Background graphics"');
    console.log('   5. Set custom paper size if needed (e.g., 11x17 inches)\n');
    process.exit(1);
  }
}

generatePosterPDF();

