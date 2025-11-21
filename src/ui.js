// UI overlay management for panels and buttons

import { CONFIG } from './config.js';
import { getAllMasterclasses } from './masterclasses.js';
import { getAllMerchItems } from './merch.js';
import { getAllPalettes, getPaletteByArtist, getDifficulty } from './palettes.js';

export class UI {
  constructor() {
    this.panels = {};
    this.buttons = {};
    this.activePanel = null;
    this.masterclasses = getAllMasterclasses();
    this.merchItems = getAllMerchItems();
    this.palettes = getAllPalettes();
    this.currentArtist = null;
    this.currentDifficulty = null;
    this.init();
  }

  init() {
    this.createUI();
    this.attachEventListeners();
  }

  createUI() {
    // Create main UI container
    const uiContainer = document.createElement('div');
    uiContainer.id = 'ui-container';
    document.body.appendChild(uiContainer);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'button-container';
    buttonContainer.className = 'hidden';
    uiContainer.appendChild(buttonContainer);

    // Create buttons
    const buttons = [
      { id: 'masterclass', label: 'MASTERCLASS', icon: '📚' },
      { id: 'gallery', label: 'GALLERY', icon: '🖼️' },
      { id: 'palettes', label: 'PALETTES', icon: '🎨' },
      { id: 'legalwalls', label: 'LEGAL WALLS', icon: '📍' },
      { id: 'missions', label: 'MISSIONS', icon: '🎯' },
      { id: 'merch', label: 'MERCH DROP', icon: '👕' }
    ];

    buttons.forEach((btn) => {
      const button = document.createElement('button');
      button.id = `btn-${btn.id}`;
      button.className = 'ar-button';
      button.innerHTML = `<span class="button-icon">${btn.icon}</span><span class="button-label">${btn.label}</span>`;
      button.dataset.panel = btn.id;
      buttonContainer.appendChild(button);
      this.buttons[btn.id] = button;
    });

    // Create panel container
    const panelContainer = document.createElement('div');
    panelContainer.id = 'panel-container';
    uiContainer.appendChild(panelContainer);

    // Create panels
    const panels = ['masterclass', 'gallery', 'palettes', 'legalwalls', 'missions', 'merch'];
    panels.forEach((panelId) => {
      const panel = document.createElement('div');
      panel.id = `panel-${panelId}`;
      panel.className = 'ar-panel';
      panel.innerHTML = this.getPanelContent(panelId);
      panelContainer.appendChild(panel);
      this.panels[panelId] = panel;
    });

    // Create close button for panels
    const closeButton = document.createElement('button');
    closeButton.id = 'close-panel';
    closeButton.className = 'close-button';
    closeButton.innerHTML = '✕';
    closeButton.addEventListener('click', () => this.closePanel());
    uiContainer.appendChild(closeButton);
  }

  getPanelContent(panelId) {
    if (panelId === 'masterclass') {
      return this.getMasterclassContent();
    }
    if (panelId === 'palettes') {
      return this.getPalettesContent();
    }
    if (panelId === 'legalwalls') {
      return this.getLegalWallsContent();
    }
    if (panelId === 'missions') {
      return this.getMissionsContent();
    }
    if (panelId === 'gallery') {
      return this.getGalleryContent();
    }
    if (panelId === 'merch') {
      return this.getMerchContent();
    }
    return '<div class="panel-content"><p>Content not available</p></div>';
  }

