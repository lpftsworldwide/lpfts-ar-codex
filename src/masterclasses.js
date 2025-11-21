// LPFTS Masterclass Data - Complete artist lessons

export const MASTERCLASSES = [
  {
    id: 'baek-pressure-control',
    artist: 'BAEK',
    crew: 'LPFTS',
    lessonTitle: 'Pressure & Control',
    pieceName: 'Flow State',
    location: 'Gold Coast Legal Wall',
    timeSpent: '4.5 hours',
    sprayCanBreakdown: {
      outline: 2,
      fill: 3,
      background: 4,
      highlights: 1,
      effects: 1
    },
    colors: [
      { name: 'Atomic Fire Red', hex: '#D12B1A' },
      { name: 'Night Green', hex: '#0F5A2C' },
      { name: 'Deep Chrome', hex: '#C2C2C2' },
      { name: 'Laser Lime', hex: '#D9FF00' },
      { name: 'Shadow Fade Blue', hex: '#1C2C4F' },
      { name: 'Concrete Mist', hex: '#A3A3A3' }
    ],
    keyTips: [
      'Distance controls line weight. Closer = thicker, farther = thinner.',
      'Steady pressure builds consistency. Don\'t rush the outline.',
      'Cap choice matters. Fat caps for fills, skinny for details.',
      'Overlap your strokes slightly to avoid gaps and streaks.',
      'Practice on paper first. Muscle memory is everything.'
    ],
    ethicsNote: 'Respect the wall. Respect the spot. Leave it cleaner than you found it. Real writers move with purpose.'
  },
  {
    id: 'lurk-letter-discipline',
    artist: 'LURK',
    crew: 'LPFTS',
    lessonTitle: 'Letter Discipline',
    pieceName: 'Structure & Flow',
    location: 'Southport Legal Wall',
    timeSpent: '6 hours',
    sprayCanBreakdown: {
      outline: 3,
      fill: 2,
      background: 3,
      highlights: 2,
      effects: 1
    },
    colors: [
      { name: 'Vintage Bone', hex: '#E6DCC7' },
      { name: 'Chrome Olive', hex: '#708750' },
      { name: 'Muted Ocean', hex: '#375C73' },
      { name: 'Ghost Mint', hex: '#CFFFE3' },
      { name: 'Concrete Dust', hex: '#9E9E9E' }
    ],
    keyTips: [
      'Letters need structure before style. Master the basics first.',
      'Spacing is king. Too tight looks cramped, too loose looks weak.',
      'Flow comes from consistent angles. Keep your letters moving together.',
      'Thickness variation adds weight. Thick downstrokes, thin connections.',
      'Study the greats. Every letter has history and rules.'
    ],
    ethicsNote: 'Discipline in letters, discipline in life. Build your name with respect, not ego.'
  },
  {
    id: 'maim-color-violence',
    artist: 'MAIM',
    crew: 'LPFTS',
    lessonTitle: 'Color Violence',
    pieceName: 'Electric Dreams',
    location: 'Miami Skatepark',
    timeSpent: '5 hours',
    sprayCanBreakdown: {
      outline: 2,
      fill: 4,
      background: 3,
      highlights: 2,
      effects: 2
    },
    colors: [
      { name: 'Toxic Purple', hex: '#A800FF' },
      { name: 'Searing Magenta', hex: '#FF277D' },
      { name: 'Razor Blue', hex: '#3D7AFF' },
      { name: 'Radiation Yellow', hex: '#FDED00' },
      { name: 'Hot Ember Orange', hex: '#FF5C12' },
      { name: 'Vapor Pink', hex: '#FFA3DE' }
    ],
    keyTips: [
      'Contrast creates impact. Light on dark, bright on muted.',
      'Layering builds depth. Base color first, then highlights.',
      'Fades need patience. Work wet-on-wet for smooth transitions.',
      'Complementary colors pop. Purple and yellow, blue and orange.',
      'Don\'t be afraid of bold. Safe colors make safe pieces.'
    ],
    ethicsNote: 'Colors with a reason behind them. Every choice should serve the piece, not your ego.'
  }
];

export function getMasterclassById(id) {
  return MASTERCLASSES.find(mc => mc.id === id);
}

export function getAllMasterclasses() {
  return MASTERCLASSES;
}

