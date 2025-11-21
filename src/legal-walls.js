// LPFTS Legal Walls - Curated Southport-area locations near Butter Beats

export const LEGAL_WALLS = [
  {
    id: 'southport-carey-park',
    name: 'Southport Legal Wall',
    location: 'Carey Park, Southport',
    suburb: 'Southport',
    distanceFromButterBeats: '2km',
    coordinates: { lat: -27.9712, lng: 153.4015 },
    address: 'Carey Park, Nerang St, Southport QLD 4215',
    surface: 'Concrete block',
    condition: 'Good - regularly maintained',
    lighting: 'Natural daylight only',
    bestTimes: 'Dawn to dusk, weekday mornings quieter',
    hours: 'Dawn to dusk',
    accessibility: 'Easy - street parking available',
    etiquette: 'Respect the rotation. Don\'t go over fresh work. Clean up your caps. Leave it better than you found it.',
    notes: 'Popular spot with active writer community. Check current pieces before starting.',
    featured: true,
    mapsLink: 'https://maps.google.com/?q=Carey+Park+Southport'
  },
  {
    id: 'southport-cbd-alley',
    name: 'Southport CBD Alley Walls',
    location: 'Scarborough St Alley',
    suburb: 'Southport CBD',
    distanceFromButterBeats: '0.5km (walking distance)',
    coordinates: { lat: -27.9706, lng: 153.4089 },
    address: 'Behind Scarborough St, Southport QLD 4215',
    surface: 'Brick and rendered walls',
    condition: 'Variable - check with local council',
    lighting: 'Some street lighting after dark',
    bestTimes: 'Early morning or late afternoon',
    hours: '24/7 but respect noise curfews',
    accessibility: 'Easy - in CBD area',
    etiquette: 'Keep it legal. Ask permission from building owners when possible. No tags on private property without consent.',
    notes: 'Urban setting near stores and cafes. Good for smaller pieces and practice.',
    featured: true,
    mapsLink: 'https://maps.google.com/?q=Scarborough+St+Southport'
  },
  {
    id: 'nerang-underpass',
    name: 'Nerang Underpass',
    location: 'Ferry Road Underpass',
    suburb: 'Nerang',
    distanceFromButterBeats: '8km south',
    coordinates: { lat: -28.0032, lng: 153.3337 },
    address: 'Ferry Road underpass, Nerang QLD 4211',
    surface: 'Concrete tunnel walls',
    condition: 'Good - covered from weather',
    lighting: 'Well-lit 24/7',
    bestTimes: 'Night sessions possible due to lighting',
    hours: '24/7 (watch for traffic)',
    accessibility: 'Easy - off main road',
    etiquette: 'Watch for traffic. Covered spot means work lasts longer - respect that. No buffing other pieces.',
    notes: 'Popular night spot. Good acoustics for practice. Covered from rain.',
    featured: false,
    mapsLink: 'https://maps.google.com/?q=Ferry+Road+Nerang'
  },
  {
    id: 'gold-coast-highway-underpass',
    name: 'Gold Coast Highway Underpass',
    location: 'Highway underpass near Southport',
    suburb: 'Southport',
    distanceFromButterBeats: '3km',
    coordinates: { lat: -27.9689, lng: 153.4134 },
    address: 'Gold Coast Highway underpass, Southport QLD 4215',
    surface: 'Concrete pillars and walls',
    condition: 'High traffic visibility',
    lighting: 'Well-lit, high visibility',
    bestTimes: 'Early morning (6-9am) or late night',
    hours: '24/7 (traffic dependent)',
    accessibility: 'Moderate - need to be mindful of traffic',
    etiquette: 'Safety first. High visibility means quality matters. No toys or throwies - burners only.',
    notes: 'High exposure spot. Your work will be seen by thousands daily. Bring your A-game.',
    featured: true,
    mapsLink: 'https://maps.google.com/?q=Gold+Coast+Highway+Southport'
  },
  {
    id: 'miami-skatepark',
    name: 'Miami Skatepark Wall',
    location: 'Miami Skatepark',
    suburb: 'Miami',
    distanceFromButterBeats: '12km north',
    coordinates: { lat: -28.0587, lng: 153.4353 },
    address: 'Miami Skatepark, Miami QLD 4220',
    surface: 'Smooth concrete',
    condition: 'Excellent - skate park maintained',
    lighting: 'Natural daylight',
    bestTimes: 'Park hours - morning sessions best',
    hours: 'Daylight hours',
    accessibility: 'Easy - parking available',
    etiquette: 'Skatepark rules apply. Don\'t block the flow. Respect the skaters. No painting during busy sessions.',
    notes: 'Active skate community. Pieces visible to riders. Great practice spot.',
    featured: false,
    mapsLink: 'https://maps.google.com/?q=Miami+Skatepark'
  },
  {
    id: 'palm-beach-drain',
    name: 'Palm Beach Drain',
    location: 'Drain wall near Palm Beach',
    suburb: 'Palm Beach',
    distanceFromButterBeats: '15km north',
    coordinates: { lat: -28.1137, lng: 153.4689 },
    address: 'Palm Beach area, Gold Coast QLD 4221',
    surface: 'Concrete drain wall',
    condition: 'Hidden spot - good condition',
    lighting: 'Natural daylight only',
    bestTimes: 'Daylight hours, low tide',
    hours: 'Daylight only',
    accessibility: 'Moderate - local knowledge helps',
    etiquette: 'Hidden gem. Keep it clean. Don\'t bring heat to the spot. Share location responsibly.',
    notes: 'Locals\' spot. Ask around or go with someone who knows. Respect the vibe.',
    featured: false,
    mapsLink: 'https://maps.google.com/?q=Palm+Beach+Gold+Coast'
  }
];

// Filter walls by distance or featured status
export function getFeaturedWalls() {
  return LEGAL_WALLS.filter(wall => wall.featured);
}

export function getWallsByDistance(maxDistance = 10) {
  return LEGAL_WALLS.filter(wall => {
    const distance = parseFloat(wall.distanceFromButterBeats);
    return distance <= maxDistance;
  });
}

export function getWallById(id) {
  return LEGAL_WALLS.find(wall => wall.id === id);
}

export function getAllWalls() {
  return LEGAL_WALLS;
}

