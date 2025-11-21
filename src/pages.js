// LPFTS Codex Pages - Page content management system

import { MASTERCLASSES, getMasterclassById } from './masterclasses.js';
import { getFeaturedWalls } from './legal-walls.js';
import { STORE_URLS, BRAND } from './store-integration.js';

// Page definitions
export const PAGES = [
  {
    pageIndex: -1,
    type: 'cover',
    title: 'LEGACY CODEX',
    subtitle: 'Masterclasses from Real Writers',
    content: {
      title: 'LPFTS LEGACY CODEX',
      subtitle: 'Three Masterclasses Inside',
      artists: ['BAEK', 'LURK', 'MAIM'],
      instruction: 'Swipe to explore',
      branding: BRAND.tagline
    }
  },
  {
    pageIndex: 0,
    type: 'masterclass',
    title: 'BAEK - Pressure & Control',
    masterclassId: 'baek-pressure-control',
    graffitiImage: '/assets/graffiti/baeks_1.jpg',
    location: 'Southport Legal Wall',
    ctaUrl: STORE_URLS.shopIronlak,
    ctaText: 'Shop These Colors'
  },
  {
    pageIndex: 1,
    type: 'masterclass',
    title: 'LURK - Letter Discipline',
    masterclassId: 'lurk-letter-discipline',
    graffitiImage: '/assets/graffiti/iduno_1.jpg',
    location: 'Southport Legal Wall',
    ctaUrl: STORE_URLS.shopIronlak,
    ctaText: 'Shop These Colors'
  },
  {
    pageIndex: 2,
    type: 'masterclass',
    title: 'MAIM - Color Violence',
    masterclassId: 'maim-color-violence',
    graffitiImage: '/assets/graffiti/maim_1.jpg',
    location: 'Miami Skatepark',
    ctaUrl: STORE_URLS.shopIronlak,
    ctaText: 'Shop These Colors'
  },
  {
    pageIndex: 3,
    type: 'back-cover',
    title: 'Legal Walls & More',
    content: {
      title: 'Spots You Can Paint',
      subtitle: 'Legal walls near Southport',
      walls: getFeaturedWalls(),
      cta: 'Discover more at lpfts.com',
      qrHint: 'Scan to visit',
      branding: BRAND.tagline
    }
  }
];

// Get page by index
export function getPage(pageIndex) {
  return PAGES.find(p => p.pageIndex === pageIndex);
}

// Get masterclass page data
export function getMasterclassPageData(pageIndex) {
  const page = getPage(pageIndex);
  if (!page || page.type !== 'masterclass') return null;
  
  const masterclass = getMasterclassById(page.masterclassId);
  if (!masterclass) return null;
  
  return {
    ...page,
    masterclass,
    colors: masterclass.colors,
    sprayCanBreakdown: masterclass.sprayCanBreakdown,
    totalCans: Object.values(masterclass.sprayCanBreakdown).reduce((a, b) => a + b, 0),
    keyTips: masterclass.keyTips.slice(0, 4), // Top 4 tips for page layout
    ethicsNote: masterclass.ethicsNote
  };
}

// Get all page indices
export function getAllPageIndices() {
  return PAGES.map(p => p.pageIndex);
}

// Get total number of pages
export function getTotalPages() {
  return PAGES.length;
}

// Check if page exists
export function pageExists(pageIndex) {
  return PAGES.some(p => p.pageIndex === pageIndex);
}

// Get next page index
export function getNextPageIndex(currentIndex) {
  const indices = getAllPageIndices();
  const currentPos = indices.indexOf(currentIndex);
  if (currentPos === -1 || currentPos >= indices.length - 1) return null;
  return indices[currentPos + 1];
}

// Get previous page index
export function getPreviousPageIndex(currentIndex) {
  const indices = getAllPageIndices();
  const currentPos = indices.indexOf(currentIndex);
  if (currentPos <= 0) return null;
  return indices[currentPos - 1];
}

// Get page type
export function getPageType(pageIndex) {
  const page = getPage(pageIndex);
  return page ? page.type : null;
}

