#!/usr/bin/env node

/**
 * Zero-Hassle Deployment System for LPFTS Codex WebAR
 * Single command deployment to Vercel with automatic asset generation
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkPackage(packageName) {
  try {
    // Try to import/require the package
    if (typeof require !== 'undefined') {
      require.resolve(packageName);
      return true;
    }
    // For ES modules, check if it's in node_modules
    const packagePath = path.join(ROOT_DIR, 'node_modules', packageName);
    return fs.existsSync(packagePath);
  } catch (e) {
    return false;
  }
}

function installPackage(packageName, isDev = true) {
  log(`📦 Installing ${packageName}...`, 'yellow');
  try {
    const flag = isDev ? '--save-dev' : '--save';
    execSync(`npm install ${packageName} ${flag}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    log(`✅ ${packageName} installed`, 'green');
    return true;
  } catch (error) {
    log(`❌ Failed to install ${packageName}`, 'red');
    return false;
  }
}

function ensurePackages() {
  const requiredPackages = [
    { name: 'vercel', dev: true },
    { name: 'qrcode', dev: true },
    { name: 'terser', dev: true },
    { name: 'three', dev: false }
  ];

  let allInstalled = true;
  for (const pkg of requiredPackages) {
    if (!checkPackage(pkg.name)) {
      log(`⚠️  Missing package: ${pkg.name}`, 'yellow');
      if (!installPackage(pkg.name, pkg.dev)) {
        allInstalled = false;
      }
    }
  }

  return allInstalled;
}

function checkVercelToken() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    log('\n❌ VERCEL_TOKEN environment variable not set!', 'red');
    log('\n📋 Setup Instructions:', 'cyan');
    log('   1. Get your Vercel token from: https://vercel.com/account/tokens', 'cyan');
    log('   2. Set it as an environment variable:', 'cyan');
    log('      export VERCEL_TOKEN="your-actual-token"', 'cyan');
    log('   3. Or add it to your .env file:', 'cyan');
    log('      VERCEL_TOKEN=your-actual-token\n', 'cyan');
    process.exit(1);
  }
  
  // Check for placeholder values
  const placeholderPatterns = [
    'your-token-here',
    'your-vercel-token',
    'placeholder',
    'example',
    'xxx',
    'token'
  ];
  
  const lowerToken = token.toLowerCase();
  for (const placeholder of placeholderPatterns) {
    if (lowerToken.includes(placeholder)) {
      log('\n❌ VERCEL_TOKEN appears to be a placeholder value!', 'red');
      log(`   Current value: ${token.substring(0, 20)}...`, 'red');
      log('\n📋 Setup Instructions:', 'cyan');
      log('   1. Get your REAL Vercel token from: https://vercel.com/account/tokens', 'cyan');
      log('   2. Set it as an environment variable:', 'cyan');
      log('      export VERCEL_TOKEN="your-actual-token-from-vercel"', 'cyan');
      log('   3. Vercel tokens are long alphanumeric strings', 'cyan');
      log('   4. They do NOT contain words like "token" or "placeholder"\n', 'cyan');
      process.exit(1);
    }
  }
  
  // Basic validation: Vercel tokens are alphanumeric strings (can vary in length)
  if (token.length < 15) {
    log('\n⚠️  Warning: VERCEL_TOKEN seems too short. Please verify it\'s correct.', 'yellow');
  }
  
  return token;
}

function runScript(scriptName, description, optional = false) {
  log(`\n${description}...`, 'cyan');
  try {
    execSync(`npm run ${scriptName}`, {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    if (optional) {
      log(`⚠️  ${description} failed (optional step, continuing...)`, 'yellow');
      return false;
    } else {
      log(`❌ ${description} failed`, 'red');
      throw error;
    }
  }
}

function buildProject() {
  log('\n🏗️  Building WebAR project...', 'cyan');
  try {
    execSync('npm run build', {
      stdio: 'inherit',
      cwd: ROOT_DIR
    });
    log('✅ Build completed', 'green');
    return true;
  } catch (error) {
    log('❌ Build failed', 'red');
    throw error;
  }
}

function deployToVercel(token) {
  log('\n🚀 Deploying to Vercel...', 'cyan');
  try {
    const deployCommand = `npx vercel --prod --confirm --token ${token}`;
    const output = execSync(deployCommand, {
      encoding: 'utf-8',
      cwd: ROOT_DIR
    });

    // Extract URL from Vercel output
    // Vercel typically outputs: "https://xxx.vercel.app" or "Production: https://xxx.vercel.app"
    const urlPatterns = [
      /Production:\s*(https:\/\/[^\s]+\.vercel\.app)/,
      /(https:\/\/[^\s]+\.vercel\.app)/,
      /Deployed to (https:\/\/[^\s]+\.vercel\.app)/
    ];

    for (const pattern of urlPatterns) {
      const match = output.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    // Alternative: try to get from Vercel project file
    const vercelProjectPath = path.join(ROOT_DIR, '.vercel', 'project.json');
    if (fs.existsSync(vercelProjectPath)) {
      try {
        const projectData = JSON.parse(fs.readFileSync(vercelProjectPath, 'utf-8'));
        if (projectData.name) {
          return `https://${projectData.name}.vercel.app`;
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Try to get from vercel.json or package.json name
    const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
    const projectName = packageJson.name.replace(/[^a-z0-9-]/gi, '-');
    
    log(`⚠️  Could not extract URL from output, using project name: ${projectName}`, 'yellow');
    log(`   Please check Vercel dashboard for the actual URL`, 'yellow');
    return `https://${projectName}.vercel.app`;
  } catch (error) {
    log('❌ Deployment failed', 'red');
    log(`Error: ${error.message}`, 'red');
    throw error;
  }
}

function saveDeployedURL(url) {
  const distDir = path.join(ROOT_DIR, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const urlFile = path.join(distDir, 'DEPLOYED_URL.txt');
  fs.writeFileSync(urlFile, url);
  log(`✅ URL saved to: ${urlFile}`, 'green');
}

async function generateQRCode(url) {
  log('\n📱 Generating QR code...', 'cyan');
  try {
    const qrDir = path.join(ROOT_DIR, 'public', 'qr');
    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, { recursive: true });
    }

    const qrPath = path.join(qrDir, 'codex-live.png');
    await QRCode.toFile(qrPath, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });

    log(`✅ QR code generated: ${qrPath}`, 'green');
    return qrPath;
  } catch (error) {
    log(`⚠️  QR code generation failed: ${error.message}`, 'yellow');
    return null;
  }
}

async function main() {
  log('\n' + '='.repeat(60), 'bright');
  log('🚀 LPFTS Codex WebAR - Zero-Hassle Deployment', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  try {
    // Step 0: Check and install packages
    log('📦 Checking dependencies...', 'cyan');
    if (!ensurePackages()) {
      log('❌ Failed to install required packages', 'red');
      process.exit(1);
    }

    // Step 1: Check Vercel token
    const token = checkVercelToken();
    log('✅ Vercel token found', 'green');

    // Step 2: Build Max Power Codex model
    runScript('build:codex', '📚 Building Max Power Codex model');

    // Step 3: Render poster PNG (optional)
    runScript('render:codex', '🖼️  Rendering codex poster image', true);

    // Step 4: Prepare offline assets
    runScript('prepare:offline', '📴 Preparing offline assets');

    // Step 5: Build project
    buildProject();

    // Step 6: Deploy to Vercel
    const deployedURL = deployToVercel(token);
    log(`\n✅ Deployment successful!`, 'green');
    log(`\n🌐 LPFTS Codex Deployed: ${deployedURL}`, 'bright');

    // Step 7: Save URL
    saveDeployedURL(deployedURL);

    // Step 8: Generate QR code
    const qrPath = await generateQRCode(deployedURL);

    // Final output
    log('\n' + '='.repeat(60), 'bright');
    log('✨ READY TO PRINT POSTERS', 'bright');
    log('='.repeat(60), 'bright');
    log(`\n📋 Deployment Details:`, 'cyan');
    log(`   URL: ${deployedURL}`, 'green');
    log(`   URL File: dist/DEPLOYED_URL.txt`, 'green');
    if (qrPath) {
      log(`   QR Code: ${qrPath}`, 'green');
    }
    log(`\n💡 Next Steps:`, 'cyan');
    log(`   1. Add QR code to your LPFTS poster design`, 'cyan');
    log(`   2. Print posters with the QR code`, 'cyan');
    log(`   3. Users scan to unlock the AR Codex experience`, 'cyan');
    log(`\n🎨 Earn it. Play it. Own it.\n`, 'bright');

    process.exit(0);
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red');
    if (error.stack) {
      log(`\nStack trace:`, 'red');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

