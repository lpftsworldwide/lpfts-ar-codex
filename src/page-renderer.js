// LPFTS Codex Page Content Renderer
// Renders page content as canvas textures for 3D pages

import * as THREE from 'three';
import { getMasterclassPageData, getPage } from './pages.js';
import { BRAND, CTAS } from './store-integration.js';

export class PageRenderer {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 1024;
    this.canvas.height = 1400;
    this.textureCache = new Map();
  }

  // Render page content to texture
  async renderPage(pageIndex) {
    // Check cache
    if (this.textureCache.has(pageIndex)) {
      return this.textureCache.get(pageIndex);
    }

    const page = getPage(pageIndex);
    if (!page) return null;

    let texture;
    switch (page.type) {
      case 'cover':
        texture = await this.renderCoverPage(page);
        break;
      case 'masterclass':
        texture = await this.renderMasterclassPage(pageIndex);
        break;
      case 'back-cover':
        texture = await this.renderBackCoverPage(page);
        break;
      default:
        texture = this.renderPlaceholderPage(pageIndex);
    }

    this.textureCache.set(pageIndex, texture);
    return texture;
  }

  // Render cover page
  async renderCoverPage(page) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = BRAND.colors.neonGreen;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Title
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('LPFTS', width / 2, 200);

    ctx.font = 'bold 100px Arial';
    ctx.fillText('LEGACY CODEX', width / 2, 320);

    // Subtitle
    ctx.fillStyle = BRAND.colors.chrome;
    ctx.font = '36px Arial';
    ctx.fillText(page.content.subtitle, width / 2, 400);

    // Artist names
    ctx.fillStyle = BRAND.colors.fire;
    ctx.font = 'bold 48px Arial';
    const artistsY = 600;
    page.content.artists.forEach((artist, index) => {
      ctx.fillText(artist, width / 2, artistsY + index * 70);
    });

    // Instruction
    ctx.fillStyle = BRAND.colors.chrome;
    ctx.font = '32px Arial';
    ctx.fillText(page.content.instruction, width / 2, height - 200);

    // Branding
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(page.content.branding, width / 2, height - 100);

    return this.canvasToTexture();
  }

  // Render masterclass page
  async renderMasterclassPage(pageIndex) {
    const pageData = getMasterclassPageData(pageIndex);
    if (!pageData) return this.renderPlaceholderPage(pageIndex);

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#f5f0e6';
    ctx.fillRect(0, 0, width, height);

    // Header
    ctx.fillStyle = BRAND.colors.black;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pageData.masterclass.artist, width / 2, 80);

    ctx.fillStyle = BRAND.colors.fire;
    ctx.font = 'bold 32px Arial';
    ctx.fillText(pageData.masterclass.lessonTitle, width / 2, 130);

    // Load and draw graffiti image
    try {
      const img = await this.loadImage(pageData.graffitiImage);
      const imgWidth = width - 100;
      const imgHeight = 400;
      const imgX = 50;
      const imgY = 160;
      
      ctx.save();
      ctx.fillStyle = '#000';
      ctx.fillRect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10);
      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();
    } catch (error) {
      // Placeholder if image fails to load
      ctx.fillStyle = '#333';
      ctx.fillRect(50, 160, width - 100, 400);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText('Graffiti Image', width / 2, 360);
    }

    // Color breakdown section
    let yPos = 600;
    ctx.fillStyle = BRAND.colors.black;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Colors Used:', 50, yPos);

    yPos += 50;
    const swatchSize = 40;
    const swatchSpacing = 10;
    const colorsPerRow = 3;

    pageData.colors.slice(0, 6).forEach((color, index) => {
      const row = Math.floor(index / colorsPerRow);
      const col = index % colorsPerRow;
      const xPos = 50 + col * 320;
      const ySwatchPos = yPos + row * 80;

      // Draw swatch
      ctx.fillStyle = color.hex;
      ctx.fillRect(xPos, ySwatchPos, swatchSize, swatchSize);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(xPos, ySwatchPos, swatchSize, swatchSize);

      // Draw color name
      ctx.fillStyle = BRAND.colors.black;
      ctx.font = '18px Arial';
      ctx.fillText(color.name, xPos + swatchSize + swatchSpacing, ySwatchPos + 28);
    });

    // Spray can breakdown
    yPos += 180;
    ctx.fillStyle = BRAND.colors.black;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`Total Cans: ${pageData.totalCans}`, 50, yPos);

    ctx.font = '22px Arial';
    yPos += 40;
    ctx.fillText(`Outline: ${pageData.sprayCanBreakdown.outline} | Fill: ${pageData.sprayCanBreakdown.fill} | BG: ${pageData.sprayCanBreakdown.background}`, 50, yPos);
    yPos += 35;
    ctx.fillText(`Highlights: ${pageData.sprayCanBreakdown.highlights} | Effects: ${pageData.sprayCanBreakdown.effects}`, 50, yPos);

    // Location
    yPos += 50;
    ctx.fillStyle = BRAND.colors.fire;
    ctx.font = 'italic 24px Arial';
    ctx.fillText(`Painted at: ${pageData.location}`, 50, yPos);

    // CTA button
    yPos += 60;
    const buttonWidth = 300;
    const buttonHeight = 50;
    const buttonX = (width - buttonWidth) / 2;
    
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.fillRect(buttonX, yPos, buttonWidth, buttonHeight);
    
    ctx.fillStyle = BRAND.colors.black;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pageData.ctaText, width / 2, yPos + 34);

    // Footer
    ctx.fillStyle = BRAND.colors.chrome;
    ctx.font = '20px Arial';
    ctx.fillText('lpfts.com', width / 2, height - 40);

    return this.canvasToTexture();
  }

  // Render back cover page
  async renderBackCoverPage(page) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(page.content.title, width / 2, 100);

    // Subtitle
    ctx.fillStyle = BRAND.colors.chrome;
    ctx.font = '32px Arial';
    ctx.fillText(page.content.subtitle, width / 2, 160);

    // Legal walls list
    let yPos = 250;
    ctx.textAlign = 'left';
    ctx.font = '28px Arial';
    
    page.content.walls.slice(0, 4).forEach((wall) => {
      ctx.fillStyle = BRAND.colors.fire;
      ctx.fillText(`• ${wall.name}`, 80, yPos);
      
      ctx.fillStyle = BRAND.colors.chrome;
      ctx.font = '22px Arial';
      ctx.fillText(`${wall.distanceFromButterBeats} from Southport`, 100, yPos + 35);
      
      ctx.font = '28px Arial';
      yPos += 90;
    });

    // CTA
    yPos += 100;
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(page.content.cta, width / 2, yPos);

    // QR hint
    ctx.fillStyle = BRAND.colors.chrome;
    ctx.font = '28px Arial';
    ctx.fillText(page.content.qrHint, width / 2, yPos + 60);

    // Branding
    ctx.fillStyle = BRAND.colors.neonGreen;
    ctx.font = 'bold 32px Arial';
    ctx.fillText(page.content.branding, width / 2, height - 80);

    return this.canvasToTexture();
  }

  // Render placeholder page
  renderPlaceholderPage(pageIndex) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#333';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Page ${pageIndex}`, width / 2, height / 2);

    return this.canvasToTexture();
  }

  // Convert canvas to Three.js texture
  canvasToTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  // Load image helper
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  // Clear cache
  clearCache() {
    this.textureCache.forEach(texture => {
      if (texture) texture.dispose();
    });
    this.textureCache.clear();
  }

  // Dispose
  dispose() {
    this.clearCache();
  }
}