  getMasterclassContent() {
    let html = `
      <div class="panel-content">
        <h2>MASTERCLASS</h2>
        <p class="panel-subtitle">Tap to learn how the real writers move.</p>
        <div class="masterclass-list">
    `;

    this.masterclasses.forEach((mc) => {
      const totalCans = Object.values(mc.sprayCanBreakdown).reduce((a, b) => a + b, 0);
      const colorSwatches = mc.colors.map(c => 
        `<span class="color-swatch" style="background-color: ${c.hex}" title="${c.name}"></span>`
      ).join('');

      html += `
        <div class="masterclass-card" data-id="${mc.id}">
          <div class="masterclass-header">
            <h3>${mc.artist}</h3>
            <span class="crew-badge">${mc.crew}</span>
          </div>
          <div class="masterclass-title">${mc.lessonTitle}</div>
          <div class="masterclass-details">
            <div class="detail-item">
              <strong>Piece:</strong> ${mc.pieceName}
            </div>
            <div class="detail-item">
              <strong>Location:</strong> ${mc.location}
            </div>
            <div class="detail-item">
              <strong>Time:</strong> ${mc.timeSpent}
            </div>
          </div>
          <div class="spray-can-analytics">
            <h4>Spray Can Analytics</h4>
            <div class="analytics-breakdown">
              <div class="analytics-item">
                <span class="analytics-label">Outline:</span>
                <span class="analytics-value">${mc.sprayCanBreakdown.outline} tins</span>
              </div>
              <div class="analytics-item">
                <span class="analytics-label">Fill:</span>
                <span class="analytics-value">${mc.sprayCanBreakdown.fill} tins</span>
              </div>
              <div class="analytics-item">
                <span class="analytics-label">Background:</span>
                <span class="analytics-value">${mc.sprayCanBreakdown.background} tins</span>
              </div>
              <div class="analytics-item">
                <span class="analytics-label">Highlights:</span>
                <span class="analytics-value">${mc.sprayCanBreakdown.highlights} tins</span>
              </div>
              <div class="analytics-item">
                <span class="analytics-label">Effects:</span>
                <span class="analytics-value">${mc.sprayCanBreakdown.effects} tins</span>
              </div>
              <div class="analytics-total">
                <strong>Total: ${totalCans} spray cans</strong>
              </div>
            </div>
            <div class="color-palette-preview">
              <h5>Colors Used</h5>
              <div class="color-swatches-row">
                ${colorSwatches}
              </div>
            </div>
          </div>
          <div class="key-tips">
            <h4>Key Techniques</h4>
            <ul>
              ${mc.keyTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
          <div class="ethics-note">
            <p>${mc.ethicsNote}</p>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    return html;
  }

  getPalettesContent() {
    // CodexAPI is initialized in codex-api.js

    // Get first artist and difficulty as default
    const artistKeys = Object.keys(this.palettes);
    const defaultArtist = artistKeys[0] || 'baeks';
    const defaultArtistData = this.palettes[defaultArtist];
    const defaultDifficultyKey = Object.keys(defaultArtistData.difficulties)[0] || 'medium';
    
    this.currentArtist = defaultArtist;
    this.currentDifficulty = defaultDifficultyKey;

    let html = `
      <div class="panel-content">
        <h2>PALETTES</h2>
        <p class="panel-subtitle">Colours with a reason behind them.</p>
        
        <!-- Artist Tabs -->
        <div class="artist-tabs">
    `;

    artistKeys.forEach((key) => {
      const artist = this.palettes[key];
      html += `
        <button class="artist-tab ${key === defaultArtist ? 'active' : ''}" data-artist="${key}">
          ${artist.name}
        </button>
      `;
    });

    html += `
        </div>
        
        <!-- Difficulty Buttons -->
        <div class="difficulty-buttons">
          <button class="diff-btn" data-diff="beginner">Beginner</button>
          <button class="diff-btn" data-diff="medium">Medium</button>
          <button class="diff-btn" data-diff="hard">Hard</button>
        </div>
        
        <!-- Palette Display Area -->
        <div class="palette-display-area">
          <div class="palette-header">
            <h3 id="artist-name">${defaultArtistData.name}</h3>
            <p id="artist-meta" class="artist-meta">${defaultArtistData.meta}</p>
            <span id="diff-chip" class="diff-chip">${defaultArtistData.difficulties[defaultDifficultyKey].label}</span>
          </div>
          
          <p id="palette-caption" class="palette-caption">${defaultArtistData.difficulties[defaultDifficultyKey].caption}</p>
          
          <!-- Graffiti Preview -->
          <div class="graff-preview">
            <div class="graff-head">
              <span class="graff-label">Sample Piece</span>
              <span id="graff-name" class="graff-name">${defaultArtistData.name} – ${defaultArtistData.difficulties[defaultDifficultyKey].styleName}</span>
            </div>
            <div class="graff-frame">
              <img id="graff-image"
                   src="${defaultArtistData.difficulties[defaultDifficultyKey].image}"
                   alt="Artist piece"
                   loading="lazy" />
            </div>
          </div>
          
          <!-- Swatches -->
          <div class="swatch-row" id="swatch-row"></div>
          
          <!-- Lesson -->
          <div class="lesson-section">
            <h4 id="lesson-title">${defaultArtistData.difficulties[defaultDifficultyKey].lessonTitle}</h4>
            <p id="lesson-body">${defaultArtistData.difficulties[defaultDifficultyKey].lessonBody}</p>
          </div>
          
          <!-- Usage List -->
          <div class="usage-section">
            <h4>Spray Can Usage</h4>
            <ul class="usage-list" id="usage-list"></ul>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  renderPalette(artistKey, requestedDiff) {
    const artist = this.palettes[artistKey];
    if (!artist) return;

    const availableDiffs = Object.keys(artist.difficulties);
    const diffKey = requestedDiff && availableDiffs.includes(requestedDiff) 
      ? requestedDiff 
      : availableDiffs[0];

    if (!diffKey) return;

    const diff = artist.difficulties[diffKey];
    this.currentArtist = artistKey;
    this.currentDifficulty = diffKey;

    // Update DOM elements
    const artistNameEl = document.getElementById('artist-name');
    const artistMetaEl = document.getElementById('artist-meta');
    const diffChipEl = document.getElementById('diff-chip');
    const paletteCaptionEl = document.getElementById('palette-caption');
    const lessonTitleEl = document.getElementById('lesson-title');
    const lessonBodyEl = document.getElementById('lesson-body');
    const graffImageEl = document.getElementById('graff-image');
    const graffNameEl = document.getElementById('graff-name');
    const swatchRowEl = document.getElementById('swatch-row');
    const usageListEl = document.getElementById('usage-list');
    const artistTabs = document.querySelectorAll('.artist-tab');
    const diffButtons = document.querySelectorAll('.diff-btn');

    if (artistNameEl) artistNameEl.textContent = artist.name;
    if (artistMetaEl) artistMetaEl.textContent = artist.meta;
    if (diffChipEl) diffChipEl.textContent = diff.label;
    if (paletteCaptionEl) paletteCaptionEl.textContent = diff.caption;
    if (lessonTitleEl) lessonTitleEl.textContent = diff.lessonTitle;
    if (lessonBodyEl) lessonBodyEl.textContent = diff.lessonBody;

    // Graffiti preview
    if (graffImageEl && diff.image) {
      graffImageEl.src = diff.image;
    }
    if (graffNameEl) {
      const styleName = diff.styleName || diff.label;
      graffNameEl.textContent = `${artist.name} – ${styleName}`;
    }

    // Update tabs
    if (artistTabs) {
      artistTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.artist === artistKey);
      });
    }

    // Update difficulty buttons
    if (diffButtons) {
      diffButtons.forEach((btn) => {
        const key = btn.dataset.diff;
        const has = !!artist.difficulties[key];
        btn.classList.toggle('disabled', !has);
        btn.disabled = !has;
        btn.classList.toggle('active', key === diffKey);
      });
    }

    // Render swatches
    if (swatchRowEl) {
      swatchRowEl.innerHTML = '';
      diff.swatches.forEach((sw) => {
        const swEl = document.createElement('div');
        swEl.className = 'swatch';
        swEl.style.background = sw.color;
        const label = document.createElement('div');
        label.className = 'swatch-label';
        label.textContent = sw.name;
        swEl.appendChild(label);
        swatchRowEl.appendChild(swEl);
      });
    }

    // Render usage list
    if (usageListEl) {
      usageListEl.innerHTML = '';
      let totalCans = 0;
      diff.swatches.forEach((sw) => {
        const li = document.createElement('li');
        const cans = sw.cans || 0;
        totalCans += cans;
        li.textContent = `${sw.name}: ~${cans} can${cans !== 1 ? 's' : ''}`;
        usageListEl.appendChild(li);
      });

      const totalLi = document.createElement('li');
      totalLi.style.marginTop = '4px';
      totalLi.style.fontWeight = 'bold';
      totalLi.textContent = `Estimated total: ~${totalCans.toFixed(1)} cans for one full piece.`;
      usageListEl.appendChild(totalLi);
    }

    // Expose palette change for AR / analytics
    if (window.CodexAPI && typeof window.CodexAPI.notifyPaletteChange === 'function') {
      window.CodexAPI.notifyPaletteChange({
        artistKey,
        diffKey,
        artist,
        diff
      });
    }
  }

