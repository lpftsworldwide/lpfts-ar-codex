// LPFTS Artist Palettes with Graffiti References
// Ironlak + Casino approximations + real wall references

export const PALETTES = {
  baeks: {
    name: "BAEKS",
    meta: "Brisbane • Metallic Ribbon Flow • GCK",
    difficulties: {
      // First BAEKS wall – purple/orange/yellow / blue background
      medium: {
        label: "Medium • Sunset Ribbon",
        caption: "Warm metallic fills • cold background pops",
        styleName: "Sunset Ribbon Burner",
        image: "/assets/graffiti/baeks_1.jpg",
        swatches: [
          { name: "Fill A – Ironlak Mango Melt",      color: "#fbbf24", cans: 1.5 },
          { name: "Fill B – Ironlak Melon Crush",     color: "#fb923c", cans: 1.5 },
          { name: "Fill C – Ironlak Lilac Storm",     color: "#a855f7", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#050608", cans: 1 },
          { name: "Inner Glow – Ironlak Marshmallow", color: "#fdfdfd", cans: 0.5 },
          { name: "Background – Ironlak Sky Blue",    color: "#3b82f6", cans: 1 },
          { name: "Aura – Ironlak Electric Blue",     color: "#2563eb", cans: 0.5 }
        ],
        lessonTitle: "Sunset Ribbon Flow",
        lessonBody:
          "Treat the piece like stacked metal plates. Build a warm sunset blend from yellow into orange and lilac, then let a cold blue background push the letters off the wall. Keep your Jet Black outline thick and confident."
      },
      // Third "GCK rep" style – red/blue wildstyle
      hard: {
        label: "Hard • Wild Ribbon",
        caption: "Deep reds • cold chrome blues",
        styleName: "Full Wildstyle Panel",
        image: "/assets/graffiti/baeks_2.jpg",
        swatches: [
          { name: "Fill A – Ironlak Blood Red",       color: "#b91c1c", cans: 2 },
          { name: "Fill B – Ironlak Steel Blue",      color: "#2563eb", cans: 1.5 },
          { name: "Fill C – Ironlak Ice Blue",        color: "#93c5fd", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#050608", cans: 1 },
          { name: "Cuts – Ironlak Marshmallow",       color: "#f9fafb", cans: 0.5 },
          { name: "FX – Ironlak Neon Magenta",        color: "#db2777", cans: 0.5 }
        ],
        lessonTitle: "Wildstyle Construction",
        lessonBody:
          "Lock your bars first, then layer gradients through them rather than chasing blends randomly. Use harsh colour jumps between red and blue to emphasise direction changes, then carve legibility back in with Marshmallow cuts."
      }
    }
  },

  basix: {
    name: "BASIX",
    meta: "Gold Coast • Full Spectrum Wildstyle • GCK",
    difficulties: {
      // Toxic green BASIX wall
      hard: {
        label: "Hard • Toxic Mesh",
        caption: "Radioactive greens • lava glows",
        styleName: "Toxic Mesh Burner",
        image: "/assets/graffiti/basix_1.jpg",
        swatches: [
          { name: "Fill – Ironlak Amazon",            color: "#16a34a", cans: 2 },
          { name: "Fade – Ironlak Toxic",             color: "#bef264", cans: 1 },
          { name: "Shadow – Casino Jet Black",        color: "#020617", cans: 1 },
          { name: "Glow – Ironlak Magenta Bomb",      color: "#e11d48", cans: 1 },
          { name: "Aura – Ironlak Deep Purple",       color: "#6d28d9", cans: 1 },
          { name: "Mesh – Ironlak Marshmallow",       color: "#f9fafb", cans: 0.5 }
        ],
        lessonTitle: "Toxic Mesh Energy",
        lessonBody:
          "This recipe is about contrast. Slam poisonous greens against brutal magenta glows and purple atmosphere. Keep your mesh lines loose and organic so they feel like energy fields, not rigid grids."
      }
    }
  },

  iduno: {
    name: "IDUNO",
    meta: "Australia • Chrome Burner • OG Foundations",
    difficulties: {
      // Silver chrome with green/yellow keyline
      beginner: {
        label: "Beginner • Chrome",
        caption: "Clean silver • heavy outline • hot keyline",
        styleName: "Classic Chrome Wall",
        image: "/assets/graffiti/iduno_1.jpg",
        swatches: [
          { name: "Fill – Ironlak Frost (Chrome)",    color: "#e5e7eb", cans: 3 },
          { name: "Outline – Casino Jet Black",       color: "#020617", cans: 1 },
          { name: "3D – Ironlak Wax Green",           color: "#166534", cans: 1 },
          { name: "Inner Shade – Casino Graphite",    color: "#4b5563", cans: 1 },
          { name: "Keyline – Ironlak Banana Kustard", color: "#facc15", cans: 0.5 },
          { name: "Background – Ironlak Rust Orange", color: "#ea580c", cans: 1 }
        ],
        lessonTitle: "Chrome Style Foundations",
        lessonBody:
          "Shake your chrome extra long and keep your distance consistent. Use Graphite shadow only where letters overlap, then pull everything forward with a clean Jet Black outline and a loud Banana Kustard keyline."
      },
      // Second IDUNO wall – more colour in the body
      medium: {
        label: "Medium • Split Chrome",
        caption: "Silver body • colour tips",
        styleName: "Split Chrome Tips",
        image: "/assets/graffiti/iduno_2.jpg",
        swatches: [
          { name: "Fill – Ironlak Frost (Chrome)",    color: "#e5e7eb", cans: 2.5 },
          { name: "Tip Fade – Ironlak Jungle Green",  color: "#15803d", cans: 1 },
          { name: "Tip Fade – Ironlak Purple Haze",   color: "#7c3aed", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#020617", cans: 1 },
          { name: "Highlights – Ironlak Marshmallow", color: "#f9fafb", cans: 0.5 },
          { name: "Keyline – Ironlak Sunburst",       color: "#f97316", cans: 0.5 }
        ],
        lessonTitle: "Split-Tip Chromes",
        lessonBody:
          "Lay your chrome first, then fog colour only on the tips and outer faces of the letters. Keep your blends soft so the chrome still reads, then use Marshmallow pops and a warm keyline to stitch everything together."
      }
    }
  },

  maim: {
    name: "MAIM",
    meta: "Gold Coast • Bubble Frost & Burner Hybrids",
    difficulties: {
      // Orange burner
      beginner: {
        label: "Beginner • Orange Burner",
        caption: "Warm body • cold bubbles",
        styleName: "Tunnel Orange Burner",
        image: "/assets/graffiti/maim_1.jpg",
        swatches: [
          { name: "Fill – Ironlak Burnt Orange",      color: "#ea580c", cans: 2 },
          { name: "Fade – Ironlak Tangerine",         color: "#fb923c", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#020617", cans: 1 },
          { name: "3D – Ironlak Aubergine",           color: "#4c1d95", cans: 1 },
          { name: "Bubbles – Ironlak Sky Blue",       color: "#38bdf8", cans: 1 },
          { name: "Highlights – Ironlak Marshmallow", color: "#f9fafb", cans: 0.5 }
        ],
        lessonTitle: "Bubble Burner Basics",
        lessonBody:
          "Run your burner hot – oranges and tangerines – then cool it with thick Sky Blue bubbles. Use Marshmallow only where light would really hit: bubble tops and letter edges."
      },
      // Teal / frost MAIM wall
      medium: {
        label: "Medium • Frost Teal",
        caption: "Cold body • purple splashes",
        styleName: "Frost Teal Crown",
        image: "/assets/graffiti/maim_2.jpg",
        swatches: [
          { name: "Fill – Ironlak Ice Mint",          color: "#bae6fd", cans: 2 },
          { name: "Fade – Ironlak Teal Breaker",      color: "#0d9488", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#020617", cans: 1 },
          { name: "Bubbles – Ironlak Deep Purple",    color: "#7c3aed", cans: 1 },
          { name: "Crown FX – Ironlak Neon Purple",   color: "#a855f7", cans: 0.5 },
          { name: "Highlights – Ironlak Marshmallow", color: "#f9fafb", cans: 0.5 }
        ],
        lessonTitle: "Cold Wall Control",
        lessonBody:
          "Push the body into cool teals and keep the outline razor sharp. Purple splashes and droplets give you motion, but don't over-detail – leave breathing room so the letters stay legible."
      },
      // Purple / gold MAIM wall
      hard: {
        label: "Hard • Royal Fade",
        caption: "Royal purples • molten gold edge",
        styleName: "Royal Tunnel Fade",
        image: "/assets/graffiti/maim_3.jpg",
        swatches: [
          { name: "Fill – Ironlak Royal Purple",      color: "#5b21b6", cans: 2 },
          { name: "Fade – Ironlak Midnight Plum",     color: "#3b0764", cans: 1 },
          { name: "Outline – Casino Jet Black",       color: "#020617", cans: 1 },
          { name: "Edge – Ironlak Gold Rush",         color: "#eab308", cans: 1 },
          { name: "Bubbles – Ironlak Bottle Green",   color: "#166534", cans: 1 },
          { name: "Highlights – Ironlak Marshmallow", color: "#f9fafb", cans: 0.5 }
        ],
        lessonTitle: "Royal Fade Discipline",
        lessonBody:
          "Load most of your value into the purples, then cut molten gold along the outward edges. This combo punishes messy outlines – you want your hand as steady as possible so the gold stays crisp."
      }
    }
  }
};

export function getAllPalettes() {
  return PALETTES;
}

export function getPaletteByArtist(artistKey) {
  return PALETTES[artistKey];
}

export function getDifficulty(artistKey, difficultyKey) {
  const artist = PALETTES[artistKey];
  if (!artist) return null;
  return artist.difficulties[difficultyKey] || null;
}

