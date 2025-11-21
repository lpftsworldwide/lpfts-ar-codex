#!/usr/bin/env node

/**
 * Prepare Offline WebAR Viewer
 * Downloads MindAR and creates offline-ready HTML file
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MINDAR_CDN_URL = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.4/dist/mindar-image-three.prod.js';
const MINDAR_OUTPUT = path.join(__dirname, '../public/lib/mindar-image-three.prod.js');

async function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    const dir = path.dirname(outputPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(outputPath);
        downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

async function createOfflineHTML() {
  const offlineHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="description" content="LPFTS Legacy Codex WebAR - Offline Version">
    <meta name="theme-color" content="#000000">
    <title>LPFTS Codex WebAR - Offline</title>
    
    <!-- Styles (inline for offline) -->
    <style>
        /* Inline styles for offline use - full styles.css content would go here */
        /* For brevity, including key styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #000; color: #fff; overflow: hidden; }
        #ar-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }
        #loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; display: flex; justify-content: center; align-items: center; z-index: 10000; }
        .loading-content { text-align: center; }
        .loading-logo { font-size: 48px; font-weight: bold; color: #05FF00; text-shadow: 0 0 20px rgba(5, 255, 0, 0.5); margin-bottom: 30px; }
    </style>
    
    <!-- MindAR from local file (offline) -->
    <script src="./lib/mindar-image-three.prod.js"></script>
</head>
<body>
    <div id="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">LPFTS</div>
            <h2>Loading LPFTS Legacy Codex…</h2>
            <p>Offline Mode - Allow camera access</p>
        </div>
    </div>

    <div id="ar-container"></div>
    <div id="error-message" class="error-message hidden"></div>

    <!-- Main script (will be bundled by Vite) -->
    <script type="module" src="/src/main.js"></script>
</body>
</html>`;

  const outputPath = path.join(__dirname, '../public/offline.html');
  fs.writeFileSync(outputPath, offlineHTML);
  console.log(`✅ Offline HTML created: ${outputPath}`);
}

async function main() {
  console.log('📦 Preparing Offline WebAR Viewer...\n');

  try {
    // Download MindAR
    console.log('Downloading MindAR library...');
    await downloadFile(MINDAR_CDN_URL, MINDAR_OUTPUT);
    console.log(`✅ MindAR downloaded: ${MINDAR_OUTPUT}`);

    // Create offline HTML
    await createOfflineHTML();

    console.log('\n✨ Offline viewer prepared!');
    console.log('   Files created:');
    console.log(`   - ${MINDAR_OUTPUT}`);
    console.log(`   - ${path.join(__dirname, '../public/offline.html')}`);
    console.log('\n📋 Usage:');
    console.log('   1. Build the project: npm run build');
    console.log('   2. Serve the dist/ folder');
    console.log('   3. Access offline.html for offline AR experience\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Preparation failed:', error);
    process.exit(1);
  }
}

main();

