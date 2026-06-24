const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Helper to hash password
const getHashedPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const mockUsers = [
  {
    _id: 'mock_user_admin_id',
    firstName: 'Atelier',
    lastName: 'Admin',
    email: 'admin@montclair.com',
    password: getHashedPassword('admin123'),
    role: 'admin',
    loyaltyTier: 'elite',
    loyaltyPoints: 1000,
    referralCode: 'ADMINREF'
  },
  {
    _id: 'mock_user_regular_id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: getHashedPassword('password123'),
    role: 'user',
    loyaltyTier: 'member',
    loyaltyPoints: 150,
    referralCode: 'JOHNDOE'
  }
];

const mockOrders = [];

const mockProducts = [
  {
    _id: '660000000000000000000001',
    name: 'Merino Wool Knit Blazer',
    slug: 'merino-wool-knit-blazer',
    description: 'A contemporary take on classical tailoring. The unstructured silhouette drapes effortlessly on the shoulders, while the fine merino wool knit provides dynamic movement and comfort in creative office or evening settings.',
    shortDescription: 'Unstructured quiet luxury blazer crafted from 100% fine Italian merino wool.',
    price: 289,
    compareAtPrice: 380,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600&v=2',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600&v=3'
    ],
    category: 'blazers',
    subCategory: 'outerwear',
    collectionTag: 'Winter Drop',
    skus: [
      { size: 'S', color: 'Matte Black', colorHex: '#0A0A0A', stock: 15, sku: 'MONT-BLZ-BLK-S' },
      { size: 'M', color: 'Matte Black', colorHex: '#0A0A0A', stock: 20, sku: 'MONT-BLZ-BLK-M' },
      { size: 'L', color: 'Matte Black', colorHex: '#0A0A0A', stock: 10, sku: 'MONT-BLZ-BLK-L' },
      { size: 'XL', color: 'Matte Black', colorHex: '#0A0A0A', stock: 8, sku: 'MONT-BLZ-BLK-XL' }
    ],
    tags: ['blazer', 'wool', 'merino', 'outerwear', 'tailoring'],
    fabricDetails: '100% fine Italian merino wool weave. Extremely soft, temperature regulating, and crease resistant.',
    careInstructions: 'Dry clean only. Store on wide wooden hanger to maintain shoulder shape.',
    isFeatured: true,
    rating: 5,
    reviewCount: 28,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000002',
    name: 'Pima Cotton Oversized Tee',
    slug: 'pima-cotton-oversized-tee',
    description: 'A structural oversized tee crafted from long-staple Peruvian Pima cotton. Design details include a high collar rib and drop shoulder sleeve for a clean structural silhouette.',
    shortDescription: 'Heavyweight structural t-shirt in Pima cotton.',
    price: 65,
    compareAtPrice: 85,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 't-shirts',
    subCategory: 'tops',
    collectionTag: 'Summer Classic',
    skus: [
      { size: 'S', color: 'Warm Beige', colorHex: '#D6C5A4', stock: 35, sku: 'MONT-TEE-BEG-S' },
      { size: 'M', color: 'Warm Beige', colorHex: '#D6C5A4', stock: 50, sku: 'MONT-TEE-BEG-M' },
      { size: 'L', color: 'Warm Beige', colorHex: '#D6C5A4', stock: 40, sku: 'MONT-TEE-BEG-L' }
    ],
    tags: ['t-shirt', 'pima', 'cotton', 'oversized', 'basics'],
    fabricDetails: '100% long-staple Peruvian Pima cotton. Heavyweight 240 GSM knit.',
    careInstructions: 'Machine wash cold inside out. Hang dry to preserve knit structure.',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000003',
    name: 'Italian Linen Resort Shirt',
    slug: 'italian-linen-resort-shirt',
    description: 'An airy, relaxed holiday shirt constructed in premium Italian flax linen. Finished with a clean camp collar and elegant pearl-sheen buttons.',
    shortDescription: 'Relaxed resort collar shirt in premium Italian flax linen.',
    price: 120,
    compareAtPrice: 150,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'shirts',
    subCategory: 'tops',
    collectionTag: 'Summer Classic',
    skus: [
      { size: 'S', color: 'Off White', colorHex: '#FFFFFF', stock: 25, sku: 'MONT-SHR-WHT-S' },
      { size: 'M', color: 'Off White', colorHex: '#FFFFFF', stock: 30, sku: 'MONT-SHR-WHT-M' },
      { size: 'L', color: 'Off White', colorHex: '#FFFFFF', stock: 25, sku: 'MONT-SHR-WHT-L' },
      { size: 'XL', color: 'Off White', colorHex: '#FFFFFF', stock: 15, sku: 'MONT-SHR-WHT-XL' }
    ],
    tags: ['shirt', 'linen', 'resort', 'summer', 'breathable'],
    fabricDetails: '100% premium Italian flax linen. Lightweight and pre-washed for texture softness.',
    careInstructions: 'Machine wash delicate, hang dry. Iron warm while damp or wear crumpled for a classic linen drape.',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 34,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000004',
    name: 'Pleated Tailored Trouser',
    slug: 'pleated-tailored-trouser',
    description: 'A sharp pleated trouser styled for versatile drapes. Designed with double front reverse pleats, a button tab tab closure, and side-adjusters for waist adjustment.',
    shortDescription: 'Double pleated trousers with side-adjusters.',
    price: 175,
    compareAtPrice: 220,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'trousers',
    subCategory: 'bottoms',
    collectionTag: 'Winter Drop',
    skus: [
      { size: 'M', color: 'Matte Black', colorHex: '#0A0A0A', stock: 20, sku: 'MONT-TRS-BLK-M' },
      { size: 'L', color: 'Matte Black', colorHex: '#0A0A0A', stock: 25, sku: 'MONT-TRS-BLK-L' },
      { size: 'XL', color: 'Matte Black', colorHex: '#0A0A0A', stock: 15, sku: 'MONT-TRS-BLK-XL' }
    ],
    tags: ['trouser', 'pleats', 'tailoring', 'bottoms', 'trousers'],
    fabricDetails: '80% cold wool, 20% polyester blend. Drapes crisp with a sharp leg crease.',
    careInstructions: 'Dry clean recommended. Cool iron under press cloth.',
    isFeatured: false,
    rating: 5,
    reviewCount: 19,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000005',
    name: 'Premium Heavyweight Hoodie',
    slug: 'premium-heavyweight-hoodie',
    description: 'A structural, ultra-heavyweight hoodie designed with a double-lined hood and no drawstrings for a clean, modern aesthetic. Drop shoulders and tight ribbed cuffs create a relaxed yet polished silhouette.',
    shortDescription: '450 GSM organic cotton loopback hoodie.',
    price: 140,
    compareAtPrice: 180,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'hoodies',
    subCategory: 'tops',
    collectionTag: 'Autumn Essentials',
    skus: [
      { size: 'S', color: 'Matte Black', colorHex: '#0A0A0A', stock: 20, sku: 'MONT-HD-BLK-S' },
      { size: 'M', color: 'Matte Black', colorHex: '#0A0A0A', stock: 25, sku: 'MONT-HD-BLK-M' },
      { size: 'L', color: 'Matte Black', colorHex: '#0A0A0A', stock: 15, sku: 'MONT-HD-BLK-L' }
    ],
    tags: ['hoodie', 'organic', 'cotton', 'heavyweight', 'casual'],
    fabricDetails: '100% organic cotton loopback. Extra heavy 450 GSM weight.',
    careInstructions: 'Wash cold, dry flat. Do not tumble dry to maintain loopback structure.',
    isFeatured: false,
    rating: 4.7,
    reviewCount: 28,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000006',
    name: 'Signature Classic Polo',
    slug: 'signature-classic-polo',
    description: 'A refined knit polo shirt constructed with a collar stand for structural stability. Made from mercerized cotton for a subtle luster and silky hand feel, finished with an elegant mother-of-pearl button placket.',
    shortDescription: 'Mercerized cotton knit polo with collar stand.',
    price: 85,
    compareAtPrice: 115,
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'polos',
    subCategory: 'tops',
    collectionTag: 'Summer Classic',
    skus: [
      { size: 'M', color: 'Off White', colorHex: '#FFFFFF', stock: 30, sku: 'MONT-PLO-WHT-M' },
      { size: 'L', color: 'Off White', colorHex: '#FFFFFF', stock: 25, sku: 'MONT-PLO-WHT-L' },
      { size: 'XL', color: 'Off White', colorHex: '#FFFFFF', stock: 15, sku: 'MONT-PLO-WHT-XL' }
    ],
    tags: ['polo', 'knit', 'mercerized', 'cotton', 'classic'],
    fabricDetails: '100% mercerized long-staple cotton knit. Breathable, silk-like finish.',
    careInstructions: 'Gentle cycle cold. Reshape and dry flat. Low iron.',
    isFeatured: false,
    rating: 4.8,
    reviewCount: 31,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000007',
    name: 'Atelier Suede Bomber Jacket',
    slug: 'atelier-suede-bomber-jacket',
    description: 'A clean-cut bomber jacket in premium split-calf suede leather. Featuring a warm satin lining, custom-molded steel zippers, and elasticized ribbed cuffs. Designed to fit slightly relaxed through the chest and shoulders for comfortable layering over knits.',
    shortDescription: 'Tailored split-calf suede bomber jacket.',
    price: 345,
    compareAtPrice: 420,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600&v=2',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600&v=3'
    ],
    category: 'jackets',
    subCategory: 'outerwear',
    collectionTag: 'Winter Drop',
    skus: [
      { size: 'S', color: 'Espresso Brown', colorHex: '#3D2314', stock: 8, sku: 'MONT-JKT-BRN-S' },
      { size: 'M', color: 'Espresso Brown', colorHex: '#3D2314', stock: 12, sku: 'MONT-JKT-BRN-M' },
      { size: 'L', color: 'Espresso Brown', colorHex: '#3D2314', stock: 15, sku: 'MONT-JKT-BRN-L' },
      { size: 'XL', color: 'Espresso Brown', colorHex: '#3D2314', stock: 6, sku: 'MONT-JKT-BRN-XL' }
    ],
    tags: ['jacket', 'outerwear', 'bomber', 'suede', 'leather'],
    fabricDetails: '100% genuine split-calf suede leather shell. 100% viscose lining.',
    careInstructions: 'Professional leather clean only.',
    isFeatured: true,
    rating: 4.9,
    reviewCount: 14,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000008',
    name: 'Sartorial Double-Breasted Overcoat',
    slug: 'sartorial-double-breasted-overcoat',
    description: 'An elegant long coat designed for formal tailoring and sophisticated street styling. Crafted from a heavyweight wool-cashmere blend with structured shoulders, peak lapels, and a double-breasted closure.',
    shortDescription: 'Tailored double-breasted overcoat in wool-cashmere blend.',
    price: 425,
    compareAtPrice: 550,
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'jackets',
    subCategory: 'outerwear',
    collectionTag: 'Winter Drop',
    skus: [
      { size: 'M', color: 'Charcoal Grey', colorHex: '#36454F', stock: 10, sku: 'MONT-OVC-CHR-M' },
      { size: 'L', color: 'Charcoal Grey', colorHex: '#36454F', stock: 14, sku: 'MONT-OVC-CHR-L' },
      { size: 'XL', color: 'Charcoal Grey', colorHex: '#36454F', stock: 8, sku: 'MONT-OVC-CHR-XL' }
    ],
    tags: ['jacket', 'outerwear', 'overcoat', 'wool', 'cashmere'],
    fabricDetails: '90% Wool, 10% Cashmere. Soft and insulating.',
    careInstructions: 'Dry clean only.',
    isFeatured: true,
    rating: 4.8,
    reviewCount: 22,
    createdAt: new Date()
  },
  {
    _id: '660000000000000000000009',
    name: 'Minimalist Waterproof Shell Jacket',
    slug: 'minimalist-waterproof-shell-jacket',
    description: 'A high-performance technical shell jacket designed with minimalist aesthetic codes. Features fully taped seams, YKK water-repellent zippers, an adjustable storm hood, and a breathable triple-layer membrane.',
    shortDescription: 'Technical waterproof three-layer shell jacket.',
    price: 195,
    compareAtPrice: 245,
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=600&v=2'
    ],
    category: 'jackets',
    subCategory: 'outerwear',
    collectionTag: 'Autumn Essentials',
    skus: [
      { size: 'S', color: 'Matte Black', colorHex: '#0A0A0A', stock: 15, sku: 'MONT-SHL-BLK-S' },
      { size: 'M', color: 'Matte Black', colorHex: '#0A0A0A', stock: 20, sku: 'MONT-SHL-BLK-M' },
      { size: 'L', color: 'Matte Black', colorHex: '#0A0A0A', stock: 25, sku: 'MONT-SHL-BLK-L' }
    ],
    tags: ['jacket', 'outerwear', 'technical', 'waterproof', 'minimalist'],
    fabricDetails: '100% recycled nylon shell, breathable polyurethane membrane.',
    careInstructions: 'Machine wash cold on gentle cycle. Liquid detergent only. Hang dry.',
    isFeatured: false,
    rating: 4.7,
    reviewCount: 19,
    createdAt: new Date()
  }
];

const isDBConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  isDBConnected,
  mockUsers,
  mockOrders,
  mockProducts
};