  getLegalWallsContent() {
    return `
      <div class="panel-content">
        <h2>LEGAL WALLS</h2>
        <p class="panel-subtitle">Spots you can paint without heat.</p>
        <div class="walls-grid">
          <div class="wall-card">
            <div class="wall-header">
              <h3>Southport Legal Wall</h3>
              <span class="wall-suburb">Carey Park</span>
            </div>
            <div class="wall-details">
              <div class="wall-detail-item">
                <strong>Hours:</strong> Dawn to dusk
              </div>
              <div class="wall-detail-item">
                <strong>Surface:</strong> Concrete block
              </div>
              <div class="wall-etiquette">
                <p>Respect the rotation. Don't go over fresh work. Clean up your caps.</p>
              </div>
            </div>
          </div>

          <div class="wall-card">
            <div class="wall-header">
              <h3>Nerang Underpass</h3>
              <span class="wall-suburb">Ferry Road</span>
            </div>
            <div class="wall-details">
              <div class="wall-detail-item">
                <strong>Hours:</strong> 24/7 (well lit)
              </div>
              <div class="wall-detail-item">
                <strong>Surface:</strong> Concrete tunnel
              </div>
              <div class="wall-etiquette">
                <p>Covered spot. Good for practice. Watch for traffic.</p>
              </div>
            </div>
          </div>

          <div class="wall-card">
            <div class="wall-header">
              <h3>Miami Skatepark Wall</h3>
              <span class="wall-suburb">Miami</span>
            </div>
            <div class="wall-details">
              <div class="wall-detail-item">
                <strong>Hours:</strong> Park hours
              </div>
              <div class="wall-detail-item">
                <strong>Surface:</strong> Smooth concrete
              </div>
              <div class="wall-etiquette">
                <p>Skatepark rules apply. Don't block the flow. Respect the locals.</p>
              </div>
            </div>
          </div>

          <div class="wall-card">
            <div class="wall-header">
              <h3>Palm Beach Drain</h3>
              <span class="wall-suburb">Palm Beach</span>
            </div>
            <div class="wall-details">
              <div class="wall-detail-item">
                <strong>Hours:</strong> Daylight hours
              </div>
              <div class="wall-detail-item">
                <strong>Surface:</strong> Drain wall
              </div>
              <div class="wall-etiquette">
                <p>Hidden gem. Keep it clean. Don't bring heat to the spot.</p>
              </div>
            </div>
          </div>

          <div class="wall-card locked">
            <div class="wall-header">
              <h3>Secret LPFTS Codex Spot</h3>
              <span class="wall-suburb">🔒 Locked</span>
            </div>
            <div class="wall-details">
              <div class="wall-locked-message">
                <p>Complete all missions to unlock this exclusive location.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getMissionsContent() {
    return `
      <div class="panel-content">
        <h2>MISSIONS</h2>
        <p class="panel-subtitle">Earn it. Play it. Own it.</p>
        <div class="missions-list">
          <div class="mission-item">
            <div class="mission-header">
              <h3>🎯 S1M1 - First Piece</h3>
              <span class="mission-status available">Available</span>
            </div>
            <div class="mission-description">
              <p><strong>Objective:</strong> Complete your first legal wall piece.</p>
              <p><strong>Reward:</strong> Unlock Masterclass Level 1</p>
            </div>
          </div>

          <div class="mission-item">
            <div class="mission-header">
              <h3>🎯 S1M2 - Can Control</h3>
              <span class="mission-status locked">Locked</span>
            </div>
            <div class="mission-description">
              <p><strong>Objective:</strong> Use 10+ spray cans in a single piece.</p>
              <p><strong>Reward:</strong> Unlock Advanced Techniques</p>
              <p class="mission-requirement">Complete S1M1 first</p>
            </div>
          </div>

          <div class="mission-item">
            <div class="mission-header">
              <h3>🎯 S1M3 - Legal Wall Master</h3>
              <span class="mission-status locked">Locked</span>
            </div>
            <div class="mission-description">
              <p><strong>Objective:</strong> Complete artwork at a legal wall location.</p>
              <p><strong>Reward:</strong> Exclusive LPFTS NFT + Secret Codex Spot Access</p>
              <p class="mission-requirement">Complete S1M2 first</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getGalleryContent() {
    return `
      <div class="panel-content">
        <h2>ART GALLERY</h2>
        <p class="panel-subtitle">Real work from real writers.</p>
        <div class="content-placeholder">
          <div class="gallery-grid">
            <div class="gallery-item">
              <div class="gallery-placeholder">BAEK - Flow State</div>
            </div>
            <div class="gallery-item">
              <div class="gallery-placeholder">LURK - Structure & Flow</div>
            </div>
            <div class="gallery-item">
              <div class="gallery-placeholder">MAIM - Electric Dreams</div>
            </div>
            <div class="gallery-item">
              <div class="gallery-placeholder">Community Piece</div>
            </div>
          </div>
          <p style="margin-top: 20px; color: var(--lpfts-chrome);">
            Browse through the collection of LPFTS masterpieces. Each piece includes detailed spray can analytics.
          </p>
        </div>
      </div>
    `;
  }

  getMerchContent() {
    let html = `
      <div class="panel-content">
        <h2>MERCH DROP</h2>
        <p class="panel-subtitle">Rep the culture. Own the gear.</p>
        
        <!-- Hero Banner -->
        <div class="merch-banner">
          <img src="/assets/images/lpfts-banner.jpg" alt="LPFTS Merch" class="banner-image" onerror="this.style.display='none';">
          <div class="banner-overlay">
            <p class="banner-text">SEASON 1 DROP</p>
          </div>
        </div>
        
        <!-- Merch Items Grid -->
        <div class="merch-grid">
    `;

    this.merchItems.forEach((item) => {
      html += `
        <div class="merch-item" data-id="${item.id}">
          <div class="merch-image-container">
            <img src="${item.imageFront}" alt="${item.name}" class="merch-image" onerror="this.src='/assets/images/placeholder-tee.jpg';">
            ${item.imageBack ? `<img src="${item.imageBack}" alt="${item.name} back" class="merch-image-back" onerror="this.style.display='none';" style="display:none;">` : ''}
            <div class="merch-tag">${item.tag}</div>
          </div>
          <div class="merch-info">
            <h3 class="merch-name">${item.name}</h3>
            <p class="merch-description">${item.description}</p>
            <a href="${item.ctaUrl}" target="_blank" rel="noopener noreferrer" class="merch-cta-button">
              TAP TO SHOP
            </a>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    return html;
  }

  attachEventListeners() {
    // Button clicks
    Object.keys(this.buttons).forEach((btnId) => {
      this.buttons[btnId].addEventListener('click', () => {
        this.openPanel(btnId);
      });
    });

    // Panel backdrop click to close
    this.panels['masterclass'].parentElement.addEventListener('click', (e) => {
      if (e.target.id === 'panel-container') {
        this.closePanel();
      }
    });

    // Delegate palette panel interactions
    setTimeout(() => {
      this.setupPaletteListeners();
    }, 100);
  }

  setupPaletteListeners() {
    const palettePanel = this.panels['palettes'];
    if (!palettePanel) return;

    // Artist tab clicks
    palettePanel.addEventListener('click', (e) => {
      if (e.target.classList.contains('artist-tab')) {
        const artistKey = e.target.dataset.artist;
        this.renderPalette(artistKey, this.currentDifficulty);
      }

      // Difficulty button clicks
      if (e.target.classList.contains('diff-btn') && !e.target.disabled) {
        const diffKey = e.target.dataset.diff;
        this.renderPalette(this.currentArtist, diffKey);
      }
    });
  }

  showButtons() {
    const container = document.getElementById('button-container');
    if (container) {
      container.classList.remove('hidden');
      container.classList.add('visible');
    }
  }

  hideButtons() {
    const container = document.getElementById('button-container');
    if (container) {
      container.classList.remove('visible');
      container.classList.add('hidden');
    }
  }

  openPanel(panelId) {
    // Close any active panel first
    if (this.activePanel) {
      this.closePanel();
    }

    // Open new panel
    const panel = this.panels[panelId];
    if (panel) {
      panel.classList.add('active');
      this.activePanel = panelId;
      document.body.style.overflow = 'hidden';

      // Initialize palette panel if needed
      if (panelId === 'palettes' && this.currentArtist) {
        setTimeout(() => {
          this.renderPalette(this.currentArtist, this.currentDifficulty);
        }, 50);
      }
    }
  }

  closePanel() {
    if (this.activePanel) {
      const panel = this.panels[this.activePanel];
      if (panel) {
        panel.classList.remove('active');
        this.activePanel = null;
        document.body.style.overflow = '';
      }
    }
  }
}
