// LPFTS Merch Drop Data

export const MERCH_ITEMS = [
  {
    id: 'tno-white-tee',
    name: 'TNO White Tee',
    description: 'Classic white tee with TNO design. Street-ready quality.',
    imageFront: '/assets/images/TNO-FRONT-WHITE-TEE.jpg',
    imageBack: '/assets/images/TNO-BACKSIDE-WHITE-TEE.jpg',
    tag: 'Season 1 Drop',
    ctaUrl: 'https://lpfts.com/shop/tno-white-tee'
  },
  {
    id: 'lpfts-tee-collection',
    name: 'LPFTS Tee Collection',
    description: 'Front and back designs. Multiple styles available.',
    imageFront: '/assets/images/TSHIRTS-FRONTNBACK.jpg',
    imageBack: null,
    tag: 'Season 1 Drop',
    ctaUrl: 'https://lpfts.com/shop/tee-collection'
  },
  {
    id: 'white-tee-pack',
    name: 'White Tee Pack',
    description: 'Premium white tees. Multiple designs in one pack.',
    imageFront: '/assets/images/WHITE-TSHIRTS.jpg',
    imageBack: null,
    tag: 'Season 1 Drop',
    ctaUrl: 'https://lpfts.com/shop/white-tee-pack'
  }
];

export function getAllMerchItems() {
  return MERCH_ITEMS;
}

export function getMerchItemById(id) {
  return MERCH_ITEMS.find(item => item.id === id);
}

