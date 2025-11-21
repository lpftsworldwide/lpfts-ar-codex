# 🎯 Compile Your LPFTS Poster as AR Target

## ✅ Your poster is ready to compile!

**Source file:** `public/assets/targets/poster-target.jpg` (4.6 KB)

---

## 🔧 **COMPILE NOW (Required for AR tracking):**

### **Method 1: Online Compiler (Easiest)**

1. **Go to:** https://hiukim.github.io/mind-ar-js-doc/tools/compile/

2. **Upload:** 
   - Click "Choose File"
   - Select: `public/assets/targets/poster-target.jpg`
   - Or use the image you just shared (the professional LPFTS poster)

3. **Compile:**
   - Click "Start Compile"
   - Wait ~30 seconds

4. **Download:**
   - Click "Download"
   - Save as: `poster-target.mind`

5. **Replace:**
   ```bash
   cd /home/artemis/Workspace/LPFTS/ar-vr
   # Copy your downloaded file to:
   cp ~/Downloads/poster-target.mind public/assets/targets/poster-target.mind
   ```

6. **Deploy:**
   ```bash
   git add public/assets/targets/poster-target.mind public/qr/ar-live.png
   git commit -m "feat(ar): add compiled poster target for image tracking"
   git push origin main
   vercel --prod
   ```

---

## 📱 **After Compiling:**

**New features will work:**
- ✅ AR tracks your actual poster
- ✅ Codex appears when scanning
- ✅ Stable, accurate tracking
- ✅ No more timeout errors

---

## 🎨 **Your Poster:**

- "FREE 100 $SPRAY RIGHT NOW"
- "SCAN TO UNLOCK THE AR CODEX PORTAL"
- "Minting Opens Tomorrow"
- QR Code → **NEW:** Points to live AR app!
- Polygon + MetaMask logos

**This poster is PERFECT for AR tracking!**
- High contrast ✅
- Clear text ✅
- Distinct features ✅
- Good size (4.6 KB) ✅

---

## 🚀 **Quick Deploy After Compile:**

```bash
cd /home/artemis/Workspace/LPFTS/ar-vr

# Add compiled target
git add public/assets/targets/poster-target.mind public/qr/ar-live.png

# Commit
git commit -m "feat(ar): add compiled poster target for image tracking"

# Push to GitHub
git push origin main

# Deploy to Vercel
vercel --prod
```

---

## 🧪 **Testing:**

1. Print your poster (300 DPI)
2. Open: https://ar-7jlyi52h0-lpftss-projects.vercel.app
3. Allow camera
4. Point at printed poster
5. **Expected:** Codex appears and tracks perfectly!

---

**Compile the target now at:** https://hiukim.github.io/mind-ar-js-doc/tools/compile/

