// LPFTS Store Integration - lpfts.com CTAs and tracking

export const STORE_URLS = {
  homepage: 'https://lpfts.com',
  shop: 'https://lpfts.com/shop',
  shopIronlak: 'https://lpfts.com/shop/ironlak',
  shopCasino: 'https://lpfts.com/shop/casino',
  gallery: 'https://lpfts.com/gallery',
  missions: 'https://lpfts.com/missions',
  join: 'https://lpfts.com/join',
  legalWalls: 'https://lpfts.com/legal-walls',
  masterclasses: 'https://lpfts.com/masterclasses'
};

// Call-to-Action configurations
export const CTAS = {
  shopPaint: {
    text: 'Shop These Colors',
    url: STORE_URLS.shopIronlak,
    style: 'primary',
    icon: '🎨'
  },
  joinLPFTS: {
    text: 'Join LPFTS',
    url: STORE_URLS.join,
    style: 'primary',
    icon: '🔥'
  },
  viewGallery: {
    text: 'View Full Gallery',
    url: STORE_URLS.gallery,
    style: 'secondary',
    icon: '🖼️'
  },
  completeMissions: {
    text: 'Complete Missions',
    url: STORE_URLS.missions,
    style: 'secondary',
    icon: '🎯'
  },
  discoverMore: {
    text: 'Discover More',
    url: STORE_URLS.homepage,
    style: 'secondary',
    icon: '✨'
  },
  findWalls: {
    text: 'Find Legal Walls',
    url: STORE_URLS.legalWalls,
    style: 'secondary',
    icon: '📍'
  }
};

// Analytics tracking (placeholder for future implementation)
export function trackEvent(category, action, label, value) {
  // Analytics implementation would go here
  console.log('[Analytics]', { category, action, label, value });
  
  // Example: Google Analytics
  // if (window.gtag) {
  //   window.gtag('event', action, {
  //     event_category: category,
  //     event_label: label,
  //     value: value
  //   });
  // }
}

// Track page views
export function trackPageView(pageIndex, pageName) {
  trackEvent('Codex', 'PageView', pageName, pageIndex);
}

// Track CTA clicks
export function trackCTAClick(ctaName, url) {
  trackEvent('Codex', 'CTAClick', ctaName, url);
}

// Track legal wall views
export function trackLegalWallView(wallName) {
  trackEvent('Codex', 'LegalWallView', wallName, null);
}

// Track paint product interest
export function trackProductInterest(productName, productBrand) {
  trackEvent('Codex', 'ProductInterest', `${productBrand} - ${productName}`, null);
}

// Open external link with tracking
export function openStoreLink(url, ctaName) {
  trackCTAClick(ctaName, url);
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Brand configuration
export const BRAND = {
  name: 'LPFTS',
  tagline: 'Earn it. Play it. Own it.',
  colors: {
    neonGreen: '#05FF00',
    chrome: '#C2C2C2',
    black: '#000000',
    fire: '#FF4500',
    neonBlue: '#00E5FF'
  },
  fonts: {
    display: '"Impact", "Arial Black", sans-serif',
    body: '"Arial", "Helvetica", sans-serif',
    mono: '"Courier New", monospace'
  }
};

