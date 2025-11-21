# LPFTS Legacy Codex - WebAR Experience

[![Status](https://img.shields.io/badge/status-live-success)](https://lpfts-codex-ar.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue)]()

> An immersive Augmented Reality magazine experience showcasing LPFTS graffiti masterclasses, legal walls, and artist palettes. Scan the poster to unlock the floating digital Codex.

![LPFTS Codex AR](https://lpfts.com/assets/images/codex-preview.jpg)

---

## 🎯 Quick Start

### For Users

1. **Visit**: [https://lpfts-codex-ar.vercel.app/](https://lpfts-codex-ar.vercel.app/)
2. **Allow** camera access when prompted
3. **Scan** the LPFTS poster (available at Butter Beats Southport)
4. **Tap** the floating Codex to open it
5. **Swipe** or use buttons to flip pages
6. **Explore** masterclasses, spray can analytics, and legal walls

### For Developers

```bash
# Navigate to project directory
cd /home/artemis/Workspace/LPFTS/ar-vr

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Features

### ✨ Image Tracking AR
- **MindAR** powered image tracking (no license required)
- Targets the LPFTS poster displayed at Butter Beats Southport
- Stable tracking optimized for retail environments
- Instant detection and spawn

### 📖 Interactive 3D Codex
- **Fully interactable** 3D book model
- Tap/click the book to open it
- Swipe gestures or buttons to flip pages
- Smooth page-flip animations
- Hover effects with raycasting

### 🎨 Content Pages
1. **Cover** - LPFTS Legacy Codex branding
2. **BAEK Masterclass** - Spray can analytics & palette
3. **LURK Masterclass** - Artist techniques & colors
4. **MAIM Masterclass** - Legal wall locations & details
5. **Back Cover** - Gallery button & links

### 🖼️ Gallery Integration
- **"Open Gallery" button** links directly to [lpfts.com/gallery](https://lpfts.com/gallery)
- Showcases LPFTS merchandise and NFTs
- Seamless web integration

### 📍 Legal Walls
- **Gold Coast legal walls** near Butter Beats Southport
- Interactive map integration
- Community-approved spots for graffiti artists

### 📊 Analytics
- Real spray can counts for each masterclass
- Accurate color palettes from professional paint products
- Artist palette breakdowns

---

## 🏗️ Technical Architecture

### Tech Stack
- **MindAR** - Image tracking (v1.2.4)
- **Three.js** - 3D rendering (v0.160.0)
- **Vite** - Build tool (v5.0.0)
- **Vanilla JavaScript** - No heavy frameworks

### File Structure
```
/home/artemis/Workspace/LPFTS/ar-vr/
├── public/
│   ├── assets/
│   │   ├── targets/
│   │   │   ├── poster-target.jpg       # Source image
│   │   │   └── poster-target.mind      # Compiled target
│   │   ├── models/
│   │   │   └── codex.glb               # 3D book model
│   │   ├── images/                     # Textures & UI
│   │   └── graffiti/                   # Masterclass photos
│   ├── lib/
│   │   └── mindar-image-three.prod.js  # Offline fallback
│   └── ...
├── src/
│   ├── main.js                         # Entry point
│   ├── scene.js                        # Three.js scene setup
│   ├── animations.js                   # Book animations
│   ├── raycaster.js                    # Interaction system
│   ├── page-flip.js                    # Page animations
│   ├── page-navigation.js              # UI controls
│   ├── page-renderer.js                # Texture generation
│   ├── config.js                       # AR configuration
│   └── ...
├── scripts/
│   ├── build-codex-model.js            # Generate 3D model
│   ├── compile-mindar-target.js        # Compile tracking target
│   └── ...
├── index.html                          # Main AR app
├── poster.html                         # Print-ready poster
├── styles.css                          # Global styles
├── package.json
├── vite.config.js
└── README.md
```

### Key Components

#### 1. Image Tracking (`src/main.js` + `src/config.js`)
```javascript
// Optimized MindAR settings for retail display
mindar: {
  imageTargetSrc: '/assets/targets/poster-target.mind',
  maxTrack: 1,
  warmupTolerance: 3,
  missTolerance: 5,
  filterMinCF: 0.0001,
  filterBeta: 1000
}
```

#### 2. Raycasting (`src/raycaster.js`)
```javascript
// Make book interactable
raycaster.addInteractableObject(codexMesh, {
  onTap: () => handleCodexTap(),
  onHover: () => addHoverEffect(),
  onHoverEnd: () => removeHoverEffect()
});
```

#### 3. Page System (`src/page-flip.js` + `src/page-navigation.js`)
- Individual 3D page meshes
- Smooth flip animations
- Swipe gesture detection
- Touch-optimized UI buttons

---

## 🖨️ Creating the Tracking Target

### Method 1: Online Compiler (Recommended)

1. Visit: [https://hiukim.github.io/mind-ar-js-doc/tools/compile](https://hiukim.github.io/mind-ar-js-doc/tools/compile)
2. Upload: `public/assets/targets/poster-target.jpg`
3. Click: **"Start Compile"**
4. Download: `targets.mind` file
5. Rename and save as: `public/assets/targets/poster-target.mind`
6. Rebuild and deploy

### Method 2: Using Script

```bash
# Run the helper script
npm run compile:target

# Follow the on-screen instructions
```

### Tips for Best Tracking
- **High contrast** images work best
- **Avoid symmetry** (harder to track)
- **Unique features** improve reliability
- **Print quality** matters (300 DPI minimum)
- **Lighting** should be even, no glare

---

## 🚀 Deployment

### Vercel (Current Platform)

```bash
# Login to Vercel
vercel login

# Deploy to production
cd dist
vercel --prod
```

**Live URL**: [https://lpfts-codex-ar.vercel.app/](https://lpfts-codex-ar.vercel.app/)

### Environment Variables
No environment variables required - fully client-side!

### HTTPS Required
⚠️ **Camera access requires HTTPS**. All modern browsers block camera access over HTTP.

---

## 🎨 Customization

### Changing Colors
Edit `src/config.js`:
```javascript
colors: {
  LPFTS_CHROME: '#C2C2C2',
  LPFTS_NEON_GREEN: '#63FF7D',
  LPFTS_CYAN: '#00E5FF',
  LPFTS_TEAL: '#32FFF5'
}
```

### Updating Content
1. **Masterclasses**: Edit `src/masterclasses.js`
2. **Legal Walls**: Edit `src/legal-walls.js`
3. **Palettes**: Edit `src/palettes.js`
4. **Graffiti Photos**: Add to `public/assets/graffiti/`

### Customizing the 3D Model
```bash
# Rebuild the Codex model
npm run build:codex

# This regenerates public/assets/models/codex.glb
```

---

## 🐛 Troubleshooting

### Issue: Camera permission denied
**Solution**: 
- Check browser settings
- iOS: Settings → Safari → Camera → "Ask" or "Allow"
- Android: Chrome → Site Settings → Camera → Allow

### Issue: AR not loading / stuck on loading screen
**Solution**:
1. Ensure `.mind` file exists at `public/assets/targets/poster-target.mind`
2. Check browser console for errors
3. Verify HTTPS connection
4. Try reloading the page

### Issue: Target not detected
**Solution**:
- Ensure poster is well-lit (no glare)
- Hold phone steady, 30-50cm from poster
- Make sure entire poster is visible
- Check that `.mind` file was compiled from correct poster image

### Issue: Book not opening on tap
**Solution**:
- Target must be detected first (book visible)
- Tap directly on the 3D book mesh
- Check browser console for raycaster errors

### Issue: Pages not flipping
**Solution**:
- Ensure page system initialized (check console logs)
- Try using swipe gestures instead of buttons
- Check that all page meshes loaded correctly

---

## 📊 Performance Optimization

### Current Metrics
- Initial load: **~2-3 seconds**
- GLB size: **~500KB** (optimized)
- Texture total: **~2MB**
- Target FPS: **30fps+** on mobile
- Tracking latency: **<100ms**

### Tips for Better Performance
1. **Compress images** before adding to `/assets/graffiti/`
2. **Lazy load** page textures (already implemented)
3. **Reduce polygon count** in 3D model if needed
4. **Use image optimization** tools like ImageOptim or TinyPNG

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Test on both iOS and Android
- Ensure AR tracking works reliably
- Update documentation as needed
- Keep dependencies minimal

---

## 📜 License

MIT License - see `LICENSE` file for details.

---

## 🏢 About LPFTS

**LPFTS WORLD WIDE** is a graffiti missions + NFT + token ecosystem connecting street artists, collectors, and fans through Web3 technology.

- **Website**: [lpfts.com](https://lpfts.com)
- **Gallery**: [lpfts.com/gallery](https://lpfts.com/gallery)
- **Tokens**: $SPRAY, $LPFTS, $GRAFF
- **Network**: Polygon

---

## 📍 Where to See It

**Butter Beats Southport**  
Gold Coast, Queensland, Australia

Visit the store to scan the poster and experience the AR Codex in person!

---

## 📞 Support

- **Email**: support@lpfts.com
- **Discord**: [LPFTS Community](https://discord.gg/lpfts)
- **Website**: [lpfts.com](https://lpfts.com)

---

## 🙏 Credits

- **MindAR**: [https://hiukim.github.io/mind-ar-js-doc/](https://hiukim.github.io/mind-ar-js-doc/)
- **Three.js**: [https://threejs.org/](https://threejs.org/)
- **Artists**: BAEK, LURK, MAIM
- **Location Partner**: Butter Beats Southport

---

## 🗺️ Roadmap

**Note:** Planned features — not yet implemented.

- [ ] Multi-target tracking (multiple posters)
- [ ] NFT integration (mint from AR)
- [ ] Voice narration for masterclasses
- [ ] AR filters and effects
- [ ] Social sharing features
- [ ] Gamification (missions in AR)

---

**Built with ❤️ by the LPFTS team**
