import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, ShoppingCart, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1600",
    outfit: "Designed For The Modern Gentleman",
    description: "Timeless essentials crafted for confidence, comfort, and sophistication. Experience quiet luxury through texture and clean drapes."
  },
  {
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600",
    outfit: "The Merino Knitwear Collection",
    description: "Explore unstructured knit blazers and fine-gauge sweaters sourced from organic wools, built for transitional climates."
  },
  {
    image: "https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=1600",
    outfit: "Summer Resort Flax Linens",
    description: "Effortless camp collars and pre-washed structural resort shirts designed to remain cool, crisp, and comfortable."
  }
];

// Unsplash premium men's quiet luxury fashion photo assets
const FASHION_ASSETS = {
  hero: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=1600",
  story: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",
  featuredCollection: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=1200",
  categories: {
    tshirts: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
    shirts: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&q=80&w=600",
    polos: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=600",
    jackets: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600",
    trousers: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600"
  },
  occasions: {
    office: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
    casual: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=600",
    date: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600"
  },
  products: [
    { id: 1, name: 'Merino Wool Knit Blazer', price: 289, rating: 5, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=500', slug: 'merino-wool-knit-blazer' },
    { id: 2, name: 'Pima Cotton Oversized Tee', price: 65, rating: 4.8, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500', slug: 'pima-cotton-oversized-tee' },
    { id: 3, name: 'Italian Linen Resort Shirt', price: 120, rating: 4.9, image: 'https://images.unsplash.com/photo-1620012253295-c05518e99309?auto=format&fit=crop&q=80&w=500', slug: 'italian-linen-resort-shirt' },
    { id: 4, name: 'Pleated Tailored Trouser', price: 175, rating: 5, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=500', slug: 'pleated-tailored-trouser' }
  ]
};

const Home = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products] = useState(() => {
    const local = localStorage.getItem('montclair_products');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const hasOldTrouserJacket = parsed.some(p => p.slug === 'minimalist-waterproof-shell-jacket' && p.images && p.images[0].includes('photo-1548883354-7622d03aca27'));
        if (hasOldTrouserJacket) {
          localStorage.setItem('montclair_products', JSON.stringify(PRODUCTS));
          return PRODUCTS;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return PRODUCTS;
  });
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full">
      
      {/* SECTION 1 — HERO SECTION */}
      <section className="relative h-[85vh] w-full bg-brand-black overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-brand-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="max-w-xl"
            >
              <span className="text-brand-gold text-xs uppercase tracking-[0.3em] font-medium block mb-4">
                Autumn Winter Collection
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase font-display leading-[1.05] mb-6">
                {HERO_SLIDES[currentSlide].outfit.split(' ').slice(0, -2).join(' ')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-white via-brand-beige to-brand-gold">
                  {HERO_SLIDES[currentSlide].outfit.split(' ').slice(-2).join(' ')}
                </span>
              </h1>
              <p className="text-sm sm:text-base text-brand-lightgrey mb-8 font-sans font-light leading-relaxed h-[60px] md:h-auto">
                {HERO_SLIDES[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/shop" className="bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest px-8 py-4 text-center hover:bg-brand-beige transition-luxury">
                  Shop Collection
                </Link>
                <Link to="/shop?sort=best-sellers" className="border border-brand-white/40 text-brand-white text-xs font-bold uppercase tracking-widest px-8 py-4 text-center hover:bg-brand-white/10 transition-luxury">
                  Explore Best Sellers
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 3 — NEW ARRIVALS CAROUSEL */}
      <section className="py-20 bg-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-baseline mb-12">
            <div>
              <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Latest Drops</span>
              <h2 className="text-2xl sm:text-4xl font-bold uppercase tracking-wider font-display mt-2 text-brand-black">New Arrivals</h2>
            </div>
            <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-brand-black flex items-center hover:text-brand-gold transition-luxury">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const imageSrc = product.images && product.images.length > 0 ? product.images[0] : product.image;
              return (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col relative"
                >
                  {/* Product Image Panel */}
                  <div className="relative overflow-hidden aspect-[3/4] bg-brand-lightgrey/30 border border-brand-lightgrey/10 group">
                    {/* Primary Image */}
                    <img 
                      src={imageSrc} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-all duration-700 ${product.images && product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'}`}
                    />
                    
                    {/* Secondary Hover Image */}
                    {product.images && product.images.length > 1 && (
                      <img 
                        src={product.images[1]} 
                        alt={`${product.name} alternate`} 
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-105" 
                      />
                    )}
                    <div className="absolute inset-0 bg-brand-black/10 opacity-0 group-hover:opacity-100 transition-luxury" />
                    
                    {/* Quick Actions overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex space-x-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => onAddToCart({ ...product, size: product.sizes?.[0] || 'M', color: product.colors?.[0]?.name || 'Default', image: imageSrc })}
                        className="flex-1 bg-brand-black text-brand-white text-[10px] font-bold uppercase tracking-wider py-3 flex items-center justify-center space-x-1.5 hover:bg-brand-beige hover:text-brand-black transition-luxury"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Quick Add</span>
                      </button>
                      <Link 
                        to={`/product/${product.slug}`}
                        className="bg-brand-white text-brand-black p-3 hover:bg-brand-gold hover:text-brand-white transition-luxury"
                        aria-label="View Product Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Meta */}
                  <div className="mt-4 flex flex-col">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-brand-black/90 font-display">
                      <Link to={`/product/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-brand-black/80 font-sans">${product.price}</span>
                      <div className="flex items-center text-brand-gold text-[10px]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 font-semibold">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — BRAND STORY */}
      <section className="py-20 bg-brand-black text-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative overflow-hidden aspect-[4/3] md:aspect-square">
              <img 
                src={FASHION_ASSETS.story} 
                alt="Montclair Atelier Craftsmanship" 
                className="w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 border border-brand-beige/20 m-4 pointer-events-none" />
            </div>
            
            <div className="flex flex-col justify-center space-y-6 md:pl-8">
              <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Our Philosophy</span>
              <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider font-display leading-[1.1]">
                Atelier Craftsmanship & Meticulous Fit
              </h2>
              <p className="text-xs text-brand-midgrey leading-relaxed font-sans font-light">
                Montclair was born out of a desire to create tailoring that speaks without words. We believe a garment's luxury lies in the micro-details: the stitch alignment, the weight of the weave, and the subtle roll of a lapel.
              </p>
              <p className="text-xs text-brand-midgrey leading-relaxed font-sans font-light">
                Sourcing raw fabrics globally, each capsule drop is produced in limited amounts to prevent environmental waste and maintain absolute luxury exclusivity.
              </p>
              <Link to="/about" className="text-xs font-bold uppercase tracking-widest text-brand-beige flex items-center hover:text-brand-gold transition-luxury w-max mt-4">
                Discover The Story <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — SHOP BY CATEGORY */}
      <section className="py-20 bg-brand-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Structured Choices</span>
            <h2 className="text-3xl font-bold uppercase tracking-wider font-display mt-2 text-brand-black">Shop By Category</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {Object.entries(FASHION_ASSETS.categories).map(([key, value]) => (
              <Link to={`/shop?category=${key}`} key={key} className="group relative aspect-[3/4] overflow-hidden bg-brand-lightgrey/30 border border-brand-lightgrey/10">
                <img 
                  src={value} 
                  alt={key} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-black/40 group-hover:bg-brand-black/30 transition-luxury" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs uppercase font-bold tracking-[0.2em] text-brand-white border-b border-brand-white/40 pb-1 group-hover:border-brand-gold group-hover:text-brand-gold transition-luxury">
                    {key}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — SHOP BY OCCASION */}
      <section className="py-20 bg-brand-white border-t border-brand-lightgrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Wardrobe Curation</span>
            <h2 className="text-3xl font-bold uppercase tracking-wider font-display mt-2 text-brand-black">Shop By Occasion</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/shop?occasion=office" className="group relative aspect-[16/10] overflow-hidden bg-brand-lightgrey/30">
              <img src={FASHION_ASSETS.occasions.office} alt="Office Tailoring" className="w-full h-full object-cover grayscale transition-all duration-750 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-brand-black/35 group-hover:bg-brand-black/20 transition-luxury" />
              <div className="absolute bottom-6 left-6 text-brand-white">
                <h3 className="text-base uppercase tracking-widest font-bold">Office Tailoring</h3>
                <span className="text-[10px] text-brand-beige uppercase tracking-wider mt-1 block group-hover:translate-x-2 transition-luxury">Explore Collection →</span>
              </div>
            </Link>

            <Link to="/shop?occasion=casual" className="group relative aspect-[16/10] overflow-hidden bg-brand-lightgrey/30">
              <img src={FASHION_ASSETS.occasions.casual} alt="Weekend Relaxed" className="w-full h-full object-cover grayscale transition-all duration-750 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-brand-black/35 group-hover:bg-brand-black/20 transition-luxury" />
              <div className="absolute bottom-6 left-6 text-brand-white">
                <h3 className="text-base uppercase tracking-widest font-bold">Weekend Relaxed</h3>
                <span className="text-[10px] text-brand-beige uppercase tracking-wider mt-1 block group-hover:translate-x-2 transition-luxury">Explore Collection →</span>
              </div>
            </Link>

            <Link to="/shop?occasion=date-night" className="group relative aspect-[16/10] overflow-hidden bg-brand-lightgrey/30">
              <img src={FASHION_ASSETS.occasions.date} alt="Date Night Edit" className="w-full h-full object-cover grayscale transition-all duration-750 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-brand-black/35 group-hover:bg-brand-black/20 transition-luxury" />
              <div className="absolute bottom-6 left-6 text-brand-white">
                <h3 className="text-base uppercase tracking-widest font-bold">Date Night Edit</h3>
                <span className="text-[10px] text-brand-beige uppercase tracking-wider mt-1 block group-hover:translate-x-2 transition-luxury">Explore Collection →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FEATURED COLLECTION (EDITORIAL EDIT) */}
      <section className="py-20 bg-brand-black text-brand-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-[4/3] bg-brand-darkgrey">
              <img 
                src={FASHION_ASSETS.featuredCollection} 
                alt="Montclair Premium Trench Suit" 
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-85" />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Editorial Curation</span>
              <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display leading-tight">
                The Heritage Trench Suit Set
              </h2>
              <p className="text-xs text-brand-midgrey leading-relaxed font-sans font-light">
                Discover the centerpiece of our Autumn/Winter drop. Combining a water-repellent structured outer trench drape with tailored smart-wool pleat trousers, styled for the discerning modern lifestyle leader.
              </p>
              <div className="border-t border-brand-darkgrey pt-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-brand-midgrey uppercase tracking-widest block">Complete Look Bundle</span>
                  <span className="text-lg font-bold text-brand-gold">$425 <span className="text-xs text-brand-midgrey line-through font-light">$584</span></span>
                </div>
                <Link to="/product/merino-wool-knit-blazer" className="bg-brand-beige text-brand-black text-xs font-bold uppercase tracking-widest px-6 py-3.5 hover:bg-brand-white transition-luxury">
                  Add Bundle to Cart
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9 — CUSTOMER TESTIMONIALS */}
      <section className="py-20 bg-brand-white border-b border-brand-lightgrey/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Reviews</span>
            <h2 className="text-3xl font-bold uppercase tracking-wider font-display mt-2 text-brand-black">The Gentlemen's Verdict</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { author: "Mark R., Entrepreneur", text: "The fit of the knit blazer is incredible. It matches the quality of $1000 heritage designer suits. Customer support sizing recommendation was spot on." },
              { author: "James S., Architect", text: "Incredible attention to fabric weights. The t-shirts drape exactly the way they should—sharp, structured, and minimal. Buying more immediately." },
              { author: "Alex V., Creative Director", text: "Montclair has nailed modern minimalist luxury. Order arrived in matte black textured packaging with personalized thank you envelope. Class apart." }
            ].map((review, i) => (
              <div key={i} className="border border-brand-lightgrey/30 p-8 flex flex-col justify-between aspect-square md:aspect-auto">
                <div className="space-y-4">
                  <div className="flex text-brand-gold">
                    {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-xs text-brand-black/70 italic leading-relaxed font-sans font-light">
                    "{review.text}"
                  </p>
                </div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-brand-black mt-6">
                  {review.author}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — CREATE ACCOUNT ADVANTAGES */}
      <section className="py-20 bg-brand-black text-brand-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-brand-gold text-xs uppercase tracking-widest font-semibold">Privilege Club</span>
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider font-display">
            Join The Montclair Society
          </h2>
          <p className="text-xs text-brand-midgrey max-w-xl mx-auto leading-relaxed">
            Create an account to unlock faster checkouts, track current shipments, view your wishlist from any device, and receive automatic invitations to limited pre-sale private collections.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-2xl mx-auto pt-6 text-[10px] tracking-wider uppercase text-brand-beige font-semibold">
            <div className="border-l border-brand-gold/30 pl-4 py-2">✓ Early Drop Access</div>
            <div className="border-l border-brand-gold/30 pl-4 py-2">✓ Free Express Ship</div>
            <div className="border-l border-brand-gold/30 pl-4 py-2">✓ Gift Wrapping</div>
            <div className="border-l border-brand-gold/30 pl-4 py-2">✓ Loyalty Multipliers</div>
          </div>

          <div className="pt-6">
            <Link to="/account?mode=register" className="bg-brand-white text-brand-black text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-brand-beige transition-luxury">
              CREATE EXECUTIVE ACCOUNT
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
